# Fotos für den Reiter „Maschine“

Die Fotos für das Modul „Maschinenhaarschnitt ohne Aufsteckkämme“ in `beratung-formwirkung.html`.
Alle zeigen einen Hinterkopf mit Verlauf und sind auf 960 × 940 Pixel zugeschnitten (ohne Sakko).

| Datei | Verwendung in der App | Kopf in `MOK_KOEPFE` |
|---|---|---|
| `verlauf-a.jpg` | Übungskopf, S0 bis S5 | `A` |
| `verlauf-b.jpg` | Prüfungskopf, S7 | `B` |
| `fehler-kante.jpg` | Fehlerbild Kante an der Übergangslinie, S6 | `C` |
| `fehler-stufe.jpg` | Fehlerbild harte Linie am Übergang (nicht ausgekippt), Prüfungsfall S7 | `D` |

## Foto austauschen

1. Neues Foto im gleichen Format (Hinterkopf, Hochformat, weißer Hintergrund, 960 × 940) unter demselben Dateinamen ablegen.
2. In `beratung-formwirkung.html` bei `MOK_KOEPFE` die Zonen (`deckhaar`, `oben`, `uebergang`, `band3`, `band2`, `band1`) und den Haarrand `x` neu ausmessen. Die Werte sind auf 480 × 470 umgerechnet (Pixel ÷ 2).
3. `MOK_BILD_VERSION` um 1 erhöhen, damit Handys das neue Foto laden.

Bei den Fehlerfotos muss die Fehlerstelle genau in der gesuchten Zone liegen: bei beiden Fotos (Kante und harte Linie) in `uebergang`. Sonst ist die Aufgabe „Wähle die Fehlerstelle“ nicht eindeutig.
