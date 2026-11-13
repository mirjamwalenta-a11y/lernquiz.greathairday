// Wörnis Tipps und Sprüche – Sammlung für „Wörnis Welt“
// (Plan: docs/woernis-welt-plan.md, Abschnitt „Wörnis Tipps“).
// Noch in keiner Seite eingebunden: wird beim Umbau angezeigt als
//   - „Wörni sagt“: Spruch des Tages auf der Startseite (art: 'spruch')
//   - „Wörnis Tipp“: höchstens ein Tipp pro Lern-Modul (art: 'tipp', modul)
// Felder: id (fest, nie ändern), art, modul ('' = überall passend),
//         titel (kurz), text, bild (optional, Name einer Zeichnung).
// Keine Namen von Personen eintragen (CLAUDE.md, Regel 2).
window.WOERNIS_TIPPS = [
  { id: 'tun', art: 'spruch', modul: '',
    titel: 'T.U.N.',
    text: 'Tu nicht unnötig trödeln. Gute Arbeit braucht Ruhe, aber keine Pausen zwischen den Handgriffen. Leg dir alles bereit, bevor die Kundin sitzt.' },
  { id: 'rad', art: 'spruch', modul: '',
    titel: 'Das Rad nicht zweimal erfinden',
    text: 'Ein Rad muss man nicht zweimal erfinden. Was sich bewährt hat, darfst du übernehmen. Schau dir bei erfahrenen Kolleginnen und Kollegen ab, wie sie es machen, und frag nach.' },
  { id: 'perspektive-m', art: 'tipp', modul: 'beratung',
    titel: 'M, W, E oder 3?',
    text: 'Mal ein großes M auf ein Blatt und leg es zwischen dich und die Kundin. Von dir aus ist es ein M, von gegenüber ein W, von der Seite ein E oder eine 3. Alle sehen dasselbe und trotzdem etwas anderes. Darum frag in der Beratung immer nach, wie die Kundin es sieht, bevor du anfängst.',
    bild: 'perspektive-m' }
];
