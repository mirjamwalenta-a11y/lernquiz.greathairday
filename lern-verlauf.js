// Zurück-Taste des Handys innerhalb der App
// Lernquiz und Lern-Tool wechseln ihre Bildschirme ohne neue Seite (zeige(...)).
// Ohne Eintrag im Browser-Verlauf verlässt die Zurück-Taste (Android-Geste,
// Browser-Pfeil) deshalb sofort die ganze App – und man landet z. B. wieder bei
// der Anmeldung der Apps-Übersicht. Hier bekommt jeder Bildschirmwechsel einen
// Eintrag, und „Zurück“ zeigt wieder den vorigen Bildschirm.
//
//   var merken = ghdVerlauf({ zeigen: function (id) { … }, ohneVerlauf: ['s-login'] });
//   merken('s-start');   // nach jedem Bildschirmwechsel aufrufen
//
// ohneVerlauf: Bildschirme, die den aktuellen Eintrag ersetzen statt einen neuen
// anzulegen (Anmeldung, Laden). Speichert nichts, sendet nichts.
(function () {
  window.ghdVerlauf = function (opt) {
    var ohne = {}; (opt.ohneVerlauf || []).forEach(function (id) { ohne[id] = 1; });
    var stapel = [], ausPop = false, popIgnorieren = false;
    function stand() { var s = history.state; return s && s.ghdSeite ? s : null; }
    function merken(id) {
      if (ausPop || !id) return;
      try {
        var s = stand(), i = s ? s.i : 0;
        if (!s || ohne[id] || ohne[s.ghdSeite]) {
          // erster Bildschirm (oder Anmeldung): aktuellen Eintrag ersetzen
          i = Math.max(i, 1); stapel.length = i; stapel[i - 1] = id;
          history.replaceState({ ghdSeite: id, i: i }, '');
          return;
        }
        if (s.ghdSeite === id) return;
        // „← Zurück“-Knopf der App führt zum vorigen Bildschirm: echten Schritt zurück
        if (i >= 2 && stapel[i - 2] === id) {
          stapel.length = i - 1; popIgnorieren = true;
          setTimeout(function () { popIgnorieren = false; }, 1000);
          history.back();
          return;
        }
        stapel.length = i; stapel.push(id);
        history.pushState({ ghdSeite: id, i: i + 1 }, '');
      } catch (e) { /* ohne Verlauf geht es auch */ }
    }
    addEventListener('popstate', function (e) {
      if (popIgnorieren) { popIgnorieren = false; return; }
      var s = e.state;
      if (!s || !s.ghdSeite) return;
      stapel.length = s.i; stapel[s.i - 1] = s.ghdSeite;
      ausPop = true;
      try { opt.zeigen(s.ghdSeite); } catch (x) { /* egal */ } finally { ausPop = false; }
    });
    return merken;
  };
})();
