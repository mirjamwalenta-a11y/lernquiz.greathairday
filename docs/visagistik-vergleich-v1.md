# Visagistik-Vergleich – V1

Umgesetzt in `beratung-formwirkung.html`, Reiter „Visagistik“ (Daten in `VG_UEBUNGEN`, Bilder in `VG_BILDER`).

Ausbildungsmodul neben der Schnittwerkstatt. Drei Bereiche: **Augenbrauenform · Licht und Schatten · Hochsteckfrisur**.
Grundprinzip in jeder Übung: **sehen → einordnen → entscheiden → begründen** (plus Gegenprobe).

---

## 1. Didaktische Grundlogik

Visagistik und Hochsteckfrisuren gehören zur Ausbildung. In der Praxis scheitern Lehrlinge selten an der Technik, sondern daran, dass sie nicht sehen, *was* eine Braue, ein Schatten oder ein Dutt im Gesicht bewirkt. Ein „richtig/falsch“-System ist zu schwach, weil keine Braue, kein Konturing und kein Dutt an sich richtig ist: Dieselbe Variante ist bei einem Zielbild richtig und beim nächsten falsch. Wer nur „richtig“ anklickt, lernt Rezepte („rundes Gesicht = hoher Dutt“) und versagt beim ersten Gesicht, das nicht ins Schema passt. Der Kern des Moduls ist deshalb die Kette **Merkmal → Wirkung → Zielbild**: Der Lehrling beschreibt zuerst, was sich verändert und wie es wirkt, entscheidet erst dann mit Blick auf das Zielbild und muss die Entscheidung mit genau dieser Kette begründen.

---

## 2. V1-Modulstruktur

Jede Übung zeigt **dasselbe Gesicht in zwei Varianten A und B**, die sich nur im **Haupthebel** der Übung unterscheiden. Gesicht, Licht, Blickwinkel, Haarfarbe und alle anderen Bereiche bleiben gleich. Nur so kann der Lehrling eine Wirkung einer Ursache zuordnen.

| # | Schritt | Ziel | Leitfrage | Antwortformat | Didaktischer Nutzen |
|---|---|---|---|---|---|
| 1 | **Sehen** | Den Unterschied finden, bevor bewertet wird | *Was ist zwischen A und B anders – und wo?* | Zone im Bild antippen + Merkmal aus 3–4 Karten wählen | Schult genaues Hinschauen. Das Zielbild ist noch verdeckt, also kann noch nicht nach „schön/passend“ geurteilt werden. |
| 2 | **Wirkung lesen** | Den Unterschied als Wirkung im Gesicht beschreiben | *Wie verändert das Merkmal das Gesicht?* | Pro Wirkungsachse: **A / B / kein Unterschied** (3–4 Achsen) | Trennt Wahrnehmung von Bewertung. „Kein Unterschied“ verhindert, dass Wirkungen hineingelesen werden. |
| 3 | **Entscheiden** | Wirkung mit dem Zielbild verbinden | *Welche Variante erreicht das Zielbild?* | Kundenauftrag + Zielbild werden aufgedeckt, Wahl **A oder B** | Die Entscheidung entsteht aus der gelesenen Wirkung, nicht aus einer Stilregel. |
| 4 | **Begründen** | Die Entscheidung in einem fachlichen Satz erklären | *Warum erreicht deine Variante das Zielbild?* | Satzrahmen mit drei Lücken aus Wortkarten: **Merkmal → Wirkung → Zielbezug** | Der Lehrling formuliert die Kette selbst. Leerwörter („schöner“, „passt besser“) liegen als Karten bereit und werden als ungenau erkannt. |
| 5 | **Gegenprobe** | Zeigen, dass die andere Variante nicht „falsch“ ist | *Für welches Zielbild wäre die andere Variante die richtige Wahl?* | Ein Zielbild aus drei wählen | Bricht das Richtig/Falsch-Denken. Richtig ist eine Variante immer nur in Bezug auf ein Zielbild. |

Feste Regel über alle Bereiche: **Wahrnehmung vor Bewertung, Wirkung vor Technik.** Technikbegriffe tauchen in Schritt 1 nur als sichtbares Merkmal auf („runder Bogen“), nie als Anleitung.

---

## 3. Screen-Struktur

Freischalt-Regel für alle prüfenden Screens: **Weiter nach richtiger Antwort. Nach dem 2. Fehlversuch zeigt die App die Lösung mit Erklärung, der Schritt wird als „mit Hilfe“ markiert, dann geht es weiter.** So bleibt niemand hängen, und das Ergebnis zeigt trotzdem, wo es gehakt hat.

