# Wörni als Begleiter von Tag 1 bis zur LAP (V1)

**Stand:** 2026-11-20 · Umsetzung: `woerni-begleiter.js`, eingebunden in
`lerntool.html` (Seiten `p-woerni` und `p-probezeit`, Kachel „Wörni fragen“
direkt unter Wörnis Karte auf der Startseite – dort sind seit 2026-11-21 auch
„Kurz sortieren“ und „Woran liegt's?“ verlinkt, Sprungziele `lerntool.html#woerni` und
`lerntool.html#probezeit`).

Baut auf Wörni V1 auf (`docs/woerni-v1.md`): Impulse im Quiz, „Kurz sortieren“
und „Woran liegt's?“ bleiben unverändert. Der KI-Trainer „Agent Wörni“
(Beratung & Formwirkung) ist davon getrennt.

## Entscheidung: regelbasiert, ohne KI

„Frag Wörni“ antwortet aus festen Antworten in `woerni-begleiter.js`
(`ANTWORTEN`, `MODULE`, `NOT`). Entschieden von der Inhaberin am 2026-11-20.

Die Gründe dafür:
- Es geht nichts an Dritte, und die Antworten sind vorab geprüft.
- Es funktioniert offline und in allen Salons (die KI ist laut Datenschutzseite
  nur im eigenen Salon erlaubt).

Passt keine Antwort, sagt Wörni ehrlich „nicht sicher“. Dann bietet er die
Suche in Wissensbank und Fachbegriffen an und einen fertigen Satz, mit dem der
Lehrling die Meisterin fragen kann.

## Vorstellung und Verhaltensregeln (seit 2026-11-20)

- **Vorstellung:** Beim ersten Öffnen stellt sich Wörni als persönlicher Coach vor. Das passiert auf der Startseite vor allen anderen Wörni-Karten und oben auf der Wörni-Seite. Nach „Los geht’s ✓“, „Verhaltensregeln lesen“ oder „Wörni fragen“ erscheint die Vorstellung nicht mehr. Gemerkt wird das nur auf dem Gerät.
- **Verhaltensregeln:** Der Wortlaut der Inhaberin steht in `salon-regeln.js`. Wörni zeigt die Regeln auf der Seite `p-regeln` (Sprungziel `lerntool.html#regeln`) und erklärt zu jedem Abschnitt kurz das Warum. Die Antworten von „Frag Wörni“ zu Krankmeldung, Urlaub, Mittagspause, freier Zeit und Ausbildungsbuch, Hygiene sowie Kleidung folgen diesen Regeln.
- **Bestätigung** „Ich habe die Verhaltensregeln gelesen und zur Kenntnis genommen!“: Bei eingeloggten Lehrlingen wird sie in der Tabelle `regeln_bestaetigung` gespeichert (`supabase/20261120_regeln_bestaetigung.sql`, seit 2026-11-20 auf Wunsch der Inhaberin). Gespeichert werden nur Lehrling, Stand der Regeln und Datum. Das Datum setzt der Server.
  - Der Lehrling darf nur die eigene Bestätigung anlegen und lesen.
  - Die Meisterin darf alle Bestätigungen lesen und löschen. Sie sieht sie in der Lehrlings-Liste („📋 Regeln noch nicht bestätigt“ bzw. „Regeln bestätigt am …“) und im Kopf der Detail-Ansicht.
  - Ohne Verbindung oder vor der Migration merkt sich das Gerät die Bestätigung. Beim nächsten Öffnen der Seite wird sie nachgeschickt, oder der Lehrling tippt auf „Nochmal senden“.
  - Ändert sich `stand` in `salon-regeln.js`, wird erneut gefragt.
  - Das ist die einzige Ausnahme von „keine Daten in der Begleitung“. Fragen an Wörni und Probezeit-Inhalte bleiben ungespeichert.
- **Für andere Salons (Abo):** `salon-regeln.js` enthält die Regeln des eigenen Salons. Vor dem Verkauf muss das pro Salon austauschbar werden.

## Drei Teile

| Teil | Was | Wo |
|---|---|---|
| Proaktiv | Ein Impuls je Phase: Titel, kurzer Text, eine Frage zum Nachdenken, Link ins passende Modul | Startseite im Platz von „Wörni sagt“, bis „Gelesen ✓“; oben auf der Wörni-Seite |
| Probezeit | Vier Kapitel: Wozu die Probezeit da ist · Realitätscheck Friseurlehre · Haltung und das Warum (Gäste als willkommene Gäste) · Was dir in der App hilft | Seite „Deine Probezeit“ |
| Frag Wörni + App-Lotse | Freie Frage oder Vorschlag antippen, Antwort mit passenden Modulen. Darunter: „Jetzt besonders sinnvoll“ je Phase und alle Bereiche erklärt (wofür, wann) | Seite „Wörni – dein Begleiter“ |

