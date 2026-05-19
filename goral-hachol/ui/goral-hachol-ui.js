import {
  HAWI_SOURCE,
  HAWI_QUESTION_RULES_LIST,
  HAWI_FIGURE_TRANSITS_LIST,
} from '../data/sources/hawi/hawi-source.js';

import {
  createRamlBoard,
} from '../engine/raml-board.js';

import {
  interpretRamlBoard,
  getInterpretationSummary,
} from '../engine/raml-interpreter.js';

export const RAML_RTL_BOARD_ROWS = [
  [1, 2, 3, 4, 5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14],
  [15, 16],
];

export function getRamlUiQuestionTopics() {
  return HAWI_QUESTION_RULES_LIST.map((rule) => ({
    id: rule.id,
    title:
      rule.sourceSectionHebrew ||
      rule.hebrewTitle ||
      rule.id,
    status: rule.status || rule.extractionStatus || 'ready',
    sourceStatus: rule.sourceStatus || rule.extractionStatus || 'sourceExact',
  }));
}

export function getRamlUiFigureOptions() {
  return HAWI_FIGURE_TRANSITS_LIST.map((figure) => ({
    id: figure.id,
    title:
      figure.hebrewName ||
      figure.hebrewTitle ||
      figure.arabicName ||
      figure.id,
    sourceStatus: figure.sourceStatus || figure.extractionStatus || 'sourceExact',
  }));
}

export function createRamlUiState({
  questionText = '',
  topicId = 'hawi-question-marriage',
  manualFigures = [],
} = {}) {
  const figures = manualFigures.length
    ? manualFigures
    : HAWI_FIGURE_TRANSITS_LIST.map((figure) => figure.id);

  const board = createRamlBoard(figures);

  const interpretation = interpretRamlBoard({
    questionText,
    topicId,
    board,
  });

  return {
    id: 'goral-hachol-ui-state',
    source: 'hawi',
    sourceId: HAWI_SOURCE.sourceId,
    questionText,
    topicId,
    topics: getRamlUiQuestionTopics(),
    figureOptions: getRamlUiFigureOptions(),
    board,
    boardRowsRtl: RAML_RTL_BOARD_ROWS.map((row) =>
      row.map((houseNumber) => board.housesByNumber[houseNumber])
    ),
    interpretation,
    summary: getInterpretationSummary(interpretation),
  };
}

export function getRamlBoardRowsForDisplay(board) {
  if (!board || typeof board !== 'object') {
    return [];
  }

  return RAML_RTL_BOARD_ROWS.map((row) =>
    row.map((houseNumber) => board.housesByNumber?.[houseNumber] || null)
  );
}