| Screen | Was der Lehrling sieht | Was er tun muss | Was geprüft wird | Freischaltung |
|---|---|---|---|---|
| **S0 Ausgangslage** | Bereich, Titel, Foto des Ausgangsgesichts, 1–2 Sätze Ausgangslage (z. B. „Gesicht etwa so breit wie lang, volle Wangen, rundes Kinn“). Kein Zielbild. | Lesen, „Vergleich starten“ | – | Sofort |
| **S1 Sehen** | A und B nebeneinander, Seite zufällig. Bildzonen sind antippbar. | Zone antippen, in der der Unterschied liegt; Merkmal-Karte wählen | Zone = `richtige_wahrnehmung.zone` und Merkmal = `richtige_wahrnehmung.merkmal` | Regel oben |
| **S2 Wirkung lesen** | A und B, darunter 3–4 Achsen-Fragen („In welcher Variante wirkt das Gesicht länger?“) | Je Achse A / B / kein Unterschied | Jede Achse gegen `wirkungsachsen[].loesung` | Regel oben (alle Achsen richtig) |
| **S3 Zielbild & Entscheidung** | Kundenauftrag in Kundensprache, darunter das Zielbild in Fachsprache. A und B bleiben sichtbar, die eigenen Antworten aus S2 als kleine Leiste. | A oder B wählen | **Noch nicht** – geprüft wird zusammen mit der Begründung | Sofort nach Wahl |
| **S4 Begründen** | Satzrahmen: „Ich wähle Variante **[A/B]**, weil **[Merkmal]** **[Wirkung]**. Das passt zum Zielbild, weil **[Zielbezug]**.“ | Drei Lücken mit Wortkarten füllen | Entscheidung + alle drei Lücken, Diagnose nach Abschnitt 6 | Nach „Prüfen“ → S5 |
| **S5 Rückmeldung** | Den eigenen Satz, das Ergebnis und **einen** benannten Denkfehler (der früheste in der Kette) | Lesen; bei Fehler zurück zu S3/S4 | – | „Nochmal“ (max. 2 Versuche) oder nach Lösung weiter |
| **S6 Gegenprobe** | Die *nicht* gewählte Variante groß, drei Zielbilder | Das Zielbild wählen, für das diese Variante richtig wäre | `gegenprobe.richtig` | Regel oben |
| **S7 Abschluss** | Mustersatz der Übung, Ergebnis je Schritt (✓ / mit Hilfe), Merksatz | „Nächste Übung“ | – | Sofort |

---

## 4. Die drei Bereiche fachlich

### Gemeinsames Sprachraster (gilt in allen drei Bereichen)

**Zielbild · Ausgangslage · Merkmal · Wirkung · Haupthebel · Blickführung · Proportion · Gesichtsdrittel (oberes / mittleres / unteres) · länger ↔ kürzer · schmaler ↔ breiter · weich ↔ markant · betonen ↔ zurücknehmen**

**Leerwörter** (stehen als Wortkarten bereit, gelten in jeder Begründung als ungenau): *schöner · besser · passt · harmonischer · moderner · eleganter · perfekt*.

Kundensprache steht nur im Auftrag. Das Feedback übersetzt sie ausdrücklich („Meine Stirn ist so groß“ heißt: das obere Gesichtsdrittel soll zurücktreten).

---

### 4.1 Augenbrauenform

**Wirkungsachsen**

| Achse | Pole | Was sie steuert |
|---|---|---|
| Proportion | streckt ↔ verbreitert | Winkel/Bogen führt den Blick nach oben-außen; gerade, lange Braue führt in die Breite |
| Ausdruck | weich ↔ markant | Runder Bogen = weich; klarer Winkel = markant; Ende nach unten = müde |
| Augenpartie | offen ↔ schwer | Abstand Braue–Auge, Stärke, Farbtiefe |
| Augenabstand | rückt zusammen ↔ rückt auseinander | Lage des Brauenkopfs |

**Typische Zielbilder**
- Gesicht wirkt länger und schmaler → weich gewinkelter Bogen, höchster Punkt über dem äußeren Irisrand
- Gesicht wirkt weicher, Kanten treten zurück → runder Bogen ohne Ecke
- Gesicht wirkt kürzer → flacher Bogen, eher waagrechter Verlauf
- Augenpartie wirkt offener → schlankere Braue, höchster Punkt leicht angehoben, Farbtiefe nicht dunkler als das Haar
- Ausdruck bleibt natürlich, Gesicht ist ausgeglichen → Braue folgt der eigenen Form, nur geklärt

**Typische Fehlwahrnehmungen**
- „Dicker und dunkler = ausdrucksstärker = besser.“ Tatsächlich macht es die Augenpartie schwer und die Augen kleiner.
- Höhe und Winkel werden verwechselt: Eine höher gesetzte Braue ist nicht automatisch gewinkelter.
- Ein abfallendes Brauenende wird als „weich“ gelesen, wirkt aber müde oder traurig.
- Nur die Braue wird angeschaut, nicht das Gesicht: „Die Braue ist schön gezupft“ statt „das Gesicht wirkt länger“.
- „Rund = weich = immer freundlich“: Ein runder Bogen wiederholt aber eine runde Gesichtsform.

