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
| `lehrlinge` | Name, Lehrjahr, aktiv/gesperrt, Wochenziel, Lehrbeginn, „nur zum Testen“, Verknüpfung zum Konto | Ja, Minderjährige möglich |
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
| `pruefgespraeche` | Prüfgespräche und Praxis-Checks: Thema, Frage, Ergebnis (verstanden/teilweise/nicht), Notiz, Checkliste | Ja, Bewertung |
| `farb_faelle` | Übungsfälle der Meisterin (Inhalte) | Nein |
| `farb_plaene` | Farbpläne der Lehrlinge mit Rezeptur, Begründung, Status und Rückmeldung der Meisterin | Ja, Bewertung |

### Bewerbung und Probezeit (nur die Meisterin sieht das)

| Tabelle | Inhalt | Personenbezug |
|---|---|---|
| `schnuppertage` | Name der Bewerberin, Datum, Punkte je Testteil, Entscheidung ja/nein/offen, Antworten | Ja, Bewerbungsdaten |
| `probezeiten` | Name, Beginn/Ende, Status, Entscheidung, Abschluss-Notizen | Ja, Beschäftigungsdaten |
| `probezeit_wochen` | Wöchentliche Einschätzung (Fachliches, Team, Kundenkontakt, Pünktlichkeit, Lernbereitschaft) + Notiz | Ja, Leistungsbeurteilung |
| `probezeit_monats_feedback` | Monats-Rückmeldung + Status | Ja, Leistungsbeurteilung |
| `probezeit_ziele`, `probezeit_quiz`, `probezeit_quiz_fragen` | Ziele und Wochenquiz der Probezeit | Ja |

**Wichtig für die Anwältin:** Leistungsbeurteilungen und Bewerbungsdaten von
oft minderjährigen Personen sind besonders schutzwürdig. Speicherdauer und
Löschung sind dafür noch nicht geregelt.

## 3. Was nur auf dem Gerät gespeichert wird (Browser-Speicher)

Diese Daten verlassen das Gerät nicht. Sie werden beim Löschen der
Browserdaten mitgelöscht.

- Übungsstände einzelner Module: Farblabor, Schnittwerkstatt, Zwischenprüfung,
  Visagistik, Baukasten
- Einstellungen und Merker, z. B. ob ein Hinweis schon gesehen wurde
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
| **Google Fonts** | Schrift „Poppins“ | IP-Adresse beim Laden | USA |
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
5. **Google Fonts selbst hosten.** Dann wird beim Laden keine IP-Adresse an
   Google übertragen. Das ist wenig Aufwand.
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
