# Visagistik-Vergleich – Bildvorlage V1

Briefing für die neun Bilder des Reiters „Visagistik“ in `beratung-formwirkung.html`.
Fachliche Grundlage: `docs/visagistik-vergleich-v1.md`. Gilt für Fotoshooting und Bildgenerator gleichermaßen.
Genaue Beschreibung jedes einzelnen Bildes mit fertigen Prompts: `docs/visagistik-bildbeschreibungen-v1.md`.

---

## 1. Regeln für alle Bilder

1. **Pro Übung ein Gesicht.** Ausgangsbild, A und B zeigen dieselbe Person bzw. dasselbe generierte Gesicht.
2. **Nur der Haupthebel wechselt.** Alles andere bleibt zwischen A und B gleich: Licht, Kamera, Ausschnitt, Kopfhaltung, Gesichtsausdruck, Hintergrund, Kleidung, Haarfarbe und alle anderen Make-up-Teile.
3. **Keine Beschriftung im Bild.** Keine Texte, Pfeile, Hilfslinien, Häkchen, Kreuze oder geteilte Gesichtshälften. Alles Textliche kommt aus der App.
4. **Keine Wertung im Bild.** A und B werden gleich sorgfältig gemacht. Keine Variante darf schlampig, unscharf oder schlechter ausgeleuchtet wirken.
5. **Neutraler Ausdruck.** Mund geschlossen, Blick in die Kamera, kein Lächeln.
6. **Keine echten Kundinnen ohne schriftliche Freigabe.** Nur Models oder Kolleginnen mit Einverständnis, oder generierte Gesichter. Keine Namen in Dateinamen oder Metadaten.

## 2. Technische Vorgaben

| | |
|---|---|
| Format | Hochformat **4:5**, mindestens **1200 × 1500 px** |
| Dateityp | JPG, Qualität ca. 80, unter 400 KB pro Bild |
| Ausschnitt | frontal, Kopf und Schulteransatz, Gesicht mittig, Scheitel bis Schlüsselbein sichtbar |
| Kamera | Augenhöhe, Normalbrennweite (ca. 85 mm KB), Stativ, keine Verzerrung |
| Licht | weiches, gleichmäßiges Frontlicht (Softbox oder Fensterlicht), keine harten Schlagschatten. Bei Übung 2 besonders wichtig, damit nur das Make-up Licht und Schatten erzeugt. |
| Hintergrund | einfarbig hellgrau, ohne Salon-Einrichtung |
| Kleidung | schlichtes dunkles Oberteil mit rundem Ausschnitt, kein Schmuck |
| Bearbeitung | gleiche Farbkorrektur für alle drei Bilder einer Übung, keine Weichzeichner- oder Beauty-Filter |

**Ablage:** Dateien mit genau den Namen aus den Tabellen unten in den Ordner `bilder/visagistik/` hochladen. Am Code muss nichts geändert werden. Schritt für Schritt: Abschnitt 7.

**Reihenfolge beim Fotografieren:** Ausgangsbild zuerst, dann A, dann B, ohne die Kamera zu bewegen und ohne dass das Model aufsteht. Zwischen A und B nur den Haupthebel ändern.

**Mit Bildgenerator:** Zuerst das Ausgangsbild erzeugen. A und B dann als **Bearbeitung des Ausgangsbilds** erzeugen (Inpainting nur im genannten Bereich), nicht als neue Bilder. Neu generierte Bilder ändern sonst Gesicht, Licht und Ausschnitt mit.

---

## 3. Übung 1 – Augenbraue (Haupthebel: Brauenbogen)

**Gesicht:** Frau, ca. 25–35 Jahre, **rundes Gesicht**: etwa so breit wie lang, volle Wangen, rundes Kinn. Dunkelblondes bis braunes Haar, glatt und straff nach hinten genommen (Stirn und Haaransatz frei). Dezentes, gleiches Grund-Make-up in allen drei Bildern, kein Konturing, kein Rouge.

| Schlüssel | Datei | Was das Bild zeigt |
|---|---|---|
| `VG_BILD_BRAUE01_AUSGANG` | `braue01-ausgang.jpg` | Eigene Braue, mittelstark, leicht gerundet, nicht nachgezogen |
| `VG_BILD_BRAUE01_A` | `braue01-a.jpg` | **Weich gewinkelter Bogen:** höchster Punkt über dem äußeren Irisrand, Ende schlank auslaufend |
| `VG_BILD_BRAUE01_B` | `braue01-b.jpg` | **Gleichmäßig runder Bogen** ohne Winkel |

**Gleich in A und B:** Brauenstärke, Farbtiefe, Lage des Brauenkopfs, Länge der Braue, alles andere im Gesicht.
**Achtung:** Der Winkel in A bleibt weich, nicht spitz oder streng. Die runde Braue in B ist sauber gearbeitet, nicht „misslungen“.

**Prompt-Vorlage (Ausgangsbild):**
> Studio portrait photo, front view, head and shoulders, 4:5. Woman around 30 with a round face shape: face about as wide as long, full cheeks, rounded chin. Brown hair pulled back tightly, forehead and hairline visible. Natural medium-thick, slightly rounded eyebrows. Minimal natural makeup, no contouring, no blush. Neutral expression, mouth closed, looking into camera. Soft even front lighting, plain light grey background, plain dark crew-neck top, no jewelry. No text, no lines, no labels.

