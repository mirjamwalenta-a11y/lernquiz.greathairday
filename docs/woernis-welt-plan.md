# Wörnis Welt – Plan für das Abo-Angebot

**Stand:** 2026-11-13. Sammelt die Entscheidungen der Inhaberin für den
Umbau der Lern-App zu einem Angebot für andere Salons. Rechtliches:
`rechtliches.html` (Entwurf), Daten: `docs/daten-uebersicht.md`.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Name | **Wörnis Welt** (Name laut Inhaberin frei). Untertitel-Vorschlag: „Die Lern-App fürs Friseurhandwerk“ |
| Anbieterin | Mirjam Walenta – A Great Hair Day (Einzelunternehmen), nicht der Verein |
| Kundinnen | Friseurbetriebe (nur Unternehmen, keine Verbraucher) |
| Preis | 29 € pro Salon und Monat inkl. 2 Lehrlinge, jeder weitere Lehrling 8 €. Gezählt: aktive Lehrlingskonten am 1. des Monats. Netto/brutto offen (Steuerberatung) |
| Testphase | 1 Monat gratis, endet automatisch ohne Abo |
| Laufzeit | unbefristet, monatlich kündbar |
| Inhalt | alle Lern-Module, Meisterin-Bereich, Schnuppertag und Probezeit |
| KI-Trainer | nicht im Abo, nur im eigenen Salon (auch serverseitig sperren) |
| Ziel | Landesinnung bzw. WKO übernimmt oder fördert die Kosten für ihre Mitglieder; Berufsschule wird eingebunden |

## Rollen (gleich im Umbau vorsehen)

| Rolle | Sieht | Bauen |
|---|---|---|
| Salon (Meisterin) | alles des eigenen Salons | im Pilot |
| Lehrling | eigene Daten | im Pilot |
| Berufsschule (Lehrerin) | Lernstand je Thema der Lehrlinge, die ihrer Klasse **selbst** beitreten (Klassen-Code). Nie: Praxis-Tagebuch, Notizen, Prüfgespräche, Schnuppertag, Probezeit | erst bei konkretem Interesse |
| Innung | Freischalt-Codes, anonyme Statistik (keine Einzeldaten) | erst bei konkretem Interesse |

## Wörnis Tipps

Wörni ist der Begleiter in der App, **ohne KI**. Grundsatz: selten und
nützlich, nicht kitschig.

- **Wörnis Tipp:** höchstens ein kurzer Praxistipp pro Lern-Modul, als
  Kästchen mit kleinem Wörni-Zeichen.
- **Wörni sagt:** ein Spruch des Tages auf der Startseite (wechselt täglich).
- **Inhalte:** statische Liste in einer eigenen Datei (z. B.
  `woernis-tipps.js`: `{id, modul, text}`), keine Datenbank, kein Login
  nötig. Die Tipps und Sprüche liefert die Inhaberin, gern aus ihrer
  eigenen Ausbildungszeit.
- **Widmung:** eine kurze Zeile auf der Startseite oder im Impressum.
  Ein Name wird erst eingetragen, wenn die betroffene Person bzw. ihre
  Familie zugestimmt hat (CLAUDE.md, Regel 2).
- **Aussprache:** Lehrlinge sagen ggf. „Werni“/„Worni“ – unproblematisch.
  Wichtiger ist die Suche: Domain ohne Umlaut (`woernis-welt.at`) als
  Hauptadresse, Umlaut-Variante weiterleiten.

## Reihenfolge

1. **Umbau** (offen: Zusage für ein neues, eigenes Supabase-Projekt in der EU)
   - neues Supabase-Projekt, nur Lern-App, getrennt von Team-App und Personaldaten
   - mehrere Salons, per RLS strikt getrennt; Rollen wie oben vorgesehen
   - neue Anmeldung für Lehrlinge (Konto-Adresse nicht mehr aus dem Namen)
   - Abo-Status und Zählung aktiver Lehrlinge am Server
   - Konto löschen, Datenexport, automatische Löschfristen (siehe Rechtsseite)
   - eigener Schnuppertag- und Wochenquiz-Link pro Salon (nicht erratbar)
   - Name „Wörnis Welt“, neutrales Aussehen, Wörnis Tipps
   - Admin-Seite für die Inhaberin zum Freischalten
2. **Pilot:** 3–5 Salons gratis gegen Feedback, von Hand freigeschaltet
3. **Gespräch** mit Landesinnung Wien und Lehrlingsstelle (Förderung:
   lehre-foerdern.at prüfen), mit Pilot-Ergebnissen und Präsentation
4. **Plan B:** Salon-Abo zu 29 € für Salons ohne Innungs-Lizenz
5. **Später:** automatische Zahlung (Stripe), eventuell App Stores

## Offen bei der Inhaberin

- Domain `woernis-welt.at` (und Umlaut-Variante) registrieren, Marke anmelden
- Anwältin: Rechtsseite, AVV-Muster (inkl. Bewerbungs- und Probezeitdaten), Einbindung Berufsschule
- Steuerberatung: netto/brutto, ggf. weiteres Gewerbe
- Supabase-Region nachsehen
- Wörnis Tipps und Sprüche sammeln
- Zustimmung zur Widmung einholen
