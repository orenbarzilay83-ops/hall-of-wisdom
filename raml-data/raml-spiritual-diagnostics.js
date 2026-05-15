// גורל החול — אבחון רוחני: סחר, מס, חסד, עין, ג׳ין ומחלה רוחנית
// מקור: צילום/חילוץ מתוך מקור מאושר שהמשתמש העלה.
// קובץ ידע ליועץ בלבד. לא אבחנה רפואית. לא דוח לקוח כברירת מחדל.

const RAML_SPIRITUAL_DIAGNOSTICS = {
  metadata: {
    id: "raml-spiritual-diagnostics",
    title: "אבחון רוחני בגורל החול",
    arabicTitle: "أحكام السحر والمس والحسد في علم الرمل",
    status: "source-extracted-advisor-only",
    sourcePolicy: "approved-user-source-only",
    externalKnowledgeUsed: false,
    displayPolicy: "advisorOnly",
    medicalDisclaimer: "ידע רוחני/מסורתי בלבד; אינו אבחנה רפואית ואינו מחליף טיפול רפואי."
  },

  scope: {
    topics: [
      "سحر — סחר / כישוף",
      "مس — מס / פגיעה מג׳ין",
      "حسد — חסד / קנאה",
      "عين — עין הרע",
      "جن — ג׳ין",
      "روحانيين — רוחניים",
      "كهانة — כהונה/ניחוש",
      "شعوذة — כשפים/להטוטים",
      "مرض روحي — חולי רוחני"
    ],
    houseLinks: [1, 4, 6, 9, 10, 12],
    status: "advisorOnly"
  },

  houseRoles: {
    id: "spiritual-house-roles",
    title: "תפקידי הבתים באבחון רוחני",
    status: "verified-from-uploaded-source",
    rules: [
      {
        house: 1,
        arabic: "الأول هو المريض",
        hebrew: "הבית הראשון הוא החולה / השואל / מצב האדם עצמו."
      },
      {
        house: 4,
        arabic: "الرابع هو الدواء",
        hebrew: "הבית הרביעי הוא התרופה / הפתרון / שורש הריפוי."
      },
      {
        house: 6,
        arabic: "السادس هو بيت المرض",
        hebrew: "הבית השישי הוא בית המחלה."
      },
      {
        house: 9,
        arabic: "التاسع هو الساحر",
        hebrew: "הבית התשיעי הוא בית הסוחר/המכשף או בעלי עבודה רוחנית מסוג זה."
      },
      {
        house: 10,
        arabic: "العاشر هو الطبيب أو المعالج",
        hebrew: "הבית העשירי הוא הרופא / המרפא / המטפל."
      },
      {
        house: 12,
        arabic: "الثاني عشر هو بيت الأعداء",
        hebrew: "הבית השנים־עשר הוא בית האויבים."
      }
    ],
    relatedHouseNotes: [
      "הבית השני — ממון החולה.",
      "הבית השלישי — אחיו ועוזריו.",
      "הבית החמישי — שמחותיו.",
      "הבית השביעי — אשתו / בן או בת זוגו.",
      "שאר הבתים מקבלים משמעות לפי הדلالة الأصلية שלהם."
    ]
  },

  magicianAndSorcerySigns: {
    id: "magician-and-sorcery-signs",
    title: "סימני סחר/מכשף וצורות קשורות",
    status: "partiallyVerified",
    rules: [
      {
        figureArabic: "العقلة",
        hebrew: "העקלה",
        rule: "במיוחד צורת העקלה מורה על אישה מכשפת / אישה סוחרת."
      },
      {
        figureArabic: "الأنكيس",
        hebrew: "אנקיס",
        rule: "מורה על הפסד, עצב, כישלון, צרות חזה / לחץ בחזה."
      },
      {
        figureArabic: "اجتماع",
        hebrew: "איג׳תמאע / اجتماع",
        rule: "מורה על הסוחר/המכשף או על התקבצות כוחות/אנשים סביב הפעולה."
      },
      {
        house: 9,
        rule: "הבית התשיעי ברמל מורה על הסוחרים/המכשפים, שייחים רוחניים, מי שעוסקים בענייני סחר, ג׳ין, עראפה, כהאנה ושעודה."
      }
    ],
    implementationReady: false,
    displayPolicy: "advisorOnly"
  },

  patientConditionRules: {
    id: "patient-condition-rules",
    title: "מצב החולה / השואל",
    status: "partiallyVerified",
    rules: [
      {
        condition: "אם הבית הראשון سعيد / טוב",
        hebrew: "מורה על רוגע נפשי לשואל, שקט עצבים, מצב טוב, שלמות נפשית ובריאות כללית."
      }
    ],
    displayPolicy: "advisorOnly"
  },

  specificSorceryExamples: {
    id: "specific-sorcery-examples",
    title: "דוגמאות צורה+בית באבחון סחר",
    status: "source-extracted-needs-figure-normalization",
    rules: [
      {
        figureArabic: "الأنكيس",
        house: 6,
        hebrew: "אם אנקיס בבית השישי — סחר קבור בקבר.",
        status: "advisorOnly"
      },
      {
        figureArabic: "الجودلة",
        house: 6,
        hebrew: "אם ג׳ודלה בבית השישי — סחר משקה / סחר שנשתה.",
        status: "advisorOnly"
      },
      {
        figureArabic: "الجودلة",
        house: 12,
        hebrew: "אם ג׳ודלה בבית השנים־עשר, בית האויבים — קשירה / ריבוט הקשור לאשתו.",
        status: "advisorOnly"
      },
      {
        figureArabic: "القبض الداخل",
        house: 6,
        hebrew: "אם קבץ דאחל בבית השישי — קשור/מכופף מצד נשים.",
        status: "advisorOnly"
      },
      {
        figureArabic: "الأحيان",
        house: 10,
        hebrew: "אם אל־אחיאן בבית העשירי — גם הוא מסחור / מושפע מסחר.",
        status: "advisorOnly"
      },
      {
        figureArabic: "العقلة",
        house: 13,
        hebrew: "אם עקלה בבית השלושה־עשר — קשור בסחר, ויש עליו סחר/רישוש גם כן.",
        status: "advisorOnly"
      },
      {
        figureArabic: "العقلة",
        house: 14,
        hebrew: "אם עקלה בבית הארבעה־עשר — בביתו יש סחר, או סחר תלוי בבית/מקום שבו מכים עליו ושואלים עליו.",
        status: "advisorOnly"
      },
      {
        figureArabic: "الجماعة",
        house: 6,
        hebrew: "אם אל־ג׳מאעה בבית השישי — קשור ל־تابعة أم الصبيان; יכולה למנוע נישואין, לעכב היריון, לגרום להפלה, או לפגוע בילדים לפי לשון המקור.",
        status: "advisorOnly-sensitive"
      }
    ],
    warning: "נוסחים אלה נשמרים כידע רוחני מסורתי ליועץ בלבד, לא כדוח לקוח ולא כאבחנה רפואית."
  },

  intenseEnvyAndMultipleSorcery: {
    id: "intense-envy-and-multiple-sorcery",
    title: "חסד חזק וריבוי סחר",
    status: "partiallyVerified",
    rules: [
      {
        arabicContext: "انتشاء الجماعة من حمرتين",
        hebrew: "היווצרות אל־ג׳מאעה משתי אדומות — מורה על אדם מקונא / מחסוד מאוד מאוד."
      },
      {
        arabicContext: "انتشاء الجماعة من أنكيسين",
        hebrew: "היווצרות אל־ג׳מאעה משני אנקיסים — מורה על סחר קבור / שני סחרים, ומצב קשה מאוד לפי לשון המקור.",
        status: "needsCarefulSourceCheck"
      }
    ],
    displayPolicy: "advisorOnly"
  },

  painfulOrganAndJinnType: {
    id: "painful-organ-and-jinn-type",
    title: "האיבר הכואב וסוג הג׳ין",
    status: "needsFormula",
    rules: [
      {
        arabic: "العضو الذي يؤلم المريض 6×8",
        hebrew: "האיבר שמכאיב לחולה — נוסחת 6×8.",
        status: "needsFormula"
      },
      {
        arabic: "نوعية الجن التي تؤذي المريض وتسلط عليه 15×4",
        hebrew: "סוג הג׳ין שפוגע בחולה ושולט עליו — נוסחת 15×4.",
        status: "needsFormula"
      }
    ],
    jinnElementIndications: [
      {
        condition: "אם הצורה نارية",
        hebrew: "מן הג׳ין האדום."
      },
      {
        condition: "אם הצורה ترابية",
        hebrew: "מס / פגיעה ארצית או תחתונה."
      },
      {
        condition: "אם הצורה مائية",
        hebrew: "מן ג׳ין המים / ג׳ין غواص."
      },
      {
        condition: "אם הצורה هوائية",
        hebrew: "מן ג׳ין האוויר / ג׳ין طيار."
      }
    ],
    implementationReady: false,
    displayPolicy: "advisorOnly"
  },

  damirAndHouseInterpretationForSpiritualDiagnosis: {
    id: "damir-house-spiritual-diagnosis",
    title: "שימוש בדמיר ובבתים לאבחון מה קרה לאדם",
    status: "advancedKnowledge",
    rules: [
      "דרך استخراج الضمير ופירושו בבתים אפשר לדעת מה קרה לאדם.",
      "משתמשים בהיכרות עם خصائص הבתים והצורות.",
      "מתחשבים במעברים / انتقالات.",
      "מתחשבים בחזרת צורות / تكرار الأشكال.",
      "מתחשבים בהכאות / الضروبات לפי הצורך.",
      "לא מפרשים לבד בלי חיבור של צורה, בית, דמיר וחוקי מקור."
    ],
    displayPolicy: "advisorOnly"
  },

  dropSevenOpenPointsRule: {
    id: "drop-seven-open-points-rule",
    title: "כללי الإسقاطات — ספירת פתוח הרמל והפלה 7־7",
    arabic: "تعد مفتوح الرمل وتسقطه 7-7",
    status: "verified-from-uploaded-source",
    rule: "סופרים את הפתוח ברמל ומפילים 7־7. לפי השארית מפרשים.",
    remainderRules: [
      {
        remainder: 1,
        arabic: "فهو ممسوس من الجن",
        hebrew: "ממוס / פגוע מן הג׳ין.",
        category: "jinn"
      },
      {
        remainder: 2,
        arabic: "فهو محسود ومنظور ومعيون",
        hebrew: "מחסוד / מנזור / מעוין — קנאה ועין הרע.",
        category: "evilEye"
      },
      {
        remainder: 3,
        arabic: "فهو مسحور من الإنس ويفعل فاعل",
        hebrew: "מסחור על ידי בני אדם, ויש עושה/פועל פעיל.",
        category: "humanSorcery"
      },
      {
        remainder: 4,
        arabic: "فهو مرض بلغم منسوب للماء",
        hebrew: "מחלה ליחתית / بلغم, מיוחסת למים.",
        category: "humorWater"
      },
      {
        remainder: 5,
        arabic: "فهو مرض دم عضوي منسوب للهواء",
        hebrew: "מחלת דם/איבר, מיוחסת לאוויר.",
        category: "humorAir"
      },
      {
        remainder: 6,
        arabic: "فهو مرض سوداء عضوي منسوب للتراب",
        hebrew: "מחלה שחורה/סודאא איברית, מיוחסת לעפר.",
        category: "humorEarth"
      },
      {
        remainder: 7,
        arabic: "فهو مرض صفراء عضوي منسوب للنار",
        hebrew: "מחלה צהובה/צפראא איברית, מיוחסת לאש.",
        category: "humorFire"
      }
    ],
    implementationReady: true,
    displayPolicy: "advisorOnly / spiritualDiagnostic"
  }
};

