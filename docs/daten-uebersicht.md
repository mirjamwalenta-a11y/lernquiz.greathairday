# Daten-Übersicht der Lern-Apps

**Wofür:** Grundlage für die Datenschutzerklärung (Anwältin) und für die
Entscheidung, wie die App an andere Salons verkauft werden kann.
**Stand:** 2026-11-12, erstellt aus dem Code dieses Repos und den
SQL-Dateien in `supabase/`. Tabellen, die außerhalb dieses Repos angelegt
wurden, sind aus dem Code abgeleitet. Bitte im Supabase-Dashboard
gegenprüfen (Table Editor).

Keine Rechtsberatung: Diese Übersicht beschreibt nur, was technisch passiert.

---

## 1. Wer nutzt die App?

| Rolle | Wie angemeldet | Was sie sieht |
|---|---|---|
| **Meisterin** | E-Mail + Passwort. Die Rolle prüft der Server (`ist_meisterin()`, Tabelle `app_rollen`). | Alles: alle Lehrlinge, Ergebnisse, Notizen, Schnuppertage, Probezeiten |
| **Lehrling** | Name + 6-stellige PIN. Intern wird daraus eine Konto-Adresse gebildet: `vorname.nachname.lernquiz@greathairday.at` (keine echte Postadresse). | Nur die eigenen Daten, dazu die Lernfragen |
| **Bewerberin am Schnuppertag** | Ohne Anmeldung | Kann nur ihren Test abschicken (Funktion `schnuppertag_test_einreichen`), nichts lesen |
| **Wochenquiz-Link (Probezeit)** | Ohne Anmeldung | Kann Fragen und Ziele lesen und Antworten abschicken (vier „Anon“-Regeln) |

Neue Konten gibt es nur auf Einladung: Die Meisterin merkt die Adresse vor,
ein Auth-Hook lehnt alle anderen Registrierungen ab
(`supabase/20261010_registrierung_nur_auf_einladung.sql`).

## 2. Was am Server gespeichert wird (Supabase)

Supabase-Projekt `wrxlaltgtgkdomklgrlj`. **Dieses Projekt teilen sich
mehrere Apps**, auch die Team-App mit Mitarbeiterdaten.

### Personen und Zugang

| Tabelle | Inhalt | Personenbezug |
|---|---|---|
| `auth.users` (Supabase) | Konto-Adresse, Passwort bzw. PIN (nur als Hash), Zeitpunkt der letzten Anmeldung | Ja |
| `lehrlinge` | Name, Lehrjahr, aktiv/gesperrt, Wochenziel, Lehrbeginn, „nur zum Testen“, Verknüpfung zum Konto, ausgeschieden am | Ja, Minderjährige möglich. Nach „Ausgeschieden“: Name ersetzt, kein Konto mehr (siehe unten) |
| `app_rollen` | Wer Meisterin ist | Ja |
| `registrierung_vorgemerkt` | Vorgemerkte Konto-Adressen, 10 Minuten gültig | Ja, kurzlebig |

### Lernen

| Tabelle | Inhalt | Personenbezug |
|---|---|---|
| `fragen` | Quizfragen (Inhalte) | Nein |
| `lerntool_daten` | Einstellungen des Lern-Tools, z. B. Einwirkzeiten | Nein |
| `verlauf` | Jedes Quiz: Datum, Lehrjahr, richtig/falsch, Punkte, schwache Themen, Modus | Ja |
| `kompetenz` | Stand je Thema: sicher, geraten, sicher falsch, zuletzt geübt | Ja |
| `wiederholung` | Welche Frage wann wiederholt wird | Ja |
| `lernquiz_abzeichen` | Erhaltene Abzeichen | Ja |
| `ghd_streaks` | Lernserien (Tage am Stück) | Ja |
| `en_verlauf` | Ergebnisse im Englisch-Modul | Ja |

### Ausbildungs-Dokumentation

