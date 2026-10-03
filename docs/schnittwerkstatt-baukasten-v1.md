# Schnittwerkstatt – Baukasten V1

## Festes Sprachraster

Alle Modultexte, Antwortoptionen und Feedbacks verwenden nur diese Begriffe: **Zielform · Kontur · Gewicht · Gewichtslinie · geschlossen · aufgelöst · Haupthebel**. Kundensprache wie „Fülle im Nacken“ steht nur im Auftrag und wird im Feedback ausdrücklich übersetzt („Fülle im Nacken“ heißt: Gewichtslinie in der unteren Zone).

| Zielform | Gewicht | Gewichtslinie | Formverhalten | Haupthebel |
|---|---|---|---|---|
| Kompakt | an der Kontur | keine über der Kontur | überall geschlossen | 0° |
| Graduiert | über der Kontur | ja, Lage je nach Elevation | oberhalb geschlossen, unterhalb aufgelöst | 1–89° |
| Gleichmäßig gestuft | verteilt, alle Längen gleich | keine | überall aufgelöst | 90° mit mitwandernder Leitsträhne |
| Ansteigend gestuft | verteilt, Längen nach unten länger | keine | überall aufgelöst | über 90° mit feststehender Leitsträhne oben |

## Fälle in der App

| Fall | Zielbild | Zielform | Kontur | Gewicht | Formverhalten | Haupthebel | Abteilung | Leitsträhne | Gewichtslinie „G“ |
|---|---|---|---|---|---|---|---|---|---|
| 1 Graduierter Bob mit Fülle im Nacken | Foto, Ansicht von hinten (`SB_BILD_GRADUIERT`) | graduiert | nach vorne länger | Gewichtslinie in der unteren Zone | oberhalb geschlossen, unterhalb aufgelöst | niedrige Graduierung (ca. 45°) | diagonal-vorwärts | mitwandernd | untere Zone |
| 2 Kompakter Bob, kinnlang | Foto im Profil (`SB_BILD_KOMPAKT`) | kompakt | nach vorne länger | an der Kontur | überall geschlossen | 0° | diagonal-vorwärts | feststehend | an der Kontur |
| 3 Gleichmäßig gestufte Form, kurz | Foto, Ansicht von vorne (`SB_BILD_GLEICH`) | gleichmäßig gestuft | waagrecht | verteilt | überall aufgelöst | 90° | senkrecht | mitwandernd | keine Gewichtslinie |
| 4 Ansteigend gestufte Form, schulterlang | Profil aus der Bildvorlage (`SB_BILD_ANSTEIGEND`) | ansteigend gestuft | waagrecht | verteilt | überall aufgelöst | über 90° | senkrecht | feststehend (oben) | keine Gewichtslinie |

Die vier Fälle decken alle Zielformen ab: Dieselben Fragen führen über dieselben Begriffe zu kompakt, graduiert, gleichmäßig gestuft oder ansteigend gestuft.

Zwei Ebenen:

- **Ebene 1: Schnittentscheidung denken:** Module 1–3
- **Ebene 2: Schnittzeichnung ableiten:** Module 4–5

Dieses Dokument entspricht dem Stand der App (`beratung-formwirkung.html`, Reiter „Baukasten“, Daten in `SB_MODULE` und `SB_FAELLE`).

---

## 1. Einordnung

Ein rein technischer Baukasten fragt nach Winkeln und Abteilungen, bevor der Lehrling weiß, welche Form überhaupt entstehen soll. So lernt er, Technik richtig anzuklicken, aber nicht, warum. Diese Struktur dreht die Reihenfolge um: Zuerst kommen Zielform und Gewicht, dann der Haupthebel als Ursache und zum Schluss die Zeichnung als Übersetzung. Jede Technikantwort lässt sich damit auf eine sichtbare Wirkung zurückführen. Deshalb kann die App auch erkennen, *wo* im Denken der Fehler liegt, und nicht nur, *dass* etwas falsch ist.

---

## 2. Die fünf Module

### Modul 1 – Zielform erkennen
**Leitfrage:** Was soll am Ende sichtbar entstehen?
**Bild:** Zielbild (Foto im Profil, Hinterkopf rechts) mit dem Auftrag in Kundensprache.

