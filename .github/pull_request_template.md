## Was

<!-- Ein bis zwei Sätze: Welche Seite, welcher Reiter oder welches Modul ändert sich? -->

## Warum

<!-- Welches Lernziel oder welches Problem steckt dahinter? Verweis auf das Konzept in docs/, falls vorhanden. -->

## Lernlogik und Inhalt

<!-- Nur bei Lernmodulen: Schritte, Antwortformat, Feedback. Was sieht der Lehrling, was wird geprüft? -->

## Daten

<!-- Neue oder geänderte Datenstrukturen (z. B. SB_FAELLE, VG_UEBUNGEN), Speicherort (statisch, localStorage, Supabase). -->

## Offen

<!-- Platzhalter, fehlende Bilder, bewusst verschobene Punkte. -->

## Entscheidungen

<!-- Wo vom Konzept abgewichen oder eine Lücke selbst entschieden wurde, und warum. -->

## Getestet

<!-- Wie geprüft? Welche Bildschirmbreiten (Handy / Desktop), welche Fälle durchgeklickt, Konsole ohne Fehler? -->

## Sicherheits-Check (CLAUDE.md)

- [ ] Keine neue Supabase-Tabelle **oder** RLS ist im selben PR aktiviert (keine anon-Policy ohne Rückfrage)
- [ ] Keine Zugangsdaten, privaten E-Mail-Adressen oder anderen persönlichen Daten in Code, Kommentaren, Doku oder `value="…"`
- [ ] Rollenprüfungen (Chefin/Admin) serverseitig durchgesetzt, nicht nur per JS
- [ ] Kein neuer Login- oder „Angemeldet bleiben“-Weg **oder** er nutzt ein zufälliges, ablaufendes Token
- [ ] Keine Fotos oder Namen echter Kund:innen ohne Freigabe

## Auslieferung

- [ ] Cache-Version (`?v=…`) in den Links auf geänderte Seiten erhöht
