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
  { id: 'perspektive-m', art: 'spruch', modul: '',
    titel: 'M, W, E oder 3?',
    text: 'Mal ein großes M auf ein Blatt. Du siehst ein M, wer dir gegenübersitzt, sieht ein W, von der Seite ist es ein E oder eine 3. Alle haben recht, je nachdem, wo sie stehen. Bei einem Konflikt im Team oder mit einer Kundin hilft es, sich zuerst auf den Platz des anderen zu stellen: Wie sieht es von dort aus?',
    bild: 'perspektive-m' },

  // ── Sprüche (freigegeben 2026-11-14) ──
  { id: 'fehler-erlaubt', art: 'spruch', modul: '',
    titel: 'Fehler erlaubt, Fehlerhäufigkeit verboten!',
    text: 'Jede darf einen Fehler machen, so lernt man. Aber denselben Fehler immer wieder zu machen, ist nicht erlaubt. Schau dir an, was schiefgegangen ist, damit es beim nächsten Mal klappt.' },
  { id: 'schritt', art: 'spruch', modul: '',
    titel: 'Schritt für Schritt',
    text: 'Man darf auch einmal einen Schritt zurück machen, wenn man danach zwei nach vorne macht. Nicht jeder Tag ist ein guter Lerntag. Wichtig ist, dass es insgesamt weitergeht.' },
  { id: 'hundert', art: 'spruch', modul: '',
    titel: 'Was du 100-mal wiederholst, sitzt',
    text: 'Ein Handgriff wird nicht beim Verstehen sicher, sondern beim Wiederholen. Üb ihn so lange, bis die Hände es von allein können.' },
  { id: 'spiegel', art: 'spruch', modul: '',
    titel: 'Der Spiegel lügt nicht',
    text: 'Schau nach jedem Schritt in den Spiegel, nicht nur am Ende. Was du von vorne siehst, sieht die Kundin auch. Was hinten passiert, sieht sie zu Hause.' },
  { id: 'zuhoeren', art: 'spruch', modul: '',
    titel: 'Zuerst zuhören, dann schneiden',
    text: 'Die meisten Fehler passieren schon vor dem ersten Schnitt. Frag nach, bis du wirklich weißt, was die Kundin meint. „Ein bisschen kürzer“ heißt für jede etwas anderes.' },
  { id: 'platz', art: 'spruch', modul: '',
    titel: 'Sauberer Platz, klarer Kopf',
    text: 'Räum zwischendurch auf, nicht erst am Abend. Wer Ordnung am Platz hat, hat auch Ordnung in der Arbeit.' },
  { id: 'fragen', art: 'spruch', modul: '',
    titel: 'Lieber zweimal fragen als einmal falsch',
    text: 'Wenn du unsicher bist, frag. Niemand im Salon ist böse über eine Frage. Ärgerlich ist nur ein Fehler, den man mit einer Frage hätte vermeiden können.' },
  { id: 'jede-kundin', art: 'spruch', modul: '',
    titel: 'Jede Kundin ist die wichtigste',
    text: 'Die letzte Kundin am Abend verdient dieselbe Aufmerksamkeit wie die erste am Morgen. Sie weiß nicht, wie dein Tag war.' },
  { id: 'vertrauen', art: 'spruch', modul: '',
    titel: 'Haare wachsen nach, Vertrauen nicht so schnell',
    text: 'Ein Schnitt, der nicht passt, wächst raus. Eine Kundin, die sich nicht ernst genommen fühlt, kommt nicht wieder.' },
  { id: 'helfen', art: 'spruch', modul: '',
    titel: 'Wer fertig ist, schaut, wo er helfen kann',
    text: 'Im Salon arbeitet keiner allein. Wenn du gerade Luft hast, frag die Kollegin, ob sie etwas braucht.' },
  { id: 'kamm', art: 'spruch', modul: '',
    titel: 'Der Kamm zeigt dir die Wahrheit',
    text: 'Kämm nach dem Schnitt noch einmal gegen die Richtung durch. Was dann absteht oder ungleich fällt, musst du noch ausbessern.' },

  // ── Tipps zu einem Lern-Modul (höchstens einer pro Modul) ──
  { id: 't-beratung', art: 'tipp', modul: 'beratung',
    titel: 'Die Kundin zeigen lassen',
    text: 'Lass dir zeigen statt sagen: ein Foto, die Länge mit den Fingern, die Stelle, die stört. Bilder sind genauer als Worte.' },
  { id: 't-umformung', art: 'tipp', modul: 'umformung',
    titel: 'Probewickler zuerst',
    text: 'Mach immer einen Probewickler und schau ihn dir in Ruhe an. Bei der Dauerwelle kann man nichts zurückdrehen.' },
  { id: 't-farbe', art: 'tipp', modul: 'farbe',
    titel: 'Erst den Ansatz anschauen',
    text: 'Bevor du mischst, schau dir Ansatz, Längen und Spitzen getrennt an. Die Haare sind fast nie überall gleich.' },
  { id: 't-schneiden', art: 'tipp', modul: 'schneiden',
    titel: 'Abteilungen sind die halbe Arbeit',
    text: 'Sauber abgeteilt ist halb geschnitten. Nimm dir für die Abteilungen Zeit, dann geht der Rest fast von selbst.' },
  { id: 't-waschen', art: 'tipp', modul: 'waschen',
    titel: 'Die Haarwäsche ist der erste Eindruck',
    text: 'Die Kundin merkt beim Waschen, wie sorgfältig du bist. Wassertemperatur fragen, Nacken stützen, nicht hetzen.' },
  { id: 't-hoch', art: 'tipp', modul: 'hoch',
    titel: 'Das Fundament muss halten',
    text: 'Eine Hochsteckfrisur hält nur so gut wie ihre Basis. Lieber am Anfang eine Nadel mehr als am Abend eine Kundin mit offener Frisur.' },
  { id: 't-pruefung', art: 'tipp', modul: 'pruefung',
    titel: 'Ruhig erklären, was du tust',
    text: 'Bei der Prüfung zählt nicht nur das Ergebnis. Sag in einfachen Worten, warum du es so machst. Das zeigt, dass du es verstanden hast.' }
];

(function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Zeichnungen zu einzelnen Tipps (inline SVG, keine Bilddateien)
  var WOERNI_BILDER = {
    // Ein M, viermal gedreht: so sieht es jemand von einer anderen Seite
    'perspektive-m': function () {
      var felder = [[0, 'M', 'du'], [-90, 'E', 'links'], [180, 'W', 'gegen\u00ADüber'], [90, '3', 'rechts']];
      return '<div class="woerni-bild" role="img" aria-label="Ein M aus vier Blickrichtungen: du siehst ein M, von links ein E, wer gegenübersitzt ein W, von rechts eine 3">' + felder.map(function (f) {
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
    '.woerni-bild figure{margin:0;background:#fff;border-radius:8px;padding:6px 2px;text-align:center}' +
    '.woerni-bild svg{width:100%;max-width:56px;height:auto;display:block;margin:0 auto}' +
    '.woerni-bild figcaption{font-size:10.5px;hyphens:manual;line-height:1.25;color:#6B6455}' +
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