| A) Welche Zielform siehst du? | B) Wie verläuft die Kontur? |
|---|---|
| Kompakt: Das Gewicht liegt an der Kontur | Waagrecht |
| Graduiert: Das Gewicht liegt als Gewichtslinie über der Kontur | Nach vorne länger |
| Gleichmäßig gestuft: Das Gewicht ist verteilt, alle Längen sind gleich lang | Nach vorne kürzer |
| Ansteigend gestuft: Das Gewicht ist verteilt, die Längen werden nach unten zur Kontur länger | |

**Didaktischer Nutzen:** Der Lehrling schaut zuerst und schneidet dann. Technikbegriffe sind in diesem Modul nicht auswählbar.

---

### Modul 2 – Gewicht und Formverhalten entscheiden
**Leitfrage:** Wo liegt das Gewicht, und wo ist die Form geschlossen oder aufgelöst?
**Bild:** Zielbild mit den Zonen oben, mitte, unten und Kontur. Die Zone lässt sich auch im Bild antippen.

| A) Wo liegt das Gewicht? | B) Wie verhält sich die Form? |
|---|---|
| An der Kontur | Überall geschlossen |
| Als Gewichtslinie in der unteren Zone (Nacken / unterer Hinterkopf) | Oberhalb der Gewichtslinie geschlossen, unterhalb aufgelöst |
| Als Gewichtslinie in der mittleren Zone (Hinterkopf) | Oberhalb der Gewichtslinie aufgelöst, unterhalb geschlossen |
| Als Gewichtslinie in der oberen Zone (Oberkopf) | Überall aufgelöst |
| Verteilt, keine Gewichtslinie | |

**Didaktischer Nutzen:** Gewicht und Formverhalten sind das Bindeglied zwischen Bild und Technik. Wer hier richtig entscheidet, hat den Haupthebel schon fast hergeleitet.

---

### Modul 3 – Haupthebel wählen
**Leitfrage:** Welche technische Grundentscheidung erzeugt diese Zielform am stärksten?

| Haupthebel: Elevation | Begleitentscheidung: Abteilungsrichtung | Begleitentscheidung: Leitsträhne |
|---|---|---|
| 0° (kompakt) | Waagrecht | Feststehend |
| Niedrig graduiert (ca. 1–45°) | Diagonal-vorwärts (Kontur nach vorne länger) | Mitwandernd |
| Hoch graduiert (ca. 46–89°) | Diagonal-rückwärts (Kontur nach vorne kürzer) | |
| 90° (gleichmäßig gestuft) | Senkrecht | |
| Über 90° (ansteigend gestuft) | | |

**Didaktischer Nutzen:** Die Elevation bestimmt Zielform und Lage der Gewichtslinie am stärksten. Abteilung und Leitsträhne braucht der Lehrling, damit sich die Entscheidung zeichnen lässt. Fingerhaltung, Pointen und Slicen gehören nicht in V1.

---

### Modul 4 – In Schnittzeichnung übersetzen
**Leitfrage:** Wie sieht diese Entscheidung in der Zeichnung aus?
**Bild:** Kopf im Profil (Hinterkopf rechts) mit den Zonen oben, mitte, unten und Kontur. Die gewählte Zeichnung und „G“ erscheinen dort.

| Element | Symbol |
|---|---|
| Abteilung | dünne Linien am Kopf (waagrecht oder schräg nach vorne fallend für diagonal-vorwärts) oder eine Linie entlang des Hinterkopfs (senkrecht) |
| Elevation | Strahl vom Kopf weg, mit Gradzahl (0° = senkrecht nach unten, 90° = waagrecht vom Kopf weg) |
| Leitsträhne | rote Strähne; mitwandernd mit Pfeil nach oben, feststehend mit Schloss (alle Partien laufen zur Leitsträhne) |
| Gewichtslinie | dicke grüne Linie „G“ |
| Schnittlinie | gestrichelt |

