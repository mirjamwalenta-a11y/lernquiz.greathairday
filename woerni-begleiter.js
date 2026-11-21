// Wörni · Begleiter von Tag 1 bis zur LAP (Konzept: docs/woerni-begleiter-v1.md)
//
// Drei Teile, alle regelbasiert, ohne KI:
//  1. Proaktiv: ein Impuls je Phase der Lehre. In den ersten 14 Tagen jeden Tag
//     ein neuer, danach einer pro Woche. Er steht auf der Startseite im Platz von
//     „Wörni sagt“, bis der Lehrling „Gelesen“ antippt (nur auf dem Gerät gemerkt).
//  2. Modul „Probezeit“ (ab Tag 1): Sinn der Probezeit, Realitätscheck Friseurlehre,
//     Haltung und das Warum. Reiner Inhalt, mit Fragen zum Nachdenken.
//  0. Vorstellung: Beim ersten Mal stellt sich Wörni als persönlicher Coach vor
//     (Startseite und Wörni-Seite) und führt zu den Verhaltensregeln (salon-regeln.js,
//     Seite „Unsere Verhaltensregeln“ mit Bestätigung, nur auf dem Gerät gemerkt).
//  3. „Frag Wörni“ + App-Lotse: Der Lehrling tippt eine Frage. Wörni antwortet aus
//     festen Antworten (hier unten, von der Inhaberin zu prüfen) oder verweist in die
//     passenden Module. Passt nichts: ehrlich „weiß ich nicht“ + Nachschlagen +
//     fertiger Satz für die Meisterin.
//
// Datentrennung (Auftrag, Punkt 5 / CLAUDE.md Regel 2):
//  - Wörni speichert nichts am Server und liest keine Probezeit-Beurteilungen,
//    Vertrags-, Adress- oder Personaldaten. Die Probezeit-Werkzeuge der Meisterin
//    (Schnuppertag-App) bleiben davon völlig getrennt.
//  - Die Phase rechnet die Seite aus dem Lehrbeginn bzw. Lehrjahr, die das Lern-Tool
//    ohnehin lädt. Nichts davon wird gespeichert.
//  - Gemerkt wird auf dem Gerät (localStorage „woerni-begleiter“) nur, welcher
//    Impuls zuletzt als gelesen markiert wurde. Fragen an Wörni werden nirgends
//    gespeichert, auch nicht auf dem Gerät.
(function () {
  var TAG = 86400000;
  var PROBEZEIT_TAGE = 90;     // erste drei Monate
  var LAP_ENDSPURT_AB = 975;   // ca. 4 Monate vor Ende des 3. Lehrjahrs
  var KEY = 'woerni-begleiter';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s == null ? '' : s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function lesen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function schreiben(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  // ── Module der App (App-Lotse) ──────────────────────────────────────────
  // ziel: Schlüssel, den die aufrufende Seite auflöst (Funktion im Lern-Tool),
  // url:  eigene Seite dieser App. wann: wann das Modul besonders sinnvoll ist.
  var MODULE = {
    regeln:       { ic: '📋', n: 'Unsere Verhaltensregeln', ziel: 'regeln', w: 'Krankmeldung, Urlaub, Mittagspause, Ausbildung, Hygiene und Kleidung: was bei uns im Team gilt und warum.', wann: 'Gleich am ersten Tag lesen, und immer, wenn du bei einer Regel unsicher bist.', k: 'regeln verhaltensregeln regel krankmeldung urlaubsansuchen mittagspause kleidung bekleidung' },
    probezeit:    { ic: '🌱', n: 'Probezeit', ziel: 'probezeit', w: 'Wozu die ersten drei Monate da sind, wie die Lehre wirklich aussieht und warum unsere Standards wichtig sind.', wann: 'Ab deinem ersten Tag, und immer, wenn du dich fragst, ob du richtig bist.', k: 'probezeit anfang start erste tage ankommen' },
    quizkurz:     { ic: '❓', n: 'Quiz', ziel: 'quizkurz', w: 'Schnell-Check oder Lerneinheit mit Fragen zu deinem Lehrjahr. Deine Antworten zählen für deinen Lernstand.', wann: 'Ein paar Fragen am Tag, am besten in einer ruhigen Minute.', k: 'quiz fragen ueben schnellcheck lerneinheit' },
    themenquiz:   { ic: '🎯', n: 'Themen-Quiz', ziel: 'quiz', w: 'Ein Thema gezielt üben, zum Beispiel Hygiene oder Farbenlehre.', wann: 'Wenn du weißt, welches Thema dran ist oder wackelt.', k: 'themen quiz thema gezielt' },
    wiederholen:  { ic: '🔁', n: 'Wiederholen', ziel: 'wiederholen', w: 'Fragen, die du noch nicht sicher wusstest, kommen in Abständen wieder, bis sie sitzen.', wann: 'Wenn die Startseite „Themen zum Wiederholen“ zeigt.', k: 'wiederholen wiederholung wackelt vergessen' },
    lernfaelle:   { ic: '📚', n: 'Aus Fehlern lernen', ziel: 'lernfaelle', w: 'Echte Situationen aus dem Salon ohne Namen: Was würdest du tun?', wann: 'Wenn du dich auf schwierige Momente mit Gästen vorbereiten willst.', k: 'fehler lernfall situation lernen' },
    praxis:       { ic: '💆', n: 'Praxis-Module & Praxis-Tagebuch', ziel: 'praxis', w: 'Abläufe Schritt für Schritt, sortiert nach Haar (Waschen, Farbe, Strähnen, Schnitt, Umformung, Hochstecken), Visagistik (Make-up, Augenbrauen, Farbtyp) und Pflege (Gesichtsmassage, Maniküre, Rasur), dazu dein Tagebuch, in dem du einträgst, was du geübt hast.', wann: 'Vor einem Handgriff, den du noch nicht oft gemacht hast, und nach jedem Üben zum Eintragen.', k: 'praxis tagebuch ablauf waschen haarwaesche hochstecken straehnen eintragen geuebt visagistik makeup maniküre manikuere rasur gesichtsmassage' },
    farblabor:    { ic: '🧪', n: 'Farblabor', url: 'farblabor.html', w: 'Farben selbst mischen, Gegenfarben finden, Untergrund beim Aufhellen verstehen. Mit Quiz und Spickzettel.', wann: 'Sobald Farbenlehre und Coloration dran sind, also ab dem 1. Lehrjahr.', k: 'farbe farblabor mischen farbkreis gegenfarbe untergrund aufhellen neutralisieren oxidant' },
    farbfaelle:   { ic: '🎨', n: 'Farb-Fälle', ziel: 'farbfaelle', w: 'Rezepturen für echte Fälle planen und Rückmeldung von deiner Meisterin bekommen.', wann: 'Wenn du Farbe schon ein bisschen kannst und selbst planen üben willst.', k: 'farbfall farbfaelle rezeptur planen' },
    fachwissenfarbe: { ic: '📒', n: 'Fachwissen Farbe', url: 'fachwissen-farbe.html', w: 'Rezepturen, Mischverhältnisse und Einwirkzeiten aus dem Mitarbeiterhandbuch zum Nachschauen.', wann: 'Wenn du im Salon schnell nachschauen willst, wie wir etwas mischen.', k: 'rezeptur mischverhaeltnis einwirkzeit blondierung toenung coloration nachschauen' },
    wissensbank:  { ic: '🗂', n: 'Wissensbank', url: 'wissensbank.html', w: 'Das gesammelte Wissen aus unserem Mitarbeiterhandbuch: Fachwissen, Schritt-für-Schritt-Anleitungen und Grundlagen zu Handwerk und Betrieb, zum Nachschlagen und Vertiefen.', wann: 'Immer, wenn du etwas nachschauen oder vertiefen willst, auch mitten im Arbeitstag.', k: 'wissensbank nachschlagen nachschauen handbuch anleitung grundlagen betrieb' },
    fachbegriffe: { ic: '📖', n: 'Fachbegriffe', url: 'fachbegriffe.html', w: 'Fachwörter einfach erklärt und in 7 Sprachen übersetzt.', wann: 'Wenn ein Wort in der Berufsschule, im Quiz oder im Salon unklar ist.', k: 'fachbegriff wort woerterbuch uebersetzung sprache bedeutung' },
    farbtyp:      { ic: '🌸', n: 'Farbtyp-Beratung', url: 'farbtyp.html', w: 'Frühling, Sommer, Herbst oder Winter: welche Farben einem Gast stehen.', wann: 'Wenn Beratung und Farbwahl dran sind.', k: 'farbtyp fruehling sommer herbst winter beratung' },
    schnittwerkstatt: { ic: '✂', n: 'Schnittwerkstatt', url: 'schnittwerkstatt.html', w: 'Haarschnitte verstehen: Abteilungen, Winkel, Linien.', wann: 'Sobald Schneiden dran ist, vor allem im 2. Lehrjahr.', k: 'schnitt schneiden haarschnitt abteilung winkel werkstatt' },
    schnittdesigner: { ic: '✎', n: 'Schnitt-Designer', url: 'schnittdesigner.html', w: 'Einen Schnitt selbst planen und zeichnen.', wann: 'Wenn du Schnitte schon kennst und eigene planen willst.', k: 'schnitt designer zeichnen planen' },
    werkzeug:     { ic: '🧰', n: 'Werkzeugkunde', url: 'werkzeugkunde.html', w: 'Scheren, Kämme, Maschinen: wofür was da ist und wie man es pflegt.', wann: 'Gleich am Anfang des 1. Lehrjahrs.', k: 'werkzeug schere kamm maschine buerste pflege' },
    umformung:    { ic: '〰', n: 'Umformung: Dauerwelle & Glättung', url: 'umformung.html', w: 'Dauerwelle und Glättung Schritt für Schritt mit Fehlerkunde.', wann: 'Im 2. und 3. Lehrjahr.', k: 'umformung dauerwelle glaettung wickler fixierung' },
    makeup:       { ic: '💄', n: 'Make-up-Labor', url: 'makeup.html', w: 'Gesichtsformen erkennen und typgerecht schminken üben.', wann: 'Wenn Visagistik dran ist.', k: 'makeup schminken visagistik gesicht' },
    beratung:     { ic: '◐', n: 'Beratung & Formwirkung', url: 'beratung-formwirkung.html', w: 'Wie Schnitt und Frisur auf Gesichtsformen wirken, für eine gute Beratung.', wann: 'Wenn du in die Beratung einsteigst.', k: 'beratung formwirkung gesichtsform' },
    englisch:     { ic: '🇬🇧', n: 'Englisch im Salon', url: 'englisch-salon.html', w: 'Die wichtigsten Sätze und Fachwörter für Gäste, die Englisch sprechen.', wann: 'Jederzeit, ein paar Minuten reichen.', k: 'englisch english sprache touristen' },
    lernplan:     { ic: '📅', n: 'Lernplan', ziel: 'lernplan', w: 'Dein Wochenplan: welches Thema an welchem Tag dran ist.', wann: 'Am Anfang jeder Woche kurz anschauen.', k: 'lernplan wochenplan plan woche' },
    tipps:        { ic: '💡', n: 'Lerntipps', ziel: 'tipps', w: 'Tipps zu jedem Thema, wie du es dir gut merken kannst.', wann: 'Wenn ein Thema schwerfällt.', k: 'lerntipps tipps merken lernen' },
    landkarte:    { ic: '🗺', n: 'Kompetenz-Landkarte', ziel: 'progress', w: 'Dein Lernstand: was schon sitzt, was noch offen ist.', wann: 'Einmal pro Woche, um zu sehen, wo du stehst.', k: 'landkarte kompetenz lernstand fortschritt stand' },
    zwischenpruefung: { ic: '📝', n: 'Zwischenprüfung', url: 'zwischenpruefung.html', w: 'Üben wie bei der Zwischenprüfung, mit Prüfungszeit und Fachgespräch.', wann: 'Im 2. Lehrjahr, einige Monate vor dem Termin.', k: 'zwischenpruefung pruefung fachgespraech' },
    lap:          { ic: '🎓', n: 'LAP-Vorbereitung', ziel: 'lap', w: 'Prüfungsfragen für die Lehrabschlussprüfung mit Musterlösungen.', wann: 'Im 3. Lehrjahr, im letzten halben Jahr jede Woche.', k: 'lap lehrabschluss lehrabschlusspruefung abschlusspruefung pruefung' },
    sortieren:    { ic: '🧭', n: 'Kurz sortieren', ziel: 'sortieren', w: 'Nervös, Fehler gemacht, alles zu viel? In einer Minute zum nächsten Schritt.', wann: 'In stressigen oder unsicheren Momenten.', k: 'sortieren stress nervoes ueberfordert unsicher' },
    diagnose:     { ic: '🔎', n: 'Woran liegt’s?', ziel: 'diagnose', w: 'Etwas ist nicht so geworden wie geplant? Wörni sucht mit dir die Ursache.', wann: 'Nach einem Ergebnis, das nicht gepasst hat.', k: 'ursache diagnose warum nicht geklappt zu warm fleckig' },
    verzeichnis:  { ic: '🔎', n: 'A–Z-Verzeichnis', url: 'verzeichnis.html', w: 'Alle Bereiche der App von A bis Z.', wann: 'Wenn du etwas suchst und nicht weißt, wo es ist.', k: 'verzeichnis suchen finden wo' }
  };

  // ── Phasen ──────────────────────────────────────────────────────────────
  var PHASEN = {
    ankommen:  { n: 'Probezeit · Ankommen', module: ['regeln', 'probezeit', 'werkzeug', 'praxis'] },
    probezeit: { n: 'Probezeit', module: ['probezeit', 'regeln', 'quizkurz', 'praxis'] },
    lj1:       { n: '1. Lehrjahr', module: ['quizkurz', 'wiederholen', 'farblabor', 'praxis'] },
    lj2:       { n: '2. Lehrjahr', module: ['zwischenpruefung', 'schnittwerkstatt', 'farbfaelle', 'umformung'] },
    lj3:       { n: '3. Lehrjahr', module: ['lap', 'beratung', 'umformung', 'landkarte'] },
    lap:       { n: 'LAP-Endspurt', module: ['lap', 'wiederholen', 'landkarte', 'sortieren'] }
  };

  // lehrbeginn: 'JJJJ-MM-TT' oder leer · lehrjahr: '1'|'2'|'3'
  function phase(lehrbeginn, lehrjahr, jetzt) {
    jetzt = jetzt || Date.now();
    var lb = lehrbeginn && /^\d{4}-\d{2}-\d{2}/.test(String(lehrbeginn)) ? new Date(String(lehrbeginn).slice(0, 10) + 'T00:00:00').getTime() : NaN;
    var p = { tag: null };
    if (!isNaN(lb) && jetzt >= lb) {
      var t = Math.floor((jetzt - lb) / TAG);   // 0 = erster Tag
      p.tag = t + 1;
      if (t < 14) p.id = 'ankommen';
      else if (t < PROBEZEIT_TAGE) p.id = 'probezeit';
      else if (t < 365) p.id = 'lj1';
      else if (t < 730) p.id = 'lj2';
      else if (t < LAP_ENDSPURT_AB) p.id = 'lj3';
      else p.id = 'lap';
      p.woche = Math.floor(t / 7) + 1;
    } else {
      p.id = { '1': 'lj1', '2': 'lj2', '3': 'lj3' }[String(lehrjahr)] || 'lj1';
      // ohne Lehrbeginn: Kalenderwoche als Zähler, damit der Impuls wöchentlich wechselt
      p.woche = Math.floor((jetzt / TAG + 3) / 7);
    }
    p.n = PHASEN[p.id].n;
    return p;
  }

  // ── Impulse ─────────────────────────────────────────────────────────────
  // t: Titel · x: Text · f: Frage zum Nachdenken (wird nicht gespeichert) · m: Modul
  var TAGE = [  // Tag 1–14, jeden Tag einer
    { t: 'Willkommen im Team', x: 'Heute ist dein erster Tag. Niemand erwartet, dass du schon etwas kannst. Erwartet wird, dass du offen bist, zuschaust und fragst.', f: 'Was möchtest du heute unbedingt herausfinden?', m: 'regeln' },
    { t: 'Namen und Wege', x: 'Lern heute die Namen deiner Kolleginnen und Kollegen und wo was im Salon liegt. Das macht dich ab morgen schneller und sicherer.', f: 'Wen hast du heute schon mit Namen angesprochen?', m: 'werkzeug' },
    { t: 'Jeder Gast ist ein Gast', x: 'Bei uns ist jede Kundin und jeder Kunde ein willkommener Gast. Ein Blick, ein Lächeln und ein „Grüß Gott“ zählen ab der ersten Sekunde.', f: 'Wie hast du dich zuletzt irgendwo richtig willkommen gefühlt?', m: 'probezeit' },
    { t: 'Fragen ist Profi', x: 'Wer fragt, macht weniger Fehler. Frag lieber einmal zu oft als einmal zu wenig, vor allem bei Chemie, Hitze und scharfen Werkzeugen.', f: 'Welche Frage hast du dich heute noch nicht getraut?', m: 'sortieren' },
    { t: 'Sauberkeit ist Schutz', x: 'Hygiene ist kein Putzdienst, sondern Schutz für Gäste und für dich. Saubere Werkzeuge, saubere Hände, saubere Plätze.', f: 'Was hast du heute gesehen, das mit Hygiene zu tun hat?', m: 'wissensbank' },
    { t: 'Deine Füße arbeiten mit', x: 'Die ersten Wochen sind körperlich anstrengend. Gute Schuhe, gerade Haltung und Trinken zwischendurch helfen mehr, als du denkst.', f: 'Was tut dir nach einem Arbeitstag am meisten weh, und was hilft dagegen?', m: 'probezeit' },
    { t: 'Eine Woche geschafft', x: 'Du hast die erste Woche hinter dir. Schau kurz zurück: Was hast du gelernt, was war schwer, was hat Spaß gemacht?', f: 'Was war dein bester Moment diese Woche?', m: 'praxis' },
    { t: 'Zuschauen ist Lernen', x: 'Wenn du assistierst, schau genau hin: Wie spricht die Kollegin mit dem Gast? Wie hält sie die Schere? Das ist Unterricht ohne Tafel.', f: 'Welchen Handgriff möchtest du als Nächstes selbst probieren?', m: 'praxis' },
    { t: 'Pünktlich heißt verlässlich', x: 'Wenn du pünktlich bist, kann das Team mit dir planen. Wenn etwas dazwischenkommt, gib vorher Bescheid, nicht nachher.', f: 'Was hilft dir, morgens gut rechtzeitig da zu sein?', m: 'regeln' },
    { t: 'Ein Wort pro Tag', x: 'Jeder Beruf hat seine Sprache. Nimm dir heute ein Fachwort vor, das du gehört, aber nicht ganz verstanden hast.', f: 'Welches Wort war das heute?', m: 'fachbegriffe' },
    { t: 'Fehler gehören dazu', x: 'Fehler beim Lernen sind normal. Wichtig ist, sie gleich zu sagen und zu verstehen, warum sie passiert sind.', f: 'Was würdest du beim nächsten Mal anders machen?', m: 'sortieren' },
    { t: 'Fünf Minuten Wissen', x: 'Ein paar Quizfragen am Tag bringen mehr als eine lange Runde vor der Prüfung. Probier heute fünf Fragen.', f: 'Wann am Tag hast du fünf ruhige Minuten?', m: 'quizkurz' },
    { t: 'Aufmerksamkeit schenken', x: 'Ein Gast merkt sofort, ob du mit den Gedanken bei ihm bist. Handy weg, Blick zum Gast, zuhören.', f: 'Woran merkst du selbst, dass dir jemand wirklich zuhört?', m: 'probezeit' },
    { t: 'Zwei Wochen dabei', x: 'Du kennst jetzt die Abläufe besser als am ersten Tag. Sprich mit deiner Meisterin darüber, wie es dir geht und was du als Nächstes lernen willst.', f: 'Was möchtest du deiner Meisterin diese Woche erzählen?', m: 'probezeit' }
  ];
  var PROBEZEIT_WOCHEN = [  // Woche 3–13, eine pro Woche
    { t: 'Routine aufbauen', x: 'Jetzt beginnt die Zeit, in der Handgriffe zur Routine werden. Wiederholung ist kein Stillstand, sondern der Weg zur Sicherheit.', f: 'Welcher Handgriff fühlt sich schon sicherer an als am Anfang?', m: 'praxis' },
    { t: 'Die Haarwäsche ist dein Auftritt', x: 'Bei der Haarwäsche lernt dich der Gast kennen. Wassertemperatur fragen, Nacken stützen, ruhige Hände. Hier zeigst du, wie sorgfältig du bist.', f: 'Was willst du bei der nächsten Haarwäsche besonders gut machen?', m: 'praxis' },
    { t: 'Ehrlich hinschauen', x: 'Die Probezeit ist für beide Seiten da. Frag dich ehrlich: Macht mir die Arbeit mit Menschen und Haaren Freude, auch an anstrengenden Tagen?', f: 'Was gibt dir in diesem Beruf Energie?', m: 'probezeit' },
    { t: 'Rückmeldung holen', x: 'Warte nicht, bis du Rückmeldung bekommst. Frag selbst: „Was mache ich schon gut, was soll ich üben?“ Das zeigt Einsatz.', f: 'Wen fragst du diese Woche um eine Rückmeldung?', m: 'sortieren' },
    { t: 'Das Warum hinter Regeln', x: 'Jede Regel im Salon hat einen Grund: Schutz, Vertrauen oder Qualität. Wenn du den Grund nicht kennst, frag nach.', f: 'Welche Regel verstehst du noch nicht ganz?', m: 'wissensbank' },
    { t: 'Halbzeit', x: 'Die Hälfte der Probezeit ist um. Schau auf das, was du schon kannst. Das ist mehr, als du am ersten Tag gedacht hättest.', f: 'Was kannst du heute, was du vor sechs Wochen nicht konntest?', m: 'landkarte' },
    { t: 'Teamgeist zeigt sich im Kleinen', x: 'Handtücher falten, Platz freiräumen, einer Kollegin etwas reichen, ohne gefragt zu werden. Das merkt das Team.', f: 'Wobei kannst du morgen jemandem im Team helfen, ohne gefragt zu werden?', m: 'probezeit' },
    { t: 'Berufsschule und Salon gehören zusammen', x: 'Was du in der Berufsschule lernst, siehst du im Salon wieder. Verbinde beides: Frag im Salon nach, was in der Schule dran war.', f: 'Welches Thema aus der Schule hast du schon im Salon gesehen?', m: 'themenquiz' },
    { t: 'Gast statt Termin', x: 'Ein Gast ist kein Termin im Kalender, sondern ein Mensch mit einem Wunsch. Frag nach, hör zu und wiederhole, was du verstanden hast.', f: 'Was hat dir ein Gast zuletzt über sich erzählt?', m: 'lernfaelle' },
    { t: 'Dranbleiben', x: 'Nicht jeder Tag ist ein guter Tag. Profis kommen auch an zähen Tagen pünktlich, freundlich und konzentriert.', f: 'Was hilft dir an einem zähen Tag?', m: 'sortieren' },
    { t: 'Die Probezeit geht zu Ende', x: 'Bald endet die Probezeit. Sprich offen mit deiner Meisterin: Wie geht es dir, was willst du lernen, wo brauchst du Hilfe? Ab jetzt baust du auf.', f: 'Was nimmst du dir für dein erstes Lehrjahr vor?', m: 'lernplan' }
  ];
  var POOLS = {  // ab Ende der Probezeit: eine pro Woche, im Kreis
    lj1: [
      { t: 'Grundlagen tragen alles', x: 'Hygiene, Haarkunde, Werkzeug und Farbenlehre sind das Fundament. Was du jetzt gut lernst, brauchst du bis zur LAP.', f: 'Welches Grundlagenthema sitzt schon, welches noch nicht?', m: 'landkarte' },
      { t: 'Farbe verstehen, nicht auswendig lernen', x: 'Wer den Farbkreis versteht, muss weniger auswendig lernen. Probier im Farblabor, was beim Mischen passiert.', f: 'Welche Gegenfarbe neutralisiert Gelb?', m: 'farblabor' },
      { t: 'Kleine Runden, großer Effekt', x: 'Fünf Fragen am Tag sind mehr wert als fünfzig am Sonntagabend. Dein Wochenziel hilft dir dabei.', f: 'An welchen Tagen schaffst du deine Runde am leichtesten?', m: 'quizkurz' },
      { t: 'Wackeln ist erlaubt', x: 'Was noch wackelt, kommt in „Wiederholen“. Es ist kein Zeugnis, sondern dein persönlicher Trainingsplan.', f: 'Welches Thema willst du diese Woche festigen?', m: 'wiederholen' },
      { t: 'Gespräche mit Gästen', x: 'Ein gutes Gespräch beginnt mit einer offenen Frage: „Was wünschen Sie sich heute?“ Dann zuhören, nicht gleich antworten.', f: 'Welche offene Frage willst du diese Woche ausprobieren?', m: 'lernfaelle' },
      { t: 'Eintragen, was du übst', x: 'Im Praxis-Tagebuch siehst du später schwarz auf weiß, wie viel du geübt hast. Das hilft dir und deiner Meisterin.', f: 'Was hast du diese Woche geübt?', m: 'praxis' },
      { t: 'Nachschlagen statt raten', x: 'Wenn du unsicher bist, schau in der Wissensbank nach oder frag. Raten ist im Salon keine Option.', f: 'Was hast du zuletzt nachgeschaut?', m: 'wissensbank' },
      { t: 'Haltung zeigt sich am Platz', x: 'Ein aufgeräumter Platz, saubere Werkzeuge, ein freundliches Gesicht: Gäste sehen das, bevor du ein Wort sagst.', f: 'Wie sieht dein Platz am Ende des Tages aus?', m: 'probezeit' }
    ],
    lj2: [
      { t: 'Vom Zuschauen zum Selbermachen', x: 'Im 2. Lehrjahr machst du mehr selbst. Bereite dich vor jedem Schritt kurz vor: Was ist das Ziel, was brauche ich?', f: 'Welchen Ablauf willst du diese Woche selbst machen?', m: 'praxis' },
      { t: 'Die Zwischenprüfung ist ein Probelauf', x: 'Die Zwischenprüfung zeigt dir, wo du stehst. Übe mit Prüfungszeit, dann ist der echte Tag kein Sprung ins kalte Wasser.', f: 'Welcher Prüfungsteil macht dich am meisten nervös?', m: 'zwischenpruefung' },
      { t: 'Schnitte lesen lernen', x: 'Ein Haarschnitt ist eine Abfolge aus Abteilung, Winkel und Linie. Wer das sieht, kann jeden Schnitt nachvollziehen.', f: 'Welchen Schnitt hast du diese Woche gesehen und könntest du ihn erklären?', m: 'schnittwerkstatt' },
      { t: 'Rezeptur mit Plan', x: 'Eine gute Farbe beginnt mit einem Plan: Ausgangsfarbe, Wunsch, Untergrund, Rezeptur. Übe das an echten Fällen.', f: 'Was schaust du dir an, bevor du eine Rezeptur planst?', m: 'farbfaelle' },
      { t: 'Fehlerkunde ist Profiwissen', x: 'Wenn etwas nicht klappt, such die Ursache, nicht die Schuld. „Woran liegt’s?“ hilft dir dabei.', f: 'Welches Ergebnis hat zuletzt nicht gepasst, und warum?', m: 'diagnose' },
      { t: 'Beraten heißt Verantwortung', x: 'Wenn du berätst, übernimmst du Verantwortung für das Ergebnis. Sag ehrlich, was geht und was nicht.', f: 'Wie sagst du einem Gast freundlich, dass ein Wunsch so nicht geht?', m: 'beratung' },
      { t: 'Dranbleiben in der Mitte', x: 'Die Mitte der Lehre ist oft die zäheste Zeit. Schau auf deine Kompetenz-Landkarte, du bist weiter, als du denkst.', f: 'Worauf bist du in diesem Lehrjahr stolz?', m: 'landkarte' }
    ],
    lj3: [
      { t: 'Das letzte Lehrjahr', x: 'Jetzt fügst du alles zusammen: Technik, Beratung, Zeitgefühl. Die LAP prüft genau das.', f: 'Was willst du bis zur LAP noch sicher können?', m: 'lap' },
      { t: 'Zeit im Blick', x: 'Im Salon und in der Prüfung zählt auch die Zeit. Übe Abläufe mit Uhr, ohne zu hetzen.', f: 'Bei welchem Ablauf brauchst du noch zu lange?', m: 'zwischenpruefung' },
      { t: 'Erklären, was du tust', x: 'In der Prüfung zählt nicht nur das Ergebnis. Sag in einfachen Worten, warum du es so machst.', f: 'Kannst du deinen letzten Schnitt in drei Sätzen erklären?', m: 'lap' },
      { t: 'Dauerwelle und Glättung', x: 'Umformung verzeiht wenig. Kenne Haarzustand, Produkt und Einwirkzeit, bevor du startest.', f: 'Welche Fehler bei der Dauerwelle kennst du und wie vermeidest du sie?', m: 'umformung' },
      { t: 'Gastgeben, nicht nur Handwerk', x: 'Ein Gast kommt wieder, weil er sich wohlgefühlt hat. Technik plus Aufmerksamkeit, das macht Profis aus.', f: 'Was machst du, damit sich ein Gast bei dir wohlfühlt?', m: 'beratung' },
      { t: 'Lücken schließen', x: 'Schau auf die Themen, die noch offen sind. Jetzt ist die beste Zeit, sie anzugehen, nicht kurz vor der Prüfung.', f: 'Welches offene Thema nimmst du dir diese Woche vor?', m: 'landkarte' }
    ],
    lap: [
      { t: 'Endspurt mit Plan', x: 'Bis zur LAP zählt jede Woche. Nimm dir pro Woche zwei Themen vor und übe die Prüfungsfragen dazu.', f: 'Welche zwei Themen sind diese Woche dran?', m: 'lap' },
      { t: 'Wiederholen ist jetzt Gold', x: 'Was noch wackelt, ist jetzt wichtiger als neues Wissen. Arbeite deine Wiederholungen ab.', f: 'Wie viele Themen wackeln noch?', m: 'wiederholen' },
      { t: 'Nervosität gehört dazu', x: 'Ein bisschen Nervosität macht wach. Was hilft, ist Übung unter Prüfungsbedingungen und ein klarer Ablauf im Kopf.', f: 'Was beruhigt dich vor einer Prüfung?', m: 'sortieren' },
      { t: 'Dein Weg bis hierher', x: 'Denk an deinen ersten Tag zurück. Du bist von „Wo liegen die Handtücher?“ bis kurz vor die LAP gekommen.', f: 'Was würdest du einem neuen Lehrling an seinem ersten Tag sagen?', m: 'landkarte' },
      { t: 'Der Prüfungstag', x: 'Pack am Vortag alles zusammen, schlaf gut und iss etwas. Am Prüfungstag zeigst du nur, was du schon kannst.', f: 'Was gehört auf deine Packliste für die Prüfung?', m: 'lap' }
    ]
  };

  function impuls(p) {
    var x, id;
    if (p.id === 'ankommen') { x = TAGE[p.tag - 1]; id = 'pz-t' + p.tag; }
    else if (p.id === 'probezeit') {
      var w = Math.min(Math.max(p.woche - 3, 0), PROBEZEIT_WOCHEN.length - 1);
      x = PROBEZEIT_WOCHEN[w]; id = 'pz-w' + (w + 3);
    } else {
      var pool = POOLS[p.id];
      x = pool[p.woche % pool.length]; id = p.id + '-w' + p.woche;
    }
    return x ? { id: id, t: x.t, x: x.x, f: x.f, m: x.m } : null;
  }

  // ── Probezeit-Modul ─────────────────────────────────────────────────────
  var PROBEZEIT = [
    { ic: '🤝', t: 'Wozu die Probezeit da ist',
      absaetze: [
        'Die ersten drei Monate deiner Lehre sind die Probezeit. Sie ist kein Test, den du bestehen musst, sondern eine Zeit zum gegenseitigen Kennenlernen.',
        'Du findest heraus, ob dir der Beruf und unser Salon wirklich gefallen. Wir finden heraus, ob du gut ins Team passt und Freude am Handwerk hast. Beide Seiten dürfen in dieser Zeit ehrlich sagen, wenn es nicht passt.'
      ],
      punkte: ['Ankommen: Abläufe, Team, Gäste und Regeln kennenlernen', 'Ausprobieren: erste Handgriffe unter Anleitung', 'Ehrlich sein: sagen, was gut läuft und was schwerfällt', 'Fragen stellen: jede Frage ist in dieser Zeit willkommen'],
      fragen: ['Was hat dich dazu gebracht, Friseurin oder Friseur werden zu wollen?', 'Was möchtest du nach drei Monaten über dich und den Beruf wissen?'] },
    { ic: '🔍', t: 'Realitätscheck: So sieht die Friseurlehre aus',
      absaetze: [
        'Friseurin oder Friseur ist ein schöner, kreativer Beruf. Er ist aber auch Handwerk, und Handwerk heißt üben, üben, üben. Ehrlich gesagt sieht der Alltag am Anfang oft so aus:'
      ],
      punkte: [
        'Handwerk: Am Anfang wäschst du viel, räumst auf, reichst an und schaust zu. Das ist kein Leerlauf, so lernst du die Abläufe.',
        'Ausdauer: Du stehst viele Stunden. Dein Körper gewöhnt sich daran, gute Schuhe und Pausen helfen.',
        'Verlässlichkeit: Gäste haben Termine. Wenn du pünktlich und vorbereitet bist, kann das Team mit dir planen.',
        'Hygiene: Saubere Werkzeuge, Hände und Plätze schützen Gäste und dich. Das gilt jeden Tag, nicht nur, wenn jemand schaut.',
        'Teamgeist: Im Salon arbeitet niemand allein. Mithelfen, ohne gefragt zu werden, macht dich zu einem Teil des Teams.',
        'Lernen neben der Arbeit: Berufsschule und ein paar Minuten Lernen pro Tag gehören dazu, bis zur Lehrabschlussprüfung (LAP).'
      ],
      fragen: ['Was davon fällt dir leicht, was wird eine Herausforderung?', 'Was hilft dir, wenn ein Tag anstrengend war?'] },
    { ic: '✨', t: 'Haltung und das Warum',
      absaetze: [
        'Bei uns ist jede Kundin und jeder Kunde ein willkommener Gast. Gäste schenken uns ihre Zeit und ihr Vertrauen, denn sie lassen jemanden an ihr Aussehen. Deshalb bekommen sie unsere volle Aufmerksamkeit und echte Wertschätzung.',
        'Unsere Standards sind kein Selbstzweck. Hinter jedem steht ein Warum:'
      ],
      punkte: [
        'Begrüßen, sobald jemand hereinkommt: Der Gast soll sich vom ersten Moment an gesehen fühlen.',
        'Handy weg bei der Arbeit: Aufmerksamkeit gehört dem Gast, nicht dem Bildschirm.',
        'Zuhören und nachfragen: Nur wer den Wunsch genau versteht, kann ihn erfüllen.',
        'Hygiene und Schutz zuerst: Gesundheit ist wichtiger als Tempo.',
        'Pünktlich und gepflegt: Gäste vertrauen jemandem, der verlässlich und sorgfältig wirkt.',
        'Fehler gleich sagen: Ehrlichkeit schützt den Gast und das Vertrauen ins Team.'
      ],
      fragen: ['Wann hast du dich zuletzt irgendwo richtig als Gast gefühlt, und woran lag das?', 'Welcher Standard ist dir noch nicht ganz klar? Frag deine Meisterin nach dem Warum.'] },
    { ic: '🧭', t: 'Was dir in der App hilft',
      absaetze: ['Für die ersten Wochen sind diese Bereiche besonders nützlich. Du kannst Wörni auch jederzeit fragen, wofür ein Bereich da ist.'],
      module: ['regeln', 'werkzeug', 'praxis', 'wissensbank', 'fachbegriffe', 'quizkurz', 'sortieren'] }
  ];

  // ── Frag Wörni: feste Antworten ─────────────────────────────────────────
  // w: Suchwörter (Wortanfänge, ohne Umlaute) · a: Antwort · m: passende Module
  var MEISTERIN = 'Frag deine Meisterin, sie kennt eure Regeln im Salon.';
  var ANTWORTEN = [
    { w: ['probezeit', 'wozu probezeit', 'was ist probezeit', 'wie lange probezeit', 'probe zeit'], a: 'Die Probezeit sind die ersten drei Monate deiner Lehre. Sie ist zum gegenseitigen Kennenlernen da: Du merkst, ob Beruf und Salon zu dir passen, wir merken, ob du gut ins Team passt. Beide Seiten dürfen in dieser Zeit ehrlich sagen, wenn es nicht passt.', m: ['probezeit'] },
    { w: ['bewertet', 'beurteil', 'gut genug', 'schaffe ich', 'bestehe', 'bestanden', 'rauswerf', 'gekuendigt', 'kuendig'], a: 'Wie es dir geht und wie du dich entwickelst, besprichst du direkt mit deiner Meisterin. Wörni kennt keine Beurteilungen und speichert nichts dazu. Mein Tipp: Frag selbst nach Rückmeldung, zum Beispiel „Was mache ich schon gut, was soll ich üben?“. Das zeigt Einsatz.', m: ['probezeit', 'sortieren'] },
    { w: ['erster tag', 'ersten tag', 'erste woche', 'anfang', 'neu im salon', 'neu hier'], a: 'Am Anfang erwartet niemand, dass du schon etwas kannst. Wichtig sind: pünktlich sein, freundlich grüßen, zuschauen, fragen und mithelfen. Lern die Namen im Team und wo was liegt. Den Rest lernst du Schritt für Schritt.', m: ['probezeit', 'werkzeug'] },
    { w: ['reden mit', 'smalltalk', 'small talk', 'gespraech', 'was sagen', 'schuechtern', 'peinlich'], a: 'Ein gutes Gespräch beginnt mit einer offenen Frage, zum Beispiel „Was wünschen Sie sich heute?“ oder „Wie pflegen Sie Ihre Haare zuhause?“. Dann zuhören. Manche Gäste wollen lieber Ruhe, das darfst du respektieren. Über Privates anderer Gäste oder Kolleginnen wird nicht gesprochen.', m: ['lernfaelle', 'englisch'] },
    { w: ['unzufrieden', 'reklamation', 'beschwer', 'gefaellt nicht', 'schimpft', 'sauer'], a: 'Wenn ein Gast unzufrieden ist: ruhig bleiben, zuhören, nicht rechtfertigen und gleich deine Meisterin oder eine erfahrene Kollegin holen. Du musst das nicht allein lösen.', m: ['lernfaelle', 'sortieren'] },
    { w: ['gast', 'gaeste', 'kundin', 'kunde', 'begruess', 'empfang', 'willkommen'], a: 'Bei uns ist jede Kundin und jeder Kunde ein willkommener Gast. Begrüß jeden, sobald er hereinkommt, mit Blick und Lächeln. Biete etwas an, hör zu und schenk deine volle Aufmerksamkeit. Gäste schenken uns ihre Zeit und ihr Vertrauen.', m: ['probezeit', 'lernfaelle'] },
    { w: ['puenktlich', 'zu spaet', 'verspaet', 'verschlafen', 'bus verpasst'], a: 'Pünktlich sein heißt, dass das Team mit dir planen kann. Wenn du zu spät kommst, gib so früh wie möglich Bescheid, bevor dein Dienst beginnt, nicht nachher. ' + MEISTERIN, m: ['probezeit'] },
    // Krankenstand, Urlaub, Pause, Ausbildung, Kleidung: nach den Verhaltensregeln des Salons (salon-regeln.js)
    { w: ['krank', 'krankenstand', 'arzt', 'fieber', 'krankmeld', 'whatsapp', 'verlaenger'], a: 'So machst du es bei uns: Vor dem Arztbesuch darfst du dich per WhatsApp krankmelden. Nach dem Arztbesuch rufst du gleich in der Firma an und sagst, wie lange du voraussichtlich ausfällst. Die Krankmeldung muss am selben Tag eingereicht werden. Wird der Krankenstand länger, sagst du das ebenfalls telefonisch. Wichtig: Nach der ersten Ankündigung gilt keine WhatsApp mehr, alles Weitere nur per Telefon.', m: ['regeln'] },
    { w: ['urlaub', 'urlaubsansuchen', 'urlaubsantrag', 'frei nehmen', 'freier tag', 'ferien'], a: 'So geht Urlaub bei uns: Zuerst sprichst du dich mit den Kolleginnen und Kollegen ab, damit Lehrlinge und Gesellen nicht gleichzeitig weg sind. Denk auch an deinen Blockunterricht. Dann erstellst du ein Urlaubsansuchen und gibst es der Chefin. Gültig ist der Urlaub erst, wenn die Chefin ihn genehmigt hat, also erst danach etwas buchen.', m: ['regeln'] },
    { w: ['mittagspause', 'pause', 'mittag', 'essen gehen', 'rausgehen'], a: 'Die Mittagspause ist in der festgelegten Mittagszeit. In der ersten halben Stunde darfst du den Salon verlassen, die zweite Hälfte verbringst du im Salon.', m: ['regeln'] },
    { w: ['freie zeit', 'nichts zu tun', 'nichts los', 'leerlauf', 'kein gast', 'keinen gast', 'langweilig', 'ausbildungsbuch', 'dokumentier'], a: 'Bei uns gilt: Jede freie Minute nutzt du für deine Ausbildung, mit den Übungen, die dir die Chefin oder deine Ausbildnerin vorgibt. Alles, was du lernst, dokumentierst du im Ausbildungsbuch. Ein paar Quizfragen oder ein Eintrag im Praxis-Tagebuch passen auch gut in kurze Lücken.', m: ['regeln', 'praxis', 'quizkurz'] },
    { w: ['lohn', 'gehalt', 'geld', 'verdien', 'vertrag', 'lehrvertrag', 'ueberstunden', 'arbeitszeit'], a: 'Zu Vertrag, Lohn oder Arbeitszeit kann und soll Wörni nichts sagen, dafür kennt er deine Daten bewusst nicht. Frag die Chefin. Unabhängige Auskunft für Lehrlinge geben auch die Lehrlingsstelle der Wirtschaftskammer und die Arbeiterkammer.', m: [] },
    { w: ['handy', 'telefon', 'smartphone', 'instagram', 'tiktok'], a: 'Bei der Arbeit gehört deine Aufmerksamkeit dem Gast, deshalb bleibt das Handy weg. In der Pause darfst du natürlich. Wie das in eurem Salon genau geregelt ist: ' + MEISTERIN, m: ['probezeit'] },
    { w: ['anziehen', 'ziehe ich an', 'was trage', 'kleidung', 'bekleidung', 'outfit', 'aussehen', 'farbe kleidung', 'jogging', 'sportkleidung', 'kappe', 'muetze', 'kopfbedeckung', 'gepflegt', 'frisur'], a: 'Bei uns gilt: Die Kleidung ist sauber und in Schwarz, Grau oder Weiß. Deine Haare sind gewaschen und friseurwürdig gestylt, denn Gäste schauen dir auf die Haare. Nicht erlaubt sind Sportkleidung wie Jogginganzüge und jede Art von Kopfbedeckung, zum Beispiel Kappen.', m: ['regeln'] },
    { w: ['allergietest', 'hauttest', 'allergie test', 'vertraeglich'], a: 'Ob und wie ein Hauttest gemacht wird, steht in der Gebrauchsanweisung des Produkts und in unseren Salon-Regeln. Frag vor einer Farbe bei neuen Gästen immer deine Meisterin. Reagiert die Haut während einer Behandlung, sofort aufhören und Bescheid sagen.', m: ['fachwissenfarbe', 'wissensbank'] },
    { w: ['hygiene', 'desinfiz', 'sauber', 'putzen', 'handschuh', 'reinig'], a: 'Hygiene hat bei uns oberste Priorität, bei dir persönlich und im ganzen Geschäft. Werkzeuge nach jedem Gast reinigen und desinfizieren, Hände waschen, bei Farbe und Chemie Handschuhe tragen, frische Handtücher und Umhänge. Wie es bei uns genau geht, steht in der Wissensbank.', m: ['regeln', 'wissensbank'] },
    { w: ['stehen', 'rueck', 'fuesse', 'fuss', 'muede', 'erschoepft', 'schmerz', 'anstrengend'], a: 'Die ersten Wochen sind körperlich anstrengend, das ist normal. Gute, bequeme Schuhe, gerade Haltung, Trinken und die Pausen nutzen helfen. Wenn etwas länger wehtut, sag es deiner Meisterin.', m: ['probezeit'] },
    { w: ['fehler', 'falsch gemacht', 'verbockt', 'kaputt', 'misslungen', 'passiert'], a: 'Fehler beim Lernen sind normal. Wichtig ist: gleich Bescheid sagen, verstehen, was passiert ist, und es beim nächsten Mal anders machen. Ehrlichkeit schützt den Gast und das Vertrauen im Team.', m: ['sortieren', 'diagnose'] },
    { w: ['nervoes', 'angst', 'aufgeregt', 'unsicher', 'traue mich', 'trau mich'], a: 'Anspannung vor etwas Neuem ist normal. Geh den Ablauf vorher einmal durch und bitte deine Meisterin, beim ersten Mal zuzuschauen. Ein Satz reicht: „Schaust du beim ersten Schritt kurz zu?“', m: ['sortieren', 'praxis'] },
    { w: ['zu viel', 'ueberfordert', 'stress', 'schaffe das nicht', 'keine lust', 'motivation', 'aufhoeren', 'abbrechen'], a: 'Nicht jeder Tag ist leicht, und niemand muss alles gleichzeitig können. Such dir nur den einen nächsten Schritt. Wenn dich etwas länger belastet oder du ans Aufhören denkst, sprich mit deiner Meisterin. Das ist mutig, nicht schwach.', m: ['sortieren'] },
    { w: ['team', 'kollegin', 'kollege', 'streit', 'konflikt', 'nicht verstehen mit'], a: 'Im Salon arbeitet niemand allein. Mithelfen, ohne gefragt zu werden, macht dich zum Teil des Teams. Wenn es Spannungen gibt, sprich es ruhig und direkt an oder hol dir Hilfe bei deiner Meisterin.', m: ['probezeit'] },
    { w: ['berufsschule', 'schule', 'lehrerin', 'unterricht', 'blockunterricht'], a: 'Berufsschule und Salon gehören zusammen. Was in der Schule dran ist, siehst du im Salon wieder. Frag im Salon nach, und übe die Schulthemen im Themen-Quiz.', m: ['themenquiz', 'fachbegriffe'] },
    { w: ['lernen', 'lerne', 'wie oft lernen', 'wochenziel', 'wann lernen', 'lerne ich'], a: 'Kurz und regelmäßig bringt am meisten: ein paar Quizfragen an mehreren Tagen pro Woche. Dein Wochenziel auf der Startseite zeigt, wie oft. Was wackelt, kommt automatisch in „Wiederholen“.', m: ['quizkurz', 'wiederholen', 'lernplan'] },
    { w: ['lehrjahr', 'was lerne ich wann', 'themen', 'ausbildung ablauf', 'drei jahre'], a: 'Im 1. Lehrjahr geht es um die Grundlagen: Hygiene, Werkzeug, Haar- und Hautkunde, Farbenlehre, Beratung. Im 2. Lehrjahr kommen Schnitt-Techniken, Coloration, Umformung und die Zwischenprüfung. Im 3. Lehrjahr fügst du alles zusammen und bereitest dich auf die LAP vor.', m: ['landkarte', 'lernplan'] },
    { w: ['zwischenpruefung', 'zwischen pruefung'], a: 'Die Zwischenprüfung ist ein Probelauf in der Mitte der Lehre. Übe mit Prüfungszeit und Fachgespräch, dann weißt du, wo du stehst.', m: ['zwischenpruefung'] },
    { w: ['lap', 'lehrabschluss', 'abschlusspruefung', 'gesellenpruefung', 'pruefung'], a: 'Die Lehrabschlussprüfung (LAP) am Ende der Lehre prüft Theorie und Praxis. Im 3. Lehrjahr übst du am besten jede Woche Prüfungsfragen und arbeitest offene Themen auf deiner Kompetenz-Landkarte ab.', m: ['lap', 'landkarte', 'wiederholen'] },
    { w: ['woerni', 'wer bist du', 'was kannst du', 'hilfe', 'was machst du'], a: 'Ich bin Wörni, dein persönlicher Coach für die ganze Lehrzeit, vom ersten Tag bis zur LAP. Ich melde mich mit Impulsen, erkläre dir unsere Verhaltensregeln und die Bereiche der App und zeige dir, wo du nachschauen kannst. Ich ersetze keine Meisterin und speichere nichts von dem, was du mich fragst.', m: ['regeln', 'verzeichnis'] },
    { w: ['speicher', 'datenschutz', 'daten', 'wer sieht', 'liest mit'], a: 'Deine Fragen an Wörni werden nirgends gespeichert, auch nicht auf deinem Handy, und niemand liest sie mit. Wörni kennt keine Vertrags- oder Personaldaten. Dein Lernstand aus den Quiz ist davon getrennt und für dich und deine Meisterin sichtbar.', m: [] },
    { w: ['farbe', 'oxidant', 'blondier', 'aufhell', 'coloration', 'toenung', 'rezeptur', 'mischen', 'einwirk'], a: 'Für Farbfragen gibt es drei gute Orte: Im Farblabor verstehst du die Farbenlehre, in Fachwissen Farbe stehen unsere Rezepturen und Einwirkzeiten, und in den Farb-Fällen übst du das Planen. Bei echten Gästen gilt: vor dem Mischen immer kurz mit der Meisterin abstimmen.', m: ['farblabor', 'fachwissenfarbe', 'farbfaelle'] },
    { w: ['schneiden', 'schnitt', 'haarschnitt', 'schere'], a: 'Schneiden lernst du Schritt für Schritt: erst Werkzeug und Abteilungen, dann Winkel und Linien. In der Schnittwerkstatt verstehst du, wie ein Schnitt aufgebaut ist.', m: ['schnittwerkstatt', 'werkzeug', 'schnittdesigner'] },
    { w: ['dauerwelle', 'glaett', 'umformung', 'wickler'], a: 'Dauerwelle und Glättung verzeihen wenig: Haarzustand prüfen, Probewickler machen, Einwirkzeit genau einhalten. Das Modul Umformung zeigt dir die Abläufe mit Fehlerkunde.', m: ['umformung', 'diagnose'] },
    { w: ['waschen', 'haarwaesche', 'massage', 'kopfmassage'], a: 'Die Haarwäsche ist oft dein erster Auftritt beim Gast: Wassertemperatur fragen, Nacken stützen, ruhige Hände, nicht hetzen. Den Ablauf findest du in den Praxis-Modulen.', m: ['praxis'] },
    { w: ['wort', 'bedeutet', 'heisst', 'begriff', 'uebersetz'], a: 'Unbekannte Fachwörter findest du in den Fachbegriffen, einfach erklärt und in 7 Sprachen.', m: ['fachbegriffe'] },
    { w: ['nachschlagen', 'nachschauen', 'anleitung', 'handbuch', 'wo steht'], a: 'In der Wissensbank liegt das gesammelte Wissen aus unserem Mitarbeiterhandbuch: Fachwissen, Schritt-für-Schritt-Anleitungen und Grundlagen zum Nachschlagen und Vertiefen.', m: ['wissensbank', 'fachwissenfarbe'] },
    { w: ['regeln', 'verhaltensregeln', 'regel', 'hausordnung', 'was gilt', 'erlaubt', 'verboten'], a: 'Unsere Verhaltensregeln sagen dir, wie es bei uns läuft: Krankmeldung, Urlaubsansuchen, Mittagspause, Ausbildung, Hygiene sowie Kleidung und Frisur. Ich erkläre dir zu jedem Punkt, warum er wichtig ist. Lies sie am besten gleich ganz durch.', m: ['regeln'] }
  ];

  // Sofort ernst nehmen: Verletzung, Hautreaktion, Belästigung, Krise.
  var NOT = [
    { w: ['verletz', 'blutet', ' blut ', 'mich geschnitten', 'in den finger', 'verbrannt', 'verbrueh', 'veraetz', 'brennt', 'allergische reaktion', 'allergisch reagiert', 'ausschlag', 'hautreaktion', 'juckt stark', 'ins auge'],
      a: 'Das hat jetzt Vorrang: Hör sofort auf, was du gerade machst, und sag gleich jemandem im Salon Bescheid. Bei Chemie im Auge: sofort mit viel Wasser spülen. Bei einem Notfall ruf die Rettung unter 144.' },
    { w: ['mobb', 'belaestig', 'angefasst', 'begrapsch', 'schlaegt mich', 'geschlagen', 'gewalt', 'bedroh', 'schreit mich', 'angeschrien', 'beleidig', 'diskriminier'],
      a: 'Das ist nicht in Ordnung, und du musst das nicht allein aushalten. Sprich mit einer Person, der du vertraust: deine Meisterin, deine Eltern oder eine Lehrerin in der Berufsschule. Anonym und kostenlos hilft dir rund um die Uhr Rat auf Draht unter 147. Auch die Arbeiterkammer berät Lehrlinge vertraulich.' },
    { w: ['suizid', 'selbstmord', 'umbringen', 'nicht mehr leben', 'will sterben', 'ritze', 'ritzen', 'selbstverletz', 'mir was antun', 'keinen sinn mehr'],
      a: 'Danke, dass du das schreibst. Bitte bleib damit nicht allein. Ruf jetzt Rat auf Draht unter 147 an, anonym, kostenlos und rund um die Uhr, oder sprich mit einem Menschen in deiner Nähe. Wenn du in akuter Gefahr bist, ruf sofort den Notruf 144.' }
  ];

  var STOPP = { der: 1, die: 1, das: 1, den: 1, dem: 1, ein: 1, eine: 1, einen: 1, ich: 1, du: 1, mir: 1, mich: 1, wie: 1, was: 1, wo: 1, wann: 1, wer: 1, ist: 1, sind: 1, und: 1, oder: 1, mit: 1, bei: 1, fuer: 1, von: 1, zu: 1, im: 1, in: 1, am: 1, an: 1, auf: 1, es: 1, soll: 1, kann: 1, muss: 1, darf: 1, habe: 1, hab: 1, hat: 1, mache: 1, mach: 1, man: 1, wenn: 1, ja: 1, nein: 1, bitte: 1, gibt: 1, mein: 1, meine: 1 };
  function woerter(q) { return norm(q).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (w) { return w.length >= 2 && !STOPP[w]; }); }

  function trifft(qn, ws, stichwort) {
    var s = norm(stichwort);
    if (s.indexOf(' ') >= 0) return qn.indexOf(' ' + s) >= 0 ? 3 : 0;      // Wortgruppe
    for (var i = 0; i < ws.length; i++) {
      if (ws[i] === s) return 2;                                             // ganzes Wort, auch kurze wie „lap“
      if (ws[i].indexOf(s) === 0 || (ws[i].length >= 5 && s.length - ws[i].length <= 2 && s.indexOf(ws[i]) === 0)) return s.length >= 4 ? 2 : 1;
    }
    return 0;
  }

  // Antwort auf eine freie Frage: { art: 'not'|'antwort'|'modul'|'weissnicht', a, m: [...] }
  function antwort(frage) {
    var qn = ' ' + norm(frage).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ') + ' ', ws = woerter(frage);
    if (!ws.length) return { art: 'leer', a: 'Schreib mir einfach deine Frage, zum Beispiel „Was mache ich, wenn ich krank bin?“ oder „Wofür ist die Wissensbank?“.', m: [] };
    for (var n = 0; n < NOT.length; n++) {
      if (NOT[n].w.some(function (s) { return qn.indexOf(norm(s)) >= 0; })) return { art: 'not', a: NOT[n].a, m: [] };
    }
    // „Wofür ist …?“: Modulname direkt erkannt → Lotse
    var modulTreffer = null, modulPunkte = 0;
    Object.keys(MODULE).forEach(function (k) {
      var mo = MODULE[k], p = 0;
      if (qn.indexOf(' ' + norm(mo.n).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ') >= 0) p += 4;
      mo.k.split(' ').forEach(function (s) { p += trifft(qn, ws, s) ? 1 : 0; });
      if (p > modulPunkte) { modulPunkte = p; modulTreffer = k; }
    });
    var best = null, bestP = 0;
    ANTWORTEN.forEach(function (e) {
      var p = 0;
      e.w.forEach(function (s) { p += trifft(qn, ws, s); });
      if (p > bestP) { bestP = p; best = e; }
    });
    var lotsenFrage = /(wofuer|wozu|was ist|was bringt|was kann|wo finde|wo ist|erklaer)/.test(qn);
    if (modulTreffer && modulPunkte >= 4 && (lotsenFrage || bestP < 3)) {
      var mo = MODULE[modulTreffer];
      return { art: 'modul', a: mo.n + ': ' + mo.w + ' Wann sinnvoll: ' + mo.wann, m: [modulTreffer] };
    }
    if (best && bestP >= 2) return { art: 'antwort', a: best.a, m: best.m.slice(0, 3) };
    if (modulTreffer && modulPunkte >= 2) {
      var mo2 = MODULE[modulTreffer];
      return { art: 'modul', a: 'Das passt wohl zu ' + mo2.n + ': ' + mo2.w, m: [modulTreffer] };
    }
    return { art: 'weissnicht', a: 'Da bin ich nicht sicher, und raten will ich nicht. Schau in der Wissensbank oder bei den Fachbegriffen nach, oder frag deine Meisterin.', m: [], satz: 'Ich habe eine Frage zu: ' + String(frage).trim().slice(0, 120) + '. Kannst du mir das erklären?' };
  }

  // ── Darstellung (nur vorhandene Bausteine der Seite: nav-card, card, label, woerni-zeile) ──
  // Wörni-Zeile: dieselben Stile wie in woerni-impulse.js / woerni-sortieren.js
  // (dort nur geladen, wenn die Seite sie schon gezeigt hat).
  var CSS =
    '.woerni-zeile{display:flex;gap:10px;align-items:flex-start;margin-top:10px;padding-top:9px;border-top:1px solid rgba(0,0,0,.08);font:13px/1.5 Poppins,system-ui,sans-serif;color:#4A443A;text-align:left}' +
    '.woerni-zeile .wz-ich{flex:none;width:22px;height:22px;border-radius:50%;background:#896C32;color:#fff;display:grid;place-items:center;font:700 11px/1 Poppins,system-ui,sans-serif;margin-top:1px}' +
    '.woerni-zeile .wz-wer{font-weight:600;color:#896C32;margin-right:4px}' +
    '.woerni-zeile.frei{border-top:0;padding-top:0;margin:0 0 12px}';
  function cssEinmal() {
    if (document.getElementById('woerni-begleiter-css') || document.getElementById('woerni-v1-css') || document.getElementById('woerni-sortieren-css')) return;
    var st = document.createElement('style'); st.id = 'woerni-begleiter-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function wZeile(innen) {
    cssEinmal();
    return '<div class="woerni-zeile frei"><span class="wz-ich" aria-hidden="true">W</span><span><span class="wz-wer">Wörni:</span>' + innen + '</span></div>';
  }
  function modulKnopf(k) {
    var mo = MODULE[k]; if (!mo) return '';
    return '<button class="nav-card pm-modul" data-wb-modul="' + k + '"><div class="nav-icon" style="margin:0">' + mo.ic + '</div><div><div class="nav-title">' + esc(mo.n) + '</div><div class="nav-desc">' + esc(mo.w) + '</div></div></button>';
  }
  function oeffnen(k, ziele, q) {
    var mo = MODULE[k]; if (!mo) return;
    if (mo.url) { window.location.href = mo.url + (q && /wissensbank|fachwissen|fachbegriffe/.test(mo.url) ? '?q=' + encodeURIComponent(q) : ''); return; }
    if (ziele && typeof ziele[mo.ziel] === 'function') ziele[mo.ziel]();
  }
  function knoepfeBinden(el, ziele, q) {
    [].forEach.call(el.querySelectorAll('[data-wb-modul]'), function (b) {
      b.onclick = function () { oeffnen(b.getAttribute('data-wb-modul'), ziele, b.getAttribute('data-wb-q')); };
    });
  }

  // ── Vorstellung: Wörni stellt sich am Anfang als persönlicher Coach vor ──
  var VORSTELLUNG = {
    t: 'Hallo, ich bin Wörni, dein persönlicher Coach',
    x: [
      'Ab heute begleite ich dich durch deine ganze Lehrzeit: durch die Probezeit, alle drei Lehrjahre und bis zur Lehrabschlussprüfung.',
      'Ich melde mich regelmäßig mit kurzen Impulsen, erkläre dir unsere Verhaltensregeln und zeige dir, wofür jeder Bereich der App da ist. Du kannst mich jederzeit fragen, zu Abläufen im Salon, zum Lernen oder wenn du unsicher bist.',
      'Ich ersetze keine Meisterin, und was du mich fragst, speichere ich nicht. Am besten liest du als Erstes unsere Verhaltensregeln.'
    ]
  };
  function vorgestellt() { return !!lesen().vorgestellt; }
  function vorgestelltMerken() { var d = lesen(); d.vorgestellt = new Date().toISOString().slice(0, 10); schreiben(d); }
  // Bestätigung der Verhaltensregeln: nur auf diesem Gerät, mit Stand der Regeln
  function regelnBestaetigt() {
    var R = window.GHD_SALON_REGELN, b = lesen().regeln;
    return R && b && b.stand === R.stand ? b.am : '';
  }
  function datumDE(iso) { var t = String(iso || '').split('-'); return t.length === 3 ? +t[2] + '.' + +t[1] + '.' + t[0] : ''; }
  var LINK = 'color:#896C32;font-weight:600;text-decoration:none;margin-right:14px;white-space:nowrap';

  window.WOERNI_BEGLEITER = {
    module: MODULE, phasen: PHASEN, antworten: ANTWORTEN, probezeitKapitel: PROBEZEIT,
    phase: phase, impuls: impuls, antwort: antwort,

    vorgestellt: vorgestellt,
    regelnBestaetigt: regelnBestaetigt,

    // Vorstellung auf der Startseite, solange Wörni sich noch nicht vorgestellt hat.
    vorstellungHTML: function () {
      if (vorgestellt() || typeof window.woerniKarteHTML !== 'function') return '';
      var extra = VORSTELLUNG.x.slice(1).map(function (a) { return '<p class="woerni-text" style="margin-top:6px">' + esc(a) + '</p>'; }).join('') +
        '<p class="woerni-text" style="margin-top:8px">' +
        '<a href="#regeln" data-wb-start-modul="regeln" data-wb-kennen style="' + LINK + '">Verhaltensregeln lesen →</a> ' +
        '<a href="#woerni" data-wb-start-reden data-wb-kennen style="' + LINK + '">Wörni fragen →</a> ' +
        '<a href="#woerni" data-wb-kennen data-wb-nur-kennen style="color:#6B6455;text-decoration:none;white-space:nowrap">Los geht’s ✓</a></p>';
      return window.woerniKarteHTML({ titel: VORSTELLUNG.t, text: VORSTELLUNG.x[0] }, 'Wörni stellt sich vor', extra);
    },

    // Karte für die Startseite (im Platz von „Wörni sagt“) oder '' wenn schon gelesen.
    // Braucht woerniKarteHTML aus woernis-tipps.js (gleiches Aussehen wie „Wörni sagt“).
    startKarteHTML: function (p) {
      var i = impuls(p);
      if (!i || lesen().gelesen === i.id || typeof window.woerniKarteHTML !== 'function') return '';
      var mo = MODULE[i.m];
      var extra = '<p class="woerni-text" style="margin-top:6px"><b>Zum Nachdenken:</b> ' + esc(i.f) + '</p>' +
        '<p class="woerni-text" style="margin-top:8px">' +
        (mo ? '<a href="#woerni" data-wb-start-modul="' + i.m + '" style="color:#896C32;font-weight:600;text-decoration:none;margin-right:14px;white-space:nowrap">' + esc(mo.n) + ' →</a> ' : '') +
        '<a href="#woerni" data-wb-start-reden style="color:#896C32;font-weight:600;text-decoration:none;margin-right:14px;white-space:nowrap">Wörni fragen →</a> ' +
        '<a href="#woerni" data-wb-gelesen="' + esc(i.id) + '" style="color:#6B6455;text-decoration:none;white-space:nowrap">Gelesen ✓</a></p>';
      return window.woerniKarteHTML({ titel: i.t, text: i.x }, 'Wörni · ' + p.n + (p.tag && p.tag <= PROBEZEIT_TAGE ? ' · Tag ' + p.tag : ''), extra);
    },
    startKarteBinden: function (el, ziele, neuZeichnen) {
      if (!el) return;
      // Vorstellung: jeder Link zählt als „kennengelernt“
      [].forEach.call(el.querySelectorAll('[data-wb-kennen]'), function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); vorgestelltMerken(); if (a.hasAttribute('data-wb-nur-kennen') && neuZeichnen) neuZeichnen(); });
      });
      [].forEach.call(el.querySelectorAll('[data-wb-start-modul]'), function (a) { a.onclick = function (e) { e.preventDefault(); oeffnen(a.getAttribute('data-wb-start-modul'), ziele); }; });
      [].forEach.call(el.querySelectorAll('[data-wb-start-reden]'), function (a) { a.onclick = function (e) { e.preventDefault(); if (ziele && ziele.woerni) ziele.woerni(); }; });
      [].forEach.call(el.querySelectorAll('[data-wb-gelesen]'), function (a) {
        a.onclick = function (e) { e.preventDefault(); var d = lesen(); d.gelesen = a.getAttribute('data-wb-gelesen'); schreiben(d); if (neuZeichnen) neuZeichnen(); };
      });
    },

    // Seite „Wörni – dein Begleiter“: Impuls der Phase, Frag Wörni, App-Lotse.
    seiteZeichnen: function (el, p, ziele) {
      if (!el) return;
      var i = impuls(p), self = this;
      var html = '';
      if (!vorgestellt()) {
        html += '<div class="card" style="padding:14px"><div class="nav-title" style="margin-bottom:6px">' + esc(VORSTELLUNG.t) + '</div>' +
          VORSTELLUNG.x.map(function (a) { return wZeile(esc(a)); }).join('') + modulKnopf('regeln') + '</div>';
        vorgestelltMerken();
      } else {
        html += wZeile('Ich bin dein persönlicher Coach für die ganze Lehrzeit. Frag mich, was du wissen willst.');
      }
      html += '<div class="label">' + esc(p.n) + (p.tag && p.tag <= PROBEZEIT_TAGE ? ' · Tag ' + p.tag : '') + '</div>';
      if (i) html += '<div class="card" style="padding:14px"><div class="nav-title" style="margin-bottom:4px">' + esc(i.t) + '</div>' + wZeile(esc(i.x)) +
        '<div class="nav-desc" style="font-size:13px"><b>Zum Nachdenken:</b> ' + esc(i.f) + '</div></div>';
      html += '<div class="label" style="margin-top:18px">Frag Wörni</div>' +
        '<form id="wb-form" style="display:flex;gap:8px;margin-bottom:8px" autocomplete="off"><input id="wb-frage" type="text" maxlength="200" placeholder="z. B. Was mache ich, wenn ich krank bin?" aria-label="Deine Frage an Wörni" style="flex:1;background:#fff"><button class="btn-primary" type="submit" style="width:auto;padding:10px 16px">Fragen</button></form>' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">' +
        ['Wie melde ich mich krank?', 'Wie beantrage ich Urlaub?', 'Was ziehe ich an?', 'Wozu ist die Probezeit?', 'Wofür ist die Wissensbank?', 'Ich habe einen Fehler gemacht'].map(function (v) {
          return '<button type="button" class="btn-toggle" data-wb-vorschlag="' + esc(v) + '">' + esc(v) + '</button>';
        }).join('') + '</div>' +
        '<div id="wb-antworten" aria-live="polite"></div>' +
        '<p class="pt-info">Wörni antwortet aus festen, im Salon abgestimmten Antworten und speichert deine Fragen nicht. Er ersetzt keine Meisterin. Bei Verletzung, Hautreaktion oder wenn es dir nicht gut geht: sag es sofort jemandem im Salon.</p>';
      // Seit 2026-11-21 ohne eigene Kacheln auf der Startseite: hier gesammelt unter „Wörni fragen“
      html += '<div class="label" style="margin-top:18px">Wenn’s gerade hakt</div>' + modulKnopf('sortieren') + modulKnopf('diagnose');
      if (p.id === 'ankommen' || p.id === 'probezeit') html += '<div class="label" style="margin-top:18px">Für deine Probezeit</div>' + modulKnopf('probezeit');
      html += '<div class="label" style="margin-top:18px">Jetzt besonders sinnvoll</div>' + PHASEN[p.id].module.filter(function (k) { return !(k === 'probezeit' && (p.id === 'ankommen' || p.id === 'probezeit')); }).map(modulKnopf).join('') +
        '<details style="margin-top:12px"><summary class="label" style="cursor:pointer;margin:0">Alle Bereiche der App erklärt</summary><div style="margin-top:10px">' +
        Object.keys(MODULE).map(function (k) {
          var mo = MODULE[k];
          return '<button class="nav-card pm-modul" data-wb-modul="' + k + '"><div class="nav-icon" style="margin:0">' + mo.ic + '</div><div><div class="nav-title">' + esc(mo.n) + '</div><div class="nav-desc">' + esc(mo.w) + '</div><div class="nav-desc" style="margin-top:4px"><b>Wann:</b> ' + esc(mo.wann) + '</div></div></button>';
        }).join('') + '</div></details>';
      el.innerHTML = html;
      knoepfeBinden(el, ziele);
      var form = el.querySelector('#wb-form'), feld = el.querySelector('#wb-frage');
      form.onsubmit = function (e) { e.preventDefault(); self.fragen(el, feld.value, ziele); feld.value = ''; };
      [].forEach.call(el.querySelectorAll('[data-wb-vorschlag]'), function (b) { b.onclick = function () { self.fragen(el, b.getAttribute('data-wb-vorschlag'), ziele); }; });
    },

    // Eine Frage beantworten. Verlauf nur im Speicher dieser Seite, wird nicht gespeichert.
    fragen: function (el, frage, ziele) {
      var box = el.querySelector('#wb-antworten'); if (!box || !String(frage).trim()) return;
      var r = antwort(frage), q = String(frage).trim();
      var html = '<div class="card" style="padding:14px"><div class="label" style="margin-bottom:4px">Deine Frage</div><div style="font-size:14px;color:#211D17;margin-bottom:10px">' + esc(q) + '</div>' +
        (r.art === 'not' ? '<div class="fb-r" style="margin:0 0 4px;font-size:14px;color:#211D17;line-height:1.5"><b>Wörni:</b> ' + esc(r.a) + '</div>' : wZeile(esc(r.a))) +
        r.m.map(modulKnopf).join('');
      if (r.art === 'weissnicht') {
        // Suchwort: das längste Wort der Frage, im Original geschrieben (Wissensbank sucht nach allen Wörtern)
        var sw = String(q).split(/[^A-Za-zÄÖÜäöüß0-9-]+/).filter(function (w) { return w.length >= 3 && !STOPP[norm(w)]; })
          .sort(function (a, b) { return b.length - a.length; })[0] || '';
        html += '<button class="nav-card pm-modul" data-wb-modul="wissensbank" data-wb-q="' + esc(sw) + '"><div class="nav-icon" style="margin:0">🗂</div><div><div class="nav-title">In der Wissensbank suchen</div><div class="nav-desc">' + (sw ? '„' + esc(sw) + '“' : 'Alle Artikel') + '</div></div></button>' +
          '<button class="nav-card pm-modul" data-wb-modul="fachbegriffe" data-wb-q="' + esc(sw) + '"><div class="nav-icon" style="margin:0">📖</div><div><div class="nav-title">Bei den Fachbegriffen suchen</div></div></button>' +
          '<div class="fb-o" style="margin:2px 0 0"><div class="label" style="margin-bottom:4px">So kannst du deine Meisterin fragen</div><div style="font-size:14px;color:#211D17;line-height:1.5">„' + esc(r.satz) + '“</div></div>';
      }
      html += '</div>';
      box.insertAdjacentHTML('afterbegin', html);
      knoepfeBinden(box.firstElementChild, ziele, q);
    },

    // Seite „Unsere Verhaltensregeln“ (Inhalt aus salon-regeln.js) mit Bestätigung.
    // server (optional, nur für eingeloggte Lehrlinge; Tabelle regeln_bestaetigung,
    // supabase/20261120_regeln_bestaetigung.sql):
    //   laden(stand)     → Promise<'JJJJ-MM-TT' | '' | null>  ('' = noch nicht, null = nicht erreichbar)
    //   speichern(stand) → Promise<true | false>
    // Die Meisterin sieht die Bestätigung im Meisterin-Bereich. Ohne server: nur auf dem Gerät.
    regelnZeichnen: function (el, ziele, server, _status) {
      if (!el) return;
      var R = window.GHD_SALON_REGELN, self = this;
      if (!R) { el.innerHTML = '<p class="pt-info">Die Verhaltensregeln konnten nicht geladen werden.</p>'; return; }
      if (server && _status === undefined) {
        // erst zeichnen, dann den Stand vom Server holen und neu zeichnen
        self.regelnZeichnen(el, ziele, server, 'laden');
        Promise.resolve().then(function () { return server.laden(R.stand); }).catch(function () { return null; }).then(function (amServer) {
          if (amServer) { var d = lesen(); d.regeln = { stand: R.stand, am: amServer, server: true }; schreiben(d); }
          else if (amServer === '') { var d2 = lesen(); if (d2.regeln && d2.regeln.server) { delete d2.regeln; schreiben(d2); } }
          // Auf dem Gerät bestätigt, aber noch nicht am Server (z. B. vor dieser Änderung): nachschicken
          var b = lesen().regeln;
          if (amServer === '' && b && b.stand === R.stand && !b.server) {
            Promise.resolve(server.speichern(R.stand)).then(function (ok) { if (ok) { var d3 = lesen(); d3.regeln.server = true; schreiben(d3); } self.regelnZeichnen(el, ziele, server, ok ? 'ok' : 'fehler'); });
            return;
          }
          self.regelnZeichnen(el, ziele, server, amServer === null ? 'offline' : 'ok');
        });
        return;
      }
      var am = regelnBestaetigt(), anServer = !!(lesen().regeln && lesen().regeln.server);
      var hinweis = !server ? 'Die Bestätigung wird nur auf diesem Gerät gemerkt. Melde dich als Lehrling an, damit deine Chefin sie sieht.'
        : _status === 'fehler' || _status === 'offline' ? 'Gerade keine Verbindung zum Server. Deine Chefin sieht die Bestätigung, sobald sie gesendet ist, versuch es später noch einmal.'
        : 'Deine Chefin sieht, dass und wann du die Regeln bestätigt hast. Sonst wird dazu nichts gespeichert.';
      el.innerHTML = wZeile('Das sind die Regeln in unserem Team. Ich erkläre dir zu jedem Punkt kurz, warum er wichtig ist.') +
        R.abschnitte.map(function (a) {
          return '<div class="card"><div class="label">' + a.ic + ' ' + esc(a.nr + '. ' + a.t) + '</div>' +
            a.teile.map(function (t, j) {
              return '<div class="nav-title" style="margin:' + (j ? '10px' : '0') + ' 0 4px">' + esc(a.nr + '.' + (j + 1) + ' ' + t.t) + '</div>' +
                '<ul style="margin:0 0 6px 18px;font-size:14px;color:#211D17;line-height:1.6">' + t.r.map(function (x) { return '<li style="margin-bottom:4px">' + esc(x) + '</li>'; }).join('') + '</ul>';
            }).join('') +
            (a.w ? '<div style="margin-top:10px">' + wZeile(esc(a.w)) + '</div>' : '') + '</div>';
        }).join('') +
        '<div class="card" id="wb-regeln-ok">' + (am
          ? '<div class="fb-g" style="margin:0;font-size:14px;color:#211D17"><b>✓ ' + esc(R.bestaetigung) + '</b><div class="nav-desc" style="margin-top:4px">Bestätigt am ' + esc(datumDE(am)) + (server && !anServer ? ' (noch nicht an die Chefin gesendet)' : '') + '.</div></div>' +
            (server && !anServer && _status !== 'laden' ? '<button class="btn-ghost" id="wb-regeln-senden" style="width:100%;margin-top:10px">Nochmal senden</button>' : '')
          : _status === 'laden' ? '<div class="nav-desc">Einen Moment …</div>'
          : '<label style="display:flex;gap:10px;align-items:flex-start;font-size:14px;color:#211D17;line-height:1.5;cursor:pointer"><input type="checkbox" id="wb-regeln-cb" style="width:auto;margin-top:3px"> <span>' + esc(R.bestaetigung) + '</span></label>' +
            '<button class="btn-primary" id="wb-regeln-btn" style="margin-top:12px" disabled>Bestätigen</button>') +
        '<p class="pt-info">' + esc(hinweis) + ' Fragen zu den Regeln? Sprich mit der Chefin.</p></div>' +
        '<button class="nav-card pm-modul" data-wb-reden><div class="nav-icon" style="margin:0">💬</div><div><div class="nav-title">Wörni etwas zu den Regeln fragen</div><div class="nav-desc">z. B. „Wie melde ich mich krank?“</div></div></button>';
      var cb = el.querySelector('#wb-regeln-cb'), btn = el.querySelector('#wb-regeln-btn');
      if (cb && btn) {
        cb.onchange = function () { btn.disabled = !cb.checked; };
        btn.onclick = function () {
          var d = lesen(); d.regeln = { stand: R.stand, am: new Date().toISOString().slice(0, 10) }; schreiben(d);
          if (!server) { self.regelnZeichnen(el, ziele); return; }
          btn.disabled = true; btn.textContent = 'Wird gesendet …';
          senden();
        };
      }
      function senden() {
        Promise.resolve().then(function () { return server.speichern(R.stand); }).catch(function () { return false; }).then(function (ok) {
          if (ok) { var d = lesen(); if (d.regeln) { d.regeln.server = true; schreiben(d); } }
          self.regelnZeichnen(el, ziele, server, ok ? 'ok' : 'fehler');
        });
      }
      var nochmal = el.querySelector('#wb-regeln-senden');
      if (nochmal) nochmal.onclick = function () { nochmal.disabled = true; nochmal.textContent = 'Wird gesendet …'; senden(); };
      var r = el.querySelector('[data-wb-reden]'); if (r) r.onclick = function () { if (ziele && ziele.woerni) ziele.woerni(); };
    },

    // Modul „Probezeit“
    probezeitZeichnen: function (el, ziele) {
      if (!el) return;
      el.innerHTML = PROBEZEIT.map(function (k) {
        return '<div class="card"><div class="label">' + k.ic + ' ' + esc(k.t) + '</div>' +
          k.absaetze.map(function (a) { return '<p style="font-size:14px;color:#211D17;line-height:1.6;margin-bottom:10px">' + esc(a) + '</p>'; }).join('') +
          (k.punkte ? '<ul style="margin:0 0 10px 18px;font-size:14px;color:#211D17;line-height:1.6">' + k.punkte.map(function (x) { return '<li style="margin-bottom:6px">' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
          (k.fragen ? '<div class="fb-o" style="margin-top:6px"><div class="label" style="margin-bottom:4px">Zum Nachdenken</div>' + k.fragen.map(function (f) { return '<div style="font-size:14px;color:#211D17;line-height:1.5;margin-bottom:4px">' + esc(f) + '</div>'; }).join('') + '</div>' : '') +
          (k.module ? k.module.map(modulKnopf).join('') : '') +
          '</div>';
      }).join('') +
        '<button class="nav-card pm-modul" data-wb-reden><div class="nav-icon" style="margin:0">💬</div><div><div class="nav-title">Wörni etwas fragen</div><div class="nav-desc">Zu Abläufen, zur Probezeit oder zur App</div></div></button>' +
        '<p class="pt-info">Dieser Bereich zeigt nur Inhalte. Es werden keine Daten über dich gespeichert. Wie deine Probezeit läuft, besprichst du direkt mit deiner Meisterin.</p>';
      knoepfeBinden(el, ziele);
      var r = el.querySelector('[data-wb-reden]'); if (r) r.onclick = function () { if (ziele && ziele.woerni) ziele.woerni(); };
    }
  };
})();
