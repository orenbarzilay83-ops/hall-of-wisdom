import {
  HAWI_SOURCE,
  getHawiFigureTransit,
  getHawiFigureHouseMeaning,
} from '../data/sources/hawi/hawi-source.js';

export function normalizeFigureId(input) {
  if (!input) {
    return null;
  }

  if (typeof input === 'string') {
    return input;
  }

  if (typeof input === 'object' && typeof input.figureId === 'string') {
    return input.figureId;
  }

  if (typeof input === 'object' && typeof input.id === 'string') {
    return input.id;
  }

  return null;
}

export function createRamlBoard(manualFigures) {
  if (!Array.isArray(manualFigures)) {
    throw new Error('createRamlBoard expects an array of 16 figure ids');
  }

  if (manualFigures.length !== 16) {
    throw new Error(`createRamlBoard expects exactly 16 figures, received ${manualFigures.length}`);
  }

  const housesByNumber = HAWI_SOURCE.foundations.housesByNumber;

  const houses = manualFigures.map((input, index) => {
    const houseNumber = index + 1;
    const figureId = normalizeFigureId(input);
    const figure = getHawiFigureTransit(figureId);
    const house = housesByNumber[houseNumber] || null;
    const figureHouseMeaning = getHawiFigureHouseMeaning(figureId, houseNumber);

    return {
      house: houseNumber,
      houseNumber,
      figureId,
      figure,
      houseMeaning: house,
      figureHouseMeaning,
      sourceStatus: figure && house && figureHouseMeaning
        ? 'ready'
        : 'not-explicit-in-source',
    };
  });

  return {
    id: 'raml-board',
    source: 'hawi',
    houses,
    housesByNumber: Object.fromEntries(
      houses.map((item) => [item.houseNumber, item])
    ),
  };
}

export function getRamlBoardHouse(board, houseNumber) {
  const house = Number(houseNumber);

  if (
    !board ||
    typeof board !== 'object' ||
    !Number.isInteger(house) ||
    house < 1 ||
    house > 16
  ) {
    return null;
  }

  return board.housesByNumber?.[house] || board.houses?.[house - 1] || null;
}
