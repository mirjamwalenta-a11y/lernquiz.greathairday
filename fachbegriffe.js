// Fachbegriff-Wörterbuch: einfache Erklärung + Übersetzung in 7 Sprachen.
// Für Lehrlinge mit Deutsch als Zweitsprache (Barrierefreiheit).
//
// Zwei Teile:
//  1. Daten (window.FACHBEGRIFFE) – auch für fachbegriffe.html
//  2. Antippen im Quiz: Mit data-ziele eingebunden, werden Fachbegriffe in
//     Fragen und Erklärungen dünn gepunktet unterstrichen. Antippen zeigt
//     Erklärung und Übersetzung.
//       <script src="fachbegriffe.js?v=…" data-ziele="#q-txt ; #q-feedback" defer></script>
//     data-ziele: CSS-Selektoren, getrennt durch „;“. Antwort-Knöpfe NICHT
//     angeben (Antippen würde sonst die Antwort wählen).
//     data-gruppe (optional): CSS-Selektor eines Abschnitts. Ein Begriff wird
//       pro Abschnitt nur einmal unterstrichen (für lange Lern-Seiten).
//     data-max (optional): höchstens so viele Begriffe pro Feld (Standard 5).
//     data-unter (optional): CSS-Selektoren der Fragen, getrennt durch „;“.
//       Ist eine Sprache gewählt, steht unter der Frage eine Zeile mit den
//       Fachbegriffen und ihrer Übersetzung („Oxidant = oksidan · …“).
//     data-nur-uebersetzung (optional): nur Übersetzung zeigen, keine deutsche
//       Erklärung – für Tests (Schnuppertag), damit nichts verraten wird.
//     Nie markiert wird Text in Knöpfen, Links, Chips, Formularfeldern und in
//     allem, was antippbar ist (onclick, data-a, data-act, role=button, tabindex).
//
// Keine Daten am Server. Gemerkt wird nur die gewählte Sprache, im Browser
// (localStorage „fb_sprache“), als Bequemlichkeit.
//
// ÜBERSETZUNGEN: KI-Entwurf (2026-11-16), Korrekturen aus der Durchsicht vom
// 2026-11-16 eingearbeitet (26 Begriffe). Noch NICHT von Muttersprachler:innen
// bestätigt. Sobald eine Sprache gegengelesen ist, hier in GEPRUEFT auf true
// setzen – dann fällt der Hinweis „noch nicht geprüft“ für sie weg.
// Neue Begriffe: [Begriff, 'Formen|im|Text' (für das Erkennen, ohne Endungen
// wie -e/-en/-s), Erklärung in einfachem Deutsch, [en, tr, bks, ar, fa, uk, ro]]
(function () {
  var SPRACHEN = [
    {k: 'en', n: 'Englisch', e: 'English'},
    {k: 'tr', n: 'Türkisch', e: 'Türkçe'},
    {k: 'bs', n: 'BKS', e: 'Bosanski / Hrvatski / Srpski'},
    {k: 'ar', n: 'Arabisch', e: 'العربية', rtl: true},
    {k: 'fa', n: 'Dari / Farsi', e: 'دری / فارسی', rtl: true},
    {k: 'uk', n: 'Ukrainisch', e: 'Українська'},
    {k: 'ro', n: 'Rumänisch', e: 'Română'}
  ];
  var GEPRUEFT = {en: false, tr: false, bs: false, ar: false, fa: false, uk: false, ro: false};

  var B = [
    // ── Haar ──
    ['Haarschaft', 'Haarschaft', 'Der Teil des Haares, den man sieht. Er ist außerhalb der Kopfhaut.',
      ['hair shaft', 'saç gövdesi', 'stablo vlasi', 'ساق الشعرة', 'ساقه مو', 'стрижень волосини', 'tija firului de păr']],
    ['Haarwurzel', 'Haarwurzel', 'Der Teil des Haares, der in der Haut steckt. Dort wächst das Haar.',
      ['hair root', 'saç kökü', 'korijen vlasi', 'جذر الشعرة', 'ریشه مو', 'корінь волосини', 'rădăcina firului de păr']],
    ['Haarfollikel', 'Haarfollikel|Follikel', 'Eine kleine Hülle in der Haut. Darin wächst das Haar.',
      ['hair follicle', 'saç folikülü', 'folikul dlake', 'جريب الشعرة', 'فولیکول مو', 'волосяний фолікул', 'folicul de păr']],
    ['Papille', 'Papille|Haarpapille', 'Sitzt ganz unten in der Haarwurzel. Sie versorgt das Haar mit Nährstoffen aus dem Blut.',
      ['papilla (dermal papilla)', 'papilla (saç papillası)', 'papila', 'الحليمة الجلدية', 'پاپیلای مو', 'сосочок волосини', 'papila']],
    ['Schuppenschicht', 'Schuppenschicht|Kutikula|Cuticula', 'Die äußerste Schicht des Haares. Sie liegt wie Dachziegel übereinander und schützt das Haar.',
      ['cuticle', 'kütikül (pul tabakası)', 'kutikula (vanjski sloj)', 'الطبقة الحرشفية (الكيوتيكل)', 'کوتیکول (لایه فلسی)', 'кутикула', 'cuticula']],
    ['Faserschicht', 'Faserschicht|Kortex|Cortex|Rindenschicht', 'Die mittlere, dickste Schicht des Haares. Hier sitzen die Farbpigmente. Sie macht das Haar fest und elastisch.',
      ['cortex', 'korteks', 'korteks', 'القشرة (الكورتكس)', 'کورتکس', 'кортекс', 'cortex']],
    ['Markschicht', 'Markschicht|Medulla|Haarmark', 'Die innerste Schicht des Haares. Feines Haar hat oft keine.',
      ['medulla', 'medulla (öz)', 'medula (srž)', 'النخاع', 'مدولا (مغز مو)', 'медула (серцевина)', 'medulara']],
    ['Keratin', 'Keratin', 'Ein Eiweiß. Haare und Nägel bestehen hauptsächlich daraus.',
      ['keratin', 'keratin', 'keratin', 'الكيراتين', 'کراتین', 'кератин', 'keratina']],
    ['Melanin', 'Melanin|Eumelanin|Phäomelanin', 'Der natürliche Farbstoff im Haar. Eumelanin macht braun bis schwarz, Phäomelanin rötlich bis gelb.',
      ['melanin', 'melanin', 'melanin', 'الميلانين', 'ملانین', 'меланін', 'melanina']],
    ['Porosität', 'Porosität|porös', 'Wie stark das Haar Wasser und Farbe aufnimmt. Poröses Haar ist geschädigt, die Schuppenschicht steht offen.',
      ['porosity', 'gözeneklilik', 'poroznost', 'المسامية', 'تخلخل مو', 'пористість', 'porozitate']],
    ['Elastizität', 'Elastizität|elastisch', 'Wie weit sich ein nasses Haar dehnen lässt und wieder zurückgeht. Gesundes Haar ist elastisch.',
      ['elasticity', 'esneklik', 'elastičnost', 'المرونة', 'کشسانی', 'еластичність', 'elasticitate']],
    ['Haarstruktur', 'Haarstruktur', 'Wie das Haar beschaffen ist: fein, mittel oder dick, glatt, wellig oder lockig.',
      ['hair texture', 'saç yapısı', 'struktura kose', 'بنية الشعر', 'ساختار مو', 'структура волосся', 'structura părului']],
    ['Wirbel', 'Wirbel|Haarwirbel', 'Eine Stelle, an der die Haare im Kreis wachsen. Wichtig beim Schneiden.',
      ['cowlick (whorl)', 'saç dönmesi (girdap)', 'vrtlog (kose)', 'دوامة الشعر', 'چرخش مو', 'вихор (волосся)', 'vârtej (de păr)']],
    ['Haarausfall', 'Haarausfall|Alopezie', 'Wenn mehr Haare ausfallen als nachwachsen. Fachwort: Alopezie.',
      ['hair loss (alopecia)', 'saç dökülmesi (alopesi)', 'opadanje kose (alopecija)', 'تساقط الشعر', 'ریزش مو', 'випадіння волосся (алопеція)', 'căderea părului (alopecie)']],

    // ── Haut & Kopfhaut ──
    ['Kopfhaut', 'Kopfhaut', 'Die Haut auf dem Kopf, auf der die Haare wachsen.',
      ['scalp', 'saçlı deri', 'vlasište', 'فروة الرأس', 'پوست سر', 'шкіра голови', 'scalp']],
    ['Oberhaut', 'Oberhaut|Epidermis', 'Die oberste Schicht der Haut. Fachwort: Epidermis.',
      ['epidermis', 'epidermis (üst deri)', 'epiderma (pokožica)', 'البشرة', 'اپیدرم (روپوست)', 'епідерміс', 'epiderma']],
    ['Lederhaut', 'Lederhaut|Dermis', 'Die Schicht unter der Oberhaut. Dort sitzen Haarwurzeln, Talgdrüsen und Blutgefäße.',
      ['dermis', 'dermis', 'dermis (koža)', 'الأدمة', 'درم', 'дерма', 'derm']],
    ['Talg', 'Talg|Talgdrüse|Sebum', 'Das natürliche Fett der Haut. Es kommt aus den Talgdrüsen und schützt Haut und Haar.',
      ['sebum', 'sebum (cilt yağı)', 'sebum (loj)', 'الزهم (دهون البشرة)', 'چربی پوست (سبوم)', 'шкірне сало (себум)', 'sebum']],
    ['Seborrhoe', 'Seborrhoe|Seborrhö', 'Die Haut bildet zu viel Talg. Haare und Kopfhaut werden schnell fettig.',
      ['seborrhoea (oily skin)', 'sebore (yağlı deri)', 'seboreja', 'الزهام (دهون زائدة)', 'سبوره (چربی زیاد پوست)', 'себорея', 'seboree']],
    ['Schuppen', 'Kopfschuppen|Schuppen', 'Kleine weiße Hautteilchen von der Kopfhaut, trocken oder fettig.',
      ['dandruff', 'kepek', 'perut', 'قشرة الرأس', 'شوره', 'лупа', 'mătreață']],
    ['Ekzem', 'Ekzem|Kontaktekzem', 'Eine entzündete, rote, juckende Haut. Bei Friseur:innen oft an den Händen, z. B. durch Wasser oder Chemie.',
      ['eczema', 'egzama', 'ekcem', 'الإكزيما', 'اگزما', 'екзема', 'eczemă']],
    ['Läuse', 'Läuse|Kopfläuse|Nissen', 'Kleine Insekten im Haar. Nissen sind ihre Eier. Dann wird nicht behandelt.',
      ['lice', 'bit', 'uši (vaši)', 'القمل', 'شپش', 'воші', 'păduchi']],

    // ── Sicherheit & Hygiene ──
    ['Allergietest', 'Allergietest|Epikutantest|Hauttest', 'Ein Test vor der Farbe: etwas Farbe auf die Haut, 48 Stunden warten. Wird die Haut rot oder juckt, keine Farbe.',
      ['allergy test (patch test)', 'alerji testi (yama testi)', 'test na alergiju (epikutani test)', 'اختبار الحساسية (اختبار الرقعة)', 'تست حساسیت (تست پچ)', 'алерготест (аплікаційна проба)', 'test de alergie (test epicutanat)']],
    ['Kontraindikation', 'Kontraindikation', 'Ein Grund, eine Behandlung NICHT zu machen, z. B. offene Wunden oder eine Allergie.',
      ['contraindication', 'kontrendikasyon', 'kontraindikacija', 'مانع استعمال', 'منع انجام کار (کنترااندیکاسیون)', 'протипоказання', 'contraindicație']],
    ['Desinfektion', 'Desinfektion|desinfizieren|Desinfektionsmittel', 'Krankheitserreger abtöten, z. B. auf Kämmen, Scheren und Händen.',
      ['disinfection', 'dezenfeksiyon', 'dezinfekcija', 'التطهير', 'ضدعفونی', 'дезінфекція', 'dezinfectare']],
    ['Sterilisation', 'Sterilisation|sterilisieren|steril', 'ALLE Keime abtöten, stärker als Desinfektion. Nötig bei Werkzeug, das mit Blut in Kontakt war.',
      ['sterilisation', 'sterilizasyon', 'sterilizacija', 'التعقيم', 'استریل کردن', 'стерилізація', 'sterilizare']],
    ['Hygiene', 'Hygiene|hygienisch', 'Alles, was Sauberkeit und Gesundheit schützt: Hände waschen, Werkzeug reinigen, frische Handtücher.',
      ['hygiene', 'hijyen', 'higijena', 'النظافة الصحية', 'بهداشت', 'гігієна', 'igienă']],
    ['Schutzhandschuhe', 'Schutzhandschuhe|Handschuhe', 'Handschuhe zum Schutz der Haut bei Farbe, Dauerwelle und Nassarbeit.',
      ['protective gloves', 'koruyucu eldiven', 'zaštitne rukavice', 'قفازات واقية', 'دستکش محافظ', 'захисні рукавички', 'mănuși de protecție']],

    // ── Farbe ──
    ['Oxidant', 'Oxidant|Oxidationsmittel|Entwickler|Wasserstoffperoxid|H2O2', 'Die Flüssigkeit, die mit der Farbe gemischt wird. Sie öffnet das Haar und entwickelt die Farbe. Je mehr Prozent, desto stärker.',
      ['developer (hydrogen peroxide)', 'oksidan (hidrojen peroksit)', 'oksidant (hidrogen)', 'المؤكسد (بيروكسيد الهيدروجين)', 'اکسیدان (آب اکسیژنه)', 'окисник (перекис водню)', 'oxidant (apă oxigenată)']],
    ['Oxidationsfarbe', 'Oxidationsfarbe|Coloration', 'Dauerhafte Haarfarbe. Sie wird mit Oxidant gemischt und wäscht sich nicht aus.',
      ['permanent hair colour', 'kalıcı saç boyası', 'trajna boja za kosu', 'صبغة شعر دائمة', 'رنگ موی دائمی', 'стійка фарба для волосся', 'vopsea permanentă']],
    ['Tönung', 'Tönung|Intensivtönung|Toner', 'Farbe, die nicht dauerhaft ist. Sie wäscht sich nach einigen Wochen aus.',
      ['semi-permanent colour (toner)', 'yarı kalıcı boya (ton)', 'preliv (polutrajna boja)', 'صبغة شبه دائمة', 'رنگ نیمه‌دائمی (تونر)', 'тонування', 'nuanțare (vopsea semipermanentă)']],
    ['Farbtiefe', 'Farbtiefe|Tonhöhe|Helligkeitsstufe|Grundton', 'Wie hell oder dunkel eine Farbe ist, von 1 (schwarz) bis 10 (hellstes Blond). Die erste Zahl der Farbnummer.',
      ['level (depth)', 'renk seviyesi (ton derinliği)', 'nivo (dubina) boje', 'درجة اللون (العمق)', 'درجه روشنی رنگ', 'рівень тону (глибина)', 'nivel (profunzime) de culoare']],
    ['Farbrichtung', 'Farbrichtung|Reflex|Nuance', 'Der Farbton, z. B. kupfer, gold oder asch. Die Zahlen nach dem Punkt in der Farbnummer.',
      ['tone (reflect)', 'ton yansıması (nüans)', 'nijansa (refleks)', 'انعكاس اللون', 'ته‌رنگ (انعکاس رنگ)', 'відтінок (рефлекс)', 'reflex (nuanță)']],
    ['Farbkreis', 'Farbkreis', 'Ein Kreis mit allen Farben. Farben, die sich gegenüberliegen, heben sich auf.',
      ['colour wheel', 'renk çemberi', 'krug boja', 'عجلة الألوان', 'چرخه رنگ', 'колірне коло', 'cercul culorilor']],
    ['Komplementärfarbe', 'Komplementärfarbe|Gegenfarbe', 'Die Farbe, die im Farbkreis gegenüber liegt, z. B. Blau zu Orange, Violett zu Gelb.',
      ['complementary colour', 'tamamlayıcı renk', 'komplementarna boja', 'اللون المكمل', 'رنگ مکمل', 'додатковий (комплементарний) колір', 'culoare complementară']],
    ['Neutralisieren', 'neutralisieren|Neutralisation', 'Einen ungewollten Farbton aufheben, mit seiner Gegenfarbe. Z. B. Gelbstich mit Violett.',
      ['neutralise', 'nötrleştirmek', 'neutralizirati', 'معادلة اللون', 'خنثی کردن رنگ', 'нейтралізувати', 'a neutraliza']],
    ['Pigment', 'Pigment|Farbpigment|Naturpigment', 'Kleinste Farbteilchen. Im Haar natürliche (Melanin) oder künstliche aus der Farbe.',
      ['pigment', 'pigment', 'pigment', 'الصباغ (الصبغة)', 'رنگدانه', 'пігмент', 'pigment']],
    ['Blondierung', 'Blondierung|blondieren|Blondiermittel|Bleiche', 'Das Haar stark aufhellen. Dabei werden die natürlichen Pigmente zerstört.',
      ['bleaching (lightening)', 'saç açma (açıcı)', 'blajhanje (posvjetljivanje)', 'تفتيح الشعر (سحب اللون)', 'دکلره (رنگ‌بری مو)', 'блондування (знебарвлення)', 'decolorare']],
    ['Aufhellen', 'aufhellen|Aufhellung', 'Das Haar heller machen, mit Farbe oder Blondierung.',
      ['lightening', 'açmak (renk açma)', 'posvjetljivanje', 'التفتيح', 'روشن کردن', 'освітлення', 'deschiderea culorii']],
    ['Grauabdeckung', 'Grauabdeckung|Grauanteil', 'Wie gut die Farbe graue oder weiße Haare färbt.',
      ['grey coverage', 'beyaz kapatma', 'pokrivanje sijedih', 'تغطية الشيب', 'پوشش موهای سفید', 'зафарбовування сивини', 'acoperirea firelor albe']],
    ['Ansatz', 'Ansatz|Ansatzfarbe|Nachwuchs', 'Das nachgewachsene Haar an der Kopfhaut, noch ohne Farbe.',
      ['roots (regrowth)', 'dip (saç dibi)', 'izrast (korijen)', 'منابت الشعر (الجذور)', 'ریشه (موی تازه)', 'відрослі корені', 'rădăcini (creștere)']],
    ['Längen und Spitzen', 'Längen und Spitzen|Spitzen|Haarspitzen', 'Das Haar ab dem Ansatz bis zum Ende. Die Spitzen sind die Enden, oft am trockensten.',
      ['lengths and ends', 'boylar ve uçlar', 'dužine i vrhovi', 'الأطوال والأطراف', 'ساقه و نوک مو', 'довжина і кінчики', 'lungimi și vârfuri']],
    ['Einwirkzeit', 'Einwirkzeit|Einwirkungszeit', 'Wie lange ein Mittel im Haar bleiben muss, damit es wirkt. Genau einhalten.',
      ['processing time', 'bekleme süresi', 'vrijeme djelovanja', 'مدة التفاعل', 'زمان اثر', 'час витримки', 'timp de acțiune']],
    ['Mischungsverhältnis', 'Mischungsverhältnis', 'Wie viel Farbe und wie viel Oxidant zusammenkommen, z. B. 1 : 1 oder 1 : 2.',
      ['mixing ratio', 'karışım oranı', 'omjer miješanja', 'نسبة الخلط', 'نسبت ترکیب', 'пропорція змішування', 'raport de amestec']],
    ['Vorpigmentieren', 'vorpigmentieren|Vorpigmentierung|Pre-Pigmentation', 'Fehlende Pigmente zuerst ins Haar geben, bevor man dunkler färbt. Sonst wird die Farbe grünlich oder fahl.',
      ['pre-pigmentation', 'ön pigmentleme', 'predpigmentacija', 'التصبيغ المسبق', 'پیش‌رنگ‌دهی', 'препігментація', 'prepigmentare']],
    ['Strähnen', 'Strähnen|Foliensträhnen|Highlights', 'Einzelne Haarpartien, die heller oder anders gefärbt werden, oft mit Folie.',
      ['highlights', 'röfle', 'pramenovi', 'خصل ملونة (هايلايت)', 'هایلایت', 'пасма (мелірування)', 'șuvițe']],
    ['Balayage', 'Balayage', 'Eine Strähnentechnik: Die Farbe wird frei mit dem Pinsel aufgestrichen, für einen weichen, natürlichen Verlauf.',
      ['balayage', 'balyaj', 'balayage', 'البالياج', 'بالیاژ', 'балаяж', 'balayage']],
    ['pH-Wert', 'pH-Wert|pH', 'Zeigt, ob etwas sauer (unter 7) oder alkalisch (über 7) ist. Haut und Haar mögen etwa 4,5 bis 5,5.',
      ['pH value', 'pH değeri', 'pH vrijednost', 'الرقم الهيدروجيني', 'پی‌اچ', 'рівень pH', 'valoarea pH']],
    ['alkalisch', 'alkalisch|Alkali', 'Das Gegenteil von sauer (pH über 7). Alkalische Mittel öffnen die Schuppenschicht.',
      ['alkaline', 'alkali (bazik)', 'alkalno (lužnato)', 'قلوي', 'قلیایی', 'лужний', 'alcalin']],

    // ── Umformung ──
    ['Dauerwelle', 'Dauerwelle|Dauerwellen', 'Das Haar wird dauerhaft gewellt oder gelockt: wickeln, Wellmittel, fixieren.',
      ['perm', 'perma', 'trajna ondulacija', 'التمويج الدائم (البيرم)', 'فر دائم (پرم)', 'хімічна завивка', 'permanent']],
    ['Wickler', 'Wickler|Dauerwellwickler', 'Kleine Rollen, auf die das Haar bei der Dauerwelle gewickelt wird. Die Größe bestimmt die Locke.',
      ['perm rod (curler)', 'bigudi', 'vikleri (uvijači)', 'لفافة الشعر (البكرة)', 'بیگودی', 'бігуді (коклюшка)', 'bigudiu']],
    ['Wellmittel', 'Wellmittel|Umformungsmittel|Dauerwellflüssigkeit', 'Die Flüssigkeit, die das Haar weich macht, damit es die Form der Wickler annimmt.',
      ['perm lotion (waving lotion)', 'perma losyonu', 'sredstvo za trajnu', 'محلول التمويج', 'محلول فر', 'завивальний склад', 'soluție de permanent']],
    ['Fixierung', 'Fixierung|fixieren|Fixiermittel|Fixierer', 'Der letzte Schritt der Dauerwelle. Er macht die neue Form im Haar fest.',
      ['neutralising (fixing)', 'sabitleme (nötralizasyon)', 'fiksiranje', 'التثبيت (المثبت)', 'فیکساتور (تثبیت)', 'фіксація (фіксаж)', 'fixare (neutralizare)']],
    ['Disulfidbrücke', 'Disulfidbrücke|Schwefelbrücke|Doppelschwefelbrücke', 'Feste Verbindungen im Haar. Sie geben die Form. Die Dauerwelle öffnet und schließt sie neu.',
      ['disulphide bond', 'disülfit bağı', 'disulfidna veza', 'الرابطة ثنائية الكبريتيد', 'پیوند دی‌سولفید', 'дисульфідний зв’язок', 'legătură disulfurică']],
    ['Glättung', 'Glättung|glätten|Haarglättung', 'Lockiges oder welliges Haar glatt machen, mit Chemie oder Hitze.',
      ['straightening', 'düzleştirme', 'ravnanje kose', 'فرد الشعر', 'صاف کردن مو', 'випрямлення', 'îndreptare']],
    ['Wasserwelle', 'Wasserwelle|Wasserwellen', 'Wellen, die mit Kamm und Fingern ins nasse Haar gelegt werden.',
      ['finger waves', 'su dalgası (parmak dalgası)', 'vodeni val', 'موجات الأصابع (التمويج المائي)', 'موج انگشتی', 'холодна хвиля', 'ondulație cu apă (valuri cu degetele)']],

    // ── Schnitt & Form ──
    ['Abteilung', 'Abteilung|abteilen|Abteilungen', 'Das Haar in Bereiche teilen, damit man sauber und Schritt für Schritt arbeitet.',
      ['section (sectioning)', 'ayırma (bölme)', 'dijeljenje na sekcije', 'تقسيم الشعر (قسم)', 'بخش‌بندی مو', 'сектор (поділ на зони)', 'secțiune (secționare)']],
    ['Scheitel', 'Scheitel|Mittelscheitel|Seitenscheitel', 'Die Linie, an der das Haar nach zwei Seiten fällt.',
      ['parting', 'saç ayrımı', 'razdjeljak', 'فرق الشعر', 'فرق سر', 'проділ', 'cărare']],
    ['Kontur', 'Kontur|Konturen|Konturenschnitt', 'Der äußere Rand der Frisur, z. B. an Stirn, Ohren und Nacken.',
      ['outline (perimeter)', 'kontür', 'kontura', 'الحدود الخارجية للقصة', 'خط دور (کانتور)', 'контур', 'contur']],
    ['Stufenschnitt', 'Stufenschnitt|Stufenhaarschnitt|Stufung', 'Ein Schnitt, bei dem die Haare oben kürzer und unten länger sind. Gibt Volumen und Bewegung.',
      ['layered cut', 'katlı kesim', 'stepenasto šišanje (slojevi)', 'قصة متدرجة (طبقات)', 'کوتاهی لایه‌ای', 'каскадна стрижка', 'tunsoare în straturi']],
    ['Graduierung', 'Graduierung|graduiert|Graduation', 'Die Haare werden schräg geschnitten, so dass sie aufeinander liegen. Gibt Fülle, z. B. im Nacken beim Bob.',
      ['graduation', 'degrade (gradasyon)', 'graduacija', 'التدرج', 'گرادوئه (تدریجی)', 'градуювання', 'graduare']],
    ['Effilieren', 'effilieren|Effilierschere|Effilation', 'Das Haar ausdünnen, damit es leichter und weicher fällt. Mit Effilierschere oder Messer.',
      ['thinning (texturising)', 'efile (inceltme)', 'stanjivanje (efiliranje)', 'ترقيق الشعر', 'پیتاژ کردن (کم‌پشت کردن مو)', 'філірування', 'efilare']],
    ['Fallrichtung', 'Fallrichtung|Wuchsrichtung', 'In welche Richtung das Haar natürlich fällt oder wächst.',
      ['direction of fall (growth)', 'saçın düşüş (çıkış) yönü', 'smjer pada (rasta) kose', 'اتجاه نمو الشعر', 'جهت ریزش (رشد) مو', 'напрям росту волосся', 'direcția de creștere']],
    ['Oberkopf', 'Oberkopf', 'Der obere Bereich des Kopfes.',
      ['top of the head', 'tepe', 'tjeme', 'أعلى الرأس', 'بالای سر', 'тім’яна зона', 'creștet']],
    ['Hinterkopf', 'Hinterkopf', 'Der hintere, gewölbte Bereich des Kopfes.',
      ['back of the head', 'arka kafa', 'potiljak', 'مؤخرة الرأس', 'پشت سر', 'потилиця', 'partea din spate a capului']],
    ['Nacken', 'Nacken|Nackenbereich|Nackenlinie', 'Der Bereich am Hals unter dem Hinterkopf.',
      ['nape', 'ense', 'zatiljak', 'مؤخرة العنق', 'پس گردن', 'шия (зона шиї)', 'ceafă']],
    ['Gesichtsform', 'Gesichtsform', 'Die Form des Gesichts, z. B. oval, rund, eckig. Der Schnitt soll dazu passen.',
      ['face shape', 'yüz şekli', 'oblik lica', 'شكل الوجه', 'فرم صورت', 'форма обличчя', 'forma feței']],
    ['Hochsteckfrisur', 'Hochsteckfrisur|Hochstecken', 'Eine Frisur, bei der das Haar nach oben genommen und festgesteckt wird.',
      ['updo', 'topuz (toplama saç)', 'podignuta frizura (punđa)', 'تسريحة مرفوعة', 'شینیون', 'зачіска з підібраним волоссям', 'coafură prinsă (coc)']],
    ['Rundbürste', 'Rundbürste', 'Eine runde Bürste zum Föhnen. Gibt Volumen und Schwung.',
      ['round brush', 'yuvarlak fön fırçası', 'okrugla četka', 'فرشاة دائرية', 'برس گرد', 'кругла щітка (брашинг)', 'perie rotundă']],
    ['Föhnen', 'föhnen|Föhnfrisur', 'Das Haar mit dem Föhn trocknen und in Form bringen.',
      ['blow-drying', 'fön çekmek', 'feniranje', 'تجفيف الشعر بالسشوار', 'سشوار کشیدن', 'укладання феном', 'coafat cu foehnul']],
    ['Rasiermesser', 'Rasiermesser|Rasur', 'Ein sehr scharfes Messer für Rasur und Konturen. Nach jedem Gast neue Klinge.',
      ['straight razor (shaving)', 'ustura (tıraş)', 'britva (brijanje)', 'موس الحلاقة (الحلاقة)', 'تیغ (اصلاح صورت)', 'небезпечна бритва (гоління)', 'brici (bărbierit)']],

    // ── Pflege & Produkte ──
    ['Spülung', 'Spülung|Conditioner', 'Pflege nach dem Shampoo. Sie schließt die Schuppenschicht, das Haar lässt sich leichter kämmen.',
      ['conditioner', 'saç kremi', 'regenerator', 'البلسم', 'نرم‌کننده مو', 'кондиціонер', 'balsam']],
    ['Haarkur', 'Haarkur|Kur|Haarmaske', 'Intensive Pflege für trockenes oder geschädigtes Haar. Wirkt länger ein als eine Spülung.',
      ['hair treatment (mask)', 'saç bakım maskesi', 'maska (tretman) za kosu', 'ماسك الشعر', 'ماسک مو', 'маска для волосся', 'mască (tratament) de păr']],
    ['Tenside', 'Tensid|Tenside', 'Die waschaktiven Stoffe im Shampoo. Sie lösen Fett und Schmutz.',
      ['surfactants', 'yüzey aktif maddeler', 'tenzidi', 'المواد الخافضة للتوتر السطحي', 'مواد شوینده (سورفکتانت)', 'ПАР (поверхнево-активні речовини)', 'agenți tensioactivi']],

    // ── Beratung ──
    ['Beratungsgespräch', 'Beratungsgespräch|Beratung', 'Das Gespräch vor der Arbeit: Was wünscht die Kundin, was passt zu ihr, was ist möglich?',
      ['consultation', 'danışmanlık görüşmesi', 'konsultacija (savjetovanje)', 'جلسة الاستشارة', 'مشاوره', 'консультація', 'consultație']],
    ['Haardiagnose', 'Haardiagnose|Diagnose|Haaranalyse', 'Haar und Kopfhaut genau ansehen und prüfen, bevor man arbeitet.',
      ['hair analysis', 'saç analizi', 'analiza kose', 'تحليل الشعر', 'بررسی مو', 'діагностика волосся', 'diagnosticul părului']],
    ['Kundenkartei', 'Kundenkartei|Kundenkarte', 'Hier steht, was bei einer Kundin gemacht wurde, z. B. die Farbrezeptur.',
      ['client record card', 'müşteri kartı', 'karton klijenta', 'بطاقة العميل', 'پرونده مشتری', 'картка клієнта', 'fișa clientului']],
    ['Rezeptur', 'Rezeptur|Farbrezeptur', 'Die genaue Mischung: welche Farbe, wie viel, welcher Oxidant, wie lange.',
      ['formula (colour formula)', 'formül (renk formülü)', 'receptura (formula boje)', 'التركيبة (وصفة اللون)', 'فرمول رنگ', 'рецептура (формула фарбування)', 'rețetă (formula culorii)']],

    // ── Hände & Nägel ──
    ['Maniküre', 'Maniküre', 'Pflege der Hände und Fingernägel.',
      ['manicure', 'manikür', 'manikura', 'المانيكير (العناية بالأظافر)', 'مانیکور', 'манікюр', 'manichiură']],
    ['Nagelhaut', 'Nagelhaut', 'Die dünne Haut am Rand des Nagels. Sie schützt vor Keimen.',
      ['cuticle (nail)', 'tırnak eti', 'zanoktica', 'جلدة الظفر', 'کوتیکول ناخن', 'кутикула нігтя', 'cuticula unghiei']],
    ['Nagelmöndchen', 'Nagelmöndchen|Lunula', 'Der helle Halbmond unten am Nagel. Fachwort: Lunula.',
      ['lunula', 'tırnak ayı (lunula)', 'lunula (polumjesec)', 'هلال الظفر', 'هلال ناخن', 'лунка нігтя', 'lunula']]
  ];

  var LISTE = B.map(function (b, i) {
    var t = {};
    SPRACHEN.forEach(function (s, j) { t[s.k] = b[3][j]; });
    return {i: i, w: b[0], formen: b[1].split('|'), e: b[2], t: t};
  });
  window.FACHBEGRIFFE = {liste: LISTE, sprachen: SPRACHEN, geprueft: GEPRUEFT};

  // ── Sprache merken (nur Bequemlichkeit, im Browser) ─────────────────
  function spracheHolen() { try { return localStorage.getItem('fb_sprache') || ''; } catch (e) { return ''; } }
  function spracheSetzen(k) { try { localStorage.setItem('fb_sprache', k); } catch (e) {} }
  // ── Übersetzung vorlesen (Stimme des Geräts in der jeweiligen Sprache) ──
  var STIMM_LANG = {en: ['en-GB', 'en-US', 'en'], tr: ['tr'], bs: ['bs', 'hr', 'sr'], ar: ['ar'], fa: ['fa'], uk: ['uk'], ro: ['ro']};
  function stimmeFuer(k) {
    if (!('speechSynthesis' in window)) return null;
    var alle = speechSynthesis.getVoices() || [], pref = STIMM_LANG[k] || [k];
    for (var i = 0; i < pref.length; i++) {
      for (var j = 0; j < alle.length; j++) if (alle[j].lang.toLowerCase().replace('_', '-').indexOf(pref[i].toLowerCase()) === 0) return alle[j];
    }
    return null;
  }
  // Taste nur zeigen, wenn das Gerät die Sprache sprechen kann. Sind die
  // Stimmen noch nicht geladen (leere Liste), Taste zeigen und beim Antippen prüfen.
  function kannSprechen(k) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return false;
    return !(speechSynthesis.getVoices() || []).length || !!stimmeFuer(k);
  }
  function sprichFremd(text, k) {
    var v = stimmeFuer(k);
    if (!v) { alert('Dieses Handy hat keine Stimme für diese Sprache.'); return; }
    try { speechSynthesis.cancel(); } catch (e) {}
    var u = new SpeechSynthesisUtterance(String(text).replace(/[()]/g, ', '));
    u.lang = v.lang; u.rate = 0.9;
    try { u.voice = v; } catch (e) {}
    speechSynthesis.speak(u);
  }
  window.FACHBEGRIFFE.spracheHolen = spracheHolen;
  window.FACHBEGRIFFE.spracheSetzen = spracheSetzen;

  // ── Antippen im Quiz ───────────────────────────────────────────────
  var skript = document.currentScript;
  var ziele = ((skript && skript.getAttribute('data-ziele')) || '').split(';').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!ziele.length) return;

  // Ein großer Ausdruck aus allen Formen, längste zuerst (z. B. „Haarwurzel“ vor „Wurzel“).
  // Endungen -e/-en/-n/-s/-es/-er/-ern sind erlaubt. Kein Buchstabe davor/danach.
  var FORM_ZU = {};
  var formen = [];
  LISTE.forEach(function (b) { b.formen.forEach(function (f) { FORM_ZU[f.toLowerCase()] = b; formen.push(f); }); });
  formen.sort(function (a, b) { return b.length - a.length; });
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var RE = new RegExp('(^|[^\\p{L}\\d])(' + formen.map(esc).join('|') + ')(?:e|en|n|s|es|er|ern)?(?![\\p{L}\\d])', 'giu');
  var MAX_PRO_FELD = Number((skript && skript.getAttribute('data-max')) || 5) || 5;
  var GRUPPE = (skript && skript.getAttribute('data-gruppe')) || '';
  // Im Schnuppertag-Test (auch das eingebettete Mischlabor: ?von=schnuppertag) nur übersetzen
  var NUR_UE = !!(skript && skript.hasAttribute('data-nur-uebersetzung')) || /[?&]von=schnuppertag\b/.test(location.search);
  var NICHT = '.fb-w, button, a, label, summary, textarea, input, select, option, script, style, svg, .vl-btn, ' +
    '[contenteditable], [onclick], [data-a], [data-act], [role="button"], [tabindex]:not([tabindex="-1"]), .chip, .fb-blatt, .fb-begriffe';

  var css =
    '.fb-w{text-decoration:underline dotted #896C32;text-decoration-thickness:1.5px;text-underline-offset:3px;cursor:help}' +
    '.fb-w:focus-visible{outline:2px solid #896C32;outline-offset:1px;border-radius:2px}' +
    '.fb-blatt{position:fixed;left:0;right:0;bottom:0;z-index:990;display:flex;justify-content:center;padding:0 8px calc(8px + env(safe-area-inset-bottom,0px))}' +
    '.fb-blatt[hidden]{display:none}' +
    '.fb-karte{width:100%;max-width:560px;max-height:70vh;overflow:auto;background:#fff;border:1.5px solid #896C32;border-radius:14px;padding:14px 16px;box-shadow:0 -4px 24px rgba(33,29,23,.18);font-family:Poppins,system-ui,sans-serif;color:#211D17;text-align:left}' +
    '.fb-kopf{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}' +
    '.fb-kopf b{font-size:17px;line-height:1.3}' +
    '.fb-zu{border:none;background:none;font-size:22px;line-height:1;color:#6B6455;cursor:pointer;padding:0 2px;min-width:32px;min-height:32px}' +
    '.fb-e{font-size:14px;line-height:1.5;margin:6px 0 10px}' +
    '.fb-ue{background:#F3EBD9;border-radius:10px;padding:10px 12px;margin-bottom:8px}' +
    '.fb-ue small{display:block;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6B6455;margin-bottom:2px}' +
    '.fb-ue span{font-size:16px;font-weight:600}' +
    '.fb-sag{border:1.5px solid #E4DBC5;background:#fff;color:#896C32;border-radius:50%;width:32px;height:32px;font-size:14px;line-height:1;cursor:pointer;padding:0;vertical-align:middle;margin-inline-start:8px;flex:none}' +
    '.fb-ue-in{display:flex;align-items:center;justify-content:space-between;gap:8px}' +
    '.fb-begriffe{font-size:12px;line-height:1.5;opacity:.8;margin:2px 0 8px;font-weight:400}' +
    '.fb-begriffe b{font-weight:600}' +
    '.fb-zeile{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:12px;color:#6B6455}' +
    '.fb-zeile select{font:inherit;font-size:13px;padding:6px 8px;border:1px solid #E4DBC5;border-radius:6px;background:#fff;color:#211D17;width:auto}' +
    '.fb-alle{margin-top:8px;font-size:13px}' +
    '.fb-alle summary{cursor:pointer;color:#896C32;font-weight:600;font-size:12px}' +
    '.fb-alle dl{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;margin-top:6px}' +
    '.fb-alle dt{color:#6B6455;font-size:12px}' +
    '.fb-alle dd{margin:0}' +
    '.fb-ue span[dir="rtl"],.fb-alle dd[dir="rtl"]{display:block;text-align:right}' +
    '.fb-hinweis{font-size:11px;color:#9A9188;margin-top:8px}' +
    '@media print{.fb-blatt{display:none}.fb-w{text-decoration:none}}';

  function markieren(el) {
    var gesamt = el.textContent;
    if (el.getAttribute('data-fb') === String(gesamt.length) + ':' + gesamt.slice(0, 40)) return;
    // Schon markierte Begriffe mitzählen (z. B. wenn die Seite nur etwas anhängt)
    var schon = {}, anzahl = 0;
    el.querySelectorAll('.fb-w').forEach(function (w) { schon[w.getAttribute('data-fb-i')] = true; anzahl++; });
    // Mit data-gruppe: im ganzen Abschnitt schon markierte Begriffe nicht nochmal
    var gr = GRUPPE && el.closest(GRUPPE);
    if (gr) gr.querySelectorAll('.fb-w').forEach(function (w) { schon[w.getAttribute('data-fb-i')] = true; });
    var gehen = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || p.closest(NICHT)) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var knoten = [];
    while (gehen.nextNode()) knoten.push(gehen.currentNode);
    knoten.forEach(function (n) {
      if (anzahl >= MAX_PRO_FELD) return;
      var text = n.nodeValue, teile = [], zuletzt = 0, m;
      RE.lastIndex = 0;
      while ((m = RE.exec(text)) && anzahl < MAX_PRO_FELD) {
        var b = FORM_ZU[m[2].toLowerCase()];
        if (!b || schon[b.i]) continue;
        schon[b.i] = true; anzahl++;
        var start = m.index + m[1].length, wort = m[0].slice(m[1].length);
        teile.push(document.createTextNode(text.slice(zuletzt, start)));
        var s = document.createElement('span');
        s.className = 'fb-w'; s.textContent = wort;
        s.setAttribute('data-fb-i', String(b.i));
        s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0');
        s.setAttribute('aria-label', wort + ': Fachbegriff erklären');
        teile.push(s);
        zuletzt = start + wort.length;
      }
      if (!teile.length) return;
      teile.push(document.createTextNode(text.slice(zuletzt)));
      var frag = document.createDocumentFragment();
      teile.forEach(function (t) { frag.appendChild(t); });
      n.parentNode.replaceChild(frag, n);
    });
    el.setAttribute('data-fb', String(el.textContent.length) + ':' + el.textContent.slice(0, 40));
  }
  // ── Begriffe-Zeile unter der Frage (nur mit gewählter Sprache) ──────
  var UNTER = ((skript && skript.getAttribute('data-unter')) || '').split(';').map(function (x) { return x.trim(); }).filter(Boolean);
  function begriffeIn(text) {
    var gef = [], schon = {}, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(text)) && gef.length < 6) {
      var b = FORM_ZU[m[2].toLowerCase()];
      // Das Wort so zeigen, wie es in der Frage steht („Handschuhe“, nicht „Schutzhandschuhe“)
      if (b && !schon[b.i]) { schon[b.i] = true; gef.push({b: b, wort: m[0].slice(m[1].length)}); }
    }
    return gef;
  }
  function zeileFuer(el, spr) {
    var nb = el.nextElementSibling, alt = nb && nb.classList.contains('fb-begriffe') ? nb : null;
    var k = el.cloneNode(true);
    k.querySelectorAll('.vl-btn, button').forEach(function (x) { x.remove(); });
    var liste = spr ? begriffeIn(k.textContent) : [];
    var html = liste.map(function (x) {
      return '<b>' + escHtml(x.wort) + '</b> = <bdi lang="' + spr.k + '">' + escHtml(x.b.t[spr.k]) + '</bdi>';
    }).join(' · ');
    if (!html) { if (alt) alt.remove(); return; }
    if (alt && alt.getAttribute('data-html') === html) return;   // nichts geändert: kein neuer Umbau
    var z = alt || document.createElement('div');
    z.className = 'fb-begriffe';
    z.style.color = getComputedStyle(el).color;   // Farbe der Frage (z. B. hell auf dunkler Karte)
    z.setAttribute('data-html', html);
    z.setAttribute('aria-label', 'Fachbegriffe in der Frage, übersetzt');
    z.innerHTML = html;
    if (!alt) el.parentNode.insertBefore(z, el.nextSibling);
  }
  function alleZeilen() {
    if (!UNTER.length) return;
    var sp = spracheHolen(), spr = SPRACHEN.filter(function (x) { return x.k === sp; })[0] || null;
    UNTER.forEach(function (sel) { try { document.querySelectorAll(sel).forEach(function (el) { zeileFuer(el, spr); }); } catch (e) {} });
  }

  function alleMarkieren() {
    ziele.forEach(function (sel) {
      try { document.querySelectorAll(sel).forEach(markieren); } catch (e) {}
    });
  }

  // ── Erklär-Blatt unten ─────────────────────────────────────────────
  var blatt = null, aktiv = null, vorher = null;
  function escHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]; }); }
  function zeigen(b) {
    aktiv = b;
    if (!blatt) {
      blatt = document.createElement('div');
      blatt.className = 'fb-blatt'; blatt.hidden = true;
      blatt.setAttribute('role', 'dialog'); blatt.setAttribute('aria-label', 'Fachbegriff');
      blatt.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (ev.target.closest('.fb-zu')) zu();
        var sag = ev.target.closest('.fb-sag');
        if (sag && aktiv) sprichFremd(aktiv.t[sag.getAttribute('data-sag')], sag.getAttribute('data-sag'));
      });
      blatt.addEventListener('change', function (ev) {
        if (ev.target.classList.contains('fb-sprache')) { spracheSetzen(ev.target.value); zeigen(aktiv); alleZeilen(); }
      });
      document.body.appendChild(blatt);
    }
    var sp = spracheHolen(), spr = SPRACHEN.filter(function (s) { return s.k === sp; })[0];
    var h = '<div class="fb-karte"><div class="fb-kopf"><b>' + escHtml(b.w) + '</b><button type="button" class="fb-zu" aria-label="Schließen">×</button></div>' +
      (NUR_UE ? (spr ? '' : '<p class="fb-e">Wähle unten deine Sprache, dann siehst du hier die Übersetzung.</p>')
              : '<p class="fb-e">' + escHtml(b.e) + '</p>');
    if (spr) {
      h += '<div class="fb-ue"><small>' + escHtml(spr.n) + '</small><div class="fb-ue-in"><span lang="' + spr.k + '"' + (spr.rtl ? ' dir="rtl"' : '') + '>' + escHtml(b.t[spr.k]) + '</span>' +
        (kannSprechen(spr.k) ? '<button type="button" class="fb-sag" data-sag="' + spr.k + '" aria-label="Auf ' + escHtml(spr.n) + ' vorlesen">🔊</button>' : '') + '</div></div>';
    }
    h += '<div class="fb-zeile"><label>Meine Sprache: <select class="fb-sprache"><option value="">– wählen –</option>' +
      SPRACHEN.map(function (s) { return '<option value="' + s.k + '"' + (s.k === sp ? ' selected' : '') + '>' + escHtml(s.n + ' · ' + s.e) + '</option>'; }).join('') +
      '</select></label></div>' +
      '<details class="fb-alle"><summary>Alle Sprachen</summary><dl>' +
      SPRACHEN.map(function (s) { return '<dt>' + escHtml(s.n) + (kannSprechen(s.k) ? '<button type="button" class="fb-sag" data-sag="' + s.k + '" aria-label="Auf ' + escHtml(s.n) + ' vorlesen">🔊</button>' : '') + '</dt><dd lang="' + s.k + '"' + (s.rtl ? ' dir="rtl"' : '') + '>' + escHtml(b.t[s.k]) + '</dd>'; }).join('') +
      '</dl></details>';
    var offen = SPRACHEN.filter(function (s) { return !GEPRUEFT[s.k]; });
    if (offen.length) h += '<div class="fb-hinweis">KI-Übersetzung, noch nicht geprüft' + (offen.length < SPRACHEN.length ? ' (' + offen.map(function (s) { return s.n; }).join(', ') + ')' : '') + '.</div>';
    // Kein Link zur Wörterbuch-Seite: mitten im Quiz ginge sonst die Runde verloren
    h += '</div>';
    blatt.innerHTML = h;
    blatt.hidden = false;
    blatt.querySelector('.fb-zu').focus();
  }
  function zu() {
    if (!blatt || blatt.hidden) return;
    blatt.hidden = true; aktiv = null;
    if (vorher && vorher.isConnected) vorher.focus();
  }

  // Ein Handler für alle Begriffe (übersteht innerHTML-Umbauten der Seiten)
  document.addEventListener('click', function (ev) {
    var w = ev.target && ev.target.closest && ev.target.closest('.fb-w');
    if (w) {
      ev.preventDefault(); ev.stopPropagation();
      vorher = w; zeigen(LISTE[Number(w.getAttribute('data-fb-i'))]);
      return;
    }
    if (blatt && !blatt.hidden && !(ev.target.closest && ev.target.closest('.fb-blatt'))) zu();
  }, true);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { zu(); return; }
    var w = ev.target && ev.target.classList && ev.target.classList.contains('fb-w') ? ev.target : null;
    if (w && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); vorher = w; zeigen(LISTE[Number(w.getAttribute('data-fb-i'))]); }
  });

  function start() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    alleMarkieren();
    alleZeilen();
    var geplant = false;
    new MutationObserver(function (liste) {
      // Eigene Änderungen (Blatt) nicht beachten
      if (liste.every(function (m) { return blatt && blatt.contains(m.target); })) return;
      if (geplant) return;
      geplant = true;
      requestAnimationFrame(function () { geplant = false; alleMarkieren(); alleZeilen(); });
    }).observe(document.body, {childList: true, subtree: true, characterData: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
