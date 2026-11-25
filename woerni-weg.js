// Wörni führt durch die App (Schritt 3 der Neuordnung, 2026-11-21):
//   - bereichHTML(seite, info): ein Satz oben auf jeder Bereichsseite
//     (Üben, Praxis, Prüfung, Mein Weg, Nachschlagen): womit fängst du an?
//   - nachTagebuchHTML(bereich, lj): nach einem Eintrag im Praxis-Tagebuch
//     schlägt Wörni das nächste Praxis-Modul vor
//   - nachQuizHTML(erg): am Ende eines Quiz der nächste Schritt
// Regelbasiert, ohne KI, keine Daten, nichts gespeichert, kein Login nötig.
// Aussehen: dieselbe Wörni-Zeile wie in woerni-begleiter.js / woerni-impulse.js.
// Knöpfe tragen data-ww="<ziel>"; die Seite bindet sie mit binden(el, ziele)
// an ihre eigenen Funktionen (oder nutzt die href-Links).
(function () {
  var CSS =
    '.woerni-zeile{display:flex;gap:10px;align-items:flex-start;margin-top:10px;padding-top:9px;border-top:1px solid rgba(0,0,0,.08);font:13px/1.5 Poppins,system-ui,sans-serif;color:#4A443A;text-align:left}' +
    '.woerni-zeile .wz-ich{flex:none;width:22px;height:22px;border-radius:50%;background:#896C32;color:#fff;display:grid;place-items:center;font:700 11px/1 Poppins,system-ui,sans-serif;margin-top:1px}' +
    // Wörni mit Gesicht (bilder/woerni/, docs/woerni-gesicht.md): Brustbild im goldenen Rahmen.
    // Folgt direkt eine zweite Wörni-Zeile, bleibt dort nur der Einzug, das Bild nicht.
    '.woerni-zeile .wz-ich.wz-bild{width:80px;height:80px;border-radius:12px;border:2px solid #896C32;background:#F3EBD9 center/cover no-repeat;margin-top:0}' +
    '.woerni-zeile+.woerni-zeile .wz-ich.wz-bild{visibility:hidden;height:0;border:0}' +
    '.woerni-zeile .wz-wer{font-weight:600;color:#896C32;margin-right:4px}' +
    '.woerni-zeile.frei{border-top:0;padding-top:0;margin:0 0 12px}';
  // Wörnis Bilder liegen neben diesem Skript (auch wenn es von einer anderen Seite geladen wird)
  var WB = ((document.currentScript && document.currentScript.src) || '').replace(/[^\/?#]*([?#].*)?$/, '') + 'bilder/woerni/';
  function wBild(st) { return '<span class="wz-ich wz-bild" aria-hidden="true" style="background-image:url(\'' + WB + st + '.jpg\')"></span>'; }
  function cssEinmal() {
    if (document.getElementById('woerni-begleiter-css') || document.getElementById('woerni-v1-css') || document.getElementById('woerni-sortieren-css')) return;
    var st = document.createElement('style'); st.id = 'woerni-begleiter-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  // Link im selben Stil wie die vorhandenen Textlinks („Im Farblabor selbst mischen →“)
  function los(ziel, text, href) {
    return ' <a href="' + esc(href || '#') + '" data-ww="' + esc(ziel) + '" style="color:#896C32;font-weight:600;text-decoration:none;white-space:nowrap">' + esc(text || 'Los →') + '</a>';
  }
  function zeile(innen, st) {
    cssEinmal();
    return '<div class="woerni-zeile frei">' + wBild(st || 'motivierend') + '<span><span class="wz-wer">Wörni:</span>' + innen + '</span></div>';
  }

  // Praxis-Module, die Wörni vorschlagen kann
  var MODUL = {
    wasch:            'Haarwäsche & Kopfmassage',
    farbe:            'Farbtechniken',
    werkzeug:         'Werkzeugkunde',
    schnittwerkstatt: 'Schnittwerkstatt',
    straehnen:        'Strähnentechniken & Balayage',
    umformung:        'Umformung: Dauerwelle & Glättung',
    colorist:         'Colorist: Farbe verstehen',
    makeup:           'Make-up-Labor',
    pflege:           'Gesichtsmassage & Schönheitspflege',
    hoch:             'Hochstecken nach Gesichtsform'
  };
  // Reihenfolge je Lehrjahr (passt zu den Lehrjahr-Hinweisen auf der Praxis-Seite)
  var WEG = {
    '1': ['wasch', 'farbe', 'werkzeug', 'schnittwerkstatt'],
    '2': ['straehnen', 'umformung', 'colorist', 'makeup', 'pflege'],
    '3': ['hoch', 'umformung', 'colorist', 'schnittwerkstatt']
  };
  // Bereiche des Praxis-Tagebuchs (PT_BEREICHE in lerntool.html) → Modul
  var TAGEBUCH = {
    'Haarwäsche & Kopfmassage': 'wasch', 'Farbe': 'farbe', 'Strähnen & Balayage': 'straehnen',
    'Hochstecken': 'hoch', 'Damenschnitt': 'schnittwerkstatt', 'Herrenschnitt': 'schnittwerkstatt',
    'Dauerwelle & Umformung': 'umformung', 'Make-up': 'makeup', 'Nagelpflege': 'pflege', 'Rasur & Bart': 'pflege'
  };
  function weg(lj) { return WEG[String(lj)] || WEG['1']; }

  window.WOERNI_WEG = {
    modul: MODUL, weg: WEG,

    // info: { lj, probezeit (true/false), wiederholen (Anzahl fälliger Fragen) }
    bereichHTML: function (seite, info) {
      info = info || {};
      var lj = String(info.lj || '1'), n;
      switch (seite) {
        case 'b-ueben':
          n = info.wiederholen || 0;
          if (n) return zeile('Fang mit <b>Wiederholen</b> an: ' + n + (n === 1 ? ' Frage ist' : ' Fragen sind') + ' heute fällig. Danach ein Schnell-Check im Quiz.' + los('wiederholen'));
          return zeile('Fang mit dem <b>Quiz</b> an, der Schnell-Check dauert nur ein paar Minuten. Wackelt ein Thema, übst du es danach im Themen-Quiz.' + los('quiz'));
        case 'praxis':
          var w = weg(lj);
          return zeile('Im ' + lj + '. Lehrjahr fängst du am besten mit <b>' + esc(MODUL[w[0]]) + '</b> an, danach ' +
            esc(MODUL[w[1]]) + ' und ' + esc(MODUL[w[2]]) + '. Nach dem Üben trägst du es im Tagebuch ein.' + los(w[0]));
        case 'b-pruefung':
          if (lj === '3') return zeile('Im 3. Lehrjahr zählt die <b>LAP-Vorbereitung</b>. Ein paar Prüfungsfragen jeden Tag bringen mehr als alles am Ende.' + los('lap'));
          return zeile('Im ' + lj + '. Lehrjahr ist die <b>Zwischenprüfung</b> dein Ziel. Schau dir zuerst an, wie bewertet wird, dann übst du Teil für Teil.' + los('zwischenpruefung'));
        case 'b-meinweg':
          if (info.probezeit) return zeile('Du bist in der Probezeit. Lies zuerst die <b>Verhaltensregeln</b>, dann die Seite zur Probezeit.' + los('regeln'));
          return zeile('Schau einmal pro Woche in deinen <b>Fortschritt</b>. Was noch offen ist, kommt in deinen Lernplan.' + los('progress'));
        case 'b-nachschlagen':
          return zeile('Kennst du ein Wort nicht? Schau bei den <b>Fachbegriffen</b>. Weißt du nicht, wo etwas steht? Das A–Z-Verzeichnis findet es.' + los('fachbegriffe'));
      }
      return '';
    },

    // Nach einem Eintrag im Praxis-Tagebuch: das nächste Modul im Weg des Lehrjahrs
    nachTagebuchHTML: function (bereich, lj) {
      var w = weg(lj), k = TAGEBUCH[bereich], i = w.indexOf(k);
      var naechstes = w[i < 0 ? 0 : (i + 1) % w.length];
      return zeile('Eingetragen ✓ Stark, dass du dranbleibst. Als Nächstes passt <b>' + esc(MODUL[naechstes]) + '</b>.' + los(naechstes), 'lobend');
    },

    // Am Ende eines Quiz. erg: { richtig, gesamt, schwach: [Themen], basis: URL des Lern-Tools }
    nachQuizHTML: function (erg) {
      erg = erg || {};
      var basis = erg.basis || 'lerntool.html';
      if (erg.schwach && erg.schwach.length) {
        return zeile('Nächster Schritt: <b>' + esc(erg.schwach[0]) + '</b> noch einmal üben. Im Themen-Quiz geht das gezielt.' + los('quiz', 'Zum Themen-Quiz →', basis + '#seite=quiz'));
      }
      return zeile('Alles richtig, super! Nächster Schritt: das Gelernte am Gast üben, in der <b>Praxis</b>.' + los('praxis', 'Zur Praxis →', basis + '#praxis'), 'lobend');
    },

    // Freie Wörni-Zeile (z. B. im Probezeit-Plan); innen ist bereits sicheres HTML
    zeile: zeile,

    // Knöpfe mit data-ww an Funktionen der Seite binden. Ohne passende Funktion bleibt der Link (href).
    binden: function (el, ziele) {
      if (!el || !ziele) return;
      Array.prototype.forEach.call(el.querySelectorAll('[data-ww]'), function (a) {
        var f = ziele[a.getAttribute('data-ww')];
        if (f) a.addEventListener('click', function (e) { e.preventDefault(); f(); });
      });
    }
  };
})();
