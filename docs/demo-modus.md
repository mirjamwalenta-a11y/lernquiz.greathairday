# Demo-Modus

**Wofür:** Jury (Staatspreis, MERCUR), Videoaufnahmen und Vorführungen.
Erfundene Lehrlinge und Ergebnisse aus etwa einem Salon-Jahr.
**Stand:** 2026-11-16.

## So geht's

1. `demo.html` öffnen, am besten in einem privaten Fenster.
2. „Als Meisterin ansehen“ oder „Als Lehrling ansehen“ (Mia, 3. Lehrjahr).
3. Oben steht immer das Banner **DEMO**. „Rolle wechseln“ führt zurück zu
   `demo.html`, „Demo beenden“ löscht alles wieder.

Jeder Start legt die erfundenen Daten neu an. Was man im Demo ändert,
bleibt nur in diesem Browser.

## Wie es funktioniert

`demo.js` wird als erstes Skript in jede Seite geladen. Ohne Demo tut es
nichts. Im Demo (`localStorage['ghd-demo'] = '1'`):

- Jede Anfrage an `*.supabase.co` wird im Browser beantwortet. Das gilt für
  Datenbank (PostgREST), Anmeldung (Auth), Server-Funktionen (RPC) und den
  KI-Trainer (Edge Function, im Demo ausgeschaltet). **Keine Anfrage geht an
  den echten Server**, auch kein eingetipptes Passwort.
- Die erfundenen Daten liegen in `localStorage['ghd-demo-db']`.
- `ghd-offline.js` wird im Demo nicht aktiv. Sonst würde es erfundene
  Anmelde-Token an den Service Worker weitergeben.

## Sicherheit (CLAUDE.md)

- Kein neuer Login-Weg zum Server. Die Demo-„Meisterin“ sieht nur erfundene
  Daten, weil der Demo den Server nie erreicht. Die echten Daten schützt
  weiterhin die RLS.
- Keine neue Tabelle, keine Policy, keine Migration.
- Nur erfundene Namen. Die Demo-Konten haben kein Passwort und gibt es nur
  im Browser.
- Beim Start und beim Beenden wird die Anmeldung auf dem Gerät gelöscht.
  Wer auf demselben Gerät echt angemeldet ist (auch in einer anderen
  Great-Hair-Day-App auf `mirjamwalenta-a11y.github.io`), wird abgemeldet.
  `demo.html` warnt davor.

## Grenzen

- Schnuppertag und Probezeit sind im Demo leer, es gibt keine erfundenen
  Bewerbungsdaten.
- Neue Lehrlinge anlegen und Server-Funktionen (z. B. Zugang sperren)
  zeigen keine echte Wirkung.
- Wird das Projekt später auf mehrere Salons umgebaut (`woernis-welt-plan.md`),
  kann ein echter Demo-Salon mit eigenen Daten diesen Modus ersetzen.
