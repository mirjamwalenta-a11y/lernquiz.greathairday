// Meisterin-Bereich: „Einreichungen & Projekte“ (V1)
// Zwei Wettbewerbs-Einreichungen führen, Material sammeln und kritisch prüfen:
// Staatspreis und Mercur Innovationspreis. Bewusst schlank: kein
// Projektmanager, keine Aufgaben, keine Teamfunktionen, kein Score.
//
// Datenbank: supabase/20261122_einreichungen.sql (Tabellen einreichungen und
// einreichung_belege, privater Bucket einreichung-belege). Lesen und Schreiben
// darf nur die Meisterin – das erzwingen RLS und Storage-Regeln am Server
// (ist_meisterin()). Dieses Skript ist nur die Bedienung.
//
// Der Wettbewerbs-Check ist keine Jury-Simulation: Er zeigt die Leitfragen
// des Wettbewerbs und nüchterne Auffälligkeiten im Text (leer, sehr knapp,
// allgemeine Wörter, kein Beispiel, kein zugeordneter Beleg). Die Einschätzung
// „klar / teilweise klar / zu allgemein“ und die Hinweise schreibt die
// Meisterin selbst. Keine KI, nichts verlässt die eigene Datenbank.
//
// Reiter „2-Minuten-Pitch“ (supabase/20261128_einreichungen_pitch.sql, Spalte
// pitch): baut aus der eigenen Einreichung einen Pitch in vier Zeitabschnitten
// – als Sprechtext, Video-Drehbuch oder schriftliche Kurzfassung – mit
// Zeitmessung, Probe mit Stoppuhr und Hinweisen (z. B. Zahl ohne Beleg). Er
// erfindet nichts: Bausteine kommen nur aus Einreichung und Belegen, den Text
// schreibt die Meisterin.
//
// Braucht aus lernquiz.html: sb, ISTMEISTERIN, escHtml, zeige, ladeDashboard, MB_BEREICH.
(function () {
  var BUCKET = 'einreichung-belege';
  var MAX_PX = 1800;

  var WETTBEWERBE = {
    staatspreis: {
      name: 'Staatspreis',
      fragen: {
        ausgangslage: ['Welches konkrete Ausbildungsproblem oder welcher Bedarf war im Alltag da?',
                       'Woran wurde sichtbar, dass hier etwas fehlt oder besser gehen muss?'],
        loesung:      ['Was genau wurde eingeführt oder verändert?',
                       'Wie läuft das im Ausbildungsalltag konkret ab?'],
        wirkung:      ['Was lernen Lehrlinge dadurch besser, sicherer oder selbstständiger?',
                       'Welche Veränderung ist im Verhalten, Verständnis oder Arbeitsalltag erkennbar?'],
        belege:       ['Welche Beispiele, Beobachtungen, Aussagen, Screenshots oder Dokumentationen zeigen diese Wirkung?',
                       'Was macht sichtbar, dass das gelebte Praxis ist und nicht nur eine gute Idee?'],
        luecken:      ['Wo ist die Wirkung noch zu allgemein beschrieben?',
                       'Was ist noch nicht glaubwürdig genug belegt?',
                       'Was müsste geschärft werden, damit andere Betriebe den Ansatz verstehen und ernst nehmen?']
      }
    },
    mercur: {
      name: 'Mercur Innovationspreis',
      fragen: {
        ausgangslage: ['Welches konkrete betriebliche Problem oder welcher Engpass war da?',
                       'Warum war das relevant genug, um dafür eine neue Lösung zu entwickeln?'],
        loesung:      ['Was genau ist die Innovation?',
                       'Wie funktioniert die Lösung im Alltag konkret?'],
        wirkung:      ['Was verbessert sich dadurch im Betrieb?',
                       'Wo entsteht klar beobachtbarer Nutzen bei Struktur, Zeit, Qualität, Ausbildung oder Zusammenarbeit?'],
        belege:       ['Welche Anwendungsfälle, Screenshots, Rückmeldungen, Tests oder Praxisbeispiele zeigen, dass die Lösung funktioniert?',
                       'Was zeigt, dass das mehr ist als ein internes Bastelprojekt?'],
        luecken:      ['Wo ist der Innovationskern noch nicht klar genug?',
                       'Wo wird Nutzen behauptet, aber noch nicht gezeigt?',
                       'Was fehlt, damit die Relevanz auch für Außenstehende sofort verständlich wird?']
      }
    }
  };
  var ABSCHNITTE = [['ausgangslage', 'Ausgangslage'], ['loesung', 'Lösung'], ['wirkung', 'Wirkung'], ['belege', 'Belege'], ['luecken', 'Offene Lücken']];
  var ABSCHNITT_NAME = {ausgangslage: 'Ausgangslage', loesung: 'Lösung', wirkung: 'Wirkung', belege: 'Belege', luecken: 'Offene Lücken', allgemein: 'allgemein'};
  var ARTEN = [['beobachtung', 'Beobachtung'], ['aussage', 'Aussage / Rückmeldung'], ['beispiel', 'Praxisbeispiel / Anwendungsfall'],
               ['zahl', 'Zahl / Vorher–Nachher'], ['screenshot', 'Screenshot / Foto'], ['dokument', 'Dokumentation / Test']];
  var ART_NAME = {}; ARTEN.forEach(function (a) { ART_NAME[a[0]] = a[1]; });
  // Farben nur aus dem vorhandenen Meisterin-Bereich (grün / gold / rot / Rahmen)
  var STUFEN = [['klar', 'klar', '#5B8A4A'], ['teilweise', 'teilweise klar', '#C4A830'], ['allgemein', 'zu allgemein', '#C44030']];
  var STUFE = {}; STUFEN.forEach(function (s) { STUFE[s[0]] = s; });

  var ER = {liste: [], akt: null, belege: [], bilder: {}, tab: 'text', geaendert: false, beleg: null};

  function $(id) { return document.getElementById(id); }
  function esc(t) { return escHtml(t); }
  function heuteISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function datumDE(iso) { var p = String(iso || '').slice(0, 10).split('-'); return p.length === 3 ? (+p[2]) + '.' + (+p[1]) + '.' + p[0] : ''; }
  function tageBis(iso) {
    if (!iso) return null;
    var a = new Date(heuteISO() + 'T12:00:00'), b = new Date(String(iso).slice(0, 10) + 'T12:00:00');
    return Math.round((b - a) / 86400000);
  }
  function deadlineText(iso) {
    var t = tageBis(iso);
    if (t === null) return 'Deadline offen';
    if (t < 0) return 'Deadline ' + datumDE(iso) + ' (vorbei)';
    if (t === 0) return 'Deadline heute';
    return 'Deadline ' + datumDE(iso) + ' · noch ' + t + (t === 1 ? ' Tag' : ' Tage');
  }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function pruefung(e) {
    var p = e && e.pruefung && typeof e.pruefung === 'object' ? e.pruefung : {};
    if (!p.abschnitte || typeof p.abschnitte !== 'object') p.abschnitte = {};
    if (!Array.isArray(p.schwaechen)) p.schwaechen = [];
    ABSCHNITTE.forEach(function (a) { if (!p.abschnitte[a[0]]) p.abschnitte[a[0]] = {stufe: '', tragfaehig: '', unklar: '', unbelegt: ''}; });
    while (p.schwaechen.length < 3) p.schwaechen.push('');
    return p;
  }
  function fragenListe(fr) { return '<ul class="ber-meth" style="margin:0 0 8px">' + fr.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>'; }

  // ── Laden ─────────────────────────────────────────────────────────
  async function zeigeEinreichungen() {
    if (!ISTMEISTERIN) return;
    if (!$('s-einreichungen').classList.contains('aktiv')) zeige('s-einreichungen');
    ER.akt = null; ER.geaendert = false;
    var box = $('er-inhalt'); box.innerHTML = '<div class="laden">Wird geladen…</div>';
    var r;
    try { r = await sb.from('einreichungen').select('*').order('deadline', {ascending: true, nullsFirst: false}); } catch (e) { r = {error: e}; }
    if (r.error) { box.innerHTML = '<p class="mb-sub">Die Einreichungen brauchen noch die Datenbank-Änderung (supabase/20261122_einreichungen.sql im Supabase SQL-Editor ausführen).</p>'; return; }
    ER.liste = r.data || [];
    var zahl = {};
    try {
      var b = await sb.from('einreichung_belege').select('einreichung_id');
      (b.data || []).forEach(function (x) { zahl[x.einreichung_id] = (zahl[x.einreichung_id] || 0) + 1; });
    } catch (e) { /* nur die Anzahl */ }
    listeZeigen(zahl);
  }

  function listeZeigen(zahl) {
    var box = $('er-inhalt');
    var h = '';
    if (!ER.liste.length) h += '<p class="mb-sub">Noch keine Einreichung. Leg eine pro Vorhaben an – z. B. eine für den Staatspreis und eine für den Mercur Innovationspreis.</p>';
    ER.liste.forEach(function (e) {
      var p = pruefung(e), w = WETTBEWERBE[e.wettbewerb] || {name: e.wettbewerb};
      var eingeschaetzt = ABSCHNITTE.filter(function (a) { return p.abschnitte[a[0]].stufe; }).length;
      var allg = ABSCHNITTE.filter(function (a) { return p.abschnitte[a[0]].stufe === 'allgemein'; }).length;
      var t = tageBis(e.deadline);
      h += '<div class="tb-e' + (eingeschaetzt === 5 && !allg ? ' ok' : '') + '">' +
        '<div class="tb-k"><span><b>' + esc(w.name) + '</b></span><span' + (t !== null && t >= 0 && t <= 14 ? ' style="color:#C44030;font-weight:600"' : '') + '>' + esc(deadlineText(e.deadline)) + '</span></div>' +
        '<div class="tb-w">' + esc(e.titel) + '</div>' +
        (e.kernbotschaft ? '<div class="tb-d">' + esc(e.kernbotschaft) + '</div>' : '<div class="tb-d">Noch keine Kernbotschaft.</div>') +
        '<div class="tb-d" style="margin-top:4px">' + (zahl[e.id] || 0) + (zahl[e.id] === 1 ? ' Beleg' : ' Belege') + ' · Check: ' + eingeschaetzt + ' von 5 Abschnitten eingeschätzt' + (allg ? ', ' + allg + ' zu allgemein' : '') + '</div>' +
        '<div class="tb-knoepfe"><button class="tb-los" data-er-auf="' + esc(e.id) + '">Öffnen</button>' +
        '<button class="tb-edit" data-er-check="' + esc(e.id) + '">Wettbewerbs-Check</button>' +
        '<button class="tb-edit" data-er-pitch="' + esc(e.id) + '">2-Minuten-Pitch</button></div></div>';
    });
    h += '<button class="mb-neu" id="er-neu">+ Neue Einreichung</button><div id="er-neu-form" hidden></div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-er-auf]').forEach(function (b) { b.onclick = function () { oeffnen(b.dataset.erAuf, 'text'); }; });
    box.querySelectorAll('[data-er-check]').forEach(function (b) { b.onclick = function () { oeffnen(b.dataset.erCheck, 'check'); }; });
    box.querySelectorAll('[data-er-pitch]').forEach(function (b) { b.onclick = function () { oeffnen(b.dataset.erPitch, 'pitch'); }; });
    $('er-neu').onclick = neuForm;
  }

  function neuForm() {
    var f = $('er-neu-form'); f.hidden = false; $('er-neu').hidden = true;
    f.innerHTML = '<div class="paz-karte">' +
      '<label class="pte-l" for="er-n-titel">Titel</label><input id="er-n-titel" maxlength="160" placeholder="z. B. Great Hair Day Academy – Einreichung Staatspreis">' +
      '<label class="pte-l" for="er-n-wb">Wettbewerb</label><select id="er-n-wb">' +
        Object.keys(WETTBEWERBE).map(function (k) { return '<option value="' + k + '">' + esc(WETTBEWERBE[k].name) + '</option>'; }).join('') + '</select>' +
      '<label class="pte-l" for="er-n-dl">Deadline <span>(optional)</span></label><input type="date" id="er-n-dl">' +
      '<div id="er-n-fehler" class="pte-fehler"></div>' +
      '<button class="btn btn-g" id="er-n-ok" style="margin-top:10px">Anlegen</button><button class="mb-abm" id="er-n-abbr" style="width:100%">Abbrechen</button></div>';
    $('er-n-titel').focus();
    $('er-n-abbr').onclick = function () { f.hidden = true; f.innerHTML = ''; $('er-neu').hidden = false; };
    $('er-n-ok').onclick = async function () {
      var titel = $('er-n-titel').value.trim().slice(0, 160);
      if (!titel) { $('er-n-fehler').textContent = 'Bitte einen Titel eingeben.'; return; }
      this.disabled = true;
      var r = await sb.from('einreichungen').insert({titel: titel, wettbewerb: $('er-n-wb').value, deadline: $('er-n-dl').value || null}).select('*').single();
      if (r.error) { this.disabled = false; $('er-n-fehler').textContent = 'Konnte nicht angelegt werden: ' + r.error.message; return; }
      ER.liste.push(r.data);
      oeffnen(r.data.id, 'text');
    };
  }

  // ── Einreichung öffnen ────────────────────────────────────────────
  async function oeffnen(id, tab) {
    var e = ER.liste.filter(function (x) { return String(x.id) === String(id); })[0];
    if (!e) return;
    ER.akt = JSON.parse(JSON.stringify(e)); ER.akt.pruefung = pruefung(ER.akt); pitchNorm(ER.akt);
    ER.tab = tab || 'text'; ER.geaendert = false; ER.beleg = null;
    var box = $('er-inhalt'); box.innerHTML = '<div class="laden">Wird geladen…</div>';
    window.scrollTo(0, 0);
    await belegeLaden();
    detailZeigen();
  }

  async function belegeLaden() {
    var r = await sb.from('einreichung_belege').select('*').eq('einreichung_id', ER.akt.id).order('erstellt_am', {ascending: true});
    ER.belege = r.error ? [] : (r.data || []);
    ER.bilder = {};
    var pfade = ER.belege.filter(function (b) { return b.bild_pfad; }).map(function (b) { return b.bild_pfad; });
    if (pfade.length) {
      try {
        var s = await sb.storage.from(BUCKET).createSignedUrls(pfade, 3600);
        (s.data || []).forEach(function (x) { if (x.signedUrl) ER.bilder[x.path] = x.signedUrl; });
      } catch (err) { /* Bilder fehlen dann nur in der Anzeige */ }
    }
  }

  function detailZeigen() {
    var e = ER.akt, w = WETTBEWERBE[e.wettbewerb] || WETTBEWERBE.staatspreis;
    var h = '<button class="mb-zurueck" id="er-zur-liste">← Alle Einreichungen</button>' +
      '<div class="tb-k" style="margin-bottom:2px"><span><b>' + esc(w.name) + '</b></span><span>' + esc(deadlineText(e.deadline)) + '</span></div>' +
      '<div class="tb-w" style="font-size:17px;margin-bottom:10px">' + esc(e.titel) + '</div>' +
      '<div class="tb-filter" role="tablist">' +
        '<button data-er-tab="text" aria-pressed="' + (ER.tab === 'text') + '">Einreichung</button>' +
        '<button data-er-tab="check" aria-pressed="' + (ER.tab === 'check') + '">Wettbewerbs-Check</button>' +
        '<button data-er-tab="pitch" aria-pressed="' + (ER.tab === 'pitch') + '">2-Minuten-Pitch</button></div>' +
      '<div id="er-tab"></div>';
    $('er-inhalt').innerHTML = h;
    $('er-zur-liste').onclick = async function () { if (await verlassenOk()) zeigeEinreichungen(); };
    document.querySelectorAll('[data-er-tab]').forEach(function (b) {
      b.onclick = async function () {
        if (b.dataset.erTab === ER.tab) return;
        if (ER.geaendert && !(await speichern())) return;
        ER.tab = b.dataset.erTab; detailZeigen();
      };
    });
    if (ER.tab === 'check') checkZeigen(); else if (ER.tab === 'pitch') pitchZeigen(); else textZeigen();
  }

  // Ungespeicherte Änderungen: beim Verlassen speichern oder verwerfen
  async function verlassenOk() {
    if (!ER.akt || !ER.geaendert) return true;
    if (confirm('Änderungen speichern, bevor du weitergehst?\n\nOK = speichern · Abbrechen = verwerfen')) return await speichern();
    ER.geaendert = false; return true;
  }

  // ── Tab „Einreichung“: Kopfdaten, fünf Abschnitte ─────────────────
  function textFeld(key, name, fr, wert) {
    return '<div class="paz-karte"><div class="lab">' + esc(name) + '</div>' + fragenListe(fr) +
      '<textarea id="er-f-' + key + '" data-er-feld="' + key + '" rows="7" maxlength="8000">' + esc(wert) + '</textarea></div>';
  }
  function textZeigen() {
    var e = ER.akt, w = WETTBEWERBE[e.wettbewerb] || WETTBEWERBE.staatspreis;
    var h = '<div class="paz-karte"><div class="lab">Kopfdaten</div>' +
      '<label class="pte-l" for="er-f-titel">Titel</label><input id="er-f-titel" data-er-feld="titel" maxlength="160" value="' + esc(e.titel) + '" style="margin-bottom:0">' +
      '<label class="pte-l" for="er-f-wettbewerb">Wettbewerb</label><select id="er-f-wettbewerb" data-er-feld="wettbewerb" style="margin-bottom:0">' +
        Object.keys(WETTBEWERBE).map(function (k) { return '<option value="' + k + '"' + (e.wettbewerb === k ? ' selected' : '') + '>' + esc(WETTBEWERBE[k].name) + '</option>'; }).join('') + '</select>' +
      '<label class="pte-l" for="er-f-deadline">Deadline</label><input type="date" id="er-f-deadline" data-er-feld="deadline" value="' + esc(e.deadline || '') + '" style="margin-bottom:0">' +
      '<label class="pte-l" for="er-f-kernbotschaft">Kernbotschaft <span>(ein Satz)</span></label><textarea id="er-f-kernbotschaft" data-er-feld="kernbotschaft" rows="2" maxlength="400">' + esc(e.kernbotschaft) + '</textarea>' +
      '<label class="pte-l" for="er-f-anforderungen">Was verlangt dieser Wettbewerb ausdrücklich?</label><textarea id="er-f-anforderungen" data-er-feld="anforderungen" rows="4" maxlength="4000" placeholder="Kriterien und Vorgaben aus der Ausschreibung, möglichst wörtlich">' + esc(e.anforderungen) + '</textarea></div>';
    h += textFeld('ausgangslage', 'Ausgangslage', w.fragen.ausgangslage, e.ausgangslage);
    h += textFeld('loesung', 'Lösung', w.fragen.loesung, e.loesung);
    h += textFeld('wirkung', 'Wirkung', w.fragen.wirkung, e.wirkung);
    h += '<div class="paz-karte" id="er-belege-karte"><div class="lab">Belege</div>' + fragenListe(w.fragen.belege) + '<div id="er-belege"></div></div>';
    h += textFeld('luecken', 'Offene Lücken', w.fragen.luecken, e.luecken);
    h += '<div id="er-fehler" class="pte-fehler" aria-live="polite"></div>' +
      '<button class="btn btn-g" id="er-speichern" style="margin-top:6px">Speichern</button>' +
      '<div class="tb-knoepfe" style="justify-content:flex-end;margin-bottom:20px"><button class="tb-edit" id="er-loeschen">Einreichung löschen</button></div>';
    $('er-tab').innerHTML = h;
    $('er-tab').querySelectorAll('[data-er-feld]').forEach(function (el) {
      el.addEventListener('input', function () { ER.geaendert = true; });
      el.addEventListener('change', function () { ER.geaendert = true; });
    });
    $('er-speichern').onclick = async function () {
      this.disabled = true;
      var ok = await speichern();
      this.disabled = false;
      if (ok) { this.textContent = '✓ Gespeichert'; var b = this; setTimeout(function () { b.textContent = 'Speichern'; }, 1800); }
    };
    $('er-loeschen').onclick = loeschen;
    belegeZeigen();
  }

  function felderLesen() {
    var e = ER.akt;
    function w(id) { var el = $(id); return el ? el.value : null; }
    if ($('er-f-titel')) {
      var t = w('er-f-titel').trim().slice(0, 160); if (t) e.titel = t;
      e.wettbewerb = w('er-f-wettbewerb');
      e.deadline = w('er-f-deadline') || null;
      e.kernbotschaft = w('er-f-kernbotschaft').trim().slice(0, 400);
      e.anforderungen = w('er-f-anforderungen').slice(0, 4000);
      ['ausgangslage', 'loesung', 'wirkung', 'luecken'].forEach(function (k) { e[k] = w('er-f-' + k).slice(0, 8000); });
    }
    if ($('er-c-ausgangslage-tragfaehig')) {
      var p = e.pruefung;
      ABSCHNITTE.forEach(function (a) {
        ['tragfaehig', 'unklar', 'unbelegt'].forEach(function (f) { p.abschnitte[a[0]][f] = w('er-c-' + a[0] + '-' + f).slice(0, 1000); });
      });
      p.schwaechen = [0, 1, 2].map(function (i) { return w('er-c-s' + i).trim().slice(0, 400); });
    }
    if ($('er-p-hook') && e.pitch) {
      PITCH_TEILE.forEach(function (t) {
        e.pitch.teile[t.key].text = w('er-p-' + t.key).slice(0, 3000);
        e.pitch.teile[t.key].bild = w('er-p-' + t.key + '-bild').slice(0, 400);
      });
      e.pitch.merksatz = w('er-p-merksatz').trim().slice(0, 300);
    }
  }

  async function speichern() {
    felderLesen();
    var e = ER.akt, f = $('er-fehler');
    if (f) f.textContent = '';
    var r = await sb.from('einreichungen').update(Object.assign({
      titel: e.titel, wettbewerb: e.wettbewerb, deadline: e.deadline, kernbotschaft: e.kernbotschaft,
      anforderungen: e.anforderungen, ausgangslage: e.ausgangslage, loesung: e.loesung, wirkung: e.wirkung,
      luecken: e.luecken, pruefung: e.pruefung
    }, e.pitch ? {pitch: e.pitch} : {})).eq('id', e.id).select('*').single();
    if (r.error) {
      var m = 'Konnte nicht gespeichert werden: ' + r.error.message;
      if (f) f.textContent = m; else alert(m);
      return false;
    }
    ER.geaendert = false;
    var neu = r.data; neu.pruefung = pruefung(neu); pitchNorm(neu);
    ER.liste = ER.liste.map(function (x) { return String(x.id) === String(neu.id) ? neu : x; });
    ER.akt = JSON.parse(JSON.stringify(neu)); ER.akt.pruefung = pruefung(ER.akt); pitchNorm(ER.akt);
    return true;
  }

  async function loeschen() {
    var e = ER.akt;
    if (!confirm('„' + e.titel + '“ mit allen ' + ER.belege.length + ' Belegen endgültig löschen?')) return;
    var pfade = ER.belege.filter(function (b) { return b.bild_pfad; }).map(function (b) { return b.bild_pfad; });
    if (pfade.length) {
      var s = await sb.storage.from(BUCKET).remove(pfade);
      if (s.error) { alert('Bilder konnten nicht gelöscht werden: ' + s.error.message); return; }
    }
    var b = await sb.from('einreichung_belege').delete().eq('einreichung_id', e.id);
    if (b.error) { alert('Belege konnten nicht gelöscht werden: ' + b.error.message); return; }
    var r = await sb.from('einreichungen').delete().eq('id', e.id);
    if (r.error) { alert('Konnte nicht gelöscht werden: ' + r.error.message); return; }
    ER.geaendert = false;
    zeigeEinreichungen();
  }

  // ── Belege ────────────────────────────────────────────────────────
  function belegeZeigen() {
    var box = $('er-belege'); if (!box) return;
    var h = '';
    if (!ER.belege.length) h += '<p class="tb-d" style="margin-bottom:8px">Noch keine Belege. Sammle hier direkt das Material: Beobachtungen, Aussagen, Beispiele, Zahlen, Screenshots.</p>';
    ER.belege.forEach(function (b) {
      var url = b.bild_pfad && ER.bilder[b.bild_pfad];
      h += '<div class="tb-e' + (b.abschnitt === 'wirkung' ? ' ok' : '') + '">' +
        '<div class="tb-k"><span>' + esc(ART_NAME[b.art] || b.art) + ' · zu <b>' + esc(ABSCHNITT_NAME[b.abschnitt] || b.abschnitt) + '</b></span><span>' + esc(datumDE(b.datum)) + '</span></div>' +
        '<div class="tb-w">' + esc(b.titel) + '</div>' +
        (b.inhalt ? '<div class="tb-d" style="white-space:pre-line">' + esc(b.inhalt) + '</div>' : '') +
        (b.quelle ? '<div class="tb-d" style="margin-top:4px">Quelle: ' + esc(b.quelle) + '</div>' : '') +
        (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener"><img src="' + esc(url) + '" alt="' + esc(b.titel) + '" style="display:block;max-width:100%;max-height:220px;border-radius:8px;margin-top:8px"></a>' :
               (b.bild_pfad ? '<div class="tb-d" style="margin-top:4px">Bild gespeichert (gerade nicht ladbar)</div>' : '')) +
        '<div class="tb-knoepfe"><button class="tb-edit" data-erb-edit="' + esc(b.id) + '">Bearbeiten</button><button class="tb-edit" data-erb-weg="' + esc(b.id) + '">Löschen</button></div></div>';
    });
    h += '<button class="mb-neu" id="erb-neu">+ Beleg hinzufügen</button><div id="erb-form" hidden></div>';
    box.innerHTML = h;
    $('erb-neu').onclick = function () { belegForm(null); };
    box.querySelectorAll('[data-erb-edit]').forEach(function (x) { x.onclick = function () { belegForm(ER.belege.filter(function (b) { return String(b.id) === x.dataset.erbEdit; })[0]); }; });
    box.querySelectorAll('[data-erb-weg]').forEach(function (x) { x.onclick = function () { belegLoeschen(ER.belege.filter(function (b) { return String(b.id) === x.dataset.erbWeg; })[0]); }; });
  }

  function belegForm(b) {
    var f = $('erb-form'); f.hidden = false; $('erb-neu').hidden = true;
    var sel = function (liste, wert) { return liste.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === wert ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join(''); };
    f.innerHTML = '<div class="tb-e" style="border-left-color:#896C32">' +
      '<p class="mb-sub" style="margin:0 0 6px">Ohne Namen von Lehrlingen oder Kundinnen. Zitate von Lehrlingen nur, wenn sie es erlaubt haben.</p>' +
      '<label class="pte-l" for="erb-art">Art</label><select id="erb-art" style="margin-bottom:0">' + sel(ARTEN, b ? b.art : 'beobachtung') + '</select>' +
      '<label class="pte-l" for="erb-abschnitt">Belegt</label><select id="erb-abschnitt" style="margin-bottom:0">' +
        sel([['wirkung', 'Wirkung'], ['loesung', 'Lösung'], ['ausgangslage', 'Ausgangslage'], ['allgemein', 'allgemein']], b ? b.abschnitt : 'wirkung') + '</select>' +
      '<label class="pte-l" for="erb-titel">Kurz: Was zeigt dieser Beleg?</label><input id="erb-titel" maxlength="160" style="margin-bottom:0" placeholder="z. B. Lehrling mischt Rezeptur jetzt ohne Nachfragen" value="' + esc(b ? b.titel : '') + '">' +
      '<label class="pte-l" for="erb-inhalt">Inhalt</label><textarea id="erb-inhalt" rows="4" maxlength="4000" placeholder="Was genau beobachtet, gesagt, gemessen? Wann, wie oft, vorher – nachher?">' + esc(b ? b.inhalt : '') + '</textarea>' +
      '<div class="pte-zeile"><div><label class="pte-l" for="erb-datum">Datum</label><input type="date" id="erb-datum" style="margin-bottom:0" value="' + esc(b && b.datum ? b.datum : '') + '"></div>' +
      '<div><label class="pte-l" for="erb-quelle">Quelle <span>(ohne Namen)</span></label><input id="erb-quelle" maxlength="200" style="margin-bottom:0" placeholder="z. B. Lehrling 2. Lj., Rückmeldung" value="' + esc(b ? b.quelle : '') + '"></div></div>' +
      '<label class="pte-l" for="erb-bild">' + (b && b.bild_pfad ? 'Bild ersetzen' : 'Bild <span>(optional, z. B. Screenshot)</span>') + '</label><input type="file" id="erb-bild" accept="image/*" style="margin-bottom:0">' +
      (b && b.bild_pfad ? '<label class="ber-anon" style="margin:8px 0 0"><input type="checkbox" id="erb-bild-weg"><span>Bild entfernen</span></label>' : '') +
      '<div id="erb-fehler" class="pte-fehler"></div>' +
      '<button class="btn btn-g" id="erb-ok" style="margin-top:10px">' + (b ? 'Beleg speichern' : 'Beleg hinzufügen') + '</button><button class="mb-abm" id="erb-abbr" style="width:100%">Abbrechen</button></div>';
    f.scrollIntoView({behavior: 'smooth', block: 'start'});
    $('erb-abbr').onclick = function () { f.hidden = true; f.innerHTML = ''; $('erb-neu').hidden = false; };
    $('erb-ok').onclick = async function () {
      var fe = $('erb-fehler'); fe.textContent = '';
      var datei = $('erb-bild').files && $('erb-bild').files[0];
      var weg = $('erb-bild-weg') && $('erb-bild-weg').checked;
      var zeile = {
        art: $('erb-art').value, abschnitt: $('erb-abschnitt').value,
        titel: $('erb-titel').value.trim().slice(0, 160), inhalt: $('erb-inhalt').value.trim().slice(0, 4000),
        datum: $('erb-datum').value || null, quelle: $('erb-quelle').value.trim().slice(0, 200)
      };
      if (!zeile.titel) { fe.textContent = 'Bitte kurz eintragen, was dieser Beleg zeigt.'; return; }
      if (!zeile.inhalt && !datei && !(b && b.bild_pfad && !weg)) { fe.textContent = 'Bitte den Inhalt beschreiben oder ein Bild anhängen.'; return; }
      var knopf = this; knopf.disabled = true; knopf.textContent = 'Wird gespeichert…';
      try {
        var id = b ? b.id : uuid(), pfad = ER.akt.id + '/' + id + '.jpg';
        var blob = datei ? await verkleinern(datei) : null;
        if (b && b.bild_pfad && weg && !datei) {
          var s = await sb.storage.from(BUCKET).remove([b.bild_pfad]);
          if (s.error) throw s.error;
          zeile.bild_pfad = null;
        }
        if (blob) zeile.bild_pfad = pfad;   // Zeile zuerst: die Storage-Regel verlangt sie
        var r = b ? await sb.from('einreichung_belege').update(zeile).eq('id', id)
                  : await sb.from('einreichung_belege').insert(Object.assign({id: id, einreichung_id: ER.akt.id}, zeile));
        if (r.error) throw r.error;
        if (blob) {
          var u = await sb.storage.from(BUCKET).upload(pfad, blob, {contentType: 'image/jpeg', upsert: true});
          if (u.error) {
            if (!(b && b.bild_pfad)) await sb.from('einreichung_belege').update({bild_pfad: null}).eq('id', id);
            throw new Error('Beleg gespeichert, aber das Bild konnte nicht hochgeladen werden (' + u.error.message + ').');
          }
        }
      } catch (err) {
        knopf.disabled = false; knopf.textContent = b ? 'Beleg speichern' : 'Beleg hinzufügen';
        fe.textContent = (err && err.message) || String(err);
        await belegeLaden();
        return;
      }
      await belegeLaden();
      belegeZeigen();
    };
  }

  async function belegLoeschen(b) {
    if (!b || !confirm('Diesen Beleg löschen?')) return;
    if (b.bild_pfad) {
      var s = await sb.storage.from(BUCKET).remove([b.bild_pfad]);
      if (s.error) { alert('Bild konnte nicht gelöscht werden: ' + s.error.message); return; }
    }
    var r = await sb.from('einreichung_belege').delete().eq('id', b.id);
    if (r.error) { alert('Konnte nicht gelöscht werden: ' + r.error.message); return; }
    await belegeLaden();
    belegeZeigen();
  }

  // Bilder vor dem Hochladen verkleinern und neu als JPEG speichern – dabei
  // fallen die Bild-Metadaten weg (z. B. der Aufnahmeort).
  async function verkleinern(datei) {
    var bild;
    try { bild = await createImageBitmap(datei, {imageOrientation: 'from-image'}); }
    catch (e) {
      bild = await new Promise(function (ok, fehler) {
        var i = new Image(), u = URL.createObjectURL(datei);
        i.onload = function () { URL.revokeObjectURL(u); ok(i); };
        i.onerror = function () { URL.revokeObjectURL(u); fehler(new Error('Bild konnte nicht gelesen werden.')); };
        i.src = u;
      });
    }
    var w = bild.width, h = bild.height, f = Math.min(1, MAX_PX / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.round(w * f); c.height = Math.round(h * f);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bild, 0, 0, c.width, c.height);
    if (bild.close) bild.close();
    var blob = null;
    for (var q = 0.86; q >= 0.5 && (!blob || blob.size > 1900000); q -= 0.12) {
      blob = await new Promise(function (ok) { c.toBlob(ok, 'image/jpeg', q); });
    }
    if (!blob || blob.size > 2000000) throw new Error('Bild ist zu groß.');
    return blob;
  }

  // ── Auffälligkeiten im Text (keine Bewertung, nur Hinweise) ───────
  var ALLGEMEIN = ['besser', 'deutlich', 'deutliche', 'deutlicher', 'stark', 'stärker', 'sehr', 'enorm', 'massiv', 'wesentlich',
    'innovativ', 'innovative', 'einzigartig', 'einzigartige', 'modern', 'moderne', 'nachhaltig', 'nachhaltige', 'ganzheitlich',
    'ganzheitliche', 'optimal', 'optimiert', 'effizient', 'effizienter', 'motiviert', 'motivierter', 'erfolgreich', 'professionell',
    'spürbar', 'spürbare', 'verbessert', 'verbessern', 'steigert', 'gesteigert', 'zukunftsweisend', 'zukunftsorientiert', 'revolutionär',
    'hochwertig', 'qualitativ', 'nachweislich', 'vielfältig', 'umfassend'];
  function woerter(t) { return String(t || '').toLowerCase().match(/[a-zäöüß]+/g) || []; }
  function allgemeineWoerter(t) {
    var gef = [];
    woerter(t).forEach(function (w) { if (ALLGEMEIN.indexOf(w) >= 0 && gef.indexOf(w) < 0) gef.push(w); });
    return gef;
  }
  function hatKonkretes(t) {
    return /\d/.test(t) || /z\.\s?b\.|zum beispiel|beispiel|etwa |konkret|„|"|»/i.test(t);
  }
  function auffaelligkeiten(key) {
    var e = ER.akt, wb = e.wettbewerb, out = [];
    var belegeZu = function (a) { return ER.belege.filter(function (b) { return b.abschnitt === a; }).length; };
    if (key === 'belege') {
      var n = ER.belege.length;
      if (!n) return ['Noch keine Belege gesammelt.'];
      ['ausgangslage', 'loesung', 'wirkung'].forEach(function (a) { if (!belegeZu(a)) out.push('Kein Beleg ist der ' + ABSCHNITT_NAME[a] + ' zugeordnet.'); });
      var arten = {}; ER.belege.forEach(function (b) { arten[b.art] = (arten[b.art] || 0) + 1; });
      if (!arten.beobachtung && !arten.aussage) out.push('Keine Beobachtung und keine Aussage aus dem Alltag.');
      if (wb === 'mercur' && !arten.screenshot && !arten.zahl && !arten.dokument) out.push('Kein Screenshot, keine Zahl, kein Test – was zeigt, dass die Lösung im Betrieb funktioniert?');
      if (wb === 'staatspreis' && !arten.beispiel && !arten.beobachtung) out.push('Kein Praxisbeispiel und keine Beobachtung – was zeigt, dass es gelebte Praxis ist?');
      var ohneDatum = ER.belege.filter(function (b) { return !b.datum; }).length;
      if (ohneDatum) out.push(ohneDatum + (ohneDatum === 1 ? ' Beleg hat' : ' Belege haben') + ' kein Datum.');
      var duenn = ER.belege.filter(function (b) { return !b.bild_pfad && String(b.inhalt || '').length < 60; }).length;
      if (duenn) out.push(duenn + (duenn === 1 ? ' Beleg ist' : ' Belege sind') + ' nur ein, zwei Stichworte, ohne Bild.');
      if (Object.keys(arten).length === 1 && n > 1) out.push('Alle Belege sind von derselben Art (' + ART_NAME[Object.keys(arten)[0]] + ').');
      return out;
    }
    var t = String(e[key] || '').trim();
    if (key === 'luecken') {
      if (!t) out.push('Noch keine Lücken notiert.');
      var leer = ['ausgangslage', 'loesung', 'wirkung'].filter(function (a) { return !String(e[a] || '').trim(); });
      if (leer.length) out.push('Noch leer: ' + leer.map(function (a) { return ABSCHNITT_NAME[a]; }).join(', ') + '.');
      return out;
    }
    if (!t) return ['Noch leer.'];
    if (t.length < 300) out.push('Noch sehr knapp (' + t.length + ' Zeichen).');
    var allg = allgemeineWoerter(t);
    if (allg.length) out.push('Allgemeine Wörter: ' + allg.slice(0, 5).map(function (w) { return '„' + w + '“'; }).join(', ') + ' – woran genau sieht man das?');
    if (!hatKonkretes(t)) out.push('Keine Zahl und kein konkretes Beispiel.');
    if (!belegeZu(key)) out.push('Kein Beleg ist diesem Abschnitt zugeordnet.');
    var tl = t.toLowerCase();
    if (key === 'wirkung' && !/vorher|früher|bisher|seit|jetzt|heute|inzwischen|nachher|statt/.test(tl)) out.push('Kein Vorher–Nachher: Was ist jetzt anders als vorher?');
    if (wb === 'staatspreis') {
      if (key === 'wirkung' && !/lehrling|auszubildend/.test(tl)) out.push('Lehrlinge kommen in der Wirkung nicht vor.');
      if (key === 'loesung' && !/täglich|wöchentlich|jede woche|jeden tag|im salon|ablauf|alltag|schritt|dienstag|montag|morgens/.test(tl)) out.push('Unklar, wie es im Ausbildungsalltag abläuft (wann, wie oft, wer macht was).');
      if (key === 'ausgangslage' && !/lehrling|ausbildung|auszubildend/.test(tl)) out.push('Das Ausbildungsproblem wird nicht beim Namen genannt.');
    }
    if (wb === 'mercur') {
      if (key === 'loesung' && !/neu|bisher|statt|anders|erstmals|unterschied|gab es nicht/.test(tl)) out.push('Der Unterschied zu bisherigen Lösungen ist nicht benannt.');
      if (key === 'ausgangslage' && !/zeit|minuten|stunden|fehler|aufwand|kosten|engpass|doppelt|verloren/.test(tl)) out.push('Der Engpass ist nicht greifbar (Zeit, Fehler, Aufwand?).');
      if (key === 'ausgangslage' && !/warum|weil|deshalb|daher|relevant/.test(tl)) out.push('Nicht gesagt, warum das Problem wichtig genug für eine neue Lösung war.');
    }
    return out;
  }
  function kopfAuffaelligkeiten() {
    var e = ER.akt, out = [], k = String(e.kernbotschaft || '').trim();
    if (!k) out.push('Kernbotschaft fehlt.');
    else {
      if ((k.match(/[.!?](\s|$)/g) || []).length > 1) out.push('Die Kernbotschaft hat mehr als einen Satz.');
      if (k.length > 220) out.push('Die Kernbotschaft ist lang (' + k.length + ' Zeichen).');
    }
    if (!String(e.anforderungen || '').trim()) out.push('Die ausdrücklichen Anforderungen des Wettbewerbs sind nicht eingetragen – ohne sie lässt sich nicht prüfen, ob die Einreichung sie trifft.');
    return out;
  }

  // ── Tab „Wettbewerbs-Check“ ───────────────────────────────────────
  function checkZeigen() {
    var e = ER.akt, w = WETTBEWERBE[e.wettbewerb] || WETTBEWERBE.staatspreis, p = e.pruefung;
    var h = '<p class="mb-sub">Kein Score, keine Jury. Unter jedem Abschnitt stehen die Fragen, die ' + esc(w.name) + ' stellt, und was im Text auffällt. Die Einschätzung triffst du.</p>';
    var kopf = kopfAuffaelligkeiten();
    if (kopf.length) h += '<div class="paz-karte"><div class="lab">Vorab: Kopfdaten</div><ul class="ber-meth" style="margin:0">' + kopf.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    ABSCHNITTE.forEach(function (a) {
      var k = a[0], c = p.abschnitte[k], st = STUFE[c.stufe], auff = auffaelligkeiten(k);
      h += '<div class="tb-e" id="er-c-' + k + '" style="border-left-color:' + (st ? st[2] : '#E4DBC5') + ';padding:14px;margin-bottom:12px">' +
        '<div class="lab">' + esc(a[1]) + '</div>' + fragenListe(w.fragen[k]) +
        '<div class="tb-mnotiz" style="margin:0 0 10px">' + (auff.length ? '<b>Auffällig im Text</b><ul class="ber-meth" style="margin:4px 0 0">' + auff.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : 'Im Text fällt nichts Formales auf. Ob es inhaltlich trägt, entscheidest du.') + '</div>' +
        '<div class="pte-l" style="margin-top:0">Einschätzung</div><div class="tb-filter" style="margin-bottom:6px">' +
          STUFEN.map(function (s) { return '<button data-er-stufe="' + k + '" data-wert="' + s[0] + '" aria-pressed="' + (c.stufe === s[0]) + '">' + esc(s[1]) + '</button>'; }).join('') + '</div>' +
        '<label class="pte-l" for="er-c-' + k + '-tragfaehig">Schon tragfähig</label><textarea id="er-c-' + k + '-tragfaehig" data-er-c rows="2" maxlength="1000">' + esc(c.tragfaehig) + '</textarea>' +
        '<label class="pte-l" for="er-c-' + k + '-unklar">Noch unklar</label><textarea id="er-c-' + k + '-unklar" data-er-c rows="2" maxlength="1000">' + esc(c.unklar) + '</textarea>' +
        '<label class="pte-l" for="er-c-' + k + '-unbelegt">Noch nicht ausreichend belegt</label><textarea id="er-c-' + k + '-unbelegt" data-er-c rows="2" maxlength="1000">' + esc(c.unbelegt) + '</textarea>' +
        '</div>';
    });
    h += '<div class="paz-karte"><div class="lab">Die drei wichtigsten Schwächen</div>' +
      '<p class="tb-d" style="margin-bottom:8px">Wo du zuerst nachschärfst.</p>' +
      [0, 1, 2].map(function (i) { return '<label class="pte-l" for="er-c-s' + i + '">' + (i + 1) + '.</label><textarea id="er-c-s' + i + '" data-er-c rows="2" maxlength="400">' + esc(p.schwaechen[i] || '') + '</textarea>'; }).join('') +
      '<div id="er-vorschlaege"></div></div>' +
      '<div id="er-fehler" class="pte-fehler" aria-live="polite"></div>' +
      '<button class="btn btn-g" id="er-c-speichern" style="margin:6px 0 20px">Check speichern</button>';
    $('er-tab').innerHTML = h;
    $('er-tab').querySelectorAll('[data-er-c]').forEach(function (el) { el.addEventListener('input', function () { ER.geaendert = true; }); });
    $('er-tab').querySelectorAll('[data-er-stufe]').forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.erStufe, c = ER.akt.pruefung.abschnitte[k];
        c.stufe = c.stufe === b.dataset.wert ? '' : b.dataset.wert;   // nochmal antippen = zurücknehmen
        ER.geaendert = true;
        document.querySelectorAll('[data-er-stufe="' + k + '"]').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.wert === c.stufe)); });
        var st = STUFE[c.stufe]; $('er-c-' + k).style.borderLeftColor = st ? st[2] : '#E4DBC5';
        vorschlaegeZeigen();
      };
    });
    $('er-c-speichern').onclick = async function () {
      this.disabled = true;
      var ok = await speichern();
      this.disabled = false;
      if (ok) { this.textContent = '✓ Gespeichert'; var b = this; setTimeout(function () { b.textContent = 'Check speichern'; }, 1800); }
    };
    vorschlaegeZeigen();
  }

  // Vorschläge für die drei Schwächen: zuerst deine eigenen Einschätzungen,
  // dann was im Text fehlt. Übernehmen füllt das erste leere Feld.
  function vorschlaegeZeigen() {
    var box = $('er-vorschlaege'); if (!box) return;
    felderLesen();
    var p = ER.akt.pruefung, v = [];
    function dazu(t) { t = String(t || '').trim(); if (t && v.indexOf(t) < 0) v.push(t); }
    ABSCHNITTE.forEach(function (a) { var c = p.abschnitte[a[0]]; if (c.stufe === 'allgemein') dazu(a[1] + ': zu allgemein' + (c.unklar ? ' – ' + c.unklar : '')); });
    ABSCHNITTE.forEach(function (a) { var c = p.abschnitte[a[0]]; if (c.unbelegt) dazu(a[1] + ': nicht belegt – ' + c.unbelegt); });
    ABSCHNITTE.forEach(function (a) { var c = p.abschnitte[a[0]]; if (c.stufe === 'teilweise' && c.unklar) dazu(a[1] + ': ' + c.unklar); });
    ['wirkung', 'belege', 'loesung', 'ausgangslage'].forEach(function (k) {
      var auff = auffaelligkeiten(k)[0];
      if (auff) dazu(ABSCHNITT_NAME[k] + ': ' + auff);
    });
    kopfAuffaelligkeiten().forEach(dazu);
    var schon = p.schwaechen.map(function (s) { return String(s || '').trim(); });
    v = v.filter(function (t) { return schon.indexOf(t) < 0; }).slice(0, 6);
    if (!v.length) { box.innerHTML = ''; return; }
    box.innerHTML = '<div class="pte-l" style="margin-top:14px">Vorschläge aus dem Check</div>' +
      v.map(function (t, i) { return '<div class="tb-knoepfe" style="margin-top:4px;flex-wrap:nowrap;align-items:flex-start"><span class="tb-d" style="flex:1">' + esc(t) + '</span><button class="tb-edit" data-er-vor="' + i + '">übernehmen</button></div>'; }).join('');
    box.querySelectorAll('[data-er-vor]').forEach(function (b) {
      b.onclick = function () {
        for (var i = 0; i < 3; i++) {
          var el = $('er-c-s' + i);
          if (!el.value.trim()) { el.value = v[+b.dataset.erVor].slice(0, 400); ER.geaendert = true; vorschlaegeZeigen(); return; }
        }
        alert('Alle drei Felder sind schon ausgefüllt. Leere zuerst eines.');
      };
    });
  }

  // ── Tab „2-Minuten-Pitch“ ─────────────────────────────────────────
  // Vier Zeitabschnitte, gebaut aus der eigenen Einreichung. Die Bausteine
  // sind wörtliche Sätze aus Einreichung und Belegen – nichts wird erfunden,
  // keine KI. Zeit = Wörter ÷ Sprechtempo. Die Hinweise bewerten nicht, sie
  // zeigen nur, was auffällt (zu lang, Zahl ohne Herkunft, allgemeine Wörter).
  var PITCH_TEILE = [
    {key: 'hook', name: 'Hook', von: 0, bis: 20, quellen: ['ausgangslage', 'belege', 'kernbotschaft'],
     frage: 'Womit hast du in 20 Sekunden die Aufmerksamkeit? Fang beim Publikum an, nicht bei der App: ein Moment aus dem Salon, ein Gegensatz oder eine Frage.'},
    {key: 'loesung', name: 'Problem & Lösung', von: 20, bis: 50, quellen: ['ausgangslage', 'loesung'],
     frage: 'Was fehlt im Ausbildungsalltag – und was macht ihr anders? In einfachen Worten, ohne Fachjargon.'},
    {key: 'zeigen', name: 'Zeigen statt erzählen', von: 50, bis: 90, quellen: ['loesung', 'wirkung'],
     frage: 'Zwei, drei Dinge, die man in der App sieht und die es so sonst nicht gibt. Am besten läuft dazu der Bildschirm mit.'},
    {key: 'schluss', name: 'Beleg & Schluss', von: 90, bis: 120, quellen: ['belege', 'wirkung', 'kernbotschaft'],
     frage: 'Ein echter Beleg (Beobachtung, Aussage, Zahl) – und am Ende der Satz, der hängen bleibt.'}
  ];
  var PITCH_TEIL = {}; PITCH_TEILE.forEach(function (t) { PITCH_TEIL[t.key] = t; });
  var TEMPI = [['ruhig', 120, 'ruhig'], ['normal', 135, 'normal'], ['zuegig', 150, 'zügig']];
  var TEMPO = {}; TEMPI.forEach(function (t) { TEMPO[t[0]] = t[1]; });
  var HOOK_MUSTER = [
    ['Szene', 'Ein Moment aus dem Salon, in dem das Problem sichtbar wird. Ohne echten Namen.', 'Ein Lehrling … Sie ist sich sicher – und …'],
    ['Gegensatz', 'Was alle erwarten – und was im Handwerk wirklich zählt.', 'Die meisten … zählen … Im Salon zählt aber …'],
    ['Frage', 'Eine Frage, auf die das Publikum keine schnelle Antwort hat.', 'Woran erkennen Sie, ob ein Lehrling … wirklich kann?']
  ];
  var FASSUNGEN = [['sprechen', 'Sprechtext'], ['video', 'Video-Drehbuch'], ['schrift', 'Schriftlich']];
  var GRENZEN = [500, 1000, 1500, 2500];
  var PR = null;   // laufende Probe

  function pitchNorm(e) {
    if (!e || !Object.prototype.hasOwnProperty.call(e, 'pitch')) return;   // Spalte fehlt noch
    var p = e.pitch && typeof e.pitch === 'object' && !Array.isArray(e.pitch) ? e.pitch : {};
    if (!p.teile || typeof p.teile !== 'object') p.teile = {};
    PITCH_TEILE.forEach(function (t) {
      var x = p.teile[t.key];
      if (!x || typeof x !== 'object') x = p.teile[t.key] = {};
      x.text = String(x.text || ''); x.bild = String(x.bild || '');
    });
    p.merksatz = String(p.merksatz || '');
    if (!TEMPO[p.tempo]) p.tempo = 'normal';
    e.pitch = p;
  }
  function zeit(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function wortZahl(t) { return (String(t || '').match(/\S+/g) || []).length; }
  function sek(t) { return Math.round(wortZahl(t) / TEMPO[ER.akt.pitch.tempo] * 60); }
  function saetze(t) {
    return String(t || '').replace(/\s+/g, ' ').trim().replace(/([.!?…])\s+(?=[A-ZÄÖÜ„"»0-9])/g, '$1\n').split('\n')
      .map(function (s) { return s.trim(); }).filter(function (s) { return s.length >= 20 && s.length <= 320; });
  }
  // Grün = passt, gold = noch viel Luft, rot = zu lang (Farben aus STUFEN)
  function zeitStufe(s, plan, n) {
    if (!n) return null;
    if (s > plan * 1.15) return STUFE.allgemein;
    if (s < plan * 0.5) return STUFE.teilweise;
    return STUFE.klar;
  }
  function merksatzFehltImSchluss(p) {
    var m = p.merksatz.trim();
    return m && p.teile.schluss.text.indexOf(m) < 0;
  }

  function pitchZeigen() {
    var e = ER.akt;
    if (!e.pitch) {
      $('er-tab').innerHTML = '<p class="mb-sub">Der Pitch braucht noch die Datenbank-Änderung (supabase/20261128_einreichungen_pitch.sql im Supabase SQL-Editor ausführen).</p>';
      return;
    }
    var p = e.pitch;
    ER.fassung = ER.fassung || 'sprechen'; ER.grenze = ER.grenze || 1000;
    var h = '<p class="mb-sub">Zwei Minuten, vier Abschnitte. Die Bausteine kommen wörtlich aus deiner Einreichung und deinen Belegen – erfunden wird nichts, keine KI. Daraus entstehen Sprechtext, Video-Drehbuch und eine schriftliche Kurzfassung.</p>' +
      '<div class="pte-l" style="margin-top:0">Sprechtempo</div><div class="tb-filter">' +
      TEMPI.map(function (t) { return '<button data-er-tempo="' + t[0] + '" aria-pressed="' + (p.tempo === t[0]) + '">' + esc(t[2]) + ' · ' + t[1] + ' Wörter/Min.</button>'; }).join('') + '</div>';
    PITCH_TEILE.forEach(function (t) {
      var x = p.teile[t.key];
      h += '<div class="tb-e" id="er-p-' + t.key + '-karte" style="border-left-color:#E4DBC5;padding:14px;margin-bottom:12px">' +
        '<div class="lab">' + zeit(t.von) + '–' + zeit(t.bis) + ' · ' + esc(t.name) + '</div>' +
        '<p class="tb-d" style="margin-bottom:8px">' + esc(t.frage) + '</p>' +
        (t.key === 'hook' ? '<div class="pte-l" style="margin-top:0">Gerüst</div><div class="tb-knoepfe" style="margin-top:0">' +
          HOOK_MUSTER.map(function (m, i) { return '<button class="tb-edit" data-er-muster="' + i + '">' + esc(m[0]) + '</button>'; }).join('') +
          '</div><div class="tb-d" id="er-p-muster-info" style="margin-top:4px"></div>' : '') +
        '<label class="pte-l" for="er-p-' + t.key + '">Gesprochen</label><textarea id="er-p-' + t.key + '" data-er-p rows="5" maxlength="3000">' + esc(x.text) + '</textarea>' +
        '<div class="tb-d" id="er-p-' + t.key + '-zeit"></div>' +
        '<label class="pte-l" for="er-p-' + t.key + '-bild">Im Bild <span>(fürs Video, z. B. welcher Bildschirm)</span></label>' +
        '<input id="er-p-' + t.key + '-bild" data-er-p maxlength="400" style="margin-bottom:0" value="' + esc(x.bild) + '">' +
        '<div class="tb-knoepfe"><button class="tb-edit" data-er-bst="' + t.key + '" aria-expanded="false">Bausteine aus der Einreichung</button></div>' +
        '<div id="er-p-' + t.key + '-bst" hidden></div></div>';
    });
    h += '<div class="paz-karte"><div class="lab">Satz zum Merken</div>' +
      '<p class="tb-d" style="margin-bottom:8px">Der eine Satz, den die Jury beim Rausgehen noch im Kopf hat. Kurz, ohne Fachwort.</p>' +
      '<textarea id="er-p-merksatz" data-er-p rows="2" maxlength="300">' + esc(p.merksatz) + '</textarea>' +
      (String(e.kernbotschaft || '').trim() ? '<div class="tb-knoepfe"><button class="tb-edit" id="er-p-kern">Kernbotschaft übernehmen</button></div>' : '') + '</div>' +
      '<div class="paz-karte"><div class="lab">Gesamt</div><div class="tb-w" id="er-p-gesamt"></div><div class="tb-d" id="er-p-letzte"></div>' +
      '<button class="btn btn-h" id="er-p-probe" style="margin-top:10px">▶ Probe mit Stoppuhr</button></div>' +
      '<div class="paz-karte"><div class="lab">Auffällig im Pitch</div><div id="er-p-auff"></div></div>' +
      '<div class="paz-karte"><div class="lab">Fassung</div><div class="tb-filter">' +
      FASSUNGEN.map(function (f) { return '<button data-er-fassung="' + f[0] + '" aria-pressed="' + (ER.fassung === f[0]) + '">' + esc(f[1]) + '</button>'; }).join('') +
      '</div><div id="er-p-fassung"></div>' +
      '<div class="tb-knoepfe"><button class="tb-edit" id="er-p-kopieren">Text kopieren</button><span class="tb-d" id="er-p-kopiert" aria-live="polite"></span></div></div>' +
      '<div id="er-fehler" class="pte-fehler" aria-live="polite"></div>' +
      '<button class="btn btn-g" id="er-p-speichern" style="margin:6px 0 20px">Pitch speichern</button>';
    $('er-tab').innerHTML = h;

    var warten = null;
    $('er-tab').querySelectorAll('[data-er-p]').forEach(function (el) {
      el.addEventListener('input', function () {
        ER.geaendert = true;
        clearTimeout(warten); warten = setTimeout(pitchAktualisieren, 250);
      });
    });
    $('er-tab').querySelectorAll('[data-er-tempo]').forEach(function (b) {
      b.onclick = function () {
        ER.akt.pitch.tempo = b.dataset.erTempo; ER.geaendert = true;
        document.querySelectorAll('[data-er-tempo]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        pitchAktualisieren();
      };
    });
    $('er-tab').querySelectorAll('[data-er-muster]').forEach(function (b) {
      b.onclick = function () {
        var m = HOOK_MUSTER[+b.dataset.erMuster];
        $('er-p-muster-info').textContent = m[0] + ': ' + m[1] + ' Die Lücken (…) füllst du mit deinem echten Beispiel.';
        einsetzen('hook', m[2]);
      };
    });
    $('er-tab').querySelectorAll('[data-er-bst]').forEach(function (b) {
      b.onclick = function () {
        var box = $('er-p-' + b.dataset.erBst + '-bst'), auf = box.hidden;
        box.hidden = !auf; b.setAttribute('aria-expanded', String(auf));
        if (auf) bausteineZeigen(b.dataset.erBst);
      };
    });
    if ($('er-p-kern')) $('er-p-kern').onclick = function () {
      var el = $('er-p-merksatz');
      if (el.value.trim() && !confirm('Den Satz zum Merken durch die Kernbotschaft ersetzen?')) return;
      el.value = String(ER.akt.kernbotschaft || '').trim().slice(0, 300); ER.geaendert = true; pitchAktualisieren();
    };
    $('er-tab').querySelectorAll('[data-er-fassung]').forEach(function (b) {
      b.onclick = function () {
        ER.fassung = b.dataset.erFassung;
        document.querySelectorAll('[data-er-fassung]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        fassungZeigen();
      };
    });
    $('er-p-kopieren').onclick = kopieren;
    $('er-p-probe').onclick = probeStarten;
    $('er-p-speichern').onclick = async function () {
      this.disabled = true;
      var ok = await speichern();
      this.disabled = false;
      if (ok) { this.textContent = '✓ Gespeichert'; var b = this; setTimeout(function () { b.textContent = 'Pitch speichern'; }, 1800); }
    };
    pitchAktualisieren();
  }

  function einsetzen(key, text) {
    var el = $('er-p-' + key);
    el.value = (el.value.trim() ? el.value.replace(/\s+$/, '') + ' ' : '') + text;
    el.value = el.value.slice(0, 3000);
    ER.geaendert = true;
    pitchAktualisieren();
    if (!$('er-p-' + key + '-bst').hidden) bausteineZeigen(key);
  }

  function bausteine(key) {
    var e = ER.akt, out = [];
    PITCH_TEIL[key].quellen.forEach(function (q) {
      if (q === 'belege') {
        ER.belege.forEach(function (b) {
          var erster = saetze(b.inhalt)[0] || String(b.inhalt || '').trim();
          out.push({quelle: 'Beleg · ' + (ART_NAME[b.art] || b.art), text: (b.titel + (erster ? '. ' + erster : '')).replace(/\.\.+/g, '.').slice(0, 400)});
        });
      } else if (q === 'kernbotschaft') {
        if (String(e.kernbotschaft || '').trim()) out.push({quelle: 'Kernbotschaft', text: e.kernbotschaft.trim()});
      } else {
        saetze(e[q]).forEach(function (s) { out.push({quelle: ABSCHNITT_NAME[q], text: s}); });
      }
    });
    return out.slice(0, 14);
  }
  function bausteineZeigen(key) {
    var box = $('er-p-' + key + '-bst'), liste = bausteine(key), drin = $('er-p-' + key).value;
    if (!liste.length) {
      box.innerHTML = '<p class="tb-d" style="margin-top:8px">Dazu steht in der Einreichung noch nichts. Zuerst im Reiter „Einreichung“ die Abschnitte ' +
        PITCH_TEIL[key].quellen.map(function (q) { return q === 'belege' ? 'Belege' : q === 'kernbotschaft' ? 'Kernbotschaft' : ABSCHNITT_NAME[q]; }).join(', ') + ' ausfüllen.</p>';
      return;
    }
    box.innerHTML = '<p class="tb-d" style="margin:8px 0 2px">Wörtlich aus deiner Einreichung. Übernehmen hängt den Satz an – danach für das Sprechen kürzen.</p>' +
      liste.map(function (b, i) {
        var schon = drin.indexOf(b.text) >= 0;
        return '<div class="tb-knoepfe" style="margin-top:6px;flex-wrap:nowrap;align-items:flex-start"><span class="tb-d" style="flex:1"><b>' + esc(b.quelle) + '</b> · ' + esc(b.text) + '</span>' +
          (schon ? '<span class="tb-d">✓ drin</span>' : '<button class="tb-edit" data-er-nimm="' + i + '">übernehmen</button>') + '</div>';
      }).join('');
    box.querySelectorAll('[data-er-nimm]').forEach(function (b) { b.onclick = function () { einsetzen(key, liste[+b.dataset.erNimm].text); }; });
  }

  function pitchAktualisieren() {
    if (!$('er-p-hook')) return;
    felderLesen();
    var p = ER.akt.pitch, wpm = TEMPO[p.tempo], gesamt = 0, woerterGesamt = 0;
    PITCH_TEILE.forEach(function (t) {
      var text = p.teile[t.key].text, n = wortZahl(text), s = sek(text), plan = t.bis - t.von, st = zeitStufe(s, plan, n);
      gesamt += s; woerterGesamt += n;
      $('er-p-' + t.key + '-zeit').innerHTML = n
        ? '<span style="color:' + st[2] + ';font-weight:600">ca. ' + s + ' s</span> von ' + plan + ' s · ' + n + ' Wörter' +
          (st === STUFE.allgemein ? ' – kürzen, etwa auf ' + Math.round(plan * wpm / 60) + ' Wörter' : st === STUFE.teilweise ? ' – hier ist noch Luft' : '')
        : 'Noch leer · Ziel ' + plan + ' s, das sind etwa ' + Math.round(plan * wpm / 60) + ' Wörter';
      $('er-p-' + t.key + '-karte').style.borderLeftColor = st ? st[2] : '#E4DBC5';
    });
    var g = gesamt > 125 ? STUFE.allgemein : STUFE.klar;
    $('er-p-gesamt').innerHTML = '<span style="color:' + (woerterGesamt ? g[2] : 'inherit') + '">ca. ' + zeit(gesamt) + '</span> von 2:00 · ' + woerterGesamt + ' Wörter';
    var pr = p.probe;
    $('er-p-letzte').textContent = pr && Array.isArray(pr.sek) && pr.sek.length
      ? 'Letzte Probe' + (pr.datum ? ' am ' + datumDE(pr.datum) : '') + ': ' + zeit(pr.sek.reduce(function (a, b) { return a + b; }, 0)) + ' (' + pr.sek.map(zeit).join(' · ') + ')'
      : 'Die Zeit ist geschätzt. Genau weißt du es erst nach einer Probe laut gesprochen.';
    var auff = pitchAuffaelligkeiten(gesamt);
    $('er-p-auff').innerHTML = auff.length
      ? '<ul class="ber-meth" style="margin:0">' + auff.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'
      : '<div class="tb-mnotiz" style="margin-top:0">Formal fällt nichts auf. Ob der Pitch trägt, merkst du beim lauten Proben vor jemandem, der die App nicht kennt.</div>';
    fassungZeigen();
  }

  function zahlenIn(t) {
    return (String(t || '').match(/\d+(?:[.,]\d+)?/g) || []).map(function (z) { return z.replace(',', '.'); });
  }
  function pitchAuffaelligkeiten(gesamt) {
    var e = ER.akt, p = e.pitch, out = [];
    var texte = PITCH_TEILE.map(function (t) { return p.teile[t.key].text; });
    var alle = texte.concat([p.merksatz]).join('\n');
    var leer = PITCH_TEILE.filter(function (t) { return !p.teile[t.key].text.trim(); });
    if (leer.length === PITCH_TEILE.length) return ['Noch leer. Tipp: bei jedem Abschnitt „Bausteine aus der Einreichung“ öffnen, passende Sätze übernehmen und dann fürs Sprechen kürzen.'];
    if (leer.length) out.push('Noch leer: ' + leer.map(function (t) { return t.name; }).join(', ') + '.');
    PITCH_TEILE.forEach(function (t) {
      var s = sek(p.teile[t.key].text), plan = t.bis - t.von;
      if (s > plan * 1.15) out.push(t.name + ': ca. ' + s + ' s statt ' + plan + ' s.');
    });
    if (gesamt > 125) out.push('Insgesamt ca. ' + zeit(gesamt) + ' – über zwei Minuten. Was kann weg, ohne dass der Kern fehlt?');
    else if (!leer.length && gesamt < 90) out.push('Insgesamt erst ca. ' + zeit(gesamt) + ' – Platz für einen konkreten Beleg mehr.');
    if (/^\s*(wir|unser\w*|ich|mein\w*|die app|unsere app|great hair day|die great hair day)\b/i.test(p.teile.hook.text))
      out.push('Der Hook beginnt bei euch. Stärker ist ein Einstieg beim Publikum: ein Moment aus dem Salon, ein Gegensatz, eine Frage.');
    var allg = allgemeineWoerter(alle);
    if (allg.length) out.push('Allgemeine Wörter: ' + allg.slice(0, 5).map(function (w) { return '„' + w + '“'; }).join(', ') + ' – lieber zeigen, woran man es sieht.');
    if (/\bbis zu\b/i.test(alle)) out.push('„bis zu …“ klingt nach Werbung. Besser die echte Zahl aus einem Beleg, mit Zeitraum.');
    var bekannt = {};
    [e.ausgangslage, e.loesung, e.wirkung, e.kernbotschaft, e.anforderungen].concat(ER.belege.map(function (b) { return b.titel + ' ' + b.inhalt + ' ' + b.quelle; }))
      .forEach(function (t) { zahlenIn(t).forEach(function (z) { bekannt[z] = 1; }); });
    var fremd = [];
    zahlenIn(alle).forEach(function (z) { if (!bekannt[z] && fremd.indexOf(z) < 0) fremd.push(z); });
    if (fremd.length) out.push('Zahl ohne Herkunft: ' + fremd.slice(0, 5).map(function (z) { return '„' + z.replace('.', ',') + '“'; }).join(', ') + ' – steht weder in der Einreichung noch in einem Beleg. Woher stammt sie?');
    var lang = 0;
    texte.forEach(function (t) { String(t).split(/[.!?…]+\s+/).forEach(function (s) { if (wortZahl(s) > 25) lang++; }); });
    if (lang) out.push(lang + (lang === 1 ? ' Satz hat' : ' Sätze haben') + ' mehr als 25 Wörter – gesprochen schwer zu folgen. Teilen.');
    if (p.teile.schluss.text.trim() && !hatKonkretes(p.teile.schluss.text)) out.push('Im Schluss steht kein konkreter Beleg (Beobachtung, Zitat, Zahl).');
    if (!ER.belege.length) out.push('In der Einreichung gibt es noch keine Belege – ohne Beleg bleibt der Pitch eine Behauptung.');
    var m = p.merksatz.trim();
    if (!m) out.push('Satz zum Merken fehlt.');
    else if (wortZahl(m) > 15) out.push('Der Satz zum Merken hat ' + wortZahl(m) + ' Wörter – unter 15 bleibt er eher hängen.');
    return out;
  }

  function fassungText(f) {
    var p = ER.akt.pitch;
    if (f === 'video') {
      return PITCH_TEILE.map(function (t) {
        var x = p.teile[t.key], ton = x.text.trim() + (t.key === 'schluss' && merksatzFehltImSchluss(p) ? ' ' + p.merksatz.trim() : '');
        return zeit(t.von) + '–' + zeit(t.bis) + ' · ' + t.name + '\nIm Bild: ' + (x.bild.trim() || '(noch offen)') + '\nTon: ' + (ton.trim() || '(noch leer)');
      }).join('\n\n');
    }
    if (f === 'schrift') {
      var absaetze = PITCH_TEILE.map(function (t) { return p.teile[t.key].text.trim(); }).filter(Boolean);
      if (p.merksatz.trim()) absaetze.unshift(p.merksatz.trim());
      return absaetze.join('\n\n');
    }
    var teile = PITCH_TEILE.map(function (t) { return '[' + zeit(t.von) + '] ' + t.name + '\n' + (p.teile[t.key].text.trim() || '(noch leer)'); });
    if (merksatzFehltImSchluss(p)) teile.push('Zum Schluss:\n' + p.merksatz.trim());
    return teile.join('\n\n');
  }
  function fassungZeigen() {
    var box = $('er-p-fassung'); if (!box) return;
    var t = fassungText(ER.fassung), h = '';
    if (ER.fassung === 'video') {
      var offen = PITCH_TEILE.filter(function (x) { return !ER.akt.pitch.teile[x.key].bild.trim(); }).length;
      h += '<p class="tb-d" style="margin-bottom:8px">Bild und Ton nebeneinander zum Drehen. Den Ton auch als Untertitel einblenden – viele schauen ohne Ton.' +
        (offen ? ' Bei ' + offen + (offen === 1 ? ' Abschnitt' : ' Abschnitten') + ' fehlt noch „Im Bild“.' : '') + '</p>';
    } else if (ER.fassung === 'schrift') {
      var n = t.length, ueber = n > ER.grenze;
      h += '<p class="tb-d" style="margin-bottom:6px">Für Formularfelder: Satz zum Merken zuerst, dann die vier Abschnitte als Absätze. Fürs Lesen darfst du ausführlicher sein als beim Sprechen.</p>' +
        '<div class="tb-filter" style="margin-bottom:6px">' + GRENZEN.map(function (g) { return '<button data-er-grenze="' + g + '" aria-pressed="' + (ER.grenze === g) + '">' + g + ' Zeichen</button>'; }).join('') + '</div>' +
        '<div class="tb-d" style="margin-bottom:6px' + (ueber ? ';color:#C44030;font-weight:600' : '') + '">' + n + ' von ' + ER.grenze + ' Zeichen' + (ueber ? ' – ' + (n - ER.grenze) + ' zu viel' : '') + '</div>';
    } else {
      h += '<p class="tb-d" style="margin-bottom:8px">Zum Ausdrucken oder als Spickzettel. Laut proben, nicht auswendig lernen – Stichworte reichen.</p>';
    }
    h += '<div class="tb-e" style="border-left-color:#896C32;white-space:pre-line;font-size:13px;line-height:1.5;color:#211D17">' + esc(t) + '</div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-er-grenze]').forEach(function (b) { b.onclick = function () { ER.grenze = +b.dataset.erGrenze; fassungZeigen(); }; });
  }
  function kopieren() {
    var t = fassungText(ER.fassung), info = $('er-p-kopiert');
    function ok() { info.textContent = '✓ kopiert'; setTimeout(function () { info.textContent = ''; }, 1800); }
    function alt() {
      var ta = document.createElement('textarea'); ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { info.textContent = 'Kopieren ging nicht – bitte markieren und kopieren.'; }
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, alt); else alt();
  }

  // ── Probe mit Stoppuhr ────────────────────────────────────────────
  function probeStarten() {
    pitchAktualisieren();
    var o = $('er-probe');
    if (!o) {
      o = document.createElement('div'); o.id = 'er-probe'; o.className = 'mb-wahl'; o.hidden = true; o.style.alignItems = 'center';
      o.innerHTML = '<div class="mb-wahl-box" role="dialog" aria-modal="true" aria-labelledby="er-probe-titel" style="max-height:100%;overflow-y:auto">' +
        '<b id="er-probe-titel">Probe</b><div id="er-probe-inhalt"></div></div>';
      document.body.appendChild(o);
      document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !o.hidden) probeSchliessen(); });
    }
    PR = {idx: -1, start: 0, teilStart: 0, marken: [], uhr: null};
    o.hidden = false;
    probeZeigen();
  }
  function probeSchliessen() {
    if (PR && PR.uhr) clearInterval(PR.uhr);
    PR = null;
    $('er-probe').hidden = true;
    pitchAktualisieren();
  }
  function probeZeigen() {
    var box = $('er-probe-inhalt'), p = ER.akt.pitch;
    if (PR.idx < 0) {
      box.innerHTML = '<p class="tb-d" style="margin-bottom:10px">Sprich laut, wie vor der Jury. Tippe nach jedem Abschnitt auf „Weiter“. Am Ende siehst du, wo du über der Zeit warst. Es wird nichts aufgenommen.</p>' +
        '<button class="btn btn-g" id="er-pr-los">▶ Los</button><button class="mb-abm" id="er-pr-zu" style="width:100%;margin-top:6px">Abbrechen</button>';
      $('er-pr-los').onclick = function () { PR.start = PR.teilStart = Date.now(); PR.idx = 0; PR.uhr = setInterval(uhrZeigen, 250); probeZeigen(); };
      $('er-pr-zu').onclick = probeSchliessen;
      $('er-pr-los').focus();
      return;
    }
    if (PR.idx >= PITCH_TEILE.length) {
      clearInterval(PR.uhr); PR.uhr = null;
      var summe = PR.marken.reduce(function (a, b) { return a + b; }, 0);
      p.probe = {datum: heuteISO(), sek: PR.marken.slice()}; ER.geaendert = true;
      box.innerHTML = PITCH_TEILE.map(function (t, i) {
        var plan = t.bis - t.von, s = PR.marken[i], st = s > plan * 1.15 ? STUFE.allgemein : s > plan * 1.0 ? STUFE.teilweise : STUFE.klar;
        return '<div class="tb-k" style="margin-bottom:6px"><span>' + esc(t.name) + '</span><span style="color:' + st[2] + ';font-weight:600">' + zeit(s) + ' / ' + zeit(plan) + '</span></div>';
      }).join('') +
        '<div class="tb-w" style="margin:10px 0;color:' + (summe > 125 ? STUFE.allgemein[2] : STUFE.klar[2]) + '">Gesamt ' + zeit(summe) + ' von 2:00</div>' +
        '<p class="tb-d" style="margin-bottom:10px">Wird mit „Pitch speichern“ gespeichert.</p>' +
        '<button class="btn btn-g" id="er-pr-nochmal">Nochmal</button><button class="mb-abm" id="er-pr-zu" style="width:100%;margin-top:6px">Schließen</button>';
      $('er-pr-nochmal').onclick = function () { PR = {idx: -1, start: 0, teilStart: 0, marken: [], uhr: null}; probeZeigen(); };
      $('er-pr-zu').onclick = probeSchliessen;
      return;
    }
    var t = PITCH_TEILE[PR.idx], text = p.teile[t.key].text.trim();
    if (t.key === 'schluss' && merksatzFehltImSchluss(p)) text += (text ? '\n\n' : '') + p.merksatz.trim();
    var letzter = PR.idx === PITCH_TEILE.length - 1;
    box.innerHTML = '<div class="lab">' + zeit(t.von) + '–' + zeit(t.bis) + ' · ' + esc(t.name) + ' (' + (PR.idx + 1) + ' von ' + PITCH_TEILE.length + ')</div>' +
      '<div class="tb-d" id="er-pr-uhr" style="margin-bottom:8px"></div>' +
      '<div class="tb-w" style="font-size:17px;font-weight:400;line-height:1.5;white-space:pre-line;margin-bottom:12px">' + (text ? esc(text) : '(noch kein Text)') + '</div>' +
      '<button class="btn btn-g" id="er-pr-weiter">' + (letzter ? 'Fertig' : 'Weiter →') + '</button><button class="mb-abm" id="er-pr-zu" style="width:100%;margin-top:6px">Abbrechen</button>';
    $('er-pr-weiter').onclick = function () {
      var jetzt = Date.now();
      PR.marken.push(Math.round((jetzt - PR.teilStart) / 1000)); PR.teilStart = jetzt; PR.idx++;
      probeZeigen();
    };
    $('er-pr-zu').onclick = probeSchliessen;
    $('er-pr-weiter').focus();
    uhrZeigen();
  }
  function uhrZeigen() {
    var el = $('er-pr-uhr'); if (!el || !PR || PR.idx < 0 || PR.idx >= PITCH_TEILE.length) return;
    var t = PITCH_TEILE[PR.idx], jetzt = Date.now(), ab = (jetzt - PR.teilStart) / 1000, plan = t.bis - t.von;
    el.innerHTML = 'Abschnitt <span style="font-weight:600;color:' + (ab > plan ? STUFE.allgemein[2] : 'inherit') + '">' + zeit(ab) + '</span> von ' + zeit(plan) + ' · gesamt ' + zeit((jetzt - PR.start) / 1000);
  }

  window.zeigeEinreichungen = zeigeEinreichungen;
  window.einreichungenVerlassenOk = verlassenOk;
})();