**Feste Begriffe:** Brauenkopf · höchster Punkt · Brauenende · Bogen (rund / weich gewinkelt / flach) · Brauenstärke · Farbtiefe · Messlinien (Nasenflügel → innerer Augenwinkel / äußerer Irisrand / äußerer Augenwinkel)

---

### 4.2 Make-up mit Licht und Schatten

Grundsatz, der in jedem Feedback gleich formuliert wird: **Licht holt hervor und vergrößert. Schatten nimmt zurück und verkleinert. Rouge gibt Richtung.**

**Wirkungsachsen**

| Achse | Pole | Was sie steuert |
|---|---|---|
| Proportion | länger ↔ kürzer / schmaler ↔ breiter | Richtung der Platzierung: senkrecht streckt, waagrecht verbreitert |
| Plastizität | flach ↔ modelliert | Wechsel von Licht und Schatten |
| Kontur | weich ↔ markant | Schatten unter Knochen und an Ecken schärft; Schatten auf Ecken mildert |
| Blickführung | wohin der Blick geht | Licht zieht den Blick an |

**Typische Zielbilder**
- Gesicht wirkt schmaler und länger → Schatten seitlich (Schläfe, Wangenmulde, Kieferlinie), Licht senkrecht auf der Mittelachse, Rouge schräg nach oben
- Gesicht wirkt kürzer → Schatten am Stirnhaaransatz und unter der Kinnspitze, Licht und Rouge waagrecht
- Kanten treten zurück → Schatten auf Stirn- und Kieferecken, Rouge rund auf dem Wangenapfel
- Oberes Gesichtsdrittel tritt zurück → Schatten an den Schläfen und seitlich an der Stirn, Licht im unteren Gesichtsdrittel
- Gesicht wirkt frischer und modelliert, Proportion bleibt → dezentes Licht auf den Wangenknochen, Schatten nur zart

**Typische Fehlwahrnehmungen**
- „Mehr Konturing = mehr Wirkung.“ Die Wirkung entsteht durch Platzierung und Richtung, nicht durch Menge.
- Licht wird als „Strahlen/Glow“ gelesen statt als Hervorheben. Licht auf vollen Wangen macht das Gesicht breiter.
- Rouge wird als Farbe gelesen, nicht als Richtung.
- Der Standard „Schatten unter die Wangenknochen“ wird ohne Zielbild angewendet.
- Ein sichtbarer Schattenstreifen wird als „definiert“ gelesen. Tatsächlich ist der Übergang nicht verblendet.
- Ein zu warmer Schatten wirkt wie Schmutz oder Bräune, nicht wie Tiefe (Unterton).

**Feste Begriffe:** Licht · Schatten · Rouge · Platzierung · Richtung (senkrecht / waagrecht / schräg) · Übergang (verblendet / sichtbar) · Intensität · Unterton · Zonen: Stirn, Schläfe, Wangenknochen, Wangenmulde, Wangenapfel, Kieferlinie, Kinnspitze, Nasenrücken

---

### 4.3 Hochsteckfrisur

Bewertet wird **immer von vorne, im Verhältnis zum Gesicht**, nicht die Steckarbeit von hinten.

**Wirkungsachsen**

| Achse | Pole | Was sie steuert |
|---|---|---|
| Proportion | länger ↔ kürzer / schmaler ↔ breiter | Volumen oben streckt, Volumen seitlich verbreitert |
| Schwerpunkt | hoch ↔ tief | Wo die Hauptmasse sitzt, dorthin geht der Blick; welches Gesichtsdrittel betont wird |
| Kontur am Gesicht | geschlossen ↔ aufgelöst | Streng zurück legt die Gesichtsform frei; gelöste Strähnen brechen Linien |
| Oberfläche | glatt ↔ strukturiert | Glatt wirkt streng und klar, strukturiert wirkt weich |

**Typische Zielbilder**
- Gesicht wirkt länger, Hals wirkt frei → Schwerpunkt hoch, Volumen am Oberkopf, Seiten anliegend
- Gesicht wirkt kürzer/breiter → Schwerpunkt mittel bis tief, Volumen seitlich, kein Volumen am Oberkopf
- Kanten treten zurück → Kontur aufgelöst, Strähnen am Kiefer, Oberfläche strukturiert
- Oberes Gesichtsdrittel tritt zurück, unteres bekommt Breite → Schwerpunkt tief, Volumen auf Kinnhöhe, Stirn teilweise bedeckt (Seitenscheitel)
- Gesichtsform wird bewusst gezeigt (ausgeglichenes Gesicht) → Kontur geschlossen, glatte Oberfläche

