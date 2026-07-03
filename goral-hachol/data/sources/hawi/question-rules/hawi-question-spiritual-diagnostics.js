/**
 * מקור: أحكام السحر والمس والحسد في علم الرمل
 * מקור מאושר: raml-spiritual-diagnostics-sihr-mass-hasad.js (approved-raml-sources)
 * עמודים גלויים: 56–57 (מסך מאושר על ידי המשתמש)
 *
 * דיני אבחון רוחני: כישוף, מס/אחיזה, קנאה/עין, ג׳ין
 * כולל: כישוף לפי בית+צורה, סוג ג׳ין (15×4), שיבוץ 7×7, אבחון איברים (8×6)
 */

export const HAWI_QUESTION_SPIRITUAL_DIAGNOSTICS = {
  id: 'hawi-question-spiritual-diagnostics',
  sourceBook: 'أحكام السحر والمس والحسد في علم الرمل',
  sourceTitleHebrew: 'דיני כישוף, מס/אחיזה וקנאה במדע הרמל',
  sourceGroup: 'approved-raml-sources',
  sourceSectionHebrew: 'אבחון רוחני — כישוף, אחיזה, קנאה/עין, ג׳ין — עמ\' 56–57',
  sourcePages: [56, 57],
  extractionStatus: 'sourceExact-complete',

  diagnosticHouseMap: [
    { house: 1, hebrewRole: 'החולה / השואל', meaningHebrew: 'בית 1 מייצג את החולה עצמו, מצבו הנפשי, עצביו ובריאותו הכללית.' },
    { house: 4, hebrewRole: 'התרופה', meaningHebrew: 'בית 4 הוא בית התרופה.' },
    { house: 6, hebrewRole: 'בית המחלה', meaningHebrew: 'בית 6 הוא בית המחלה, וממנו נלמדים דיני כישוף/מחלה רבים.' },
    { house: 8, hebrewRole: 'בית המוות / הגוף', meaningHebrew: 'בית 8 הוא בית המוות. יחד עם בית 6 מלמד על סוג המחלה הגופנית לפי היסוד השולט.' },
    { house: 9, hebrewRole: 'המכשף', meaningHebrew: 'בית 9 הוא בית המכשף והעוסקים בכישוף, ג׳ין וחיזוי.' },
    { house: 10, hebrewRole: 'הרופא או המטפל', meaningHebrew: 'בית 10 הוא הרופא, המטפל או מי שמטפל במצב.' },
    { house: 12, hebrewRole: 'בית האויבים', meaningHebrew: 'בית 12 הוא בית האויבים ומקור אפשרי לפגיעה מצד אויב.' },
  ],

  rules: [
    {
      id: 'spiritual-rule-1-aqla-saturn-sorceress',
      order: 1,
      arabicText: [
        'السحر منسوب لزحل',
        'وخصوصا شكل العقلة هي تدل على المرأة الساحرة'
      ],
      hebrewTranslation: [
        'הכישוף מיוחס לזֻחַל / שבתאי.',
        'ובייחוד צורת סוהר[] מורה על אישה מכשפת.'
      ],
      houses: [],
      figures: ['1221'],
      technicalTerms: ['السحر', 'زحل', 'العقلة', 'المرأة الساحرة'],
      rule: 'כישוף=שבתאי; סוהר=אישה מכשפת.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-2-ijtima-bad-sorcerer-house9',
      order: 2,
      arabicText: [
        'وشكل الاجتماع يدل على الساحر السيء الرديء',
        'والبيت التاسع في الرمل يدل على السحرة والشيوخ والروحانيين والذين يعملون في أمور السحر والجن والعرافة والكهانة والشعوذة'
      ],
      hebrewTranslation: [
        'צורת חיבור[] מורה על מכשף רע ופגום.',
        'בית 9 ברמל מורה על מכשפים, שייח׳ים/אנשי רוח, רוחניים, ועל העוסקים בכישוף, ג׳ין, ניחוש, ניבוי וכשפים עממיים.'
      ],
      houses: [9],
      figures: ['2112'],
      technicalTerms: ['الاجتماع', 'الساحر السيء', 'البيت التاسع', 'السحر', 'الجن', 'العرافة', 'الكهانة'],
      rule: 'חיבור=מכשף רע; ב9=בית המכשפים, הג׳ין, הניחוש.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-3-nakis-house6-buried-grave-magic',
      order: 3,
      arabicText: [
        'الأنكيس في السادس فهو مدفون له سحر في قبر'
      ],
      hebrewTranslation: [
        'שפל ראש[] בבית 6 — קבור לו כישוף בקבר.'
      ],
      houses: [6],
      figures: ['2221'],
      technicalTerms: ['الأنكيس', 'البيت السادس', 'مدفون', 'سحر', 'قبر'],
      rule: 'שפל ראש בב6 = כישוף קבור בקבר.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-4-judla-house6-drunk-magic',
      order: 4,
      arabicText: [
        'الجودلة في السادس فهو سحر مشروب'
      ],
      hebrewTranslation: [
        'נלחם[] בבית 6 — זהו כישוף שנשתה.'
      ],
      houses: [6],
      figures: ['1121'],
      technicalTerms: ['الجودلة', 'البيت السادس', 'سحر مشروب'],
      rule: 'נלחם בב6 = כישוף שנכנס דרך שתייה.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-5-judla-house12-bound-from-wife',
      order: 5,
      arabicText: [
        'الجودلة في الثاني عشر بيت الأعداء فهو مربوط عن زوجته'
      ],
      hebrewTranslation: [
        'נלחם[] בבית 12, בית האויבים — הוא קשור/חסום מאשתו.'
      ],
      houses: [12],
      figures: ['1121'],
      technicalTerms: ['الجودلة', 'الثاني عشر', 'بيت الأعداء', 'مربوط عن زوجته'],
      rule: 'נלחם בב12 = קשירה זוגית — חסום מאשתו.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-6-qabd-dakhil-house6-bound-from-women',
      order: 6,
      arabicText: [
        'القبض الداخل في السادس فهو معقود ومربوط عن النساء'
      ],
      hebrewTranslation: [
        'ממון נכנס[] בבית 6 — הוא קשור וחסום מן הנשים.'
      ],
      houses: [6],
      figures: ['2121'],
      technicalTerms: ['القبض الداخل', 'البيت السادس', 'معقود', 'مربوط عن النساء'],
      rule: 'ממון נכנס בב6 = קשירה/חסימה בענייני נשים וזוגיות.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-7-hayyan-house10-also-bewitched',
      order: 7,
      arabicText: [
        'الأحيان في العاشر فهو أيضا مسحور'
      ],
      hebrewTranslation: [
        'נשוא ראש[] בבית 10 — גם הוא מכושף.'
      ],
      houses: [10],
      figures: ['1222'],
      technicalTerms: ['الأحيان', 'البيت العاشر', 'مسحور'],
      rule: 'נשוא ראש בב10 = סימן כישוף נוסף, אף שהוא בבית המטפל/העשירי.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-8-aqla-house13-bound-sprinkled',
      order: 8,
      arabicText: [
        'العقلة في الثالث عشر فهو معقود له سحر ومرشوش له أيضا'
      ],
      hebrewTranslation: [
        'סוהר[] בבית 13 — הוא קשור; יש לו כישוף, וגם נזרק/פוזר עליו דבר.'
      ],
      houses: [13],
      figures: ['1221'],
      technicalTerms: ['العقلة', 'الثالث عشر', 'معقود', 'سحر', 'مرشوش'],
      rule: 'סוהר בב13 = קשירה + כישוף + פיזור/ריסוס חומר עליו.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-9-aqla-house14-house-magic',
      order: 9,
      arabicText: [
        'العقلة في الرابع عشر فإن بيته في سحر أو معلق له سحر في البيت أو المكان الذي تضرب عليه وتسأل عنه'
      ],
      hebrewTranslation: [
        'סוהר[] בבית 14 — ביתו בכישוף, או שיש כישוף תלוי בבית/במקום שעליו שואלים.'
      ],
      houses: [14],
      figures: ['1221'],
      technicalTerms: ['العقلة', 'الرابع عشر', 'سحر', 'معلق', 'البيت أو المكان'],
      rule: 'סוהר בב14 = כישוף בבית, בחדר, או במקום השאלה.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-10-jamaa-from-two-humra-severe-envy',
      order: 10,
      arabicText: [
        'انتشاء الجماعة من حمّرتين فهو محسود حسد شديد جدا جدا'
      ],
      hebrewTranslation: [
        'היווצרות קהלה[] משתי אדומות[] — הוא מקונא בקנאה חזקה מאוד מאוד.'
      ],
      houses: [],
      figures: ['2222', '2122'],
      technicalTerms: ['انتشاء الجماعة', 'حمرتين', 'محسود', 'حسد شديد'],
      rule: 'קהלה שנוצרה משתי אדומות = קנאה חזקה מאוד.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-11-jamaa-from-two-nakis-two-buried-magics',
      order: 11,
      arabicText: [
        'انتشاء الجماعة من أنكيسين فهو مدفون له سحرين لا محالة وأزود من ذلك ويجدد له الساحر السحر كل فترة'
      ],
      hebrewTranslation: [
        'היווצרות קהלה[] משני שפל ראש[] — קבורים לו שני כישפים בלי ספק, ואף יותר; והמכשף מחדש לו את הכישוף בכל תקופה.'
      ],
      houses: [],
      figures: ['2222', '2221'],
      technicalTerms: ['انتشاء الجماعة', 'أنكيسين', 'سحرين مدفونين', 'يجدد السحر'],
      rule: 'קהלה משני שפל ראש = שני כישפים קבורים + חידוש תקופתי.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-12-jamaa-house6-umm-sibyan',
      order: 12,
      arabicText: [
        'إذا جاءت الجماعة في السادس فهي عندها تابعة أم الصبيان تمنع وتعطل زواجها ولو تزوجت لا تنجب ولو حملت تسقط حملها ولو أنجبت تصيب أطفالها'
      ],
      hebrewTranslation: [
        'אם קהלה[] באה בבית 6 — יש אצלה תַאבִּעַה / אם הצביאן; מונעת ומשבשת נישואיה; אם תינשא לא תלד; אם תיכנס להריון תפיל; ואם תלד — פוגע בילדיה.'
      ],
      houses: [6],
      figures: ['2222'],
      technicalTerms: ['الجماعة', 'البيت السادس', 'تابعة', 'أم الصبيان', 'تمنع الزواج', 'لا تنجب', 'إسقاط الحمل'],
      rule: 'קהלה בב6 = תאבּעה / אם הצביאן; עיכוב נישואין, עקרות, הפלה, פגיעה בילדים.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-13-judla-house13-confused-magic',
      order: 13,
      arabicText: [
        'الجودلة في الثالث عشر فهو مدعوم وله سحر مشوش'
      ],
      hebrewTranslation: [
        'נלחם[] בבית 13 — יש לו כישוף מבולבל/מעורבב.'
      ],
      houses: [13],
      figures: ['1121'],
      technicalTerms: ['الجودلة', 'الثالث عشر', 'سحر مشوش'],
      rule: 'נלחם בב13 = כישוף מבולבל ומעורבב.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-14-judla-house14-hanging-magic-in-house',
      order: 14,
      arabicText: [
        'الجودلة في الرابع عشر فبيته فيه سحر معلق أو في المكان أو البيت'
      ],
      hebrewTranslation: [
        'נלחם[] בבית 14 — ביתו יש בו כישוף תלוי, או במקום הבית.'
      ],
      houses: [14],
      figures: ['1121'],
      technicalTerms: ['الجودلة', 'الرابع عشر', 'سحر معلق', 'البيت أو المكان'],
      rule: 'נלחם בב14 = כישוף תלוי בבית, בחדר, או במקום שבו החולה נמצא.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-15-nakis-house6-buried-ground-magic',
      order: 15,
      arabicText: [
        'المنكوس في السادس فهو سحر مدفون في الأرض'
      ],
      hebrewTranslation: [
        'שפל ראש[] בבית 6 — זהו כישוף קבור בקרקע.'
      ],
      houses: [6],
      figures: ['2221'],
      technicalTerms: ['المنكوس', 'البيت السادس', 'سحر مدفون في الأرض'],
      rule: 'שפל ראש בב6 (גרסה מורחבת) = כישוף קבור באדמה, לא רק בקבר.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-16-jinn-type-by-15x4',
      order: 16,
      arabicText: [
        'نوعية الجن التي تؤذي المريض وتسلط عليه 15×4',
        'لو كان شكل ناري فهو من الجن الأحمر',
        'ولو ترابي فهو لمسه أرضية أو مس سفلي',
        'ولو هوائي فهو مس طيار',
        'ولو مائي فهو من جن غواص'
      ],
      hebrewTranslation: [
        'סוג הג׳ין המזיק לחולה — נבדק בשיטת 15×4:',
        'צורה אשית → ג׳ין אדום.',
        'צורה עפרית → מגע/מס ארצי או תחתון.',
        'צורה אווירית → מס מעופף / ג׳ין מעופף.',
        'צורה מימית → ג׳ין צולל/מימי.'
      ],
      houses: [15],
      figures: [],
      technicalTerms: ['نوعية الجن', '15×4', 'ناري', 'ترابي', 'هوائي', 'مائي', 'الجن الأحمر', 'مس طيار', 'جن غواص'],
      rule: 'שיטת 15×4: יסוד הצורה → אש=ג׳ין אדום; עפר=מס ארצי/תחתון; אוויר=מעופף; מים=צולל.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-17-jamaa-in-mizan-qarin',
      order: 17,
      arabicText: [
        'ولو كان ضرب 15×4 هو نفسه الشكل الرابع يعني جاءت جماعة في الميزان فهو أذى من القرين'
      ],
      hebrewTranslation: [
        'אם תוצאת 15×4 היא אותה צורה רביעית, כלומר קהלה[] יצאה במאזן — זהו נזק מן הקרין.'
      ],
      houses: [15],
      figures: ['2222'],
      technicalTerms: ['15×4', 'الشكل الرابع', 'جماعة', 'الميزان', 'القرين'],
      rule: 'קהלה במאזן (15×4) = פגיעה מן הקרין (רוח הצמד).',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-18-isqat-7x7-diagnosis',
      order: 18,
      arabicText: [
        'بقواعد الإسقاطات تعد مفتوح الرمل وتسقطه 7-7',
        'لو تبقى 1 فهو ممسوس من الجن',
        'لو تبقى 2 فهو محسود ومنظور ومعيون',
        'لو تبقى 3 فهو مسحور من الإنس ويفعل فاعل',
        'لو تبقى 4 فهو مرض بلغم منسوب للماء',
        'لو تبقى 5 فهو مرض دم عضوي منسوب للهواء',
        'لو تبقى 6 فهو مرض سوداء عضوي منسوب للتراب',
        'لو تبقى 7 فهو مرض صفراء عضوي منسوب للنار'
      ],
      hebrewTranslation: [
        'בשיטת השיבוץ: סופרים את פתיחת הרמל ומחסירים 7–7.',
        'שארית 1 = אחוז מן הג׳ין.',
        'שארית 2 = מקונא, נפגע ממבט, נפגע עין.',
        'שארית 3 = מכושף מאדם; יש פועל שפועל.',
        'שארית 4 = מחלת ליחה — מיוחסת למים.',
        'שארית 5 = מחלת דם גופנית — מיוחסת לאוויר.',
        'שארית 6 = מחלת מרה שחורה — מיוחסת לעפר.',
        'שארית 7 = מחלת מרה צהובה — מיוחסת לאש.'
      ],
      houses: [],
      figures: [],
      technicalTerms: ['الإسقاطات', 'مفتوح الرمل', '7×7', 'ممسوس', 'محسود', 'معيون', 'مسحور', 'البلغم', 'الدم', 'السوداء', 'الصفراء'],
      rule: 'שיבוץ 7×7: שארית 1=ג׳ין; 2=קנאה/עין; 3=כישוף מאדם; 4=ליחה/מים; 5=דם/אוויר; 6=מרה שחורה/עפר; 7=מרה צהובה/אש.',
      status: 'explicit-in-user-approved-screenshot'
    },
    {
      id: 'spiritual-rule-19-organ-diagnosis-8x6',
      order: 19,
      arabicText: [
        'العضو الذي يؤلم المريض 8×6',
        'انظر إلى الطالع وبيت المرض وهو البيت السادس وما جاورهما والى المتولد منهما',
        'النارية: فالمرض من المرارة والصفراء',
        'المائية: فالمرض من البلغم',
        'الهوائية: فالمرض من الدم',
        'الترابية: فالمرض من السوداء'
      ],
      hebrewTranslation: [
        'איבר המכאיב לחולה — שיטת 8×6:',
        'ראה את העולה (ב1) ובית המחלה (ב6) ואת מה שנוצר מהם.',
        'יסוד אש: המחלה מן המרה הצהובה.',
        'יסוד מים: המחלה מן הליחה/בלגם.',
        'יסוד אוויר: המחלה מן הדם.',
        'יסוד עפר: המחלה מן המרה השחורה.'
      ],
      houses: [1, 6, 8],
      figures: [],
      technicalTerms: ['8×6', 'بيت المرض', 'الطالع', 'النارية', 'المائية', 'الهوائية', 'الترابية', 'المرارة', 'الصفراء', 'البلغم', 'الدم', 'السوداء'],
      rule: 'שיטת 8×6: יסוד שולט בב1+ב6 → אש=מרה צהובה; מים=ליחה; אוויר=דם; עפר=מרה שחורה.',
      status: 'source-extracted-sefer-2'
    }
  ],

  summary: {
    mainHouses: [6, 9],
    supportingHouses: [1, 8, 10, 12, 13, 14],
    keyFigures: ['1221 (סוהר)', '2221 (שפל ראש)', '1121 (נלחם)', '2112 (חיבור)', '2222 (קהלה)', '2121 (ממון נכנס)', '1222 (נשוא ראש)', '2122 (אדום)'],
    diagnosticMethods: ['שיבוץ 7×7', 'שיטת 15×4 (סוג ג׳ין)', 'שיטת 8×6 (אבחון איברים)', 'צורה×בית'],
    sourcePageRange: '56–57',
    status: 'complete'
  }
};