## Phasen und Rhythmus

Die Phase wird aus `lehrlinge.lehrbeginn` gerechnet. Fehlt der Lehrbeginn,
nimmt Wörni das Lehrjahr (dann gibt es keine Probezeit-Impulse).

| Phase | Zeitraum ab Lehrbeginn | Rhythmus | Vorrat |
|---|---|---|---|
| Probezeit · Ankommen | Tag 1–14 | jeden Tag ein neuer | 14 (`pz-t1` … `pz-t14`) |
| Probezeit | Tag 15–90 | einer pro Woche | 11 (`pz-w3` … `pz-w13`) |
| 1. Lehrjahr | bis Tag 365 | einer pro Woche, im Kreis | 8 |
| 2. Lehrjahr | bis Tag 730 | einer pro Woche, im Kreis | 7 |
| 3. Lehrjahr | bis Tag 975 | einer pro Woche, im Kreis | 6 |
| LAP-Endspurt | ab Tag 975 (ca. 4 Monate vor Ende) | einer pro Woche, im Kreis | 5 |

Wenn der Lehrbeginn fehlt, sollte die Meisterin ihn beim Lehrling eintragen
(Lehrling bearbeiten → Lehrbeginn). Erst dann startet die Begleitung an Tag 1.

## Anti-Nerv-Regeln

- Kein Pop-up, kein Ton. Die Karte steht nur im Platz von „Wörni sagt“.
- Vorrang auf der Startseite: Wiedereinstieg (nach ≥ 7 Tagen Pause) zuerst,
  dann der Begleiter-Impuls, sonst „Wörni sagt“.
- „Gelesen ✓“ blendet den Impuls bis zum nächsten Tag bzw. zur nächsten Woche aus.
- Nur für eingeloggte Lehrlinge. Bei der Meisterin erscheint auf der Startseite
  kein Begleiter-Impuls.

## Datentrennung (verbindlich)

- Wörni liest **keine** Probezeit-Beurteilungen. Die Tabellen `probezeiten`,
  `probezeit_wochen`, `probezeit_monats_feedback` und `probezeit_quiz*` liest
  er nicht, ebenso wenig Vertrags-, Adress- oder Personaldaten. Die
  Probezeit-Werkzeuge der Meisterin in der Schnuppertag-App bleiben völlig
  getrennt.
- Gelesen wird nur `lehrlinge.lehrbeginn` (eigene Zeile, bestehende RLS
  `lehrlinge_eigener`). Daraus wird im Browser die Phase gerechnet.
- Keine neue Tabelle und nichts am Server, mit einer Ausnahme: die Bestätigung der
  Verhaltensregeln (`regeln_bestaetigung`, siehe oben).
- Auf dem Gerät (`localStorage`, Schlüssel `woerni-begleiter`) steht nur, welcher
  Impuls zuletzt als gelesen markiert wurde.
- Fragen an „Frag Wörni“ werden **nirgends** gespeichert, auch nicht auf dem
  Gerät. Der Verlauf verschwindet beim Verlassen der Seite.

## Sicherheit

Bestimmte Wörter gehen allen anderen Antworten vor (`NOT`):
- **Verletzung, Hautreaktion, Chemie im Auge:** sofort aufhören, Bescheid geben, Notruf 144.
- **Mobbing, Belästigung, Gewalt:** Vertrauensperson; Rat auf Draht 147 (anonym, rund um die Uhr); Arbeiterkammer.
- **Suizidgedanken, Selbstverletzung:** Rat auf Draht 147, Notruf 144, nicht allein bleiben.

Diese Hinweise sind für Österreich. In anderen Ländern sind die Nummern
anzupassen.

## Zur Durchsicht durch die Inhaberin

Alle Texte in `woerni-begleiter.js` sind Entwürfe zum Prüfen:
- `TAGE`, `PROBEZEIT_WOCHEN`, `POOLS`
- `PROBEZEIT`
- `ANTWORTEN`

Besonders wichtig sind die Salon-Regeln: Krankmeldung, Handy, Kleidung,
Hauttest, Begrüßung („Grüß Gott“). Wo der Salon eigene Regeln hat, verweist
Wörni an die Meisterin.

Regeln für neue Antworten:
- in Du-Form, wertschätzend, klar und kurz
- keine Zusagen zu Vertrag, Lohn oder Urlaub
- fachliche Details nur mit Verweis in die passenden Module

Neue Einträge anhängen. Die `id`s der Impulse ergeben sich aus der Position,
deshalb Impulse innerhalb einer Phase nicht umsortieren.

## Nicht in V1

- Abschalten der Startseiten-Karte durch Lehrling oder Meisterin
- Eigene Antworten durch die Meisterin pflegen (wäre eine Tabelle mit RLS)
- Begleiter in den eigenständigen Lern-Seiten (Farblabor, Umformung …)