**Typische Fehlwahrnehmungen**
- „Hoch = elegant = passt immer.“ Ein hoher Schwerpunkt streckt und betont das obere Gesichtsdrittel.
- Volumen und Schwerpunkt werden verwechselt: Viel Volumen hinten ist kein hoher Schwerpunkt.
- „Sleek ist edel.“ Eine glatte, geschlossene Kontur legt die Gesichtsform frei, auch Ecken und Breite.
- „Strähnen ins Gesicht machen weicher.“ Eine Strähne, die auf Wangenhöhe endet, setzt dort eine waagrechte Linie und verbreitert.
- Die Frisur wird nur von hinten beurteilt, die Wirkung aufs Gesicht wird übersehen.

**Feste Begriffe:** Schwerpunkt (hoch / mittel / tief) · Volumen (oben / seitlich / hinten) · Kontur am Gesicht (geschlossen / aufgelöst) · Oberfläche (glatt / strukturiert) · Gesichtsrahmen · Silhouette (Umriss von vorne) · Scheitel

„Geschlossen / aufgelöst“ ist bewusst dasselbe Begriffspaar wie in der Schnittwerkstatt.

---

## 5. Drei Beispielübungen

### Übung 1 – Augenbraue: Strengen Ausdruck öffnen

| | |
|---|---|
| **Ausgangslage** | Schmales, eher langes Gesicht, hohe Stirn. Kräftige, dichte Brauen, die eher flach über den Augen liegen. Kein Ausgangsbild, weil es eine der beiden Brauen schon zeigen würde. |
| **Kundenauftrag** | „Ich höre oft, dass ich streng oder müde wirke. Ich möchte offener und freundlicher aussehen.“ |
| **Zielbild** | Die Augenpartie wirkt offener, der Ausdruck weicher und freundlicher. |
| **Variante A** | Flacher Bogen: Die Braue verläuft fast waagrecht und liegt tief über dem Auge. |
| **Variante B** | Runder, höher gewölbter Bogen. Brauenkopf, Stärke, Farbe und Augen-Make-up wie A. |
| **Richtige Wahrnehmung** | Zone: Brauenbogen. A liegt wie ein Balken über dem Auge: Augenpartie schwerer, Ausdruck strenger, Gesicht wirkt kürzer. B gibt dem Lid Raum: Blick offener. Augen-Make-up: **kein Unterschied**. |
| **Richtige Entscheidung** | **B** |
| **Begründung** | Der runde, höher gewölbte Bogen gibt dem Lid mehr Raum und öffnet die Augenpartie. Der flache Bogen in A lässt den Blick strenger wirken. |
| **Typische Fehlentscheidung** | **A**, „weil die flache Braue klarer und ordentlicher aussieht“. |
| **Feedback** | „Du hast die flache Braue als ‚klar und ordentlich‘ gelesen, nicht als Wirkung auf die Augenpartie. Die Kundin will offener und freundlicher wirken. Der flache Bogen liegt tief über dem Auge und nimmt dem Lid Raum. Genau das lässt den Blick streng wirken. Schau, in welcher Variante das Lid mehr Raum hat.“ |
| **Gegenprobe** | A wäre richtig für: *„Langes Gesicht soll kürzer wirken.“* (Ablenker: „Rundes Gesicht soll länger wirken“ → weicher Winkel; „Augen sollen größer und wacher wirken“ → höherer Bogen.) |

### Übung 2 – Licht und Schatten: Langes Gesicht kürzer wirken lassen

| | |
|---|---|
| **Ausgangslage** | Schmales, eher langes Gesicht, hohe Stirn, schmales Kinn. |
| **Kundenauftrag** | „Mein Gesicht wirkt so lang – auf Fotos noch mehr.“ |
| **Zielbild** | Das Gesicht wirkt kürzer und ausgeglichener. |
| **Variante A** | Schatten am Stirnhaaransatz und unter der Kinnspitze. Licht waagrecht auf den Wangenknochen. Rouge waagrecht von der Wangenmitte Richtung Ohr. |
| **Variante B** | Schatten senkrecht in der Wangenmulde. Licht senkrecht auf Stirnmitte, Nasenrücken und Kinn. Rouge schräg Richtung Schläfe. Gleiche Produktmenge wie A. |
| **Richtige Wahrnehmung** | Zone: Stirn und Kinn (A) bzw. Mittelachse und Wangen (B). B wirkt länger und markanter. A wirkt kürzer und breiter. Intensität: **kein Unterschied**. |
| **Richtige Entscheidung** | **A** |
| **Begründung** | Der Schatten am Haaransatz und unter dem Kinn nimmt oben und unten Länge zurück. Licht und Rouge waagrecht ziehen den Blick in die Breite. Dadurch wirkt das Gesicht kürzer. |
| **Typische Fehlentscheidung** | **B**, „weil B definierter aussieht und Konturing unter die Wangenknochen gehört“. |
| **Feedback** | „Du hast nach einer Standardtechnik entschieden, nicht nach dem Zielbild. B wirkt definierter, weil der Schatten senkrecht in der Wangenmulde und das Licht auf der Mittelachse das Gesicht strecken. Das lange Gesicht wird dadurch noch länger. Licht holt hervor, Schatten nimmt zurück: Wo nimmt A Länge weg?“ |
| **Gegenprobe** | B wäre richtig für: *„Rundes Gesicht soll schmaler und länger wirken.“* (Ablenker: „Eckiges Gesicht soll weicher wirken“ → Schatten auf den Ecken; „Stirn soll zurücktreten“ → Schatten an den Schläfen.) |

