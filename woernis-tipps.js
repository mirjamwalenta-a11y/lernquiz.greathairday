// Wörnis Tipps und Sprüche – Sammlung für „Wörnis Welt“
// (Plan: docs/woernis-welt-plan.md, Abschnitt „Wörnis Tipps“).
// Angezeigt als
//   - „Wörni sagt“: Spruch des Tages auf der Startseite (art: 'spruch')
//   - „Wörnis Tipp“: höchstens ein Tipp pro Lern-Modul (art: 'tipp', modul)
// Felder: id (fest, nie ändern), art, modul ('' = überall passend),
//         titel (kurz), text, bild (optional, siehe WOERNI_BILDER unten).
// Neue Einträge einfach unten anhängen. Keine Namen von Personen eintragen
// (CLAUDE.md, Regel 2). Keine Daten, kein Login, nichts von fremden Servern.
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

(function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Zeichnungen zu einzelnen Tipps (inline SVG, keine Bilddateien)
  var WOERNI_BILDER = {
    // Ein M, viermal gedreht: so sieht es jemand von einer anderen Seite
    'perspektive-m': function () {
      var felder = [[0, 'M', 'du'], [-90, 'E', 'links'], [180, 'W', 'Kundin'], [90, '3', 'rechts']];
      return '<div class="woerni-bild" role="img" aria-label="Ein M aus vier Blickrichtungen: du siehst ein M, von links ein E, die Kundin gegenüber ein W, von rechts eine 3">' + felder.map(function (f) {
        return '<figure><svg viewBox="0 0 60 60" aria-hidden="true"><g transform="rotate(' + f[0] + ' 30 30)">' +
          '<path d="M14 46V14l16 20 16-20v32" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g></svg>' +
          '<figcaption><b>' + f[1] + '</b>' + f[2] + '</figcaption></figure>';
      }).join('') + '</div>';
    }
  };

  var CSS =
    '.woerni{display:flex;gap:12px;align-items:flex-start;background:#F3EBD9;border:1px solid #E4DBC5;border-left:4px solid #896C32;border-radius:12px;padding:12px 14px;margin:0 0 16px;color:#211D17;font-family:Poppins,system-ui,sans-serif}' +
    '.woerni-ich{flex:none;width:38px;height:38px;border-radius:50%;background:#896C32;color:#fff;display:grid;place-items:center;font:700 17px/1 Poppins,system-ui,sans-serif}' +
    '.woerni-txt{min-width:0}' +
    '.woerni-wer{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#896C32;margin:0 0 2px}' +
    '.woerni-titel{font-size:15px;font-weight:600;margin:0 0 4px;line-height:1.3}' +
    '.woerni-text{font-size:13.5px;line-height:1.55;margin:0;color:#3A342A}' +
    '.woerni-bild{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin:10px 0 2px;color:#896C32}' +
    '.woerni-bild figure{margin:0;background:#fff;border-radius:8px;padding:6px 4px 6px;text-align:center}' +
    '.woerni-bild svg{width:100%;max-width:56px;height:auto;display:block;margin:0 auto}' +
    '.woerni-bild figcaption{font-size:11px;line-height:1.25;color:#6B6455}' +
    '.woerni-bild figcaption b{display:block;font-size:13px;color:#211D17}';
  function cssEinmal() {
    if (document.getElementById('woerni-css')) return;
    var st = document.createElement('style'); st.id = 'woerni-css'; st.textContent = CSS; document.head.appendChild(st);
  }

  function karte(t, wer) {
    cssEinmal();
    var bild = t.bild && WOERNI_BILDER[t.bild] ? WOERNI_BILDER[t.bild]() : '';
    return '<aside class="woerni" aria-label="' + esc(wer) + '"><div class="woerni-ich" aria-hidden="true">W</div><div class="woerni-txt">' +
      '<p class="woerni-wer">' + esc(wer) + '</p><p class="woerni-titel">' + esc(t.titel) + '</p><p class="woerni-text">' + esc(t.text) + '</p>' + bild + '</div></aside>';
  }

  // Spruch des Tages: wechselt jeden Tag, für alle gleich
  window.woerniSagtHTML = function () {
    var s = window.WOERNIS_TIPPS.filter(function (t) { return t.art === 'spruch'; });
    if (!s.length) return '';
    var tag = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
    return karte(s[tag % s.length], 'Wörni sagt');
  };
  // Tipp zu einem Lern-Modul (der erste passende)
  window.woerniTippHTML = function (modul) {
    var t = window.WOERNIS_TIPPS.filter(function (x) { return x.art === 'tipp' && x.modul === modul; })[0];
    return t ? karte(t, 'Wörnis Tipp') : '';
  };
})();
