# Wörni V1 – ruhiger Lernbegleiter

**Stand:** 2026-11-14 · Umsetzung: `woerni-impulse.js`, eingebunden in
`lernquiz.html`, `lerntool.html`, `zwischenpruefung.html`.

Wörni ist in V1 ein ruhiger Lernbegleiter, kein Motivations- oder Pop-up-Tool.
(Die „Wörnis Tipps“ / „Wörni sagt“-Sprüche in `woernis-tipps.js` bleiben davon
getrennt; der KI-Trainer „Agent Wörni“ ist ebenfalls etwas anderes.)

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
r1–r3). Neue Sätze dort anhängen, bestehende `id`s nie umbenennen.
Regeln für neue Sätze: genau ein Satz, höchstens 14 Wörter, keine Frage,
kein Ausrufezeichen, keine Emojis, keine Floskeln, Haltung statt Fachwissen.

**Zurückgestellt** (z. B. für eine spätere Lernplan-Ansicht): korrigierende
Pausen-Impulse wie „Warte nicht auf viel freie Zeit, eine kurze Runde zählt
genauso.“ oder „Lernen kurz vor der Prüfung ersetzt nicht das Üben
zwischendurch.“

## Noch nicht in V1

- Themen-Quiz im Lern-Tool und die Quizze in den Lern-Modulen (Farblabor,
  Werkzeugkunde, Umformung …): nur das Haupt-Quiz im Lernquiz hat A, B, E.
- Abschalten durch Meisterin oder Lehrling (bewusst weggelassen, die
  Häufigkeit ist niedrig).
