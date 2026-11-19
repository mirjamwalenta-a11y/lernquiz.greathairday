# Kompetenz-Landkarte V2 – Plan

**Stand:** 2026-11-19 · Entscheidungen der Inhaberin eingetragen.
**Status:** Plan, noch nicht gebaut.
**Heute:** Landkarte im Lern-Tool (`lerntool.html`, Seite „Fortschritt“,
`lkZeichnen`), Themen in `lern-themen.js`, Meisterin-Ansicht in
`lernquiz.html` (`renderKompetenz`, `ampelStand`).

Ziel: Die App verbindet Lernen, Anwenden, Praxis und Feedback und zeigt,
was ein Lehrling **kann**, nicht nur, welche Quizfragen er schafft. Die
Landkarte ist das Fundament für den persönlichen Lernpfad („Heute üben“),
die Meisterin-Ansicht „Wo braucht mich mein Lehrling?“ und später Wörnis
Diagnose.

---

## 1. Was an der heutigen Landkarte nicht passt

1. **Quiz-Kapitel statt Können.** 21 Lehrstoff-Themen, darunter
   „LAP-Vorbereitung“ und „Salon-Organisation“. Überschneidungen:
   „Farbenlehre & Coloration“ / „Colorationsgrundlagen“; drei Themen zu
   Beratung und Kommunikation.
2. **Nach Lehrjahr getrennt.** Themen früherer Lehrjahre rutschen unter
   „Auch geübt“, es gibt kein Gesamtbild.
3. **Praxis zählt für den Lehrling nicht.** Praxis-Check und Prüfgespräch
   der Meisterin sieht nur die Meisterin. Beim Lehrling kann ein Thema
   „sitzt“ zeigen, obwohl die Meisterin „in der Praxis noch nicht sicher“
   eingetragen hat.
4. **Praxis-Tagebuch ohne Verbindung.** Die 11 Bereiche haben kein
   Gegenstück auf der Landkarte (Föhnen, Hochstecken, Haarwäsche,
   Nagelpflege fehlen ganz).
5. **Module speichern uneinheitlich.** Farblabor → Thema aus dem
   1. Lehrjahr; Englisch und Zwischenprüfung als eigene „Themen“, die in
   keinem Lehrjahr vorkommen.
6. **Zwei verschiedene Rechnungen.** Meisterin-Ansicht färbt nach Prozent,
   Lehrling sieht die Ampel – für dasselbe Thema.

## 2. Zwei Ebenen

- **Quiz-Themen bleiben unverändert.** Fragen, Wiederholung und alle
  gespeicherten Ergebnisse (`kompetenz`, `verlauf`, `wiederholung`) hängen
  daran.
- **Darüber: 16 Kompetenzen.** Jede sammelt Quiz, Module, Praxis-Tagebuch
  und Bestätigung der Meisterin ein.

## 3. Die 16 Kompetenzen

| # | Kompetenz | Wissen (Quiz-Themen) | Anwenden (Module) | Praxis-Tagebuch |
|---|---|---|---|---|
| 1 | Hygiene & Arbeitssicherheit | Hygiene & Schutzmaßnahmen, Unfallverhütung & Arbeitssicherheit | – | – (gilt bei allen Bereichen) |
| 2 | Haar- & Kopfhautdiagnose | Haarkunde & Haarstruktur, Hautkunde | – | – |
| 3 | Pflege & Kopfmassage | Kopfhautpflege, Pflegeprodukte & Wirkstoffe | – | Haarwäsche & Kopfmassage |
| 4 | Werkzeug & Material | Werkzeugkunde | Werkzeugkunde | – |
| 5 | Beratung & Kundengespräch | Beratungsgespräch & Kundenkommunikation, Kundenberatung, Kundenkommunikation Fortgeschritten | Beratung & Formwirkung, Kurz sortieren | Beratung am Gast |
| 6 | Englisch im Salon | – | Englisch im Salon | Beratung am Gast |
| 7 | Farbe & Rezeptur | Farbenlehre & Coloration, Colorationsgrundlagen, Fachkunde Chemie | Farblabor, Farb-Spickzettel, Farb-Fälle | Farbe |
| 8 | Blondierung, Strähnen & Balayage | Balayage & Strähnen | – | Strähnen & Balayage |
| 9 | Damenschnitt | Haarschnitt Techniken | Schnittwerkstatt, Baukasten, Schnittdesigner | Damenschnitt |
| 10 | Herrenschnitt & Maschine | Haarschnitt Techniken, Herrenservice | Maschine (Beratung & Formwirkung) | Herrenschnitt |
| 11 | Rasur & Bart | Herrenservice | – | Rasur & Bart |
| 12 | Umformung (Dauerwelle & Glättung) | Dauerwelle & Umformung, Umformungen Fortgeschritten, Fachkunde Chemie | Umformung | Dauerwelle & Umformung |
| 13 | Föhnen & Styling | **neu:** Föhnen & Styling | – | Föhnen |
| 14 | Hochstecken | **neu:** Hochstecken | – | Hochstecken |
| 15 | Hand- & Nagelpflege | **neu:** Hand- & Nagelpflege | – | Nagelpflege |
| 16 | Betrieb & Organisation | Salon-Organisation, Betriebskunde & Recht | – | – |

