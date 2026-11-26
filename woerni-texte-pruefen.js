// Meisterin-Bereich › Fragen & Lernpläne › „Wörni-Texte prüfen“
//
// Zeigt zum Durchlesen und Abhaken:
//  - alle Hilfetexte hinter „Wörni, ich steh auf der Leitung“ (woerni-leitung.js)
//  - alle Paare aus dem Denkspiel „Paare finden“ (paare-finden.js)
// Liest direkt aus diesen Dateien, ist also immer auf dem Stand der App.
//
// Nur Anzeige: Die Texte sind nicht geheim (sie stehen ohnehin in der App), es
// wird nichts an den Server geschickt. Das Häkchen „Geprüft“ merkt sich nur
// dieses Gerät (localStorage). Die Seite öffnet sich nur, wenn die App die
// Meisterin-Rolle bestätigt hat (ISTMEISTERIN, serverseitig geprüft).
// Aussehen: nur vorhandene Klassen des Meisterin-Bereichs (.mb-tabs, .tb-filter,
// .tb-e, .tb-k, .tb-w, .tb-d, .tb-ok, .lab, .pt-edit-k, .laden).
(function () {
  var KEY = 'woerni-durchsicht';
  var ANSICHT = 'hilfe', THEMA = 'alle', SUCHE = '';
  // Reihenfolge und Kurzname der Themen (Hilfetexte)
  var THEMEN = [
    ['Farbenlehre & Coloration', 'Farbe'], ['Haarkunde & Haarstruktur', 'Haarkunde'],
    ['Dauerwelle & Umformung', 'Dauerwelle'], ['Hygiene & Schutzmaßnahmen', 'Hygiene'],
    ['Werkzeugkunde', 'Werkzeug'], ['Hautkunde', 'Hautkunde'],
    ['Haarwäsche & Kopfmassage', 'Haarwäsche'], ['Schnitt', 'Schnitt']
  ];
  var LJ_TEXT = { 1: 'ab 1. Lehrjahr', 2: 'ab 2. Lehrjahr', 3: 'ab 3. Lehrjahr' };
  var TEXT = 'font-size:13px;color:#211D17;line-height:1.5;margin:0 0 8px';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lesen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function schreiben(g) { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch (e) {} }

  // Quizfrage zu einer id (Lernquiz: FB, Schnittwerkstatt: Anfang des Fragetexts aus dem Eintrag)
  function quizFrage(id, eintrag) {
    if (id.indexOf('sw') === 0) return { f: (eintrag.zu || '') + ' …', richtig: '', th: 'Schnitt', wo: 'Schnittwerkstatt, Frage ' + id.slice(2) };
    var fb = window.FB || {};
    for (var k in fb) {
      var a = fb[k] || [];
      for (var i = 0; i < a.length; i++) if (a[i] && a[i].id === id) {
        return { f: a[i].f, richtig: a[i].o ? a[i].o[a[i].r] : '', th: a[i].th === 'Haarwäsche' ? 'Haarwäsche & Kopfmassage' : a[i].th, wo: 'Lernquiz' };
      }
    }
    return { f: '', richtig: '', th: '', wo: 'Lernquiz' };
  }

  // Hilfetexte: ein Eintrag kann zu mehreren Fragen gehören (gleiche Frage in mehreren Lehrjahren)
  function hilfeListe() {
    var T = (window.WOERNI_LEITUNG && WOERNI_LEITUNG.texte) || {}, liste = [], schon = [];
    Object.keys(T).forEach(function (id) {
      var e = T[id], i = schon.indexOf(e);
      if (i < 0) { schon.push(e); liste.push({ e: e, ids: [id], fragen: [quizFrage(id, e)] }); }
      else { liste[i].ids.push(id); liste[i].fragen.push(quizFrage(id, e)); }
    });
    liste.forEach(function (x) { x.th = x.fragen[0].th; x.key = x.ids.join('+'); });
    return liste;
  }
  function paarListe() {
    var liste = [];
    (window.PAARE_THEMEN || []).forEach(function (t) {
      t.p.forEach(function (p) { liste.push({ b: p.b, s: p.s, lj: p.lj, th: t.th, n: t.n, key: 'paar:' + p.b }); });
    });
    return liste;
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

  function pruefKnopf(key, ok) {
    return ok ? '<div class="tb-ok">✓ Geprüft <button type="button" class="pt-edit-k" data-wt-k="' + esc(key) + '" style="margin-left:8px">zurücknehmen</button></div>'
      : '<button type="button" class="pt-edit-k" data-wt-k="' + esc(key) + '">Als geprüft markieren</button>';
  }
  function hilfeKarte(x, g) {
    var e = x.e, ok = !!g[x.key];
    var fragen = x.fragen.map(function (f, i) {
      return '<div class="tb-k"' + (i ? ' style="margin-top:8px"' : '') + '><span><b>' + esc(x.ids[i]) + '</b> · ' + esc(f.wo) + '</span></div>' +
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
      pruefKnopf(x.key, ok) + '</div>';
  }
  function paarKarte(x, g) {
    var ok = !!g[x.key];
    return '<div class="tb-e' + (ok ? ' ok' : '') + '"><div class="tb-k"><span>' + esc(x.n) + '</span><span>' + esc(LJ_TEXT[x.lj] || '') + '</span></div>' +
      '<div class="tb-w">' + esc(x.b) + '</div><div class="tb-d" style="font-size:13px;color:#211D17;margin-bottom:6px">' + esc(x.s) + '</div>' +
      pruefKnopf(x.key, ok) + '</div>';
  }

  function liste() {
    var box = document.getElementById('wt-liste'); if (!box) return;
    var g = lesen(), alle = ANSICHT === 'paare' ? paarListe() : hilfeListe();
    var treffer = alle.filter(function (x) { return passt(x, ANSICHT); });
    var geprueft = alle.filter(function (x) { return g[x.key]; }).length;
    var wort = ANSICHT === 'paare' ? 'Paare' : 'Texte';
    var h = '<div class="tb-k" style="margin-bottom:10px"><span>' + treffer.length + ' von ' + alle.length + ' ' + wort + '</span><span>Geprüft: ' + geprueft + ' von ' + alle.length + '</span></div>';
    if (!treffer.length) h += '<div class="laden">Nichts gefunden. Anderes Suchwort oder „Alle“ wählen.</div>';
    themenFuer(ANSICHT).forEach(function (t) {
      var gr = treffer.filter(function (x) { return x.th === t[0]; });
      if (!gr.length) return;
      h += '<span class="lab" style="margin-top:14px">' + esc(t[1]) + ' · ' + gr.length + '</span>' +
        gr.map(function (x) { return ANSICHT === 'paare' ? paarKarte(x, g) : hilfeKarte(x, g); }).join('');
    });
    box.innerHTML = h;
    box.querySelectorAll('[data-wt-k]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-wt-k'), gg = lesen();
        if (gg[k]) delete gg[k]; else gg[k] = 1;
        schreiben(gg); liste();
      };
    });
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
    box.querySelectorAll('[data-wt-a]').forEach(function (b) { b.onclick = function () { ANSICHT = b.getAttribute('data-wt-a'); THEMA = 'alle'; zeichnen(); }; });
    box.querySelectorAll('[data-wt-t]').forEach(function (b) { b.onclick = function () { THEMA = b.getAttribute('data-wt-t'); zeichnen(); }; });
    document.getElementById('wt-suche').addEventListener('input', function (e) { SUCHE = e.target.value.trim().toLowerCase(); liste(); });
    liste();
  }

  window.zeigeWoerniTexte = function () {
    if (!window.ISTMEISTERIN) return;
    if (typeof window.zeige === 'function') window.zeige('s-woerni-texte');
    zeichnen();
  };
})();
