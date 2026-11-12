// Kleiner Fuß unten auf jeder Seite: Links zu Impressum, Datenschutz und
// Nutzungsbedingungen (rechtliches.html). Wird am Ende von <body> angehängt;
// die Leiste unten (lern-leiste.js) lässt dafür schon Platz frei.
// Keine Daten, kein Login, nichts von fremden Servern.
(function () {
  function anhaengen() {
    if (document.getElementById('recht-fuss')) return;
    var st = document.createElement('style');
    st.textContent =
      '#recht-fuss{text-align:center;font:12px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:20px 16px 16px;color:#9A9188}' +
      '#recht-fuss a{color:inherit;text-decoration:none;margin:0 6px;white-space:nowrap}' +
      '#recht-fuss a:hover{color:#896C32;text-decoration:underline}' +
      '@media print{#recht-fuss{display:none}}';
    document.head.appendChild(st);
    var f = document.createElement('footer');
    f.id = 'recht-fuss';
    f.innerHTML =
      '<a href="rechtliches.html#impressum">Impressum</a>·' +
      '<a href="rechtliches.html#datenschutz">Datenschutz</a>·' +
      '<a href="rechtliches.html#nutzungsbedingungen">Nutzungsbedingungen</a>';
    document.body.appendChild(f);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', anhaengen);
  else anhaengen();
})();
