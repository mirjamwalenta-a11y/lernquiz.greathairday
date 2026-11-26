// „Paare finden“ – Fachbegriff und Situation aus dem Salon zusammenbringen (Lern-Tool, Üben)
//
// Kein Memory mit gleichen Bildern: Der Lehrling muss den Begriff aus dem Kopf
// abrufen und einer echten Situation zuordnen (Abrufen + Anwenden).
// Standard ist „Gemischt“ (Themen durcheinander), weil gemischtes Üben besser hält.
//
// Regeln:
//  - 6 Paare pro Runde. Nur Paare bis zum eigenen Lehrjahr (LEHRJAHR im Lern-Tool).
//  - Ein Paar zählt als gewusst, wenn es beim ersten Versuch stimmt.
//  - Am Ende: Ergebnis, die verwechselten Paare noch einmal ausgeschrieben,
//    Speichern im Verlauf/Kompetenzstand über quiz-verlauf.js (nur mit Lehrlings-Login).
//  - Regelbasiert, keine KI, keine neue Tabelle. Aussehen: nur vorhandene Klassen
//    des Lern-Tools (.card, .btn-toggle, .opt-btn, .fb-g/.fb-r, .btn-primary, .btn-ghost).
//  - Keine Namen von Personen (CLAUDE.md, Regel 2). Inhalte fachlich durch die Meisterin prüfen.
//
// Felder je Paar: b = Fachbegriff, s = Situation/Beschreibung, lj = ab Lehrjahr (1–3).
(function () {
  var THEMEN = [
    { k: 'farbe', n: 'Farbe', th: 'Farbenlehre & Coloration', p: [
      { b: 'Komplementärfarbe', s: 'Blau gegen Orange, Violett gegen Gelb: die Farbe, die einen Farbstich aufhebt.', lj: 1 },
      { b: 'Tonhöhe', s: 'Die Zahl vor dem Punkt auf der Tube. Sie sagt, wie hell oder dunkel die Farbe ist.', lj: 1 },
      { b: 'Reflex', s: 'Die Zahl nach dem Punkt auf der Tube, zum Beispiel .3 für Gold.', lj: 1 },
      { b: 'Oxidant', s: 'Wird zur Farbcreme gemischt, hellt das Naturpigment auf und entwickelt die Farbe.', lj: 1 },
      { b: 'Tönung', s: 'Die Farbe wäscht sich nach einigen Haarwäschen wieder aus.', lj: 1 },
      { b: 'Heißer Ansatz', s: 'Bei der Erstfärbung wird der Ansatz heller als die Längen, weil die Kopfhaut wärmt.', lj: 1 },
      { b: 'Untergrund', s: 'Nach dem Aufhellen von dunkelbraunem Haar schimmert es rot-orange durch.', lj: 2 },
      { b: 'Balayage', s: 'Die Aufhellung wird freihand ins Haar gemalt, ohne harten Ansatz.', lj: 2 },
      { b: 'Vorpigmentierung', s: 'Sehr helles Haar soll viel dunkler werden: Zuerst kommen warme Pigmente zurück ins Haar.', lj: 3 }
    ]},
    { k: 'haar', n: 'Haarkunde', th: 'Haarkunde & Haarstruktur', p: [
      { b: 'Cuticula', s: 'Die äußere Schuppenschicht. Liegt sie glatt an, glänzt das Haar.', lj: 1 },
      { b: 'Cortex', s: 'Die dicke Rinde im Inneren des Haares. Hier sitzen die Farbpigmente.', lj: 1 },
      { b: 'Keratin', s: 'Das Eiweiß, aus dem das Haar hauptsächlich besteht.', lj: 1 },
      { b: 'Anagen', s: 'Die Wachstumsphase. Sie dauert Jahre, und rund 85 % der Haare sind gerade darin.', lj: 1 },
      { b: 'Telogen', s: 'Die Ruhephase. Das Haar löst sich und fällt beim Kämmen aus.', lj: 1 },
      { b: 'Porosität', s: 'Blondiertes Haar saugt die Kur sofort auf und ist schnell wieder trocken.', lj: 1 },
      { b: 'Disulfidbrücken', s: 'Feste Schwefelverbindungen im Cortex, die die Form des Haares halten.', lj: 2 },
      { b: 'Eumelanin', s: 'Das dunkle, braun-schwarze Pigment im Haar.', lj: 2 },
      { b: 'Phäomelanin', s: 'Das rot-gelbe Pigment, das bei rotblondem Haar überwiegt.', lj: 2 },
      { b: 'Alopecia areata', s: 'Kreisrunde kahle Stellen auf dem Kopf. Dort keine Chemie auftragen.', lj: 3 }
    ]},
    { k: 'haut', n: 'Hautkunde', th: 'Hautkunde', p: [
      { b: 'Talgdrüse', s: 'Sie bildet das körpereigene Fett, das Haar am zweiten Tag fettig aussehen lässt.', lj: 1 },
      { b: 'Schweißdrüse', s: 'Sie kühlt den Körper, wenn es heiß ist.', lj: 1 },
      { b: 'Oberhaut', s: 'Die äußere Hautschicht. Sie erneuert sich ungefähr jeden Monat.', lj: 1 },
      { b: 'Lederhaut', s: 'Die mittlere Hautschicht mit Haarwurzeln, Talg- und Schweißdrüsen.', lj: 1 },
      { b: 'Säureschutzmantel', s: 'Der leicht saure Schutzfilm der Haut, pH 4,5 bis 5,5. Er wehrt Keime ab.', lj: 1 },
      { b: 'Kontaktdermatitis', s: 'Die Hände sind nach viel Nassarbeit und Farbe rot, rissig und brennen.', lj: 2 },
      { b: 'Psoriasis', s: 'Silbrig-weiße Schuppen auf geröteten Stellen, oft auch an Ellbogen und Knien. Nicht ansteckend.', lj: 2 },
      { b: 'Seborrhoe', s: 'Die Kopfhaut fettet sehr schnell nach, mit fettigen, gelblichen Schuppen.', lj: 3 }
    ]},
    { k: 'hygiene', n: 'Hygiene', th: 'Hygiene & Schutzmaßnahmen', p: [
      { b: 'Reinigen', s: 'Haare und Schmutz von Kamm und Schere entfernen. Das kommt immer zuerst.', lj: 1 },
      { b: 'Desinfizieren', s: 'Die Keime auf dem Werkzeug so stark verringern, dass keine Gefahr mehr besteht.', lj: 1 },
      { b: 'Sterilisieren', s: 'Wirklich alle Keime abtöten, auch Sporen, wie im Operationssaal.', lj: 1 },
      { b: 'Einwirkzeit', s: 'Das Desinfektionsmittel bleibt auf der Fläche, bis die angegebene Zeit vorbei ist.', lj: 1 },
      { b: 'Stichfester Behälter', s: 'Hier kommen gebrauchte Rasierklingen hinein.', lj: 1 },
      { b: 'Sicherheitsdatenblatt', s: 'Hier stehen Gefahren, Inhaltsstoffe und Erste Hilfe zu einem Produkt.', lj: 2 },
      { b: 'Begrenzt viruzid plus', s: 'Steht auf dem Desinfektionsmittel: Es wirkt gegen viele Viren, auch gegen einige besonders hartnäckige.', lj: 3 }
    ]},
    { k: 'waesche', n: 'Haarwäsche', th: 'Haarwäsche & Kopfmassage', p: [
      { b: 'Lauwarm', s: 'Etwa 36 bis 38 °C, ungefähr Körpertemperatur.', lj: 1 },
      { b: 'Fingerkuppen', s: 'Damit wird die Kopfhaut massiert, nie mit den Nägeln.', lj: 1 },
      { b: 'Turban', s: 'Nach der Wäsche wird das Haar sanft ausgedrückt und darin eingewickelt.', lj: 1 },
      { b: 'Kühl ausspülen', s: 'Zum Schluss legt sich die Schuppenschicht an, und das Haar glänzt mehr.', lj: 1 },
      { b: 'Zweite Wäsche', s: 'Erst jetzt schäumt das Shampoo richtig, weil Fett und Styling schon gelöst sind.', lj: 1 },
      { b: 'Kur', s: 'Pflege, die in Längen und Spitzen gehört, nicht auf die Kopfhaut.', lj: 1 },
      { b: 'Greifbewegung', s: 'Damit beginnt die Basismassage, an der oberen Halswirbelsäule.', lj: 1 },
      { b: 'Klopfmassage', s: 'Mit den Handkanten beider Hände, leicht federnd. Sie wirkt belebend.', lj: 1 }
    ]},
    { k: 'welle', n: 'Dauerwelle', th: 'Dauerwelle & Umformung', p: [
      { b: 'Wellemittel', s: 'Es löst die Schwefelbrücken, damit das Haar die Form des Wicklers annimmt.', lj: 1 },
      { b: 'Fixierung', s: 'Sie schließt die Schwefelbrücken in der neuen Form, damit die Welle hält.', lj: 2 },
      { b: 'Saure Dauerwelle', s: 'Schonender und langsamer. Gut für gefärbtes oder empfindliches Haar.', lj: 3 },
      { b: 'Alkalische Dauerwelle', s: 'Stärker und schneller. Für gesundes, kräftiges Haar.', lj: 3 },
      { b: 'Relaxer', s: 'Er glättet krauses Haar dauerhaft auf chemischem Weg.', lj: 3 },
      { b: 'Wicklerdurchmesser', s: 'Je kleiner er ist, desto kleiner und fester werden die Locken.', lj: 2 },
      { b: 'Haarstrukturtest', s: 'Vor der Dauerwelle wird geprüft, ob das Haar die Behandlung verträgt.', lj: 2 }
    ]},
    { k: 'schnitt', n: 'Schnitt', th: 'Haarschnitt Techniken', p: [
      { b: 'Kompakte Form', s: 'Alle Haare enden auf einer Linie, die Oberfläche wirkt glatt.', lj: 1 },
      { b: 'Gleichmäßig stufige Form', s: 'Alle Haare sind überall gleich lang, gehalten 90° zur Kopfrundung.', lj: 1 },
      { b: 'Graduierte Form', s: 'Die Haarenden stapeln sich und bilden eine Gewichtslinie über der Kontur.', lj: 1 },
      { b: 'Ansteigende Form', s: 'Im Profil wird das Haar von der Stirn bis zum höchsten Punkt des Kopfes länger.', lj: 1 },
      { b: 'Erhebungswinkel', s: 'Wie weit die Strähne aus dem natürlichen Fall angehoben wird, gemessen im Profil.', lj: 1 },
      { b: 'Wandernde Leitsträhne', s: 'Jede neue Abteilung übernimmt ein Stück der vorigen als Längenvorgabe.', lj: 1 },
      { b: 'Effilieren', s: 'Mit der gezahnten Schere Volumen herausnehmen, ohne sichtbare Schnittlinie.', lj: 1 },
      { b: 'Curtain-Pony', s: 'In der Mitte am kürzesten, zu den Wangenknochen hin länger.', lj: 1 },
      { b: 'Aufsatz 0.6', s: 'Mit diesem Maschinenaufsatz bleibt das Haar etwa 6 mm lang.', lj: 1 }
    ]}
  ];
  var PRO_RUNDE = 6;
  var st = null;          // aktuelle Runde
  var wahlThema = 'mix';  // 'mix' oder THEMEN[i].k

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mischen(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function lj() { var l = parseInt(window.LEHRJAHR, 10); return l >= 1 && l <= 3 ? l : 3; }
  function el() { return document.getElementById('paare-inhalt'); }
  function wZeile(text, stimmung) { return (window.WOERNI && WOERNI.text) ? WOERNI.text(text, stimmung, true) : ''; }

  // Paare für eine Runde: bei „Gemischt“ möglichst aus verschiedenen Themen, nie zweimal derselbe Begriff
  function ziehen() {
    var max = lj(), themen = wahlThema === 'mix' ? THEMEN : THEMEN.filter(function (t) { return t.k === wahlThema; });
    var toepfe = themen.map(function (t) {
      return mischen(t.p.filter(function (p) { return p.lj <= max; }).map(function (p) { return { b: p.b, s: p.s, th: t.th }; }));
    }).filter(function (x) { return x.length; });
    var runde = [];
    mischen(toepfe);
    while (runde.length < PRO_RUNDE && toepfe.some(function (x) { return x.length; })) {
      toepfe.forEach(function (x) { if (x.length && runde.length < PRO_RUNDE) runde.push(x.shift()); });
    }
    return runde;
  }

  function start() {
    var knoepfe = [['mix', 'Gemischt']].concat(THEMEN.map(function (t) { return [t.k, t.n]; }));
    el().innerHTML =
      '<div class="card">' +
        '<div style="font-size:14px;font-weight:600;margin-bottom:6px">So geht\'s</div>' +
        '<div style="font-size:13px;color:#6B6455;line-height:1.55">Oben stehen 6 Fachbegriffe, darunter 6 Situationen aus dem Salon. Tipp zuerst einen Begriff an, dann die Situation, die dazu passt. Was beim ersten Versuch stimmt, zählt als gewusst.</div>' +
      '</div>' +
      '<div style="font-size:12px;color:#6B6455;margin:4px 0 8px">Thema wählen</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px">' +
        knoepfe.map(function (k) { return '<button type="button" class="btn-toggle' + (k[0] === wahlThema ? ' ak' : '') + '" data-pt="' + k[0] + '">' + esc(k[1]) + '</button>'; }).join('') +
      '</div>' +
      '<div style="font-size:11px;color:#9A9180;margin-bottom:14px">Tipp: „Gemischt“ bringt fürs Merken am meisten.</div>' +
      '<button type="button" class="btn-primary" id="paare-los">Runde starten</button>';
    el().querySelectorAll('[data-pt]').forEach(function (b) { b.onclick = function () { wahlThema = b.getAttribute('data-pt'); start(); }; });
    document.getElementById('paare-los').onclick = neueRunde;
  }

  function neueRunde() {
    var paare = ziehen();
    st = { paare: paare, begriffe: mischen(paare.slice()), situationen: mischen(paare.slice()), gewaehlt: null, fertig: [], fehler: [], versuche: {} };
    zeichnen();
  }

  function zeichnen() {
    var offen = st.begriffe.filter(function (p) { return st.fertig.indexOf(p) < 0; });
    el().innerHTML =
      '<div style="display:flex;justify-content:space-between;font-size:12px;color:#6B6455;margin-bottom:8px"><span>Begriff antippen, dann die Situation</span><span>' + st.fertig.length + ' / ' + st.paare.length + '</span></div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">' +
        offen.map(function (p) { var i = st.paare.indexOf(p); return '<button type="button" class="btn-toggle' + (st.gewaehlt === p ? ' ak' : '') + '" data-pb="' + i + '">' + esc(p.b) + '</button>'; }).join('') +
      '</div>' +
      '<div id="paare-sit">' +
        st.situationen.map(function (p) {
          var i = st.paare.indexOf(p), ok = st.fertig.indexOf(p) >= 0;
          return '<button type="button" class="opt-btn' + (ok ? ' ric' : '') + '" data-ps="' + i + '"' + (ok ? ' disabled' : '') + '>' +
            (ok ? '<b>' + esc(p.b) + ':</b> ' : '') + esc(p.s) + '</button>';
        }).join('') +
      '</div>' +
      '<div id="paare-hinweis" style="min-height:20px;font-size:13px;margin-top:4px"></div>';
    el().querySelectorAll('[data-pb]').forEach(function (b) {
      b.onclick = function () { var p = st.paare[+b.getAttribute('data-pb')]; st.gewaehlt = st.gewaehlt === p ? null : p; zeichnen(); };
    });
    el().querySelectorAll('[data-ps]').forEach(function (b) {
      b.onclick = function () { pruefen(st.paare[+b.getAttribute('data-ps')], b); };
    });
  }

  function pruefen(sit, knopf) {
    var h = document.getElementById('paare-hinweis');
    if (!st.gewaehlt) { h.style.color = '#6B6455'; h.textContent = 'Tipp zuerst oben einen Begriff an.'; return; }
    var b = st.gewaehlt;
    st.versuche[b.b] = (st.versuche[b.b] || 0) + 1;
    if (sit === b) {
      st.fertig.push(b); st.gewaehlt = null;
      if (st.fertig.length === st.paare.length) return ende();
      zeichnen();
      return;
    }
    if (st.fehler.indexOf(b) < 0) st.fehler.push(b);
    knopf.classList.add('fal');
    h.style.color = '#C44030';
    h.textContent = '„' + b.b + '“ passt hier nicht. Lies die Situation noch einmal genau.';
    setTimeout(function () { knopf.classList.remove('fal'); }, 900);
  }

  function ende() {
    var gut = st.paare.length - st.fehler.length, alle = st.fehler.length === 0;
    var satz = alle ? 'Alle Paare beim ersten Versuch. Stark, das sitzt!'
      : gut >= 4 ? 'Gute Runde. Schau dir die verwechselten Paare unten noch einmal an.'
      : 'Dranbleiben lohnt sich. Lies die Paare unten in Ruhe und spiel gleich noch eine Runde.';
    el().innerHTML =
      '<div class="card" style="text-align:center">' +
        '<div style="font-size:30px;font-weight:700;color:#896C32;font-family:Poppins,system-ui">' + gut + ' / ' + st.paare.length + '</div>' +
        '<div style="font-size:13px;color:#6B6455">beim ersten Versuch richtig</div>' +
      '</div>' +
      wZeile(satz, alle ? 'lobend' : 'motivierend') +
      (st.fehler.length ? '<div style="font-size:12px;color:#6B6455;margin:6px 0">Diese Paare hast du verwechselt:</div>' +
        st.fehler.map(function (p) { return '<div class="fb-r" style="margin-top:6px;font-size:13px;line-height:1.5"><b>' + esc(p.b) + '</b><br>' + esc(p.s) + '</div>'; }).join('') : '') +
      '<div id="paare-speicher" style="font-size:12px;margin:10px 0"></div>' +
      '<button type="button" class="btn-primary" id="paare-nochmal" style="margin-bottom:8px">Neue Runde</button>' +
      '<button type="button" class="btn-ghost" id="paare-thema" style="width:100%">Thema wechseln</button>';
    document.getElementById('paare-nochmal').onclick = neueRunde;
    document.getElementById('paare-thema').onclick = start;
    if (typeof window.ghdQuizSpeichernAntworten === 'function') {
      window.ghdQuizSpeichernAntworten(st.paare.map(function (p) {
        return { thema: p.th, korrekt: st.fehler.indexOf(p) < 0 };
      }), 'paare-speicher');
    }
  }

  window.PAARE_THEMEN = THEMEN;
  window.paareOeffnen = function () {
    if (typeof window.zeige === 'function') window.zeige('paare');
    start();
  };
})();