**Bearbeitung A:** *Edit only the eyebrows: softly angled brow arch, highest point above the outer edge of the iris, tail tapering slim. Keep thickness and color the same. Change nothing else.*
**Bearbeitung B:** *Edit only the eyebrows: evenly rounded arch without any angle. Keep thickness and color the same. Change nothing else.*

---

## 4. Übung 2 – Licht und Schatten (Haupthebel: Richtung der Platzierung)

**Gesicht:** Frau, ca. 25–40 Jahre, **langes, schmales Gesicht**: hohe Stirn, längliches Kinn. Haar straff nach hinten genommen (Stirn ganz frei, damit der Schatten am Haaransatz sichtbar ist). Gleiche Grundierung, gleiche Brauen, gleiches dezentes Augen-Make-up und gleicher Lippenton in allen drei Bildern.

| Schlüssel | Datei | Was das Bild zeigt |
|---|---|---|
| `VG_BILD_LICHT01_AUSGANG` | `licht01-ausgang.jpg` | Nur Grundierung, kein Licht, kein Schatten, kein Rouge |
| `VG_BILD_LICHT01_A` | `licht01-a.jpg` | **Waagrecht:** Schatten am Stirnhaaransatz und unter der Kinnspitze. Licht waagrecht auf den Wangenknochen. Rouge waagrecht von der Wangenmitte Richtung Ohr. |
| `VG_BILD_LICHT01_B` | `licht01-b.jpg` | **Senkrecht:** Schatten senkrecht in der Wangenmulde. Licht senkrecht auf Stirnmitte, Nasenrücken und Kinn. Rouge schräg Richtung Schläfe. |

**Gleich in A und B:** Produktmenge und Intensität (Schatten gleich tief, Licht gleich hell, Rouge gleich kräftig), Farbtöne, Übergänge gut verblendet, alles andere im Gesicht.
**Achtung:** Kein sichtbarer Schattenstreifen und kein Glitzer-Highlighter, damit Intensität nicht zum zweiten Unterschied wird. Schatten kühl-neutral, nicht orange.

**Prompt-Vorlage (Ausgangsbild):**
> Studio portrait photo, front view, head and shoulders, 4:5. Woman around 30 with a long, narrow face shape: high forehead, elongated chin. Hair pulled back tightly, forehead fully visible. Even foundation only, natural brows, subtle neutral eye makeup, nude lips. No contouring, no highlighter, no blush. Neutral expression, mouth closed, looking into camera. Soft even front lighting, plain light grey background, plain dark crew-neck top, no jewelry. No text, no lines, no labels.

**Bearbeitung A:** *Add makeup only: soft neutral contour shadow along the forehead hairline and under the chin tip; matte highlight placed horizontally on the cheekbones; blush placed horizontally from mid-cheek toward the ear. Well blended, medium intensity. Change nothing else.*
**Bearbeitung B:** *Add makeup only: soft neutral contour shadow placed vertically in the cheek hollows; matte highlight vertically on the center of the forehead, the bridge of the nose and the chin; blush angled toward the temples. Well blended, same intensity as variant A. Change nothing else.*

---

## 5. Übung 3 – Hochsteckfrisur (Haupthebel: Schwerpunkt hoch ↔ tief)

**Gesicht:** Frau, ca. 25–40 Jahre, **herzförmiges Gesicht**: breite Stirn, ausgeprägte Wangenknochen, schmales, spitzes Kinn. Mittellanges bis langes Haar. Gleiches dezentes Make-up in allen drei Bildern.

| Schlüssel | Datei | Was das Bild zeigt |
|---|---|---|
| `VG_BILD_HOCH01_AUSGANG` | `hoch01-ausgang.jpg` | Neutral: weicher Seitenscheitel, Haar locker nach hinten in einen tiefen Zopf, der von vorne nicht zu sehen ist. Kein Volumen oben, keine Strähnen am Gesicht. |
| `VG_BILD_HOCH01_A` | `hoch01-a.jpg` | **Schwerpunkt hoch:** Dutt am Oberkopf, von vorne über dem Kopf sichtbar, Volumen oben, Seiten anliegend. |
| `VG_BILD_HOCH01_B` | `hoch01-b.jpg` | **Schwerpunkt tief:** Knoten im Nacken, leicht seitlich versetzt und von vorne neben dem Kiefer auf Kinnhöhe sichtbar. Einzelne gelöste Strähnen ab Kinnhöhe. |

**Gleich in A und B:** derselbe weiche Seitenscheitel, gleicher Anteil bedeckter Stirn, gleiche leicht strukturierte Oberfläche, gleiche Haarmenge im Knoten, keine Strähnen über Kinnhöhe in beiden Varianten, alles andere im Gesicht.
**Achtung:** Die gelösten Strähnen in B beginnen erst auf Kinnhöhe. Strähnen auf Wangenhöhe würden einen zweiten Unterschied erzeugen.