| Tabelle | Inhalt | Personenbezug |
|---|---|---|
| `praxis_eintraege` | Praxis-Tagebuch: Datum, Bereich, Dauer, Details, kontrolliert von, Notiz, Bestätigung, **Notiz der Meisterin** | Ja, Bewertung |
| `praxis_fotos` + Storage-Bucket `praxis-fotos` (privat) | Bis zu 3 Fotos pro Praxis-Eintrag (verkleinert, ohne Bild-Metadaten wie den Aufnahmeort), Motiv (Übungskopf oder Modell ohne Gesicht), Häkchen „Einverständnis des Modells liegt vor“. Sehen: der Lehrling die eigenen, die Meisterin alle. Markierungen der Meisterin (Striche, Kreise, Pfeile) als eigene Ebene, das Foto bleibt unverändert (`20261116_praxis_fotos_zeichnung.sql`). Seit 2026-11-16, `supabase/20261116_praxis_fotos.sql` | Ja, Bilder; bei Modellen auch Dritte |
| `pruefgespraeche` | Prüfgespräche und Praxis-Checks: Thema, Frage, Ergebnis (verstanden/teilweise/nicht), Notiz, Checkliste | Ja, Bewertung |
| `farb_faelle` | Übungsfälle der Meisterin (Inhalte) | Nein |
| `farb_plaene` | Farbpläne der Lehrlinge mit Rezeptur, Begründung, Status und Rückmeldung der Meisterin | Ja, Bewertung |
| `lehrlinge_rueckmeldung` | Rückmeldung des Lehrlings zur Lern-App: wie hilfreich (1–5), leichter als mit Unterlagen (ja/teils/nein), was am meisten hilft, zwei Freitexte, Einwilligung „Zitat ohne Namen verwenden“ (`zitat_ok`, nur der Lehrling selbst kann sie geben oder zurücknehmen). Sehen: der Lehrling die eigenen, die Meisterin alle (mit Namen); die Meisterin kann löschen, aber nichts ändern. Freigegebene Zitate erscheinen ohne Namen im Ausbildungsbericht. Seit 2026-11-17, `supabase/20261117_lehrlinge_rueckmeldung.sql` | Ja, Meinung; Zitate nur mit Einwilligung, bei Minderjährigen auch der Erziehungsberechtigten |
| `regeln_bestaetigung` | Bestätigung „Verhaltensregeln gelesen und zur Kenntnis genommen“: Lehrling, Stand der Regeln (`salon-regeln.js`), Datum (setzt der Server). Sehen: der Lehrling die eigene, die Meisterin alle (mit Namen); anlegen nur der Lehrling selbst, löschen nur die Meisterin, ändern niemand. Seit 2026-11-20, `supabase/20261120_regeln_bestaetigung.sql` | Ja, Beschäftigungsbezug (gering) |
| `lernfaelle` | Lernfälle „Aus Fehlern lernen“: Kompetenz, Titel, Situation, Frage, Antworten, Erklärung, freigegeben – von der Meisterin **ohne Namen** geschrieben. Sichtbar für Lehrlinge erst nach Freigabe (und Zustimmung, siehe unten). Seit 2026-11-19, `supabase/20261119_lernfaelle.sql` | Nein (Inhalt ohne Namen); Rückschluss auf eine Person nur über `lernfaelle_quelle` |
| `lernfaelle_quelle` | Herkunft eines Lernfalls aus der Praxis eines Lehrlings: Lehrling, Praxis-Eintrag, Einwilligung (offen/ja/nein), beantwortet am. Sehen: der Lehrling nur die eigenen, die Meisterin alle; andere Lehrlinge nie. „Ja“ setzt nur der Lehrling selbst (Funktion `lernfall_einwilligung`), zurücknehmen jederzeit | Ja, Einwilligung; bei Minderjährigen ggf. auch der Erziehungsberechtigten (Anwältin) |
| `einreichungen` + `einreichung_belege` + Storage-Bucket `einreichung-belege` (privat) | Wettbewerbs-Einreichungen der Meisterin (V1: Staatspreis, Mercur): Kopfdaten, Texte zu Ausgangslage, Lösung, Wirkung, Offene Lücken, Wettbewerbs-Check (Einschätzung und Hinweise der Meisterin), Belege mit optionalem Bild (verkleinert, ohne Bild-Metadaten). Sehen und ändern **nur die Meisterin**, kein anon. Belege sollen ohne Namen auskommen, Zitate von Lehrlingen nur mit deren Erlaubnis. Dazu der 2-Minuten-Pitch je Einreichung (Spalte `pitch`: je Jury – Staatspreis, Mercur Digitalisierung, Mercur Kreativität – und Länge eine Fassung mit Sprechtext, „Im Bild“, Satz zum Merken und Zeiten der letzten Probe; Sprechtempo; eigene Antworten auf die Fragen des Jury-Stresstests. Probe und Fragen-Übung nehmen nichts auf). Keine KI, nichts geht an Dritte. Seit 2026-11-22, `supabase/20261122_einreichungen.sql`; Pitch seit 2026-11-28, `supabase/20261128_einreichungen_pitch.sql` | Grundsätzlich nein; möglich, wenn in Belegen doch Personen erkennbar sind |

