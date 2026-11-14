// Leiste unten für die Lern-Seiten (Schnittwerkstatt, Werkzeugkunde,
// Englisch, Schnitt-Designer, Beratung & Formwirkung): dieselben vier Ziele
// wie im Lern-Tool – Heute, Üben, Praxis, Fortschritt. Die Knöpfe führen ins
// Lern-Tool (lerntool.html#ueben usw.), das dort die passende Seite öffnet.
//
// Einbinden:
//   <script src="lern-leiste.js?v=…" data-aktiv="praxis" defer></script>
//   data-aktiv           welcher Knopf markiert ist: heute | ueben | praxis | fortschritt (optional)
//   data-verstecken-bei  CSS-Selektor; solange dieses Element sichtbar ist,
//                        wird die Leiste ausgeblendet (z. B. ein eigenes
//                        Eingabefeld, das selbst unten klebt)
// Keine Daten, kein Login – reine Navigation.
(function () {
  var skript = document.currentScript;
  var aktiv = (skript && skript.getAttribute('data-aktiv')) || '';
  var versteckenBei = (skript && skript.getAttribute('data-verstecken-bei')) || '';
  var ZIEL = 'lerntool.html?v=20261114c';

  var KNOEPFE = [
    {id: 'heute', ic: '🏠', t: 'Heute', h: ''},
    {id: 'ueben', ic: '❓', t: 'Üben', h: '#ueben'},
    {id: 'praxis', ic: '💆', t: 'Praxis', h: '#praxis'},
    {id: 'fortschritt', ic: '📊', t: 'Fortschritt', h: '#fortschritt'}
  ];

  var css =
    'body.ll-an{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px)) !important}' +
    '.ll-leiste{position:fixed;left:0;right:0;bottom:0;z-index:380;background:#fff;border-top:1px solid #E4DBC5;' +
      'display:flex;justify-content:center;padding:6px 4px calc(6px + env(safe-area-inset-bottom,0px));font-family:Poppins,system-ui,sans-serif}' +
    '.ll-leiste[hidden]{display:none}' +
    '.ll-in{display:flex;width:100%;max-width:580px}' +
    '.ll-leiste a{flex:1;text-align:center;text-decoration:none;font-size:10px;line-height:1.3;color:#6B6455;padding:2px 0}' +
    '.ll-leiste a i{display:block;font-style:normal;font-size:19px;margin:0 14px 1px;padding:1px 0;border-radius:12px}' +
    '.ll-leiste a[aria-current="page"]{color:#896C32;font-weight:600}' +
    '.ll-leiste a[aria-current="page"] i{background:#F3EBD9}' +
    '.ll-leiste a:focus-visible{outline:2px solid #896C32;outline-offset:-2px;border-radius:8px}' +
    '@media print{.ll-leiste{display:none}body.ll-an{padding-bottom:0 !important}}';

  function bauen() {
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);

    var nav = document.createElement('nav');
    nav.className = 'll-leiste';
    nav.setAttribute('aria-label', 'Lern-Navigation');
    var innen = document.createElement('div');
    innen.className = 'll-in';
    KNOEPFE.forEach(function (k) {
      var a = document.createElement('a');
      a.href = ZIEL + k.h;
      if (k.id === aktiv) a.setAttribute('aria-current', 'page');
      var i = document.createElement('i');
      i.textContent = k.ic;
      a.appendChild(i);
      a.appendChild(document.createTextNode(k.t));
      innen.appendChild(a);
    });
    nav.appendChild(innen);
    document.body.appendChild(nav);
    document.body.classList.add('ll-an');

    if (versteckenBei) {
      var pruefen = function () {
        var el = document.querySelector(versteckenBei);
        var sichtbar = !!(el && !el.hidden && el.getClientRects().length);
        if (nav.hidden === sichtbar) return;   // nur bei Änderung schreiben, sonst löst der Observer sich selbst aus
        nav.hidden = sichtbar;
        document.body.classList.toggle('ll-an', !sichtbar);
      };
      pruefen();
      new MutationObserver(pruefen).observe(document.body, {attributes: true, childList: true, subtree: true, attributeFilter: ['hidden', 'class', 'style']});
    }

    einleitungKuerzen();
    reiterMarkieren();
  }

  // Lange Einleitung im Seitenkopf auf zwei Zeilen kürzen, mit „mehr anzeigen“
  // (Aussehen in lern-stil.css: .ls-kurz, .ls-mehr)
  function einleitungKuerzen() {
    var p = document.querySelector('header.top > p');
    if (!p) return;
    p.classList.add('ls-kurz');
    if (p.scrollHeight <= p.clientHeight + 2) { p.classList.remove('ls-kurz'); return; }
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'ls-mehr';
    b.textContent = 'mehr anzeigen';
    b.setAttribute('aria-expanded', 'false');
    b.onclick = function () {
      var zu = p.classList.toggle('ls-kurz');
      b.textContent = zu ? 'mehr anzeigen' : 'weniger anzeigen';
      b.setAttribute('aria-expanded', zu ? 'false' : 'true');
    };
    p.insertAdjacentElement('afterend', b);
  }

  // Sprung-Reiter (nav.tabs a[href^="#"]): den Abschnitt markieren, der gerade zu sehen ist
  function reiterMarkieren() {
    var links = [].slice.call(document.querySelectorAll('nav.tabs a[href^="#"]'));
    var ziele = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    if (!links.length || !('IntersectionObserver' in window)) return;
    var setze = function (i) { links.forEach(function (a, j) { a.setAttribute('aria-current', j === i ? 'true' : 'false'); }); };
    setze(0);
    var sichtbar = {};
    var io = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { sichtbar[ziele.indexOf(e.target)] = e.isIntersecting; });
      for (var i = 0; i < ziele.length; i++) if (sichtbar[i]) { setze(i); break; }
    }, {rootMargin: '-30% 0px -60% 0px'});
    ziele.forEach(function (z) { if (z) io.observe(z); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bauen);
  else bauen();
})();
