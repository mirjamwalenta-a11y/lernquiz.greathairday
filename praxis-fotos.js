// Praxis-Tagebuch: Fotos (bis zu 3 pro Eintrag)
// Gemeinsam für Lern-Tool (Lehrling) und Meisterin-Bereich (lernquiz.html).
// Datenbank: supabase/20261116_praxis_fotos.sql (Tabelle praxis_fotos,
// privater Bucket praxis-fotos). Wer was sehen und löschen darf, entscheiden
// RLS und Storage-Regeln am Server – dieses Skript ist nur die Bedienung.
//
//   PraxisFotos.verfuegbar(sb)              → true, wenn die Migration gelaufen ist
//   PraxisFotos.fuellen(box, sb, {loeschen, zeichnen}) füllt alle [data-pf-eintrag="<id>"] in box
//                                            mit Vorschaubildern; antippen = groß ansehen
//   PraxisFotos.hochladen(sb, {lehrlingId, eintragId, datei, motiv, einverstaendnis})
//   PraxisFotos.loeschen(sb, fotos)         Dateien (Storage-API) und Zeilen löschen
//   PraxisFotos.vergleich(sb, lehrlingId, {titel}) Vorher-Nachher-Ansicht
//   PraxisFotos.anzahl(sb, lehrlingId)       wie viele Fotos ein Lehrling hat
//   PraxisFotos.eintragLeeren(sb, eintragId)  alle Fotos eines Eintrags löschen
//   PraxisFotos.lehrlingLeeren(sb, lehrlingId) alle Fotos eines Lehrlings löschen
//
// Fotos werden vor dem Hochladen auf höchstens 1600 px verkleinert und neu
// als JPEG gespeichert. Dabei fallen die Bild-Metadaten weg (z. B. der
// Aufnahmeort). Angezeigt wird über zeitlich begrenzte Links (1 Stunde).
(function () {
  var BUCKET = 'praxis-fotos', MAX_PX = 1600, MAX = 3;

  var css =
    '.pf-reihe{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}' +
    '.pf-reihe:empty{display:none}' +
    '.pf-bild{width:56px;height:56px;border-radius:8px;border:1px solid #E4DBC5;background:#F8F4EA;padding:0;overflow:hidden;cursor:pointer;flex:none}' +
    '.pf-bild img{width:100%;height:100%;object-fit:cover;display:block}' +
    '.pf-bild:focus-visible{outline:2px solid #896C32;outline-offset:2px}' +
    // Großansicht wie die vorhandenen Fenster der App (.mb-wahl / .mb-wahl-box):
    // helle Box #F8F4EA auf abgedunkeltem Hintergrund, Tasten in Gold #896C32
    '.pf-gross{position:fixed;inset:0;z-index:1000;background:rgba(33,29,23,.45);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.pf-gross[hidden]{display:none}' +
    '.pf-box{background:#F8F4EA;border-radius:14px;padding:16px;width:100%;max-width:560px;max-height:100%;overflow:auto;display:flex;flex-direction:column;align-items:center;gap:12px;font-family:Poppins,system-ui,sans-serif}' +
    '.pf-buehne{position:relative;display:inline-block;max-width:100%;line-height:0}' +
    '.pf-gross img{max-width:100%;max-height:calc(100vh - 260px);border-radius:8px;background:#fff}' +
    '.pf-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
    '.pf-malen .pf-svg{pointer-events:auto;touch-action:none;cursor:crosshair}' +
    '.pf-gross [hidden],.pf-gross .pf-k[hidden]{display:none!important}' +
    '.pf-bild.pf-markiert{border:2px solid #896C32}' +
    '.pf-gross .pf-k{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}' +
    '.pf-gross button{border:1px solid #896C32;background:transparent;color:#896C32;border-radius:6px;padding:10px 14px;font:600 13px Poppins,system-ui,sans-serif;cursor:pointer;min-height:44px}' +
    '.pf-gross button[aria-pressed="true"],.pf-gross button[data-pfk="speichern"]{background:#896C32;color:#fff}' +
    '.pf-gross .pf-info{color:#6B6455;font:12px Poppins,system-ui,sans-serif;text-align:center}' +
    // Vorher-Nachher: gleiche Box, gleiche Tasten
    '.pf-vg-titel{font:600 15px Poppins,system-ui,sans-serif;color:#211D17;align-self:flex-start}' +
    '.pf-vg-paar{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}' +
    '.pf-gross button.pf-vg-seite{padding:6px;display:flex;flex-direction:column;gap:6px;align-items:stretch;min-height:0;background:#fff;color:#211D17;border:1.5px solid #E4DBC5}' +
    '.pf-gross button.pf-vg-seite[aria-pressed="true"]{border:2px solid #896C32;background:#fff;color:#211D17}' +
    '.pf-vg-seite img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:6px;max-height:none}' +
    '.pf-vg-seite small{display:block;font:600 10px Poppins,system-ui,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#896C32}' +
    '.pf-vg-seite span{display:block;font:12px Poppins,system-ui,sans-serif;color:#6B6455}' +
    '.pf-vg-reihe{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;width:100%}' +
    '.pf-gross .pf-vg-reihe button.pf-bild{padding:0;min-height:0;border:1px solid #E4DBC5;background:#F8F4EA}' +
    '.pf-gross .pf-vg-reihe button.pf-bild[aria-pressed="true"]{border:2px solid #896C32;background:#F8F4EA}' +
    // Häkchen „Einverständnis“ im Lern-Tool-Formular: Aussehen wie .pm-check,
    // nicht wie die Großbuchstaben-Überschriften (.pt-f label)
    '.pt-f label.pm-check{text-transform:none;letter-spacing:0;font-weight:400;font-size:14px;color:#2C2C2C;margin:6px 0;display:flex}' +
    '.pt-f label.pm-check[hidden]{display:none}' +
    '.pt-f .pt-dauer[hidden],.pt-f [hidden]{display:none}' +
    '@media print{.pf-reihe{display:none}}';
  var stilDa = false;
  function stil() {
    if (stilDa) return; stilDa = true;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  // ── Verfügbar? (Migration gelaufen) ───────────────────────────────
  var verfuegbarCache = null;
  async function verfuegbar(sb) {
    if (verfuegbarCache !== null) return verfuegbarCache;
    try {
      var r = await sb.from('praxis_fotos').select('id').limit(1);
      verfuegbarCache = !r.error;
    } catch (e) { verfuegbarCache = false; }
    return verfuegbarCache;
  }

  // ── Verkleinern ───────────────────────────────────────────────────
  async function verkleinern(datei) {
    var bild;
    try { bild = await createImageBitmap(datei, {imageOrientation: 'from-image'}); }
    catch (e) {
      bild = await new Promise(function (ok, fehler) {
        var i = new Image(), u = URL.createObjectURL(datei);
        i.onload = function () { URL.revokeObjectURL(u); ok(i); };
        i.onerror = function () { URL.revokeObjectURL(u); fehler(new Error('Bild konnte nicht gelesen werden')); };
        i.src = u;
      });
    }
    var w = bild.width, h = bild.height, f = Math.min(1, MAX_PX / Math.max(w, h));
    var c = document.createElement('canvas');
    c.width = Math.round(w * f); c.height = Math.round(h * f);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(bild, 0, 0, c.width, c.height);
    if (bild.close) bild.close();
    var blob = null;
    for (var q = 0.82; q >= 0.5 && (!blob || blob.size > 1900000); q -= 0.12) {
      blob = await new Promise(function (ok) { c.toBlob(ok, 'image/jpeg', q); });
    }
    if (!blob) throw new Error('Bild konnte nicht umgewandelt werden');
    return blob;
  }

  // ── Hochladen: erst die Zeile, dann die Datei ─────────────────────
  // Die Storage-Regel lässt eine Datei nur zu, wenn die Zeile schon da ist.
  // Klappt die Datei nicht, wird die Zeile wieder entfernt.
  async function hochladen(sb, o) {
    var blob = await verkleinern(o.datei);
    var id = uuid();
    var pfad = String(o.lehrlingId) + '/' + String(o.eintragId) + '/' + id + '.jpg';
    var zeile = {id: id, eintrag_id: o.eintragId, lehrling_id: o.lehrlingId, pfad: pfad,
                 motiv: o.motiv, einverstaendnis: !!o.einverstaendnis};
    var r = await sb.from('praxis_fotos').insert(zeile);
    if (r.error) throw r.error;
    var u = await sb.storage.from(BUCKET).upload(pfad, blob, {contentType: 'image/jpeg', upsert: false});
    if (u.error) {
      try { await sb.from('praxis_fotos').delete().eq('id', id); } catch (e) {}
      throw u.error;
    }
    return zeile;
  }

  // ── Löschen: erst die Dateien (Storage-API), dann die Zeilen ──────
  async function loeschen(sb, fotos) {
    fotos = (fotos || []).filter(Boolean);
    if (!fotos.length) return;
    var r = await sb.storage.from(BUCKET).remove(fotos.map(function (f) { return f.pfad; }));
    if (r.error) throw r.error;
    var d = await sb.from('praxis_fotos').delete().in('id', fotos.map(function (f) { return f.id; }));
    if (d.error) throw d.error;
  }
  async function holen(sb, spalte, wert) {
    var r = await sb.from('praxis_fotos').select('id,pfad').eq(spalte, wert);
    if (r.error) {
      // Ohne Migration gibt es keine Fotos: nichts zu tun
      if (/praxis_fotos/.test(r.error.message || '') || r.error.code === '42P01' || r.error.code === 'PGRST205') return [];
      throw r.error;
    }
    return r.data || [];
  }
  async function eintragLeeren(sb, eintragId) { await loeschen(sb, await holen(sb, 'eintrag_id', eintragId)); }
  async function lehrlingLeeren(sb, lehrlingId) { await loeschen(sb, await holen(sb, 'lehrling_id', lehrlingId)); }

  // ── Anzeigen ──────────────────────────────────────────────────────
  // Großansicht mit Markierungs-Ebene (SVG über dem Foto, Koordinaten in %
  // des Fotos). Das Foto selbst wird nie verändert.
  // Zeichnen nur mit o.zeichnen (Meisterin-Bereich); speichern darf am
  // Server ohnehin nur die Meisterin (supabase/20261116_praxis_fotos_zeichnung.sql).
  var GOLD = '#896C32';  // Gold der App; der weiße Rand darunter macht es auf jedem Foto sichtbar
  var GROSS = null;      // {fotos, i, sb, loeschen, zeichnen, nachher, an, modus, werkzeug, striche, neu}
  function rund(x) { return Math.round(x * 10) / 10; }
  function svgEl(name, attr) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attr).forEach(function (k) { e.setAttribute(k, attr[k]); });
    return e;
  }
  // Pfeilspitze: im Seitenverhältnis des Fotos rechnen, sonst wäre sie verzerrt
  function spitze(a, b, r) {
    var ax = a[0], ay = a[1] * r, bx = b[0], by = b[1] * r;
    var w = Math.atan2(by - ay, bx - ax), l = 4, d = 0.45;
    return [[bx - l * Math.cos(w - d), (by - l * Math.sin(w - d)) / r], [bx, by / r], [bx - l * Math.cos(w + d), (by - l * Math.sin(w + d)) / r]];
  }
  function zeichne(svg, striche, r) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    // Jede Form zweimal: zuerst breit in Weiß (Rand), darüber in Gold
    [{stroke: '#fff', 'stroke-width': 7}, {stroke: GOLD, 'stroke-width': 4}].forEach(function (lage) {
    var stil = {fill: 'none', stroke: lage.stroke, 'stroke-width': lage['stroke-width'], 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke'};
    (striche || []).forEach(function (x) {
      var a = Object.assign({}, stil);
      if (x.t === 'p' && x.p && x.p.length > 1) { a.points = x.p.map(function (q) { return q.join(','); }).join(' '); svg.appendChild(svgEl('polyline', a)); }
      if (x.t === 'k' && x.a && x.b) {
        a.cx = (x.a[0] + x.b[0]) / 2; a.cy = (x.a[1] + x.b[1]) / 2; a.rx = Math.abs(x.b[0] - x.a[0]) / 2; a.ry = Math.abs(x.b[1] - x.a[1]) / 2;
        svg.appendChild(svgEl('ellipse', a));
      }
      if (x.t === 'f' && x.a && x.b) {
        a.points = x.a.join(',') + ' ' + x.b.join(','); svg.appendChild(svgEl('polyline', a));
        var b2 = Object.assign({}, stil); b2.points = spitze(x.a, x.b, r).map(function (q) { return q.join(','); }).join(' ');
        svg.appendChild(svgEl('polyline', b2));
      }
    });
    });
  }
  function verhaeltnis(img) { return img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1; }
  function neuZeichnen() {
    var el = document.getElementById('pf-gross'); if (!el || !GROSS) return;
    var img = el.querySelector('img'), svg = el.querySelector('svg');
    var striche = GROSS.modus ? GROSS.striche : (GROSS.an ? ((GROSS.fotos[GROSS.i].zeichnung || {}).s || []) : []);
    zeichne(svg, striche.concat(GROSS.neu ? [GROSS.neu] : []), verhaeltnis(img));
  }
  function grossBauen() {
    var el = document.getElementById('pf-gross');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'pf-gross'; el.className = 'pf-gross'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Foto');
    el.innerHTML = '<div class="pf-box"><div class="pf-buehne"><img alt=""><svg class="pf-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg></div>' +
      '<div class="pf-info"></div>' +
      '<div class="pf-k" data-leiste="normal">' +
        '<button type="button" data-pfk="vor">‹ Voriges</button><button type="button" data-pfk="nach">Nächstes ›</button>' +
        '<button type="button" data-pfk="ebene">Markierungen aus</button><button type="button" data-pfk="zeichnen">✎ Markieren</button>' +
        '<button type="button" data-pfk="weg">Foto löschen</button><button type="button" data-pfk="zu">Schließen</button></div>' +
      '<div class="pf-k" data-leiste="zeichnen" hidden>' +
        '<button type="button" data-pfw="p" aria-pressed="true">Stift</button><button type="button" data-pfw="k" aria-pressed="false">Kreis</button>' +
        '<button type="button" data-pfw="f" aria-pressed="false">Pfeil</button>' +
        '<button type="button" data-pfk="zurueck">↶ Rückgängig</button><button type="button" data-pfk="leeren">Alles löschen</button>' +
        '<button type="button" data-pfk="speichern">Speichern</button><button type="button" data-pfk="abbrechen">Abbrechen</button></div></div>';
    el.querySelector('img').addEventListener('load', neuZeichnen);
    el.addEventListener('click', async function (ev) {
      var t = ev.target.closest ? ev.target.closest('button') : null;
      var k = t && t.getAttribute('data-pfk'), w = t && t.getAttribute('data-pfw');
      if (ev.target === el && !(GROSS && GROSS.modus)) { grossZu(); return; }
      if (k === 'zu') { grossZu(); return; }
      if (!GROSS) return;
      if (k === 'vor' || k === 'nach') { GROSS.i = (GROSS.i + (k === 'vor' ? -1 : 1) + GROSS.fotos.length) % GROSS.fotos.length; GROSS.an = true; grossZeigen(); }
      if (k === 'ebene') { GROSS.an = !GROSS.an; grossZeigen(); }
      if (k === 'zeichnen') { GROSS.modus = true; GROSS.werkzeug = 'p'; GROSS.striche = (((GROSS.fotos[GROSS.i].zeichnung || {}).s) || []).slice(); grossZeigen(); }
      if (w) { GROSS.werkzeug = w; grossZeigen(); }
      if (k === 'zurueck') { GROSS.striche.pop(); neuZeichnen(); }
      if (k === 'leeren') { if (GROSS.striche.length && confirm('Alle Markierungen auf diesem Foto löschen?')) { GROSS.striche = []; neuZeichnen(); } }
      if (k === 'abbrechen') { GROSS.modus = false; GROSS.neu = null; grossZeigen(); }
      if (k === 'speichern') {
        var f = GROSS.fotos[GROSS.i], z = GROSS.striche.length ? {v: 1, s: GROSS.striche} : null;
        t.disabled = true; t.textContent = 'Speichert …';
        try {
          var r = await GROSS.sb.from('praxis_fotos').update({zeichnung: z}).eq('id', f.id).select('id');
          if (r.error) throw r.error;
          if (!r.data || !r.data.length) throw new Error('keine Berechtigung');
          f.zeichnung = z; GROSS.modus = false; GROSS.an = true;
          GROSS.nachherLeise = true;   // beim Schließen Liste neu laden (Rand an markierten Fotos)
        } catch (e) {
          var m = String((e && e.message) || e);
          alert(/zeichnung/.test(m) ? 'Das Markieren braucht noch die Datenbank-Änderung (supabase/20261116_praxis_fotos_zeichnung.sql).'
            : 'Konnte nicht gespeichert werden' + (navigator.onLine === false ? ' – keine Internetverbindung.' : '.'));
        }
        t.disabled = false; t.textContent = 'Speichern';
        grossZeigen();
      }
      if (k === 'weg') {
        if (!confirm('Dieses Foto wirklich löschen?')) return;
        t.disabled = true;
        try { await loeschen(GROSS.sb, [GROSS.fotos[GROSS.i]]); }
        catch (e) { t.disabled = false; alert('Foto konnte nicht gelöscht werden' + (navigator.onLine === false ? ' – keine Internetverbindung.' : '.')); return; }
        t.disabled = false;
        var nachher = GROSS.nachher; grossZu();
        if (nachher) nachher();
      }
    });
    // Zeichnen mit Finger, Stift oder Maus
    var svg = el.querySelector('svg');
    function punkt(ev) {
      var b = svg.getBoundingClientRect();
      return [rund(Math.min(100, Math.max(0, (ev.clientX - b.left) / b.width * 100))), rund(Math.min(100, Math.max(0, (ev.clientY - b.top) / b.height * 100)))];
    }
    svg.addEventListener('pointerdown', function (ev) {
      if (!GROSS || !GROSS.modus) return;
      ev.preventDefault(); svg.setPointerCapture(ev.pointerId);
      var q = punkt(ev);
      GROSS.neu = GROSS.werkzeug === 'p' ? {t: 'p', p: [q]} : {t: GROSS.werkzeug, a: q, b: q};
      neuZeichnen();
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!GROSS || !GROSS.neu) return;
      var q = punkt(ev), n = GROSS.neu;
      if (n.t === 'p') { var l = n.p[n.p.length - 1]; if (Math.abs(l[0] - q[0]) + Math.abs(l[1] - q[1]) >= 0.6) n.p.push(q); }
      else n.b = q;
      neuZeichnen();
    });
    function ende() {
      if (!GROSS || !GROSS.neu) return;
      var n = GROSS.neu, gross = n.t === 'p' ? n.p.length > 1 : (Math.abs(n.a[0] - n.b[0]) + Math.abs(n.a[1] - n.b[1]) > 2);
      if (gross) GROSS.striche.push(n);
      GROSS.neu = null; neuZeichnen();
    }
    svg.addEventListener('pointerup', ende);
    svg.addEventListener('pointercancel', ende);
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !el.hidden && !(GROSS && GROSS.modus)) grossZu(); });
    document.body.appendChild(el);
    return el;
  }
  function grossZeigen() {
    var el = grossBauen(), f = GROSS.fotos[GROSS.i], img = el.querySelector('img');
    if (img.getAttribute('src') !== f.url) img.src = f.url;
    img.alt = 'Praxis-Foto ' + (GROSS.i + 1) + ' von ' + GROSS.fotos.length;
    var hat = !!(f.zeichnung && f.zeichnung.s && f.zeichnung.s.length);
    el.querySelector('.pf-info').textContent = GROSS.modus
      ? 'Zeichne mit dem Finger auf das Foto. Das Foto selbst bleibt unverändert.'
      : (f.motiv === 'modell_ohne_gesicht' ? 'Modell (ohne Gesicht), Einverständnis bestätigt' : 'Übungskopf') +
        (hat ? ' · mit Markierungen der Meisterin' : '') +
        (GROSS.fotos.length > 1 ? ' · ' + (GROSS.i + 1) + ' von ' + GROSS.fotos.length : '');
    el.querySelector('[data-leiste="normal"]').hidden = !!GROSS.modus;
    el.querySelector('[data-leiste="zeichnen"]').hidden = !GROSS.modus;
    el.classList.toggle('pf-malen', !!GROSS.modus);
    el.querySelectorAll('[data-pfk="vor"],[data-pfk="nach"]').forEach(function (b) { b.hidden = GROSS.fotos.length < 2; });
    el.querySelector('[data-pfk="weg"]').hidden = !GROSS.loeschen;
    el.querySelector('[data-pfk="zeichnen"]').hidden = !GROSS.zeichnen;
    el.querySelector('[data-pfk="zeichnen"]').textContent = hat ? '✎ Markierungen bearbeiten' : '✎ Markieren';
    var eb = el.querySelector('[data-pfk="ebene"]');
    eb.hidden = !hat; eb.textContent = GROSS.an ? 'Markierungen aus' : 'Markierungen ein';
    el.querySelectorAll('[data-pfw]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pfw') === GROSS.werkzeug)); });
    el.hidden = false;
    neuZeichnen();
    var fokus = el.querySelector(GROSS.modus ? '[data-pfk="speichern"]' : '[data-pfk="zu"]');
    if (fokus && document.activeElement !== fokus && !el.contains(document.activeElement)) fokus.focus();
  }
  function grossZu() {
    var el = document.getElementById('pf-gross');
    var weiter = GROSS && GROSS.nachherLeise && GROSS.nachher;
    if (el) { el.hidden = true; el.querySelector('img').removeAttribute('src'); el.classList.remove('pf-malen'); }
    GROSS = null;
    if (weiter) weiter();   // nach dem Speichern von Markierungen: Liste neu laden
  }

  // Füllt alle Platzhalter <div class="pf-reihe" data-pf-eintrag="…"> in box.
  // o.loeschen: Taste „Foto löschen“ in der Großansicht (RLS entscheidet trotzdem)
  // o.nachher:  wird nach dem Löschen aufgerufen (z. B. Liste neu laden)
  async function fuellen(box, sb, o) {
    o = o || {};
    if (!box || !sb) return;
    var plaetze = box.querySelectorAll('[data-pf-eintrag]');
    if (!plaetze.length) return;
    if (!(await verfuegbar(sb))) return;
    stil();
    var ids = [];
    plaetze.forEach(function (p) { var id = p.getAttribute('data-pf-eintrag'); if (id && ids.indexOf(id) < 0) ids.push(id); });
    var r;
    var holen = function (sp) { return sb.from('praxis_fotos').select(sp).in('eintrag_id', ids).order('erstellt_am'); };
    try {
      r = await holen('id,eintrag_id,pfad,motiv,erstellt_am,zeichnung');
      // Ohne 20261116_praxis_fotos_zeichnung.sql gibt es die Spalte noch nicht
      if (r.error && /zeichnung/.test(r.error.message || '')) r = await holen('id,eintrag_id,pfad,motiv,erstellt_am');
    }
    catch (e) { return; }
    if (r.error || !r.data || !r.data.length) return;
    var s;
    try { s = await sb.storage.from(BUCKET).createSignedUrls(r.data.map(function (f) { return f.pfad; }), 3600); }
    catch (e) { return; }
    if (s.error) return;
    var url = {};
    (s.data || []).forEach(function (x) { if (x && x.signedUrl && !x.error) url[x.path] = x.signedUrl; });
    var proEintrag = {};
    r.data.forEach(function (f) {
      if (!url[f.pfad]) return;
      f.url = url[f.pfad];
      (proEintrag[f.eintrag_id] = proEintrag[f.eintrag_id] || []).push(f);
    });
    plaetze.forEach(function (p) {
      var fotos = proEintrag[p.getAttribute('data-pf-eintrag')] || [];
      p.innerHTML = '';
      p.classList.add('pf-reihe');
      fotos.forEach(function (f, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'pf-bild';
        var markiert = !!(f.zeichnung && f.zeichnung.s && f.zeichnung.s.length);
        b.setAttribute('aria-label', 'Foto ' + (i + 1) + (markiert ? ' mit Markierungen' : '') + ' groß ansehen');
        if (markiert) b.classList.add('pf-markiert');
        var img = document.createElement('img');
        img.src = f.url; img.alt = ''; img.loading = 'lazy';
        b.appendChild(img);
        b.addEventListener('click', function (ev) {
          ev.stopPropagation();
          GROSS = {fotos: fotos, i: i, sb: sb, loeschen: !!o.loeschen, zeichnen: !!o.zeichnen, nachher: o.nachher, an: true, modus: false, werkzeug: 'p', striche: [], neu: null};
          grossZeigen();
        });
        p.appendChild(b);
      });
    });
    return proEintrag;
  }

  // ── Vorher-Nachher ────────────────────────────────────────────────
  // Alle Fotos eines Lehrlings, nach Bereich (aus praxis_eintraege) gruppiert,
  // zeitlich sortiert. Vorher = ältestes, Nachher = neuestes Foto; beide lassen
  // sich frei wählen. Lesen nur über die bestehenden Regeln (Lehrling: eigene,
  // Meisterin: alle).
  async function anzahl(sb, lehrlingId) {
    if (!(await verfuegbar(sb))) return 0;
    try {
      var r = await sb.from('praxis_fotos').select('id', {count: 'exact', head: true}).eq('lehrling_id', lehrlingId);
      return r.error ? 0 : (r.count || 0);
    } catch (e) { return 0; }
  }
  function datumText(tag) {
    var d = new Date(tag + 'T12:00:00');
    return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear();
  }
  function monateZwischen(a, b) {
    var x = new Date(a + 'T12:00:00'), y = new Date(b + 'T12:00:00');
    return Math.max(0, Math.round((y - x) / (30.44 * 864e5)));
  }
  var VG = null; // {gruppen, bereich, vorher, nachher, seite}
  function vgBauen() {
    var el = document.getElementById('pf-vergleich');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'pf-vergleich'; el.className = 'pf-gross'; el.hidden = true;
    el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Vorher – Nachher');
    el.innerHTML = '<div class="pf-box"><div class="pf-vg-titel"></div><div class="pf-k" data-vg="bereiche"></div>' +
      '<div class="pf-vg-paar"></div><div class="pf-info"></div><div class="pf-vg-reihe"></div>' +
      '<div class="pf-k"><button type="button" data-vgk="zu">Schließen</button></div></div>';
    el.addEventListener('click', function (ev) {
      var t = ev.target.closest ? ev.target.closest('button') : null;
      if (ev.target === el || (t && t.getAttribute('data-vgk') === 'zu')) { el.hidden = true; VG = null; return; }
      if (!t || !VG) return;
      if (t.hasAttribute('data-vgb')) { vgBereich(t.getAttribute('data-vgb')); return; }
      if (t.hasAttribute('data-vgs')) { VG.seite = t.getAttribute('data-vgs'); vgZeigen(); return; }
      if (t.hasAttribute('data-vgi')) {
        VG[VG.seite] = Number(t.getAttribute('data-vgi'));
        // Reihenfolge halten: Vorher ist immer das ältere Foto
        if (VG.vorher > VG.nachher) { var h = VG.vorher; VG.vorher = VG.nachher; VG.nachher = h; }
        vgZeigen();
      }
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !el.hidden) { el.hidden = true; VG = null; } });
    document.body.appendChild(el);
    return el;
  }
  function vgBereich(name) {
    VG.bereich = name;
    var n = VG.gruppen[name].length;
    VG.vorher = 0; VG.nachher = n - 1; VG.seite = 'nachher';
    vgZeigen();
  }
  function vgZeigen() {
    var el = vgBauen(), liste = VG.gruppen[VG.bereich] || [];
    el.querySelector('[data-vg="bereiche"]').innerHTML = Object.keys(VG.gruppen).map(function (b) {
      return '<button type="button" data-vgb="' + escAttr(b) + '" aria-pressed="' + (b === VG.bereich) + '">' + escAttr(b) + ' (' + VG.gruppen[b].length + ')</button>';
    }).join('');
    var paar = el.querySelector('.pf-vg-paar'), info = el.querySelector('.pf-info');
    if (liste.length < 2) {
      paar.innerHTML = liste.length ? '<button type="button" class="pf-vg-seite" disabled><small>Foto</small><img alt="" src="' + escAttr(liste[0].url) + '"><span>' + datumText(liste[0].datum) + '</span></button>' : '';
      info.textContent = 'Für einen Vergleich braucht es mindestens zwei Fotos in diesem Bereich.';
    } else {
      var a = liste[VG.vorher], b = liste[VG.nachher], m = monateZwischen(a.datum, b.datum);
      paar.innerHTML = [['vorher', 'Vorher', a], ['nachher', 'Nachher', b]].map(function (x) {
        return '<button type="button" class="pf-vg-seite" data-vgs="' + x[0] + '" aria-pressed="' + (VG.seite === x[0]) + '"><small>' + x[1] + '</small>' +
          '<img alt="' + x[1] + ': Foto vom ' + datumText(x[2].datum) + '" src="' + escAttr(x[2].url) + '"><span>' + datumText(x[2].datum) + '</span></button>';
      }).join('');
      info.textContent = (a.datum === b.datum ? 'Am selben Tag' : m < 1 ? 'Weniger als ein Monat dazwischen' : 'Nach ' + m + (m === 1 ? ' Monat' : ' Monaten')) +
        ' · Tippe oben auf Vorher oder Nachher, dann unten auf ein Foto.';
    }
    el.querySelector('.pf-vg-reihe').innerHTML = liste.length < 2 ? '' : liste.map(function (f, i) {
      return '<button type="button" class="pf-bild" data-vgi="' + i + '" aria-pressed="' + (i === VG.vorher || i === VG.nachher) + '" aria-label="Foto vom ' + datumText(f.datum) + '"><img alt="" src="' + escAttr(f.url) + '"></button>';
    }).join('');
    el.hidden = false;
  }
  function escAttr(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }

  async function vergleich(sb, lehrlingId, o) {
    o = o || {};
    stil();
    var el = vgBauen();
    el.querySelector('.pf-vg-titel').textContent = '📷 Vorher – Nachher' + (o.titel ? ' · ' + o.titel : '');
    el.querySelector('[data-vg="bereiche"]').innerHTML = '';
    el.querySelector('.pf-vg-paar').innerHTML = '';
    el.querySelector('.pf-vg-reihe').innerHTML = '';
    el.querySelector('.pf-info').textContent = 'Wird geladen …';
    el.hidden = false;
    var fehler = function (t) { el.querySelector('.pf-info').textContent = t; };
    try {
      var r = await sb.from('praxis_fotos').select('id,eintrag_id,pfad,erstellt_am').eq('lehrling_id', lehrlingId);
      if (r.error) throw r.error;
      var fotos = r.data || [];
      if (!fotos.length) { fehler('Noch keine Fotos im Praxis-Tagebuch.'); return; }
      var ids = fotos.map(function (f) { return f.eintrag_id; }).filter(function (x, i, a) { return a.indexOf(x) === i; });
      var e = await sb.from('praxis_eintraege').select('id,datum,bereich').in('id', ids);
      if (e.error) throw e.error;
      var ein = {}; (e.data || []).forEach(function (x) { ein[x.id] = x; });
      var s = await sb.storage.from(BUCKET).createSignedUrls(fotos.map(function (f) { return f.pfad; }), 3600);
      if (s.error) throw s.error;
      var url = {}; (s.data || []).forEach(function (x) { if (x && x.signedUrl && !x.error) url[x.path] = x.signedUrl; });
      var gruppen = {};
      fotos.forEach(function (f) {
        var x = ein[f.eintrag_id]; if (!x || !url[f.pfad]) return;
        (gruppen[x.bereich] = gruppen[x.bereich] || []).push({url: url[f.pfad], datum: x.datum, t: f.erstellt_am});
      });
      Object.keys(gruppen).forEach(function (b) { gruppen[b].sort(function (a, c) { return (a.datum + a.t) < (c.datum + c.t) ? -1 : 1; }); });
      var namen = Object.keys(gruppen);
      if (!namen.length) { fehler('Noch keine Fotos im Praxis-Tagebuch.'); return; }
      // Start: der Bereich mit den meisten Fotos
      namen.sort(function (a, c) { return gruppen[c].length - gruppen[a].length; });
      var sortiert = {}; namen.forEach(function (n) { sortiert[n] = gruppen[n]; });
      VG = {gruppen: sortiert};
      vgBereich(namen[0]);
    } catch (err) {
      fehler('Die Fotos konnten nicht geladen werden' + (navigator.onLine === false ? ' – keine Internetverbindung.' : '.'));
    }
  }

  window.PraxisFotos = {
    vergleich: vergleich, anzahl: anzahl,
    MAX: MAX, verfuegbar: verfuegbar, fuellen: fuellen, hochladen: hochladen, loeschen: loeschen,
    eintragLeeren: eintragLeeren, lehrlingLeeren: lehrlingLeeren, stil: stil
  };
})();
