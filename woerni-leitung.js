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
// Schlüssel = id der Frage in lernquiz.html (FB); Schnittwerkstatt: sw1–sw15.
// Felder: bild (Bild/Eselsbrücke), frage (Gegenfrage), o (2–3 Antworten),
//         r (Index der richtigen), ja (nach richtig), nein (nach falsch).
// Stand 2026-11-25: Lernquiz: Farbe & Blondierung (15), Haarkunde (9),
// Dauerwelle (5), Hygiene (9), Werkzeug/Schere (2); Schnittwerkstatt (15).
// Fachlich durch die Meisterin prüfen.
(function () {
  var T = {
    // ── Farbkreis & Gegenfarben ──────────────────────────────────────────
    '1-mc14': {
      bild: 'Stell dir den Farbkreis wie zwei gleich starke Leute beim Tauziehen vor. Wer sich genau gegenübersteht, hebt sich auf: Am Ende bewegt sich nichts, das Haar wirkt neutral. Typisch im Salon: Dunkles Haar wird aufgehellt und schaut danach orange aus.',
      frage: 'Orange ist eine Mischfarbe. Aus welchen zwei Grundfarben besteht es?',
      o: ['Rot und Gelb', 'Rot und Blau', 'Gelb und Blau'], r: 0,
      ja: 'Genau. Im Orange stecken schon Rot und Gelb. Die Grundfarbe, die darin fehlt, ist sein Gegenspieler.',
      nein: 'Nicht ganz. Orange ist warm wie ein Sonnenuntergang: Darin stecken Rot und Gelb. Welche Grundfarbe fehlt dann noch? Die ist sein Gegenspieler.'
    },
    '1-mc15': {
      bild: 'Eine Kundin kommt mit hellem Blond, das aussieht wie Stroh. Im Regal steht ein Shampoo genau gegen diesen Gelbstich. Merksatz: Die Gegenfarbe ist immer die Mischung aus den zwei anderen Grundfarben.',
      frage: 'Gelb ist eine Grundfarbe. Welche zwei Grundfarben bleiben übrig?',
      o: ['Rot und Blau', 'Gelb und Blau', 'Rot und Gelb'], r: 0,
      ja: 'Richtig. Und was ergeben Rot und Blau gemischt? Genau diese Farbe nimmt dem Blond das Gelb.',
      nein: 'Nicht ganz. Die drei Grundfarben sind Rot, Gelb und Blau. Nimm Gelb weg, dann bleiben Rot und Blau. Ihre Mischung ist die Gegenfarbe zu Gelb.'
    },
    '1-mc16': {
      bild: 'Make-up-Profis decken rote Äderchen im Gesicht nicht mit Hautfarbe ab, sondern mit einem Concealer in der Gegenfarbe von Rot. Im Haar ist es genauso: Gegen einen Rotstich hilft nicht „mehr Braun“, sondern die Gegenfarbe.',
      frage: 'Rot ist eine Grundfarbe. Welche zwei Grundfarben bleiben übrig?',
      o: ['Gelb und Blau', 'Orange und Violett', 'Rot und Gelb'], r: 0,
      ja: 'Genau. Gelb und Blau gemischt ergeben die Farbe, die Rot gegenüberliegt.',
      nein: 'Nicht ganz. Grundfarben sind nur Rot, Gelb und Blau. Ohne Rot bleiben Gelb und Blau. Was ergeben die beiden zusammen?'
    },

    // ── Oxidant / Wasserstoffperoxid ─────────────────────────────────────
    '1-mc19': {
      bild: 'Stell dir die Farbcreme als Auto vor und den Oxidant als Motor. Ohne Motor fährt nichts. Der Motor macht zwei Dinge auf einmal: Er hellt das eigene Pigment der Kundin ein Stück auf und lässt aus den farblosen Vorstufen im Haar die fertige Farbe entstehen.',
      frage: 'Was passiert, wenn du Oxidationsfarbe ganz ohne Oxidant aufträgst?',
      o: ['Fast nichts, die Farbe entwickelt sich nicht', 'Das Haar wird sofort viel heller', 'Die Farbe hält besonders lange'], r: 0,
      ja: 'Richtig. Erst der Oxidant bringt die Farbe in Gang, und dabei hellt er auch auf.',
      nein: 'Nicht ganz. Ohne Oxidant passiert in der Farbcreme fast nichts. Er ist der Teil, der arbeitet: aufhellen und Farbe entwickeln.'
    },
    '1-ft2': {
      bild: 'Denk an Laufen: 3 % ist ein Spaziergang, 12 % ein Sprint. Je höher die Zahl, desto mehr Aufhellung, und desto mehr wird das Haar beansprucht.',
      frage: 'Eine Kundin will ihre Haare eine Stufe dunkler färben. Braucht die Farbe dafür viel Aufhellkraft?',
      o: ['Nein, kaum oder gar keine', 'Ja, möglichst viel', 'Das hängt nur von der Haarlänge ab'], r: 0,
      ja: 'Genau. Wenig Aufhellung heißt: die kleinste Prozentzahl.',
      nein: 'Nicht ganz. Wer dunkler werden will, braucht keine Aufhellung. Also nimmst du die kleinste Prozentzahl.'
    },
    '1-ft3': {
      bild: 'Merk dir nur ein Paar: 3 % = 10 Vol. Alle anderen sind Vielfache davon: doppelt, dreifach, vierfach. So musst du keine Tabelle auswendig lernen.',
      frage: '6 % ist wie viel Mal so viel wie 3 %?',
      o: ['2-mal', '3-mal', '6-mal'], r: 0,
      ja: 'Richtig, doppelt so viel. Dann ist auch die Vol-Zahl doppelt so groß wie bei 3 %.',
      nein: 'Nicht ganz: 3 + 3 = 6, also 2-mal. Und wenn 3 % = 10 Vol sind, was ist dann das Doppelte?'
    },

    // ── Was Farbe kann und was nicht ─────────────────────────────────────
    '1-ft6': {
      bild: 'Stell dir getönte Sonnenbrillengläser vor: Legst du ein helles Glas auf ein dunkles, wird es nicht heller, nur noch dunkler. Haarfarbe legt sich wie ein weiteres Glas dazu. Das alte Glas muss erst weg.',
      frage: 'Was kann künstliche Farbpigmente aus dem Haar entfernen?',
      o: ['Blondierung oder Farbabzug', 'Eine hellere Haarfarbe', 'Eine längere Einwirkzeit'], r: 0,
      ja: 'Richtig. Nur die schaffen das. Eine Haarfarbe allein bekommt Farbe nicht heller.',
      nein: 'Nicht ganz. Haarfarbe legt nur dazu, sie nimmt nichts weg. Künstliche Pigmente bekommst du nur mit Blondierung oder Farbabzug heraus.'
    },
    '1-ft7': {
      bild: 'Die Schuppenschicht ist wie ein Tannenzapfen: Im kalten, nassen Wald ist er fest zu. Auf der warmen Heizung gehen seine Schuppen auf. Alkalische Mittel wie Ammoniak sind im Haar die „Heizung“. Saure Pflege legt die Schuppen danach wieder an.',
      frage: 'Die Farbe soll ins Innere des Haares (Cortex). Was muss sie dafür überwinden?',
      o: ['Die Schuppenschicht (Cuticula)', 'Die Kopfhaut', 'Das Mark (Medulla)'], r: 0,
      ja: 'Genau. Und das Alkalisierungsmittel ist der Teil, der diese Tür aufmacht.',
      nein: 'Nicht ganz. Die Schuppenschicht liegt außen wie ein Dach. Damit die Farbe nach innen kommt, muss jemand sie öffnen.'
    },

    // ── Auftragen ────────────────────────────────────────────────────────
    '1-ft4': {
      bild: 'Denk an einen Kuchen im Ofen: Was näher an der Hitze ist, ist schneller fertig. Der Ansatz liegt direkt an der warmen Kopfhaut. Dort „backt“ die Farbe schneller.',
      frage: 'Wo ist das Haar beim Färben am wärmsten?',
      o: ['Am Ansatz, nah an der Kopfhaut', 'In den Spitzen', 'Überall gleich warm'], r: 0,
      ja: 'Richtig. Was schneller reagiert, kommt später dran, damit am Ende alles gleich hell ist.',
      nein: 'Nicht ganz. Die Kopfhaut gibt Körperwärme ab, deshalb ist es am Ansatz am wärmsten. Und Wärme macht die Farbe schneller.'
    },
    '1-ft8': {
      bild: 'Stell dir vor, du bügelst ein Hemd und fährst immer wieder über dieselbe Stelle: Irgendwann ist der Stoff durch. Bereits blondiertes Haar hat seine „Bügelrunde“ schon hinter sich. Noch einmal drüber, und es bricht.',
      frage: 'Welches Haar braucht bei einer Ansatzblondierung wirklich Blondierung?',
      o: ['Nur das nachgewachsene, noch dunkle Haar', 'Das ganze Haar vom Ansatz bis zur Spitze', 'Nur die Spitzen'], r: 0,
      ja: 'Genau. Das schon Blondierte schützt du, also nicht überlappen.',
      nein: 'Nicht ganz. Die Längen sind schon hell, sie brauchen keine zweite Runde. Nur das Nachgewachsene ist noch dunkel.'
    },

    // ── Untergrund & Aufhellen ───────────────────────────────────────────
    '2-mc1': {
      bild: 'Aufhellen ist wie eine Treppe: Von Dunkelbraun geht es über Rot und Orange nach Gelb, ganz oben wird es hellgelb. Dunkles Haar steht noch weit unten auf der Treppe.',
      frage: 'Dunkles Haar wird zum ersten Mal aufgehellt. Ist es dann schon gelb?',
      o: ['Nein, zuerst kommen warme, rötliche Töne', 'Ja, sofort hellgelb', 'Es wird zuerst bläulich'], r: 0,
      ja: 'Genau. Beim Aufhellen zeigt dunkles Haar zuerst Rot und Orange. Bis Gelb ist es noch ein Stück.',
      nein: 'Nicht ganz. Dunkles Haar hat viel rotes Pigment. Das zeigt sich beim Aufhellen zuerst, Gelb kommt erst viel später.'
    },
    '2-wk2': {
      bild: 'Jedes Haar hat warme Pigmente im Untergrund, wie ein orangefarbener Teppich unter dem Sofa. Für einen warmen Farbton stört der Teppich kaum. Für einen kühlen Ton wie Asch oder Beige muss mehr davon weg, sonst scheint er durch.',
      frage: 'Was muss bei einem kühlen Wunschton stärker abgebaut werden?',
      o: ['Die warmen Naturpigmente im Untergrund', 'Die Schuppenschicht', 'Die kühlen Pigmente'], r: 0,
      ja: 'Richtig. Mehr abbauen heißt: weiter aufhellen als bei warmen Tönen. Für warm sind es ½ bis 1½ Tonhöhen, für kühl also etwas mehr.',
      nein: 'Nicht ganz. Kühle Töne vertragen keinen warmen Untergrund. Die warmen Pigmente müssen also weiter abgebaut werden als bei warmen Tönen.'
    },
    '3-vp1': {
      bild: 'Stell dir stark aufgehelltes Haar wie eine Wand ohne Grundierung vor: Streichst du dunkle Farbe direkt drauf, wird sie fleckig, grau oder grünlich. Die warmen Pigmente, die beim Aufhellen verloren gingen, musst du erst wieder „hineingrundieren“.',
      frage: 'Was fehlt hellem, aufgehelltem Haar, wenn es wieder viel dunkler werden soll?',
      o: ['Die warmen Pigmente (Rot, Orange, Gold)', 'Die Schuppenschicht', 'Kühle Asch-Pigmente'], r: 0,
      ja: 'Richtig. Bei einem großen Sprung nach dunkel fehlt viel davon. Dann bringst du sie zuerst zurück.',
      nein: 'Nicht ganz. Beim Aufhellen gehen die warmen Pigmente verloren. Genau die fehlen, wenn das Haar wieder dunkel werden soll.'
    },

    // ── Farbnummern ──────────────────────────────────────────────────────
    '2-mc2': {
      bild: 'Denk an ein Haus mit 10 Stockwerken: Im Keller (1) ist es schwarz, ganz oben (10) hellblond. Die erste Zahl sagt dir das Stockwerk. Erst nach dem Punkt kommt die „Wandfarbe“ im Zimmer.',
      frage: 'Welche Farbe ist heller: 5.0 oder 8.0?',
      o: ['8.0', '5.0', 'Beide gleich hell'], r: 0,
      ja: 'Richtig. Die größere erste Zahl ist heller. Die erste Zahl beschreibt also, wie hell oder dunkel die Farbe ist.',
      nein: 'Nicht ganz. Je höher das Stockwerk, desto heller: 8 ist weiter oben als 5.'
    },
    '2-mc3': {
      bild: 'Die Zahl vor dem Punkt ist das Stockwerk (wie hell), die Zahl danach ist die „Wandfarbe“ (welcher Farbton). Merksatz: „Eins ist Asche, drei ist Gold.“ Eine 7.3 auf der Farbkarte ist ein warmes, sonniges Mittelblond.',
      frage: 'Was steht vor dem Punkt, was danach?',
      o: ['Vorne die Helligkeit, danach der Farbton (Reflex)', 'Vorne die Einwirkzeit, danach der Oxidant', 'Beides beschreibt nur die Helligkeit'], r: 0,
      ja: 'Genau. Die Zahl nach dem Punkt ist also ein Farbton. Welcher war beim Merksatz die Drei?',
      nein: 'Nicht ganz. Vorne steht, wie hell die Farbe ist. Nach dem Punkt kommt der Farbton, also der Reflex.'
    },

    // ── Haarkunde: Aufbau ────────────────────────────────────────────────
    '1-7': {
      bild: 'Denk an einen Bleistift: Außen der dünne Lack, der schützt. Darunter das Holz, der dicke Hauptteil. Ganz innen die Mine. Ein Haar ist genauso gebaut: Schutzschicht außen, Rinde in der Mitte, Mark innen.',
      frage: 'Wie heißt die äußere Schutzschicht des Haares als Fachbegriff?',
      o: ['Cuticula', 'Cortex', 'Keratin'], r: 0,
      ja: 'Genau. Gefragt sind die drei Fachbegriffe von außen nach innen. Weißt du noch, wie Rinde und Mark heißen?',
      nein: 'Nicht ganz. Außen liegt die Cuticula, die Schuppenschicht. Cortex ist die Rinde darunter. Keratin ist keine Schicht, sondern der Stoff, aus dem das Haar besteht.'
    },
    '1-mc2': {
      bild: 'Die Schuppenschicht ist wie eine durchsichtige Frischhaltefolie um ein Stück Kuchen: Sie schützt, aber die Farbe siehst du vom Kuchen darunter. Die Farbpigmente sitzen also in der dicken Schicht unter den Schuppen.',
      frage: 'Wohin muss eine dauerhafte Haarfarbe, damit sie hält?',
      o: ['In die dicke Rinde unter der Schuppenschicht', 'Nur außen auf die Schuppenschicht', 'In die Kopfhaut'], r: 0,
      ja: 'Richtig. Dort sitzen auch die natürlichen Pigmente. Wie heißt diese Rinde als Fachbegriff?',
      nein: 'Nicht ganz. Außen auf den Schuppen liegen nur Tönungen, die sich auswaschen. Dauerhafte Farbe und die natürlichen Pigmente sitzen in der Rinde darunter.'
    },
    '1-mc5': {
      bild: 'Denk an einen nassen Wollpullover: Nass ziehst du ihn leicht in die Länge, und er bleibt ausgeleiert. Nasses Haar ist gequollen und seine Schuppen stehen offen. Darum kämmst du es mit grobem Kamm und von den Spitzen nach oben.',
      frage: 'Was passiert mit dem Haar, wenn es nass wird?',
      o: ['Es quillt auf und die Schuppen öffnen sich', 'Es wird härter und fester', 'Es verliert sofort seine Farbe'], r: 0,
      ja: 'Genau. Gequollenes Haar mit offenen Schuppen lässt sich leicht dehnen und schnell beschädigen.',
      nein: 'Nicht ganz. Wasser lässt das Haar aufquellen, die Schuppen öffnen sich. Dann ist es weich, dehnbar und empfindlich, nicht fester.'
    },
    '1-n12': {
      bild: 'Denk an zwei Schwämme: einen neuen, festen und einen alten, ausgefransten. Der alte saugt Wasser sofort auf, lässt es aber auch schnell wieder heraus. Poröses Haar ist wie der alte Schwamm, oft nach Blondierung oder viel Hitze.',
      frage: 'Ein Haar mit vielen offenen, beschädigten Schuppen: Was macht es mit Wasser?',
      o: ['Es saugt es schnell auf', 'Es lässt es ganz abperlen', 'Gar nichts, Haar nimmt kein Wasser auf'], r: 0,
      ja: 'Genau. Um genau dieses Aufnehmen von Feuchtigkeit und Wirkstoffen geht es bei der Frage.',
      nein: 'Nicht ganz. Offene Schuppen sind wie Löcher im Schwamm: Wasser und Wirkstoffe gehen schnell hinein und auch schnell wieder hinaus.'
    },

    // ── Haarkunde: Wachstum ──────────────────────────────────────────────
    '1-hk2': {
      bild: 'Eselsbrücke für die drei Phasen: Anagen, A wie Aufbau (das Haar wächst). Katagen, K wie Kündigung (es hört auf zu wachsen). Telogen, T wie Tschüss (Ruhe, dann fällt es aus).',
      frage: 'Ein Haar fällt beim Kämmen aus. War es zuletzt noch am Wachsen?',
      o: ['Nein, es war in der Ruhephase', 'Ja, mitten im Wachstum', 'Es war gerade erst entstanden'], r: 0,
      ja: 'Richtig. Die Ruhephase ist die letzte. Welcher Buchstabe war „Tschüss“?',
      nein: 'Nicht ganz. Ein Haar, das normal ausfällt, wächst schon länger nicht mehr. Es war in der letzten Phase, der Ruhephase.'
    },
    '1-mc7': {
      bild: 'Rechne mit: Haar wächst etwa 1 cm im Monat, also gut 12 cm im Jahr. Eine Kundin mit Haaren bis zur Mitte des Rückens hat etwa 60 cm. So lange muss ein Haar ohne Pause gewachsen sein.',
      frage: 'Bei etwa 12 cm pro Jahr: Wie lange braucht ein Haar für 60 cm?',
      o: ['Etwa 5 Jahre', 'Etwa 6 Monate', 'Etwa 15 Jahre'], r: 0,
      ja: 'Genau. Die Wachstumsphase muss also mehrere Jahre dauern. Welche Antwort passt dazu?',
      nein: 'Nicht ganz: 60 durch 12 sind 5, also etwa 5 Jahre. Die Wachstumsphase dauert demnach mehrere Jahre.'
    },

    // ── Haarkunde: Pigmente & Farbaufnahme ───────────────────────────────
    '1-hk4': {
      bild: 'Denk an eine Zwiebel mit drei Schalen: Ganz außen sitzt das Blau, darunter das Rot, ganz innen das Gelb. Beim Aufhellen schälst du von außen nach innen. Deshalb wird dunkles Haar erst rötlich, dann orange, dann gelb.',
      frage: 'Welche Farbe bleibt beim Aufhellen am längsten im Haar?',
      o: ['Gelb', 'Blau', 'Rot'], r: 0,
      ja: 'Richtig, Gelb ist der innerste Kern. Und was geht dann ganz zuerst?',
      nein: 'Nicht ganz. Denk an hell blondiertes Haar: Am Ende ist es gelblich, nicht rot oder blau. Gelb bleibt also am längsten.'
    },
    '3-3': {
      bild: 'Denk an eine Regenjacke und ein Baumwoll-T-Shirt: Auf der Jacke perlt Wasser ab, das Shirt saugt es auf. Grobes graues Haar ist wie die Regenjacke: eine dicke, dicht geschlossene Schuppenschicht. Farbe hat es dort schwer.',
      frage: 'Bei welchem Haar liegen die Schuppen am dichtesten geschlossen?',
      o: ['Bei gesundem, grobem Haar', 'Bei blondiertem Haar', 'Bei porösem Haar'], r: 0,
      ja: 'Genau. Dichte Schuppen lassen Farbe nur langsam hinein. Darum braucht grobes graues Haar oft mehr Zeit.',
      nein: 'Nicht ganz. Blondiertes und poröses Haar hat offene Schuppen und nimmt Farbe schnell auf. Dicht geschlossen ist gesundes, grobes Haar.'
    },

    // ── Dauerwelle & Umformung ───────────────────────────────────────────
    '2-mc11': {
      bild: 'Stell dir eine Strickleiter vor: Die zwei Seile sind lange Eiweißketten im Haar, die Sprossen dazwischen feste Schwefel-Verbindungen. Wo die Sprossen sitzen, bestimmt, ob die Leiter gerade hängt oder sich wellt. Eine Dauerwelle setzt die Sprossen neu.',
      frage: 'Wo im Haar sitzen diese Sprossen, damit sie die Form bestimmen können?',
      o: ['Im Cortex, der dicken Rinde', 'In der Schuppenschicht', 'In der Kopfhaut'], r: 0,
      ja: 'Genau. Im Cortex halten Schwefel-Brücken (S-S) das Haar in seiner Form.',
      nein: 'Nicht ganz. Die Schuppenschicht ist nur die dünne Hülle. Die Form bestimmt der dicke Cortex, und dort sitzen die Sprossen.'
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
