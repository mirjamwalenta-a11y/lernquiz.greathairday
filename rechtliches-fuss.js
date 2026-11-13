// Kleiner Fuß unten auf jeder Seite: Knopf „Feedback geben“ und Links zu
// Impressum, Datenschutz und Nutzungsbedingungen (rechtliches.html). Wird am
// Ende von <body> angehängt; die Leiste unten (lern-leiste.js) lässt dafür
// schon Platz frei.
// Feedback: öffnet nur eine vorbereitete E-Mail im E-Mail-Programm des Geräts
// (an die geschäftliche Adresse aus dem Impressum). In der App wird nichts
// gespeichert oder gesendet; mitgegeben wird nur, auf welcher Seite man war.
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
  function anhaengen() {
    if (document.getElementById('recht-fuss')) return;
    var st = document.createElement('style');
    st.textContent =
      '#recht-fuss{text-align:center;font:12px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:20px 16px 16px;color:#9A9188}' +
      '#recht-fuss a{color:inherit;text-decoration:none;margin:0 6px;white-space:nowrap}' +
      '#recht-fuss a:hover{color:#896C32;text-decoration:underline}' +
      '#recht-fuss a.fb{display:inline-block;margin:0 0 12px;padding:8px 16px;border:1px solid #D9CDAE;border-radius:999px;background:#fff;color:#896C32;font-weight:600;font-size:13px}' +
      '#recht-fuss a.fb:hover{background:#F3EBD9;text-decoration:none}' +
      '@media print{#recht-fuss{display:none}}';
    document.head.appendChild(st);
    var f = document.createElement('footer');
    f.id = 'recht-fuss';
    f.innerHTML =
      '<a class="fb" href="#" id="fb-link">💬 Feedback geben</a><br>' +
      '<a href="rechtliches.html#impressum">Impressum</a>·' +
      '<a href="rechtliches.html#datenschutz">Datenschutz</a>·' +
      '<a href="rechtliches.html#nutzungsbedingungen">Nutzungsbedingungen</a>';
    document.body.appendChild(f);
    // Link erst beim Antippen bauen, damit die aktuelle Seite (auch #Abschnitt) drinsteht
    document.getElementById('fb-link').addEventListener('click', function (e) {
      e.preventDefault();
      location.href = feedbackLink();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', anhaengen);
  else anhaengen();
})();