### Übung 3 – Hochsteckfrisur: Breite Stirn, schmales Kinn ausgleichen

| | |
|---|---|
| **Ausgangslage** | Die Stirn ist deutlich breiter als das schmale, spitz zulaufende Kinn. Ausgeprägte Wangenknochen. Kein Ausgangsbild. |
| **Kundenauftrag** | „Ich hab immer das Gefühl, meine Stirn ist so groß – und unten ist nix.“ |
| **Zielbild** | Das obere Gesichtsdrittel tritt zurück, das untere bekommt optisch Breite. Das Gesicht wirkt ausgeglichen. |
| **Variante A** | Schwerpunkt hoch: Dutt am Oberkopf, Haar glatt nach oben genommen, Seiten anliegend. |
| **Variante B** | Schwerpunkt tief: Knoten seitlich im Nacken, auf Kinnhöhe sichtbar, einzelne gelöste Strähnen. Make-up wie A. |
| **Richtige Wahrnehmung** | Zone: Oberkopf (A) bzw. Nacken und Kinnhöhe (B). A betont die Stirn und streckt. B gibt dem unteren Gesichtsdrittel Breite. Make-up: **kein Unterschied**. |
| **Richtige Entscheidung** | **B** |
| **Begründung** | Der tiefe Schwerpunkt und das Volumen auf Kinnhöhe geben dem unteren Gesichtsdrittel Breite. Dadurch tritt die Stirn zurück, das Gesicht wirkt ausgeglichen. |
| **Typische Fehlentscheidung** | **A**, „weil ein hoher Dutt eleganter ist und streckt“. |
| **Feedback** | „Du hast nach einer Stilregel entschieden („hoch = elegant“) statt nach dem Zielbild. Strecken war nicht gefragt. Die Kundin will, dass die Stirn zurücktritt. Der hohe Schwerpunkt zieht den Blick genau nach oben auf die Stirn. Schau, in welcher Variante das untere Gesichtsdrittel Breite bekommt.“ |
| **Gegenprobe** | A wäre richtig für: *„Rundes Gesicht soll länger wirken, der Hals soll frei wirken.“* (Ablenker: „Eckiges Gesicht soll weicher wirken“ → Kontur aufgelöst; „Langes Gesicht soll kürzer wirken“ → Schwerpunkt tief, Volumen seitlich.) |

---

## 6. Feedbacklogik

### Aufbau jeder Rückmeldung (immer in dieser Reihenfolge)

1. **Denkfehler benennen** – was im Denken passiert ist („Du hast nach einer Stilregel entschieden statt nach dem Zielbild.“)
2. **Blick zurück** – wohin im Bild schauen („Schau auf die Kinnhöhe.“)
3. **Verbindung herstellen** – Merkmal → Wirkung → Zielbild in einem Satz
4. **Auftrag** – was jetzt zu tun ist („Wähle nochmal.“)

Nie nur „falsch“. Die Lösung wird erst nach dem 2. Fehlversuch gezeigt.

**Es wird immer nur ein Denkfehler zurückgemeldet: der früheste in der Kette.** Prüfreihenfolge:
**Wahrnehmung → Widerspruch → Entscheidung → Begründung ungenau.**
Grund: Wer die Wirkung falsch liest, kann nicht richtig entscheiden. Wer sich selbst widerspricht, hat die Kette noch nicht verbunden, bevor es ums Zielbild geht.

### Wie die App die Fehler erkennt

Jede Wortkarte im Satzrahmen (S4) trägt ein Tag: `a`, `b` (beschreibt diese Variante), `gleich` (Merkmal unterscheidet die Varianten nicht), `leer` (Leerwort), `ziel`, `teilziel`, `fremd` (für Zielbezug-Karten).

