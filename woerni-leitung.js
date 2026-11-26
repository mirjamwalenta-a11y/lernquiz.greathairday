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
//  Überarbeitet: Farbe & Blondierung, Haarkunde, Hautkunde. Die übrigen Themen folgen.
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
      bild: 'Denk an Legosteine: Willst du ein Haus umbauen, musst du die Steine zuerst auseinandernehmen. Im Haar halten feste Schwefelbrücken die Form zusammen, wie die Noppen die Legosteine. Bevor das Haar eine neue Form bekommt, muss mit diesen Brücken zuerst etwas passieren.',
      frage: 'Was muss zuerst passieren, damit glattes Haar die Form des Wicklers annehmen kann?',
      o: ['Die festen Verbindungen im Haar müssen gelöst werden', 'Das Haar muss gefärbt werden', 'Das Haar muss ganz trocken sein'], r: 0,
      ja: 'Richtig. Genau das ist die Aufgabe des Wellemittels. Das Festmachen in der neuen Form kommt erst danach.',
      nein: 'Nicht ganz. Solange die festen Verbindungen halten, springt das Haar in seine alte Form zurück. Sie müssen zuerst gelöst werden.'
    },
    '2-mc8': {
      bild: 'Bleib bei den Legosteinen: Das Wellemittel hat das Haus auseinandergenommen, der Wickler gibt die neue Form vor. Jetzt muss jemand die Steine in der neuen Form wieder fest zusammendrücken, sonst fällt alles zusammen.',
      frage: 'Was passiert, wenn du nach dem Wellemittel den Fixierer weglässt?',
      o: ['Die Welle hält nicht und das Haar bleibt geschwächt', 'Die Welle wird besonders stark', 'Nichts, der Fixierer ist nur Pflege'], r: 0,
      ja: 'Genau. Der Fixierer ist der, der die Verbindungen in der neuen Form wieder schließt.',
      nein: 'Nicht ganz. Ohne Fixierer bleiben die gelösten Verbindungen offen: Die Welle hält nicht, und das Haar ist geschwächt.'
    },
    '2-mc9': {
      bild: 'Am Samstag einen Marathon laufen und am Sonntag gleich noch einen? Auch ein trainierter Körper braucht dazwischen Pause. Farbe und Dauerwelle sind beide chemische Behandlungen, die das Haar stark fordern.',
      frage: 'Was haben Coloration und Dauerwelle gemeinsam?',
      o: ['Beide sind chemische Behandlungen, die das Haar belasten', 'Beide sind reine Pflege', 'Beide wirken nur außen auf der Schuppenschicht'], r: 0,
      ja: 'Genau. Zwei solche Belastungen direkt hintereinander sind zu viel für das Haar.',
      nein: 'Nicht ganz. Beide arbeiten mit Chemie im Inneren des Haares. Zwei davon direkt hintereinander belasten es doppelt.'
    },
    '2-mc10': {
      bild: 'Ein Rezept hat immer mehrere Zutaten: Ein dünner Wickler macht kleine, feste Locken, ein dicker nur Schwung. Aber auch das Mittel, wie lange es wirkt und welches Haar du vor dir hast, spielen mit.',
      frage: 'Gleiche Wickler, gleiches Mittel, aber einmal feines und einmal sehr grobes Haar. Wird die Welle gleich?',
      o: ['Nein, die Haarstruktur macht einen Unterschied', 'Ja, immer genau gleich', 'Nur wenn die Kundin es will'], r: 0,
      ja: 'Richtig. Es zählt also nicht nur eine Sache. Welche Antwort nennt alle Zutaten?',
      nein: 'Nicht ganz. Feines und grobes Haar reagieren unterschiedlich auf dasselbe Mittel. Es zählen also mehrere Dinge zusammen.'
    },
    '3-mc7': {
      bild: 'Erinnerst du dich an den Tannenzapfen? Alkalisch öffnet die Schuppen weit: Das Mittel kommt schnell und kräftig hinein. Sauer öffnet kaum: Es geht langsamer, dafür schonender. Merksatz: „Alkalisch – A wie Action, sauer – S wie sanft.“',
      frage: 'Eine Kundin hat gefärbtes, empfindliches Haar und will eine Dauerwelle. Was ist dir am wichtigsten?',
      o: ['Dass es möglichst schonend ist', 'Dass es möglichst schnell geht', 'Dass die Welle möglichst stark wird'], r: 0,
      ja: 'Genau. Für empfindliches Haar wählst du die sanfte Variante. Welche war „S wie sanft“?',
      nein: 'Nicht ganz. Gefärbtes Haar ist schon belastet. Wichtig ist, es zu schonen, auch wenn es dann etwas länger dauert.'
    },
    // ── Hygiene & Schutzmaßnahmen ────────────────────────────────────────
    '1-1': {
      bild: 'Denk an deine Küche: Zuerst wischst du die Krümel weg, dann sprühst du gegen Keime. Ganz keimfrei wie im Operationssaal wird es nur mit Spezialgeräten. Drei Stufen, jede stärker als die vorige.',
      frage: 'Was kommt immer zuerst, bevor du gegen Keime vorgehst?',
      o: ['Sichtbaren Schmutz und Haare entfernen', 'Gleich das Desinfektionsmittel aufsprühen', 'Das Werkzeug sterilisieren'], r: 0,
      ja: 'Genau, zuerst reinigen. Auf Schmutz wirkt Desinfektionsmittel schlecht. Wie heißen die zwei stärkeren Stufen danach?',
      nein: 'Nicht ganz. Auf Haaren und Schmutz kann Desinfektionsmittel nicht richtig wirken. Darum kommt immer zuerst das Reinigen.'
    },
    '1-15': {
      bild: 'Desinfektionsmittel ist wie Sonnencreme: Es schützt nur, wenn es lange genug drauf ist. Sprühen und sofort abwischen ist, als würdest du die Creme gleich wieder abwischen.',
      frage: 'Was passiert, wenn du Desinfektionsmittel sofort wieder abwischst?',
      o: ['Es hat keine Zeit zu wirken', 'Es wirkt dann besonders stark', 'Das Werkzeug wird steril'], r: 0,
      ja: 'Richtig. Es braucht eine Einwirkzeit, also eine Mindestzeit. Die genaue Zeit steht auf dem Produkt.',
      nein: 'Nicht ganz. Desinfektionsmittel braucht Zeit, um die Keime abzutöten. Wer gleich abwischt, hat umsonst gesprüht.'
    },
    '1-mc23': {
      bild: 'Stell dir einen Fußballplatz voller Keime vor. Desinfizieren heißt: fast alle vom Platz schicken, so viele, dass keine Gefahr mehr besteht. Sterilisieren heißt: wirklich jeder ist weg, auch der Letzte.',
      frage: 'Welche Stufe macht ein Werkzeug wirklich ganz keimfrei?',
      o: ['Sterilisieren', 'Desinfizieren', 'Reinigen'], r: 0,
      ja: 'Genau. Desinfizieren ist eine Stufe darunter: nicht alle Keime, aber so viele, dass es unbedenklich ist.',
      nein: 'Nicht ganz. Ganz keimfrei wird es nur beim Sterilisieren. Desinfizieren schafft das nicht ganz, es macht die Keime aber stark weniger.'
    },
    '2-13': {
      bild: 'Deine Hände sind wie eine Brücke zwischen den Kundinnen: Alles, was an ihnen klebt, wandert mit zur nächsten. Die Brücke muss also immer dann sauber sein, wenn jemand Neues sie betritt.',
      frage: 'Du hast gerade fertig geschnitten, die nächste Kundin wartet schon. Was gehört dazwischen?',
      o: ['Hände desinfizieren', 'Nichts, die Hände waren ja nur im Haar', 'Nur das Handy weglegen'], r: 0,
      ja: 'Richtig. Vor und nach jeder Kundin, und immer dann, wenn etwas schmutzig geworden ist.',
      nein: 'Nicht ganz. Auch im Haar und auf der Kopfhaut sind Keime. Damit sie nicht zur nächsten Kundin wandern, desinfizierst du dazwischen die Hände.'
    },
    '2-mc17': {
      bild: 'Würdest du dich mit einem Handtuch abtrocknen, das gerade jemand Fremdes benutzt hat? Deine Kundin auch nicht. Ein Handtuch berührt Haut und Haar direkt und nimmt Hautschüppchen, Feuchtigkeit und Keime auf.',
      frage: 'Ein Handtuch sieht nach einer Kundin noch sauber aus. Ist es auch keimfrei?',
      o: ['Nein, Keime sieht man nicht', 'Ja, sauber aussehen reicht', 'Nur, wenn es weiß ist'], r: 0,
      ja: 'Genau. Darum zählt nicht, wie es aussieht, sondern ob schon jemand anderer es benutzt hat.',
      nein: 'Nicht ganz. Keime sind unsichtbar. Ein Handtuch, das eine Kundin berührt hat, ist für die nächste nicht mehr sauber.'
    },
    '1-mc22': {
      bild: 'Denk an die Kollegin, die abends den Müll ausleert: Eine Klinge in Papier oder im offenen Becher sticht durch den Sack direkt in ihre Hand. Alles Spitze und Scharfe gehört deshalb in einen Behälter, durch den nichts durchkommt.',
      frage: 'Was muss ein Behälter für gebrauchte Klingen vor allem können?',
      o: ['Er darf sich nicht durchstechen lassen', 'Er muss schön aussehen', 'Er muss offen sein, damit es schnell geht'], r: 0,
      ja: 'Richtig. So einen Behälter nennt man stichfest.',
      nein: 'Nicht ganz. Es geht um Sicherheit: Die Klinge darf niemanden verletzen, auch nicht beim Ausleeren. Der Behälter muss also fest und geschlossen sein.'
    },
    '2-1': {
      bild: 'Zerleg das Wort: „Kontakt“ heißt Berührung, „Derma“ heißt Haut. Fehlt noch die Endung. Friseurhände sind fast den ganzen Tag nass und berühren Farbe, Shampoo und Handschuhe.',
      frage: 'Was bedeutet die Endung „-itis“, wie bei Bronchitis oder Mandelentzündung (Tonsillitis)?',
      o: ['Entzündung', 'Allergie gegen Haare', 'Haarausfall'], r: 0,
      ja: 'Genau. Setz die drei Teile zusammen: Berührung, Haut, Entzündung.',
      nein: 'Nicht ganz. „-itis“ heißt immer Entzündung, wie bei Bronchitis. Setz die drei Teile zusammen: Berührung, Haut, Entzündung.'
    },
    '3-mc10': {
      bild: 'Lies das Wort wie ein Etikett: „viruzid“ heißt: wirkt gegen Viren. „Begrenzt“ heißt: nicht gegen alle, aber gegen viele. Das „plus“ legt noch ein paar wichtige, hartnäckige Viren drauf. Gegen Bakterien und Pilze wirkt ein gutes Salon-Desinfektionsmittel ohnehin.',
      frage: 'Was heißt „viruzid“?',
      o: ['Wirkt gegen Viren', 'Wirkt nur gegen Pilze', 'Ist besonders hautschonend'], r: 0,
      ja: 'Richtig. Zusammen mit Bakterien und Pilzen ergibt das genau den Schutz, den ein Salon braucht. Gegen wirklich alles, auch Sporen, wirkt es aber nicht.',
      nein: 'Nicht ganz. „Viren“ steckt schon im Wort: viruzid heißt, es wirkt gegen Viren.'
    },
    '2-mc18': {
      bild: 'Die Gefahrensymbole sind Bildersprache: Ein Totenkopf heißt Gift, ein toter Baum mit Fisch heißt Gefahr für die Umwelt. Bei der Flamme kannst du es selbst ablesen. Im Salon findest du sie oft auf Haarspray.',
      frage: 'Neben was solltest du ein Produkt mit Flammen-Symbol nie sprühen?',
      o: ['Neben dem heißen Glätteisen oder einer Kerze', 'Neben dem Waschbecken', 'Neben dem Spiegel'], r: 0,
      ja: 'Genau. Was nicht neben Hitze und Feuer darf, kann selbst schnell Feuer fangen.',
      nein: 'Nicht ganz. Eine Flamme warnt vor Feuer. Gefährlich wird es also neben Hitze oder offenem Feuer.'
    },

    // ── Werkzeugkunde: Schere ────────────────────────────────────────────
    '1-5': {
      bild: 'Denk an einen Kamm und ein Lineal: Mit dem Lineal ziehst du eine durchgehende Kante, der Kamm lässt Lücken. Eine Schere mit Zähnen schneidet nur die Haare zwischen den Zähnen ab, die anderen bleiben lang. So wird es weniger, aber man sieht keine Kante.',
      frage: 'Eine Schere hat auf einer Klinge kleine Zähne. Schneidet sie alle Haare der Strähne ab?',
      o: ['Nein, nur einen Teil, das dünnt aus', 'Ja, alle gleichmäßig', 'Nein, sie schneidet gar nicht'], r: 0,
      ja: 'Richtig. Weniger Haar, aber keine sichtbare Schnittlinie: Genau das nennt man ausdünnen.',
      nein: 'Nicht ganz. Die Zähne lassen einen Teil der Haare durch. Nur die übrigen werden abgeschnitten, so wird die Strähne dünner.'
    },
    '1-mc35': {
      bild: 'Eine Profischere ist wie ein gutes Kochmesser: Sie hält viele Jahre, wenn du sie pflegst. Ihr größter Feind sitzt unsichtbar im Gelenk.',
      frage: 'Was schadet einer Schere am meisten?',
      o: ['Feuchtigkeit, die im Gelenk bleibt', 'Ein Tropfen Öl', 'Ein weiches Tuch'], r: 0,
      ja: 'Genau. Darum gehören nach dem Reinigen Abtrocknen und Ölen dazu.',
      nein: 'Nicht ganz. Öl und ein weiches Tuch pflegen die Schere. Schaden macht Feuchtigkeit, die im Gelenk bleibt und rosten lässt.'
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
      bild: 'Denk an Eltern, die ein Babyfläschchen testen: Sie tropfen die Milch nicht auf die Fingerspitzen. Unsere Hände sind durch Arbeit und Wasser abgehärtet und spüren Hitze schlechter als die Kopfhaut.',
      frage: 'Wo spürst du Hitze ehrlicher: an den abgehärteten Händen oder an der dünnen Haut innen am Unterarm?',
      o: ['An der dünnen Haut innen am Unterarm', 'An den Händen', 'Überall gleich'], r: 0,
      ja: 'Genau. Und danach fragst du trotzdem die Kundin, ob es angenehm ist.',
      nein: 'Nicht ganz. Die Hände sind abgehärtet. Die dünne Haut innen am Unterarm oder am Handgelenk reagiert ähnlich empfindlich wie die Kopfhaut.'
    },
    '1-hw2': {
      bild: 'Denk an ein Bad, in dem du dich richtig wohlfühlst: Das Wasser ist ungefähr so warm wie dein Körper. Zu heißes Wasser reizt die Kopfhaut, die Talgdrüsen arbeiten mehr, und Farbe blutet aus.',
      frage: 'Wie warm ist dein Körper ungefähr?',
      o: ['Etwa 37 °C', 'Etwa 25 °C', 'Etwa 45 °C'], r: 0,
      ja: 'Richtig. Das Wasser für die Haarwäsche ist ungefähr gleich warm, also lauwarm.',
      nein: 'Nicht ganz. Der Körper hat etwa 37 °C. Ungefähr so warm soll auch das Wasser sein.'
    },
    '1-hw3': {
      bild: 'Erinnerst du dich an den Tannenzapfen? Wärme öffnet seine Schuppen, Kälte schließt sie. Bei der Haarwäsche nutzt du das ganz am Ende.',
      frage: 'Was glänzt mehr: ein glatter Spiegel oder ein zerknülltes Papier?',
      o: ['Der glatte Spiegel', 'Das zerknüllte Papier', 'Beide gleich'], r: 0,
      ja: 'Genau. Glatt anliegende Schuppen glänzen wie ein Spiegel. Und was lässt die Schuppen anliegen: warm oder kühl?',
      nein: 'Nicht ganz. Eine glatte Fläche spiegelt das Licht, eine raue streut es. Glatt anliegende Schuppen glänzen also.'
    },
    '1-hw4': {
      bild: 'Denk an eine Gesichtsbehandlung bei der Kosmetikerin: Dort massiert niemand mit den Fingernägeln. Die Kopfhaut ist genauso empfindlich wie die Haut im Gesicht, und die Kundin soll sich bei dir wohl und sicher fühlen.',
      frage: 'Was passiert, wenn du die Kopfhaut mit den Nägeln bearbeitest?',
      o: ['Sie kann gereizt und verletzt werden', 'Das Haar glänzt mehr', 'Das Shampoo schäumt mehr'], r: 0,
      ja: 'Richtig. Darum nimmst du den weichen, runden Teil vorne an den Fingern.',
      nein: 'Nicht ganz. Nägel kratzen und können die Kopfhaut verletzen. Du brauchst den weichen Teil der Finger.'
    },
    '1-hw7': {
      bild: 'Denk an eine alte Jeans: Am Bund ist sie fast wie neu, unten am Saum ausgefranst. Beim Haar ist es genauso: Am Ansatz ist es jung, die Spitzen sind schon Monate oder Jahre alt.',
      frage: 'Was passiert, wenn du eine Kur auf die Kopfhaut gibst?',
      o: ['Der Ansatz wird schwer und fettet schneller', 'Die Haare wachsen schneller', 'Gar nichts'], r: 0,
      ja: 'Genau. Pflege gehört dorthin, wo das Haar schon alt und strapaziert ist.',
      nein: 'Nicht ganz. Auf der Kopfhaut beschwert Pflege und fettet nach. Sie gehört dorthin, wo das Haar alt und strapaziert ist.'
    },
    '1-hw8': {
      bild: 'Eine Massage tut nur gut, wenn die Kopfhaut gesund ist. Bevor du anfängst, schaust du kurz hin: Ist alles in Ordnung?',
      frage: 'Was kann passieren, wenn du über eine offene oder entzündete Stelle massierst?',
      o: ['Es tut weh, und Keime können hineinkommen', 'Die Stelle heilt schneller', 'Nichts'], r: 0,
      ja: 'Richtig. An solchen Stellen wird nicht massiert.',
      nein: 'Nicht ganz. Druck auf eine offene oder entzündete Stelle tut weh und kann Keime hineinbringen. Dort wird nicht massiert.'
    },
    '1-hw9': {
      bild: 'Denk an einen Wollpullover: Rubbelst du ihn nass, verfilzt er. Nasses Haar ist gequollen, und seine Schuppen stehen leicht ab.',
      frage: 'Was passiert mit abstehenden Schuppen, wenn du reibst?',
      o: ['Sie werden aufgeraut', 'Sie legen sich glatt an', 'Sie fallen ab und wachsen nach'], r: 0,
      ja: 'Genau. Darum drückst du das Haar sanft aus und wickelst einen Turban.',
      nein: 'Nicht ganz. Reibung raut die abstehenden Schuppen auf. Das Haar wird stumpf und kann brechen.'
    },
    '1-hw15': {
      bild: 'Denk an einen Feierabend: Schuhe aus und locker werden, aufs Sofa und entspannen, tief durchatmen und zur Mitte finden, und dann Ruhe. Genau so ist die Entspannungshaarwäsche aufgebaut.',
      frage: 'Womit endet eine Entspannungshaarwäsche für die Kundin?',
      o: ['Mit Ruhe', 'Mit kräftigem Klopfen', 'Mit kaltem Wasser'], r: 0,
      ja: 'Genau. Davor kommen Lockern, Entspannen und Ausgleichen. Welche Antwort klingt wie dieser Feierabend?',
      nein: 'Nicht ganz. Eine Entspannungswäsche endet ruhig, nicht anregend. Davor kommen Lockern, Entspannen und Ausgleichen.'
    },
    'b-10': {
      bild: 'Denk an fettiges Geschirr: Im ersten Spülgang löst sich das gröbste Fett, und das Wasser wird trüb. Erst beim zweiten Mal wird es richtig sauber. Beim Haar schäumt das erste Shampoo oft kaum, weil es mit Fett und Styling beschäftigt ist.',
      frage: 'Warum schäumt das Shampoo bei der ersten Wäsche oft wenig?',
      o: ['Weil es erst Fett und Styling lösen muss', 'Weil das Wasser zu kalt ist', 'Weil zu viel Shampoo drin ist'], r: 0,
      ja: 'Richtig. Die erste Wäsche löst, die zweite reinigt richtig. Wie oft wird also grundsätzlich gewaschen?',
      nein: 'Nicht ganz. Das erste Shampoo kämpft mit Fett und Styling. Erst beim zweiten Mal wird es richtig sauber.'
    },

    // ── Schnittwerkstatt (schnittwerkstatt.html, Wissens-Check) ───────────
    // Die Fragen dort haben keine id: Schlüssel sw1–sw15 = Reihenfolge im QUIZ,
    // „zu“ = Anfang des Fragetexts. Passt der Text nicht, zeigt die Seite keinen Knopf.
    'sw1': {
      zu: 'Welcher Erhebungswinkel ergibt eine kompakte Form',
      bild: 'Denk an einen Vorhang: Lässt du ihn hängen, fällt er glatt bis zu einer geraden Kante. Eine kompakte Form ist wie dieser Vorhang: eine ruhige, geschlossene Kontur ohne Stufen.',
      frage: 'Was passiert mit den Haarlängen, je höher du die Strähnen beim Schneiden anhebst?',
      o: ['Es entstehen mehr Stufen', 'Alles wird gleich lang', 'Nichts ändert sich'], r: 0,
      ja: 'Genau. Kompakt heißt keine Stufen, also: gar nicht anheben.',
      nein: 'Nicht ganz. Je höher du anhebst, desto mehr Stufen entstehen. Für eine kompakte Form ohne Stufen hebst du also nicht an.'
    },
    'sw2': {
      zu: 'Wie wird bei der gleichmäßig stufigen Form gehalten',
      bild: 'Stell dir einen Igel vor: Alle Stacheln stehen gleich lang von seinem runden Rücken ab. Bei der gleichmäßig stufigen Form sollen alle Haare gleich lang werden, egal wo am runden Kopf.',
      frage: 'Der Kopf ist rund. Hältst du jede Strähne im gleichen Winkel zum Boden, werden die Längen dann überall gleich?',
      o: ['Nein, wegen der Rundung nicht', 'Ja, immer', 'Nur im Nacken'], r: 0,
      ja: 'Richtig. Gleich lang wird es nur, wenn du dich an der Rundung des Kopfes orientierst, nicht am Boden.',
      nein: 'Nicht ganz. Der Boden ist flach, der Kopf ist rund. Gleich lang wird es nur, wenn du dich an der Kopfrundung orientierst.'
    },
    'sw3': {
      zu: 'Wo sitzt bei der graduierten Form das Gewicht',
      bild: 'Denk an Dachziegel: Sie liegen übereinander gestapelt, und dort, wo sie aufeinanderliegen, wird das Dach dicker. Bei der graduierten Form stapeln sich die Haarenden genauso und bilden eine sichtbare Kante.',
      frage: 'Bei der graduierten Form sind die Haare unten kurz und werden nach oben länger. Wo stapeln sich die Enden?',
      o: ['Etwas oberhalb der unteren Kontur', 'Ganz oben am Oberkopf', 'Nirgends, sie verteilen sich gleichmäßig'], r: 0,
      ja: 'Genau. Diese gestapelte Kante nennt man Gewichtslinie.',
      nein: 'Nicht ganz. Die Enden stapeln sich dort, wo die kurzen unteren und die längeren oberen Haare zusammentreffen: knapp über der Kontur.'
    },
    'sw4': {
      zu: 'Wo liegt bei der ansteigenden Form',
      bild: 'Denk an eine Rampe: Sie beginnt niedrig und steigt dann an. Bei der ansteigenden Form wird das Haar im Profil von vorne nach hinten länger, bis zum höchsten Punkt des Kopfes.',
      frage: 'Eine Rampe steigt an. Wo ist sie am niedrigsten?',
      o: ['Am Anfang', 'In der Mitte', 'Am Ende'], r: 0,
      ja: 'Genau. Und im Profil fängt die Rampe vorne an. Wo ist vorne am Kopf?',
      nein: 'Nicht ganz. Eine Rampe ist am Anfang am niedrigsten. Im Profil fängt sie vorne am Kopf an.'
    },
    'sw5': {
      zu: 'In welchem Bereich liegt eine mittlere Graduierung',
      bild: 'Eselsbrücke: Teil die 90° in drei gleich große Stücke. Das erste Stück ist niedrig, das zweite mittel, das dritte hoch.',
      frage: 'Wie groß ist jedes der drei Stücke, wenn du 90° durch 3 teilst?',
      o: ['30°', '45°', '60°'], r: 0,
      ja: 'Richtig. Das mittlere Stück liegt also zwischen 30 und 60 Grad.',
      nein: 'Nicht ganz: 90 durch 3 sind 30. Das erste Stück geht bis 30°, das mittlere bis 60°.'
    },
    'sw6': {
      zu: 'Was bedeutet „wandernde Leitsträhne“',
      bild: 'Denk an einen Staffellauf: Jede Läuferin übernimmt den Stab von der vorigen und läuft ein Stück weiter. Bei der wandernden Leitsträhne nimmst du von der vorigen Abteilung ein Stück mit als Längenvorgabe.',
      frage: 'Wenn jede Abteilung ein Stück der vorigen mitnimmt: Woher kommt die Länge für die neue Abteilung?',
      o: ['Aus der Abteilung davor', 'Immer aus dem Nacken', 'Von einem festen Punkt am Oberkopf'], r: 0,
      ja: 'Genau. Die Leitsträhne wandert also mit. Alles zu einem festen Punkt zu führen, ist die feste Leitsträhne.',
      nein: 'Nicht ganz. Wie beim Staffellauf kommt die Vorgabe immer von der Abteilung direkt davor. Darum heißt sie „wandernd“.'
    },
    'sw7': {
      zu: 'Welche Oberflächenstruktur hat die kompakte Form',
      bild: 'Leg ein Buch flach hin: Von oben siehst du nur den glatten Deckel, keine einzelnen Seiten. Fächerst du die Seiten auf, siehst du alle Kanten. Die kompakte Form ist das geschlossene Buch.',
      frage: 'Bei der kompakten Form enden alle Haare auf einer Linie. Sieht man dann einzelne Spitzen an der Oberfläche?',
      o: ['Nein, die Oberfläche wirkt glatt', 'Ja, überall', 'Nur am Oberkopf'], r: 0,
      ja: 'Richtig. Für „glatt, ohne sichtbare Spitzen“ gibt es ein Fachwort: das Gegenteil von „aktiviert“.',
      nein: 'Nicht ganz. Wenn alle Enden auf einer Linie liegen, liegen die Spitzen darunter versteckt. Die Oberfläche wirkt glatt.'
    },
    'sw8': {
      zu: 'Was zeigen die Pfeile in einer Schnittzeichnung',
      bild: 'Eine Schnittzeichnung ist wie ein Navi: Die Pfeile sagen dir nicht, wo das Haar wächst, sondern wohin du die Strähne führen sollst und wie steil.',
      frage: 'Was zeigt dir ein Pfeil im Navi?',
      o: ['Wohin du fahren sollst', 'Wo du herkommst', 'Wie das Wetter wird'], r: 0,
      ja: 'Genau. In der Schnittzeichnung zeigt der Pfeil, wohin und in welchem Winkel du die Strähne hältst.',
      nein: 'Nicht ganz. Ein Navi-Pfeil zeigt die Richtung, in die du fahren sollst. In der Schnittzeichnung ist das die Richtung, in die du die Strähne hältst.'
    },
    'sw9': {
      zu: 'Warum sind bei der kompakten Form die inneren Haare länger',
      bild: 'Stell dir vor, mehrere Leute laufen von verschiedenen Stellen eines Hügels zur selben Ziellinie unten. Wer ganz oben startet, hat den längsten Weg. Beim Kopf ist es genauso: Vom Oberkopf über die Rundung bis zur Kontur ist es am weitesten.',
      frage: 'Wer hat den längsten Weg zur gemeinsamen Ziellinie unten am Hügel?',
      o: ['Wer ganz oben startet', 'Wer schon unten steht', 'Alle gleich'], r: 0,
      ja: 'Richtig. Darum müssen die Haare von oben länger sein, damit sie dieselbe Kontur erreichen.',
      nein: 'Nicht ganz. Von ganz oben ist der Weg am längsten. Haare vom Oberkopf brauchen also mehr Länge bis zur Kontur.'
    },
    'sw10': {
      zu: 'Welche Abteilungen passen gut zur gleichmäßig stufigen Form',
      bild: 'Denk an Tortenstücke: Von der Mitte aus geschnitten, folgt jedes Stück der Rundung. Für die gleichmäßig stufige Form brauchst du Abteilungen, die sich gut an den runden Kopf anpassen.',
      frage: 'Was sollen die Abteilungen bei der gleichmäßig stufigen Form leicht machen?',
      o: ['Die Strähne senkrecht zur Kopfrundung zu halten', 'Die Strähne flach an den Kopf zu legen', 'Alles zu einem Punkt zu ziehen'], r: 0,
      ja: 'Genau. Am besten geht das mit Abteilungen, die wie Tortenstücke von einem Punkt ausgehen, oder mit senkrechten.',
      nein: 'Nicht ganz. Gleichmäßige Stufen entstehen nur, wenn du senkrecht zur Kopfrundung hältst. Die Abteilungen sollen genau das leicht machen.'
    },
    'sw11': {
      zu: 'In welcher Ansicht misst du den Erhebungswinkel',
      bild: 'Wenn du sehen willst, wie hoch jemand springt, stellst du dich seitlich daneben und nicht dahinter. Von hinten siehst du nur den Rücken.',
      frage: 'Warum siehst du von hinten schlecht, wie hoch jemand springt?',
      o: ['Weil man die Höhe nur von der Seite gut einschätzen kann', 'Weil es hinten dunkler ist', 'Weil man von hinten gar nichts sieht'], r: 0,
      ja: 'Genau. Beim Erhebungswinkel ist es genauso: Du brauchst den Blick von der Seite.',
      nein: 'Nicht ganz. Von hinten verdeckt der Körper, wie hoch es geht. Die Höhe siehst du nur von der Seite gut.'
    },
    'sw12': {
      zu: 'Wie wird ein stumpfer Pony geschnitten',
      bild: 'Stumpf heißt wie bei einem Lineal: eine gerade, harte Kante. Damit die Kante gerade bleibt, wenn der Pony fällt, schneidest du ihn genau so, wie er von selbst fällt.',
      frage: 'Du hebst einen Pony an und schneidest. Was passiert, wenn er danach wieder fällt?',
      o: ['Er bekommt Stufen statt einer harten Kante', 'Er wird noch gerader', 'Nichts'], r: 0,
      ja: 'Richtig. Für eine harte, gerade Kante also nicht anheben, sondern natürlich fallen lassen.',
      nein: 'Nicht ganz. Was beim Schneiden angehoben war, fällt danach in Stufen. Für eine harte Kante bleibt der Pony im natürlichen Fall.'
    },
    'sw13': {
      zu: 'Wo ist ein Curtain-Pony am kürzesten',
      bild: 'Denk an einen Vorhang am Fenster, der in der Mitte offen ist: In der Mitte ist die Öffnung, zu den Seiten hängt der Stoff tiefer. Genau so sitzt ein Curtain-Pony.',
      frage: 'Was heißt „Curtain“ auf Deutsch?',
      o: ['Vorhang', 'Locke', 'Kante'], r: 0,
      ja: 'Genau. Und wo öffnet sich ein Vorhang, wo hängt er am längsten herunter?',
      nein: 'Nicht ganz. „Curtain“ heißt Vorhang. Überleg, wo sich ein Vorhang öffnet.'
    },
    'sw14': {
      zu: 'Was passiert, wenn der Kopf beim Schneiden seitlich geneigt ist',
      bild: 'Stell dir ein schief hängendes Bild vor: Ziehst du darauf eine Linie parallel zum Boden und hängst es dann gerade, ist die Linie schief. Neigt die Kundin den Kopf und du schneidest waagrecht, ist die Linie danach genauso schief.',
      frage: 'Was solltest du tun, bevor du eine gerade Linie schneidest?',
      o: ['Auf eine gerade Kopfhaltung achten', 'Schneller schneiden', 'Die Kundin zur Seite drehen'], r: 0,
      ja: 'Genau. Sonst wird die Linie schief, sobald der Kopf wieder gerade ist, und eine Seite ist kürzer.',
      nein: 'Nicht ganz. Ist der Kopf geneigt, wird die Linie schief. Deshalb zuerst auf eine gerade Kopfhaltung achten.'
    },
    'sw15': {
      zu: 'Wie wird bei der graduierten Form im Nacken abgeteilt',
      bild: 'Denk an die Speichen eines Fahrrads: Sie gehen alle von einem Punkt in der Mitte aus und passen sich der Rundung des Rads an.',
      frage: 'Was ist am Hinterkopf besonders?',
      o: ['Er ist stark gerundet', 'Er ist ganz flach', 'Dort wächst kein Haar'], r: 0,
      ja: 'Richtig. Abteilungen, die wie Speichen von einem Punkt ausstrahlen, folgen dieser Rundung am besten.',
      nein: 'Nicht ganz. Der Hinterkopf ist stark gerundet. Dort helfen Abteilungen, die wie Speichen von einem Punkt ausgehen.'
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
