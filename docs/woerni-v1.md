# Wörni V1 – ruhiger Lernbegleiter

**Stand:** 2026-11-14 · Umsetzung: `woerni-impulse.js`, eingebunden in
`lernquiz.html`, `lerntool.html`, `zwischenpruefung.html`.

Wörni ist in V1 ein ruhiger Lernbegleiter, kein Motivations- oder Pop-up-Tool.
(Die „Wörnis Tipps“ / „Wörni sagt“-Sprüche in `woernis-tipps.js` bleiben davon
getrennt; der KI-Trainer „Agent Wörni“ ist ebenfalls etwas anderes.)

**Seit 2026-11-20:** Wörni als Begleiter von Tag 1 bis zur LAP (Impulse je
Phase, Modul Probezeit, „Frag Wörni“, App-Lotse): `docs/woerni-begleiter-v1.md`.

## Leitlinien

1. **Wörni begleitet, er unterbricht nicht.** Kurz, sparsam, passend zum Moment.
2. **Wörni stärkt Haltung, nicht Stimmung.** Klarheit, Sorgfalt, Dranbleiben,
   Verantwortung statt allgemeinem Lob.
3. **Wörni reagiert auf Lernverhalten**, nicht nur auf richtig oder falsch.
4. **Regelbasiert und einfach.** Keine komplexe Logik, keine künstliche
   Personalisierung, keine Überinszenierung.
5. **Erfolg = Wirkung, nicht Nettigkeit.**

## Momente

| Moment | Auslöser | Wo | Ton |
|---|---|---|---|
| A · falsch | falsche Antwort im Quiz; nicht bei „richtig, aber geraten“ und nicht bei „sicher, aber falsch“, weil die App dort schon einen Hinweis zeigt | Zeile unter der Erklärung | korrigierend, ruhig |
| B · wiederholt | falsche Antwort bei einer Frage, die schon in der Wiederholung stand, in der Wiederholungsrunde, oder 2. Fehler im selben Thema derselben Runde | Zeile unter der Erklärung, statt A | korrigierend, ruhig |
| C · Wiedereinstieg | letzte Lernrunde ≥ 7 Tage her (nur mit Vorgeschichte, nie bei der Meisterin) | Startseite Lern-Tool, statt „Wörni sagt“, bis wieder gelernt wurde | ruhig, bestärkend |
| D · Praxis | Übung mit Timer in der Zwischenprüfung, vor dem Start · erstes Öffnen der Praxis-Module am Tag | Zeile über dem Timer bzw. oben auf der Seite | ruhig, korrigierend |
| E · richtig nach Fehler | richtige, sichere Antwort auf eine Frage, die in der Wiederholung steht (noch nicht „sitzt“), keine Zusatzfrage | Zeile unter der Erklärung | ruhig, bestärkend |

Bewusst **nicht** in V1: „Vor einer Frage“ (wäre vor jeder Frage sichtbar),
allgemeines Lob bei richtigen Antworten, Hinweise auf „wenig Aktivität“
während der Woche (das zeigt schon das Wochenziel), korrigierende
Pausen-Impulse auf der Startseite.

## Anti-Nerv-Regeln

1. Höchstens **ein Impuls pro Quizrunde** (inkl. Wiederholungsrunde). Der erste
   passende Anlass gewinnt; trifft eine Antwort auf A und B zu, gilt B.
   Außerhalb des Quiz höchstens einer pro Seite.
2. **Nie als Pop-up**: keine Überlagerung, kein Ton, keine Animation, kein
   Extra-Antippen. Wörni steht in der Zeile, die man ohnehin liest.
3. **Rotation**: jeder Moment hat einen eigenen Vorrat; derselbe Satz frühestens
   nach **14 Tagen** wieder. Ist alles verbraucht, schweigt Wörni.
4. **Ruhe bei Prüfungssimulationen**: kein Wörni im LAP-Modus des Lernquiz, in
   der Fachgespräch- und Prüfungstag-Simulation und bei laufendem Timer
   (die Zeile verschwindet mit „Start“).
5. Wiedereinstieg **nur mit Vorgeschichte**; derselbe Satz bleibt stehen, bis
   wieder eine Runde gemacht wurde.
6. Gemerkt wird nur **auf dem Gerät** (`localStorage`, Schlüssel `woerni-v1`).
   Nichts geht an den Server.

## Wirkung messen

Aus vorhandenen Daten, ohne neue Tabelle und ohne Tracking.

