// Kompetenz-Landkarte V2: die 17 Kompetenzen und woraus sie sich speisen.
// Plan und Entscheidungen der Inhaberin: docs/kompetenz-landkarte-v2.md
//
// Die Quiz-Themen (lern-themen.js) bleiben unverändert – diese Liste legt
// nur fest, welche Themen, Module, Praxis-Tagebuch-Bereiche und
// Praxis-Checks der Meisterin zu welcher Kompetenz gehören.
// Den Stand je Kompetenz rechnet kompetenz-stand.js.
// Keine Daten aus der Datenbank, keine persönlichen Angaben.
//
// Felder:
//   id          fester Schlüssel (nie ändern, sobald etwas daran hängt)
//   name        Anzeige
//   themen      Quiz-Themen (Spalte kompetenz.thema) → Stufe ① „Weiß ich“
//   module      Module zum Anwenden (nur Anzeige/Links)
//   anwenden    Datenquelle für Stufe ② „Kann ich anwenden“, oder null,
//               solange es dafür keine eigenen Daten gibt
//   praxis      Bereiche im Praxis-Tagebuch (praxis_eintraege.bereich,
//               genau wie PT_BEREICHE im Lern-Tool) → Stufe ③
//   praxisCheck Behandlungen des Praxis-Checks der Meisterin
//               (PX_BEHANDLUNGEN in lernquiz.html, gespeichert als
//               pruefgespraeche.frage_id = 'praxis-<id>') → Stufe ④.
//               Leer: Stufe ④ kommt aus Prüfgesprächen zu den Themen.
//   themenGeplant  Quiz-Themen, die es noch nicht gibt (Inhalte liefert
//               die Inhaberin); zählen erst, wenn sie unter `themen` stehen
(function(){
  window.GHD_KOMPETENZEN = [
    {id:'hygiene', name:'Hygiene & Arbeitssicherheit',
     themen:['Hygiene & Schutzmaßnahmen','Unfallverhütung & Arbeitssicherheit'],
     module:[], anwenden:null, praxis:[], praxisCheck:[]},

    {id:'diagnose', name:'Haar- & Kopfhautdiagnose',
     themen:['Haarkunde & Haarstruktur','Hautkunde'],
     module:[], anwenden:null, praxis:[], praxisCheck:[]},

    {id:'pflege', name:'Pflege & Kopfmassage',
     themen:['Kopfhautpflege','Pflegeprodukte & Wirkstoffe'],
     module:[], anwenden:null, praxis:['Haarwäsche & Kopfmassage'], praxisCheck:['waesche']},

    {id:'werkzeug', name:'Werkzeug & Material',
     themen:['Werkzeugkunde'],
     module:['Werkzeugkunde'], anwenden:null, praxis:[], praxisCheck:[]},

    {id:'beratung', name:'Beratung & Kundengespräch',
     themen:['Beratungsgespräch & Kundenkommunikation','Kundenberatung','Kundenkommunikation Fortgeschritten'],
     module:['Beratung & Formwirkung','Farbtyp-Beratung','Kurz sortieren'], anwenden:null,
     praxis:['Beratung am Gast'], praxisCheck:['empfang']},

    // Kein Praxis-Bereich: „Beratung am Gast“ sagt nicht, ob auf Englisch beraten wurde.
    {id:'englisch', name:'Englisch im Salon',
     themen:['Englisch im Salon'],
     module:['Englisch im Salon'], anwenden:null, praxis:[], praxisCheck:[]},

    {id:'farbe', name:'Farbe & Rezeptur',
     themen:['Farbenlehre & Coloration','Colorationsgrundlagen','Fachkunde Chemie'],
     module:['Farblabor','Farb-Spickzettel','Farb-Fälle'], anwenden:'farb_faelle',
     praxis:['Farbe'], praxisCheck:['farbe']},

    {id:'blond', name:'Blondierung, Strähnen & Balayage',
     themen:['Balayage & Strähnen'],
     module:[], anwenden:null, praxis:['Strähnen & Balayage'], praxisCheck:['blond']},

    // 'schnitt' = früherer gemeinsamer Check „Haarschnitt“ (vor 2026-11-19):
    // alte Einträge zählen weiter für beide Schnitt-Kompetenzen.
    {id:'damenschnitt', name:'Damenschnitt',
     themen:['Haarschnitt Techniken'],
     module:['Schnittwerkstatt','Baukasten','Schnittdesigner'], anwenden:null,
     praxis:['Damenschnitt'], praxisCheck:['damenschnitt','schnitt']},

    {id:'herrenschnitt', name:'Herrenschnitt & Maschine',
     themen:['Haarschnitt Techniken','Herrenservice'],
     module:['Maschine'], anwenden:null, praxis:['Herrenschnitt'], praxisCheck:['herrenschnitt','schnitt']},

    {id:'rasur', name:'Rasur & Bart',
     themen:['Herrenservice'],
     module:[], anwenden:null, praxis:['Rasur & Bart'], praxisCheck:['rasur']},

    {id:'umformung', name:'Umformung (Dauerwelle & Glättung)',
     themen:['Dauerwelle & Umformung','Umformungen Fortgeschritten','Fachkunde Chemie'],
     module:['Umformung'], anwenden:null, praxis:['Dauerwelle & Umformung'], praxisCheck:['umformung']},

    {id:'foehnen', name:'Föhnen & Styling',
     themen:[], themenGeplant:['Föhnen & Styling'],
     module:[], anwenden:null, praxis:['Föhnen'], praxisCheck:['foehnen']},

    {id:'hochstecken', name:'Hochstecken',
     themen:[], themenGeplant:['Hochstecken'],
     module:[], anwenden:null, praxis:['Hochstecken'], praxisCheck:['hochstecken']},

    {id:'nagelpflege', name:'Hand- & Nagelpflege',
     themen:[], themenGeplant:['Hand- & Nagelpflege'],
     module:[], anwenden:null, praxis:['Nagelpflege'], praxisCheck:['nagelpflege']},

    {id:'makeup', name:'Make-up & Visagistik',
     themen:['Make-up & Visagistik'],
     module:['Make-up-Labor','Farbtyp-Beratung'], anwenden:null, praxis:['Make-up'], praxisCheck:['makeup']},

    {id:'betrieb', name:'Betrieb & Organisation',
     themen:['Salon-Organisation','Betriebskunde & Recht'],
     module:[], anwenden:null, praxis:[], praxisCheck:[]}
  ];
})();
