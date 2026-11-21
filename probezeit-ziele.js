// Monatsziele der Probezeit (Standard) – gemeinsam für die Schnuppertag-App
// (schnuppertag.html, Meisterin hakt Ziele ab) und das Lern-Tool (lerntool.html,
// Lehrling sieht unter „Mein Weg › Probezeit“, welche erledigt sind).
// Die IDs (m1z1 …) stehen in probezeit_ziele.erledigt – nie ändern, nur Texte.
// Keine Daten, keine Namen, kein Login.
window.GHD_PROBEZEIT_ZIELE = {
  1: {
    titel: 'Monat 1 — Ankommen & Kundenkontakt',
    farbe: '#896C32',
    ziele: [
      { id:'m1z1', text:'Kunden herzlich begrüßen' },
      { id:'m1z2', text:'Kaffee / Getränke anbieten' },
      { id:'m1z3', text:'Haarwäsche selbstständig durchführen' },
      { id:'m1z4', text:'Kopfmassage üben' },
      { id:'m1z5', text:'Farbe auftragen üben (unter Aufsicht)' }
    ],
    abzeichen: [
      { id:'m1a1', icon:'🎯', label:'Lernquiz\n1 Abzeichen' },
      { id:'m1a2', icon:'🇬🇧', label:'Englisch Tool\n3 Abzeichen' }
    ]
  },
  2: {
    titel: 'Monat 2 — Einarbeitung & Technik',
    farbe: '#C4A830',
    ziele: [
      { id:'m2z1', text:'Farbe auftragen in unter 20 Minuten' },
      { id:'m2z2', text:'Technikkopf üben' },
      { id:'m2z3', text:'Arbeitsabläufe selbstständiger gestalten' }
    ],
    abzeichen: [
      { id:'m2a1', icon:'🎯', label:'Lernquiz\n2 Abzeichen' },
      { id:'m2a2', icon:'🇬🇧', label:'Englisch Tool\n5 Abzeichen' }
    ]
  },
  3: {
    titel: 'Monat 3 — Selbstständigkeit & Strähnen',
    farbe: '#6E5527',
    ziele: [
      { id:'m3z1', text:'Farbe auftragen selbstständig' },
      { id:'m3z2', text:'Kopfwäsche selbstständig' },
      { id:'m3z3', text:'Kopfmassage selbstständig' },
      { id:'m3z4', text:'Technikkopf selbstständig' },
      { id:'m3z5', text:'Strähnen üben' }
    ],
    abzeichen: [
      { id:'m3a1', icon:'🎯', label:'Lernquiz\n3 & 4 Abzeichen' },
      { id:'m3a2', icon:'🇬🇧', label:'Englisch Tool\nAlle Abzeichen' }
    ]
  }
};