### Bewerbung und Probezeit (nur die Meisterin sieht das)

| Tabelle | Inhalt | Personenbezug |
|---|---|---|
| `schnuppertage` | Name der Bewerberin, Datum, Punkte je Testteil, Entscheidung ja/nein/offen, Antworten | Ja, Bewerbungsdaten |
| `probezeiten` | Name, Beginn/Ende, Status, Entscheidung, Abschluss-Notizen, Verknüpfung zum Lehrlings-Konto (`lehrling_id`, seit 2026-11-21) | Ja, Beschäftigungsdaten |
| `probezeit_wochen` | Wöchentliche Einschätzung (Fachliches, Team, Kundenkontakt, Pünktlichkeit, Lernbereitschaft) + Notiz | Ja, Leistungsbeurteilung |
| `probezeit_monats_feedback` | Monats-Rückmeldung + Status | Ja, Leistungsbeurteilung |
| `probezeit_ziele`, `probezeit_quiz`, `probezeit_quiz_fragen` | Ziele und Wochenquiz der Probezeit | Ja |

**Lehrling sieht seinen Plan** (seit 2026-11-21, `supabase/20261121_probezeit_lehrling_sicht.sql`):
Ist die Probezeit mit dem Lehrlings-Konto verknüpft, liefert die Server-Funktion
`meine_probezeit()` dem Lehrling nur Beginn, Ende, Feedback-Tag, die IDs der erledigten
Monatsziele und die Wochen mit erledigtem Wochenquiz. Bewertungen (`probezeit_wochen`),
Monats-Feedback, Entscheidung, Abschluss-Notizen und Quiz-Antworten bleiben nur bei der Meisterin.

**Ausgeschieden** (seit 2026-11-16, `supabase/20261116_lehrling_ausscheiden.sql`):
Verlässt ein Lehrling den Salon, ersetzt die Meisterin den Namen durch
„Ehemalige:r Lehrling <Jahr> · <Nr.>“. Das Anmelde-Konto wird gelöscht, die
Freitexte (Notizen, Details, „kontrolliert von“, Begründungen, Rückmeldungen)
werden geleert, die **Praxis-Fotos gelöscht** (vorher, über die Storage-API; der
Server lässt das Ausscheiden sonst nicht zu). Erhalten bleiben die Lernzahlen ohne Namen (Quiz-Verlauf,
Themenstand, Praxis-Datum/-Bereich/-Dauer, Ergebnisse der Prüfgespräche,
Status der Farb-Pläne), damit der Ausbildungsbericht sie weiter zählt. Lehrjahr
und Zeitraum bleiben, daher ist das in einem kleinen Betrieb eher
**pseudonym als anonym**. Wie lange diese Zahlen bleiben dürfen, gehört zu den
offenen Löschfristen.

**Praxis-Fotos von Modellen:** Die App fragt nur ein Häkchen „Einverständnis
liegt vor“ ab. Die Einwilligung selbst (schriftlich, mit Zweck und Widerruf)
holt und verwahrt der Salon. Muster dafür und ein Satz in der
Datenschutzerklärung sind noch offen.

**Wichtig für die Anwältin:** Leistungsbeurteilungen und Bewerbungsdaten von
oft minderjährigen Personen sind besonders schutzwürdig. Speicherdauer und
Löschung sind dafür noch nicht geregelt.

## 3. Was nur auf dem Gerät gespeichert wird (Browser-Speicher)

Diese Daten verlassen das Gerät nicht. Sie werden beim Löschen der
Browserdaten mitgelöscht.

- Übungsstände einzelner Module: Farblabor, Schnittwerkstatt, Zwischenprüfung,
  Visagistik, Baukasten
- Einstellungen und Merker, z. B. ob ein Hinweis schon gesehen wurde
  (Wörni-Begleiter, Schlüssel `woerni-begleiter`: welcher Impuls zuletzt als
  „Gelesen“ markiert wurde, ob Wörni sich schon vorgestellt hat, und ob/wann die
  Verhaltensregeln auf diesem Gerät bestätigt wurden; Fragen an „Frag Wörni“
  werden nirgends gespeichert)
- Gemerkte Rolle „Meisterin“ (nur die Konto-ID, damit die App offline weiß,
  welche Ansicht sie zeigt; die Daten schützt weiterhin der Server)
- Anmelde-Sitzung von Supabase
- Offline-Kopie der Seiten und der zuletzt geladenen Daten (Service Worker)

## 4. Wohin Daten fließen (Dienstleister)

