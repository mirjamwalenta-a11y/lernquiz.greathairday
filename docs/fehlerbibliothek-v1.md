# Aus Fehlern lernen – Fehlerbibliothek V1

**Stand:** 2026-11-19 · Umsetzung: `lerntool.html` (Lehrling), `lernquiz.html`
(Meisterin, Bereich „Praxis“), Datenbank `supabase/20261119_lernfaelle.sql`.

Aus echten Situationen im Salon werden kleine Lernfälle: Was ist passiert, was
würdest du ändern? Mit einer richtigen Antwort, Rückmeldungen und einer
Erklärung.

## Entscheidungen der Inhaberin

1. Fälle legt nur die Meisterin an – neu oder aus einem Praxis-Eintrag –, der
   Text wird ohne Namen umformuliert.
2. Vorerst nur Text, keine Fotos (später Fotos von Übungsköpfen).
3. Lehrlinge sehen einen Fall erst nach Freigabe durch die Meisterin.
4. Stammt der Fall aus der Praxis eines Lehrlings, muss dieser zustimmen (wie
   bei den Zitaten). Ohne Zustimmung sieht den Fall niemand; zurücknehmen geht
   jederzeit.

## Ablauf

- **Meisterin:** Praxis → „Aus Fehlern lernen“ → „+ Neuer Lernfall“. Optional
  „Stammt aus der Praxis von …“ und ein Praxis-Eintrag (füllt Situation und
  Kompetenz vor). Speichern → Freigeben. Status je Fall: Entwurf · wartet auf
  Zustimmung von … · möchte das nicht · sichtbar für alle Lehrlinge.
- **Lehrling, dessen Situation es ist:** Hinweis auf der Startseite „Darf deine
  Situation anderen helfen?“ → Ja / Nein, später änderbar.
- **Alle Lehrlinge:** Üben → „Aus Fehlern lernen“ oder im Fenster der
  Kompetenz-Landkarte „Lernfälle aus dem Salon (n)“. Fall lesen, Antwort
  wählen, Rückmeldung und „Warum“.

## Datenschutz und Sicherheit

- Der Fall selbst (`lernfaelle`) enthält keine Personendaten. Die Herkunft
  liegt getrennt in `lernfaelle_quelle`, die andere Lehrlinge nie lesen können.
- Sichtbarkeit (`einwilligung_ok`) setzt nur der Server: Trigger beim Anlegen,
  Beantworten oder Löschen der Quelle. Weder Browser noch Meisterin können sie
  direkt setzen; „Ja“ kann nur der Lehrling selbst geben.
- Lesen dürfen nur Lehrlingskonten (nicht andere Konten im gemeinsamen
  Supabase-Projekt), anon gar nichts.
- Geprüft in einer lokalen Test-Datenbank mit 20 Fällen (Meisterin, eigener und
  fremder Lehrling, Team-App-Konto, anon, zweimaliges Ausführen).
- Offen für die Anwältin: ob bei Minderjährigen zusätzlich die Zustimmung der
  Erziehungsberechtigten nötig ist (wie bei den Zitaten).
