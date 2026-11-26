// Meisterin-Bereich › Fragen & Lernpläne › „Wörni-Texte prüfen“
//
// Zeigt, prüft und bearbeitet:
//  - die Hilfetexte hinter „Wörni, ich steh auf der Leitung“ (woerni-leitung.js)
//  - die Paare aus dem Denkspiel „Paare finden“ (paare-finden.js)
// Bearbeiten, Löschen und Hinzufügen speichert woerni-texte-daten.js als Änderung in
// public.lerntool_daten (schreiben nur Meisterin, serverseitig über ist_meisterin()).
// „Original wiederherstellen“ entfernt die Änderung, dann gilt wieder der Grundtext.
// Das Häkchen „Geprüft“ merkt sich nur dieses Gerät (localStorage).
// Die Seite öffnet sich nur, wenn die App die Meisterin-Rolle bestätigt hat (ISTMEISTERIN).
// Aussehen: nur vorhandene Klassen des Meisterin-Bereichs (.mb-tabs, .tb-filter, .tb-e,
// .tb-k, .tb-w, .tb-d, .tb-ok, .lab, .pt-edit-k, .laden, .mb-neu, .pte-l, .pte-fehler,
// .btn .btn-g, .mb-abm) und die globalen Formularfelder.
(function () {
  var KEY = 'woerni-durchsicht';
  var ANSICHT = 'hilfe', THEMA = 'alle', SUCHE = '';
  var EDIT = null;   // {art:'h'|'p', key, ids?, neu?}
  var THEMEN = [
    ['Farbenlehre & Coloration', 'Farbe'], ['Haarkunde & Haarstruktur', 'Haarkunde'],
    ['Dauerwelle & Umformung', 'Dauerwelle'], ['Hygiene & Schutzmaßnahmen', 'Hygiene'],
    ['Werkzeugkunde', 'Werkzeug'], ['Hautkunde', 'Hautkunde'],
    ['Haarwäsche & Kopfmassage', 'Haarwäsche'], ['Schnitt', 'Schnitt']
  ];
  var LJ_TEXT = { 1: 'ab 1. Lehrjahr', 2: 'ab 2. Lehrjahr', 3: 'ab 3. Lehrjahr' };
  var TEXT = 'font-size:13px;color:#211D17;line-height:1.5;margin:0 0 8px';
  var FEHLER_SPEICHERN = 'Speichern hat nicht geklappt. Bist du als Meisterin angemeldet und online?';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lesen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function schreiben(g) { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch (e) {} }
  function D() { return window.WOERNI_DATEN; }

  // Alle Lernquiz-Fragen (für die Anzeige der Quizfrage und für neue Hilfetexte)
  function alleFragen() {
    var fb = window.FB || {}, liste = [];
    Object.keys(fb).forEach(function (k) { (fb[k] || []).forEach(function (q) { if (q && q.id) liste.push(q); }); });
    return liste;
  }
  function quizFrage(id, eintrag) {
    if (id.indexOf('sw') === 0) return { f: (eintrag.zu || '') + ' …', richtig: '', th: 'Schnitt', wo: 'Schnittwerkstatt, Frage ' + id.slice(2) };
    var q = alleFragen().filter(function (x) { return x.id === id; })[0];
    if (!q) return { f: '', richtig: '', th: '', wo: 'Lernquiz' };
    return { f: q.f, richtig: q.o ? q.o[q.r] : '', th: q.th === 'Haarwäsche' ? 'Haarwäsche & Kopfmassage' : q.th, wo: 'Lernquiz' };
  }

  // Hilfetexte gruppieren (gleiche Frage in mehreren Lehrjahren = ein Eintrag)
  function hilfeListe() {
    var T = (window.WOERNI_LEITUNG && WOERNI_LEITUNG.texte) || {}, liste = [], schon = [];
    Object.keys(T).forEach(function (id) {
      var e = T[id], i = schon.indexOf(e);
      if (i < 0) { schon.push(e); liste.push({ e: e, ids: [id], fragen: [quizFrage(id, e)] }); }
      else { liste[i].ids.push(id); liste[i].fragen.push(quizFrage(id, e)); }
    });
    liste.forEach(function (x) {
      x.th = x.fragen[0].th; x.key = x.ids.join('+');
      x.neu = D() && !x.ids.some(function (id) { return D().original(id); });
    });
    return liste;
  }
  function paarListe() {
    var liste = [];
    (window.PAARE_THEMEN || []).forEach(function (t) {
      t.p.forEach(function (p) { liste.push({ b: p.b, s: p.s, lj: p.lj, th: t.th, n: t.n, key: 'paar:' + p.b, dkey: p.key || ('p:' + p.b), geaendert: p.geaendert, neu: p.neu }); });
    });
    return liste;
  }
  function geloeschte(ansicht) {
    if (!D()) return [];
    var st = D().stand(), out = [];
    if (ansicht === 'hilfe') {
      Object.keys(st.h).forEach(function (id) { if (st.h[id] && st.h[id].geloescht) out.push({ key: id, text: id + ' · ' + (quizFrage(id, D().original(id) || {}).f || '') }); });
    } else {
      Object.keys(st.p).forEach(function (k) { if (st.p[k] && st.p[k].geloescht) out.push({ key: k, text: k.replace(/^p:/, '') }); });
    }
    return out;
  }
  function themenFuer(ansicht) {
    if (ansicht === 'paare') return (window.PAARE_THEMEN || []).map(function (t) { return [t.th, t.n]; });
    return THEMEN;
  }
  function passt(x, ansicht) {
    if (THEMA !== 'alle' && x.th !== THEMA) return false;
    if (!SUCHE) return true;
    var t = ansicht === 'paare' ? (x.b + ' ' + x.s + ' ' + x.n)
      : [x.e.bild, x.e.frage, x.e.ja, x.e.nein, x.e.o.join(' '), x.ids.join(' '), x.fragen.map(function (f) { return f.f + ' ' + f.richtig; }).join(' ')].join(' ');
    t = t.toLowerCase();
    return SUCHE.split(/\s+/).every(function (w) { return t.indexOf(w) >= 0; });
  }

  // ── Anzeige ──
  function knoepfe(x, art) {
    var ok = !!lesen()[x.key];
    var hatAenderung = art === 'h' ? (x.e.geaendert && !x.neu) : (x.geaendert);
    return '<div style="display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center;margin-top:4px">' +
      (ok ? '<span class="tb-ok" style="margin:0">✓ Geprüft</span>' : '') +
      '<button type="button" class="pt-edit-k" data-wt-pruef="' + esc(x.key) + '">' + (ok ? 'Häkchen zurücknehmen' : 'Als geprüft markieren') + '</button>' +
      '<button type="button" class="pt-edit-k" data-wt-edit="' + esc(x.key) + '">Bearbeiten</button>' +
      '<button type="button" class="pt-edit-k" data-wt-del="' + esc(x.key) + '" style="color:#C44030">Löschen</button>' +
      (hatAenderung ? '<button type="button" class="pt-edit-k" data-wt-orig="' + esc(x.key) + '">Original wiederherstellen</button>' : '') +
    '</div>';
  }
  function marke(x, art) {
    var neu = x.neu, geaendert = art === 'h' ? x.e.geaendert : x.geaendert;
    if (neu) return ' · <b style="color:#896C32">neu</b>';
    if (geaendert) return ' · <b style="color:#896C32">geändert</b>';
    return '';
  }
  function hilfeKarte(x) {
    if (EDIT && EDIT.art === 'h' && EDIT.key === x.key) return hilfeForm(x);
    var e = x.e, ok = !!lesen()[x.key];
    var fragen = x.fragen.map(function (f, i) {
      return '<div class="tb-k"' + (i ? ' style="margin-top:8px"' : '') + '><span><b>' + esc(x.ids[i]) + '</b> · ' + esc(f.wo) + (i === 0 ? marke(x, 'h') : '') + '</span></div>' +
        '<div class="tb-w">' + esc(f.f) + '</div>' + (f.richtig ? '<div class="tb-d">Richtig im Quiz: <b style="color:#896C32">' + esc(f.richtig) + '</b></div>' : '');
    }).join('');
    var opt = e.o.map(function (o, i) {
      return '<div style="font-size:13px;line-height:1.45;' + (i === e.r ? 'color:#896C32;font-weight:600' : 'color:#6B6455') + '">' + (i === e.r ? '✓ ' : '· ') + esc(o) + '</div>';
    }).join('');
    return '<div class="tb-e' + (ok ? ' ok' : '') + '">' + fragen +
      '<div style="margin-top:10px"><span class="lab">Wörni: Bild / Eselsbrücke</span><p style="' + TEXT + '">' + esc(e.bild) + '</p></div>' +
      '<div><span class="lab">Gegenfrage</span><p style="' + TEXT + ';font-weight:600;margin-bottom:4px">' + esc(e.frage) + '</p>' + opt + '</div>' +
      '<div style="margin-top:10px"><span class="lab">Wenn richtig</span><p style="' + TEXT + '">' + esc(e.ja) + '</p></div>' +
      '<div><span class="lab">Wenn falsch</span><p style="' + TEXT + '">' + esc(e.nein) + '</p></div>' +
      knoepfe(x, 'h') + '</div>';
  }
  function paarKarte(x) {
    if (EDIT && EDIT.art === 'p' && EDIT.key === x.key) return paarForm(x);
    var ok = !!lesen()[x.key];
    return '<div class="tb-e' + (ok ? ' ok' : '') + '"><div class="tb-k"><span>' + esc(x.n) + marke(x, 'p') + '</span><span>' + esc(LJ_TEXT[x.lj] || '') + '</span></div>' +
      '<div class="tb-w">' + esc(x.b) + '</div><div class="tb-d" style="font-size:13px;color:#211D17;margin-bottom:6px">' + esc(x.s) + '</div>' +
      knoepfe(x, 'p') + '</div>';
  }

  // ── Formulare ──
  function feld(id, label, wert, mehrzeilig) {
    return '<label class="pte-l" for="' + id + '">' + label + '</label>' +
      (mehrzeilig ? '<textarea id="' + id + '" rows="4">' + esc(wert) + '</textarea>' : '<input type="text" id="' + id + '" value="' + esc(wert) + '">');
  }
  function hilfeForm(x) {
    var e = x ? x.e : { bild: '', frage: '', o: ['', '', ''], r: 0, ja: '', nein: '' };
    var o = e.o.slice(); while (o.length < 3) o.push('');
    var kopf;
    if (x) kopf = '<div class="tb-k"><span><b>' + esc(x.ids.join(', ')) + '</b> bearbeiten</span></div><div class="tb-w">' + esc(x.fragen[0].f) + '</div>';
    else {
      var T = (window.WOERNI_LEITUNG && WOERNI_LEITUNG.texte) || {};
      var frei = alleFragen().filter(function (q) { return q.t === 'mc' && !T[q.id]; });
      kopf = '<div class="tb-w">Neuer Hilfetext</div>' +
        '<label class="pte-l" for="wt-f-id">Zu welcher Quizfrage? <span>(Multiple Choice ohne Hilfetext)</span></label>' +
        '<select id="wt-f-id"><option value="">Bitte wählen …</option>' + frei.map(function (q) {
          return '<option value="' + esc(q.id) + '">' + esc(q.id + ' · ' + q.f) + '</option>';
        }).join('') + '</select>';
    }
    return '<div class="tb-e" style="border-left-color:#896C32">' + kopf +
      feld('wt-f-bild', 'Wörni: Bild / Eselsbrücke', e.bild, true) +
      feld('wt-f-frage', 'Gegenfrage', e.frage) +
      feld('wt-f-o0', 'Antwort 1', o[0]) + feld('wt-f-o1', 'Antwort 2', o[1]) + feld('wt-f-o2', 'Antwort 3', o[2]) +
      '<label class="pte-l" for="wt-f-r">Richtige Antwort</label><select id="wt-f-r">' + [0, 1, 2].map(function (i) {
        return '<option value="' + i + '"' + (i === e.r ? ' selected' : '') + '>Antwort ' + (i + 1) + '</option>';
      }).join('') + '</select>' +
      feld('wt-f-ja', 'Rückmeldung, wenn richtig', e.ja, true) +
      feld('wt-f-nein', 'Rückmeldung, wenn falsch', e.nein, true) +
      '<div class="pte-fehler" id="wt-f-fehler"></div>' +
      '<button type="button" class="btn btn-g" id="wt-f-speichern" style="margin-top:10px">Speichern</button>' +
      '<button type="button" class="mb-abm" id="wt-f-abbrechen" style="width:100%">Abbrechen</button></div>';
  }
  function paarForm(x) {
    var p = x || { b: '', s: '', lj: 1, th: THEMA !== 'alle' ? THEMA : ((window.PAARE_THEMEN || [])[0] || {}).th };
    return '<div class="tb-e" style="border-left-color:#896C32"><div class="tb-w">' + (x ? 'Paar bearbeiten' : 'Neues Paar') + '</div>' +
      feld('wt-f-b', 'Fachbegriff', p.b) +
      feld('wt-f-s', 'Situation oder Beschreibung', p.s, true) +
      '<label class="pte-l" for="wt-f-th">Thema</label><select id="wt-f-th"' + (x ? ' disabled' : '') + '>' + (window.PAARE_THEMEN || []).map(function (t) {
        return '<option value="' + esc(t.th) + '"' + (t.th === p.th ? ' selected' : '') + '>' + esc(t.n) + '</option>';
      }).join('') + '</select>' +
      '<label class="pte-l" for="wt-f-lj">Ab Lehrjahr</label><select id="wt-f-lj">' + [1, 2, 3].map(function (l) {
        return '<option value="' + l + '"' + (l === p.lj ? ' selected' : '') + '>' + l + '. Lehrjahr</option>';
      }).join('') + '</select>' +
      '<div class="pte-fehler" id="wt-f-fehler"></div>' +
      '<button type="button" class="btn btn-g" id="wt-f-speichern" style="margin-top:10px">Speichern</button>' +
      '<button type="button" class="mb-abm" id="wt-f-abbrechen" style="width:100%">Abbrechen</button></div>';
  }
  function wert(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function fehler(t) { var el = document.getElementById('wt-f-fehler'); if (el) el.textContent = t; }

  function speichernHilfe(x) {
    var ids = x ? x.ids : [wert('wt-f-id')];
    var w = { bild: wert('wt-f-bild'), frage: wert('wt-f-frage'), o: [wert('wt-f-o0'), wert('wt-f-o1'), wert('wt-f-o2')], r: +wert('wt-f-r'), ja: wert('wt-f-ja'), nein: wert('wt-f-nein') };
    if (!ids[0]) return fehler('Bitte zuerst die Quizfrage wählen.');
    if (!w.bild || !w.frage || w.o.some(function (o) { return !o; }) || !w.ja || !w.nein) return fehler('Bitte alle Felder ausfüllen.');
    var knopf = document.getElementById('wt-f-speichern'); knopf.disabled = true;
    Promise.all(ids.map(function (id) { return D().speichern(D().TYP_H, id, w); }))
      .then(function () { EDIT = null; liste(); }, function () { knopf.disabled = false; fehler(FEHLER_SPEICHERN); });
  }
  function speichernPaar(x) {
    var w = { b: wert('wt-f-b'), s: wert('wt-f-s'), lj: +wert('wt-f-lj'), th: x ? x.th : wert('wt-f-th') };
    if (!w.b || !w.s) return fehler('Bitte Fachbegriff und Situation ausfüllen.');
    var doppelt = paarListe().some(function (p) { return p.b.toLowerCase() === w.b.toLowerCase() && (!x || p.key !== x.key); });
    if (doppelt) return fehler('Diesen Fachbegriff gibt es schon. Jeder Begriff darf nur einmal vorkommen.');
    var schluessel = x ? x.dkey : 'neu:' + Date.now();
    var knopf = document.getElementById('wt-f-speichern'); knopf.disabled = true;
    D().speichern(D().TYP_P, schluessel, w).then(function () { EDIT = null; liste(); }, function () { knopf.disabled = false; fehler(FEHLER_SPEICHERN); });
  }

  // ── Aktionen ──
  function finde(key) {
    return ANSICHT === 'paare' ? paarListe().filter(function (p) { return p.key === key; })[0] : hilfeListe().filter(function (h) { return h.key === key; })[0];
  }
  function loeschen(x) {
    if (!window.confirm('Diesen ' + (ANSICHT === 'paare' ? 'Paar' : 'Hilfetext') + ' wirklich löschen? Die Lehrlinge sehen ihn dann nicht mehr.')) return;
    var p;
    if (ANSICHT === 'paare') p = D().speichern(D().TYP_P, x.dkey, x.neu ? null : { geloescht: true });
    else p = Promise.all(x.ids.map(function (id) { return D().speichern(D().TYP_H, id, D().original(id) ? { geloescht: true } : null); }));
    p.then(liste, function () { alert(FEHLER_SPEICHERN); });
  }
  function original(x) {
    if (!window.confirm('Die Änderung verwerfen und den ursprünglichen Text wiederherstellen?')) return;
    var p = ANSICHT === 'paare' ? D().speichern(D().TYP_P, x.dkey, null)
      : Promise.all(x.ids.map(function (id) { return D().speichern(D().TYP_H, id, null); }));
    p.then(liste, function () { alert(FEHLER_SPEICHERN); });
  }
  function wiederherstellen(key) {
    D().speichern(ANSICHT === 'paare' ? D().TYP_P : D().TYP_H, key, null).then(liste, function () { alert(FEHLER_SPEICHERN); });
  }

  function liste() {
    var box = document.getElementById('wt-liste'); if (!box) return;
    var g = lesen(), alle = ANSICHT === 'paare' ? paarListe() : hilfeListe();
    var treffer = alle.filter(function (x) { return passt(x, ANSICHT); });
    var geprueft = alle.filter(function (x) { return g[x.key]; }).length;
    var wort = ANSICHT === 'paare' ? 'Paare' : 'Texte';
    var h = (D() ? '<button type="button" class="mb-neu" id="wt-neu" style="margin:0 0 12px">' + (ANSICHT === 'paare' ? '+ Neues Paar anlegen' : '+ Neuen Hilfetext anlegen') + '</button>' : '') +
      (EDIT && EDIT.neu ? (ANSICHT === 'paare' ? paarForm(null) : hilfeForm(null)) : '') +
      '<div class="tb-k" style="margin-bottom:10px"><span>' + treffer.length + ' von ' + alle.length + ' ' + wort + '</span><span>Geprüft: ' + geprueft + ' von ' + alle.length + '</span></div>';
    if (!treffer.length) h += '<div class="laden">Nichts gefunden. Anderes Suchwort oder „Alle“ wählen.</div>';
    themenFuer(ANSICHT).forEach(function (t) {
      var gr = treffer.filter(function (x) { return x.th === t[0]; });
      if (!gr.length) return;
      h += '<span class="lab" style="margin-top:14px">' + esc(t[1]) + ' · ' + gr.length + '</span>' +
        gr.map(function (x) { return ANSICHT === 'paare' ? paarKarte(x) : hilfeKarte(x); }).join('');
    });
    var weg = geloeschte(ANSICHT);
    if (weg.length) {
      h += '<span class="lab" style="margin-top:18px">Gelöscht · ' + weg.length + '</span>' + weg.map(function (d) {
        return '<div class="tb-e"><div class="tb-d">' + esc(d.text) + '</div><button type="button" class="pt-edit-k" data-wt-zurueck="' + esc(d.key) + '">Wiederherstellen</button></div>';
      }).join('');
    }
    box.innerHTML = h;

    var neu = document.getElementById('wt-neu');
    if (neu) neu.onclick = function () { EDIT = { art: ANSICHT === 'paare' ? 'p' : 'h', neu: true }; liste(); };
    box.querySelectorAll('[data-wt-pruef]').forEach(function (b) {
      b.onclick = function () { var k = b.getAttribute('data-wt-pruef'), gg = lesen(); if (gg[k]) delete gg[k]; else gg[k] = 1; schreiben(gg); liste(); };
    });
    box.querySelectorAll('[data-wt-edit]').forEach(function (b) {
      b.onclick = function () { EDIT = { art: ANSICHT === 'paare' ? 'p' : 'h', key: b.getAttribute('data-wt-edit') }; liste(); };
    });
    box.querySelectorAll('[data-wt-del]').forEach(function (b) { b.onclick = function () { var x = finde(b.getAttribute('data-wt-del')); if (x) loeschen(x); }; });
    box.querySelectorAll('[data-wt-orig]').forEach(function (b) { b.onclick = function () { var x = finde(b.getAttribute('data-wt-orig')); if (x) original(x); }; });
    box.querySelectorAll('[data-wt-zurueck]').forEach(function (b) { b.onclick = function () { wiederherstellen(b.getAttribute('data-wt-zurueck')); }; });
    var sp = document.getElementById('wt-f-speichern'), ab = document.getElementById('wt-f-abbrechen');
    if (sp && EDIT) {
      var x = EDIT.neu ? null : finde(EDIT.key);
      sp.onclick = function () { if (EDIT.art === 'p') speichernPaar(x); else speichernHilfe(x); };
      ab.onclick = function () { EDIT = null; liste(); };
      var erstes = box.querySelector('.tb-e[style*="896C32"]');
      if (erstes && erstes.scrollIntoView) erstes.scrollIntoView({ block: 'start' });
    }
  }

  function zeichnen() {
    var box = document.getElementById('wt-inhalt'); if (!box) return;
    var nH = hilfeListe().length, nP = paarListe().length;
    var themen = [['alle', 'Alle']].concat(themenFuer(ANSICHT));
    box.innerHTML =
      '<div class="mb-tabs" role="tablist">' +
        '<button type="button" role="tab" data-wt-a="hilfe" aria-selected="' + (ANSICHT === 'hilfe') + '">Wörni-Hilfe · ' + nH + '</button>' +
        '<button type="button" role="tab" data-wt-a="paare" aria-selected="' + (ANSICHT === 'paare') + '">Paare finden · ' + nP + '</button>' +
      '</div>' +
      '<input type="search" id="wt-suche" placeholder="Suchen, z. B. Talg, Blondierung, 2-mc3" aria-label="Texte durchsuchen" value="' + esc(SUCHE) + '">' +
      '<div class="tb-filter">' + themen.map(function (t) {
        return '<button type="button" data-wt-t="' + esc(t[0]) + '" aria-pressed="' + (THEMA === t[0]) + '">' + esc(t[1]) + '</button>';
      }).join('') + '</div>' +
      '<div id="wt-liste"></div>';
    box.querySelectorAll('[data-wt-a]').forEach(function (b) { b.onclick = function () { ANSICHT = b.getAttribute('data-wt-a'); THEMA = 'alle'; EDIT = null; zeichnen(); }; });
    box.querySelectorAll('[data-wt-t]').forEach(function (b) { b.onclick = function () { THEMA = b.getAttribute('data-wt-t'); zeichnen(); }; });
    document.getElementById('wt-suche').addEventListener('input', function (e) { SUCHE = e.target.value.trim().toLowerCase(); liste(); });
    liste();
  }

  window.zeigeWoerniTexte = function () {
    if (!window.ISTMEISTERIN) return;
    if (typeof window.zeige === 'function') window.zeige('s-woerni-texte');
    EDIT = null;
    zeichnen();
    if (D()) D().laden(function (ok) { if (ok && !EDIT) zeichnen(); });   // frischer Stand vom Server
  };
})();
