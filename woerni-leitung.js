// Wörni · „Ich steh auf der Leitung“ (Lernquiz, Multiple Choice)
//
// Idee: Wer bei einer Frage hängt, bekommt nicht gleich die Lösung, sondern
//   1. ein Bild aus dem Salonalltag oder eine Eselsbrücke,
//   2. eine leichte Gegenfrage zum Antippen,
// und beantwortet danach die eigentliche Frage selbst.
//
// Regeln (Wörni-Grundsatz, docs/woerni-v1.md):
//  - Regelbasiert, keine KI zur Laufzeit. Alle Texte stehen hier fest und
//    werden von der Meisterin geprüft (wie leichte-sprache.js).
//  - Den Knopf gibt es nur für Fragen mit Eintrag hier, nie im LAP-Modus und
//    nicht bei Zusatzfragen.
//  - Wer die Hilfe öffnet, bekommt die Frage wie „geraten“ gewertet: halbe
//    Punkte, und sie kommt in die Wiederholung (lernquiz.html, pruefeMC).
//  - Nichts wird gespeichert, nichts geht an den Server, keine Namen
//    (CLAUDE.md, Regel 2).
//
// Schlüssel = id der Frage in lernquiz.html (FB).
// Felder: bild (Bild/Eselsbrücke), frage (Gegenfrage), o (2–3 Antworten),
//         r (Index der richtigen), ja (nach richtig), nein (nach falsch).
// Stand 2026-11-25: Farbe & Blondierung, 15 Fragen. Fachlich durch die
// Meisterin prüfen.
(function () {
  var T = {
    // ── Farbkreis & Gegenfarben ──────────────────────────────────────────
    '1-mc14': {
      bild: 'Stell dir den Farbkreis wie zwei gleich starke Leute beim Tauziehen vor. Wer sich genau gegenübersteht, hebt sich auf: Am Ende bewegt sich nichts, das Haar wirkt neutral. Typisch im Salon: Dunkles Haar wird aufgehellt und schaut danach orange aus.',
      frage: 'Orange ist eine Mischfarbe. Aus welchen zwei Grundfarben besteht es?',
      o: ['Rot und Gelb', 'Rot und Blau', 'Gelb und Blau'], r: 0,
      ja: 'Genau. Im Orange stecken schon Rot und Gelb. Die Grundfarbe, die darin fehlt, ist sein Gegenspieler.',
      nein: 'Nicht ganz. Orange ist warm wie ein Sonnenuntergang: Darin stecken Rot und Gelb. Welche Grundfarbe fehlt dann noch? Die ist sein Gegenspieler.'
    },
    '1-mc15': {
      bild: 'Eine Kundin kommt mit hellem Blond, das aussieht wie Stroh. Im Regal steht ein Shampoo genau gegen diesen Gelbstich. Merksatz: Die Gegenfarbe ist immer die Mischung aus den zwei anderen Grundfarben.',
      frage: 'Gelb ist eine Grundfarbe. Welche zwei Grundfarben bleiben übrig?',
      o: ['Rot und Blau', 'Gelb und Blau', 'Rot und Gelb'], r: 0,
      ja: 'Richtig. Und was ergeben Rot und Blau gemischt? Genau diese Farbe nimmt dem Blond das Gelb.',
      nein: 'Nicht ganz. Die drei Grundfarben sind Rot, Gelb und Blau. Nimm Gelb weg, dann bleiben Rot und Blau. Ihre Mischung ist die Gegenfarbe zu Gelb.'
    },
    '1-mc16': {
      bild: 'Make-up-Profis decken rote Äderchen im Gesicht nicht mit Hautfarbe ab, sondern mit einem Concealer in der Gegenfarbe von Rot. Im Haar ist es genauso: Gegen einen Rotstich hilft nicht „mehr Braun“, sondern die Gegenfarbe.',
      frage: 'Rot ist eine Grundfarbe. Welche zwei Grundfarben bleiben übrig?',
      o: ['Gelb und Blau', 'Orange und Violett', 'Rot und Gelb'], r: 0,
      ja: 'Genau. Gelb und Blau gemischt ergeben die Farbe, die Rot gegenüberliegt.',
      nein: 'Nicht ganz. Grundfarben sind nur Rot, Gelb und Blau. Ohne Rot bleiben Gelb und Blau. Was ergeben die beiden zusammen?'
    },

    // ── Oxidant / Wasserstoffperoxid ─────────────────────────────────────
    '1-mc19': {
      bild: 'Stell dir die Farbcreme als Auto vor und den Oxidant als Motor. Ohne Motor fährt nichts. Der Motor macht zwei Dinge auf einmal: Er hellt das eigene Pigment der Kundin ein Stück auf und lässt aus den farblosen Vorstufen im Haar die fertige Farbe entstehen.',
      frage: 'Was passiert, wenn du Oxidationsfarbe ganz ohne Oxidant aufträgst?',
      o: ['Fast nichts, die Farbe entwickelt sich nicht', 'Das Haar wird sofort viel heller', 'Die Farbe hält besonders lange'], r: 0,
      ja: 'Richtig. Erst der Oxidant bringt die Farbe in Gang, und dabei hellt er auch auf.',
      nein: 'Nicht ganz. Ohne Oxidant passiert in der Farbcreme fast nichts. Er ist der Teil, der arbeitet: aufhellen und Farbe entwickeln.'
    },
    '1-ft2': {
      bild: 'Denk an Laufen: 3 % ist ein Spaziergang, 12 % ein Sprint. Je höher die Zahl, desto mehr Aufhellung, und desto mehr wird das Haar beansprucht.',
      frage: 'Eine Kundin will ihre Haare eine Stufe dunkler färben. Braucht die Farbe dafür viel Aufhellkraft?',
      o: ['Nein, kaum oder gar keine', 'Ja, möglichst viel', 'Das hängt nur von der Haarlänge ab'], r: 0,
      ja: 'Genau. Wenig Aufhellung heißt: die kleinste Prozentzahl.',
      nein: 'Nicht ganz. Wer dunkler werden will, braucht keine Aufhellung. Also nimmst du die kleinste Prozentzahl.'
    },
    '1-ft3': {
      bild: 'Merk dir nur ein Paar: 3 % = 10 Vol. Alle anderen sind Vielfache davon: doppelt, dreifach, vierfach. So musst du keine Tabelle auswendig lernen.',
      frage: '6 % ist wie viel Mal so viel wie 3 %?',
      o: ['2-mal', '3-mal', '6-mal'], r: 0,
      ja: 'Richtig, doppelt so viel. Dann ist auch die Vol-Zahl doppelt so groß wie bei 3 %.',
      nein: 'Nicht ganz: 3 + 3 = 6, also 2-mal. Und wenn 3 % = 10 Vol sind, was ist dann das Doppelte?'
    },

    // ── Was Farbe kann und was nicht ─────────────────────────────────────
    '1-ft6': {
      bild: 'Stell dir getönte Sonnenbrillengläser vor: Legst du ein helles Glas auf ein dunkles, wird es nicht heller, nur noch dunkler. Haarfarbe legt sich wie ein weiteres Glas dazu. Das alte Glas muss erst weg.',
      frage: 'Was kann künstliche Farbpigmente aus dem Haar entfernen?',
      o: ['Blondierung oder Farbabzug', 'Eine hellere Haarfarbe', 'Eine längere Einwirkzeit'], r: 0,
      ja: 'Richtig. Nur die schaffen das. Eine Haarfarbe allein bekommt Farbe nicht heller.',
      nein: 'Nicht ganz. Haarfarbe legt nur dazu, sie nimmt nichts weg. Künstliche Pigmente bekommst du nur mit Blondierung oder Farbabzug heraus.'
    },
    '1-ft7': {
      bild: 'Die Schuppenschicht ist wie ein Tannenzapfen: Im kalten, nassen Wald ist er fest zu. Auf der warmen Heizung gehen seine Schuppen auf. Alkalische Mittel wie Ammoniak sind im Haar die „Heizung“. Saure Pflege legt die Schuppen danach wieder an.',
      frage: 'Die Farbe soll ins Innere des Haares (Cortex). Was muss sie dafür überwinden?',
      o: ['Die Schuppenschicht (Cuticula)', 'Die Kopfhaut', 'Das Mark (Medulla)'], r: 0,
      ja: 'Genau. Und das Alkalisierungsmittel ist der Teil, der diese Tür aufmacht.',
      nein: 'Nicht ganz. Die Schuppenschicht liegt außen wie ein Dach. Damit die Farbe nach innen kommt, muss jemand sie öffnen.'
    },

    // ── Auftragen ────────────────────────────────────────────────────────
    '1-ft4': {
      bild: 'Denk an einen Kuchen im Ofen: Was näher an der Hitze ist, ist schneller fertig. Der Ansatz liegt direkt an der warmen Kopfhaut. Dort „backt“ die Farbe schneller.',
      frage: 'Wo ist das Haar beim Färben am wärmsten?',
      o: ['Am Ansatz, nah an der Kopfhaut', 'In den Spitzen', 'Überall gleich warm'], r: 0,
      ja: 'Richtig. Was schneller reagiert, kommt später dran, damit am Ende alles gleich hell ist.',
      nein: 'Nicht ganz. Die Kopfhaut gibt Körperwärme ab, deshalb ist es am Ansatz am wärmsten. Und Wärme macht die Farbe schneller.'
    },
    '1-ft8': {
      bild: 'Stell dir vor, du bügelst ein Hemd und fährst immer wieder über dieselbe Stelle: Irgendwann ist der Stoff durch. Bereits blondiertes Haar hat seine „Bügelrunde“ schon hinter sich. Noch einmal drüber, und es bricht.',
      frage: 'Welches Haar braucht bei einer Ansatzblondierung wirklich Blondierung?',
      o: ['Nur das nachgewachsene, noch dunkle Haar', 'Das ganze Haar vom Ansatz bis zur Spitze', 'Nur die Spitzen'], r: 0,
      ja: 'Genau. Das schon Blondierte schützt du, also nicht überlappen.',
      nein: 'Nicht ganz. Die Längen sind schon hell, sie brauchen keine zweite Runde. Nur das Nachgewachsene ist noch dunkel.'
    },

    // ── Untergrund & Aufhellen ───────────────────────────────────────────
    '2-mc1': {
      bild: 'Aufhellen ist wie eine Treppe: Von Dunkelbraun geht es über Rot und Orange nach Gelb, ganz oben wird es hellgelb. Dunkles Haar steht noch weit unten auf der Treppe.',
      frage: 'Dunkles Haar wird zum ersten Mal aufgehellt. Ist es dann schon gelb?',
      o: ['Nein, zuerst kommen warme, rötliche Töne', 'Ja, sofort hellgelb', 'Es wird zuerst bläulich'], r: 0,
      ja: 'Genau. Beim Aufhellen zeigt dunkles Haar zuerst Rot und Orange. Bis Gelb ist es noch ein Stück.',
      nein: 'Nicht ganz. Dunkles Haar hat viel rotes Pigment. Das zeigt sich beim Aufhellen zuerst, Gelb kommt erst viel später.'
    },
    '2-wk2': {
      bild: 'Jedes Haar hat warme Pigmente im Untergrund, wie ein orangefarbener Teppich unter dem Sofa. Für einen warmen Farbton stört der Teppich kaum. Für einen kühlen Ton wie Asch oder Beige muss mehr davon weg, sonst scheint er durch.',
      frage: 'Was muss bei einem kühlen Wunschton stärker abgebaut werden?',
      o: ['Die warmen Naturpigmente im Untergrund', 'Die Schuppenschicht', 'Die kühlen Pigmente'], r: 0,
      ja: 'Richtig. Mehr abbauen heißt: weiter aufhellen als bei warmen Tönen. Für warm sind es ½ bis 1½ Tonhöhen, für kühl also etwas mehr.',
      nein: 'Nicht ganz. Kühle Töne vertragen keinen warmen Untergrund. Die warmen Pigmente müssen also weiter abgebaut werden als bei warmen Tönen.'
    },
    '3-vp1': {
      bild: 'Stell dir stark aufgehelltes Haar wie eine Wand ohne Grundierung vor: Streichst du dunkle Farbe direkt drauf, wird sie fleckig, grau oder grünlich. Die warmen Pigmente, die beim Aufhellen verloren gingen, musst du erst wieder „hineingrundieren“.',
      frage: 'Was fehlt hellem, aufgehelltem Haar, wenn es wieder viel dunkler werden soll?',
      o: ['Die warmen Pigmente (Rot, Orange, Gold)', 'Die Schuppenschicht', 'Kühle Asch-Pigmente'], r: 0,
      ja: 'Richtig. Bei einem großen Sprung nach dunkel fehlt viel davon. Dann bringst du sie zuerst zurück.',
      nein: 'Nicht ganz. Beim Aufhellen gehen die warmen Pigmente verloren. Genau die fehlen, wenn das Haar wieder dunkel werden soll.'
    },

    // ── Farbnummern ──────────────────────────────────────────────────────
    '2-mc2': {
      bild: 'Denk an ein Haus mit 10 Stockwerken: Im Keller (1) ist es schwarz, ganz oben (10) hellblond. Die erste Zahl sagt dir das Stockwerk. Erst nach dem Punkt kommt die „Wandfarbe“ im Zimmer.',
      frage: 'Welche Farbe ist heller: 5.0 oder 8.0?',
      o: ['8.0', '5.0', 'Beide gleich hell'], r: 0,
      ja: 'Richtig. Die größere erste Zahl ist heller. Die erste Zahl beschreibt also, wie hell oder dunkel die Farbe ist.',
      nein: 'Nicht ganz. Je höher das Stockwerk, desto heller: 8 ist weiter oben als 5.'
    },
    '2-mc3': {
      bild: 'Die Zahl vor dem Punkt ist das Stockwerk (wie hell), die Zahl danach ist die „Wandfarbe“ (welcher Farbton). Merksatz: „Eins ist Asche, drei ist Gold.“ Eine 7.3 auf der Farbkarte ist ein warmes, sonniges Mittelblond.',
      frage: 'Was steht vor dem Punkt, was danach?',
      o: ['Vorne die Helligkeit, danach der Farbton (Reflex)', 'Vorne die Einwirkzeit, danach der Oxidant', 'Beides beschreibt nur die Helligkeit'], r: 0,
      ja: 'Genau. Die Zahl nach dem Punkt ist also ein Farbton. Welcher war beim Merksatz die Drei?',
      nein: 'Nicht ganz. Vorne steht, wie hell die Farbe ist. Nach dem Punkt kommt der Farbton, also der Reflex.'
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function wZeile(text) {
    if (window.WOERNI && WOERNI.text) return WOERNI.text(text, 'nachdenklich', true);
    return '<div style="font-size:13px;color:#4A443A;line-height:1.5;margin-bottom:10px"><b style="color:#896C32">Wörni:</b> ' + esc(text) + '</div>';
  }

  window.WOERNI_LEITUNG = {
    texte: T,
    hat: function (id) { return !!(id && T[id]); },
    // Knopf (dieselbe Optik wie „Einfacher erklärt“). beiHilfe() wird aufgerufen,
    // sobald die Hilfe geöffnet wird (Seite wertet die Frage dann wie geraten).
    knopf: function (id, beiHilfe) {
      var t = T[id];
      if (!t) return null;
      var box = document.createElement('div');
      box.className = 'ls-box';
      box.style.cssText = 'text-align:center;margin-top:4px';
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pt-edit-k';
      b.textContent = 'Wörni, ich steh auf der Leitung';
      b.addEventListener('click', function () {
        if (beiHilfe) beiHilfe();
        box.style.textAlign = 'left';
        box.style.cssText += ';margin-top:10px;padding-top:10px;border-top:1px solid #0001';
        box.innerHTML = wZeile(t.bild) +
          '<div style="font-size:13px;font-weight:600;color:#2C2C2C;margin:4px 0 8px">' + esc(t.frage) + '</div>';
        var fb = document.createElement('div');
        fb.style.cssText = 'font-size:13px;color:#2C2C2C;line-height:1.5;margin-bottom:8px';
        t.o.forEach(function (txt, i) {
          var ob = document.createElement('button');
          ob.type = 'button'; ob.className = 'opt'; ob.textContent = txt;
          ob.addEventListener('click', function () {
            box.querySelectorAll('.opt').forEach(function (x) {
              x.disabled = true;
              if (x === ob) x.className = 'opt ' + (i === t.r ? 'ric' : 'fal');
            });
            fb.textContent = i === t.r ? t.ja : t.nein;
            var w = document.createElement('div');
            w.style.cssText = 'font-size:12px;color:#6B6560;margin-top:6px';
            w.textContent = '➜ Jetzt probier die Frage oben selbst.';
            fb.appendChild(w);
          });
          box.appendChild(ob);
        });
        box.appendChild(fb);
        var h = document.createElement('div');
        h.style.cssText = 'font-size:11px;color:#9A9188;line-height:1.45';
        h.textContent = 'Mit Hilfe zählt die Frage wie geraten und kommt in die Wiederholung. Dann schaffst du sie das nächste Mal allein.';
        box.appendChild(h);
      });
      box.appendChild(b);
      return box;
    }
  };
})();
