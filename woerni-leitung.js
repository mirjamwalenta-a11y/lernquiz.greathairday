// Wörni · „Ich steh auf der Leitung“ (Lernquiz, Multiple Choice)
//
// Idee: Wer bei einer Frage hängt, bekommt nicht gleich die Lösung, sondern
//   1. ein Bild aus dem Salonalltag oder eine Eselsbrücke,
//   2. eine leichte Gegenfrage zum Antippen,
// und beantwortet danach die eigentliche Frage selbst.
//
// Regeln (Wörni-Grundsatz, docs/woerni-v1.md):
//  - Regelbasiert, keine KI zur Laufzeit. Alle Texte stehen hier fest und
//    werden von der Meisterin geprüft (wie leichte-sprache.js).
//  - Den Knopf gibt es nur für Fragen mit Eintrag hier, nie im LAP-Modus und
//    nicht bei Zusatzfragen.
//  - Wer die Hilfe öffnet, bekommt die Frage wie „geraten“ gewertet: halbe
//    Punkte, und sie kommt in die Wiederholung (lernquiz.html, pruefeMC).
//  - Nichts wird gespeichert, nichts geht an den Server, keine Namen
//    (CLAUDE.md, Regel 2).
//
// Schreibstandard (seit 2026-11-26, Vorgabe der Inhaberin):
//  - Erst die Fachlogik, kurz und korrekt, in der Sprache des Berufs.
//  - Beispiele kommen aus dem Salon (Behandlung, Befund, typischer Fehler),
//    keine Vergleiche mit Tieren, Spielzeug, Sport oder Küche.
//  - Wo nötig ein Praxis-Hinweis, der falsche Behandlungslogik verhindert
//    (z. B. Gelbstich = Farbproblem, strohiges Haar = Strukturproblem).
//  - Gegenfrage = Prüffrage aus dem Arbeitsablauf, kein Rätsel.
//  - Sachlicher Ton wie eine erfahrene Kollegin, ohne Witz.
//  Alle Texte sind nach diesem Standard überarbeitet (2026-11-26).
// Schlüssel = id der Frage in lernquiz.html (FB); Schnittwerkstatt: sw1–sw15.
// Felder: bild (Bild/Eselsbrücke), frage (Gegenfrage), o (2–3 Antworten),
//         r (Index der richtigen), ja (nach richtig), nein (nach falsch).
// Stand 2026-11-25: Lernquiz: Farbe & Blondierung (15), Haarkunde (9),
// Dauerwelle (5), Hygiene (9), Werkzeug/Schere (2), Hautkunde (11),
// Haarwäsche (9); Schnittwerkstatt (15).
// Fachlich durch die Meisterin prüfen.
(function () {
  var T = {
    // ── Farbkreis & Gegenfarben ──────────────────────────────────────────
    '1-mc14': {
      bild: 'Ein Farbstich wird mit seiner Komplementärfarbe neutralisiert, also mit der Farbe, die im Farbkreis gegenüberliegt. Typisch im Salon: Wird dunkles Haar aufgehellt, zeigt sich ab etwa Tonhöhe 6 ein oranger Untergrund. Den gleichst du in der Folgebehandlung mit dem passenden Reflex aus. Achtung: Zu viel Gegenfarbe macht das Ergebnis stumpf und gräulich, darum sparsam dosieren.',
      frage: 'Mit welchem Reflex arbeitest du gegen einen Orangestich?',
      o: ['Asch', 'Gold', 'Kupfer'], r: 0,
      ja: 'Richtig. Asch steht für Blau, die Komplementärfarbe zu Orange.',
      nein: 'Nicht ganz. Gold und Kupfer sind warme Reflexe und verstärken den Orangestich. Gegen Orange arbeitet Asch, also Blau.'
    },
    '1-mc15': {
      bild: 'Ein Farbstich wird mit seiner Komplementärfarbe neutralisiert, also mit der Farbe, die im Farbkreis gegenüberliegt. Sie ist immer die Mischung der beiden anderen Grundfarben. Achtung in der Praxis: Ein Gelbstich ist ein Farbproblem, strohiges Haar ein Strukturproblem. Wirkt blondiertes Haar strohig, ist es porös. Dort nimmt die Gegenfarbe ungleichmäßig auf und kann fleckig wirken. Darum zuerst den Haarzustand beurteilen und pflegen, dann gezielt neutralisieren.',
      frage: 'Gelb ist eine Grundfarbe. Welche zwei Grundfarben bleiben übrig?',
      o: ['Rot und Blau', 'Gelb und Blau', 'Rot und Gelb'], r: 0,
      ja: 'Richtig. Ihre Mischung ist die Gegenfarbe zu Gelb. Welche Farbe entsteht aus Rot und Blau?',
      nein: 'Nicht ganz. Die drei Grundfarben sind Rot, Gelb und Blau. Ohne Gelb bleiben Rot und Blau. Ihre Mischung ist die Gegenfarbe zu Gelb.'
    },
    '1-mc16': {
      bild: 'Auch ein Rotstich wird mit der Komplementärfarbe neutralisiert, also mit der Mischung der beiden anderen Grundfarben. Typisch im Salon: Ein Braun fällt nach dem Färben zu rot aus. Am Haar heißt dieser ausgleichende Reflex Matt. Achtung: Matt-Reflexe sparsam einsetzen, zu viel wirkt schnell grünstichig.',
      frage: 'Rot ist eine Grundfarbe. Welche zwei Grundfarben bleiben übrig?',
      o: ['Gelb und Blau', 'Orange und Violett', 'Rot und Gelb'], r: 0,
      ja: 'Richtig. Ihre Mischung neutralisiert Rot. Welche Farbe entsteht aus Gelb und Blau?',
      nein: 'Nicht ganz. Grundfarben sind nur Rot, Gelb und Blau. Ohne Rot bleiben Gelb und Blau, ihre Mischung neutralisiert Rot.'
    },

    // ── Oxidant / Wasserstoffperoxid ─────────────────────────────────────
    '1-mc19': {
      bild: 'Oxidationsfarbe wirkt erst, wenn du sie mit Oxidant (Wasserstoffperoxid) mischst. Er erfüllt zwei Aufgaben gleichzeitig: Er hellt das natürliche Pigment im Haar auf, und er entwickelt die zunächst farblosen Farbvorstufen im Cortex zur fertigen Farbe. Darum bestimmt die Oxidant-Stärke, wie stark aufgehellt wird.',
      frage: 'Du trägst Oxidationsfarbe ohne Oxidant auf. Was passiert?',
      o: ['Die Farbe entwickelt sich nicht', 'Das Haar wird stärker aufgehellt', 'Die Farbe hält länger'], r: 0,
      ja: 'Richtig. Ohne Oxidant gibt es weder Farbentwicklung noch Aufhellung.',
      nein: 'Nicht ganz. Ohne Oxidant entwickeln sich die Farbvorstufen nicht, und es wird nichts aufgehellt.'
    },
    '1-ft2': {
      bild: 'Die Prozentzahl gibt die Konzentration des Wasserstoffperoxids an. Je höher sie ist, desto stärker wird aufgehellt und desto mehr wird das Haar belastet. In der Praxis wählst du immer die niedrigste Stärke, die für das Ziel reicht.',
      frage: 'Eine Kundin möchte eine Tonhöhe dunkler werden. Wie viel Aufhellkraft braucht die Farbe?',
      o: ['Keine oder kaum welche', 'Möglichst viel', 'So viel wie bei einer Blondierung'], r: 0,
      ja: 'Richtig. Dafür reicht die niedrigste Oxidant-Stärke.',
      nein: 'Nicht ganz. Wer dunkler werden will, braucht keine Aufhellung. Dafür reicht die niedrigste Oxidant-Stärke.'
    },
    '1-ft3': {
      bild: 'Oxidant wird je nach Hersteller in Prozent oder in Volumen (Vol) angegeben. Das Verhältnis ist fest: 3 % entsprechen 10 Vol, jede höhere Stufe ist ein Vielfaches davon. Wichtig beim Mischen, wenn Rezeptur und Flasche unterschiedlich beschriftet sind.',
      frage: 'Wie oft passt 3 % in 6 %?',
      o: ['2-mal', '3-mal', '6-mal'], r: 0,
      ja: 'Richtig. Dann ist auch die Vol-Zahl doppelt so hoch wie bei 3 %.',
      nein: 'Nicht ganz: 6 % sind 2-mal 3 %. Die Vol-Zahl verdoppelt sich genauso.'
    },

    // ── Was Farbe kann und was nicht ─────────────────────────────────────
    '1-ft6': {
      bild: 'Oxidationsfarbe kann nur natürliches Pigment aufhellen. Künstliche Farbpigmente aus einer früheren Coloration bleiben im Haar und werden von einer neuen Farbe nur überlagert. Typisch im Salon: Eine Kundin mit dunkel gefärbten Längen möchte heller werden. Eine hellere Farbe allein ergibt dann nur einen hellen Ansatz und unveränderte Längen.',
      frage: 'Womit entfernst du künstliche Farbpigmente aus dem Haar?',
      o: ['Mit Farbabzug oder Blondierung', 'Mit einer helleren Haarfarbe', 'Mit einer längeren Einwirkzeit'], r: 0,
      ja: 'Richtig. Erst danach kann eine neue, hellere Farbe gleichmäßig wirken.',
      nein: 'Nicht ganz. Eine hellere Farbe oder mehr Zeit ändert an künstlichen Pigmenten nichts. Dafür braucht es Farbabzug oder Blondierung.'
    },
    '1-ft7': {
      bild: 'Alkalisierungsmittel heben den pH-Wert an. Das Haar quillt, die Cuticula öffnet sich, und die Farbvorstufen gelangen in den Cortex. Darum behandelst du nach der Coloration mit einem sauren Produkt nach.',
      frage: 'Warum folgt nach der Coloration ein saures Pflegeprodukt?',
      o: ['Weil es die geöffnete Cuticula wieder schließt', 'Weil es die Farbe dunkler macht', 'Weil es die Einwirkzeit verlängert'], r: 0,
      ja: 'Richtig. Vorher hat das Alkalisierungsmittel die Cuticula geöffnet, damit die Farbe eindringen kann.',
      nein: 'Nicht ganz. Das Alkalisierungsmittel öffnet die Cuticula, damit die Farbe eindringt. Das saure Produkt schließt sie danach wieder.'
    },

    // ── Auftragen ────────────────────────────────────────────────────────
    '1-ft4': {
      bild: 'Am Ansatz wirkt die Körperwärme der Kopfhaut. Wärme beschleunigt die Reaktion, dort hellt die Farbe schneller und stärker auf. Bei einer Erstfärbung, die heller werden soll, entsteht sonst ein „heißer Ansatz“: Der Ansatz wird heller und wärmer als Längen und Spitzen.',
      frage: 'Was passiert, wenn du bei einer aufhellenden Erstfärbung am Ansatz beginnst?',
      o: ['Der Ansatz wird heller als die Längen', 'Die Längen werden heller als der Ansatz', 'Das Ergebnis wird gleichmäßiger'], r: 0,
      ja: 'Richtig. Überleg jetzt, in welcher Reihenfolge du auftragen musst, damit alles gleich hell wird.',
      nein: 'Nicht ganz. Am Ansatz reagiert die Farbe wegen der Körperwärme schneller. Er würde heller als der Rest.'
    },
    '1-ft8': {
      bild: 'Bei der Ansatzblondierung wird nur das nachgewachsene Haar behandelt. Die Längen sind bereits blondiert und dadurch vorgeschädigt. Überlappt die Blondierung auf diese Bereiche, entsteht dort eine Bruchstelle. Zusätzlich gilt: Direkt auf der Kopfhaut nur niedrige Oxidant-Stärken verwenden.',
      frage: 'Was passiert, wenn die Blondierung auf bereits blondierte Längen überlappt?',
      o: ['Dort kann das Haar abbrechen', 'Das Ergebnis wird gleichmäßiger', 'Nichts, das Haar ist ja schon hell'], r: 0,
      ja: 'Richtig. Darum arbeitest du exakt am Übergang und nur am Nachwuchs.',
      nein: 'Nicht ganz. Blondiertes Haar ist vorgeschädigt. Eine zweite Blondierung darauf kann es abbrechen lassen.'
    },

    // ── Untergrund & Aufhellen ───────────────────────────────────────────
    '2-mc1': {
      bild: 'Beim Aufhellen wird das natürliche Pigment schrittweise abgebaut. Dunkles Haar enthält viel Pigment mit rotem Anteil. Darum durchläuft es Untergrundtöne von Rot über Orange bis Gelb: je heller, desto gelber. Der Untergrund bestimmt, mit welchem Reflex du danach ausgleichst.',
      frage: 'Welcher Untergrund zeigt sich erst ganz am Ende einer starken Aufhellung?',
      o: ['Gelb', 'Rot', 'Rot-Orange'], r: 0,
      ja: 'Richtig. Gelb kommt zuletzt. Dunkles Haar steht nach der ersten Aufhellung noch im roten Bereich.',
      nein: 'Nicht ganz. Gelb ist der letzte Untergrund. Dunkles Haar zeigt zuerst rote Töne.'
    },
    '2-wk2': {
      bild: 'Jedes Naturhaar hat einen warmen Untergrund. Warme Zieltöne vertragen ihn, weil er im Ergebnis mitarbeitet. Kühle Zieltöne wie Asch oder Beige werden von ihm überdeckt. Darum muss für kühle Töne weiter vorgehellt werden als für warme (Warm-Kalt-Gesetz).',
      frage: 'Was passiert, wenn du für einen Aschton nur so weit aufhellst wie für einen warmen Ton?',
      o: ['Der warme Untergrund scheint durch, das Asch wirkt nicht', 'Das Ergebnis wird besonders kühl', 'Das Haar wird dunkler als geplant'], r: 0,
      ja: 'Richtig. Für kühle Töne musst du also weiter aufhellen als für warme.',
      nein: 'Nicht ganz. Der warme Untergrund überdeckt kühle Töne. Darum braucht ein kühler Ton mehr Vorhellung.'
    },
    '3-vp1': {
      bild: 'Beim Aufhellen gehen die warmen Pigmente verloren. Soll stark aufgehelltes Haar wieder deutlich dunkler werden, fehlen sie. Eine dunkle Farbe allein wirkt dann fahl, gräulich oder grünstichig und hält schlecht. Deshalb ersetzt du zuerst die fehlenden warmen Pigmente.',
      frage: 'Was passiert, wenn du sehr helles Haar ohne Vorbereitung mehrere Tonhöhen dunkler färbst?',
      o: ['Das Ergebnis wirkt fahl oder grünstichig', 'Die Farbe wird besonders warm', 'Nichts, die Farbe deckt normal'], r: 0,
      ja: 'Richtig. Je größer der Sprung nach dunkel, desto eher brauchst du die Vorpigmentierung.',
      nein: 'Nicht ganz. Ohne die fehlenden warmen Pigmente wirkt eine dunkle Farbe auf hellem Haar fahl oder grünstichig.'
    },

    // ── Farbnummern ──────────────────────────────────────────────────────
    '2-mc2': {
      bild: 'Die Skala der Tonhöhen reicht von 1 (Schwarz) bis 10 (hellstes Blond). Eine Farbnummer beschreibt zwei Dinge: wie hell die Farbe ist und in welche Farbrichtung sie geht. In der Beratung bestimmst du zuerst die Helligkeit, dann die Farbrichtung.',
      frage: 'Welche Farbe ist heller: 5.0 oder 8.0?',
      o: ['8.0', '5.0', 'Beide gleich hell'], r: 0,
      ja: 'Richtig. Die erste Zahl zeigt also, wie hell die Farbe ist.',
      nein: 'Nicht ganz. Auf der Skala ist 8 heller als 5. Die erste Zahl zeigt also die Helligkeit.'
    },
    '2-mc3': {
      bild: 'Nach dem Punkt steht der Reflex, also die Farbrichtung. Bei unserer Farbkarte beginnen die Reflexe mit .1 Asch und .2 Irisé (Violett), danach folgen die warmen Reflexe. Steht eine zweite Ziffer dahinter, ist sie der schwächere Nebenreflex.',
      frage: 'Was beschreibt die Zahl nach dem Punkt?',
      o: ['Den Reflex, also die Farbrichtung', 'Die Einwirkzeit', 'Die Oxidant-Stärke'], r: 0,
      ja: 'Richtig. Zähl jetzt weiter: Nach .1 Asch und .2 Irisé kommt der erste warme Reflex.',
      nein: 'Nicht ganz. Einwirkzeit und Oxidant stehen nicht in der Farbnummer. Nach dem Punkt steht der Reflex.'
    },

    // ── Haarkunde: Aufbau ────────────────────────────────────────────────
    '1-7': {
      bild: 'Ein Haar ist von außen nach innen in drei Schichten aufgebaut: außen die Schuppenschicht als Schutz, darunter die Faserschicht, die dem Haar Festigkeit, Elastizität und Farbe gibt, innen das Mark, das bei feinem Haar oft fehlt. Für die Praxis wichtig: Chemische Behandlungen wirken in der mittleren Schicht, die äußere muss dafür geöffnet werden.',
      frage: 'Wie heißt die äußere Schutzschicht des Haares als Fachbegriff?',
      o: ['Cuticula', 'Cortex', 'Keratin'], r: 0,
      ja: 'Richtig. Kennst du auch die Fachbegriffe für die Faserschicht und das Mark?',
      nein: 'Nicht ganz. Außen liegt die Cuticula (Schuppenschicht). Cortex ist die Faserschicht darunter, Keratin ist der Baustoff des Haares und keine Schicht.'
    },
    '1-mc2': {
      bild: 'Die natürlichen Farbpigmente (Melanin) liegen in der Faserschicht unter der Schuppenschicht. Dort arbeiten auch Oxidationsfarbe und Blondierung: Sie müssen durch die geöffnete Schuppenschicht hindurch. Tönungen lagern sich dagegen vor allem außen an und waschen sich deshalb wieder aus.',
      frage: 'Warum wäscht sich eine Tönung aus, eine Oxidationsfarbe aber nicht?',
      o: ['Die Tönung bleibt außen, die Oxidationsfarbe wirkt in der Faserschicht', 'Die Tönung enthält mehr Pigment', 'Die Oxidationsfarbe wird kälter ausgespült'], r: 0,
      ja: 'Richtig. Dauerhafte Farbe und Naturpigment sitzen in derselben Schicht. Wie heißt sie?',
      nein: 'Nicht ganz. Die Tönung lagert sich außen an. Dauerhafte Farbe und Naturpigment sitzen in der Faserschicht darunter.'
    },
    '1-mc5': {
      bild: 'Nasses Haar nimmt Wasser in die Faserschicht auf und quillt. Dabei lösen sich die Wasserstoffbrücken im Haar, und die Schuppenschicht steht leicht ab. Nasses Haar ist dadurch dehnbarer und empfindlicher gegen Zug und Reibung.',
      frage: 'Wie entwirrst du nasses, langes Haar nach der Wäsche?',
      o: ['Mit grobem Kamm, von den Spitzen zum Ansatz', 'Mit feinem Kamm, vom Ansatz zu den Spitzen', 'Kräftig mit der Bürste, solange es nass ist'], r: 0,
      ja: 'Richtig. So schonst du das gequollene, dehnbare Haar.',
      nein: 'Nicht ganz. Nasses Haar ist gequollen und dehnbar. Grob und von den Spitzen aus vermeidet Zug und Bruch.'
    },
    '1-n12': {
      bild: 'Porosität beschreibt, wie gut Haar Feuchtigkeit und Wirkstoffe aufnimmt. Sie hängt vom Zustand der Schuppenschicht ab: Bei gesundem Haar liegt sie geschlossen an, nach Blondierung, Hitze oder UV-Strahlung ist sie aufgeraut. Praxis: Poröses Haar nimmt Farbe schneller und oft dunkler oder ungleichmäßig an und verliert sie schneller wieder.',
      frage: 'Blondierte Längen nehmen eine Tönung deutlich stärker an als der Ansatz. Woran liegt das?',
      o: ['Die Längen sind poröser', 'Der Ansatz ist wärmer', 'Die Tönung hat zu kurz eingewirkt'], r: 0,
      ja: 'Richtig. Die Porosität bestimmt, wie viel das Haar aufnimmt.',
      nein: 'Nicht ganz. Blondierte Längen haben eine aufgeraute Schuppenschicht und nehmen mehr auf als der gesunde Ansatz.'
    },

    // ── Haarkunde: Wachstum ──────────────────────────────────────────────
    '1-hk2': {
      bild: 'Jedes Haar durchläuft drei Phasen: Wachstumsphase (Anagen), Übergangsphase (Katagen) und Ruhephase (Telogen). In der Übergangsphase löst sich das Haar von der Papille und wird nicht mehr versorgt. Danach sitzt es nur noch locker im Follikel, bis es ausfällt. Bis zu etwa 100 Haare am Tag gelten als normal.',
      frage: 'Ein Haar fällt beim Kämmen ohne Kraftaufwand aus. Wurde es zuletzt noch versorgt?',
      o: ['Nein, es war schon von der Versorgung gelöst', 'Ja, es war mitten im Wachstum', 'Es war gerade neu entstanden'], r: 0,
      ja: 'Richtig. Es stand in der letzten der drei Phasen.',
      nein: 'Nicht ganz. Ein Haar, das ohne Kraft ausfällt, wird nicht mehr versorgt. Es stand in der letzten Phase.'
    },
    '1-mc7': {
      bild: 'Wie lang ein Haar werden kann, hängt davon ab, wie lange seine Wachstumsphase dauert. Haar wächst etwa 1 bis 1,5 cm im Monat. Praxis: Wünscht sich eine Kundin sehr langes Haar, entscheidet ihre Wachstumsphase, ob diese Länge erreichbar ist.',
      frage: 'Haar wächst etwa 12 cm im Jahr. Wie lange braucht es für 60 cm?',
      o: ['Etwa 5 Jahre', 'Etwa 6 Monate', 'Etwa 15 Jahre'], r: 0,
      ja: 'Richtig. Die Wachstumsphase muss also mehrere Jahre dauern.',
      nein: 'Nicht ganz: 60 durch 12 sind 5. Die Wachstumsphase dauert also mehrere Jahre.'
    },

    // ── Haarkunde: Pigmente & Farbaufnahme ───────────────────────────────
    '1-hk4': {
      bild: 'Beim Aufhellen werden die natürlichen Pigmente nicht gleichzeitig abgebaut. Darum wird dunkles Haar zuerst rötlich, dann orange und zuletzt gelb. Diese Abfolge zeigt dir, welche Farbanteile schon fehlen und welche noch im Haar sind. Der Untergrund verrät also, wie weit die Aufhellung fortgeschritten ist.',
      frage: 'Welche Farbe bleibt beim Aufhellen am längsten im Haar?',
      o: ['Gelb', 'Blau', 'Rot'], r: 0,
      ja: 'Richtig. Überleg jetzt: Welcher Farbanteil fehlt einem rötlichen Untergrund schon?',
      nein: 'Nicht ganz. Hell aufgehelltes Haar ist am Ende gelblich. Gelb hält also am längsten.'
    },
    '3-3': {
      bild: 'Wie schnell Haar Farbe aufnimmt, hängt vor allem von der Schuppenschicht ab. Grobes Haar hat viele, dicht anliegende Schuppenlagen. Bei grauem Haar kommt oft eine glasige, widerstandsfähige Struktur dazu. Praxis: Bei resistentem Grau die volle Einwirkzeit einhalten und, wenn der Hersteller es vorsieht, vorbehandeln.',
      frage: 'Welches Haar nimmt Farbe am schnellsten auf?',
      o: ['Poröses, blondiertes Haar', 'Grobes, gesundes graues Haar', 'Mittelstarkes Naturhaar'], r: 0,
      ja: 'Richtig. Die offene Schuppenschicht lässt Farbe schnell hinein. Am anderen Ende steht Haar mit dicht geschlossener Schuppenschicht.',
      nein: 'Nicht ganz. Poröses Haar mit offener Schuppenschicht nimmt am schnellsten auf. Dicht geschlossenes Haar am langsamsten.'
    },

    // ── Dauerwelle & Umformung ───────────────────────────────────────────
    '2-mc11': {
      bild: 'Im Cortex sind die Keratinketten durch Querverbindungen aneinander gebunden. Die stärksten davon sind Schwefelbrücken (S-S). Sie bestimmen die dauerhafte Form des Haares. Wasserstoffbrücken lösen sich schon beim Nassmachen, Schwefelbrücken nur chemisch.',
      frage: 'Warum hält eine Föhnfrisur nur bis zur nächsten Wäsche, eine Dauerwelle aber dauerhaft?',
      o: ['Föhnen verändert nur Wasserstoffbrücken, die Dauerwelle die Schwefelbrücken', 'Die Dauerwelle trocknet länger', 'Föhnen schließt die Cuticula'], r: 0,
      ja: 'Richtig. Die dauerhafte Form steckt in den Schwefelbrücken im Cortex.',
      nein: 'Nicht ganz. Wasserstoffbrücken lösen sich beim Waschen wieder. Die Dauerwelle verändert die Schwefelbrücken, darum hält sie.'
    },
    '1-12': {
      bild: 'Eine Dauerwelle läuft in zwei chemischen Schritten ab: Zuerst wird das Haar formbar gemacht, dann wird die neue Form festgelegt. Die dauerhafte Form des Haares steckt in den Schwefelbrücken im Cortex. Praxis: Mit der Wellprobe kontrollierst du, ob der erste Schritt weit genug ist, bevor gespült und fixiert wird.',
      frage: 'Was muss mit den Schwefelbrücken passieren, damit sich das Haar um den Wickler formen lässt?',
      o: ['Ein Teil davon muss geöffnet werden', 'Sie müssen verstärkt werden', 'Nichts, der Wickler reicht'], r: 0,
      ja: 'Richtig. Das ist die Aufgabe des Wellemittels. Das Schließen in der neuen Form kommt erst danach.',
      nein: 'Nicht ganz. Solange die Schwefelbrücken geschlossen sind, hält das Haar seine alte Form. Sie müssen zuerst teilweise geöffnet werden.'
    },
    '2-mc8': {
      bild: 'Nach dem Wellemittel liegt das Haar formbar in der Form des Wicklers. Im zweiten Schritt wird diese Form mit einem Oxidationsmittel dauerhaft festgelegt. Praxis: Vorher gründlich spülen, die Fixierung gleichmäßig auftragen und die Einwirkzeit einhalten.',
      frage: 'Welcher Stoff steckt meist im Fixierer?',
      o: ['Wasserstoffperoxid', 'Ammoniak', 'Thioglykolat'], r: 0,
      ja: 'Richtig. Als Oxidationsmittel legt es die neue Form fest. Was passiert dabei mit den geöffneten Schwefelbrücken?',
      nein: 'Nicht ganz. Ammoniak und Thioglykolat machen das Haar formbar. Fixiert wird mit einem Oxidationsmittel, meist Wasserstoffperoxid.'
    },
    '2-mc9': {
      bild: 'Coloration und Dauerwelle sind beide chemische Behandlungen, die in den Cortex eingreifen. Direkt hintereinander summiert sich die Belastung: Das Haar verliert Festigkeit, die Welle wird ungleichmäßig, im schlimmsten Fall bricht das Haar. Praxis: In der Regel kommt zuerst die Dauerwelle, die Farbe mit zeitlichem Abstand danach.',
      frage: 'Was prüfst du, bevor du bei gefärbtem Haar eine Dauerwelle machst?',
      o: ['Den Haarzustand, zum Beispiel mit einer Probesträhne', 'Nur die gewünschte Lockengröße', 'Nichts, gefärbtes Haar nimmt die Welle besser an'], r: 0,
      ja: 'Richtig. Gefärbtes Haar ist schon chemisch belastet. Zwei Behandlungen direkt hintereinander belasten es doppelt.',
      nein: 'Nicht ganz. Gefärbtes Haar ist vorbelastet. Vor der Dauerwelle prüfst du, ob es eine weitere chemische Behandlung verträgt.'
    },
    '2-mc10': {
      bild: 'Eine Dauerwelle hat nicht nur eine Stellschraube. Typisch im Salon: Zwei Kundinnen bekommen gleiche Wickler und das gleiche Mittel. Eine hat feines, blondiertes Haar, die andere grobes Naturhaar. Das Ergebnis wird trotzdem unterschiedlich. Darum kontrollierst du mit der Wellprobe und nicht nur nach der Uhr.',
      frage: 'Gleiche Wickler, gleiches Mittel, aber feines blondiertes und grobes Naturhaar. Wird das Ergebnis gleich?',
      o: ['Nein, die Haarstruktur wirkt mit', 'Ja, immer', 'Nur wenn die Einwirkzeit gleich ist'], r: 0,
      ja: 'Richtig. Neben Wickler und Mittel zählen also auch Einwirkzeit und Haarstruktur.',
      nein: 'Nicht ganz. Feines, vorbehandeltes Haar reagiert schneller als grobes Naturhaar. Es zählen mehrere Faktoren zusammen.'
    },
    '3-mc7': {
      bild: 'Der pH-Wert eines Wellemittels steuert, wie stark das Haar quillt. Starke Quellung öffnet das Haar weit, das Mittel dringt schnell und kräftig ein. Geringe Quellung wirkt langsamer und schont das Haar. Praxis: Die Wahl richtet sich nach dem Haarzustand, nicht nach dem Zeitplan.',
      frage: 'Ein Wellemittel hat einen hohen pH-Wert. Was bedeutet das für die Wirkung?',
      o: ['Stärker und schneller', 'Schonender und langsamer', 'Kein Unterschied'], r: 0,
      ja: 'Richtig. Ein hoher pH-Wert heißt alkalisch. Ordne jetzt sauer und alkalisch zu.',
      nein: 'Nicht ganz. Ein hoher pH-Wert lässt das Haar stark quellen. Das Mittel wirkt dadurch stärker und schneller.'
    },
    // ── Hygiene & Schutzmaßnahmen ────────────────────────────────────────
    '1-1': {
      bild: 'Hygiene im Salon baut in Stufen aufeinander auf. Die erste entfernt sichtbaren Schmutz und Haare. Die zweite verringert Krankheitserreger so weit, dass keine Ansteckungsgefahr mehr besteht. Die dritte tötet alle Keime einschließlich Sporen ab und ist im Salon nur für bestimmte Instrumente nötig.',
      frage: 'Welche Stufe tötet auch Sporen ab?',
      o: ['Sterilisieren', 'Desinfizieren', 'Reinigen'], r: 0,
      ja: 'Richtig. Das ist die höchste Stufe. Davor kommen das Entfernen von Schmutz und das Verringern der Keime.',
      nein: 'Nicht ganz. Sporen werden nur beim Sterilisieren abgetötet, der höchsten Stufe.'
    },
    '1-15': {
      bild: 'Desinfektionsmittel brauchen eine Mindest-Einwirkzeit, um Keime sicher abzutöten. Sie gilt nur, wenn die Fläche oder das Werkzeug so lange benetzt bleibt. Praxis: Gründlich benetzen, die angegebene Zeit abwarten und erst dann abwischen oder weiterarbeiten.',
      frage: 'Wo findest du die genaue Einwirkzeit eines Desinfektionsmittels?',
      o: ['Auf dem Produkt bzw. in der Gebrauchsanweisung', 'Im Terminbuch', 'Das entscheidet jede selbst'], r: 0,
      ja: 'Richtig. Als Faustregel nennt die Quizfrage eine Mindestzeit.',
      nein: 'Nicht ganz. Die Einwirkzeit legt der Hersteller fest. Sie steht auf dem Produkt bzw. in der Gebrauchsanweisung.'
    },
    '1-mc23': {
      bild: 'Hygiene kennt verschiedene Stufen. Nur die Sterilisation tötet alle Keime einschließlich Sporen ab. Für Kämme, Scheren und Flächen im Salon reicht in der Regel die Stufe darunter.',
      frage: 'Ist ein desinfizierter Kamm keimfrei?',
      o: ['Nein, keimfrei macht nur die Sterilisation', 'Ja, vollständig', 'Ja, wenn er danach trocknet'], r: 0,
      ja: 'Richtig. Desinfektion verringert die Keime so weit, dass keine Ansteckungsgefahr mehr besteht.',
      nein: 'Nicht ganz. Keimfrei wird ein Werkzeug nur durch Sterilisation. Desinfektion verringert die Keime auf ein unbedenkliches Maß.'
    },
    '2-13': {
      bild: 'Hände sind der häufigste Übertragungsweg für Keime im Salon. Darum werden sie zu festen Zeitpunkten desinfiziert, unabhängig davon, ob sie schmutzig aussehen. Praxis: Händedesinfektionsmittel nach Herstellerangabe einreiben, bis die Hände trocken sind, und die Haut danach pflegen.',
      frage: 'Du hast eine Kundin fertig geschnitten, die nächste wartet. Was gehört dazwischen?',
      o: ['Hände desinfizieren', 'Nichts, die Hände sehen sauber aus', 'Nur die Schere abwischen'], r: 0,
      ja: 'Richtig. Dazu kommen alle Momente, in denen die Hände verschmutzt wurden.',
      nein: 'Nicht ganz. Zwischen zwei Kundinnen werden die Hände desinfiziert, auch wenn sie sauber aussehen.'
    },
    '2-mc17': {
      bild: 'Handtücher haben direkten Kontakt mit Haut, Haar und Kopfhaut. Sie nehmen Hautschüppchen, Feuchtigkeit und Keime auf, auch wenn man nichts davon sieht. Benutzte Wäsche wird getrennt gesammelt und heiß gewaschen.',
      frage: 'Wie wäschst du benutzte Handtücher, damit Keime sicher abgetötet werden?',
      o: ['Bei mindestens 60 °C', 'Kalt, damit sie weich bleiben', 'Gar nicht, Auslüften reicht'], r: 0,
      ja: 'Richtig. Sauber heißt also frisch gewaschen. Wie oft brauchst du frische Handtücher?',
      nein: 'Nicht ganz. Keime werden erst bei mindestens 60 °C sicher abgetötet. Auslüften reicht nicht.'
    },
    '1-mc22': {
      bild: 'Gebrauchte Rasierklingen sind eine typische Ursache für Schnittverletzungen im Salon, auch bei Kolleginnen, die später den Müll ausleeren. Darum werden sie sofort nach Gebrauch sicher entsorgt: nie lose, nie in Papier gewickelt.',
      frage: 'Warum gelten gebrauchte Klingen als besonders gefährlich?',
      o: ['Sie sind scharf und können mit Blut in Kontakt gewesen sein', 'Sie rosten schnell', 'Sie sind teuer'], r: 0,
      ja: 'Richtig. Sie dürfen niemanden verletzen, auch nicht beim Ausleeren. Was muss der Behälter dafür können?',
      nein: 'Nicht ganz. Gefährlich sind die Schneide und mögliche Blutreste. Darum braucht es einen Behälter, der sich nicht durchstechen lässt.'
    },
    '2-1': {
      bild: 'Bei Friseurinnen gehört diese Hauterkrankung zu den häufigsten Berufskrankheiten. Viel Nassarbeit, Shampoo, Farbe und Dauerwellmittel schwächen die Hautbarriere der Hände. Zeichen sind Rötung, Trockenheit, Risse und Brennen. Vorbeugung: Handschuhe bei Nassarbeit und Chemie, Hautschutz vor und Pflege nach der Arbeit.',
      frage: 'Was bedeutet die Endung „-itis“ in medizinischen Fachbegriffen?',
      o: ['Entzündung', 'Allergie', 'Ansteckung'], r: 0,
      ja: 'Richtig. „Derma“ heißt Haut. Zusammen mit „Kontakt“ ergibt sich die Bedeutung.',
      nein: 'Nicht ganz. „-itis“ steht immer für eine Entzündung. „Derma“ heißt Haut.'
    },
    '3-mc10': {
      bild: 'Auf Desinfektionsmitteln steht, gegen welche Erreger sie wirken: „bakterizid“ gegen Bakterien, „levurozid“ gegen Hefepilze. Bei Viren gibt es Stufen: „begrenzt viruzid“ wirkt gegen behüllte Viren, „begrenzt viruzid plus“ zusätzlich gegen einige besonders widerstandsfähige, unbehüllte Viren, „viruzid“ gegen alle Viren.',
      frage: 'Wirkt ein „begrenzt viruzides“ Mittel gegen alle Viren?',
      o: ['Nein, nur gegen einen Teil', 'Ja, gegen alle', 'Es wirkt gar nicht gegen Viren'], r: 0,
      ja: 'Richtig. Das „plus“ erweitert die Wirkung um einige widerstandsfähige Viren. Gegen alle Keime einschließlich Sporen wirkt es aber nicht.',
      nein: 'Nicht ganz. „Begrenzt“ heißt: gegen einen Teil der Viren. Gegen alle Viren wirkt nur ein „viruzides“ Mittel.'
    },
    '2-mc18': {
      bild: 'Gefahrstoffe sind mit Symbolen in roten Rauten gekennzeichnet (GHS). Jedes Symbol steht für eine Gefahrenart. Im Salon tragen zum Beispiel Haarspray und manche Stylingprodukte das Flammensymbol. Praxis: Solche Produkte nie in der Nähe von Glätteisen, heißem Föhn oder offener Flamme sprühen.',
      frage: 'Wo findest du alle Einzelheiten zu den Gefahren eines Produkts?',
      o: ['Im Sicherheitsdatenblatt', 'Auf dem Kassenbon', 'In der Preisliste'], r: 0,
      ja: 'Richtig. Das Flammensymbol selbst warnt vor einer Gefahr, die mit Hitze und Feuer zu tun hat.',
      nein: 'Nicht ganz. Gefahren, Inhaltsstoffe und Erste Hilfe stehen im Sicherheitsdatenblatt.'
    },

    // ── Werkzeugkunde: Schere ────────────────────────────────────────────
    '1-5': {
      bild: 'Scheren unterscheiden sich an den Klingen. Mit zwei glatten Klingen schneidest du jede Strähne vollständig durch, für klare Linien und Konturen. Hat eine Klinge Zähne, wird nur ein Teil der Haare erfasst: Das nimmt Volumen heraus, ohne eine sichtbare Schnittkante zu hinterlassen.',
      frage: 'Du willst dickes Haar ausdünnen, ohne dass eine Kante entsteht. Welche Klinge brauchst du?',
      o: ['Eine gezahnte Klinge', 'Zwei glatte Klingen', 'Eine stumpfe Klinge'], r: 0,
      ja: 'Richtig. Gezahnte Klingen dünnen aus, glatte Klingen schneiden klare Linien. Welche Schere hat welche?',
      nein: 'Nicht ganz. Glatte Klingen schneiden die ganze Strähne und hinterlassen eine Kante. Zum Ausdünnen brauchst du eine gezahnte Klinge.'
    },
    '1-mc35': {
      bild: 'Eine Profischere ist ein Präzisionswerkzeug. Haare, Feuchtigkeit und Reste von Desinfektionsmittel im Gelenk führen zu Rost und machen sie schwergängig. Sie wird nie fallen gelassen, weil schon ein Sturz die Schneide beschädigen kann.',
      frage: 'Wer schleift eine Profischere?',
      o: ['Ein Fachbetrieb', 'Jede im Salon mit einem Messerschärfer', 'Niemand, sie wird nie stumpf'], r: 0,
      ja: 'Richtig. Die tägliche Pflege machst du selbst. Was gehört nach jeder Kundin dazu?',
      nein: 'Nicht ganz. Eine Profischere wird nur vom Fachbetrieb geschliffen. Die tägliche Pflege machst du selbst.'
    },
    // ── Hautkunde ────────────────────────────────────────────────────────
    '1-17': {
      bild: 'Die Haut besteht aus drei Schichten. Die äußere schützt und erneuert sich ständig. Die mittlere enthält Haarwurzeln, Talg- und Schweißdrüsen, Blutgefäße und Nerven. Die untere besteht vor allem aus Fettgewebe und dient als Polster und Wärmeschutz.',
      frage: 'Cuticula, Cortex, Medulla: Wozu gehören diese Begriffe?',
      o: ['Zum Haar, nicht zur Haut', 'Zur Haut', 'Zu den Nägeln'], r: 0,
      ja: 'Richtig, das ist die Falle in der Frage. Die Hautschichten haben deutsche Namen: Oberhaut, Lederhaut und …?',
      nein: 'Nicht ganz. Cuticula, Cortex und Medulla sind die Schichten des Haares. Die Haut hat eigene Schichten mit deutschen Namen.'
    },
    '1-mc13': {
      bild: 'Die Oberhaut ist dünn, hat keine Blutgefäße und erneuert sich ständig. Haarwurzeln, Talgdrüsen und Schweißdrüsen brauchen dagegen eine Versorgung über das Blut. Sie liegen deshalb in der Schicht darunter, die Blutgefäße und Nerven enthält.',
      frage: 'Was brauchen Haarwurzeln und Drüsen, das die Oberhaut nicht bietet?',
      o: ['Blutversorgung', 'Licht', 'Talg'], r: 0,
      ja: 'Richtig. Darum liegen sie in der mittleren Hautschicht.',
      nein: 'Nicht ganz. Haarwurzeln und Drüsen müssen über das Blut versorgt werden. Blutgefäße gibt es erst unter der Oberhaut.'
    },
    '1-mc9': {
      bild: 'In der untersten Lage der Oberhaut entstehen ständig neue Zellen. Sie wandern nach oben, verhornen und werden als feine Hornschüppchen abgestoßen, etwa alle vier Wochen komplett. Praxis: Auf gesunder Kopfhaut ist das unsichtbar. Sichtbare Schuppen zeigen, dass dieser Ablauf gestört ist.',
      frage: 'Was zeigen sichtbare Schuppen auf der Kopfhaut?',
      o: ['Die Hauterneuerung ist gestört', 'Die Kopfhaut ist besonders gesund', 'Das Haar wächst schneller'], r: 0,
      ja: 'Richtig. Normalerweise werden die alten Zellen unsichtbar an der Oberfläche abgestoßen. Welche Schicht ist das?',
      nein: 'Nicht ganz. Gesunde Haut erneuert sich unsichtbar. Sichtbare Schuppen zeigen eine Störung.'
    },
    '1-mc10': {
      bild: 'Talg und Schweiß bilden auf der Haut einen leicht sauren Film, der Bakterien und Pilze hemmt. Die pH-Skala reicht von sauer (unter 7) über neutral (7) bis alkalisch (über 7). Praxis: Alkalische Produkte wie Farbe oder Dauerwelle stören diesen Film. Ein saures Pflegeprodukt hilft danach, ihn wieder aufzubauen.',
      frage: 'Warum behandelst du die Kopfhaut nach einer Farbe mit einem sauren Produkt nach?',
      o: ['Damit sich der Schutzfilm wieder einstellt', 'Damit die Farbe heller wird', 'Damit das Haar schneller trocknet'], r: 0,
      ja: 'Richtig. Der Schutzfilm ist von Natur aus leicht sauer. Welcher pH-Bereich passt dazu?',
      nein: 'Nicht ganz. Farbe ist alkalisch und stört den leicht sauren Schutzfilm. Das saure Produkt stellt ihn wieder her.'
    },
    '1-18': {
      bild: 'Talgdrüsen sitzen am Haarfollikel und geben ihr Fett direkt in den Haarkanal ab. Talg macht Haut und Haar geschmeidig und bildet zusammen mit Schweiß den Schutzfilm der Haut. Praxis: Produziert die Kopfhaut zu viel davon, wirkt das Haar schnell fettig.',
      frage: 'Eine Kundin wäscht täglich sehr heiß. Was passiert mit der Talgproduktion?',
      o: ['Sie wird angeregt', 'Sie hört auf', 'Sie bleibt gleich'], r: 0,
      ja: 'Richtig. Darum empfiehlst du lauwarmes Wasser und ein mildes Shampoo.',
      nein: 'Nicht ganz. Heißes Wasser regt die Talgdrüsen an. Das Haar fettet dadurch schneller nach.'
    },
    '1-n4': {
      bild: 'Schweißdrüsen geben Wasser mit gelösten Salzen an die Hautoberfläche ab. Verdunstet der Schweiß, kühlt er den Körper. Nebenbei werden Stoffe ausgeschieden, und der Schweiß trägt zum Schutzfilm der Haut bei.',
      frage: 'Wie kühlt Schweiß den Körper?',
      o: ['Er verdunstet auf der Haut und nimmt Wärme mit', 'Er verschließt die Poren', 'Er bildet eine Fettschicht'], r: 0,
      ja: 'Richtig. Temperatur regeln und Stoffe ausscheiden sind die Aufgaben der Schweißdrüse.',
      nein: 'Nicht ganz. Schweiß verdunstet auf der Haut und entzieht ihr dabei Wärme. Eine Fettschicht bildet der Talg.'
    },
    '1-16': {
      bild: 'Die Haut ist das größte Organ des Körpers und erfüllt mehrere Aufgaben gleichzeitig. Im Salon siehst du das ständig: Sie schützt die Kopfhaut bei chemischen Behandlungen, sie schwitzt unter der Wärmehaube, und die Kundin spürt jeden Griff bei der Massage.',
      frage: 'Die Kundin spürt bei der Kopfmassage jeden Griff. Welche Aufgabe der Haut zeigt das?',
      o: ['Sinnesorgan', 'Fettspeicher', 'Temperaturregelung'], r: 0,
      ja: 'Richtig. Die Haut hat aber mehrere Aufgaben. Welche Antwort zählt sie auf?',
      nein: 'Nicht ganz. Dass die Kundin jeden Griff spürt, zeigt: Die Haut ist auch ein Sinnesorgan.'
    },
    '1-mc12': {
      bild: 'Schuppen sind ein Befund, keine Diagnose. Mögliche Ursachen sind trockene Kopfhaut, eine Vermehrung des Hefepilzes Malassezia, ungeeignete oder zu aggressive Pflegeprodukte und Hauterkrankungen. Praxis: Ob die Schuppen fein, weiß und rieselnd oder gelblich und fettig sind, gibt einen ersten Hinweis.',
      frage: 'Ein Anti-Schuppen-Shampoo hilft bei einer Kundin nicht. Was folgerst du?',
      o: ['Die Ursache ist eine andere, eventuell einen Hautarzt empfehlen', 'Sie muss es länger einwirken lassen', 'Schuppen sind nicht behandelbar'], r: 0,
      ja: 'Richtig. Achte bei der Quizfrage auf Antworten mit „nur“, „immer“ oder „ausschließlich“.',
      nein: 'Nicht ganz. Hilft ein Mittel nicht, steckt oft eine andere Ursache dahinter. Schuppen haben viele mögliche Gründe.'
    },
    '3-5': {
      bild: 'Zerleg den Fachbegriff: „Sebum“ ist Talg, „-rrhoe“ heißt Fluss. Gemeint ist eine Überproduktion der Talgdrüsen. Bei der Haarwäsche erkennst du sie daran, dass die Kopfhaut schon am Tag nach der Wäsche glänzt und die Schuppen gelblich sind und haften.',
      frage: 'Welcher Befund bei der Haarwäsche passt zu Seborrhoe?',
      o: ['Fettig glänzende Kopfhaut mit gelblichen, haftenden Schuppen', 'Feine weiße, rieselnde Schuppen auf trockener Kopfhaut', 'Kreisrunde kahle Stellen'], r: 0,
      ja: 'Richtig. Feine weiße Schuppen sprechen dagegen eher für trockene Kopfhaut.',
      nein: 'Nicht ganz. Bei Seborrhoe wird zu viel Talg gebildet: Die Kopfhaut glänzt fettig, die Schuppen sind gelblich und haften.'
    },
    '2-mc15': {
      bild: 'Der deutsche Name ist Schuppenflechte. Typisch sind scharf begrenzte, gerötete Stellen mit dicken Schuppen, oft auch an Ellbogen und Knien. Sie ist nicht ansteckend. Praxis: Keine Coloration oder Dauerwelle auf entzündeten Stellen ohne ärztliche Freigabe.',
      frage: 'Eine Erkrankung kommt immer wieder und heilt nicht vollständig aus. Wie nennt man das?',
      o: ['Chronisch', 'Akut', 'Ansteckend'], r: 0,
      ja: 'Richtig. Psoriasis ist chronisch, ihre Schuppen sind typischerweise silbrig-weiß.',
      nein: 'Nicht ganz. „Chronisch“ heißt: Es kommt immer wieder und bleibt. Ansteckend ist Psoriasis nicht.'
    },
    '2-mc16': {
      bild: 'Als Friseurin erkennst du Auffälligkeiten an Kopfhaut und Haut oft als Erste. Eine Diagnose stellen und behandeln darf aber nur ein Arzt. Professionell ist: die Stelle ruhig und diskret ansprechen, keine Vermutung als Diagnose äußern und bei Bedarf auf chemische Behandlungen verzichten.',
      frage: 'Wer stellt die Diagnose bei einer Hauterkrankung?',
      o: ['Eine Ärztin oder ein Arzt', 'Die Friseurin', 'Die Kundin selbst'], r: 0,
      ja: 'Richtig. Deine Aufgabe ist erkennen, ansprechen und weiterleiten.',
      nein: 'Nicht ganz. Eine Diagnose stellt nur ein Arzt. Du erkennst, sprichst an und leitest weiter.'
    },

    // ── Haarwäsche & Kopfmassage ─────────────────────────────────────────
    '1-hw1': {
      bild: 'Die Haut an den Händen ist durch die Nassarbeit abgehärtet und schätzt Wärme schlecht ein. Die Kopfhaut der Kundin ist deutlich empfindlicher. Darum prüfst du die Wassertemperatur an einer Stelle mit ähnlich dünner, empfindlicher Haut und fragst danach die Kundin.',
      frage: 'Warum prüfst du die Wassertemperatur nicht an der Handfläche?',
      o: ['Die Hände sind abgehärtet und spüren Hitze schlechter', 'Weil die Handfläche nass wird', 'Weil es unhygienisch ist'], r: 0,
      ja: 'Richtig. Die Stelle zum Prüfen soll so empfindlich sein wie die Kopfhaut.',
      nein: 'Nicht ganz. Die Hände sind abgehärtet und schätzen Hitze falsch ein. Du brauchst eine Stelle mit dünner, empfindlicher Haut.'
    },
    '1-hw2': {
      bild: 'Für die normale Haarwäsche ist lauwarmes Wasser richtig, ungefähr Körpertemperatur. Zu heißes Wasser reizt die Kopfhaut, regt die Talgdrüsen an und lässt Farbpigmente ausbluten. Zu kaltes Wasser löst Talg und Stylingreste schlecht.',
      frage: 'Welche Körpertemperatur hat ein gesunder Mensch ungefähr?',
      o: ['Etwa 37 °C', 'Etwa 32 °C', 'Etwa 40 °C'], r: 0,
      ja: 'Richtig. Das Wasser für die Haarwäsche liegt ungefähr in diesem Bereich.',
      nein: 'Nicht ganz. Die Körpertemperatur liegt bei etwa 37 °C. Ungefähr so warm ist das Wasser für die Haarwäsche.'
    },
    '1-hw3': {
      bild: 'Warmes Wasser lässt das Haar leicht quellen, die Schuppenschicht steht etwas ab. Zum Schluss der Wäsche nutzt du den umgekehrten Effekt: Glatt anliegende Schuppen reflektieren das Licht gleichmäßiger, und das Haar lässt sich leichter kämmen.',
      frage: 'Welche Haaroberfläche reflektiert das Licht am gleichmäßigsten?',
      o: ['Eine glatt anliegende Schuppenschicht', 'Eine aufgeraute Schuppenschicht', 'Eine gequollene Schuppenschicht'], r: 0,
      ja: 'Richtig. Und was lässt die Schuppen anliegen: warmes oder kühleres Wasser?',
      nein: 'Nicht ganz. Nur eine glatte Oberfläche reflektiert das Licht gleichmäßig. Dafür muss die Schuppenschicht anliegen.'
    },
    '1-hw4': {
      bild: 'Bei der Kopfmassage soll die Kopfhaut bewegt und durchblutet werden, ohne sie zu verletzen. Fingernägel können feine Verletzungen und Reizungen verursachen, durch die Keime eindringen. Praxis: Kurze, gepflegte Nägel sind deshalb Teil der Berufshygiene.',
      frage: 'Was soll eine Kopfmassage bewirken?',
      o: ['Die Kopfhaut bewegen und durchbluten, ohne sie zu reizen', 'Die Kopfhaut kräftig aufrauen', 'Schuppen abkratzen'], r: 0,
      ja: 'Richtig. Dafür brauchst du den Teil des Fingers, der fest, aber weich aufsetzt.',
      nein: 'Nicht ganz. Die Massage soll lockern und durchbluten. Kratzen reizt die Kopfhaut und kann sie verletzen.'
    },
    '1-hw7': {
      bild: 'Das Haar ist am Ansatz am jüngsten und an den Spitzen am ältesten. Längen und Spitzen haben Monate oder Jahre mit Föhnen, UV-Strahlung und chemischen Behandlungen hinter sich und sind entsprechend strapaziert. Pflege wird dort gebraucht, wo die Schuppenschicht aufgeraut ist. Ausnahme: spezielle Kopfhautpflege.',
      frage: 'Was passiert, wenn eine normale Spülung auf die Kopfhaut kommt?',
      o: ['Der Ansatz wird schwer und fettet schneller', 'Das Haar wächst schneller', 'Die Kopfhaut wird gereinigt'], r: 0,
      ja: 'Richtig. Pflege gehört dorthin, wo das Haar strapaziert ist.',
      nein: 'Nicht ganz. Auf der Kopfhaut beschwert Pflege den Ansatz und fettet nach. Sie gehört dorthin, wo das Haar strapaziert ist.'
    },
    '1-hw8': {
      bild: 'Eine Kopfmassage regt die Durchblutung an und übt Druck auf die Kopfhaut aus. Das ist nur bei gesunder Kopfhaut angenehm und unbedenklich. Bei offenen oder entzündeten Stellen kann Druck Schmerzen verursachen, Keime verbreiten und die Heilung stören.',
      frage: 'Wann schaust du dir die Kopfhaut der Kundin an?',
      o: ['Vor der Wäsche, beim Durchbürsten', 'Erst nach dem Föhnen', 'Gar nicht, das ist Sache des Arztes'], r: 0,
      ja: 'Richtig. So erkennst du rechtzeitig, wo nicht massiert werden darf.',
      nein: 'Nicht ganz. Die Kopfhaut siehst du dir vor der Wäsche beim Durchbürsten an, damit du rechtzeitig reagieren kannst.'
    },
    '1-hw9': {
      bild: 'Nach der Wäsche ist das Haar gequollen, die Schuppenschicht steht leicht ab. In diesem Zustand ist es besonders empfindlich gegen mechanische Belastung. Praxis: Haar sanft mit dem Handtuch ausdrücken und einen Turban wickeln.',
      frage: 'Was passiert mit einer abstehenden Schuppenschicht, wenn du darüber reibst?',
      o: ['Sie wird aufgeraut', 'Sie legt sich glatt an', 'Sie wird verstärkt'], r: 0,
      ja: 'Richtig. Aufgeraute Schuppen machen das Haar stumpf und bruchanfällig.',
      nein: 'Nicht ganz. Reibung raut die abstehende Schuppenschicht auf. Das Haar wird stumpf und kann brechen.'
    },
    '1-hw15': {
      bild: 'Die Entspannungshaarwäsche folgt einem festen Aufbau. Sie führt die Kundin schrittweise von der Anspannung, mit der sie in den Salon kommt, in die Ruhe. Darum beginnt sie lösend, wird dann tief entspannend, gleicht anschließend aus und endet ruhig, ohne anregende Griffe.',
      frage: 'Womit endet eine Entspannungshaarwäsche?',
      o: ['Mit einer Ruhephase', 'Mit kräftigem Klopfen', 'Mit kaltem Wasser'], r: 0,
      ja: 'Richtig. Welche Antwort beschreibt einen Ablauf von lösend bis ruhig?',
      nein: 'Nicht ganz. Eine Entspannungswäsche endet ruhig. Anregende Griffe wie Klopfen gehören zur vitalisierenden Massage.'
    },
    'b-10': {
      bild: 'Bei der ersten Wäsche bindet das Shampoo vor allem Talg, Stylingreste und Schmutz. Es schäumt deshalb oft kaum. Erst bei der zweiten Wäsche werden Haar und Kopfhaut wirklich gereinigt, und Pflegewirkstoffe können wirken. Praxis: Die Shampoomenge an Haarlänge und Verschmutzung anpassen.',
      frage: 'Warum schäumt das Shampoo bei der ersten Wäsche oft wenig?',
      o: ['Es bindet erst Talg und Stylingreste', 'Das Wasser ist zu kalt', 'Es ist zu viel Shampoo'], r: 0,
      ja: 'Richtig. Die zweite Wäsche reinigt dann richtig. Wie oft wird also grundsätzlich gewaschen?',
      nein: 'Nicht ganz. Das erste Shampoo ist mit Talg und Stylingresten beschäftigt. Erst die zweite Wäsche reinigt richtig.'
    },

    // ── Schnittwerkstatt (schnittwerkstatt.html, Wissens-Check) ───────────
    // Die Fragen dort haben keine id: Schlüssel sw1–sw15 = Reihenfolge im QUIZ,
    // „zu“ = Anfang des Fragetexts. Passt der Text nicht, zeigt die Seite keinen Knopf.
    'sw1': {
      zu: 'Welcher Erhebungswinkel ergibt eine kompakte Form',
      bild: 'Der Erhebungswinkel beschreibt, wie weit eine Strähne beim Schneiden aus ihrem natürlichen Fall angehoben wird. Je weiter du anhebst, desto mehr Stufung entsteht. Eine kompakte Form hat eine geschlossene, ruhige Kontur ohne Stufung.',
      frage: 'Was passiert mit der Stufung, je höher du die Strähnen anhebst?',
      o: ['Sie nimmt zu', 'Sie nimmt ab', 'Sie bleibt gleich'], r: 0,
      ja: 'Richtig. Keine Stufung heißt also: gar nicht anheben.',
      nein: 'Nicht ganz. Je höher du anhebst, desto mehr Stufung entsteht. Für eine kompakte Form wird nicht angehoben.'
    },
    'sw2': {
      zu: 'Wie wird bei der gleichmäßig stufigen Form gehalten',
      bild: 'Bei der gleichmäßig stufigen Form sollen alle Haare überall gleich lang werden. Der Kopf ist aber rund. Darum richtest du den Haltewinkel nicht am Boden aus, sondern an der Kopfoberfläche an der Stelle, an der du gerade schneidest.',
      frage: 'Du hältst jede Strähne im gleichen Winkel zum Boden. Werden die Längen auf dem runden Kopf gleich?',
      o: ['Nein, wegen der Kopfrundung nicht', 'Ja, immer', 'Nur am Hinterkopf'], r: 0,
      ja: 'Richtig. Gleich lang wird es nur, wenn du den Winkel an der Kopfrundung ausrichtest.',
      nein: 'Nicht ganz. Der Boden ist flach, der Kopf rund. Gleich lang wird es nur mit einem Winkel zur Kopfrundung.'
    },
    'sw3': {
      zu: 'Wo sitzt bei der graduierten Form das Gewicht',
      bild: 'Bei der graduierten Form sind die Haare unten kürzer und werden nach oben länger. Die Haarenden liegen dadurch übereinander und bilden eine sichtbare Fülle. Diese Linie bestimmt, wo die Form optisch Breite bekommt.',
      frage: 'Wo treffen bei der graduierten Form die kurzen unteren und die längeren oberen Haare zusammen?',
      o: ['Knapp über der unteren Kontur', 'Ganz oben am Oberkopf', 'Nirgends'], r: 0,
      ja: 'Richtig. Dort stapeln sich die Enden. Wie heißt diese Linie?',
      nein: 'Nicht ganz. Die Enden stapeln sich knapp über der Kontur, dort, wo kurze und längere Haare zusammentreffen.'
    },
    'sw4': {
      zu: 'Wo liegt bei der ansteigenden Form',
      bild: 'Bei der ansteigenden Form wird das Haar im Profil von vorne nach hinten länger, bis zum höchsten Punkt des Kopfes. Sie öffnet das Gesicht und gibt Länge am Oberkopf. Praxis: Die Leitlänge legst du dort fest, wo die Form beginnt.',
      frage: 'Wo beginnt im Profil eine Form, die nach hinten länger wird?',
      o: ['Vorne an der Stirn', 'Am Hinterkopf', 'Im Nacken'], r: 0,
      ja: 'Richtig. Der Anfang ist der kürzeste Punkt.',
      nein: 'Nicht ganz. Wird die Form nach hinten länger, beginnt sie vorne. Dort ist sie am kürzesten.'
    },
    'sw5': {
      zu: 'In welchem Bereich liegt eine mittlere Graduierung',
      bild: 'Graduierungen werden nach ihrem Erhebungswinkel eingeteilt. Der Bereich zwischen 0° und 90° wird dafür in drei gleich große Abschnitte geteilt: niedrige, mittlere und hohe Graduierung.',
      frage: 'Wie groß ist jeder der drei Abschnitte zwischen 0° und 90°?',
      o: ['30°', '45°', '60°'], r: 0,
      ja: 'Richtig. Der mittlere Abschnitt liegt also zwischen 30° und 60°.',
      nein: 'Nicht ganz: 90° durch 3 sind 30°. Niedrig bis 30°, mittel bis 60°, hoch bis 90°.'
    },
    'sw6': {
      zu: 'Was bedeutet „wandernde Leitsträhne“',
      bild: 'Eine Leitsträhne gibt die Länge vor, an der du schneidest. Es gibt zwei Arten: Bei der festen Leitsträhne werden alle Strähnen zu einem Punkt geführt. Bei der anderen nimmst du von jeder fertigen Abteilung einen Teil in die nächste mit.',
      frage: 'Was entsteht, wenn alle Strähnen zu einem festen Punkt geführt werden?',
      o: ['Eine Längenzunahme weg von diesem Punkt', 'Überall gleiche Längen', 'Eine kompakte Form'], r: 0,
      ja: 'Richtig. Das ist die feste Leitsträhne. Bei der wandernden nimmst du dagegen von jeder Abteilung etwas mit.',
      nein: 'Nicht ganz. Werden alle Strähnen zu einem Punkt geführt, wird das Haar weg von diesem Punkt länger. Das ist die feste Leitsträhne.'
    },
    'sw7': {
      zu: 'Welche Oberflächenstruktur hat die kompakte Form',
      bild: 'Bei der Oberflächenstruktur unterscheidet man zwei Wirkungen: aktiviert, wenn die Haarenden sichtbar über die Fläche verteilt sind, und unaktiviert, wenn die Fläche glatt und geschlossen wirkt. Entscheidend ist, wo die Haarenden liegen.',
      frage: 'Bei der kompakten Form enden alle Haare auf einer Linie. Sind die Haarenden an der Oberfläche sichtbar?',
      o: ['Nein, sie liegen unter der Fläche', 'Ja, überall', 'Nur am Oberkopf'], r: 0,
      ja: 'Richtig. Welcher Begriff passt also zur Oberfläche?',
      nein: 'Nicht ganz. Enden alle Haare auf einer Linie, liegen die Spitzen unter der Fläche. Die Oberfläche wirkt glatt.'
    },
    'sw8': {
      zu: 'Was zeigen die Pfeile in einer Schnittzeichnung',
      bild: 'Eine Schnittzeichnung ist der Arbeitsplan für einen Haarschnitt. Sie zeigt Abteilungen, Schnittlinien und die Haltung der Strähnen. Wer sie lesen kann, kann einen Schnitt nachvollziehbar wiederholen.',
      frage: 'In einer Schnittzeichnung zeigt ein Pfeil steil nach oben. Was bedeutet das für die Strähne?',
      o: ['Sie wird stark angehoben', 'Sie wird nach unten gekämmt', 'Sie wird nicht geschnitten'], r: 0,
      ja: 'Richtig. Pfeile zeigen Richtung und Winkel, in denen du die Strähne hältst.',
      nein: 'Nicht ganz. Ein Pfeil steil nach oben bedeutet: Die Strähne wird stark angehoben.'
    },
    'sw9': {
      zu: 'Warum sind bei der kompakten Form die inneren Haare länger',
      bild: 'Bei der kompakten Form enden alle Haare auf einer gemeinsamen Kontur. Die Haare entspringen aber an verschiedenen Stellen der Kopfrundung. Je höher am Kopf ein Haar wächst, desto weiter ist sein Weg über die Rundung bis zur Kontur.',
      frage: 'Ein Haar wächst am Oberkopf, ein anderes im Nacken. Welches braucht mehr Länge bis zur gemeinsamen Kontur?',
      o: ['Das vom Oberkopf', 'Das aus dem Nacken', 'Beide gleich viel'], r: 0,
      ja: 'Richtig. Darum sind die inneren, oberen Haare länger.',
      nein: 'Nicht ganz. Vom Oberkopf ist der Weg über die Kopfrundung zur Kontur länger. Dieses Haar braucht mehr Länge.'
    },
    'sw10': {
      zu: 'Welche Abteilungen passen gut zur gleichmäßig stufigen Form',
      bild: 'Die Abteilung bestimmt, wie leicht sich eine Strähne im richtigen Winkel halten lässt. Darum wählst du die Abteilung passend zu der Form, die entstehen soll.',
      frage: 'Was soll die Abteilung bei der gleichmäßig stufigen Form leicht machen?',
      o: ['Die Strähne senkrecht zur Kopfrundung zu halten', 'Die Strähne flach an den Kopf zu legen', 'Alles zu einem Punkt zu ziehen'], r: 0,
      ja: 'Richtig. Das gelingt mit Abteilungen, die der Kopfrundung folgen.',
      nein: 'Nicht ganz. Bei der gleichmäßig stufigen Form hältst du senkrecht zur Kopfrundung. Die Abteilung soll genau das leicht machen.'
    },
    'sw11': {
      zu: 'In welcher Ansicht misst du den Erhebungswinkel',
      bild: 'Der Erhebungswinkel beschreibt, wie weit eine Strähne aus dem natürlichen Fall nach oben angehoben wird. Um ihn zu beurteilen, brauchst du einen Blickwinkel, aus dem du die Bewegung nach oben und den Kopf als Bezug gleichzeitig siehst.',
      frage: 'Warum ist die Ansicht von hinten dafür ungeeignet?',
      o: ['Die Bewegung nach oben ist von hinten kaum einzuschätzen', 'Hinten ist das Licht schlechter', 'Hinten gibt es keine Strähnen'], r: 0,
      ja: 'Richtig. Du brauchst den Blick von der Seite.',
      nein: 'Nicht ganz. Von hinten siehst du kaum, wie weit die Strähne nach oben geht. Dafür brauchst du den Blick von der Seite.'
    },
    'sw12': {
      zu: 'Wie wird ein stumpfer Pony geschnitten',
      bild: 'Ein stumpfer Pony hat eine klare, harte Kante. Jede Anhebung beim Schneiden erzeugt Stufung, die diese Kante weicher macht. Praxis: Den Pony trocken nachkontrollieren, weil er nach dem Trocknen kürzer fällt.',
      frage: 'Was passiert mit der Kante, wenn du einen Pony beim Schneiden anhebst?',
      o: ['Sie wird weicher, es entsteht Stufung', 'Sie wird härter', 'Nichts'], r: 0,
      ja: 'Richtig. Für eine harte Kante bleibt der Pony im natürlichen Fall.',
      nein: 'Nicht ganz. Anheben erzeugt Stufung und macht die Kante weicher. Für eine harte Kante bleibt der Pony im natürlichen Fall.'
    },
    'sw13': {
      zu: 'Wo ist ein Curtain-Pony am kürzesten',
      bild: '„Curtain“ ist das englische Wort für Vorhang. Der Pony ist in der Mitte geteilt, fällt zu beiden Seiten und umrahmt das Gesicht bis etwa zu den Wangenknochen.',
      frage: 'Wohin fällt ein Curtain-Pony?',
      o: ['Von der Mitte zu beiden Seiten', 'Gerade nach vorne in die Stirn', 'Ganz nach hinten'], r: 0,
      ja: 'Richtig. Wo ist er dann am kürzesten?',
      nein: 'Nicht ganz. Der Curtain-Pony ist in der Mitte geteilt und fällt zu beiden Seiten.'
    },
    'sw14': {
      zu: 'Was passiert, wenn der Kopf beim Schneiden seitlich geneigt ist',
      bild: 'Beim Schneiden einer Linie ist die Kopfhaltung der Bezug. Neigt die Kundin den Kopf zur Seite und du schneidest waagrecht, verschiebt sich die Linie, sobald der Kopf wieder gerade ist. Praxis: Kopf gerade ausrichten, die Kundin bitten, die Beine nicht übereinanderzuschlagen, und die Linie im Spiegel kontrollieren.',
      frage: 'Was tust du, bevor du eine gerade Linie schneidest?',
      o: ['Die Kopfhaltung gerade ausrichten', 'Schneller schneiden', 'Die Kundin zur Seite drehen'], r: 0,
      ja: 'Richtig. Sonst ist eine Seite kürzer, sobald der Kopf wieder gerade ist.',
      nein: 'Nicht ganz. Zuerst richtest du die Kopfhaltung gerade aus. Sonst wird die Linie schief.'
    },
    'sw15': {
      zu: 'Wie wird bei der graduierten Form im Nacken abgeteilt',
      bild: 'Der Hinterkopf ist stark gerundet. Die Abteilungen sollen sich dieser Rundung anpassen, damit die Graduierung im Nacken gleichmäßig aufgebaut werden kann.',
      frage: 'Was ist am Hinterkopf beim Abteilen besonders zu beachten?',
      o: ['Die starke Rundung', 'Dass dort kein Haar wächst', 'Dass er ganz flach ist'], r: 0,
      ja: 'Richtig. Die Abteilungen müssen dieser Rundung folgen. Welche Abteilung tut das?',
      nein: 'Nicht ganz. Der Hinterkopf ist stark gerundet. Die Abteilungen müssen sich daran anpassen.'
    }
  };
  // Gleiche Frage in einem anderen Lehrjahr: derselbe Eintrag
  T['1-n11'] = T['1-mc5'];
  T['2-mc12'] = T['1-n12'];
  T['2-mc7'] = T['1-12'];
  T['1-mc34'] = T['1-5'];
  T['1-mc11'] = T['1-18'];
  T['3-mc9'] = T['3-5'];
  T['2-mc14'] = T['2-1'];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function wZeile(text) {
    if (window.WOERNI && WOERNI.text) return WOERNI.text(text, 'nachdenklich', true);
    return '<div style="font-size:13px;color:#4A443A;line-height:1.5;margin-bottom:10px"><b style="color:#896C32">Wörni:</b> ' + esc(text) + '</div>';
  }

  // Aussehen je Seite: nur Klassen und Farben, die es dort schon gibt.
  // Lernquiz: Link-Knopf wie „Einfacher erklärt“, Antwortfelder .opt/.ric/.fal.
  var STIL_QUIZ = { knopf: 'pt-edit-k', opt: 'opt', ric: 'ric', fal: 'fal', text: '#2C2C2C', leise: '#6B6560', klein: '#9A9188', linie: '#0001', mitte: true };

  window.WOERNI_LEITUNG = {
    texte: T,
    // frage: Fragetext (optional). Steht im Eintrag „zu“, muss die Frage damit
    // beginnen (Schnittwerkstatt: Fragen ohne feste id, Schlüssel nach Reihenfolge).
    hat: function (id, frage) {
      var t = id && T[id];
      if (!t) return false;
      return !t.zu || (frage != null && String(frage).indexOf(t.zu) === 0);
    },
    // Knopf + Hilfe-Kasten. beiHilfe() wird aufgerufen, sobald die Hilfe
    // geöffnet wird (Seite wertet die Frage dann wie geraten). stil: siehe STIL_QUIZ.
    knopf: function (id, beiHilfe, stil) {
      var t = T[id];
      if (!t) return null;
      var st = stil || STIL_QUIZ;
      var box = document.createElement('div');
      box.className = 'ls-box';
      box.style.cssText = (st.mitte ? 'text-align:center;' : '') + 'margin-top:4px';
      var b = document.createElement('button');
      b.type = 'button'; b.className = st.knopf;
      b.textContent = 'Wörni, ich steh auf der Leitung';
      b.addEventListener('click', function () {
        if (beiHilfe) beiHilfe();
        box.style.cssText = 'text-align:left;margin-top:10px;padding-top:10px;border-top:1px solid ' + st.linie + ';display:grid;gap:6px';
        box.innerHTML = wZeile(t.bild) +
          '<div style="font-size:13px;font-weight:600;color:' + st.text + ';margin:4px 0 2px">' + esc(t.frage) + '</div>';
        var fb = document.createElement('div');
        fb.style.cssText = 'font-size:13px;color:' + st.text + ';line-height:1.5';
        var knoepfe = [];
        t.o.forEach(function (txt, i) {
          var ob = document.createElement('button');
          ob.type = 'button'; ob.className = st.opt; ob.textContent = txt;
          ob.addEventListener('click', function () {
            knoepfe.forEach(function (x) {
              x.disabled = true;
              if (x === ob) x.className = (st.opt ? st.opt + ' ' : '') + (i === t.r ? st.ric : st.fal);
            });
            fb.textContent = i === t.r ? t.ja : t.nein;
            var w = document.createElement('div');
            w.style.cssText = 'font-size:12px;color:' + st.leise + ';margin-top:6px';
            w.textContent = '➜ Jetzt probier die Frage oben selbst.';
            fb.appendChild(w);
          });
          knoepfe.push(ob);
          box.appendChild(ob);
        });
        box.appendChild(fb);
        var h = document.createElement('div');
        h.style.cssText = 'font-size:11px;color:' + st.klein + ';line-height:1.45';
        h.textContent = st.hinweis || 'Mit Hilfe zählt die Frage wie geraten und kommt in die Wiederholung. Dann schaffst du sie das nächste Mal allein.';
        box.appendChild(h);
      });
      box.appendChild(b);
      return box;
    }
  };
})();
