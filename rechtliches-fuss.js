// Kleiner Fuß unten auf jeder Seite: Knöpfe „A–Z-Verzeichnis“ und „Feedback geben“, Links zu
// Impressum, Datenschutz und Nutzungsbedingungen (rechtliches.html). Wird am
// Ende von <body> angehängt. Liegt unten eine feste Leiste (Lern-Tool, lern-leiste.js),
// bekommt der Fuß darunter genau so viel Abstand, dass nichts verdeckt wird.
// Feedback: öffnet nur eine vorbereitete E-Mail im E-Mail-Programm des Geräts
// (an die geschäftliche Adresse aus dem Impressum). In der App wird nichts
// gespeichert oder gesendet; mitgegeben wird nur, auf welcher Seite man war.
// Offline-PIN (ghd-sitzung.js): statt des großen grünen Knopfs, der über dem
// Inhalt schwebt, hier im Fuß als kleiner Link – nur wenn er angeboten wird.
(function () {
  var FEEDBACK_AN = 'walenta@greathairday.at';
  function feedbackLink() {
    var seite = (location.pathname.split('/').pop() || 'Startseite') + (location.hash || '');
    var betreff = 'Feedback Lern-App: ' + (document.title || seite);
    var text = 'Seite: ' + seite + '\n\n' +
      'Was ist passiert oder was wünschst du dir?\n\n\n' +
      '(Ein Screenshot hilft sehr, gern einfach anhängen.)';
    return 'mailto:' + FEEDBACK_AN + '?subject=' + encodeURIComponent(betreff) + '&body=' + encodeURIComponent(text);
  }
  // Höhe einer festen Leiste ganz unten (breit, unten angedockt); 0 wenn keine
  function leisteHoehe() {
    var h = 0, alle = Array.prototype.slice.call(document.body.children).concat(Array.prototype.slice.call(document.querySelectorAll('.leiste,.ll-leiste')));
    for (var i = 0; i < alle.length; i++) {
      var e = alle[i];
      if (e.id === 'recht-fuss' || e.id === 'ghd-pin-hinweis') continue;
      var s = getComputedStyle(e);
      if (s.position !== 'fixed' || s.display === 'none') continue;
      var r = e.getBoundingClientRect();
      if (r.height && r.height < innerHeight / 3 && r.bottom >= innerHeight - 2 && r.width > innerWidth * 0.6) h = Math.max(h, r.height);
    }
    return h;
  }
  function abstandSetzen() {
    var f = document.getElementById('recht-fuss');
    // + Platz für den runden ☰-Knopf (Alle Apps), der unten links über der Leiste schwebt
    if (f) f.style.paddingBottom = (leisteHoehe() + 16 + (document.querySelector('[class*="ghdv"]') ? 64 : 0)) + 'px';
  }
  function pinLinkZeigen() {
    var l = document.getElementById('fuss-pin');
    if (l && document.getElementById('ghd-pin-hinweis') && window.ghdSitzung && ghdSitzung.offlinePinFestlegen) l.hidden = false;
  }
  function anhaengen() {
    if (document.getElementById('recht-fuss')) return;
    var st = document.createElement('style');
    st.textContent =
      '#recht-fuss{text-align:center;font:12px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:20px 16px 16px;color:#9A9188}' +
      '#recht-fuss a{color:inherit;text-decoration:none;margin:0 6px;white-space:nowrap}' +
      '#recht-fuss a:hover{color:#896C32;text-decoration:underline}' +
      '#recht-fuss .fb-zeile{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0 0 10px}' +
      '#recht-fuss a.fb{display:inline-block;margin:0;padding:6px 12px;border:1px solid #D9CDAE;border-radius:999px;background:#fff;color:#896C32;font-weight:600;font-size:12px}' +
      '#recht-fuss a.fb:hover{background:#F3EBD9;text-decoration:none}' +
      '#recht-fuss .recht-zeile{display:flex;flex-wrap:wrap;justify-content:center;gap:2px 0}' +
      '#recht-fuss a[hidden]{display:none}' +
      // großer schwebender Offline-PIN-Knopf aus ghd-sitzung.js: auf den Lern-Seiten ausblenden (Link im Fuß)
      '#ghd-pin-hinweis{display:none!important}' +
      '@media print{#recht-fuss{display:none}}';
    document.head.appendChild(st);
    var f = document.createElement('footer');
    f.id = 'recht-fuss';
    f.innerHTML =
      '<div class="fb-zeile"><a class="fb" href="verzeichnis.html">🔎 A–Z-Verzeichnis</a><a class="fb" href="#" id="fb-link">💬 Feedback geben</a></div>' +
      '<div class="recht-zeile"><a href="rechtliches.html#impressum">Impressum</a>·' +
      '<a href="rechtliches.html#datenschutz">Datenschutz</a>·' +
      '<a href="rechtliches.html#nutzungsbedingungen">Nutzungsbedingungen</a></div>' +
      '<a href="#" id="fuss-pin" hidden>📴 Offline-PIN festlegen</a>';
    document.body.appendChild(f);
    // Link erst beim Antippen bauen, damit die aktuelle Seite (auch #Abschnitt) drinsteht
    document.getElementById('fb-link').addEventListener('click', function (e) {
      e.preventDefault();
      location.href = feedbackLink();
    });
    document.getElementById('fuss-pin').addEventListener('click', function (e) {
      e.preventDefault();
      try { ghdSitzung.offlinePinFestlegen(); } catch (x) {}
    });
    // Leisten erscheinen/verschwinden je nach Seite → Abstand immer wieder anpassen
    abstandSetzen(); pinLinkZeigen();
    [300, 1000, 2500].forEach(function (t) { setTimeout(function () { abstandSetzen(); pinLinkZeigen(); }, t); });
    addEventListener('resize', abstandSetzen);
    var warte = 0;
    addEventListener('scroll', function () { if (warte) return; warte = setTimeout(function () { warte = 0; abstandSetzen(); }, 250); }, { passive: true });
    try { new MutationObserver(function () { pinLinkZeigen(); abstandSetzen(); }).observe(document.body, { childList: true }); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', anhaengen);
  else anhaengen();
})();
