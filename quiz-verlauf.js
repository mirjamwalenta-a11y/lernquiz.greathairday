// Speichert ein abgeschlossenes Übungs-Quiz (Lern-Tool, Schnittwerkstatt,
// Werkzeugkunde) im Verlauf und Kompetenzstand des eingeloggten Lehrlings –
// genau wie ein Durchlauf im Lernquiz. So sieht der Lehrling (und die
// Meisterin) auch hier, was schon sitzt und was nicht.
// Ohne Lehrlings-Login (z. B. Meisterin oder abgemeldet) wird nichts gespeichert.
// Wer was schreiben darf, regelt die RLS auf `verlauf`/`kompetenz`.
(function(){
  var SB_URL = 'https://wrxlaltgtgkdomklgrlj.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyeGxhbHRndGdrZG9ta2xncmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyNDYwMzYsImV4cCI6MjA5OTgyMjAzNn0.Bw8ch-EJb_cLYTwxHdpjUJWgoCjje3Jc32pB0yiBS8g';
  var client = null;

  function sb() {
    if (window.sb2) return window.sb2;
    if (!client && window.supabase) client = window.supabase.createClient(SB_URL, SB_KEY);
    return client;
  }

  function hinweis(elId, text, farbe) {
    var el = elId && document.getElementById(elId);
    if (el) { el.textContent = text; el.style.color = farbe; }
  }

  function heute() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  // Ohne Migration 20261029_kompetenz_sicherheit_wiederholung.sql kennt die
  // Tabelle gut_seit/gut_am noch nicht – dann ohne die beiden speichern.
  async function schreiben(c, daten, id) {
    var res = id ? await c.from('kompetenz').update(daten).eq('id', id) : await c.from('kompetenz').insert(daten);
    if (res.error && /gut_seit|gut_am/.test(res.error.message || '')) {
      delete daten.gut_seit; delete daten.gut_am;
      res = id ? await c.from('kompetenz').update(daten).eq('id', id) : await c.from('kompetenz').insert(daten);
    }
    return res;
  }

  // antworten: [{thema, korrekt}] – ein Eintrag pro beantworteter Frage
  async function speichern(antworten, elId) {
    if (!antworten || !antworten.length) return false;
    try {
      var c = sb();
      if (!c) throw new Error('Kein Supabase');
      var s = await c.auth.getSession();
      var user = s.data && s.data.session ? s.data.session.user : null;
      if (!user) { hinweis(elId, 'Nicht im Verlauf gespeichert – bitte im Lernquiz einloggen.', '#9A9188'); return false; }
      var l = await c.from('lehrlinge').select('id,lehrjahr').eq('user_id', user.id).maybeSingle();
      if (!l.data) { hinweis(elId, 'Nicht im Verlauf gespeichert – kein Lehrlings-Login.', '#9A9188'); return false; }
      var lid = l.data.id;

      var runde = {}, ok = 0, schwach = [];
      antworten.forEach(function(a){
        if (!runde[a.thema]) runde[a.thema] = {richtig:0, falsch:0};
        if (a.korrekt) { runde[a.thema].richtig++; ok++; }
        else { runde[a.thema].falsch++; if (schwach.indexOf(a.thema) < 0) schwach.push(a.thema); }
      });
      var g = antworten.length;

      var best = await c.from('kompetenz').select('*').eq('lehrling_id', lid);
      var da = {};
      (best.data || []).forEach(function(r){ da[r.thema] = r; });
      for (var th in runde) {
        var r = runde[th].richtig, f = runde[th].falsch, q = r / (r + f);
        var lr = q === 1 ? 'sehrgut' : q > 0.60 ? 'gut' : q >= 0.40 ? 'gemischt' : 'falsch';
        // Wie im Lernquiz: gute Runden über mehrere Tage merken, damit ein
        // Thema erst „sitzt“, wenn es auch ein paar Tage später noch klappt.
        var alt = da[th] || {}, gut = lr === 'gut' || lr === 'sehrgut';
        var tage = {gut_seit: gut ? (alt.gut_seit || heute()) : null, gut_am: gut ? heute() : null};
        if (da[th]) {
          await schreiben(c, Object.assign({richtig:alt.richtig+r, falsch:alt.falsch+f, durchlaeufe:alt.durchlaeufe+1, vorletzte_runde:alt.letzte_runde, letzte_runde:lr}, tage), alt.id);
        } else {
          await schreiben(c, Object.assign({lehrling_id:lid, thema:th, richtig:r, falsch:f, durchlaeufe:1, letzte_runde:lr}, tage), null);
        }
      }
      var v = await c.from('verlauf').insert({lehrling_id:lid, datum:new Date().toLocaleDateString('de-AT'), lehrjahr:l.data.lehrjahr || 1, richtig:ok, falsch:g-ok, gesamt:g, punkte:ok*10, schwach:schwach});
      if (v.error) throw v.error;
      hinweis(elId, '✓ Im Verlauf gespeichert', '#5B7B6F');
      return true;
    } catch (e) {
      hinweis(elId, 'Konnte nicht im Verlauf gespeichert werden.', '#C44030');
      return false;
    }
  }

  // Kurzform für Quizze mit nur einem Thema
  window.ghdQuizSpeichern = function(thema, richtig, gesamt, elId) {
    var a = [];
    for (var i = 0; i < gesamt; i++) a.push({thema:thema, korrekt:i < richtig});
    return speichern(a, elId);
  };
  window.ghdQuizSpeichernAntworten = speichern;
})();