**Aufgaben:**
- A) Welche Zeichnung zeigt deine Entscheidung? Es gibt drei Zeichnungen, jede falsche weicht in genau einem Merkmal ab.
- B) Wo liegt die Gewichtslinie „G“? Antworten: Obere Zone · Mittlere Zone · Untere Zone · An der Kontur · Keine Gewichtslinie.

**Didaktischer Nutzen:** Die Zeichnung ist eine Übersetzung und kein Rätsel. Das Feedback verweist auf die eigenen Antworten aus Modul 2 und 3.

---

### Modul 5 – Kurz begründen (Pflicht)
**Leitfrage:** Warum ist diese Entscheidung passend?

> Ich wähle als Haupthebel **[Elevation]** mit **[Leitsträhne]**, weil das Gewicht **[Gewicht]** liegen soll. So entsteht als Zielform: **[Zielform wählen]**.

Die ersten drei Felder füllt die App mit den eigenen Antworten. Der Lehrling wählt nur die Zielform:
- Gewicht an der Kontur, Oberfläche geschlossen
- eine Gewichtslinie über der Kontur, oberhalb geschlossen, unterhalb aufgelöst
- Gewicht verteilt, alle Längen gleich, Oberfläche aufgelöst
- Gewicht verteilt, Längen nach unten länger, Oberfläche aufgelöst

**Didaktischer Nutzen:** Der Lehrling schließt die Kette von Haupthebel über Gewicht bis zur Zielform selbst.

---

### Prüf- und Feedbackregeln
- Jedes Modul wird einzeln mit „Prüfen“ geprüft.
- Jede falsche Option hat ein eigenes Feedback. Es benennt die Grundform, zu der die gewählte Antwort gehört, und verweist bei Folgefehlern auf das Modul, in dem die Entscheidung gefallen ist.
- Nach dem Prüfen kann der Lehrling die Antwort ändern oder mit „Weiter“ fortfahren. Beim Weitergehen übernimmt die App die richtige Lösung, damit spätere Module auf einer stimmigen Grundlage aufbauen.
- Ein Modul, das beim ersten Prüfen falsch war, wird als „korrigiert“ markiert. Am Ende steht „Beim ersten Versuch richtig: x von 5 Modulen“.
- Fertige Module lassen sich über den Stepper wieder öffnen. Wer dort eine Antwort ändert, muss die folgenden Module neu prüfen.
- Der Fortschritt wird je Fall im Browser gespeichert.

---

## 3. Ausgearbeitetes Beispiel: Fall 1 „Graduierter Bob mit Fülle im Nacken“

| Modul | Richtige Antwort | Begründung in der App |
|---|---|---|
| 1 | Zielform **graduiert**, Kontur **nach vorne länger** | Zielform graduiert: Das Gewicht liegt als Gewichtslinie über der Kontur. Die Kontur ist im Nacken kurz und wird nach vorne länger. |
| 2 | Gewicht **als Gewichtslinie in der unteren Zone**, Form **oberhalb geschlossen, unterhalb aufgelöst** | „Fülle im Nacken“ heißt: Die Gewichtslinie liegt in der unteren Zone. Oberhalb der Gewichtslinie ist die Form geschlossen, unterhalb aufgelöst. |
| 3 | **Niedrig graduiert (ca. 45°)**, **diagonal-vorwärts**, **mitwandernd** | Haupthebel niedrige Graduierung: Sie baut eine Gewichtslinie auf und hält sie in der unteren Zone. Diagonal-vorwärts abgeteilt wird die Kontur nach vorne länger. Die mitwandernde Leitsträhne baut die Graduierung gleichmäßig nach oben auf. |
| 4 | **Zeichnung 2**, „G“ in der **unteren Zone** | Diagonal-vorwärts Abteilungen, Strahl in 45°, mitwandernde rote Leitsträhne und die Gewichtslinie „G“ in der unteren Zone. |
| 5 | Zielform: **eine Gewichtslinie über der Kontur, oberhalb geschlossen, unterhalb aufgelöst** | „Ich wähle als Haupthebel niedrige Graduierung (ca. 45°) mit mitwandernder Leitsträhne, weil das Gewicht als Gewichtslinie in der unteren Zone liegen soll. So entsteht als Zielform: eine Gewichtslinie über der Kontur, oberhalb geschlossen, unterhalb aufgelöst.“ |

