import {
  RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD,
  getRamlSihrMassHasadRule,
} from './spiritual-diagnostics/raml-spiritual-diagnostics-sihr-mass-hasad.js';

export const APPROVED_RAML_SOURCES = {
  id: 'approved-raml-sources',
  purposeHebrew:
    'מאגר מקורות מאושרים לגורל החול שאינם מוגבלים לספר חאוי בלבד. כל מקור כאן אושר על ידי המשתמש ונכנס כשכבת ידע לאפליקציה.',
  policy: {
    userApprovedSourcesAllowed: true,
    notLimitedToHawi: true,
    preserveArabicSource: true,
    preserveFullPracticalKnowledge: true,
    noExternalKnowledgeUnlessApproved: true,
  },
  sources: [
    RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD,
  ],
  spiritualDiagnostics: {
    sihrMassHasad: RAML_SPIRITUAL_DIAGNOSTICS_SIHR_MASS_HASAD,
  },
  summary: {
    totalSources: 1,
    domains: ['spiritual-diagnostics'],
    verifiedTerms: [
      'السحر',
      'المس',
      'الحسد',
      'الجن',
      'معيون',
      'منظور',
      'الكهانة',
      'العرافة',
      'الشعوذة',
    ],
    status: 'initial-approved-raml-source-index-created',
  },
};

export function getApprovedRamlSource(id) {
  return APPROVED_RAML_SOURCES.sources.find((source) => source.id === id) || null;
}

export function getApprovedRamlSpiritualDiagnosticRule(id) {
  return getRamlSihrMassHasadRule(id);
}

export default { APPROVED_RAML_SOURCES };

if (typeof module !== 'undefined') {
  module.exports = { APPROVED_RAML_SOURCES };
}
