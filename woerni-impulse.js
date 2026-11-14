// Wörni V1 – ruhiger Lernbegleiter (Konzept: docs/woerni-v1.md)
// Kurze Impulse an wenigen, festen Stellen. Wörni begleitet, er unterbricht nicht:
// keine Pop-ups, kein Ton, keine Animation, kein Extra-Antippen.
//
// Regeln (regelbasiert, keine Personalisierung):
//  - Jeder Moment hat einen eigenen Vorrat und rotiert ihn durch.
//  - Derselbe Satz frühestens nach 14 Tagen wieder; ist alles „verbraucht“,
//    schweigt Wörni (lieber nichts als Wiederholung).
//  - Wie oft pro Runde/Seite etwas erscheint, regelt die aufrufende Seite
//    (Quiz: höchstens ein Impuls pro Runde).
// Gemerkt wird nur auf diesem Gerät (localStorage), nichts geht an den Server.
// Keine Daten, kein Login, keine Namen (CLAUDE.md, Regel 2).
(function () {
  var IMPULSE = [
    { id: 'f1', moment: 'falsch', ton: 'korrigierend', text: 'Lies die Erklärung genau, denn dort steckt der Unterschied, den du übersehen hast.' },
    { id: 'f2', moment: 'falsch', ton: 'ruhig', text: 'Ein Fehler beim Üben ist billiger als einer am Kopf der Kundin.' },
    { id: 'f3', moment: 'falsch', ton: 'korrigierend', text: 'Merk dir nicht nur die richtige Antwort, sondern auch, warum sie stimmt.' },
    { id: 'f4', moment: 'falsch', ton: 'ruhig', text: 'Schau, an welcher Stelle deine Überlegung in die falsche Richtung gegangen ist.' },
    { id: 'f5', moment: 'falsch', ton: 'korrigierend', text: 'Sag dir die richtige Antwort einmal laut in deinen eigenen Worten.' },

    { id: 'w1', moment: 'wiederholt', ton: 'korrigierend', text: 'Wenn derselbe Fehler wiederkommt, fehlt dir eine Grundlage und nicht die Übung.' },
    { id: 'w2', moment: 'wiederholt', ton: 'ruhig', text: 'Geh einen Schritt zurück und lies das Thema noch einmal von vorne.' },
    { id: 'w3', moment: 'wiederholt', ton: 'korrigierend', text: 'Langsamer antworten bringt dich hier weiter als öfter antworten.' },
    { id: 'w4', moment: 'wiederholt', ton: 'ruhig', text: 'Schreib dir den Unterschied auf, der dich immer wieder erwischt.' },
    { id: 'w5', moment: 'wiederholt', ton: 'korrigierend', text: 'Frag deine Ausbilderin nach diesem Punkt, statt allein weiter zu raten.' },
    { id: 'w6', moment: 'wiederholt', ton: 'ruhig', text: 'Diese Frage kommt in ein paar Tagen wieder, bis dahin lies das Thema nach.' },

    { id: 'e1', moment: 'wiedereinstieg', ton: 'ruhig', text: 'Eine kurze Runde reicht heute, um wieder hineinzufinden.' },
    { id: 'e2', moment: 'wiedereinstieg', ton: 'ruhig', text: 'Für den Wiedereinstieg reicht eine Runde mit Fragen, die du schon kennst.' },
    { id: 'e3', moment: 'wiedereinstieg', ton: 'ruhig', text: 'Schau zuerst in deinen Verlauf, dort siehst du, wo du stehengeblieben bist.' },
    { id: 'e4', moment: 'wiedereinstieg', ton: 'ruhig', text: 'Nach einer Pause ist es normal, dass manches erst wieder auftauchen muss.' },
    { id: 'e5', moment: 'wiedereinstieg', ton: 'ruhig', text: 'Fünf Fragen am Tag halten mehr fest als eine lange Runde im Monat.' },
    { id: 'e6', moment: 'wiedereinstieg', ton: 'bestärkend', text: 'Du steigst nicht bei null ein, sondern dort, wo du aufgehört hast.' },
    { id: 'e7', moment: 'wiedereinstieg', ton: 'bestärkend', text: 'Was du schon gelernt hast, ist nicht weg, es braucht nur Auffrischung.' },
    { id: 'e8', moment: 'wiedereinstieg', ton: 'bestärkend', text: 'Jede kurze Runde zählt für deinen Lernstand, auch wenn sie klein wirkt.' },

    { id: 'p1', moment: 'praxis', ton: 'ruhig', text: 'Leg dir alles bereit, bevor du mit dem ersten Handgriff beginnst.' },
    { id: 'p2', moment: 'praxis', ton: 'korrigierend', text: 'Halte dich an die Reihenfolge, auch wenn es eilig wirkt.' },
    { id: 'p3', moment: 'praxis', ton: 'ruhig', text: 'Überleg dir vorher, wie das Ergebnis am Ende aussehen soll.' },
    { id: 'p4', moment: 'praxis', ton: 'korrigierend', text: 'Schutz für dich und die Kundin kommt zuerst, nicht zwischendurch.' },
    { id: 'p5', moment: 'praxis', ton: 'korrigierend', text: 'Kontrollier nach jedem Abschnitt kurz, bevor du weitermachst.' },

    { id: 'r1', moment: 'richtig_nach_fehler', ton: 'bestärkend', text: 'Diese Frage war beim letzten Mal falsch, jetzt hast du sie richtig.' },
    { id: 'r2', moment: 'richtig_nach_fehler', ton: 'ruhig', text: 'Merk dir, was du diesmal anders überlegt hast.' },
    { id: 'r3', moment: 'richtig_nach_fehler', ton: 'ruhig', text: 'Wiederhol sie in ein paar Tagen noch einmal, dann sitzt sie.' }
  ];
  var KEY = 'woerni-v1', SPERRE_TAGE = 14, TAG = 86400000;

  function lesen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function schreiben(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function heute() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Nächster Impuls eines Moments: der am längsten nicht (oder nie) gezeigte,
  // aber nur, wenn er mindestens 14 Tage nicht gezeigt wurde. Sonst null.
  function waehlen(moment) {
    var d = lesen(), g = d.gezeigt || {}, jetzt = Date.now();
    var frei = IMPULSE.filter(function (i) { return i.moment === moment && (!g[i.id] || jetzt - g[i.id] >= SPERRE_TAGE * TAG); });
    if (!frei.length) return null;
    frei.sort(function (a, b) { return (g[a.id] || 0) - (g[b.id] || 0); });
    return frei[0];
  }
  function merken(imp) {
    var d = lesen(); d.gezeigt = d.gezeigt || {}; d.gezeigt[imp.id] = Date.now(); schreiben(d);
  }

  var CSS =
    '.woerni-zeile{display:flex;gap:10px;align-items:flex-start;margin-top:10px;padding-top:9px;border-top:1px solid rgba(0,0,0,.08);font:13px/1.5 Poppins,system-ui,sans-serif;color:#4A443A;text-align:left}' +
    '.woerni-zeile .wz-ich{flex:none;width:22px;height:22px;border-radius:50%;background:#896C32;color:#fff;display:grid;place-items:center;font:700 11px/1 Poppins,system-ui,sans-serif;margin-top:1px}' +
    '.woerni-zeile .wz-wer{font-weight:600;color:#896C32;margin-right:4px}' +
    '.woerni-zeile.frei{border-top:0;padding-top:0;margin:0 0 12px}';
  function cssEinmal() {
    if (document.getElementById('woerni-v1-css')) return;
    var st = document.createElement('style'); st.id = 'woerni-v1-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function zeile(imp, frei) {
    cssEinmal();
    return '<div class="woerni-zeile' + (frei ? ' frei' : '') + '" data-woerni="' + imp.id + '"><span class="wz-ich" aria-hidden="true">W</span><span><span class="wz-wer">Wörni:</span>' + esc(imp.text) + '</span></div>';
  }

  window.WOERNI = {
    impulse: IMPULSE,
    // Zeile für einen Moment (oder '' wenn nichts frei ist); merkt sich die Anzeige
    zeile: function (moment, frei) {
      var imp = waehlen(moment);
      if (!imp) return '';
      merken(imp);
      return zeile(imp, frei);
    },
    // Wiedereinstieg: derselbe Satz bleibt stehen, bis wieder gelernt wurde
    // (Schlüssel = Datum der letzten Lernrunde).
    einstieg: function (letzteRunde) {
      var d = lesen(), e = d.einstieg;
      if (e && e.seit === letzteRunde) {
        var alt = IMPULSE.filter(function (i) { return i.id === e.id; })[0];
        return alt ? zeile(alt, true) : '';
      }
      var imp = waehlen('wiedereinstieg');
      if (!imp) return '';
      merken(imp);
      d = lesen(); d.einstieg = { seit: letzteRunde, id: imp.id }; schreiben(d);
      return zeile(imp, true);
    },
    // Einmal pro Tag und Ort (z. B. Praxis-Module), sonst ''
    einmalAmTag: function (ort, moment, frei) {
      var d = lesen(); d.tag = d.tag || {};
      if (d.tag[ort] === heute()) return '';
      var html = this.zeile(moment, frei);
      if (html) { d = lesen(); d.tag = d.tag || {}; d.tag[ort] = heute(); schreiben(d); }
      return html;
    }
  };
})();
