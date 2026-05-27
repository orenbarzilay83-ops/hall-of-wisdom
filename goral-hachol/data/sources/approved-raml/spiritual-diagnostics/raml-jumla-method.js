export const RAML_JUMLA_METHOD = {
  id: 'raml-jumla-method',
  sourceBook: 'بلوغ الامل في علم الرمل',
  sourcePages: '62-63',
  purposeHebrew: 'שיטת הג׳ומלה — סכום כל הנקודות בלוח, חלוקה למציאת שארית, אבחון לפי הנושא',
  methodHebrew:
    'ג׳ומלה = סכום כל הנקודות בלוח (נקודה יחידה = 1, זוג = 2) על פני כל 16 הבתים × 4 שורות. מחלקים בN ולוקחים את השארית.',

  illnessMod4: {
    titleArabic: 'وإن سألت عن مريض ما مرضه فألق الجملة ٤-٤',
    titleHebrew: 'לאבחון סיבת המחלה — חלק ב-4',
    outcomes: {
      1: { arabicText: 'فمرضه من الحمى',        hebrewLabel: 'חום / קדחת',           isSorcery: false },
      2: { arabicText: 'فمرضه من الرياح',        hebrewLabel: 'רוחות / ריאות / קור', isSorcery: false },
      3: { arabicText: 'فمرضه من السحر',         hebrewLabel: 'כישוף (סיהר)',         isSorcery: true  },
      4: { arabicText: 'فمرضه من الرياح والحمى', hebrewLabel: 'רוחות וחום',          isSorcery: false },
    },
  },

  childrenMod3: {
    titleArabic: 'إذا سألت عن الولد فألق الجملة ٣-٣',
    titleHebrew: 'לשאלת ילדים / היריון — חלק ב-3',
    outcomes: {
      1: { arabicText: 'يولد له غلام',    hebrewLabel: 'ייוולד זכר (בן)'              },
      2: { arabicText: 'يولد له جارية',   hebrewLabel: 'תיוולד נקבה (בת)'             },
      3: { arabicText: 'تسقط الولد',      hebrewLabel: 'הפלה / לא ייוולד ילד בעת הזו' },
    },
  },

  friendshipMod4: {
    titleArabic: 'إن سألت عن الصديق فألق الجملة ٤-٤',
    titleHebrew: 'לבדיקת ידידות / שותפות — חלק ב-4',
    outcomes: {
      1: { arabicText: 'فإنه يبغضه',         hebrewLabel: 'שונא אותו'               },
      2: { arabicText: 'فإنه يحبه',           hebrewLabel: 'אוהב אותו'               },
      3: { arabicText: 'فإنه يحبه ظاهراً',   hebrewLabel: 'אוהב אותו לכאורה בלבד'   },
      4: { arabicText: 'فليس فيه خير',        hebrewLabel: 'אין בו טוב'              },
    },
  },
};

export default RAML_JUMLA_METHOD;

if (typeof module !== 'undefined') {
  module.exports = { RAML_JUMLA_METHOD };
}
