// Farb-Nummern eurer Farbkarte – von der Meisterin im Meisterin-Bereich
// („Farb-Nummern“) gepflegt, damit Beispiele im Farblabor zur eigenen Firma passen
// (z. B. Tonhöhe 7 + Irisé + Asch → „7.21“). Gespeichert in public.lerntool_daten
// (typ 'farb_einstellung', schluessel 'farb_einstellung|nummern'), wie die Farb-Zeiten:
// lesen dürfen alle angemeldeten Konten, schreiben nur die Meisterin (RLS
// lerntool_daten_meisterin). Ohne Anmeldung oder offline: zuletzt geladene Werte
// bzw. Standard (Nummerierung wie im Farblabor, Teil „Farbnummern“).
// Keine persönlichen Daten.
(function(){
  var REFLEXE = [['asch','Asch (Blau)'],['irise','Irisé (Violett)'],['gold','Gold (Gelb)'],['kupfer','Kupfer (Orange)'],['mahagoni','Mahagoni (Rotviolett)'],['rot','Rot'],['matt','Matt (Grün)']];
  var STANDARD = {trenner:'.', asch:'1', irise:'2', gold:'3', kupfer:'4', mahagoni:'5', rot:'6', matt:''};
  var KEY = 'ghd-farb-nummern';
  var SB_URL = 'https://wrxlaltgtgkdomklgrlj.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyeGxhbHRndGdrZG9ta2xncmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNDYwMzYsImV4cCI6MjA5OTgyMjAzNn0.Bw8ch-EJb_cLYTwxHdpjUJWgoCjje3Jc32pB0yiBS8g';
  // Nur kurze Codes aus Ziffern/Buchstaben (z. B. „1“, „8“, „A“); leer = unbekannt
  function code(v){ v = String(v == null ? '' : v).trim(); return /^[0-9A-Za-z]{1,3}$/.test(v) ? v : ''; }
  function pruefen(w){
    w = w || {}; var z = {trenner: w.trenner === '/' ? '/' : '.'};
    REFLEXE.forEach(function(r){ z[r[0]] = (r[0] in w) ? code(w[r[0]]) : STANDARD[r[0]]; });
    return z;
  }
  function gemerkt(){ try { return pruefen(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch(e) { return pruefen(null); } }
  window.GHD_FN = gemerkt();
  window.GHD_FN_STANDARD = STANDARD;
  window.GHD_FN_REFLEXE = REFLEXE;
  window.ghdFarbNummernPruefen = pruefen;
  // Beispielnummer, z. B. ghdBeispielNummer(7, ['irise','asch']) → "7.21"; null, wenn ein Code fehlt
  window.ghdBeispielNummer = function(th, reflexe){
    var t = '';
    for (var i = 0; i < reflexe.length; i++) { var c = window.GHD_FN[reflexe[i]]; if (!c) return null; t += c; }
    return String(th) + window.GHD_FN.trenner + t;
  };
  window.ghdFarbNummernLaden = function(onFertig){
    var fertig = function(){ try { if (onFertig) onFertig(window.GHD_FN); } catch(e) {} };
    try {
      var c = window.sb2 || window.sb || (window.supabase && window.supabase.createClient(SB_URL, SB_KEY));
      if (!c || !c.from) { fertig(); return; }
      c.from('lerntool_daten').select('wert').eq('typ','farb_einstellung').eq('schluessel','farb_einstellung|nummern').limit(1)
        .then(function(r){
          if (r && !r.error && r.data && r.data[0]) {
            try { window.GHD_FN = pruefen(JSON.parse(r.data[0].wert)); localStorage.setItem(KEY, JSON.stringify(window.GHD_FN)); } catch(e) {}
          }
          fertig();
        }, fertig);
    } catch(e) { fertig(); }
  };
})();
