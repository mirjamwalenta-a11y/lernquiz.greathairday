# Kompetenz-Landkarte V2 – Plan

**Stand:** 2026-11-19 · Entscheidungen der Inhaberin eingetragen.
**Status:** Schritte 1–3 gebaut (`kompetenzen.js`, `kompetenz-stand.js`, Landkarte im Lern-Tool). Meisterin-Ansicht folgt.
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
| 6 | Englisch im Salon | Englisch im Salon (Ergebnisse des Moduls) | Englisch im Salon | – (siehe unten) |
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

Bei der Umsetzung angepasst:

- **Englisch ohne Praxis-Bereich:** Ein Eintrag „Beratung am Gast“ sagt
  nicht, ob auf Englisch beraten wurde. Bestätigung über Prüfgespräch.
- **Praxis-Checks der Meisterin** (`PX_BEHANDLUNGEN`): Haarwäsche &
  Massage → 3, Empfang/Beratung → 5, Farbe → 7, Blondierung/Strähnen → 8,
  Damenschnitt → 9, Herrenschnitt → 10, Rasur & Bart → 11, Dauerwelle &
  Umformung → 12, Föhnen & Styling → 13, Hochstecken → 14, Hand- &
  Nagelpflege → 15. Erkannt über `frage_id = 'praxis-<id>'`, nicht über das
  Thema (Blondierung ist dort als Farbe gespeichert).
- **Haarschnitt geteilt, neue Checks** (Entscheidung der Inhaberin,
  2026-11-19): Der frühere Check „Haarschnitt“ (`schnitt`) ist in Damen-
  und Herrenschnitt geteilt; alte Einträge zählen weiter für beide. Neu:
  Rasur & Bart, Dauerwelle & Umformung, Hochstecken, Hand- & Nagelpflege.
  Die Checklisten-Punkte sind ein Entwurf im Stil der bestehenden Checks –
  **von der Inhaberin prüfen lassen**; eigene Punkte kann die Meisterin
  beim Check ohnehin ergänzen.

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
- **Kompetenzen ohne Praxis-Check** (1, 2, 4, 6, 16)
  erreichen ④ über Prüfgespräche: mindestens eines zu ihren Themen, und das
  jeweils letzte ist überall „verstanden“.
- **Es zählt das letzte Ergebnis** je Praxis-Check bzw. Thema; mehrere am
  selben Tag → das schwächste (wie bisher im Meisterin-Bereich).
- **Warnung „sicher, aber falsch“** ab 2× seit dem letzten Prüfgespräch
  (`sicher_falsch_offen`), dieselbe Schwelle wie der Prüfhinweis der
  Meisterin.
- **Stufe ②** gibt es vorerst nur bei Farbe (mind. 1 Farb-Fall „passt“).
  Die anderen Module speichern ihre Ergebnisse unter dem Quiz-Thema und
  zählen damit zu Stufe ①. Bei den übrigen Kompetenzen ist ② „nicht
  messbar“ und wird übersprungen.
- **Stufe ①** = alle Quiz-Themen der Kompetenz sitzen. Ohne Quiz-Themen
  (13–15, bis die Fragen da sind) ist ① „nicht messbar“.
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

1. ✓ Datei `kompetenzen.js` (statisch, wie `lern-themen.js`): Kompetenz →
   Quiz-Themen, Module, Praxis-Bereich, Praxis-Check. Keine Datenbank,
   keine persönlichen Daten.
2. ✓ `kompetenz-stand.js`: gemeinsame Rechnung. `themaStand` ersetzt die
   doppelte Ampel (`lkStand`/`stStatus` im Lern-Tool,
   `ampelStand`/`berechneStatus` im Lernquiz) – Ergebnis unverändert,
   geprüft mit 200 000 Zufallsfällen. `kompetenzStand`/`alleKompetenzen`
   rechnen die Stufen ①–④, werden aber noch nirgends angezeigt.
3. ✓ Landkarte im Lern-Tool auf Kompetenzen umgestellt (Entwurf von der
   Inhaberin freigegeben, 2026-11-19): vier Gruppen (Grundlagen, Am Gast,
   Farbe, Schnitt & Form), Überblick „x von 16 Kompetenzen bestätigt“,
   „Als Nächstes“ (Warnungen → bereit für die Meisterin → begonnen), je Feld
   ein Balken mit einem Teil pro Stufe, Fenster mit vier Stufen-Kacheln und
   den Quiz-Themen. Keine Lehrjahr-Auswahl mehr auf dieser Seite.
   „Auf dem Weg“ (hellgrün) fasst Wissen / Anwenden / Salon zusammen –
   bestehende Farben, keine neuen.
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
- Checklisten-Punkte der neuen Praxis-Checks prüfen (Inhaberin).
- LAP-Vorbereitung und Zwischenprüfung zählen noch zu keiner Kompetenz
  (Fragen haben dort kein Fach-Thema).
- Fragen für Föhnen & Styling, Hochstecken, Hand- & Nagelpflege
  (Inhaberin).
- Abgleich der 16 Kompetenzen mit dem Berufsbild.