| Fehlertyp | Erkennung | Feedback-Muster |
|---|---|---|
| **W – Wirkung falsch gelesen** | S1 oder S2 weicht von der Lösung ab. Unterfälle: **vertauscht** (A/B umgekehrt), **übersehen** („kein Unterschied“ statt A/B), **hineingelesen** (A/B statt „kein Unterschied“), **falsche Zone** | *vertauscht:* „Du hast die Wirkung richtig erkannt, aber der falschen Variante zugeordnet. Schau nochmal auf [Zone] in A.“ · *übersehen:* „Du hast den Unterschied übersehen. Schau auf [Zone]: Dort ist [Merkmal] anders, und das verändert [Achse].“ · *hineingelesen:* „Du hast einen Unterschied gesehen, den es hier nicht gibt. [Merkmal] ist in A und B gleich. Bewerte nur, was sich wirklich ändert.“ · *falsche Zone:* „Du hast auf [gewählte Zone] geschaut. Der Unterschied liegt in [Zone].“ |
| **E – Entscheidung passt nicht zum Zielbild** | Wahl ≠ `richtige_entscheidung`, Begründung passt zur eigenen Wahl. Ist S2 fehlerfrei: **Verbindungsfehler**. War S2 fehlerhaft: **Folgefehler** | *Verbindungsfehler:* „Du hast die Wirkung richtig gelesen, sie aber nicht mit dem Zielbild verbunden. Das Zielbild verlangt [Zielwirkung]. Welche Variante erzeugt genau das?“ · *Folgefehler:* „Deine Entscheidung folgt aus deiner Antwort in Schritt 2. Dort hast du [Achse] [A/B] zugeordnet. Schau dir das zuerst nochmal an.“ · dazu der übungsspezifische Text aus `typische_fehler` (z. B. Stilregel, Standardtechnik, Nebenwunsch) |
| **B1 – Begründung zu ungenau** | Wahl richtig, aber eine Lücke ist `leer`, Merkmal `gleich` oder Zielbezug `teilziel`/`fremd` | *Leerwort:* „‚Schöner‘ beschreibt dein Gefühl, nicht die Wirkung. Was macht [Merkmal] mit dem Gesicht: länger, kürzer, schmaler, breiter, weicher, markanter?“ · *Merkmal gleich:* „[Merkmal] ist in A und B gleich, also kann es den Unterschied nicht erklären.“ · *Teilziel:* „Du begründest nur mit einem Teil des Auftrags. Das Hauptziel ist [Zielwirkung].“ · *fremd:* „Das stand nicht im Auftrag. Begründe mit dem Zielbild.“ |
| **B2 – Begründung widerspricht der Entscheidung** | Merkmal- oder Wirkungskarte trägt das Tag der **nicht** gewählten Variante | „Deine Begründung beschreibt Variante [X], gewählt hast du aber [Y]. Entscheidung und Begründung müssen zur selben Variante gehören. Welche Variante meinst du wirklich?“ – Ist die Begründung fachlich die richtige, kommt dazu: „Deine Begründung stimmt. Prüfe deine Wahl.“ |

### Wenn alles stimmt

Den eigenen Satz bestätigen und mit dem Mustersatz vergleichen: „Genau. Du hast Merkmal, Wirkung und Zielbild verbunden.“ Danach die Gegenprobe.

---

## 7. Datenstruktur

Übungen liegen wie in der Schnittwerkstatt (`SB_FAELLE`) als statisches Array `VG_UEBUNGEN` in der HTML-Datei. **Keine neue Supabase-Tabelle in V1.** (Falls Übungen oder Ergebnisse später in Supabase gespeichert werden: RLS zuerst, siehe `CLAUDE.md`.)

Bilder werden über die Schlüssel `VG_BILD_…` in `VG_BILDER` referenziert, die Dateien liegen in `bilder/visagistik/`. Fehlt eine Datei, zeigt die App eine Platzhalter-Kachel mit dem Dateinamen. Die Seite von A und B wird beim Anzeigen zufällig gewählt.

| Feld | Inhalt |
|---|---|
| `id` | eindeutig, `bereich-nummer` |
| `bereich` | `braue` · `licht_schatten` · `hochsteck` |
| `titel` | Titel der Übung |
| `haupthebel` | das eine Merkmal, in dem sich A und B unterscheiden |
| `ausgangslage` | Text + Bild (`bild: null` = kein Ausgangsbild) |
| `zielbild` | `kundensprache` (Auftrag) + `fachsprache` (Zielbild) |
| `variante_a`, `variante_b` | Bild + Beschreibung |
| `wirkungsachsen` | Fragen für S2 mit `loesung`: `a` / `b` / `gleich` |
| `richtige_wahrnehmung` | Zone, Merkmal, Text |
| `wahrnehmungsfrage` | Frage, Bereiche (`zonen`) und Merkmale für S1 |
| `richtige_entscheidung` | `a` / `b` |
| `begruendung` | richtige Karten-IDs + Mustersatz |
| `satzbausteine` | Wortkarten für S4 mit Tag |
| `gegenprobe` | Frage, Optionen, richtige Option |
| `typische_fehler` | Code, Auslöser, Denkfehler |
| `feedback` | Texte je Fehlertyp + Abschluss |

