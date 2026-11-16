// Vorlesen: eine 🔊-Taste an Fragen, Antworten und Erklärungen.
// Hilft Lehrlingen mit Deutsch als Zweitsprache, Leseschwäche oder
// müden Augen. Nutzt die Sprachausgabe des Geräts (Web Speech API):
// kein Server, keine Daten, kein Login, funktioniert auch offline,
// sofern das Gerät eine deutsche Stimme hat.
//
// Einbinden (am Ende der Seite):
//   <script src="vorlesen.js?v=…" data-ziele="#q-txt | #q-antwort .opt ; #q-feedback" defer></script>
//
//   data-ziele   Liste, getrennt durch „;“. Jeder Eintrag: „Anker | Extra“.
//                Anker  = CSS-Selektor; dort kommt die Taste hin, sein Text
//                         wird vorgelesen.
//                Extra  = optionaler CSS-Selektor, dessen Texte danach
//                         gelesen werden (z. B. die Antwortmöglichkeiten).
//                         Mit „~“ davor: nur die folgenden Geschwister des
//                         Ankers (z. B. „section > header h2 | ~ p“ liest die
//                         Überschrift und den Einleitungstext darunter).
// Ist der Anker ein Flex- oder Grid-Container, sitzt die Taste oben rechts
// darüber (position:absolute), damit sich das Layout nicht verschiebt.
//
// Die Seiten bauen Fragen oft per innerHTML neu: ein MutationObserver hängt
// die Taste dann wieder an. Wechselt der Text (neue Frage), hört das Lesen auf.
(function () {
  var skript = document.currentScript;
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  var synth = window.speechSynthesis;

  var ziele = ((skript && skript.getAttribute('data-ziele')) || '')
    .split(';')
    .map(function (e) {
      var t = e.split('|');
      return {anker: (t[0] || '').trim(), extra: (t[1] || '').trim()};
    })
    .filter(function (z) { return z.anker; });
  if (!ziele.length) return;

  var css =
    '.vl-btn{float:right;margin:-4px -4px 4px 8px;width:36px;height:36px;border-radius:50%;' +
      'border:1.5px solid #E4DBC5;background:#fff;color:#896C32;font-size:16px;line-height:1;' +
      'display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;font-family:inherit}' +
    '.vl-btn:hover{border-color:#896C32}' +
    '.vl-btn:focus-visible{outline:2px solid #896C32;outline-offset:2px}' +
    '.vl-btn[aria-pressed="true"]{background:#896C32;border-color:#896C32;color:#fff}' +
    '@media print{.vl-btn{display:none}}';

  // ── Stimme: am liebsten österreichisch, sonst deutsch ──────────────
  var stimme = null;
  function stimmeWaehlen() {
    var alle = synth.getVoices() || [];
    function finde(f) { for (var i = 0; i < alle.length; i++) if (f(alle[i])) return alle[i]; return null; }
    stimme = finde(function (v) { return /^de[-_]AT/i.test(v.lang); }) ||
             finde(function (v) { return /^de[-_]DE/i.test(v.lang) && v.localService; }) ||
             finde(function (v) { return /^de[-_]DE/i.test(v.lang); }) ||
             finde(function (v) { return /^de/i.test(v.lang); });
  }
  stimmeWaehlen();
  if (synth.addEventListener) synth.addEventListener('voiceschanged', stimmeWaehlen);

  // ── Text aufbereiten ───────────────────────────────────────────────
  var ABK = [
    [/\bz\.\s?B\./g, 'zum Beispiel'], [/\bd\.\s?h\./g, 'das heißt'], [/\bu\.\s?a\./g, 'unter anderem'],
    [/\bbzw\./g, 'beziehungsweise'], [/\binkl\./g, 'inklusive'], [/\bca\./g, 'circa'],
    [/\busw\./g, 'und so weiter'], [/\bggf\./g, 'gegebenenfalls'], [/\bevtl\./g, 'eventuell'],
    [/\bmind\./g, 'mindestens'], [/\bmax\./g, 'maximal'], [/\bMin\.(?=\s|$)/g, 'Minuten'],
    [/\bNr\./g, 'Nummer'], [/\bvs\./g, 'gegen']
  ];
  var ZEICHEN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}️‍]/gu;

  function sauber(t) {
    t = String(t || '').replace(ZEICHEN, ' ');
    ABK.forEach(function (a) { t = t.replace(a[0], a[1]); });
    return t.replace(/\s+/g, ' ').trim();
  }
  function textVon(el) {
    var k = el.cloneNode(true);
    k.querySelectorAll('.vl-btn, button, svg, script, style, [aria-hidden="true"]').forEach(function (x) { x.remove(); });
    // Überschriften und Absätze nicht zusammenkleben („Worum es gehtManche …“)
    k.querySelectorAll('h1, h2, h3, h4, h5, h6, b, strong').forEach(function (h) {
      if (/^H\d$/.test(h.tagName) && !/[.!?:]\s*$/.test(h.textContent)) h.appendChild(document.createTextNode('.'));
    });
    k.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, dt, dd, td, th, div, br, section, article').forEach(function (x) {
      x.appendChild(document.createTextNode(' '));
    });
    return sauber(k.textContent);
  }
  function satzEnde(t) { return /[.!?:]$/.test(t) ? t : t + '.'; }

  function ankerText(el) { return textVon(el); }
  function lesetext(el, z) {
    var teile = [satzEnde(ankerText(el))];
    if (z.extra && z.extra.charAt(0) === '~') {
      var sel = z.extra.slice(1).trim(), n = el.nextElementSibling;
      for (; n; n = n.nextElementSibling) if (n.matches(sel)) { var tt = textVon(n); if (tt) teile.push(satzEnde(tt)); }
    } else if (z.extra) {
      document.querySelectorAll(z.extra).forEach(function (o) {
        var t = sauber(o.textContent).replace(/^([A-F])\)\s*/, '$1, ');
        if (t) teile.push(satzEnde(t));
      });
    }
    return teile.join(' ');
  }

  // ── Sprechen ──────────────────────────────────────────────────────
  // Lange Texte in Sätze teilen: manche Browser brechen sonst nach
  // ca. 15 Sekunden ab.
  var aktuell = null; // Anker-Text, der gerade gelesen wird
  function stopp() {
    aktuell = null;
    try { synth.cancel(); } catch (e) {}
    zustand();
  }
  function sprich(text, schluessel) {
    try { synth.cancel(); } catch (e) {}
    aktuell = schluessel;
    var saetze = text.replace(/([.!?:;])\s+/g, '$1\n').split('\n').filter(Boolean)
      // „6.“ am Satzende liest die Stimme als „sechste“. Jeder Satz wird
      // ohnehin einzeln gesprochen, der Punkt ist für die Pause nicht nötig.
      .map(function (s) { return s.replace(/(\d)\.\s*$/, '$1'); });
    saetze.forEach(function (s, i) {
      var u = new SpeechSynthesisUtterance(s);
      u.lang = stimme ? stimme.lang : 'de-AT';
      if (stimme) u.voice = stimme;
      u.rate = 0.95;
      if (i === saetze.length - 1) {
        u.onend = u.onerror = function () { if (aktuell === schluessel) { aktuell = null; zustand(); } };
      }
      synth.speak(u);
    });
    zustand();
  }

  // ── Tasten anhängen ───────────────────────────────────────────────
  function zustand() {
    document.querySelectorAll('.vl-btn').forEach(function (b) {
      var a = anker(b), an = aktuell !== null && a && ankerText(a) === aktuell;
      var zeichen = an ? '⏹' : '🔊';
      // Nur ändern, was sich ändert: sonst löst jede Änderung den
      // MutationObserver erneut aus (Endlosschleife).
      if (b.textContent === zeichen) return;
      b.setAttribute('aria-pressed', an ? 'true' : 'false');
      b.setAttribute('aria-label', an ? 'Vorlesen stoppen' : 'Vorlesen');
      b.title = an ? 'Stopp' : 'Vorlesen';
      b.textContent = zeichen;
    });
  }
  // Der Anker trägt data-vl-a; die Taste kann auch in einem Kind sitzen.
  function anker(b) { return b && b.closest('[data-vl-a]'); }
  function eigeneTaste(el) {
    var t = el.querySelectorAll('.vl-btn');
    for (var i = 0; i < t.length; i++) if (anker(t[i]) === el) return t[i];
    return null;
  }
  function anhaengen() {
    var gefunden = false;
    ziele.forEach(function (z, zi) {
      document.querySelectorAll(z.anker).forEach(function (el) {
        if (!ankerText(el)) return;
        // Liegt der Anker in einem anderen Anker (z. B. Hinweis-Kasten in einem
        // Abschnitt mit Taste), liest dessen Taste ihn schon mit: keine zweite.
        if (el.parentElement && el.parentElement.closest('[data-vl-a]')) return;
        if (eigeneTaste(el)) { if (aktuell !== null && ankerText(el) === aktuell) gefunden = true; return; }
        el.setAttribute('data-vl-a', '');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'vl-btn';
        b.setAttribute('data-vl', String(zi));
        var ziel = el, anz = getComputedStyle(el).display;
        if (/flex|grid/.test(anz)) {
          // In Flex/Grid bekäme die Taste eine eigene Zeile: in das erste
          // Text-Kind setzen (dort fließt der Text um sie herum) …
          ziel = null;
          for (var c = el.firstElementChild; c; c = c.nextElementSibling) {
            if (/^(block|list-item)$/.test(getComputedStyle(c).display) && textVon(c)) { ziel = c; break; }
          }
          if (!ziel) {
            // … oder, wenn es keines gibt, oben rechts darüber legen
            ziel = el;
            if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
            b.style.cssText = 'position:absolute;top:6px;right:6px;margin:0;float:none';
          }
        }
        ziel.insertBefore(b, ziel.firstChild);
        if (aktuell !== null && ankerText(el) === aktuell) gefunden = true;
      });
    });
    // Neue Frage auf dem Bildschirm: altes Vorlesen beenden
    if (aktuell !== null && !gefunden) stopp(); else zustand();
  }

  // Ein Klick-Handler für alle Tasten: überlebt innerHTML-Umbauten
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest && ev.target.closest('.vl-btn');
    if (!b) return;
    ev.preventDefault();
    ev.stopPropagation();
    var el = anker(b) || b.parentNode, z = ziele[Number(b.getAttribute('data-vl'))] || {};
    var schluessel = ankerText(el);
    if (aktuell === schluessel && synth.speaking) { stopp(); return; }
    sprich(lesetext(el, z), schluessel);
  }, true);

  window.addEventListener('pagehide', stopp);
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopp(); });

  function start() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    anhaengen();
    var geplant = false;
    new MutationObserver(function () {
      if (geplant) return;
      geplant = true;
      requestAnimationFrame(function () { geplant = false; anhaengen(); });
    }).observe(document.body, {childList: true, subtree: true, characterData: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
