// ============================================================
// DEMO-MODUS der Lern-App (für Jury, Videoaufnahmen, Vorführungen)
//
// Einbinden als ERSTES Skript im <head> jeder App-Seite:
//   <script src="demo.js?v=…"></script>
// Ohne Demo (Normalfall) tut die Datei nichts.
//
// Gestartet wird der Demo nur über demo.html. Dann gilt auf diesem Gerät:
//  - JEDE Anfrage an Supabase (Datenbank, Anmeldung, Server-Funktionen,
//    KI-Trainer) wird hier im Browser abgefangen und mit erfundenen Daten
//    beantwortet. Nichts geht an den echten Server, auch keine
//    eingetippten Passwörter. Echte Daten sind im Demo nicht erreichbar.
//  - Die erfundenen Daten liegen nur im Browser (localStorage,
//    'ghd-demo-db') und verschwinden mit „Demo beenden“.
//  - Ein Banner oben zeigt immer, dass es der Demo ist.
//
// Sicherheit (CLAUDE.md): Der Demo ist KEIN Login-Weg zum Server. Die
// Meisterin-Rolle gibt es im Demo nur für die erfundenen Daten; die echten
// Daten schützt weiterhin die RLS am Server, die der Demo nie erreicht.
// Keine echten Namen, E-Mail-Adressen oder Zugangsdaten in dieser Datei.
// ============================================================
(function () {
  'use strict';
  var FLAG = 'ghd-demo', DB_KEY = 'ghd-demo-db';
  var SB_HOST = 'wrxlaltgtgkdomklgrlj.supabase.co';
  var SB_TOKEN = 'sb-wrxlaltgtgkdomklgrlj-auth-token';
  // Schlüssel, die beim Wechsel zwischen echt und Demo gelöscht werden
  var AUFRAEUMEN = [SB_TOKEN, 'lq-meisterin-rolle', 'm_eingeloggt', 'en_meisterin'];

  function lies(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function schreib(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { /* egal */ } }
  function aufraeumen() { AUFRAEUMEN.forEach(function (k) { schreib(k, null); try { sessionStorage.removeItem(k); } catch (e) { /* egal */ } }); }

  var AN = lies(FLAG) === '1';

  // ---------- kleine Helfer ----------
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function tageZurueck(n, std) { var d = new Date(); d.setDate(d.getDate() - n); d.setHours(std == null ? 15 : std, 10, 0, 0); return d; }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function b64url(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_'); }

  // ---------- erfundene Daten ----------
  var MEISTERIN = { id: 'demo-0000-meisterin', email: 'meisterin@demo.invalid' };
  var LEHRLINGE = [
    { name: 'Mia Muster', lehrjahr: 3, monate: 26, wochenziel: 3, start: 0.50, ende: 0.88, fleiss: 0.9 },
    { name: 'Jonas Beispiel', lehrjahr: 2, monate: 14, wochenziel: 3, start: 0.45, ende: 0.80, fleiss: 0.75 },
    { name: 'Lea Probe', lehrjahr: 1, monate: 3, wochenziel: 2, start: 0.40, ende: 0.68, fleiss: 0.85 }
  ];
  var PRAXIS = {
    1: [['Haare waschen & Kopfmassage', ''], ['Föhnen mit Rundbürste', ''], ['Farbe anmischen', 'mit der Meisterin'], ['Abteilungen ziehen', 'am Übungskopf']],
    2: [['Ansatzfarbe auftragen', ''], ['Stufenschnitt am Übungskopf', ''], ['Wickeln (Dauerwelle)', ''], ['Strähnen mit Folie', '']],
    3: [['Damenhaarschnitt am Modell', ''], ['Balayage', 'freie Technik'], ['Herrenschnitt mit Maschine', ''], ['Hochsteckfrisur', 'für die LAP']]
  };
  var NOTIZEN = ['Abteilungen sauber – Spannung beim Föhnen noch üben', 'Sehr ordentlich gearbeitet', 'Beim Auftragen schneller werden', 'Kundin war sehr zufrieden'];

  function zufall(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  function seed() {
    var r = zufall(20261116), db = {};
    function t(n) { return db[n] = db[n] || []; }
    var jetzt = new Date().toISOString();
    t('app_rollen').push({ id: uuid(), user_id: MEISTERIN.id, rolle: 'meisterin' });
    var users = [{ id: MEISTERIN.id, email: MEISTERIN.email }];
    var themenAlle = window.GHD_LJ_THEMEN || {};
    LEHRLINGE.forEach(function (L, li) {
      var uid = 'demo-000' + (li + 1) + '-lehrling', lid = uuid();
      var email = L.name.toLowerCase().replace(/\s+/g, '.') + '.lernquiz@greathairday.at';
      users.push({ id: uid, email: email });
      var beginn = new Date(); beginn.setMonth(beginn.getMonth() - L.monate); beginn.setDate(1);
      t('lehrlinge').push({ id: lid, user_id: uid, name: L.name, lehrjahr: L.lehrjahr, aktiv: true, nur_test: false,
        wochenziel: L.wochenziel, lehrbeginn: iso(beginn), art: 'lehrling', erstellt_am: beginn.toISOString() });
      // Quiz-Verlauf: höchstens 11 Monate zurück, Trefferquote steigt langsam
      var tage = Math.min(330, Math.round((Date.now() - beginn) / 864e5));
      var themen = [].concat(themenAlle[String(L.lehrjahr)] || []);
      // Pro Woche meist das Wochenziel (manchmal eines mehr), in manchen Wochen weniger
      var quizTage = [];
      for (var wq = Math.floor(tage / 7); wq >= 0; wq--) {
        var anz = r() < L.fleiss ? L.wochenziel + (r() < 0.3 ? 1 : 0) : Math.max(0, L.wochenziel - 1 - Math.floor(r() * 2));
        var frei = [1, 2, 3, 4, 5, 6, 7].sort(function () { return r() - 0.5; }).slice(0, anz);
        frei.forEach(function (x) { var dq = wq * 7 + x; if (dq >= 1 && dq <= tage) quizTage.push(dq); });
      }
      quizTage.sort(function (a, b) { return b - a; });
      for (var qi = 0; qi < quizTage.length; qi++) {
        var d = quizTage[qi];
        var fort = 1 - d / tage, q = L.start + (L.ende - L.start) * fort + (r() - 0.5) * 0.22;
        var richtig = Math.max(2, Math.min(10, Math.round(q * 10)));
        var ts = tageZurueck(d, 8 + Math.floor(r() * 11)).toISOString();
        t('verlauf').push({ id: uuid(), lehrling_id: lid, erstellt_am: ts, datum: new Date(ts).toLocaleDateString('de-AT'), lehrjahr: L.lehrjahr, richtig: richtig, falsch: 10 - richtig, gesamt: 10,
          punkte: richtig * 10, schwach: richtig < 7 && themen.length ? [themen[Math.floor(r() * themen.length)]] : [], modus: r() < 0.7 ? 'schnell' : 'tief' });
      }
      // Kompetenz je Thema des eigenen und der früheren Lehrjahre
      var hinweis = false;
      for (var lj = 1; lj <= L.lehrjahr; lj++) {
        (themenAlle[String(lj)] || []).forEach(function (th, i) {
          var x = r(), eigenes = lj === L.lehrjahr;
          if (eigenes && L.lehrjahr === 1 && i >= 5) return;           // noch offen
          var art = !eigenes || x < 0.55 ? 'sitzt' : x < 0.8 ? 'wackelt' : x < 0.92 ? 'unsicher' : 'wartet';
          var k = { id: uuid(), lehrling_id: lid, thema: th, durchlaeufe: 4 + Math.floor(r() * 5), geraten: Math.floor(r() * 3), sicher_falsch: 0,
            zusatz_falsch: 0, zusatz_falsch_offen: 0, sicher_falsch_offen: 0, zuletzt_am: iso(tageZurueck(1 + Math.floor(r() * 25))) };
          if (art === 'sitzt') { k.richtig = 18 + Math.floor(r() * 10); k.falsch = 2 + Math.floor(r() * 2); k.letzte_runde = 'gut'; k.vorletzte_runde = 'gut'; k.gut_seit = iso(tageZurueck(30)); k.gut_am = iso(tageZurueck(4)); }
          else if (art === 'wartet') { k.richtig = 12; k.falsch = 2; k.letzte_runde = 'sehrgut'; k.vorletzte_runde = 'gut'; k.gut_seit = iso(tageZurueck(1)); k.gut_am = iso(tageZurueck(1)); }
          else if (art === 'wackelt') { k.richtig = 9; k.falsch = 5; k.letzte_runde = 'gemischt'; k.vorletzte_runde = 'gut'; k.gut_seit = null; k.gut_am = null; }
          else { k.richtig = 4; k.falsch = 6; k.letzte_runde = 'falsch'; k.vorletzte_runde = 'gemischt'; k.gut_seit = null; k.gut_am = null; k.sicher_falsch = 2; if (!hinweis) { k.sicher_falsch_offen = 2; hinweis = true; } }
          t('kompetenz').push(k);
          // Was sitzt, hat die Meisterin meist schon im Gespräch bestätigt (sonst: Prüfhinweis)
          if (art === 'sitzt' && r() < 0.88) {
            var bd = 10 + Math.floor(r() * 70);
            t('pruefgespraeche').push({ id: uuid(), lehrling_id: lid, art: 'gespraech', thema: th, frage_id: null, frage: 'Erklär mir in eigenen Worten: ' + th,
              ergebnis: 'verstanden', notiz: null, datum: iso(tageZurueck(bd)), erstellt_am: tageZurueck(bd).toISOString() });
          }
        });
      }
      // Praxis-Tagebuch: ein bis zwei Einträge pro Woche, die letzten noch unbestätigt
      var pl = PRAXIS[L.lehrjahr];
      for (var w = Math.min(46, Math.floor(tage / 7)); w >= 0; w--) {
        var n = r() < 0.4 ? 2 : 1;
        for (var j = 0; j < n; j++) {
          var dd = w * 7 + Math.floor(r() * 6) + 1, b = pl[Math.floor(r() * pl.length)];
          var best = !(w === 0 && j === 0 && li < 2);
          var e = { id: uuid(), lehrling_id: lid, datum: iso(tageZurueck(dd)), bereich: b[0], details: b[1] || null, dauer_min: [30, 45, 60, 90, 120][Math.floor(r() * 5)],
            kontrolliert_von: 'Meisterin', notiz: null, bestaetigt: best, bestaetigt_am: best ? tageZurueck(Math.max(0, dd - 1)).toISOString() : null,
            meisterin_notiz: best && r() < 0.2 ? NOTIZEN[Math.floor(r() * NOTIZEN.length)] : null, erstellt_am: tageZurueck(dd).toISOString() };
          if (/Farbe|Ansatz/.test(b[0])) e.rezeptur = '6.34 + ¼ 6.0, 6 %, 35 Min';
          t('praxis_eintraege').push(e);
        }
      }
      // Prüfgespräche und Praxis-Checks etwa alle drei Wochen
      for (var g = Math.floor(tage / 21); g >= 4; g--) {
        var gd = g * 21 - Math.floor(r() * 5), gth = themen[Math.floor(r() * themen.length)] || 'Hygiene & Schutzmaßnahmen';
        var erg = r() < 0.65 + 0.25 * (1 - g / Math.max(1, tage / 21)) ? 'verstanden' : r() < 0.7 ? 'teilweise' : 'nicht';
        var praxis = r() < 0.35;
        t('pruefgespraeche').push({ id: uuid(), lehrling_id: lid, art: praxis ? 'praxis' : 'gespraech', thema: gth, frage_id: null,
          frage: praxis ? 'Praxis-Check: ' + gth : 'Erklär mir in eigenen Worten: ' + gth, ergebnis: erg, notiz: null, datum: iso(tageZurueck(gd)), erstellt_am: tageZurueck(gd).toISOString() });
      }
    });
    // Farb-Fälle: einer mit bewertetem Plan, einer wartet auf Rückmeldung
    var mia = db.lehrlinge[0].id, jonas = db.lehrlinge[1].id;
    var f1 = { id: uuid(), titel: 'Stammkundin, möchte wärmer werden, Ansatz 2 cm', ist_th: 6, weiss: 1, gefaerbt: true, wunsch: '6.34', lehrling_id: null, erstellt_am: tageZurueck(20).toISOString() };
    var f2 = { id: uuid(), titel: 'Neukundin, Naturhaar, möchte eine Stufe heller', ist_th: 7, weiss: 0, gefaerbt: false, wunsch: '8.3', lehrling_id: jonas, erstellt_am: tageZurueck(2).toISOString() };
    t('farb_faelle').push(f1, f2);
    t('farb_plaene').push(
      { id: uuid(), fall_id: f1.id, lehrling_id: mia, oxidant: '6 %', farbe_g: 40, naturton_g: 10, oxidant_ml: 75, reihenfolge: 'Ansatz zuerst, Längen in den letzten 10 Minuten', warum: 'Längen sind schon gefärbt', status: 'passt', rueckmeldung: 'Sehr gut begründet', bewertet_am: tageZurueck(18).toISOString(), erstellt_am: tageZurueck(19).toISOString() },
      { id: uuid(), fall_id: f2.id, lehrling_id: jonas, oxidant: '9 %', farbe_g: 60, naturton_g: 0, oxidant_ml: 90, reihenfolge: 'Längen zuerst, Ansatz zuletzt', warum: 'Erstfärbung heller', status: 'offen', rueckmeldung: null, bewertet_am: null, erstellt_am: tageZurueck(1).toISOString() });
    db.__users = users;
    db.__erstellt = jetzt;
    return db;
  }

  // ---------- Datenbank im Browser ----------
  var DB = null;
  function dbLaden() { if (DB) return DB; try { DB = JSON.parse(lies(DB_KEY) || 'null'); } catch (e) { DB = null; } if (!DB) DB = seed(); return DB; }
  function dbSpeichern() { schreib(DB_KEY, JSON.stringify(DB)); }
  function tabelle(n) { var db = dbLaden(); return db[n] = db[n] || []; }

  // ---------- Anmeldung (wie Supabase Auth, nur erfunden) ----------
  function sitzungFuer(u) {
    var jetzt = Math.floor(Date.now() / 1000), exp = jetzt + 3600 * 8;
    var user = { id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email, app_metadata: { provider: 'email' }, user_metadata: { demo: true }, created_at: dbLaden().__erstellt };
    return { access_token: b64url({ alg: 'HS256', typ: 'JWT' }) + '.' + b64url({ sub: u.id, email: u.email, role: 'authenticated', aud: 'authenticated', iat: jetzt, exp: exp, demo: true }) + '.demo',
      token_type: 'bearer', expires_in: exp - jetzt, expires_at: exp, refresh_token: 'demo-' + u.id, user: user };
  }
  function nutzerAusToken(h) {
    var m = /Bearer\s+([^\s]+)/i.exec(h || ''); if (!m) return null;
    try { var p = JSON.parse(decodeURIComponent(escape(atob(m[1].split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))))); return (dbLaden().__users || []).filter(function (u) { return u.id === p.sub; })[0] || null; } catch (e) { return null; }
  }
  function nutzerPerMail(mail) { return (dbLaden().__users || []).filter(function (u) { return u.email === String(mail || '').toLowerCase(); })[0] || null; }

  // ---------- PostgREST nachgebaut (nur, was die App braucht) ----------
  function teileListe(s) { // in.(a,"b,c",d)
    var out = [], cur = '', q = false;
    for (var i = 0; i < s.length; i++) { var c = s[i]; if (c === '"') { q = !q; continue; } if (c === ',' && !q) { out.push(cur); cur = ''; continue; } cur += c; }
    out.push(cur); return out;
  }
  function vergleich(a, b) {
    if (a == null) return -1;
    var na = Number(a), nb = Number(b);
    if (typeof a === 'number' && !isNaN(nb)) return na - nb;
    return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
  }
  function gleich(a, b) { if (a == null) return b === 'null'; if (typeof a === 'object') return JSON.stringify(a) === b; return String(a) === b; }
  function filterPasst(row, spalte, ausdruck) {
    var nicht = false;
    if (ausdruck.indexOf('not.') === 0) { nicht = true; ausdruck = ausdruck.slice(4); }
    var p = ausdruck.indexOf('.'), op = ausdruck.slice(0, p), w = ausdruck.slice(p + 1), v = row[spalte], ok;
    switch (op) {
      case 'eq': ok = gleich(v, w); break;
      case 'neq': ok = !gleich(v, w); break;
      case 'gt': ok = v != null && vergleich(v, w) > 0; break;
      case 'gte': ok = v != null && vergleich(v, w) >= 0; break;
      case 'lt': ok = v != null && vergleich(v, w) < 0; break;
      case 'lte': ok = v != null && vergleich(v, w) <= 0; break;
      case 'in': ok = teileListe(w.replace(/^\(|\)$/g, '')).some(function (x) { return gleich(v, x); }); break;
      case 'is': ok = w === 'null' ? v == null : w === 'true' ? v === true : w === 'false' ? v === false : false; break;
      case 'like': case 'ilike':
        var re = new RegExp('^' + w.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/[*%]/g, '.*') + '$', op === 'ilike' ? 'i' : '');
        ok = v != null && re.test(String(v)); break;
      case 'cs': try { var arr = JSON.parse(w.replace(/^\{/, '[').replace(/\}$/, ']')); ok = Array.isArray(v) && arr.every(function (x) { return v.indexOf(x) >= 0; }); } catch (e) { ok = false; } break;
      default: ok = true;
    }
    return nicht ? !ok : ok;
  }
  var STEUER = ['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'];
  function treffer(rows, params) {
    var f = [];
    params.forEach(function (w, k) { if (STEUER.indexOf(k) < 0) f.push([k, w]); });
    return rows.filter(function (r) { return f.every(function (x) { return filterPasst(r, x[0], x[1]); }); });
  }
  function auswahl(rows, sel) {
    if (!sel || sel === '*' || /(^|,)\*(,|$)/.test(sel)) return rows.map(function (r) { return Object.assign({}, r); });
    var sp = sel.split(',').map(function (s) { s = s.trim(); var a = s.split(':'); return { als: a.length > 1 ? a[0] : s.replace(/::.*/, ''), von: (a.length > 1 ? a[1] : s).replace(/::.*/, '') }; });
    return rows.map(function (r) { var o = {}; sp.forEach(function (s) { o[s.als] = r[s.von] === undefined ? null : r[s.von]; }); return o; });
  }
  function sortiere(rows, order) {
    if (!order) return rows;
    var teile = order.split(',').map(function (o) { var t = o.split('.'); return { s: t[0], ab: t.indexOf('desc') > 0 }; });
    return rows.slice().sort(function (a, b) {
      for (var i = 0; i < teile.length; i++) { var x = teile[i], c = a[x.s] == null && b[x.s] == null ? 0 : a[x.s] == null ? 1 : b[x.s] == null ? -1 : vergleich(a[x.s], b[x.s]); if (c) return x.ab ? -c : c; }
      return 0;
    });
  }
  function neueZeile(tab, o) {
    var z = Object.assign({}, o);
    if (z.id == null) z.id = uuid();
    if (z.erstellt_am == null) z.erstellt_am = new Date().toISOString();
    if (tab === 'praxis_eintraege' && z.bestaetigt == null) z.bestaetigt = false;
    if (tab === 'lehrlinge') { if (z.aktiv == null) z.aktiv = true; if (z.nur_test == null) z.nur_test = false; }
    if (tab === 'farb_plaene' && z.status == null) z.status = 'offen';
    return z;
  }

  function antwort(status, body, kopf) {
    var h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8' }, kopf || {});
    return Promise.resolve(new Response(body === undefined || status === 204 ? null : JSON.stringify(body), { status: status, headers: h }));
  }
  function kopfwert(headers, name) {
    if (!headers) return '';
    if (typeof headers.get === 'function') return headers.get(name) || '';
    var k = Object.keys(headers).filter(function (x) { return x.toLowerCase() === name.toLowerCase(); })[0];
    return k ? headers[k] : '';
  }

  function rest(tab, url, methode, headers, body) {
    var p = url.searchParams, prefer = kopfwert(headers, 'Prefer'), accept = kopfwert(headers, 'Accept');
    var objekt = /vnd\.pgrst\.object/.test(accept), zurueck = /return=representation/.test(prefer), zaehlen = /count=(exact|planned|estimated)/.test(prefer);
    var rows = tabelle(tab), ergebnis;
    if (methode === 'GET' || methode === 'HEAD') {
      var alle = sortiere(treffer(rows, p), p.get('order'));
      var ab = +(p.get('offset') || 0), lim = p.has('limit') ? +p.get('limit') : Infinity;
      ergebnis = alle.slice(ab, ab + lim);
      var kopf = { 'Content-Range': (ergebnis.length ? ab + '-' + (ab + ergebnis.length - 1) : '*') + '/' + (zaehlen ? alle.length : '*') };
      if (methode === 'HEAD') return antwort(200, undefined, kopf);
      ergebnis = auswahl(ergebnis, p.get('select'));
      if (objekt) return ergebnis.length === 1 ? antwort(200, ergebnis[0], kopf) : antwort(406, { code: 'PGRST116', details: 'The result contains ' + ergebnis.length + ' rows', hint: null, message: 'JSON object requested, multiple (or no) rows returned' });
      return antwort(200, ergebnis, kopf);
    }
    var daten = null; try { daten = body ? JSON.parse(body) : null; } catch (e) { daten = null; }
    if (methode === 'POST') {
      var liste = Array.isArray(daten) ? daten : [daten || {}], neu = [];
      var merge = /resolution=merge-duplicates/.test(prefer), ignor = /resolution=ignore-duplicates/.test(prefer);
      var schluessel = (p.get('on_conflict') || 'id').split(',');
      liste.forEach(function (o) {
        var da = (merge || ignor) ? rows.filter(function (r) { return schluessel.every(function (s) { return o[s] != null && String(r[s]) === String(o[s]); }); })[0] : null;
        if (da) { if (merge) Object.assign(da, o); neu.push(da); }
        else { var z = neueZeile(tab, o); rows.push(z); neu.push(z); }
      });
      dbSpeichern();
      ergebnis = auswahl(neu, p.get('select'));
    } else if (methode === 'PATCH') {
      var zu = treffer(rows, p);
      zu.forEach(function (r) { Object.assign(r, daten || {}); });
      dbSpeichern();
      ergebnis = auswahl(zu, p.get('select'));
    } else if (methode === 'DELETE') {
      var weg = treffer(rows, p);
      DB[tab] = rows.filter(function (r) { return weg.indexOf(r) < 0; });
      dbSpeichern();
      ergebnis = auswahl(weg, p.get('select'));
    } else return antwort(405, { message: 'Im Demo nicht möglich' });
    if (!zurueck) return antwort(methode === 'POST' ? 201 : 204);
    if (objekt) return ergebnis.length === 1 ? antwort(200, ergebnis[0]) : antwort(406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' });
    return antwort(methode === 'POST' ? 201 : 200, ergebnis);
  }

  function rpc(name, headers) {
    var u = nutzerAusToken(kopfwert(headers, 'Authorization'));
    if (name === 'ist_meisterin') return antwort(200, !!u && u.id === MEISTERIN.id);
    if (name === 'teamapp_ist_inhaberin') return antwort(200, false);
    return antwort(200, null);   // alle anderen Server-Funktionen: im Demo ohne Wirkung
  }

  function auth(pfad, url, methode, headers, body) {
    var daten = null; try { daten = body ? JSON.parse(body) : null; } catch (e) { daten = null; }
    if (pfad === 'token') {
      var g = url.searchParams.get('grant_type'), u = null;
      if (g === 'password') u = nutzerPerMail(daten && daten.email);
      if (g === 'refresh_token') { var id = String(daten && daten.refresh_token || '').replace(/^demo-/, ''); u = (dbLaden().__users || []).filter(function (x) { return x.id === id; })[0]; }
      if (!u) return antwort(400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
      return antwort(200, sitzungFuer(u));
    }
    if (pfad === 'user') {
      var me = nutzerAusToken(kopfwert(headers, 'Authorization'));
      if (!me) return antwort(401, { code: 401, error_code: 'bad_jwt', msg: 'invalid JWT' });
      return antwort(200, sitzungFuer(me).user);
    }
    if (pfad === 'logout') return antwort(204);
    if (pfad === 'signup') {
      var mail = String(daten && daten.email || '').toLowerCase();
      if (!mail) return antwort(400, { code: 400, msg: 'E-Mail fehlt' });
      var db = dbLaden(), neu = nutzerPerMail(mail);
      if (!neu) { neu = { id: 'demo-' + uuid(), email: mail }; db.__users.push(neu); dbSpeichern(); }
      return antwort(200, sitzungFuer(neu));
    }
    return antwort(200, {});
  }

  var KI_TEXT = 'Im Demo ist der KI-Trainer ausgeschaltet. In der echten App bekommst du hier eine Rückmeldung von Wörni.';
  function abfangen(url, methode, headers, body) {
    var pfad = url.pathname;
    if (pfad.indexOf('/rest/v1/rpc/') === 0) return rpc(pfad.slice(13), headers);
    if (pfad.indexOf('/rest/v1/') === 0) return rest(decodeURIComponent(pfad.slice(9)), url, methode, headers, body);
    if (pfad.indexOf('/auth/v1/') === 0) return auth(pfad.slice(9).split('/')[0], url, methode, headers, body);
    if (pfad.indexOf('/functions/v1/') === 0) return antwort(200, { content: [{ type: 'text', text: KI_TEXT }], demo: true });
    return antwort(404, { message: 'Im Demo nicht verfügbar' });
  }

  // ---------- Steuerung (auch für demo.html) ----------
  window.ghdDemo = {
    an: AN,
    // Demo starten: echte Anmeldung auf diesem Gerät beenden, frische
    // erfundene Daten anlegen und als Meisterin bzw. Lehrling anmelden.
    starten: function (rolle) {
      aufraeumen();
      DB = seed(); dbSpeichern();
      var u = rolle === 'meisterin' ? DB.__users[0] : DB.__users[1];
      schreib(SB_TOKEN, JSON.stringify(sitzungFuer(u)));
      schreib(FLAG, '1');
    },
    beenden: function () {
      aufraeumen();
      schreib(DB_KEY, null); schreib(FLAG, null);
      location.href = 'demo.html?beendet=1';
    }
  };

  if (!AN) return;

  // ---------- ab hier nur im Demo ----------
  window.GHD_DEMO = true;
  // Offline-Teil (ghd-offline.js) im Demo nicht laden: Er würde erfundene
  // Anmelde-Token an den Service Worker weitergeben.
  if (!window.ghdOffline) window.ghdOffline = { demo: true };

  var echtesFetch = window.fetch.bind(window);
  window.fetch = function (eingabe, opt) {
    var adresse = typeof eingabe === 'string' ? eingabe : (eingabe && eingabe.url) || String(eingabe);
    var url; try { url = new URL(adresse, location.href); } catch (e) { return echtesFetch(eingabe, opt); }
    if (url.hostname !== SB_HOST && !/\.supabase\.(co|in)$/.test(url.hostname)) return echtesFetch(eingabe, opt);
    opt = opt || {};
    var methode = (opt.method || (eingabe && eingabe.method) || 'GET').toUpperCase();
    var headers = opt.headers || (eingabe && eingabe.headers) || {};
    var body = opt.body;
    if (body == null && eingabe && typeof eingabe.text === 'function' && methode !== 'GET' && methode !== 'HEAD') {
      return eingabe.clone().text().then(function (t) { return abfangen(url, methode, headers, t); });
    }
    if (body != null && typeof body !== 'string') { try { body = String(body); } catch (e) { body = null; } }
    try { return abfangen(url, methode, headers, body); }
    catch (e) { return antwort(500, { message: 'Demo-Fehler: ' + e.message }); }
  };
  // Echtzeit-Verbindungen (WebSocket) zu Supabase gibt es im Demo nicht
  if (window.WebSocket) {
    var EchtWS = window.WebSocket;
    window.WebSocket = function (u, p) { if (/supabase\.(co|in)/.test(String(u))) throw new Error('Im Demo keine Echtzeit-Verbindung'); return p ? new EchtWS(u, p) : new EchtWS(u); };
    window.WebSocket.prototype = EchtWS.prototype;
  }

  // Banner: immer sichtbar, damit niemand Demo und echte App verwechselt
  function banner() {
    if (document.getElementById('ghd-demo-banner')) return;
    var b = document.createElement('div');
    b.id = 'ghd-demo-banner';
    b.setAttribute('role', 'status');
    b.style.cssText = 'position:sticky;top:0;z-index:99999;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;' +
      'background:#211D17;color:#F3EBD9;font:500 12px/1.3 Poppins,system-ui,sans-serif;padding:7px 12px;text-align:center';
    b.innerHTML = '<span><b style="color:#D2B270;letter-spacing:1px">DEMO</b> · erfundene Daten, nichts geht an den Server</span>' +
      '<a href="demo.html" style="color:#F3EBD9;text-decoration:underline">Rolle wechseln</a>' +
      '<button type="button" style="font:inherit;background:#896C32;color:#fff;border:0;border-radius:6px;padding:4px 10px;cursor:pointer">Demo beenden</button>';
    b.querySelector('button').addEventListener('click', function () { window.ghdDemo.beenden(); });
    document.body.insertBefore(b, document.body.firstChild);
    document.title = 'Demo · ' + document.title.replace(/^Demo · /, '');
  }
  if (document.body) banner(); else document.addEventListener('DOMContentLoaded', banner);
})();