### JSON-Beispiel (Übung 1)

```json
{
  "id": "braue-01",
  "bereich": "braue",
  "kurz": "Augenbraue",
  "titel": "Strengen Ausdruck öffnen",
  "haupthebel": "Brauenbogen (flach ↔ rund gewölbt)",
  "ausgangslage": {
    "text": "Schmales, eher langes Gesicht, hohe Stirn. Kräftige, dichte Brauen, die eher flach über den Augen liegen.",
    "bild": null
  },
  "zielbild": {
    "kundensprache": "Ich höre oft, dass ich streng oder müde wirke. Ich möchte offener und freundlicher aussehen.",
    "fachsprache": "Die Augenpartie wirkt offener, der Ausdruck weicher und freundlicher."
  },
  "variante_a": {
    "bild": "VG_BILD_BRAUE01_A",
    "bildhinweis": "Flacher Bogen: Die Braue verläuft fast waagrecht und liegt tief über dem Auge."
  },
  "variante_b": {
    "bild": "VG_BILD_BRAUE01_B",
    "bildhinweis": "Runder, höher gewölbter Bogen. Brauenkopf, Stärke, Farbe und Augen-Make-up wie A."
  },
  "wahrnehmungsfrage": {
    "frage": "Was ist zwischen A und B anders – und wo?",
    "zonen": [
      [
        "brauenkopf",
        "Brauenkopf"
      ],
      [
        "augen",
        "Augen (Make-up)"
      ],
      [
        "brauenbogen",
        "Brauenbogen"
      ],
      [
        "lippen",
        "Lippen"
      ]
    ],
    "merkmale": [
      [
        "mk2",
        "Augen-Make-up"
      ],
      [
        "mk1",
        "Form und Höhe des Bogens"
      ],
      [
        "mk4",
        "Lippenfarbe"
      ],
      [
        "mk3",
        "Lage des Brauenkopfs"
      ]
    ]
  },
  "richtige_wahrnehmung": {
    "zone": "brauenbogen",
    "merkmal": "mk1",
    "text": "In A liegt die Braue flach und tief wie ein Balken über dem Auge: Die Augenpartie wirkt schwerer, der Ausdruck strenger. In B ist der Bogen rund und höher: Das Lid bekommt Raum, der Blick wirkt offener. Das Augen-Make-up ist gleich."
  },
  "wirkungsachsen": [
    {
      "achse": "augenpartie",
      "frage": "In welcher Variante wirkt die Augenpartie offener?",
      "loesung": "b",
      "hinweis": "Schau auf den Abstand zwischen Braue und Auge: Wo hat das Lid mehr Raum?"
    },
    {
      "achse": "ausdruck",
      "frage": "In welcher Variante wirkt der Ausdruck strenger?",
      "loesung": "a",
      "hinweis": "Welche Braue liegt flach und tief wie ein Balken über dem Auge?"
    },
    {
      "achse": "make-up",
      "frage": "In welcher Variante ist das Augen-Make-up kräftiger?",
      "loesung": "gleich",
      "hinweis": "Lidstrich, Wimpern und Lidschatten sind in A und B gleich."
    },
    {
      "achse": "proportion",
      "frage": "In welcher Variante wirkt das Gesicht kürzer?",
      "loesung": "a",
      "hinweis": "Welche Braue führt den Blick waagrecht zur Seite, welche nach oben?"
    }
  ],
  "richtige_entscheidung": "b",
  "satzbausteine": {
    "merkmal": [
      {
        "id": "m2",
        "text": "der flache, tief liegende Bogen",
        "tag": "a"
      },
      {
        "id": "m3",
        "text": "das Augen-Make-up",
        "tag": "gleich"
      },
      {
        "id": "m1",
        "text": "der runde, höher gewölbte Bogen",
        "tag": "b"
      }
    ],
    "wirkung": [
      {
        "id": "w3",
        "text": "schöner aussieht",
        "tag": "leer"
      },
      {
        "id": "w2",
        "text": "das Gesicht optisch verkürzt",
        "tag": "a"
      },
      {
        "id": "w1",
        "text": "dem Lid mehr Raum gibt und die Augenpartie öffnet",
        "tag": "b"
      },
      {
        "id": "w5",
        "text": "den Blick ruhig und gerade hält",
        "tag": "a"
      },
      {
        "id": "w4",
        "text": "moderner wirkt",
        "tag": "leer"
      }
    ],
    "zielbezug": [
      {
        "id": "z2",
        "text": "die Kundin weniger müde aussehen will",
        "tag": "teilziel"
      },
      {
        "id": "z1",
        "text": "die Augenpartie offener und der Ausdruck freundlicher wirken soll",
        "tag": "ziel"
      },
      {
        "id": "z3",
        "text": "kräftige Brauen gerade Trend sind",
        "tag": "fremd"
      }
    ]
  },
  "begruendung": {
    "merkmal": "m1",
    "wirkung": "w1",
    "zielbezug": "z1",
    "mustersatz": "Ich wähle Variante B, weil der runde, höher gewölbte Bogen dem Lid mehr Raum gibt und die Augenpartie öffnet. Das passt zum Zielbild, weil die Augenpartie offener und der Ausdruck freundlicher wirken soll. Der flache Bogen in A liegt wie ein Balken über dem Auge und lässt den Blick strenger wirken."
  },
  "gegenprobe": {
    "optionen": [
      {
        "id": "g2",
        "text": "Rundes Gesicht soll länger wirken.",
        "warum": "Dafür braucht es einen weichen Winkel, der den Blick nach oben-außen führt. Der flache Bogen führt in die Breite."
      },
      {
        "id": "g1",
        "text": "Langes Gesicht soll kürzer wirken."
      },
      {
        "id": "g3",
        "text": "Die Augen sollen größer und wacher wirken.",
        "warum": "Der flache Bogen liegt tief und nimmt dem Lid Raum. Die Augen wirken dadurch eher kleiner."
      }
    ],
    "richtig": "g1",
    "erklaerung": "Der flache Bogen führt den Blick waagrecht zur Seite. Das nimmt einem langen Gesicht Länge."
  },
  "typische_fehler": [
    {
      "code": "E_KLARHEIT",
      "wenn": {
        "entscheidung": "a"
      },
      "denkfehler": "Du hast die flache Braue als „klar und ordentlich“ gelesen, nicht als Wirkung auf die Augenpartie.",
      "text": "Die Kundin will offener und freundlicher wirken. Der flache Bogen liegt tief über dem Auge und nimmt dem Lid Raum. Genau das lässt den Blick streng wirken. Schau, in welcher Variante das Lid mehr Raum hat."
    }
  ],
  "feedback": {
    "leerfrage": "Was macht der Bogen mit der Augenpartie und dem Ausdruck: offener, schwerer, strenger, weicher?",
    "richtig": "Mehr Raum über dem Auge öffnet den Blick.",
    "merksatz": "Je flacher und tiefer die Braue, desto schwerer und strenger wirkt die Augenpartie. Ein runder, gewölbter Bogen öffnet sie."
  }
}
```