Die falschen Zeichnungen in Fall 1: Zeichnung 1 = 90°, Zeichnung 3 = feststehende Leitsträhne.
In Fall 2: Zeichnung 1 = 45°, Zeichnung 2 = 90°, richtig ist Zeichnung 3.
In Fall 3: Zeichnung 2 = 45°, Zeichnung 3 = 90° mit waagrechter Abteilung, richtig ist Zeichnung 1.
In Fall 4: Zeichnung 1 = 90° mit mitwandernder Leitsträhne, Zeichnung 3 = 45°, richtig ist Zeichnung 2 (über 90°, alle Partien zur feststehenden Leitsträhne oben).

---

## 4. Typische Fehlentscheidungen (Fall 1)

| # | Fehlentscheidung | Vermutlich gedacht | Feedback in der App |
|---|---|---|---|
| 1 | Modul 3: **90°** | „Graduiert heißt Stufen, also 90°.“ | „90° verteilt das Gewicht gleichmäßig, dann gibt es keine Gewichtslinie und die Form ist aufgelöst. Für graduiert brauchst du eine niedrige Elevation.“ |
| 2 | Modul 3: **0°** | „Bob heißt kompakt, also nicht anheben.“ | „0° ist der Haupthebel für kompakt: Das Gewicht bleibt an der Kontur. Für eine Gewichtslinie über der Kontur musst du leicht anheben.“ |
| 3 | Modul 3: **hoch graduiert** | „Mehr Winkel macht mehr Fülle.“ | „Je höher du anhebst, desto höher rutscht die Gewichtslinie. Soll sie in der unteren Zone liegen, bleib tief, also ungefähr 45°.“ |
| 4 | Modul 2: **überall aufgelöst** | „Fülle heißt luftig.“ | „Überall aufgelöst gehört zur gestuften Zielform. Bei graduiert bleibt die Form oberhalb der Gewichtslinie geschlossen.“ |
| 5 | Modul 3: **feststehende Leitsträhne** | „Eine Leitsträhne für alles ist genauer.“ | „Wenn die Leitsträhne stehen bleibt, wird oben alles länger und die Gewichtslinie baut sich nicht gleichmäßig auf. Sie muss mitwandern.“ |
| 6 | Modul 4: **„G“ in der oberen Zone** | „Die Gewichtslinie ist dort, wo der Bob am breitesten ist.“ | „Schau auf deine Antwort in Modul 2: Gewichtslinie in der unteren Zone. Deine Zeichnung muss das genauso zeigen.“ |
| 7 | Modul 5: **Gewicht verteilt, Oberfläche aufgelöst** | Der Satz wurde ohne Nachdenken ausgefüllt. | „Dein Haupthebel passt, aber deine Begründung beschreibt die gestufte Zielform. Was erzeugt eine niedrige Graduierung wirklich?“ |

Die Feedbacktexte für Fall 2 bis 4 stehen in der App unter `SB_FAELLE.kompakt.fb`, `SB_FAELLE.gestuft.fb` und `SB_FAELLE.ansteigend.fb`.

---

## 5. Später als Drag-and-Drop

- **Reihenfolge bleibt gesperrt:** Module 1 → 5 werden nacheinander freigeschaltet, und in Modul 1–2 gibt es keine Technikkarten.
- **Karten statt Buttons:** Jede Antwortoption wird eine Karte, die in ein beschriftetes Feld gezogen wird (z. B. „Gewicht liegt …“).
- **Zeichnung aus Bausteinen:** In Modul 4 zieht der Lehrling Abteilungslinien, den Elevationsstrahl, die Leitsträhne und „G“ auf den Profilkopf. Die App prüft Lage und Richtung gegen die eigenen Antworten aus Modul 3.
- **Begründung aus eigenen Karten:** Die Lückensatz-Felder in Modul 5 sind mit den Karten befüllt, die der Lehrling vorher selbst gewählt hat. Neu gezogen wird nur die Zielform.
- **Prüfen pro Modul:** Feedback kommt nach jedem Modul und nicht erst am Ende, damit kein Fehler in die Zeichnung weitergetragen wird.