| Ziel | Messgröße | Quelle |
|---|---|---|
| Weniger Wiederholungsfehler | Anteil Wiederholungsfragen, die erneut falsch sind | `wiederholung` (Stufe fällt auf 0) |
| Regelmäßiger dranbleiben | Lerntage pro Woche, erreichte Wochenziele | `verlauf`, `lehrlinge.wochenziel` |
| Besserer Wiedereinstieg | nach ≥ 7 Tagen Pause: zweite Runde innerhalb von 3 Tagen | `verlauf` |
| Ruhigere, klarere Lernführung | kurze Befragung von 3–5 Lehrlingen nach 4 Wochen, Feedback-Knopf | Gespräch |

Vergleich: 4 Wochen vor dem Start gegen 4 Wochen danach (erste Gruppe z. B.
die Test-Zugänge eines Partnersalons).

## Impulse V1

Stehen mit fester `id` in `woerni-impulse.js` (f1–f5, w1–w6, e1–e8, p1–p5,
r1–r3, c1–c6). Neue Sätze dort anhängen, bestehende `id`s nie umbenennen.
Regeln für neue Sätze: genau ein Satz, höchstens 14 Wörter, keine Frage,
kein Ausrufezeichen, keine Emojis, keine Floskeln, Haltung statt Fachwissen.

**Coach-Sätze (2026-11-15):** `c1` (Moment falsch, „Leucht-Turm“), `c2`
(Wiedereinstieg, „Energie-Fresser“) `c3` (Wiedereinstieg, „Kraft-Akt“) `c4` (Praxis, „Joy-Ride“), `c5` (Wiedereinstieg, „Lang-Strecke“) und `c6`
(richtig nach Fehler, „Wert-Schätzung“) sind bewusste Ausnahmen von diesen
Satzregeln: länger, direkter, mit Ausrufezeichen. Sie laufen in der normalen
Rotation mit (14-Tage-Sperre, höchstens ein Impuls pro Runde). Derselbe Text
steht auch als Spruch in `woernis-tipps.js`.

**Zurückgestellt** (z. B. für eine spätere Lernplan-Ansicht): korrigierende
Pausen-Impulse wie „Warte nicht auf viel freie Zeit, eine kurze Runde zählt
genauso.“ oder „Lernen kurz vor der Prüfung ersetzt nicht das Üben
zwischendurch.“

## Kurz sortieren (2026-11-18)

Umsetzung: `woerni-sortieren.js`, Seite `p-sortieren` im Lern-Tool
(Kachel „Kurz sortieren“ auf der Startseite, Sprungziel
`lerntool.html#sortieren` bzw. `#sortieren=unsicher`).

Ein Bereich für Stress-, Unsicherheits- und Lernmomente im Ausbildungsalltag.
Ziel: in **unter einer Minute** zurück zu einem klaren nächsten Lern- oder
Handlungsschritt (drei Antipper: Bereich, Situation, Option).

- Der Lehrling **wählt selbst** eine von fünf Situationen: nervös vor einem
  Schritt · Fehler gemacht · alles zu viel · bei einem Schritt unsicher ·
  hänge nach Rückmeldung.
- Pro Situation **ein sehr kurzer Impuls** zur Einordnung und **genau drei
  Optionen**, die in bestehende Wege führen: Praxis-Module (inkl.
  Praxis-Tagebuch), Themen-Quiz, Wiederholen, heutiger Lernplan-Schritt,
  Schnell-Check im Lernquiz, A–Z-Verzeichnis, oder eine fertige Formulierung,
  um die Meisterin direkt anzusprechen.
- Wörni **deutet keine Gefühle**, ersetzt keine Meisterin und führt keine
  Gespräche. Unter der Auswahl steht ein Satz, bei Verletzung, Hautreaktion
  oder wenn es länger nicht gut geht, sofort jemandem im Salon Bescheid zu geben.

**Automatisch** erscheint in V1 nur ein dezenter Hinweis (eine Wörni-Zeile mit
Link „Kurz sortieren →“, Situation „unsicher“ vorausgewählt):

| Auslöser | Wo |
|---|---|
| Wiederholtes Nachschlagen: derselbe Reiter eines Praxis-Moduls im Lern-Tool zum 3. Mal innerhalb von 10 Minuten geöffnet | unter den Reitern des Moduls |
| Wiederholte Probleme im selben Mikro-Thema: 2. Fehler im selben Thema derselben Quizrunde (nicht im LAP-Modus) | im Lernquiz unter der Erklärung, statt des Wörni-Impulses für diese Antwort |