**Prompt-Vorlage (Ausgangsbild):**
> Studio portrait photo, front view, head and shoulders, 4:5. Woman around 30 with a heart-shaped face: wide forehead, pronounced cheekbones, narrow pointed chin. Shoulder-length brown hair with a soft side part, loosely pulled back into a low ponytail that is not visible from the front. No volume on top, no strands around the face. Subtle natural makeup. Neutral expression, mouth closed, looking into camera. Soft even front lighting, plain light grey background, plain dark crew-neck top, no jewelry. No text, no lines, no labels.

**Bearbeitung A:** *Edit only the hair: high bun on top of the head, visible above the head from the front, volume on top, sides close to the head. Keep the same soft side part and slightly textured surface. Change nothing else.*
**Bearbeitung B:** *Edit only the hair: low knot at the nape, slightly off-center so it is visible beside the jaw at chin height, a few loose strands starting at chin height. Keep the same soft side part and slightly textured surface. Change nothing else.*

---

## 6. Abnahme-Check pro Übung

Vor dem Eintragen in `VG_BILDER` die drei Bilder nebeneinander legen und prüfen:

- [ ] Gleiches Gesicht, gleicher Ausschnitt, gleiche Kopfhaltung, gleicher Ausdruck
- [ ] Gleiches Licht, gleicher Hintergrund, gleiche Farbkorrektur
- [ ] Zwischen A und B ist **genau ein** Merkmal anders: der Haupthebel der Übung
- [ ] Die Merkmale, die in der App als „kein Unterschied“ gelten, sind wirklich gleich (Übung 1: Brauenstärke und Farbtiefe · Übung 2: Intensität · Übung 3: Oberfläche und Scheitel)
- [ ] A und B sind gleich sorgfältig gemacht, keine wirkt wie der „Fehler“
- [ ] Keine Beschriftung, keine Linien, keine Wertung im Bild
- [ ] Freigabe der abgebildeten Person liegt vor (bei Fotos)

---

## 7. Fotos einfügen – Schritt für Schritt

Erst PR #28 mergen. Den Ordner `bilder/visagistik/` gibt es auf `main` erst danach.

### Schritt 1 – Fotos vorbereiten

1. **Format JPG.** iPhone-Fotos sind oft HEIC. Entweder vor dem Shooting unter *Einstellungen → Kamera → Formate* „Maximale Kompatibilität“ wählen, oder die Fotos am Computer als JPG exportieren.
2. **Zuschneiden auf 4:5 Hochformat.** Alle drei Bilder einer Übung mit genau demselben Ausschnitt zuschneiden.
3. **Verkleinern** auf ca. 1200 × 1500 px. Jede Datei unter 400 KB, sonst lädt die Seite am Handy langsam.
4. **Umbenennen**, exakt so, alles klein, Endung `.jpg` (nicht `.JPG`, nicht `.jpeg`):

| Übung | Ausgangsbild | Variante A | Variante B |
|---|---|---|---|
| 1 Augenbraue | – | `braue01-a.jpg` | `braue01-b.jpg` |
| 2 Licht und Schatten | `licht01-ausgang.jpg` | `licht01-a.jpg` | `licht01-b.jpg` |
| 3 Hochsteckfrisur | – | `hoch01-a.jpg` | `hoch01-b.jpg` |

A und B nicht verwechseln: Was A und was B zeigt, steht in den Tabellen der Abschnitte 3 bis 5.

### Schritt 2 – Hochladen (am Computer im Browser)

1. Auf GitHub das Repo `lernquiz.greathairday` öffnen.
2. Ordner **`bilder`** → Ordner **`visagistik`** anklicken.
3. Oben rechts **Add file → Upload files**.
4. Die Fotos in das Feld ziehen. Es können alle neun auf einmal sein oder nur die einer Übung.
5. Unten bei „Commit changes“ kurz eintragen, z. B. „Visagistik: Fotos Übung 1“, und **Commit changes** klicken (direkt auf `main`).

### Schritt 3 – Prüfen

1. Ein bis zwei Minuten warten, bis GitHub Pages die Seite neu veröffentlicht hat.
2. `https://mirjamwalenta-a11y.github.io/lernquiz.greathairday/beratung-formwirkung.html` öffnen, Reiter **Visagistik**.
3. Je Übung „Vergleich starten“: Ausgangsbild, A und B müssen als Foto erscheinen.
4. **Steht noch eine Platzhalter-Kachel da?** Der Dateiname in der Kachel ist der, den die App sucht. Mit dem hochgeladenen Namen vergleichen. Häufigste Fehler: Großbuchstaben, `.jpeg` statt `.jpg`, Leerzeichen, A und B vertauscht.

### Foto später austauschen

1. Neues Foto mit **demselben Namen** hochladen wie in Schritt 2. GitHub ersetzt die alte Datei.
2. Damit Handys nicht das alte Bild aus dem Speicher zeigen: `beratung-formwirkung.html` auf GitHub öffnen, Stift-Symbol (*Edit*), nach `VG_BILD_VERSION = 1` suchen, die Zahl um eins erhöhen, **Commit changes**.
