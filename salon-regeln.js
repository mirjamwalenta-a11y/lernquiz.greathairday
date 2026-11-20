// Verhaltensregeln des Salons (A Great Hair Day Team), Wortlaut der Inhaberin vom 2026-11-20.
// Wörni (woerni-begleiter.js) zeigt sie auf der Seite „Unsere Verhaltensregeln“ im Lern-Tool
// und nutzt sie für die Antworten in „Frag Wörni“.
//
// Eigene Datei, damit ein anderer Salon (Abo) später seine eigenen Regeln einsetzen kann.
// Keine Namen, Telefonnummern oder anderen persönlichen Daten hier eintragen (CLAUDE.md, Regel 2).
//  r: Regeln im Wortlaut des Salons · w: Wörnis kurze Erklärung, warum die Regel wichtig ist
window.GHD_SALON_REGELN = {
  titel: 'Unsere Verhaltensregeln',
  team: 'A Great Hair Day Team',
  unter: 'Informationen zu Krankmeldungen, Urlaubsanträgen, Pausen sowie Hygiene- und Bekleidungsrichtlinien.',
  stand: '2026-11-20',
  abschnitte: [
    { nr: '1', ic: '🤒', t: 'Verhalten bei Krankenstand', teile: [
      { t: 'Krankmeldung', r: [
        'Benachrichtigung: Krankmeldungen vor dem Arztbesuch dürfen per WhatsApp bekanntgegeben werden.',
        'Ärztlicher Besuch: Nach einem Arztbesuch sollte umgehend in der Firma angerufen werden, um über die voraussichtliche Dauer des Ausfalls oder die Rückkehr ins Team zu informieren.',
        'Frist: Die Krankmeldung muss am selben Tag eingereicht werden.' ] },
      { t: 'Verlängerung des Krankenstandes', r: [
        'Sollte der Krankenstand verlängert werden müssen, ist dies ebenfalls telefonisch in der Firma bekanntzugeben.' ] },
      { t: 'Kommunikation', r: [
        'WhatsApp-Nachrichten nach der Krankheitsankündigung werden nicht akzeptiert.',
        'Alle Mitteilungen müssen direkt telefonisch erfolgen.' ] } ],
      w: 'Wenn jemand fehlt, muss das Team Termine umplanen und Gäste anrufen. Ein Anruf klärt sofort, wie lange du ausfällst, eine Nachricht kann untergehen.' },
    { nr: '2', ic: '🏖', t: 'Urlaubsansuchen', teile: [
      { t: 'Urlaubsplanung', r: [
        'Absprache: Urlaub ist im Vorfeld mit den Kolleginnen und Kollegen abzusprechen, um sicherzustellen, dass Lehrlinge und Gesellen nicht gleichzeitig im Urlaub sind.',
        'Blockunterricht: Bei Lehrlingen muss der Blockunterricht zusätzlich berücksichtigt werden.' ] },
      { t: 'Antragstellung', r: [
        'Nach der Absprache wird ein Urlaubsansuchen erstellt und der Chefin mitgeteilt.',
        'Der Urlaub ist erst nach der Genehmigung durch die Chefin gültig.' ] } ],
      w: 'Gäste sollen auch in der Urlaubszeit gut betreut sein. Deshalb erst mit dem Team absprechen, dann einreichen, und erst buchen, wenn die Chefin zugestimmt hat.' },
    { nr: '3', ic: '🥪', t: 'Mittagspause', teile: [
      { t: 'Pausenzeiten', r: [
        'Die Mittagspause findet in der festgelegten Mittagszeit statt.',
        'In der ersten halben Stunde ist es erlaubt, den Salon zu verlassen, die zweite Hälfte muss im Salon verbracht werden.' ] } ],
      w: 'Die Pause ist für dich da, damit du wieder Kraft hast. In der zweiten Hälfte bist du im Salon, damit das Team auch in der Mittagszeit gut besetzt ist.' },
    { nr: '4', ic: '📒', t: 'Ausbildung', teile: [
      { t: 'Nutzung der freien Zeit', r: [
        'Jede freie Minute muss genutzt werden, um an der eigenen Ausbildung zu arbeiten.',
        'Die Übungen basieren auf den Vorgaben der Chefin oder der zuständigen Ausbildnerin.' ] },
      { t: 'Dokumentation', r: [
        'Alle Ausbildungsinhalte müssen im Ausbildungsbuch dokumentiert werden.' ] } ],
      w: 'Freie Minuten sind deine Trainingszeit. Was du übst, schreibst du ins Ausbildungsbuch, so siehst du und deine Ausbildnerin, wie weit du schon bist. Auch ein paar Quizfragen oder ein Eintrag im Praxis-Tagebuch zählen.' },
    { nr: '5', ic: '🧼', t: 'Hygiene', teile: [
      { t: 'Hygieneanforderungen', r: [
        'Hygiene hat oberste Priorität, sowohl in Bezug auf die persönliche Hygiene als auch im Geschäft.' ] } ],
      w: 'Gäste vertrauen uns ihre Haut und ihre Haare an. Saubere Hände, saubere Werkzeuge und ein gepflegtes Auftreten schützen sie und dich.' },
    { nr: '6', ic: '🖤', t: 'Bekleidung und Frisur', teile: [
      { t: 'Kleidungsrichtlinien', r: [
        'Farben: Die Kleidung muss sauber und in Schwarz, Grau oder Weiß sein.',
        'Haare: Die Haare müssen gewaschen und in einem „friseurwürdigen“ Zustand sein.' ] },
      { t: 'Unzulässige Kleidung', r: [
        'Sportkleidung wie Jogginganzüge sowie jede Art von Kopfbedeckung (z. B. Kappen) sind verboten.' ] } ],
      w: 'Du bist das Aushängeschild des Salons. Gäste schauen dir auf die Haare, deshalb müssen deine eigenen zeigen, dass du dein Handwerk ernst nimmst.' }
  ],
  bestaetigung: 'Ich habe die Verhaltensregeln gelesen und zur Kenntnis genommen!'
};