Anti-Nerv-Regeln: höchstens **einmal am Tag** (geräteweit), im Quiz höchstens
einmal pro Runde, nicht innerhalb von 30 Minuten, nachdem „Kurz sortieren“
offen war. Gemerkt wird nur auf dem Gerät (`localStorage`, Schlüssel
`woerni-sortieren`: Tag des letzten Hinweises, Zeitpunkt des letzten
Öffnens). **Welche Situation gewählt wurde, wird nirgends gespeichert**, es
gibt keine neue Tabelle und nichts geht an den Server.

Nicht in V1: Hinweis in den eigenständigen Lern-Seiten (Umformung,
Schnittwerkstatt, Farblabor …) und im Themen-Quiz des Lern-Tools; Auswertung,
welche Situationen gewählt werden.

## Noch nicht in V1

- Themen-Quiz im Lern-Tool und die Quizze in den Lern-Modulen (Farblabor,
  Werkzeugkunde, Umformung …): nur das Haupt-Quiz im Lernquiz hat A, B, E.
- Abschalten durch Meisterin oder Lehrling (bewusst weggelassen, die
  Häufigkeit ist niedrig).

## „Woran liegt's?“ – Fehlerdiagnose (seit 2026-11-19)

Umsetzung: `woerni-diagnose.js`, eingebunden in `lerntool.html` (Kachel auf der
Startseite unter „Kurz sortieren“ und Knopf im Fenster der Kompetenz-Landkarte bei
Kompetenzen mit Diagnose).

- Der Lehrling wählt einen typischen Fehler, beantwortet 2–3 Fragen zum Antippen und
  bekommt: wahrscheinliche Ursache, kurze Erklärung, „Beim nächsten Mal“ und drei
  nächste Schritte (Themen-Quiz, Modul, „Deine Meisterin fragen“ mit fertigem Satz).
- Passt keine Regel, sagt Wörni ehrlich „nicht sicher“ und verweist an die Meisterin.
- Regelbasiert, ohne KI, nichts gespeichert.
- Diagnosen: Farbe zu warm, Übergang beim Herrenschnitt (aus der Fehlertabelle in
  `docs/maschinenhaarschnitt-ohne-aufsteckkamm-v1.md`), Blondierung ungleichmäßig
  (von der Inhaberin geprüft); Dauerwelle hält nicht (Erklärungen aus dem Modul
  Umformung), Föhnfrisur fällt zusammen (beide zur Durchsicht durch die Inhaberin).


## „Wörni, ich steh auf der Leitung“ (2026-11-25)

Knopf unter den Antworten einer Multiple-Choice-Frage im Lernquiz
(`woerni-leitung.js`). Statt der Lösung zeigt Wörni ein Bild aus dem
Salonalltag oder eine Eselsbrücke und stellt eine leichte Gegenfrage zum
Antippen; danach beantwortet der Lehrling die eigentliche Frage selbst.

- Nur für Fragen mit Eintrag in `woerni-leitung.js`, nie im LAP-Modus, nicht
  bei Zusatzfragen. Stand: Farbe & Blondierung (15), Haarkunde (9),
  Dauerwelle (5), Hygiene (9), Werkzeug/Schere (2), Hautkunde (11),
  Haarwäsche (9); gleiche Fragen in mehreren Lehrjahren teilen sich einen Eintrag.
- Auch im Wissens-Check der Schnittwerkstatt (15 Fragen, Schlüssel `sw1`–`sw15`
  nach Reihenfolge, abgesichert über den Anfang des Fragetexts). Dort zählt eine
  richtige Antwort mit Hilfe ebenfalls wie geraten; Aussehen aus der Seite selbst
  (Knopf wie „Geraten – prüfen“).
- Mit Hilfe zählt eine richtige Antwort wie „geraten“ (halbe Punkte, kommt in
  die Wiederholung). Das steht auch im Hilfe-Kasten.
- Regelbasiert, keine KI zur Laufzeit, nichts gespeichert, kein Server.
  Texte fachlich durch die Meisterin prüfen.
- **Schreibstandard seit 2026-11-26** (Vorgabe der Inhaberin): Fachlogik zuerst,
  Beispiele aus dem Salon statt Alltagsvergleichen, Praxis-Hinweise gegen falsche
  Behandlungslogik, Gegenfrage als Prüffrage aus dem Arbeitsablauf, sachlicher Ton.
  Alle Texte sind nach diesem Standard überarbeitet (2026-11-26).
