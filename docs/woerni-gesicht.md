# Wörni mit Gesicht

**Stand:** 2026-11-25 · mit Zustimmung der Inhaberin (sichtbare Design-Änderung).

Statt des goldenen „W“-Kreises zeigt jede Wörni-Zeile ein Brustbild von Wörni
(weißes T-Shirt mit „Wörni“-Schriftzug) im goldenen Rahmen, 80 × 80 px.
Keine neuen Farben: Rahmen `#896C32`, Hintergrund `#F3EBD9` (wie die
„Wörni sagt“-Karte). Keine Animation, kein Pop-up – die Regeln aus
`woerni-v1.md` gelten unverändert.

## Bilder (`bilder/woerni/`)

| Datei | Wo |
|---|---|
| `nachdenklich.jpg` | Quiz: falsche Antwort, wiederholter Fehler · „Kurz sortieren“-Hinweis · Situationen „Fehler gemacht“, „unsicher“ · Frag Wörni, wenn er es nicht weiß |
| `lobend.jpg` | richtig nach einem Fehler · nach dem Tagebuch-Eintrag · Quiz alles richtig |
| `motivierend.jpg` | Wiedereinstieg · Praxis · „Wörni führt“ (nächster Schritt) · „Wörni sagt“ / Wörnis Tipps · Situation „nervös“ |
| `enttaeuscht.jpg` | nur „Kurz sortieren“: „alles zu viel“, „Rückmeldung“ – als Mitgefühl, **nie** als Reaktion auf eine Antwort |
| `erfreut.jpg` | Begleiter: Vorstellung, Impuls der Phase, Antworten von Frag Wörni |
| `erfreut-ganz.webp` | ganze Figur oben auf der Seite „Wörni – dein Begleiter“ |
| `sieger-ganz.webp` | ganze Figur im Ergebnis der LAP-Vorbereitung ab „Gut“ (sonst nie) |

Die Skripte finden die Bilder relativ zu ihrem eigenen Pfad (`document.currentScript`),
damit es auch funktioniert, wenn ein Skript von einer anderen Seite geladen wird.
Folgen zwei Wörni-Zeilen direkt aufeinander, zeigt nur die erste das Bild.
Neue Bilder auch in `sw.js` (`vorab`) eintragen.
