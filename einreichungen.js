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
        '<button class="tb-edit" data-er-check="' + esc(e.id) + '">Wettbewerbs-Check</button></div></div>';
    });
    h += '<button class="mb-neu" id="er-neu">+ Neue Einreichung</button><div id="er-neu-form" hidden></div>';
    box.innerHTML = h;
    box.querySelectorAll('[data-er-auf]').forEach(function (b) { b.onclick = function () { oeffnen(b.dataset.erAuf, 'text'); }; });
    box.querySelectorAll('[data-er-check]').forEach(function (b) { b.onclick = function () { oeffnen(b.dataset.erCheck, 'check'); }; });
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
    ER.akt = JSON.parse(JSON.stringify(e)); ER.akt.pruefung = pruefung(ER.akt);
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
        '<button data-er-tab="check" aria-pressed="' + (ER.tab === 'check') + '">Wettbewerbs-Check</button></div>' +
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
    if (ER.tab === 'check') checkZeigen(); else textZeigen();
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
  }

  async function speichern() {
    felderLesen();
    var e = ER.akt, f = $('er-fehler');
    if (f) f.textContent = '';
    var r = await sb.from('einreichungen').update({
      titel: e.titel, wettbewerb: e.wettbewerb, deadline: e.deadline, kernbotschaft: e.kernbotschaft,
      anforderungen: e.anforderungen, ausgangslage: e.ausgangslage, loesung: e.loesung, wirkung: e.wirkung,
      luecken: e.luecken, pruefung: e.pruefung
    }).eq('id', e.id).select('*').single();
    if (r.error) {
      var m = 'Konnte nicht gespeichert werden: ' + r.error.message;
      if (f) f.textContent = m; else alert(m);
      return false;
    }
    ER.geaendert = false;
    var neu = r.data; neu.pruefung = pruefung(neu);
    ER.liste = ER.liste.map(function (x) { return String(x.id) === String(neu.id) ? neu : x; });
    ER.akt = JSON.parse(JSON.stringify(neu)); ER.akt.pruefung = pruefung(ER.akt);
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

  window.zeigeEinreichungen = zeigeEinreichungen;
  window.einreichungenVerlassenOk = verlassenOk;
})();
