// Änderungen der Meisterin an Wörnis Texten (Hilfe „Ich steh auf der Leitung“ und „Paare finden“)
//
// Die Grundtexte stehen in woerni-leitung.js und paare-finden.js. Was die Meisterin im
// Meisterin-Bereich („Wörni-Texte prüfen“) ändert, hinzufügt oder löscht, wird als
// Änderung in public.lerntool_daten gespeichert und hier auf die Grundtexte angewendet:
//   typ 'woerni_leitung', schluessel = Fragen-id (z. B. „1-mc14“, „sw3“)
//   typ 'paare_finden',   schluessel = „p:<ursprünglicher Begriff>“ oder „neu:<Zeitstempel>“
//   wert = JSON des Eintrags, oder {"geloescht":true}
// Rechte (CLAUDE.md, Regeln 1 und 3): lesen alle Angemeldeten (lerntool_daten_lesen),
// schreiben nur die Meisterin, serverseitig über ist_meisterin() (lerntool_daten_meisterin).
// Keine neue Tabelle. Ohne Anmeldung oder offline: zuletzt geladener Stand (localStorage).
// Laden nach woerni-leitung.js und/oder paare-finden.js.
(function () {
  var SB_URL = 'https://wrxlaltgtgkdomklgrlj.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyeGxhbHRndGdrZG9ta2xncmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNDYwMzYsImV4cCI6MjA5OTgyMjAzNn0.Bw8ch-EJb_cLYTwxHdpjUJWgoCjje3Jc32pB0yiBS8g';
  var KEY = 'ghd-woerni-aenderungen';
  var TYP_H = 'woerni_leitung', TYP_P = 'paare_finden';

  // Grundstand einmal festhalten, damit Änderungen jederzeit neu angewendet werden können
  var T = window.WOERNI_LEITUNG && window.WOERNI_LEITUNG.texte;
  var T_ORIG = T ? Object.assign({}, T) : null;
  var P = window.PAARE_THEMEN;
  var P_ORIG = P ? P.map(function (t) { return t.p.slice(); }) : null;

  var stand = lesen();   // {h: {id: wert}, p: {schluessel: wert}}

  function lesen() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d && d.h && d.p ? d : { h: {}, p: {} }; } catch (e) { return { h: {}, p: {} }; } }
  function merken() { try { localStorage.setItem(KEY, JSON.stringify(stand)); } catch (e) {} }
  function client() {
    try { return window.sb2 || window.__ghdSb || (window.supabase && (window.__ghdSb = window.supabase.createClient(SB_URL, SB_KEY))); } catch (e) { return null; }
  }
  function gueltigH(w) { return w && typeof w.bild === 'string' && typeof w.frage === 'string' && Array.isArray(w.o) && w.o.length >= 2 && typeof w.r === 'number' && w.o[w.r] != null && typeof w.ja === 'string' && typeof w.nein === 'string'; }
  function gueltigP(w) { return w && typeof w.b === 'string' && w.b && typeof w.s === 'string' && w.s && [1, 2, 3].indexOf(w.lj) >= 0 && typeof w.th === 'string'; }

  function anwenden() {
    if (T && T_ORIG) {
      Object.keys(T).forEach(function (k) { delete T[k]; });
      Object.keys(T_ORIG).forEach(function (k) { T[k] = T_ORIG[k]; });
      Object.keys(stand.h).forEach(function (id) {
        var w = stand.h[id];
        if (w && w.geloescht) { delete T[id]; return; }
        if (!gueltigH(w)) return;
        var e = { bild: w.bild, frage: w.frage, o: w.o.slice(), r: w.r, ja: w.ja, nein: w.nein, geaendert: true };
        if (T_ORIG[id] && T_ORIG[id].zu) e.zu = T_ORIG[id].zu;
        T[id] = e;
      });
    }
    if (P && P_ORIG) {
      P.forEach(function (t, i) {
        var liste = P_ORIG[i].map(function (p) {
          var w = stand.p['p:' + p.b];
          if (!w) return p;
          if (w.geloescht || !gueltigP(w)) return w.geloescht ? null : p;
          return { b: w.b, s: w.s, lj: w.lj, key: 'p:' + p.b, geaendert: true };
        }).filter(Boolean);
        Object.keys(stand.p).forEach(function (k) {
          var w = stand.p[k];
          if (k.indexOf('neu:') === 0 && !w.geloescht && gueltigP(w) && w.th === t.th) liste.push({ b: w.b, s: w.s, lj: w.lj, key: k, neu: true });
        });
        t.p.length = 0;
        liste.forEach(function (p) { t.p.push(p); });
      });
    }
    try { document.dispatchEvent(new CustomEvent('ghd-woerni-texte')); } catch (e) {}
  }

  function laden(fertig) {
    var c = client();
    if (!c || !c.from) { if (fertig) fertig(false); return; }
    c.from('lerntool_daten').select('typ,schluessel,wert').in('typ', [TYP_H, TYP_P]).then(function (r) {
      if (!r || r.error || !r.data) { if (fertig) fertig(false); return; }
      var neu = { h: {}, p: {} };
      r.data.forEach(function (z) {
        try { var w = JSON.parse(z.wert); if (z.typ === TYP_H) neu.h[z.schluessel] = w; else neu.p[z.schluessel] = w; } catch (e) {}
      });
      stand = neu; merken(); anwenden();
      if (fertig) fertig(true);
    }, function () { if (fertig) fertig(false); });
  }

  // Speichern (nur Meisterin, RLS prüft serverseitig). wert = Objekt oder null (= Änderung entfernen, Original gilt wieder)
  function speichern(typ, schluessel, wert) {
    var c = client();
    if (!c || !c.from) return Promise.reject(new Error('Keine Verbindung'));
    var tab = c.from('lerntool_daten');
    var weiter = function (r) {
      if (r && r.error) throw r.error;
      var ziel = typ === TYP_H ? stand.h : stand.p;
      if (wert === null) delete ziel[schluessel]; else ziel[schluessel] = wert;
      merken(); anwenden();
      return true;
    };
    if (wert === null) return tab.delete().eq('typ', typ).eq('schluessel', schluessel).then(weiter);
    var text = JSON.stringify(wert);
    return tab.select('schluessel').eq('typ', typ).eq('schluessel', schluessel).limit(1).then(function (r) {
      if (r && r.error) throw r.error;
      var da = r && r.data && r.data.length;
      return (da ? tab.update({ wert: text }).eq('typ', typ).eq('schluessel', schluessel)
                 : tab.insert({ typ: typ, schluessel: schluessel, wert: text })).then(weiter);
    });
  }

  window.WOERNI_DATEN = {
    TYP_H: TYP_H, TYP_P: TYP_P,
    laden: laden,
    speichern: speichern,
    stand: function () { return stand; },
    original: function (id) { return T_ORIG ? T_ORIG[id] : null; },
    originalPaare: function () { return P_ORIG; }
  };

  anwenden();   // zuerst den gemerkten Stand
  laden();      // dann frisch vom Server
})();
