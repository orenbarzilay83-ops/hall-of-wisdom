import * as AQLA from './hawi-figure-aqla.js';
import * as ATABA_DAKHILA from './hawi-figure-ataba-dakhila.js';
import * as ATABA_KHARIJA from './hawi-figure-ataba-kharija.js';
import * as BAYAD from './hawi-figure-bayad.js';
import * as HAYYAN from './hawi-figure-hayyan.js';
import * as HUMRA from './hawi-figure-humra.js';
import * as IJTIMA from './hawi-figure-ijtima.js';
import * as JAMAA from './hawi-figure-jamaa.js';
import * as JUDLA from './hawi-figure-judla.js';
import * as NAKIS from './hawi-figure-nakis.js';
import * as NAQI_KHAD from './hawi-figure-naqi-khad.js';
import * as NUSRA_DAKHILA from './hawi-figure-nusra-dakhila.js';
import * as NUSRA_KHARIJA from './hawi-figure-nusra-kharija.js';
import * as QABD_DAKHIL from './hawi-figure-qabd-dakhil.js';
import * as QABD_KHARIJ from './hawi-figure-qabd-kharij.js';
import * as TARIQ from './hawi-figure-tariq.js';

function resolveFigure(moduleExports, fileName) {
  const candidates = Object.values(moduleExports);

  const figure =
    candidates.find((value) => value && typeof value === 'object' && typeof value.id === 'string') ||
    moduleExports.default;

  if (!figure || typeof figure !== 'object' || typeof figure.id !== 'string') {
    throw new Error(`Invalid hawi figure transit file: ${fileName}`);
  }

  return figure;
}

export const HAWI_FIGURE_TRANSITS_LIST = [
  resolveFigure(AQLA, 'hawi-figure-aqla.js'),
  resolveFigure(ATABA_DAKHILA, 'hawi-figure-ataba-dakhila.js'),
  resolveFigure(ATABA_KHARIJA, 'hawi-figure-ataba-kharija.js'),
  resolveFigure(BAYAD, 'hawi-figure-bayad.js'),
  resolveFigure(HAYYAN, 'hawi-figure-hayyan.js'),
  resolveFigure(HUMRA, 'hawi-figure-humra.js'),
  resolveFigure(IJTIMA, 'hawi-figure-ijtima.js'),
  resolveFigure(JAMAA, 'hawi-figure-jamaa.js'),
  resolveFigure(JUDLA, 'hawi-figure-judla.js'),
  resolveFigure(NAKIS, 'hawi-figure-nakis.js'),
  resolveFigure(NAQI_KHAD, 'hawi-figure-naqi-khad.js'),
  resolveFigure(NUSRA_DAKHILA, 'hawi-figure-nusra-dakhila.js'),
  resolveFigure(NUSRA_KHARIJA, 'hawi-figure-nusra-kharija.js'),
  resolveFigure(QABD_DAKHIL, 'hawi-figure-qabd-dakhil.js'),
  resolveFigure(QABD_KHARIJ, 'hawi-figure-qabd-kharij.js'),
  resolveFigure(TARIQ, 'hawi-figure-tariq.js'),
];

export function normalizeHawiFigureTransitId(id) {
  if (typeof id !== 'string' || !id.trim()) {
    return null;
  }

  const cleanId = id.trim();

  if (cleanId.startsWith('hawi-figure-')) {
    return cleanId;
  }

  return `hawi-figure-${cleanId}`;
}

export const HAWI_FIGURE_TRANSITS_BY_ID = Object.fromEntries(
  HAWI_FIGURE_TRANSITS_LIST.flatMap((figure) => {
    const shortId = figure.id.replace(/^hawi-figure-/, '');

    return [
      [figure.id, figure],
      [shortId, figure],
    ];
  })
);

export function getHawiFigureTransit(id) {
  const normalizedId = normalizeHawiFigureTransitId(id);

  return (
    HAWI_FIGURE_TRANSITS_BY_ID[id] ||
    HAWI_FIGURE_TRANSITS_BY_ID[normalizedId] ||
    null
  );
}

export function getHawiFigureHouseMeaning(id, house) {
  const figure = getHawiFigureTransit(id);

  if (!figure) {
    return null;
  }

  const houseNumber = Number(house);

  if (!Number.isInteger(houseNumber) || houseNumber < 1 || houseNumber > 16) {
    return null;
  }

  if (!Array.isArray(figure.houses)) {
    return null;
  }

  return (
    figure.houses.find((item) => Number(item.house) === houseNumber) ||
    figure.houses[houseNumber - 1] ||
    null
  );
}
