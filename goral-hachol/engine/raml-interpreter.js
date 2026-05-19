import {
  HAWI_SOURCE,
  getHawiQuestionRules,
} from '../data/sources/hawi/hawi-source.js';

import {
  getRamlBoardHouse,
} from './raml-board.js';

function uniqueNumbers(values) {
  return [...new Set(
    values
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value >= 1 && value <= 16)
  )];
}

function getRuleHouses(questionRule) {
  if (!questionRule || !Array.isArray(questionRule.rules)) {
    return [];
  }

  return uniqueNumbers(
    questionRule.rules.flatMap((rule) =>
      Array.isArray(rule.houses) ? rule.houses : []
    )
  );
}

function getPrimaryQuestionHouse(questionRule) {
  const houses = getRuleHouses(questionRule);

  const nonQuerentHouse = houses.find((house) => house !== 1);

  return nonQuerentHouse || houses[0] || 1;
}

function getGeneralQuestionMeaning(questionRule) {
  if (!questionRule) {
    return null;
  }

  if (questionRule.status === 'needs-source-recovery') {
    return {
      status: 'needs-source-recovery',
      sourceStatus: questionRule.sourceStatus || 'not-explicit-in-source',
      note: questionRule.note || 'דין השאלה דורש שחזור מקור.',
    };
  }

  return {
    id: questionRule.id,
    sourceSectionArabic: questionRule.sourceSectionArabic || null,
    sourceSectionHebrew: questionRule.sourceSectionHebrew || null,
    extractionStatus: questionRule.extractionStatus || null,
    summary: questionRule.summary || null,
    rules: Array.isArray(questionRule.rules) ? questionRule.rules : [],
    sourceStatus: questionRule.extractionStatus || 'not-explicit-in-source',
  };
}

function interpretRamlBoardInternal({
  questionText = '',
  topicId,
  board,
} = {}) {
  if (!board || typeof board !== 'object') {
    throw new Error('interpretRamlBoard expects a board object');
  }

  const questionRule = getHawiQuestionRules(topicId);
  const querentHouseNumber = 1;
  const questionHouseNumber = questionRule
    ? getPrimaryQuestionHouse(questionRule)
    : null;

  const querentHouse = getRamlBoardHouse(board, querentHouseNumber);
  const questionHouse = questionHouseNumber
    ? getRamlBoardHouse(board, questionHouseNumber)
    : null;

  const ruleHouses = questionRule ? getRuleHouses(questionRule) : [];
  const witnessHouseNumbers = uniqueNumbers([
    querentHouseNumber,
    questionHouseNumber,
    ...ruleHouses,
  ]);

  const witnesses = witnessHouseNumbers.map((houseNumber) => ({
    house: houseNumber,
    boardHouse: getRamlBoardHouse(board, houseNumber),
    witnessRule: HAWI_SOURCE.foundations.witnesses.sequence.find(
      (item) => item.fromHouse === houseNumber
    ) || null,
    houseGroup:
      HAWI_SOURCE.foundations.witnesses.houseGroupByHouse[houseNumber] || null,
    sourceStatus:
      HAWI_SOURCE.foundations.witnesses.sequence.some((item) => item.fromHouse === houseNumber) ||
      Boolean(HAWI_SOURCE.foundations.witnesses.houseGroupByHouse[houseNumber])
        ? 'explicit-in-source'
        : 'not-explicit-in-source',
  }));

  const missingSourceNotes = [];

  if (!questionRule) {
    missingSourceNotes.push({
      type: 'question-rule',
      topicId,
      sourceStatus: 'not-explicit-in-source',
      note: 'לא נמצא שער שאלות עבור topicId זה.',
    });
  }

  if (questionRule?.status === 'needs-source-recovery') {
    missingSourceNotes.push({
      type: 'question-rule',
      topicId,
      sourceStatus: questionRule.sourceStatus || 'not-explicit-in-source',
      note: questionRule.note || 'שער השאלה דורש שחזור מקור.',
    });
  }

  if (!questionHouse) {
    missingSourceNotes.push({
      type: 'question-house',
      topicId,
      sourceStatus: 'not-explicit-in-source',
      note: 'לא נמצא בית שאלה מפורש או שהבית אינו קיים בלוח.',
    });
  }

  if (questionHouse && !questionHouse.figureHouseMeaning) {
    missingSourceNotes.push({
      type: 'figure-house-meaning',
      topicId,
      house: questionHouse.houseNumber,
      figureId: questionHouse.figureId,
      sourceStatus: 'not-explicit-in-source',
      note: 'לא נמצאה משמעות מפורשת לצורה בבית זה.',
    });
  }

  return {
    id: 'raml-interpretation',
    source: 'hawi',
    questionText,
    topicId,
    questionRule,

    querent: {
      houseNumber: querentHouseNumber,
      house: querentHouse,
    },

    question: {
      houseNumber: questionHouseNumber,
      house: questionHouse,
      figureId: questionHouse?.figureId || null,
      figure: questionHouse?.figure || null,
      figureHouseMeaning: questionHouse?.figureHouseMeaning || null,
    },

    witnesses,

    generalQuestionMeaning: getGeneralQuestionMeaning(questionRule),

    missingSourceNotes,
    sourceStatus: missingSourceNotes.length
      ? 'not-explicit-in-source'
      : 'ready',
  };
}

export function getInterpretationSummary(interpretation) {
  if (!interpretation || typeof interpretation !== 'object') {
    return null;
  }

  return {
    questionText: interpretation.questionText,
    topicId: interpretation.topicId,
    querentHouse: interpretation.querent?.houseNumber || null,
    questionHouse: interpretation.question?.houseNumber || null,
    questionFigureId: interpretation.question?.figureId || null,
    sourceStatus: interpretation.sourceStatus,
    missingSourceNotes: interpretation.missingSourceNotes || [],
  };
}

export function interpretRamlBoard(input = {}) {
  const base = interpretRamlBoardInternal(input);

  const topicHouses = Array.isArray(base.questionRule?.rules)
    ? [...new Set(
        base.questionRule.rules.flatMap((rule) =>
          Array.isArray(rule.houses) ? rule.houses : []
        )
      )]
    : [];

  const mainHouse = base.question?.houseNumber || null;
  const mainBoardHouse = base.question?.house || null;

  return {
    ...base,

    questionText: base.questionText,
    topicId: base.topicId,

    querentHouse: base.querent?.houseNumber || 1,
    topicHouses,
    mainHouse,
    mainFigure: base.question?.figure || null,
    mainHouseMeaning: mainBoardHouse?.houseMeaning || null,
    figureHouseMeaning: base.question?.figureHouseMeaning || null,
    questionRules: base.questionRule || null,
    witnessNotes: base.witnesses || [],
    sourceWarnings: base.missingSourceNotes || [],
  };
}

