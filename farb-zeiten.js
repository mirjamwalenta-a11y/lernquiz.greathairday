// Farb-Zeiten laut Gebrauchsanweisung – von der Meisterin im Meisterin-Bereich
// („Farb-Zeiten“) gepflegt. Gespeichert in public.lerntool_daten
// (typ 'farb_einstellung', schluessel 'farb_einstellung|zeiten'): lesen dürfen
// alle angemeldeten Konten, schreiben nur die Meisterin (RLS lerntool_daten_meisterin).
// Ohne Anmeldung oder offline gelten die zuletzt geladenen bzw. die Standardwerte.
(function(){
  var STANDARD = {farbe:35, vorlauf:10, aufhellung:10, farbtiefe:15, reflex:10, nachLaengen:10, heller:45, blond:50};
  var KEY = 'ghd-farb-zeiten';
  var SB_URL = 'https://wrxlaltgtgkdomklgrlj.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyeGxhbHRndGdrZG9ta2xncmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNDYwMzYsImV4cCI6MjA5OTgyMjAzNn0.Bw8ch-EJb_cLYTwxHdpjUJWgoCjje3Jc32pB0yiBS8g'; // öffentlicher anon-Schlüssel
  function pruefen(w){
    var z = {};
    Object.keys(STANDARD).forEach(function(k){ var v = Math.round(+((w||{})[k])); z[k] = v >= 1 && v <= 120 ? v : STANDARD[k]; });
    return z;
  }
  function gemerkt(){ try { return pruefen(JSON.parse(localStorage.getItem(KEY) || 'null')); } catch(e) { return pruefen(null); } }
  window.FZ = gemerkt();
  window.FZ_STANDARD = STANDARD;
  window.ghdFarbZeitenPruefen = pruefen;
  // Lädt die Werte der Meisterin; ruft danach onFertig(FZ) auf (auch ohne Änderung)
  window.ghdFarbZeitenLaden = function(onFertig){
    var fertig = function(){ try { if (onFertig) onFertig(window.FZ); } catch(e) {} };
    try {
      var c = window.sb2 || window.sb || (window.supabase && window.supabase.createClient(SB_URL, SB_KEY));
      if (!c || !c.from) { fertig(); return; }
      c.from('lerntool_daten').select('wert').eq('typ','farb_einstellung').eq('schluessel','farb_einstellung|zeiten').limit(1)
        .then(function(r){
          if (r && !r.error && r.data && r.data[0]) {
            try { window.FZ = pruefen(JSON.parse(r.data[0].wert)); localStorage.setItem(KEY, JSON.stringify(window.FZ)); } catch(e) {}
          }
          fertig();
        }, fertig);
    } catch(e) { fertig(); }
  };
  // Füllt <span data-fz="farbe"></span> usw. mit den aktuellen Werten
  window.ghdFarbZeitenEinsetzen = function(wurzel){
    (wurzel || document).querySelectorAll('[data-fz]').forEach(function(el){ var v = window.FZ[el.getAttribute('data-fz')]; if (v != null) el.textContent = v; });
  };
})();
