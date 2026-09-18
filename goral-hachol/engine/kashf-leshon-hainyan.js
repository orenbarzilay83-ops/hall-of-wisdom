/**
 * kashf-leshon-hainyan.js
 *
 * לשון העניין — כשף אל-אסראר עמ' 109, 112.
 *
 * Wave 3 final disposition:
 * The source wording is preserved, but the mechanical derivation is not
 * verified strongly enough for runtime use. Page 112 gives two descriptions
 * that must not be silently collapsed into one invented algorithm:
 *   1) "لسان الأمر ... وهو البيت الثامن، ولد من البيت الأول وبيت الضمير"
 *   2) "الشكل الحاصل من ضرب بيت الضمير في ثلثيه، وهو الخامس والتاسع"
 *
 * The former experimental implementation combined the Dhamir house with
 * houses 5 and 9 and could also auto-run the legacy Dhamir majority. That
 * behavior is deliberately removed. This module is now documentation-only
 * until a source-faithful derivation and Golden Test are available.
 */

export const LESHON_HAINYAN_RUNTIME_POLICY = Object.freeze({
  status: 'DEFERRED_UNTIL_ALGORITHM_VERIFIED',
  runtimeEligible: false,
  sourceRef: "כשף אל-אסראר עמ' 109, 112",
  sourceArabicAnchors: [
    'لسان الأمر ... وهو البيت الثامن، ولد من البيت الأول وبيت الضمير',
    'الشكل الحاصل من ضرب بيت الضمير في ثلثيه، وهو الخامس والتاسع',
  ],
  reason:
    'המקור מאמת את קיום לשון העניין ואת תפקידו, אך אינו סוגר באופן חד-משמעי ' +
    'כיצד לאחד מכנית את תיאור בית 8 הנולד מבית 1+בית הדמיר עם ניסוח ' +
    'הכאת בית הדמיר ב"שני שלישיו" — 5 ו-9. אין לבחור נוסחה אחת בהשערה.',
});

export function computeLeshonHainyan() {
  return {
    blocked: true,
    runtimeEligible: false,
    status: LESHON_HAINYAN_RUNTIME_POLICY.status,
    sourceRef: LESHON_HAINYAN_RUNTIME_POLICY.sourceRef,
    reason: LESHON_HAINYAN_RUNTIME_POLICY.reason,
  };
}

export default { LESHON_HAINYAN_RUNTIME_POLICY, computeLeshonHainyan };
