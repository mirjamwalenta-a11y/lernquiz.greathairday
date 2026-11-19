// Gemeinsame Rechnung für den Lernstand – genutzt vom Lern-Tool (Lehrling)
// und vom Meisterin-Bereich im Lernquiz, damit beide dasselbe sehen.
// Plan: docs/kompetenz-landkarte-v2.md · Kompetenzen: kompetenzen.js
//
// Zwei Ebenen:
//   themaStand(d)          Ampel eines Quiz-Themas (Zeile aus `kompetenz`):
//                          sitzt · wartet · faellig · wackelt · unsicher · offen
//   kompetenzStand(k, dt)  Stand einer Kompetenz mit vier Stufen:
//                          ① Weiß ich  ② Kann ich anwenden
//                          ③ Im Salon gemacht  ④ Bestätigt (Meisterin)
//
// Reine Rechnung: liest nichts aus der Datenbank, schreibt nichts. Die
// Seiten laden die Daten selbst (was gelesen werden darf, regelt die RLS)
// und geben sie hier herein.
(function(){
  var SITZT_NACH_TAGEN = 3;   // gute Runden über so viele Tage, bis ein Thema „sitzt“
  var SALON_MIN = 3;          // Praxis-Tagebuch-Einträge für Stufe ③ (Entscheidung der Inhaberin)
  var ANWENDEN_MIN = 1;       // Farb-Fälle mit „passt“ für Stufe ②
  var SICHER_FALSCH_WARN = 2; // wie HINWEIS_SICHER_FALSCH im Meisterin-Bereich

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
  function tage(a, b) { return Math.round((new Date(b+'T12:00:00') - new Date(a+'T12:00:00')) / 86400000); }

  // ── Quiz-Thema ─────────────────────────────────────────────────────
  // Ein Thema „sitzt“ erst, wenn es auch nach ein paar Tagen noch gut läuft:
  // gut_seit = erster Tag der aktuellen Serie guter Runden, gut_am = letzte
  // gute Runde. Zeilen ohne gut_am (vor der Umstellung) behalten die alte Regel.
  function bestaetigt(d) { return !d || !d.gut_am || (!!d.gut_seit && tage(d.gut_seit, d.gut_am) >= SITZT_NACH_TAGEN); }

  // Gut, aber noch nicht über mehrere Tage bestätigt: 'wartet' oder 'faellig'
  function wiederholStatus(d, heute) {
    if (!d || !d.gut_am || !d.gut_seit || bestaetigt(d)) return null;
    return tage(d.gut_seit, heute || iso(new Date())) >= SITZT_NACH_TAGEN ? 'faellig' : 'wartet';
  }

  // 'sitzt' · 'teilweise' · 'unsicher' · null (noch nicht geübt)
  function status(d) {
    if (!d || !d.durchlaeufe) return null;
    var g = d.richtig + d.falsch;
    if (g === 0) return null;
    var q = d.richtig / g;
    if (q >= 0.80 && d.durchlaeufe >= 2 && g >= 4 && (d.letzte_runde === 'gut' || d.letzte_runde === 'sehrgut') && bestaetigt(d)) return 'sitzt';
    if (d.richtig >= 2 && q >= 0.60) return 'teilweise';
    if (d.richtig >= 3 && q >= 0.50) return 'teilweise';
    return 'unsicher';
  }

  // Ampel: 'sitzt' · 'wartet' · 'faellig' · 'wackelt' · 'unsicher' · 'offen'
  function themaStand(d, heute) {
    if (!d || !d.durchlaeufe || (d.richtig + d.falsch) === 0) return 'offen';
    var q = d.richtig / (d.richtig + d.falsch);
    var ws = q >= 0.8 ? wiederholStatus(d, heute) : null;
    if (ws === 'faellig') return 'faellig';
    if (ws === 'wartet') return 'wartet';
    var st = status(d);
    return st === 'sitzt' ? 'sitzt' : st === 'teilweise' ? 'wackelt' : 'unsicher';
  }

  // ── Prüfgespräche und Praxis-Checks ────────────────────────────────
  // Letztes Ergebnis je Schlüssel, unabhängig von der Sortierung der Liste.
  // Mehrere am selben Tag: das schwächste zählt (wie im Meisterin-Bereich).
  var RANG = {nicht:0, teilweise:1, verstanden:2};
  function zeitpunkt(g) { return String(g.datum || '').slice(0, 10) || String(g.erstellt_am || '').slice(0, 10); }
  function letzteJe(liste, schluessel) {
    var out = {};
    (liste || []).forEach(function(g){
      var s = schluessel(g); if (!s || !(g.ergebnis in RANG)) return;
      var t = zeitpunkt(g), o = out[s];
      if (!o || t > o.datum) out[s] = {ergebnis:g.ergebnis, datum:t};
      else if (t === o.datum && RANG[g.ergebnis] < RANG[o.ergebnis]) o.ergebnis = g.ergebnis;
    });
    return out;
  }
  function gespraecheJeThema(liste) {
    return letzteJe(liste, function(g){ return (g.art || 'gespraech') === 'gespraech' ? g.thema : null; });
  }
  function praxisChecksJeBehandlung(liste) {
    return letzteJe(liste, function(g){
      if (g.art !== 'praxis') return null;
      var m = /^praxis-(.+)$/.exec(g.frage_id || '');
      return m ? m[1] : null;
    });
  }

  // ── Kompetenz ──────────────────────────────────────────────────────
  // daten = {
  //   komp:        {thema: Zeile aus `kompetenz`}
  //   praxis:      Zeilen aus `praxis_eintraege` (mind. bereich)
  //   gespraeche:  Zeilen aus `pruefgespraeche` (art, thema, frage_id, ergebnis, datum)
  //   farbPlaene:  Zeilen aus `farb_plaene` (status)
  //   heute:       'YYYY-MM-DD' (optional, sonst heute)
  // }
  // Fehlt eine Quelle (z. B. Migration nicht gelaufen), zählt sie als leer.
  //
  // Ergebnis: {
  //   id, name,
  //   stand:   'warnung' · 'bestaetigt' · 'salon' · 'anwenden' · 'wissen' · 'begonnen' · 'offen'
  //   gruen:   true nur mit Stufe ④ und ohne Warnung
  //   stufen:  {wissen, anwenden, salon, bestaetigt} – true/false, null = (noch) nicht messbar
  //   wissen:  {gesamt, sitzt, geuebt, themen:[{thema, stand}]}
  //   anwenden:{passt} · salon:{eintraege, noetig} · bestaetigt:{quelle, ergebnisse}
  //   warnungen: [{art:'praxis'|'gespraech'|'sicher_falsch', bezug, text}]
  // }
  function kompetenzStand(k, daten) {
    daten = daten || {};
    var komp = daten.komp || {}, heute = daten.heute || iso(new Date());
    var gespr = daten._gespr || gespraecheJeThema(daten.gespraeche);
    var checks = daten._checks || praxisChecksJeBehandlung(daten.gespraeche);
    var warnungen = [];

    // ① Weiß ich: alle Quiz-Themen der Kompetenz sitzen
    var wissen = {gesamt:k.themen.length, sitzt:0, geuebt:0, themen:[]};
    k.themen.forEach(function(th){
      var d = komp[th], s = themaStand(d, heute);
      wissen.themen.push({thema:th, stand:s});
      if (s === 'sitzt') wissen.sitzt++;
      if (s !== 'offen') wissen.geuebt++;
      var sf = (d && d.sicher_falsch_offen) || 0;
      if (sf >= SICHER_FALSCH_WARN) warnungen.push({art:'sicher_falsch', bezug:th, text:sf + '× „sicher“, aber falsch – vermutlich ein Missverständnis'});
    });
    var stufeWissen = k.themen.length ? wissen.sitzt === k.themen.length : null;

    // ② Kann ich anwenden: nur wo es eigene Daten dafür gibt
    var anwenden = {passt:0}, stufeAnwenden = null;
    if (k.anwenden === 'farb_faelle') {
      (daten.farbPlaene || []).forEach(function(p){ if (p.status === 'passt') anwenden.passt++; });
      stufeAnwenden = anwenden.passt >= ANWENDEN_MIN;
    }

    // ③ Im Salon gemacht: genug Einträge im Praxis-Tagebuch
    var salon = {eintraege:0, noetig:SALON_MIN}, stufeSalon = null;
    if (k.praxis.length) {
      (daten.praxis || []).forEach(function(e){ if (k.praxis.indexOf(e.bereich) >= 0) salon.eintraege++; });
      stufeSalon = salon.eintraege >= SALON_MIN;
    }

    // ④ Bestätigt: Praxis-Check der Meisterin, sonst Prüfgespräche zu den Themen
    var best = {quelle:k.praxisCheck.length ? 'praxis' : 'gespraech', ergebnisse:[]}, stufeBest = false;
    if (k.praxisCheck.length) {
      k.praxisCheck.forEach(function(id){
        var c = checks[id]; if (!c) return;
        best.ergebnisse.push({bezug:id, ergebnis:c.ergebnis, datum:c.datum});
        if (c.ergebnis === 'verstanden') stufeBest = true;
        if (c.ergebnis === 'nicht') warnungen.push({art:'praxis', bezug:id, text:'In der Praxis noch nicht sicher'});
      });
    }
    var gespraechAlleVerstanden = true, gespraechDa = false;
    k.themen.forEach(function(th){
      var g = gespr[th]; if (!g) return;
      gespraechDa = true;
      if (!k.praxisCheck.length) best.ergebnisse.push({bezug:th, ergebnis:g.ergebnis, datum:g.datum});
      if (g.ergebnis !== 'verstanden') gespraechAlleVerstanden = false;
      if (g.ergebnis === 'nicht') warnungen.push({art:'gespraech', bezug:th, text:'Im Prüfgespräch noch nicht verstanden'});
    });
    if (!k.praxisCheck.length) stufeBest = gespraechDa && gespraechAlleVerstanden;

    var stufen = {wissen:stufeWissen, anwenden:stufeAnwenden, salon:stufeSalon, bestaetigt:stufeBest};
    var begonnen = wissen.geuebt > 0 || anwenden.passt > 0 || salon.eintraege > 0 || best.ergebnisse.length > 0;
    var stand = warnungen.length ? 'warnung'
      : stufeBest ? 'bestaetigt'
      : stufeSalon ? 'salon'
      : stufeAnwenden ? 'anwenden'
      : stufeWissen ? 'wissen'
      : begonnen ? 'begonnen' : 'offen';

    return {id:k.id, name:k.name, stand:stand, gruen:stand === 'bestaetigt', stufen:stufen,
            wissen:wissen, anwenden:anwenden, salon:salon, bestaetigt:best, warnungen:warnungen};
  }

  // Alle Kompetenzen aus kompetenzen.js auf einmal
  function alleKompetenzen(daten) {
    daten = daten || {};
    var d = Object.assign({}, daten, {
      _gespr: gespraecheJeThema(daten.gespraeche),
      _checks: praxisChecksJeBehandlung(daten.gespraeche)
    });
    return (window.GHD_KOMPETENZEN || []).map(function(k){ return kompetenzStand(k, d); });
  }

  window.GHD_STAND = {
    SITZT_NACH_TAGEN: SITZT_NACH_TAGEN,
    SALON_MIN: SALON_MIN,
    iso: iso,
    tage: tage,
    bestaetigt: bestaetigt,
    wiederholStatus: wiederholStatus,
    status: status,
    themaStand: themaStand,
    gespraecheJeThema: gespraecheJeThema,
    praxisChecksJeBehandlung: praxisChecksJeBehandlung,
    kompetenzStand: kompetenzStand,
    alleKompetenzen: alleKompetenzen
  };
})();