| Dienst | Wofür | Was dort ankommt | Sitz |
|---|---|---|---|
| **Supabase** | Datenbank, Anmeldung, Server-Funktionen | Alle Daten aus Abschnitt 2 | Region im Dashboard prüfen (Settings → General) |
| **GitHub Pages** | Bereitstellung der Seiten (`mirjamwalenta-a11y.github.io`) | IP-Adresse beim Laden | USA |
| **Anthropic (Claude)** | KI-Trainer „Wörni“ im Bereich *Beratung & Formwirkung* (über die Server-Funktion `rapid-function`) | Was im Trainer eingetippt wird | USA |
| **jsDelivr** | Programm-Bibliothek von Supabase | IP-Adresse beim Laden | weltweites CDN |

Zusätzlich lädt jede Seite Hilfsskripte aus dem eigenen Repo
`abwesenheiten-ghd` (automatisch abmelden, offline nutzbar). Das ist kein
fremder Dienst, gehört bei einem Verkaufsprodukt aber mit ins Paket.

## 5. Was beim Verkauf an andere Salons zu klären ist

Die folgenden Punkte stammen aus der Code-Durchsicht. Sie sind der Grund,
warum der Verkauf einen technischen Umbau braucht.

1. **Eigenes Supabase-Projekt.** Heute liegen Lerndaten, Bewerbungsdaten und
   die Team-App in einem Projekt. Fremde Salons gehören in ein getrenntes
   Projekt, das nur die Lern-App enthält.
2. **Mehrere Salons.** Es gibt genau eine Meisterin-Rolle für alles. Für
   mehrere Salons braucht jede Tabelle eine Salon-Zuordnung, und die Regeln
   (RLS) müssen Salons voneinander trennen.
3. **Anmeldung der Lehrlinge.** Die Konto-Adresse wird aus dem Namen
   gebildet. Zwei „Anna Huber“ in verschiedenen Salons würden kollidieren.
   Außerdem ist eine 6-stellige PIN für ein Bezahlprodukt schwach. Das muss
   beim Umbau neu gelöst werden.
4. **KI-Trainer „Wörni“ nur im eigenen Salon.** Entscheidung vom
   2026-11-12: Wörni ist nicht Teil des Verkaufsprodukts. Beim Umbau den
   Trainer-Reiter für fremde Salons ausblenden **und** am Server sperren
   (die Edge Function nimmt nur Anfragen von Konten des eigenen Salons an;
   nur ausblenden reicht nicht, CLAUDE.md Regel 3). Die Funktion
   `claudeAnfrage` steht außerdem ungenutzt in `lernquiz.html`,
   `lerntool.html` und `schnuppertag.html` und kann dort entfernt werden.
5. **Google Fonts selbst hosten: erledigt (2026-11-12).** Die Schrift Poppins
   liegt in `fonts/` und wird nicht mehr von Google geladen.
6. **Nutzungsrechte an Inhalten: erledigt (2026-11-12).** Die Zwischenprüfung
   war eng an Unterlagen der Landesinnung Wien und an einen Fragenkatalog
   unklarer Herkunft angelehnt. Alle Texte sind jetzt in eigenen Worten
   geschrieben: Grundwissen-Fragen, Maniküre-Ablauf, Rasierzüge,
   Bewertungskriterien, Fehlerlisten, Hauttypen. Übernommen sind nur
   Fakten und Fachbegriffe. Die Fußzeile verweist auf die verbindlichen
   Prüfungsunterlagen der Landesinnung, nicht mehr als Quelle. Wer sicher
   gehen will, kann die Landesinnung trotzdem über das Angebot informieren.
7. **Konto löschen.** Ein Lehrling kann sein Konto noch nicht selbst löschen
   (nötig für DSGVO und Apple). Die Meisterin kann heute nur sperren.
8. **Schnuppertag und Probezeit** sind Personalwerkzeuge des eigenen Salons.
   Klären, ob sie Teil des Verkaufsprodukts sein sollen. Wenn ja, gelten
   dafür strengere Anforderungen (Bewerbungsdaten).

## 6. Bereits umgesetzt

- „KI-generiert“-Etikett auf allen Gemini-Bildern (Beratung & Formwirkung,
  Hochstecken im Lern-Tool)
- Seite `rechtliches.html` mit Impressum, Datenschutz, Nutzungsbedingungen
  und KI-Hinweis (Entwurf mit Platzhaltern), verlinkt unten auf jeder Seite
- Rollen werden am Server geprüft, RLS auf allen Lern-Tabellen, Registrierung
  nur auf Einladung, im Code nur öffentliche Schlüssel
