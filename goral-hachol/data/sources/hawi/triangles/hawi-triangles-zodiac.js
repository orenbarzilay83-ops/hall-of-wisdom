export const HAWI_TRIANGLES_ZODIAC = {
  id: 'hawi-triangles-zodiac',
  sourceBook: 'حاوي العجائب ومظهر الغرائب',
  sourceAuthor: 'أحمد ابن زنبل المحلي',
  sourcePages: ['PDF document 59.pdf'],
  sourceSectionArabic: 'باب المثلثات',
  sourceSectionHebrew: 'שער המשולשים',
  status: 'source-preserved-and-entered',
  appArea: 'triangles-zodiac-letters',
  purposeHebrew:
    'שכבת ידע לשער המשולשים מתוך חאוי: מזלות, כוכבים ואותיות/סודות הקשורים למשולשים. החומר נכנס לאפליקציה כידע מקור, ואינו מחליף את מנוע לוח הגורל.',

  openingArabic: [
    'باب المثلثات',
    'الذي وعدنا بة في كتابنا الدر المهدي في ظهور المهدي وهي شعر',
  ],

  poemArabic: [
    'الكبش احداث خسة في العقرب',
    'والثور د ر ل قوسة في المنكب',
    'والتومان يخس مهة جدية',
    'سرطان د ر دلوة للمشرب',
    'واللبس ل ي خ حوتة في مائة',
    'عذراء س ه د جفنها للمرقب',
    'ر ل ي على الميزان افشى سرة',
    'والكل وجة حرف اخر للكوكب',
  ],

  poemHebrewNote:
    'המקור מביא את שער המשולשים בצורת שיר/רמז. יש לשמר את נוסח המקור ולא לפרש מעבר למה שניתן לאמת. השיר מקשר מזלות, אותיות ורמזים כוכביים.',

  zodiacPlanetaryMap: [
    {
      signArabic: 'الحمل',
      signHebrew: 'טלה',
      sourceLineArabic: 'فاما الحمل لة الشمس والمشتري و زحل',
      planetsArabic: ['الشمس', 'المشتري', 'زحل'],
      planetsHebrew: ['שמש', 'צדק', 'שבתאי'],
    },
    {
      signArabic: 'الثور',
      signHebrew: 'שור',
      sourceLineArabic: 'والثور لة الزهرة والمريخ وزحل',
      planetsArabic: ['الزهرة', 'المريخ', 'زحل'],
      planetsHebrew: ['נוגה', 'מאדים', 'שבתאי'],
    },
    {
      signArabic: 'الجوزا',
      signHebrew: 'תאומים',
      sourceLineArabic: 'الجوزا لة عين البيت الثالث وزحل وعطارد والمشتري',
      planetsArabic: ['عين البيت الثالث', 'زحل', 'عطارد', 'المشتري'],
      planetsHebrew: ['עין הבית השלישי', 'שבתאי', 'כוכב/מרקורי', 'צדק'],
      reviewNoteHebrew:
        'המונח عين البيت الثالث נשמר כפי שהוא ודורש פירוש מקצועי בהמשך.',
    },
    {
      signArabic: 'السرطان',
      signHebrew: 'סרטן',
      sourceLineArabic: 'والسرطان لة الزهرة وزحل والمريخ',
      planetsArabic: ['الزهرة', 'زحل', 'المريخ'],
      planetsHebrew: ['נוגה', 'שבתאי', 'מאדים'],
    },
    {
      signArabic: 'الميزان',
      signHebrew: 'מאזניים',
      sourceLineArabic: 'الميزان لة زحل وعطارد والمشتري',
      planetsArabic: ['زحل', 'عطارد', 'المشتري'],
      planetsHebrew: ['שבתאי', 'כוכב/מרקורי', 'צדק'],
    },
    {
      signArabic: 'العقرب',
      signHebrew: 'עקרב',
      sourceLineArabic: 'والعقرب لة الزهرة وزحل والمريخ',
      planetsArabic: ['الزهرة', 'زحل', 'المريخ'],
      planetsHebrew: ['נוגה', 'שבתאי', 'מאדים'],
    },
    {
      signArabic: 'القوس',
      signHebrew: 'קשת',
      sourceLineArabic: 'القوس لة الشمس والمشتري وزحل',
      planetsArabic: ['الشمس', 'المشتري', 'زحل'],
      planetsHebrew: ['שמש', 'צדק', 'שבתאי'],
    },
    {
      signArabic: 'الجدي',
      signHebrew: 'גדי',
      sourceLineArabic: 'الجدي لة الزهرة وزحل والمريخ',
      planetsArabic: ['الزهرة', 'زحل', 'المريخ'],
      planetsHebrew: ['נוגה', 'שבתאי', 'מאדים'],
    },
    {
      signArabic: 'الدالي',
      signHebrew: 'דלי',
      sourceLineArabic: 'والدالي زحل وعطارد والمشتري',
      planetsArabic: ['زحل', 'عطارد', 'المشتري'],
      planetsHebrew: ['שבתאי', 'כוכב/מרקורי', 'צדק'],
    },
    {
      signArabic: 'الحوت',
      signHebrew: 'דגים',
      sourceLineArabic: 'الحوت لة الزهرة والمريخ وزحل',
      planetsArabic: ['الزهرة', 'المريخ', 'زحل'],
      planetsHebrew: ['נוגה', 'מאדים', 'שבתאי'],
    },
  ],

  missingInVisibleLine: {
    noteHebrew:
      'בקריאת הדף הנוכחית לא הופיעו במפורש כל 12 המזלות כרשימה מלאה; נשמרו רק המזלות והכוכבים שנמצאו בנוסח הקריא של PDF 59.',
    signsNotClearlyListedInCurrentTextHebrew: ['אריה', 'בתולה'],
    appRule:
      'לא להשלים מסברה. אם בדיקת צילום/עמוד נוסף תראה את אריה ובתולה במפורש, נוסיף אותם נקודתית.',
  },

  appIntegration: {
    mustEnterApp: true,
    suggestedMenuHebrew: 'משולשים, מזלות וכוכבים',
    relatedModules: [
      'שער המולד',
      'טאלע השנה',
      'שיוכי כוכבים וחומרים',
      'חילוץ דמיר',
      'כיוונים ותסקין',
    ],
    displayPolicyHebrew:
      'להציג את הערבית המקורית לצד עברית, משום שהשער בנוי כרמזים ושיר, וכל פירוש יתר עלול לעוות את המקור.',
  },
};

export function getHawiTrianglesZodiac() {
  return HAWI_TRIANGLES_ZODIAC;
}

export default { HAWI_TRIANGLES_ZODIAC };

if (typeof module !== 'undefined') {
  module.exports = { HAWI_TRIANGLES_ZODIAC };
}