Ergebnis pro Übung (für die Abschlussanzeige): je Schritt `ok` / `mit_hilfe` + Liste der ausgelösten Fehlercodes.

---

## 8. UI-Vorschlag (zuletzt)

- **Vergleich nebeneinander, A und B gleich groß**, nur mit „A“ und „B“ beschriftet. Die Seite wird zufällig vergeben, es gibt **keine Farbe und kein Label, das „richtig“ verrät**. Am Handy: übereinander oder umschaltbar per Tippen auf „A | B“, dazu ein **Überblend-Regler**, damit der Unterschied an derselben Stelle sichtbar wird.
- **Zonen** als zarte Umrisse, erst in S1 antippbar.
- **Zielbild-Karte** bleibt bis S3 verdeckt („Zielbild aufdecken“).
- **Satzrahmen** in S4 als ein lesbarer Satz mit drei Lücken, Wortkarten darunter.
- Rückmeldung als Karte unter dem Bild. Der benannte Denkfehler steht fett in der ersten Zeile.
- Farben und Komponenten wie in `beratung-formwirkung.html`, als weiterer Reiter neben „Baukasten“ und „Trainer“. Keine eigene App.

### Anforderungen an die Bildpaare

- Dasselbe Gesicht, dasselbe Licht, derselbe Blickwinkel. A und B unterscheiden sich **nur im Haupthebel**.
- **Keine Beschriftungen, Pfeile, Hilfslinien oder Wertungen im Bild.** Alles Textliche kommt aus den Übungsdaten.
- Die bisherigen Vorlagebilder („Gesichtsform Oval / Rund / Herz / Rechteckig“) sind dafür nicht geeignet: Sie zeigen „richtig/falsch“ auf einer Gesichtshälfte, verändern mehrere Merkmale gleichzeitig (Braue, Make-up und Dutt) und enthalten Widersprüche (z. B. „Weiche Kontur“ bei Herz gleichzeitig als ✓ und ✗, „Konturing Schläfen“ bei Herz als falsch, Rechteckig mit „Zusammenfassung: Herz“ und „Helle Lippen“ als Fehler, obwohl oben richtig).