**Keine eigene Kompetenz:**

- **LAP-Vorbereitung, Zwischenprüfung:** Prüfungsformen. Ihre Fragen
  zählen auf die Kompetenz, zu der sie inhaltlich gehören.
- **Fachkunde Chemie:** Grundlage, zählt bei Farbe (7) und Umformung (12).
- **Perücken:** nicht aufnehmen (Entscheidung der Inhaberin).

Die Liste ist aus dem Code abgeleitet. Abgleich mit Berufsbild bzw.
Ausbildungsordnung durch die Inhaberin.

## 4. Vier Stufen je Kompetenz

| Stufe | Bedeutung | Quelle |
|---|---|---|
| ① Weiß ich | Quiz sitzt, auch ein paar Tage später noch | heutige Ampel-Logik (`kompetenz`) |
| ② Kann ich anwenden | Fall oder Übung im Modul gelöst | z. B. Farb-Fall „passt“ (`farb_plaene`), Modul-Quiz |
| ③ Im Salon gemacht | **mindestens 3 Einträge** im Praxis-Tagebuch zu diesem Bereich | `praxis_eintraege` |
| ④ Bestätigt | Meisterin: „in der Praxis sicher gemacht“ / „verstanden“ | `pruefgespraeche` (art `praxis` bzw. `gespraech`) |

Regeln:

- **Grün nur mit Stufe ④** (Bestätigung durch die Meisterin).
- **Warnung geht vor:** „noch nicht sicher“ der Meisterin oder „sicher,
  aber falsch“ im Quiz → Kompetenz ist nicht grün, egal wie gut die
  Quizpunkte sind.
- **Kompetenzen ohne Praxis-Bereich** (2, 4, 16) erreichen ④ über das
  Prüfgespräch.
- **Der Lehrling sieht Praxis-Checks und Prüfgespräche der Meisterin**
  (Entscheidung der Inhaberin). Die Datenbank erlaubt das schon: Lehrling
  darf eigene Zeilen in `pruefgespraeche` lesen
  (`supabase/20261031_pruefgespraeche.sql`). Keine Änderung an RLS nötig.
- **Eine gemeinsame Rechnung** für Lehrling und Meisterin (heute doppelt:
  `lkStand` in `lerntool.html`, `ampelStand` in `lernquiz.html`).

## 5. Neue Lerninhalte für die drei Lücken

Föhnen & Styling, Hochstecken und Hand- & Nagelpflege bekommen eigene
Quiz-Themen (Entscheidung der Inhaberin). **Die Inhalte liefert die
Inhaberin.** Technisch: neue Themen in der Fragenliste, keine neue
Tabelle. Bis die Fragen da sind, zählen dort nur Stufe ③ und ④.

## 6. Umsetzung (wenn freigegeben)

1. Datei `kompetenzen.js` (statisch, wie `lern-themen.js`): Kompetenz →
   Quiz-Themen, Module, Praxis-Bereich. Keine Datenbank, keine
   persönlichen Daten.
2. Eine gemeinsame Funktion für den Stand (Stufen ①–④ + Warnung), genutzt
   von Lern-Tool und Meisterin-Bereich.
3. Landkarte im Lern-Tool auf Kompetenzen umstellen; Quiz-Themen bleiben
   im Detail-Fenster sichtbar.
4. Meisterin-Bereich: dieselbe Landkarte, dazu „Wo braucht mich mein
   Lehrling?“.
5. Danach: „Heute üben“ nach der schwächsten Kompetenz statt nach
   Wochentag.

**Design:** vorhandene Felder, Farben und Stile der Landkarte. Die Anzeige
der vier Stufen ist eine sichtbare Änderung und wird der Inhaberin vor dem
Live-Gang gezeigt (CLAUDE.md, „Design und Farben“).

**Sicherheit:** Schritte 1–5 brauchen keine neue Tabelle. Falls doch eine
dazukommt: RLS und Grants in derselben Migration (CLAUDE.md, Regel 1).

## 7. Offen

- Farbkorrektur: eigene Kompetenz oder Teil von „Farbe & Rezeptur“?
  (Vorschlag: vorerst Teil von 7.)
- Fragen für Föhnen & Styling, Hochstecken, Hand- & Nagelpflege
  (Inhaberin).
- Abgleich der 16 Kompetenzen mit dem Berufsbild.
