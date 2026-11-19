// Wörni V1 · „Kurz sortieren“ (Konzept: docs/woerni-v1.md, Abschnitt „Kurz sortieren“)
// Für Stress-, Unsicherheits- und Lernmomente im Ausbildungsalltag.
//
//  - Der Lehrling wählt selbst eine von fünf Situationen. Wörni deutet keine
//    Gefühle, ersetzt keine Meisterin und führt kein Gespräch.
//  - Pro Situation: ein sehr kurzer Impuls zur Einordnung und genau drei
//    Handlungsoptionen, die in bestehende Lern- oder Unterstützungswege führen.
//  - Automatisch erscheint nur ein dezenter Hinweis (eine Zeile mit Link) bei
//    erkennbarer Unsicherheit in einem Schritt: wiederholtes Nachschlagen im
//    selben Praxis-Teil oder wiederholte Fehler im selben Quiz-Thema.
//    Höchstens einmal am Tag, nie direkt nachdem „Kurz sortieren“ offen war.
//
// Gemerkt wird nur auf diesem Gerät (localStorage, Schlüssel „woerni-sortieren“),
// und nur, wann der Hinweis zuletzt kam. Welche Situation gewählt wurde, wird
// nirgends gespeichert. Keine Daten an den Server, keine Namen (CLAUDE.md, Regel 2).
(function () {
  // ziel: Schlüssel, den die aufrufende Seite auflöst (siehe zeichnen(..., ziele)).
  // satz: statt eines Links eine fertige Formulierung zum Nachfragen.
  var SITUATIONEN = [
    { id: 'fehler', ic: '🩹', titel: 'Ich habe einen Fehler gemacht',
      impuls: 'Ein Fehler ist kein Drama. Wichtig ist jetzt: Bescheid geben, verstehen, was passiert ist, und es beim nächsten Mal anders machen.',
      optionen: [
        { ic: '🗣', t: 'Sofort Bescheid geben', d: 'Lieber jetzt als später',
          satz: 'Mir ist gerade bei … etwas passiert. Was mache ich jetzt am besten?' },
        { ic: '📝', t: 'Fürs nächste Mal notieren', d: 'Im Praxis-Tagebuch festhalten', ziel: 'praxis' },
        { ic: '🔁', t: 'Das Thema wiederholen', d: 'Was noch wackelt, kurz üben', ziel: 'wiederholen' }
      ] },
    { id: 'nervoes', ic: '⏱', titel: 'Ich bin nervös vor einem Schritt',
      impuls: 'Vor einem Schritt, den du noch nicht oft gemacht hast, ist Anspannung normal. Jetzt hilft ein klarer Blick auf den Ablauf.',
      optionen: [
        { ic: '💆', t: 'Ablauf einmal durchgehen', d: 'Ablauf im Praxis-Modul ansehen', ziel: 'praxis' },
        { ic: '🗣', t: 'Beim ersten Schritt zuschauen lassen', d: 'Ein Satz an deine Meisterin genügt',
          satz: 'Ich mache gleich … und bin noch nicht ganz sicher. Schaust du beim ersten Schritt kurz zu?' },
        { ic: '🎯', t: 'Thema kurz auffrischen', d: 'Ein paar Fragen im Themen-Quiz', ziel: 'quiz' }
      ] },
    { id: 'zuviel', ic: '🧺', titel: 'Mir ist gerade alles zu viel',
      impuls: 'Du musst nicht alles gleichzeitig lösen. Such dir nur den einen nächsten Schritt.',
      optionen: [
        { ic: '📅', t: 'Heutigen Lernschritt ansehen', d: 'Ein Thema laut Lernplan, sonst nichts', ziel: 'heute' },
        { ic: '🗣', t: 'Fragen, was zuerst kommt', d: 'Deine Meisterin hilft beim Sortieren',
          satz: 'Bei mir ist gerade viel auf einmal. Was ist jetzt als Erstes wichtig?' },
        { ic: '❓', t: 'Kurz ins Quiz', d: 'Schnell-Check, nur ein paar Minuten', ziel: 'quizkurz' }
      ] },
    { id: 'unsicher', ic: '❔', titel: 'Ich bin bei einem Schritt unsicher',
      impuls: 'Unsicher heißt: Eine Frage ist noch offen. Klär sie, bevor du weitermachst. Das ist besser als raten.',
      optionen: [
        { ic: '💆', t: 'Im Praxis-Modul nachsehen', d: 'Ablauf und Hinweise ansehen', ziel: 'praxis' },
        { ic: '🔎', t: 'Begriff oder Thema suchen', d: 'Im A–Z-Verzeichnis', ziel: 'verzeichnis' },
        { ic: '🗣', t: 'Kurz nachfragen', d: 'Ein Satz an deine Meisterin genügt',
          satz: 'Bei … bin ich nicht sicher. Kannst du mir das kurz zeigen?' }
      ] },
    { id: 'rueckmeldung', ic: '💬', titel: 'Ich hänge nach einer Rückmeldung fest',
      impuls: 'Eine Rückmeldung kann kurz treffen. Wichtig ist der eine Punkt, den du beim nächsten Mal anders machst.',
      optionen: [
        { ic: '🗣', t: 'Genau nachfragen', d: 'Damit klar ist, was du ändern sollst',
          satz: 'Damit ich es richtig verstehe: Was soll ich beim nächsten Mal anders machen?' },
        { ic: '📝', t: 'Den einen Punkt notieren', d: 'Im Praxis-Tagebuch festhalten', ziel: 'praxis' },
        { ic: '🎯', t: 'Das passende Thema üben', d: 'Ein paar Fragen im Themen-Quiz', ziel: 'quiz' }
      ] }
  ];

  var KEY = 'woerni-sortieren';
  var NACHSCHLAGEN_MAL = 3, NACHSCHLAGEN_FENSTER = 10 * 60000, PAUSE_NACH_OEFFNEN = 30 * 60000;
  var LINK_AUSSEN = 'https://mirjamwalenta-a11y.github.io/lernquiz.greathairday/lerntool.html?v=20261119b#sortieren=';

  function lesen() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function schreiben(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  function heute() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function finde(id) { return SITUATIONEN.filter(function (s) { return s.id === id; })[0] || null; }

  // Aussehen: nur vorhandene Stile (Wörni-Zeile aus woerni-impulse.js, Karten
  // der jeweiligen Seite). Hier nur, was die Wörni-Zeile für den Link braucht.
  var CSS =
    '.woerni-zeile{display:flex;gap:10px;align-items:flex-start;margin-top:10px;padding-top:9px;border-top:1px solid rgba(0,0,0,.08);font:13px/1.5 Poppins,system-ui,sans-serif;color:#4A443A;text-align:left}' +
    '.woerni-zeile .wz-ich{flex:none;width:22px;height:22px;border-radius:50%;background:#896C32;color:#fff;display:grid;place-items:center;font:700 11px/1 Poppins,system-ui,sans-serif;margin-top:1px}' +
    '.woerni-zeile .wz-wer{font-weight:600;color:#896C32;margin-right:4px}' +
    '.woerni-zeile.frei{border-top:0;padding-top:0;margin:0 0 12px}' +
    '.woerni-zeile a.ws-link{color:#896C32;font-weight:600;text-decoration:none;white-space:nowrap}';
  function cssEinmal() {
    if (document.getElementById('woerni-sortieren-css')) return;
    var st = document.createElement('style'); st.id = 'woerni-sortieren-css'; st.textContent = CSS; document.head.appendChild(st);
  }
  function wZeile(innen, frei) {
    cssEinmal();
    return '<div class="woerni-zeile' + (frei ? ' frei' : '') + '"><span class="wz-ich" aria-hidden="true">W</span><span><span class="wz-wer">Wörni:</span>' + innen + '</span></div>';
  }

  // Darf der automatische Hinweis jetzt kommen? Höchstens einmal am Tag,
  // nicht kurz nachdem „Kurz sortieren“ ohnehin offen war.
  function hinweisFrei() {
    var d = lesen();
    if (d.hinweisTag === heute()) return false;
    if (d.geoeffnet && Date.now() - d.geoeffnet < PAUSE_NACH_OEFFNEN) return false;
    return true;
  }
  function hinweisHTML(text, situation, frei) {
    var link = typeof window.sortierenOeffnen === 'function'
      ? '<a class="ws-link" href="#sortieren" onclick="sortierenOeffnen(\'' + situation + '\');return false;">Kurz sortieren →</a>'
      : '<a class="ws-link" href="' + LINK_AUSSEN + situation + '">Kurz sortieren →</a>';
    return wZeile(esc(text) + ' ' + link, frei);
  }
  function hinweisMerken() { var d = lesen(); d.hinweisTag = heute(); schreiben(d); }

  var nachgeschlagen = {};   // nur im Speicher dieser Seite: Teil → Zeitpunkte

  window.WOERNI_SORTIEREN = {
    situationen: SITUATIONEN,

    // Auswahl (ohne situationId) oder eine Situation mit Impuls und drei Optionen.
    // ziele: { praxis: fn, quiz: fn, … } – die aufrufende Seite entscheidet, wohin.
    zeichnen: function (el, situationId, ziele) {
      if (!el) return;
      var d = lesen(); d.geoeffnet = Date.now(); schreiben(d);
      var s = finde(situationId), self = this;
      if (!s) {
        el.innerHTML = '<div class="label">Was passt gerade?</div>' +
          SITUATIONEN.map(function (x) {
            return '<button class="nav-card pm-modul" data-ws="' + x.id + '"><div class="nav-icon" style="margin:0">' + x.ic + '</div><div><div class="nav-title">' + esc(x.titel) + '</div></div></button>';
          }).join('') +
          '<p class="pt-info">Wörni ersetzt keine Meisterin. Wenn sich jemand verletzt hat, eine Haut reagiert oder es dir länger nicht gut geht: sag es gleich jemandem im Salon.</p>';
        [].forEach.call(el.querySelectorAll('[data-ws]'), function (b) {
          b.onclick = function () { self.zeichnen(el, b.getAttribute('data-ws'), ziele); window.scrollTo(0, 0); };
        });
        return;
      }
      el.innerHTML =
        '<div class="label">' + s.ic + ' ' + esc(s.titel) + '</div>' +
        wZeile(esc(s.impuls), true) +
        '<div class="label" style="margin-top:16px">Dein nächster Schritt</div>' +
        s.optionen.map(function (o, i) {
          return '<button class="nav-card pm-modul" data-wo="' + i + '"><div class="nav-icon" style="margin:0">' + o.ic + '</div><div><div class="nav-title">' + esc(o.t) + '</div><div class="nav-desc">' + esc(o.d) + '</div></div></button>' +
            (o.satz ? '<div class="fb-o" data-ws-satz="' + i + '" hidden style="margin:-2px 0 10px"><div class="label" style="margin-bottom:4px">So kannst du fragen</div><div style="font-size:14px;color:#211D17;line-height:1.5">„' + esc(o.satz) + '“</div></div>' : '');
        }).join('') +
        '<button class="btn-ghost" data-ws-zurueck style="width:100%;margin-top:8px">← Andere Situation</button>';
      [].forEach.call(el.querySelectorAll('[data-wo]'), function (b) {
        var o = s.optionen[+b.getAttribute('data-wo')];
        b.onclick = function () {
          if (o.satz) { var box = el.querySelector('[data-ws-satz="' + b.getAttribute('data-wo') + '"]'); if (box) box.hidden = !box.hidden; return; }
          if (ziele && typeof ziele[o.ziel] === 'function') ziele[o.ziel]();
        };
      });
      el.querySelector('[data-ws-zurueck]').onclick = function () { self.zeichnen(el, '', ziele); window.scrollTo(0, 0); };
    },

    // Praxis-Module: ein Teil (z. B. „Haarwäsche · Ablauf“) wurde geöffnet.
    // Beim 3. Öffnen desselben Teils innerhalb von 10 Minuten: Hinweis-HTML, sonst ''.
    nachschlagen: function (teil) {
      var jetzt = Date.now();
      var z = (nachgeschlagen[teil] || []).filter(function (t) { return jetzt - t < NACHSCHLAGEN_FENSTER; });
      z.push(jetzt); nachgeschlagen[teil] = z;
      if (z.length < NACHSCHLAGEN_MAL || !hinweisFrei()) return '';
      hinweisMerken();
      return hinweisHTML('Diesen Teil hast du gerade mehrmals geöffnet. Wenn dir ein Schritt unklar ist:', 'unsicher', true);
    },

    // Quiz: wiederholter Fehler im selben Thema derselben Runde. Hinweis-HTML oder ''.
    wiederholterFehler: function () {
      if (!hinweisFrei()) return '';
      hinweisMerken();
      return hinweisHTML('Das ist der zweite Fehler in diesem Thema. Wenn dir hier etwas unklar ist:', 'unsicher', false);
    }
  };
})();
