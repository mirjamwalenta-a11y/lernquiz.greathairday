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
// Schlüssel = id der Frage in lernquiz.html (FB).
// Felder: bild (Bild/Eselsbrücke), frage (Gegenfrage), o (2–3 Antworten),
//         r (Index der richtigen), ja (nach richtig), nein (nach falsch).
// Stand 2026-11-25: Farbe & Blondierung (15), Haarkunde (9), Dauerwelle (5),
// zusammen 29 Einträge für 32 Fragen. Fachlich durch die Meisterin prüfen.
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
    }
  };
  // Gleiche Frage in einem anderen Lehrjahr: derselbe Eintrag
  T['1-n11'] = T['1-mc5'];
  T['2-mc12'] = T['1-n12'];
  T['2-mc7'] = T['1-12'];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function wZeile(text) {
    if (window.WOERNI && WOERNI.text) return WOERNI.text(text, 'nachdenklich', true);
    return '<div style="font-size:13px;color:#4A443A;line-height:1.5;margin-bottom:10px"><b style="color:#896C32">Wörni:</b> ' + esc(text) + '</div>';
  }

  window.WOERNI_LEITUNG = {
    texte: T,
    hat: function (id) { return !!(id && T[id]); },
    // Knopf (dieselbe Optik wie „Einfacher erklärt“). beiHilfe() wird aufgerufen,
    // sobald die Hilfe geöffnet wird (Seite wertet die Frage dann wie geraten).
    knopf: function (id, beiHilfe) {
      var t = T[id];
      if (!t) return null;
      var box = document.createElement('div');
      box.className = 'ls-box';
      box.style.cssText = 'text-align:center;margin-top:4px';
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pt-edit-k';
      b.textContent = 'Wörni, ich steh auf der Leitung';
      b.addEventListener('click', function () {
        if (beiHilfe) beiHilfe();
        box.style.textAlign = 'left';
        box.style.cssText += ';margin-top:10px;padding-top:10px;border-top:1px solid #0001';
        box.innerHTML = wZeile(t.bild) +
          '<div style="font-size:13px;font-weight:600;color:#2C2C2C;margin:4px 0 8px">' + esc(t.frage) + '</div>';
        var fb = document.createElement('div');
        fb.style.cssText = 'font-size:13px;color:#2C2C2C;line-height:1.5;margin-bottom:8px';
        t.o.forEach(function (txt, i) {
          var ob = document.createElement('button');
          ob.type = 'button'; ob.className = 'opt'; ob.textContent = txt;
          ob.addEventListener('click', function () {
            box.querySelectorAll('.opt').forEach(function (x) {
              x.disabled = true;
              if (x === ob) x.className = 'opt ' + (i === t.r ? 'ric' : 'fal');
            });
            fb.textContent = i === t.r ? t.ja : t.nein;
            var w = document.createElement('div');
            w.style.cssText = 'font-size:12px;color:#6B6560;margin-top:6px';
            w.textContent = '➜ Jetzt probier die Frage oben selbst.';
            fb.appendChild(w);
          });
          box.appendChild(ob);
        });
        box.appendChild(fb);
        var h = document.createElement('div');
        h.style.cssText = 'font-size:11px;color:#9A9188;line-height:1.45';
        h.textContent = 'Mit Hilfe zählt die Frage wie geraten und kommt in die Wiederholung. Dann schaffst du sie das nächste Mal allein.';
        box.appendChild(h);
      });
      box.appendChild(b);
      return box;
    }
  };
})();