function ramlGetSpiritualDiagnostics() {
  return RAML_SPIRITUAL_DIAGNOSTICS;
}

function ramlGetDropSevenOpenPointsRule() {
  return RAML_SPIRITUAL_DIAGNOSTICS.dropSevenOpenPointsRule;
}

function ramlInterpretOpenPointsDropSeven(openPoints) {
  const n = Number(openPoints);
  if (!Number.isFinite(n) || n < 0) {
    return {
      status: "invalidInput",
      message: "openPoints must be a non-negative number"
    };
  }

  const remainder = n % 7 === 0 ? 7 : n % 7;
  const rule = RAML_SPIRITUAL_DIAGNOSTICS.dropSevenOpenPointsRule.remainderRules
    .find(x => x.remainder === remainder);

  return {
    status: "advisorOnly",
    openPoints: n,
    dropBase: 7,
    remainder,
    rule
  };
}

if (typeof window !== "undefined") {
  window.RAML_SPIRITUAL_DIAGNOSTICS = RAML_SPIRITUAL_DIAGNOSTICS;
  window.ramlGetSpiritualDiagnostics = ramlGetSpiritualDiagnostics;
  window.ramlGetDropSevenOpenPointsRule = ramlGetDropSevenOpenPointsRule;
  window.ramlInterpretOpenPointsDropSeven = ramlInterpretOpenPointsDropSeven;
}

if (typeof module !== "undefined") {
  module.exports = {
    RAML_SPIRITUAL_DIAGNOSTICS,
    ramlGetSpiritualDiagnostics,
    ramlGetDropSevenOpenPointsRule,
    ramlInterpretOpenPointsDropSeven
  };
}
