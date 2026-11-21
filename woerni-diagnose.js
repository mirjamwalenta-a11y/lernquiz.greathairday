// Wörni · „Woran liegt's?“ – Fehlerdiagnose
// Farbe, Herrenschnitt, Blondierung: von der Inhaberin geprüft (2026-11-19).
// Dauerwelle, Föhnen, Make-up: neu, zur Durchsicht durch die Inhaberin.
// Der Lehrling wählt einen typischen Fehler, beantwortet 2–3 Fragen und bekommt
// die wahrscheinliche Ursache, wie es beim nächsten Mal geht, und einen
// passenden Lernschritt. Regelbasiert, keine KI (Wörni-Grundsatz, docs/woerni-v1.md).
// Wörni ersetzt keine Meisterin: Jede Diagnose endet mit „frag deine Meisterin“.
// Nichts wird gespeichert, keine Daten an den Server.
//
// Inhalte:
//  - Herrenschnitt: Fehlertabelle aus docs/maschinenhaarschnitt-ohne-aufsteckkamm-v1.md (4.4)
//  - Farbe, Blondierung: Begriffe wie im Farblabor (Tonhöhe, Asch/Irisé/Gold/Kupfer)
//  - Dauerwelle: Erklärungen aus dem Modul Umformung (umformung.html, „Was ist schiefgegangen?“)
(function () {
  var DIAGNOSEN = [
    { id: 'farbe-warm', ic: '🎨', titel: 'Die Farbe ist zu warm geworden', komp: 'farbe',
      fragen: [
        { id: 'hell', f: 'Wie viele Tonhöhen heller als das Ausgangshaar sollte die Farbe werden?',
          o: [['0', 'Gleich hell oder dunkler'], ['12', '1–2 Tonhöhen heller'], ['3', '3 oder mehr Tonhöhen heller']] },
        { id: 'reflex', f: 'Welchen Reflex hatte die Farbe?',
          o: [['natur', 'Naturton, ohne Reflex'], ['kuehl', 'Kühl: Asch oder Irisé'], ['warm', 'Warm: Gold oder Kupfer'], ['weiss', 'Weiß ich nicht genau']] },
        { id: 'vor', f: 'War das Haar vorher schon gefärbt oder aufgehellt?',
          o: [['ja', 'Ja'], ['nein', 'Nein, unbehandelt'], ['weiss', 'Weiß ich nicht']] }
      ],
      ergebnisse: [
        { wenn: { reflex: ['warm'] },
          ursache: 'Der warme Reflex war schon in der Farbe.',
          erklaerung: 'Gold und Kupfer machen das Ergebnis wärmer. Für ein neutrales oder kühles Ergebnis brauchst du einen Naturton oder einen kühlen Reflex.',
          naechstes: 'Vor dem Anmischen kurz prüfen: Passt der Reflex zum Wunsch der Kundin?',
          lernen: { thema: 'Farbenlehre & Coloration' }, modul: 'farblabor' },
        { wenn: { hell: ['12', '3'], reflex: ['natur'] },
          ursache: 'Beim Aufhellen kommt das warme Eigenpigment zum Vorschein.',
          erklaerung: 'Je heller du gehst, desto mehr Orange und Gelb zeigt das Haar. Ein Naturton gleicht das nicht aus. Dagegen hilft die Gegenfarbe aus dem Farbkreis: Blau (Asch) gegen Orange, Violett (Irisé) gegen Gelb.',
          naechstes: 'Bei Aufhellung den passenden kühlen Reflex mitplanen.',
          lernen: { thema: 'Colorationsgrundlagen' }, modul: 'farblabor' },
        { wenn: { vor: ['ja'] },
          ursache: 'Alte Farbe oder Aufhellung in den Längen.',
          erklaerung: 'Vorbehandeltes Haar nimmt Farbe anders an. Reste alter Farbe oder einer Aufhellung können durchscheinen und das Ergebnis wärmer machen.',
          naechstes: 'Vor der Farbe Ansatz und Längen getrennt anschauen und getrennt planen.',
          lernen: { thema: 'Colorationsgrundlagen' }, modul: 'farblabor' },
        { wenn: { reflex: ['weiss'] },
          ursache: 'Der Reflex der Farbe war nicht klar.',
          erklaerung: 'Die Zahl nach dem Punkt sagt dir den Reflex. Wer ihn nicht kennt, kann das Ergebnis nicht planen.',
          naechstes: 'Die Farbnummer vor dem Anmischen einmal laut lesen: Tonhöhe, dann Reflex.',
          lernen: { thema: 'Farbenlehre & Coloration' }, modul: 'spickzettel' }
      ],
      satz: 'Meine Farbe ist wärmer geworden als geplant. Ausgangshaar …, Farbe …, Oxidant …. Woran kann das liegen?' },

    { id: 'uebergang', ic: '✂️', titel: 'Beim Herrenschnitt ist der Übergang zu sehen', komp: 'herrenschnitt',
      fragen: [
        { id: 'bild', f: 'Wie sieht der Fehler aus?',
          o: [['stufe', 'Stufe: ein Absatz zwischen zwei Längen'], ['kante', 'Kante: eine harte, dunkle Linie'], ['loch', 'Loch: eine helle, zu kurze Stelle'], ['streifen', 'Streifen oder Bahnen']] },
        { id: 'wo', f: 'Wo liegt er?',
          o: [['band1', 'Unten in Band 1 (Maschine ohne Aufsatz)'], ['uebergang', 'An der Übergangslinie'], ['oben', 'Weiter oben im Kammbereich']] }
      ],
      ergebnisse: [
        { wenn: { bild: ['stufe'], wo: ['band1'] },
          ursache: 'An der Grenze zwischen zwei Einstellungen nicht ausgekippt.',
          erklaerung: 'Wer an der Grenze gerade hochfährt, schneidet eine Stufe. In Band 1 steuert der Hebel die Länge – Schritt für Schritt.',
          naechstes: 'Die Grenze mit der nächstlängeren Einstellung verblenden und dabei auskippen.' },
        { wenn: { bild: ['stufe', 'kante'], wo: ['uebergang'] },
          ursache: 'Am Übergang fehlt der Anschluss zwischen längster Einstellung und Kamm.',
          erklaerung: 'Beginnt der Kamm zu weit vom Kopf oder zu steil, entsteht an der Übergangslinie eine Kante. Ab Band 2 steuert der Kamm Winkel und Länge.',
          naechstes: 'Maschine über Kamm direkt an Band 1 ansetzen, den Kamm flach beginnen und den Winkel erst darüber öffnen.' },
        { wenn: { bild: ['loch'], wo: ['band1'] },
          ursache: 'Die kürzeste Einstellung wurde zu hoch geführt.',
          erklaerung: 'Dann ist der Verlauf zu hoch ausrasiert. Diese Höhe lässt sich nicht zurückholen.',
          naechstes: 'Den Übergang darüber mit mittlerer und längster Einstellung und dem Kamm neu aufbauen – und beim nächsten Mal die Höhe vorher festlegen.' },
        { wenn: { bild: ['loch', 'kante'], wo: ['oben'] },
          ursache: 'Der Kamm war zu nah am Kopf oder ist stehen geblieben.',
          erklaerung: 'Bleibt der Kamm stehen, schneidet die Maschine überall auf derselben Länge. Oben muss sich der Kamm bewegen und seinen Winkel ändern.',
          naechstes: 'Die Partie rundherum mit Maschine über Kamm angleichen und den Kamm gleichmäßig führen.' },
        { wenn: { bild: ['streifen'] },
          ursache: 'Die Kammbahnen haben sich nicht überlappt.',
          erklaerung: 'Zwischen zwei Bahnen bleibt dann ein Streifen stehen.',
          naechstes: 'Mit überlappenden Bahnen nacharbeiten.' }
      ],
      lernen: { thema: 'Haarschnitt Techniken' }, modul: 'maschine',
      satz: 'Bei meinem Herrenschnitt ist der Übergang zu sehen. Kannst du dir die Stelle kurz mit mir anschauen?' },

    { id: 'blond-fleckig', ic: '✨', titel: 'Die Blondierung ist ungleichmäßig geworden', komp: 'blond',
      fragen: [
        { id: 'wo', f: 'Wo ist es ungleichmäßig?',
          o: [['ansatz', 'Der Ansatz ist heller als die Längen'], ['laengen', 'Längen und Spitzen sind unterschiedlich'], ['flecken', 'Einzelne Flecken oder Streifen']] },
        { id: 'auftrag', f: 'Wie hast du aufgetragen?',
          o: [['ansatz_zuerst', 'Ansatz zuerst, dann die Längen'], ['laengen_zuerst', 'Längen zuerst, Ansatz zum Schluss'], ['alles', 'Alles in einem Zug']] },
        { id: 'abteilung', f: 'Wie dick waren deine Abteilungen?',
          o: [['duenn', 'Dünn'], ['dick', 'Eher dick'], ['weiss', 'Weiß ich nicht']] }
      ],
      ergebnisse: [
        { wenn: { wo: ['ansatz'], auftrag: ['ansatz_zuerst', 'alles'] },
          ursache: 'Am Ansatz hat die Wärme der Kopfhaut mitgearbeitet.',
          erklaerung: 'Nah an der Kopfhaut hellt das Produkt schneller auf. Wird der Ansatz zuerst oder gleichzeitig aufgetragen, wird er heller als die Längen.',
          naechstes: 'Längen zuerst auftragen, den Ansatz zum Schluss.' },
        { wenn: { abteilung: ['dick'] },
          ursache: 'Die Abteilungen waren zu dick.',
          erklaerung: 'In dicken Abteilungen wird das Haar innen nicht gleichmäßig bedeckt.',
          naechstes: 'Dünne Abteilungen nehmen und jede Partie vollständig mit Produkt bedecken.' },
        { wenn: { wo: ['laengen'] },
          ursache: 'Längen und Spitzen waren unterschiedlich vorbelastet.',
          erklaerung: 'Spitzen sind oft poröser oder schon aufgehellt und nehmen das Produkt anders an als das Haar am Ansatz.',
          naechstes: 'Vorher den Haarzustand prüfen und die Längen getrennt planen.' },
        { wenn: { wo: ['flecken'] },
          ursache: 'Stellen wurden ausgelassen oder bekamen zu wenig Produkt.',
          erklaerung: 'Wo weniger Produkt ist, hellt es weniger auf.',
          naechstes: 'Zügig, in sauberen Abteilungen und mit genug Produkt arbeiten und zwischendurch kontrollieren.' }
      ],
      lernen: { thema: 'Balayage & Strähnen' },
      satz: 'Meine Blondierung ist ungleichmäßig geworden. Kannst du mir zeigen, woran es lag?' },

    { id: 'welle-haelt-nicht', ic: '🌀', titel: 'Die Dauerwelle hält nicht', komp: 'umformung',
      fragen: [
        { id: 'wann', f: 'Wann war die Welle zu schwach?',
          o: [['sofort', 'Schon beim Abwickeln'], ['tage', 'Nach ein paar Tagen']] },
        { id: 'abgetupft', f: 'Hast du das Haar nach dem Zwischenspülen gründlich abgetupft?',
          o: [['ja', 'Ja'], ['nein', 'Nein, es war noch ziemlich nass'], ['weiss', 'Weiß ich nicht mehr']] },
        { id: 'pflege', f: 'Wie wurde das Haar vorher gewaschen?',
          o: [['ohne', 'Ohne Pflege'], ['mit', 'Mit Pflege oder Spülung'], ['weiss', 'Weiß ich nicht']] }
      ],
      ergebnisse: [
        { wenn: { abgetupft: ['nein'] },
          ursache: 'Die Fixierung wurde verdünnt.',
          erklaerung: 'Ist das Haar nach dem Zwischenspülen nicht gut abgetupft, wird die Fixierung verdünnt und schließt zu wenige Schwefelbrücken.',
          naechstes: 'Nach dem Zwischenspülen gründlich abtupfen, erst dann fixieren.' },
        { wenn: { pflege: ['mit'] },
          ursache: 'Pflegereste im Haar haben die Welle geschwächt.',
          erklaerung: 'Pflegereste im Haar machen die Welle schwach, weil das Wellmittel schlechter wirken kann.',
          naechstes: 'Vor der Dauerwelle ohne Pflege waschen.' },
        { wenn: { wann: ['sofort'] },
          ursache: 'Das Wellmittel hat zu kurz gewirkt.',
          erklaerung: 'Wirkt das Wellmittel zu kurz, öffnen sich zu wenige Schwefelbrücken. Dann kann sich die neue Form nicht bilden.',
          naechstes: 'Einwirkzeit genau einhalten und mit einer Probelocke kontrollieren.' },
        { wenn: { wann: ['tage'] },
          ursache: 'Die Fixierung war zu kurz.',
          erklaerung: 'Die Fixierung verbindet die offenen Schwefel-Enden wieder zu Schwefelbrücken. Wirkt sie zu kurz, schließt sie zu wenige davon.',
          naechstes: 'Fixierung gleichmäßig auftragen und die Einwirkzeit genau einhalten.' }
      ],
      lernen: { thema: 'Dauerwelle & Umformung' }, modul: 'umformung',
      satz: 'Meine Dauerwelle hält nicht. Kannst du mit mir durchgehen, woran es lag?' },

    { id: 'foehn-faellt', ic: '💨', titel: 'Die Föhnfrisur fällt schnell zusammen', komp: 'foehnen',
      fragen: [
        { id: 'nass', f: 'Wie nass war das Haar, als du mit der Rundbürste angefangen hast?',
          o: [['vor', 'Gut vorgetrocknet'], ['nass', 'Noch ziemlich nass']] },
        { id: 'kuehl', f: 'Hast du jede Partie auf der Bürste abkühlen lassen, bevor du sie losgelassen hast?',
          o: [['ja', 'Ja'], ['nein', 'Nein']] },
        { id: 'produkt', f: 'Welches Produkt hast du verwendet?',
          o: [['volumen', 'Ein leichtes Volumen- oder Föhnspray'], ['schwer', 'Eine reichhaltige Pflege bis zum Ansatz'], ['kein', 'Keines']] }
      ],
      ergebnisse: [
        { wenn: { kuehl: ['nein'] },
          ursache: 'Die Form hatte keine Zeit abzukühlen.',
          erklaerung: 'Das Haar behält die Form erst, wenn es abgekühlt ist. Lässt du es warm von der Bürste, fällt das Volumen wieder zusammen.',
          naechstes: 'Jede Partie kurz auf der Bürste abkühlen lassen, zum Beispiel mit der Kaltstufe.' },
        { wenn: { produkt: ['schwer'] },
          ursache: 'Das Produkt war zu schwer.',
          erklaerung: 'Reichhaltige Pflege am Ansatz beschwert das Haar.',
          naechstes: 'Am Ansatz ein leichtes Volumenprodukt verwenden, Pflege nur in die Längen.' },
        { wenn: { nass: ['nass'] },
          ursache: 'Das Haar war beim Formen noch zu nass.',
          erklaerung: 'Mit der Rundbürste formst du am besten das fast trockene Haar. Ist es noch zu nass, dauert es lange und die Form wird ungleichmäßig.',
          naechstes: 'Das Haar zuerst grob vortrocknen und abteilen, dann mit der Rundbürste formen.' },
        { wenn: { produkt: ['kein'] },
          ursache: 'Ohne Produkt fehlt oft der Halt.',
          erklaerung: 'Vor allem feines Haar braucht etwas, das die Form stützt.',
          naechstes: 'Je nach Haar ein leichtes Volumen- oder Föhnspray verwenden.' }
      ],
      satz: 'Meine Föhnfrisur fällt schnell zusammen. Kannst du mir beim nächsten Mal kurz zuschauen?' },
    { id: 'makeup-maske', ic: '💄', titel: 'Das Make-up wirkt maskenhaft', komp: 'makeup',
      fragen: [
        { id: 'ton', f: 'Wo hast du den Farbton der Grundierung abgestimmt?',
          o: [['kiefer', 'Am Kiefer, bei Tageslicht'], ['hand', 'Auf dem Handrücken'], ['nicht', 'Gar nicht, nach Gefühl']] },
        { id: 'menge', f: 'Wie viel Grundierung hast du aufgetragen?',
          o: [['duenn', 'Dünn, nur wo nötig'], ['viel', 'Deckend im ganzen Gesicht']] },
        { id: 'rand', f: 'Hast du die Ränder zu Hals und Haaransatz ausgeblendet?',
          o: [['ja', 'Ja'], ['nein', 'Nein']] },
        { id: 'haut', f: 'Wurde die Haut vorher gereinigt und gepflegt?',
          o: [['ja', 'Ja'], ['nein', 'Nein']] }
      ],
      ergebnisse: [
        { wenn: { ton: ['hand', 'nicht'] },
          ursache: 'Der Farbton passt nicht zur Haut.',
          erklaerung: 'Der Handrücken hat oft einen anderen Ton als das Gesicht. Am Kiefer siehst du, ob die Grundierung mit Gesicht und Hals verschmilzt.',
          naechstes: 'Zwei oder drei Töne als Streifen am Kiefer testen und bei Tageslicht den wählen, der verschwindet.' },
        { wenn: { rand: ['nein'] },
          ursache: 'Man sieht, wo die Grundierung aufhört.',
          erklaerung: 'Ein harter Rand am Kiefer oder Haaransatz lässt das Gesicht wie eine Maske wirken.',
          naechstes: 'Die Ränder zu Hals, Ohren und Haaransatz mit dem Schwämmchen weich auslaufen lassen.' },
        { wenn: { menge: ['viel'] },
          ursache: 'Zu viel Grundierung.',
          erklaerung: 'Eine dicke Schicht deckt auch das Natürliche der Haut ab und wirkt schwer.',
          naechstes: 'Dünn beginnen und nur dort mehr nehmen, wo es nötig ist, zum Beispiel mit Concealer.' },
        { wenn: { haut: ['nein'] },
          ursache: 'Die Haut war nicht vorbereitet.',
          erklaerung: 'Auf trockener Haut setzt sich Grundierung in Schüppchen und Linien ab.',
          naechstes: 'Vorher reinigen und eine passende Pflege kurz einziehen lassen.' }
      ],
      lernen: { thema: 'Make-up & Visagistik' }, modul: 'makeup',
      satz: 'Mein Make-up hat maskenhaft gewirkt. Kannst du mir beim Abstimmen der Grundierung zeigen, worauf du achtest?' },
    { id: 'makeup-schatten', ic: '🖌', titel: 'Contouring oder Rouge wirken fleckig', komp: 'makeup',
      fragen: [
        { id: 'verblendet', f: 'Hast du die Farbe nach dem Auftragen verblendet?',
          o: [['ja', 'Ja, bis keine Kante mehr zu sehen war'], ['kurz', 'Nur kurz'], ['nein', 'Nein']] },
        { id: 'menge', f: 'Wie hast du die Farbe aufgenommen?',
          o: [['wenig', 'Wenig, in Schichten aufgebaut'], ['viel', 'Viel auf einmal']] },
        { id: 'platz', f: 'Wo sitzt der Schatten?',
          o: [['form', 'Passend zur Gesichtsform'], ['weiss', 'Weiß ich nicht genau']] }
      ],
      ergebnisse: [
        { wenn: { verblendet: ['kurz', 'nein'] },
          ursache: 'Die Farbe wurde nicht genug verblendet.',
          erklaerung: 'Schatten und Rouge sollen weich in die Haut übergehen, ohne sichtbaren Anfang und Ende.',
          naechstes: 'Mit einem sauberen Pinsel in kleinen Kreisen ausblenden, bis keine Kante mehr zu sehen ist.' },
        { wenn: { menge: ['viel'] },
          ursache: 'Zu viel Farbe auf einmal.',
          erklaerung: 'Viel Farbe lässt sich schlecht verteilen und bleibt als Fleck stehen.',
          naechstes: 'Wenig Farbe aufnehmen, überschüssige abklopfen und Schicht für Schicht aufbauen.' },
        { wenn: { platz: ['weiss'] },
          ursache: 'Der Platz passt vielleicht nicht zur Gesichtsform.',
          erklaerung: 'Wo Licht und Schatten hingehören, hängt von der Gesichtsform ab. Am falschen Platz wirkt der Schatten wie ein Fleck.',
          naechstes: 'Im Make-up-Labor die Gesichtsform durchspielen und dann am Gast anwenden.' }
      ],
      lernen: { thema: 'Make-up & Visagistik' }, modul: 'makeup',
      satz: 'Mein Contouring ist fleckig geworden. Kannst du mir zeigen, wie du verblendest?' }
  ];

  var BASIS = 'https://mirjamwalenta-a11y.github.io/lernquiz.greathairday/';
  var MODULE = {
    farblabor:   { t: 'Im Farblabor üben', url: BASIS + 'farblabor.html?v=20261116s' },
    spickzettel: { t: 'Farb-Spickzettel ansehen', url: BASIS + 'spickzettel.html' },
    maschine:    { t: 'Im Modul „Maschine“ üben', url: BASIS + 'beratung-formwirkung.html#view=maschine' },
    umformung:   { t: 'Im Modul „Umformung“ üben', url: BASIS + 'umformung.html?v=20261116s' },
    makeup:      { t: 'Im Make-up-Labor üben', url: BASIS + 'makeup.html?v=20261121i' }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function finde(id) { return DIAGNOSEN.filter(function (d) { return d.id === id; })[0] || null; }
  function passt(wenn, a) { return Object.keys(wenn).every(function (k) { return wenn[k].indexOf(a[k]) >= 0; }); }

  window.WOERNI_DIAGNOSE = {
    diagnosen: DIAGNOSEN,
    // Für eine Kompetenz (kompetenzen.js) die passenden Diagnosen
    fuerKompetenz: function (kid) { return DIAGNOSEN.filter(function (d) { return d.komp === kid; }); },

    // ziele.thema(th): Themen-Quiz starten · ziele.modul(url): Modul öffnen
    // ziele.hatThema(th) (optional): false → kein „Kurz lernen“-Knopf (Thema ohne Fragen)
    zeichnen: function (el, id, ziele, antworten) {
      if (!el) return;
      var self = this, d = finde(id);
      if (!d) {
        var liste = (ziele && ziele.nurKomp) ? DIAGNOSEN.filter(function (x) { return x.komp === ziele.nurKomp; }) : DIAGNOSEN;
        if (!liste.length) liste = DIAGNOSEN;
        el.innerHTML = '<div class="label">Was ist passiert?</div>' +
          liste.map(function (x) {
            return '<button class="nav-card pm-modul" data-wd="' + x.id + '"><div class="nav-icon" style="margin:0">' + x.ic + '</div><div><div class="nav-title">' + esc(x.titel) + '</div></div></button>';
          }).join('') +
          '<p class="pt-info">Wörni sagt dir, was am wahrscheinlichsten ist. Schau dir die Stelle danach mit deiner Meisterin an.</p>';
        [].forEach.call(el.querySelectorAll('[data-wd]'), function (b) {
          b.onclick = function () { self.zeichnen(el, b.getAttribute('data-wd'), ziele, {}); window.scrollTo(0, 0); };
        });
        return;
      }
      antworten = antworten || {};
      var offen = d.fragen.filter(function (f) { return !(f.id in antworten); })[0];
      var kopf = '<div class="label">' + d.ic + ' ' + esc(d.titel) + '</div>';
      if (offen) {
        var nr = d.fragen.indexOf(offen) + 1;
        el.innerHTML = kopf +
          '<div class="card"><div class="label">Frage ' + nr + ' von ' + d.fragen.length + '</div>' +
          '<div style="font-size:15px;font-weight:600;color:#211D17;margin-bottom:12px;line-height:1.4">' + esc(offen.f) + '</div>' +
          offen.o.map(function (o) { return '<button class="opt-btn" data-wa="' + esc(o[0]) + '">' + esc(o[1]) + '</button>'; }).join('') +
          '</div><button class="btn-ghost" data-wd-zurueck style="width:100%">← Anderer Fehler</button>';
        [].forEach.call(el.querySelectorAll('[data-wa]'), function (b) {
          b.onclick = function () { var a = Object.assign({}, antworten); a[offen.id] = b.getAttribute('data-wa'); self.zeichnen(el, d.id, ziele, a); };
        });
        el.querySelector('[data-wd-zurueck]').onclick = function () { self.zeichnen(el, '', ziele); window.scrollTo(0, 0); };
        return;
      }
      var e = d.ergebnisse.filter(function (x) { return passt(x.wenn, antworten); })[0];
      var lernen = (e && e.lernen) || d.lernen, modul = MODULE[(e && e.modul) || d.modul];
      if (lernen && ziele && ziele.hatThema && !ziele.hatThema(lernen.thema)) lernen = null;
      el.innerHTML = kopf +
        (e
          ? '<div class="card"><div class="label">Wahrscheinliche Ursache</div>' +
            '<div style="font-size:16px;font-weight:600;color:#211D17;margin-bottom:8px;line-height:1.4">' + esc(e.ursache) + '</div>' +
            '<div style="font-size:14px;color:#211D17;line-height:1.6;margin-bottom:14px">' + esc(e.erklaerung) + '</div>' +
            '<div class="fb-o" style="margin-top:0"><div class="label" style="margin-bottom:4px">Beim nächsten Mal</div><div style="font-size:14px;color:#211D17;line-height:1.5">' + esc(e.naechstes) + '</div></div></div>'
          : '<div class="card"><div class="label">Wörni ist sich nicht sicher</div><div style="font-size:14px;color:#211D17;line-height:1.6">Das lässt sich aus deinen Antworten nicht eindeutig sagen. Schau dir die Stelle am besten gleich mit deiner Meisterin an.</div></div>') +
        '<div class="label" style="margin-top:16px">Dein nächster Schritt</div>' +
        (lernen ? '<button class="nav-card pm-modul" data-wz="thema"><div class="nav-icon" style="margin:0">📚</div><div><div class="nav-title">Kurz lernen: ' + esc(lernen.thema) + '</div><div class="nav-desc">Themen-Quiz, ca. 3 Minuten</div></div></button>' : '') +
        (modul ? '<button class="nav-card pm-modul" data-wz="modul"><div class="nav-icon" style="margin:0">🧪</div><div><div class="nav-title">' + esc(modul.t) + '</div><div class="nav-desc">Den gleichen Fall noch einmal durchdenken</div></div></button>' : '') +
        '<button class="nav-card pm-modul" data-wz="satz"><div class="nav-icon" style="margin:0">🗣</div><div><div class="nav-title">Deine Meisterin fragen</div><div class="nav-desc">Ein Satz genügt</div></div></button>' +
        '<div class="fb-o" data-wz-satz hidden style="margin:-2px 0 10px"><div class="label" style="margin-bottom:4px">So kannst du fragen</div><div style="font-size:14px;color:#211D17;line-height:1.5">„' + esc(d.satz) + '“</div></div>' +
        '<button class="btn-ghost" data-wd-zurueck style="width:100%;margin-top:8px">← Anderer Fehler</button>';
      var b;
      if ((b = el.querySelector('[data-wz="thema"]'))) b.onclick = function () { if (ziele && ziele.thema) ziele.thema(lernen.thema); };
      if ((b = el.querySelector('[data-wz="modul"]'))) b.onclick = function () { if (ziele && ziele.modul) ziele.modul(modul.url); };
      el.querySelector('[data-wz="satz"]').onclick = function () { var s = el.querySelector('[data-wz-satz]'); s.hidden = !s.hidden; };
      el.querySelector('[data-wd-zurueck]').onclick = function () { self.zeichnen(el, '', ziele); window.scrollTo(0, 0); };
    }
  };
})();
