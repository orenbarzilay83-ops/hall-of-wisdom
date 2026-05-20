export const HAWI_HOUSE_STATES_COLORS = {
  id: 'hawi-house-states-colors',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 44.pdf'],
  sourceSectionArabic: 'الباب السابع عشر في الوان البيوت وصامتها وناطقها',
  sourceSectionHebrew: 'שער צבעי הבתים, שותק/מדבר וסעד/נחס',
  status: 'source-preserved-and-entered',
  appArea: 'house-states-colors',
  purposeHebrew:
    'שכבת יסוד מתוך חאוי למצב כל בית בלוח הגורל: צבע, מדבר/שותק/חצי מדבר, סעד/נחס, אור/חושך, כוח/חולשה ותפקיד מעשי. זו שכבה נפרדת ממצבי הצורות.',

  terminologyHebrew: {
    natiq: 'מדבר',
    samit: 'שותק',
    nisfNatiq: 'חצי מדבר',
    saad: 'סעד / טוב',
    nahs: 'נחס / רע',
    nير: 'מאיר / ניר',
    qawi: 'חזק',
    mutamakkin: 'מושרש / מבוסס / מتمכן',
    color: 'צבע',
  },

  openingPrinciple: {
    sourcePage: 44,
    arabic:
      'اعلم ايها الناظر في علمنا وفقك الله اذا اردت معرفة البيوت فهذا اصل من اصول العلم يعينك في الحكم',
    hebrew:
      'המחבר אומר שזה אחד מיסודות המדע, והוא מסייע בדין כאשר רוצים לדעת את מצבי הבתים.',
  },

  houses: [
    {
      house: 1,
      arabicText: 'البيت الاول ناطق نير سعيد قوي متمكن يصلح للجميع',
      hebrew:
        'בית 1 — מדבר, מאיר, סעד, חזק, מבוסס, טוב ומתאים לכל דבר.',
      speakingState: 'speaking',
      fortuneState: 'benefic',
      lightState: 'bright',
      strengthState: 'strong-established',
      colorHebrew: null,
      practicalEffectHebrew: 'מתקן ומתאים לכלל העניינים.',
      topics: ['שואל', 'כוח', 'כללי', 'סעד'],
    },
    {
      house: 2,
      arabicText: 'البيت الثاني صامت نحس احمر متلف لجميع الاموال',
      hebrew:
        'בית 2 — שותק, נחס, אדום, מקלקל/משחית את כל הממונות.',
      speakingState: 'silent',
      fortuneState: 'malefic',
      colorHebrew: 'אדום',
      practicalEffectHebrew: 'מקלקל ממון ורכוש.',
      topics: ['ממון', 'נחס', 'אדום'],
    },
    {
      house: 3,
      arabicText: 'البيت الثالث لونه اخضر نصف ناطق يصلح الحركات',
      hebrew:
        'בית 3 — צבעו ירוק, חצי מדבר, מתקן תנועות/נסיעות/פעולות.',
      speakingState: 'half-speaking',
      fortuneState: 'functional-benefic',
      colorHebrew: 'ירוק',
      practicalEffectHebrew: 'מתקן תנועה, שליחויות וענייני תזוזה.',
      topics: ['תנועה', 'אחים', 'שליחים', 'ירוק'],
    },
    {
      house: 4,
      arabicText: 'البيت الرابع صامت نحس مظلم اللون مدبر يتعب القلوب',
      hebrew:
        'בית 4 — שותק, נחס, צבעו חשוך, פונה לאחור/מדבר, מעייף את הלבבות.',
      speakingState: 'silent',
      fortuneState: 'malefic',
      colorHebrew: 'חשוך',
      practicalEffectHebrew: 'מעייף את הלבבות ומכביד בענייני סוף, בית וקרקע.',
      topics: ['קרקע', 'לב', 'חשוך', 'נחס'],
    },
    {
      house: 5,
      arabicText:
        'البيت الخامس اصفر نير ناطق سعيد قوي يصلح العواقب ويكثر الملبوس ويرفع صاحبه',
      hebrew:
        'בית 5 — צהוב, מאיר, מדבר, סעד, חזק; מתקן את האחריות/סופי הדברים, מרבה לבוש ומרומם את בעליו.',
      speakingState: 'speaking',
      fortuneState: 'benefic',
      lightState: 'bright',
      strengthState: 'strong',
      colorHebrew: 'צהוב',
      practicalEffectHebrew: 'מרבה שמחה, לבוש, רוממות ותיקון אחרית.',
      topics: ['שמחה', 'ילדים', 'לבוש', 'סעד'],
    },
    {
      house: 6,
      arabicText: 'البيت السادس نصف ناطق قليل النور مكدر الامور',
      hebrew:
        'בית 6 — חצי מדבר, מעט אור, מעכיר את העניינים.',
      speakingState: 'half-speaking',
      fortuneState: 'mixed-dim',
      lightState: 'low-light',
      colorHebrew: null,
      practicalEffectHebrew: 'מעכיר עניינים, מתאים לחולי, קושי ושירות.',
      topics: ['חולי', 'שירות', 'עכירות'],
    },
    {
      house: 7,
      arabicText: 'البيت السابع ناطق نحس خؤون النساء لرجالهم لونه اخضر',
      hebrew:
        'בית 7 — מדבר, נחס, בוגדני/כוזב בענייני נשים לגברים, צבעו ירוק.',
      speakingState: 'speaking',
      fortuneState: 'malefic',
      colorHebrew: 'ירוק',
      practicalEffectHebrew: 'מראה מורכבות, בגידה או בעיית אמון בענייני זוגיות ויריבים.',
      topics: ['זוגיות', 'יריב', 'בגידה', 'ירוק'],
    },
    {
      house: 8,
      arabicText:
        'البيت الثامن صامت يزيل الخوف بالقمر ويهلك بالشمس اسود منتن الرائحة سبخ الارض',
      hebrew:
        'בית 8 — שותק; מסיר פחד בלבנה וממית/מאבד בשמש; שחור, ריחו רע, אדמה מלוחה/מקולקלת.',
      speakingState: 'silent',
      fortuneState: 'malefic-contextual',
      colorHebrew: 'שחור',
      smellHebrew: 'ריח רע',
      landQualityHebrew: 'אדמה מלוחה/מקולקלת',
      practicalEffectHebrew: 'קשור לפחד, מוות, אובדן, רעלים וקברים; משתנה לפי לבנה או שמש.',
      topics: ['מוות', 'פחד', 'שמש', 'לבנה', 'שחור'],
    },
    {
      house: 9,
      arabicText: 'البيت التاسع نير ناطق سعيد قوي يصلح للسفر والمعاملة',
      hebrew:
        'בית 9 — מאיר, מדבר, סעד, חזק, מתקן נסיעה ומשא ומתן/עסק.',
      speakingState: 'speaking',
      fortuneState: 'benefic',
      lightState: 'bright',
      strengthState: 'strong',
      colorHebrew: null,
      practicalEffectHebrew: 'טוב לנסיעה, לימוד, דת ומשא ומתן.',
      topics: ['נסיעה', 'דת', 'חכמה', 'סעד'],
    },
    {
      house: 10,
      arabicText:
        'البيت العاشر نصف ناطق سعيد احمر اللون صحيح يصلح لخدمة الملوك',
      hebrew:
        'בית 10 — חצי מדבר, סעד, צבעו אדום, נכון/בריא, מתקן שירות מלכים.',
      speakingState: 'half-speaking',
      fortuneState: 'benefic',
      colorHebrew: 'אדום',
      healthStateHebrew: 'נכון / תקין',
      practicalEffectHebrew: 'מתאים לשלטון, משרה, שירות מלכים ומעמד.',
      topics: ['שלטון', 'מלכים', 'מעמד', 'אדום'],
    },
    {
      house: 11,
      arabicText:
        'البيت الحادي عشر اخضر اللون بحمرة صامت سعيد قوي يقرب الاصدقاء الى بعضهم',
      hebrew:
        'בית 11 — ירוק עם אדמומיות, שותק, סעד, חזק, מקרב חברים זה לזה.',
      speakingState: 'silent',
      fortuneState: 'benefic',
      strengthState: 'strong',
      colorHebrew: 'ירוק עם אדמומיות',
      practicalEffectHebrew: 'מקרב חברים, מחזק תקווה, עזרה ושמחה.',
      topics: ['חברים', 'תקווה', 'סעד', 'ירוק'],
    },
    {
      house: 12,
      arabicText:
        'البيت الثاني عشر صامت مظلم وفيه بعض نور اسود يصلح للدواب ويكثر العداوة',
      hebrew:
        'בית 12 — שותק, חשוך, ויש בו מעט אור; שחור, מתאים לבהמות ומרבה איבה.',
      speakingState: 'silent',
      fortuneState: 'malefic-dark',
      lightState: 'dark-with-some-light',
      colorHebrew: 'שחור',
      practicalEffectHebrew: 'מרבה איבה, אויבים נסתרים, בהמות וקושי.',
      topics: ['אויבים', 'איבה', 'בהמות', 'שחור'],
    },
    {
      house: 13,
      arabicText:
        'البيت الثالث عشر لونه ابيض بصفرة ناطق سعيد قوي متمكن في جميع الامور',
      hebrew:
        'בית 13 — צבעו לבן בצהבהבות, מדבר, סעד, חזק, מבוסס בכל העניינים.',
      speakingState: 'speaking',
      fortuneState: 'benefic',
      strengthState: 'strong-established',
      colorHebrew: 'לבן עם צהבהבות',
      practicalEffectHebrew: 'חזק ומועיל בכל העניינים; סוד נפש השואל.',
      topics: ['סוד נפש', 'חוזק', 'סעד'],
    },
    {
      house: 14,
      arabicText:
        'البيت الرابع عشر نصف ناطق مكار خؤون لونه احمر بسواد',
      hebrew:
        'בית 14 — חצי מדבר, ערמומי, בוגדני, צבעו אדום בשחור.',
      speakingState: 'half-speaking',
      fortuneState: 'mixed-dangerous',
      colorHebrew: 'אדום עם שחור',
      practicalEffectHebrew: 'מראה מניעה, ערמומיות, בגידה וסוד הנשאל עליו.',
      topics: ['מניעה', 'סוד הנשאל', 'ערמה', 'בגידה'],
    },
    {
      house: 15,
      arabicText: 'البيت الخامس عشر لم يضهر حاوي العجائب',
      hebrew:
        'בית 15 — לפי נוסח הדף: לא הופיע/לא התגלה בחאוי العجائب.',
      speakingState: null,
      fortuneState: null,
      colorHebrew: null,
      practicalEffectHebrew:
        'אין להמציא מצב לבית 15 מתוך שער זה. בית 15 נשאר חשוב כדיין/מאזני הרמל ממקורות אחרים בספר.',
      sourceStatus: 'explicitly-not-shown-in-this-section',
      topics: ['דיין', 'בית 15', 'לא הופיע בשער זה'],
    },
    {
      house: 16,
      arabicText:
        'البيت السادس عشر صامت سعيد قوي يصلح جميع العواقب لونه اسود بغيرة',
      hebrew:
        'בית 16 — שותק, סעד, חזק, מתקן את כל האחריות/סופי הדברים, צבעו שחור עם שינוי/גוון אחר.',
      speakingState: 'silent',
      fortuneState: 'benefic',
      strengthState: 'strong',
      colorHebrew: 'שחור בגוון אחר',
      practicalEffectHebrew: 'מתקן סופי דברים ואחריות, למרות היותו שותק.',
      topics: ['משלים בית 15', 'סוף דבר', 'סעד', 'שחור'],
    },
  ],

  appIntegration: {
    mustEnterApp: true,
    suggestedMenuHebrew: 'מצבי הבתים וצבעיהם',
    relatedModules: [
      'לוח הגורל',
      'דיני שאלות',
      'דמיר',
      'אבחון רוחני',
      'מטמון',
      'נסיעה',
      'מולד',
    ],
    displayPolicyHebrew:
      'יש להציג כמידע מקצועי בתוך לימוד/ניתוח הלוח. לא לבלבל עם מצבי הצורות; אלו מצבי הבתים עצמם.',
  },
};

export function getHawiHouseStatesColors() {
  return HAWI_HOUSE_STATES_COLORS;
}

export default { HAWI_HOUSE_STATES_COLORS };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_HOUSE_STATES_COLORS };
}
