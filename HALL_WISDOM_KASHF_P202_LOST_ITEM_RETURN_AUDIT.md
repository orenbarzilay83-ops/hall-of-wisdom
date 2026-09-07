# Kashf p202 — Lost-item return canonical audit

## Runtime intent
- Intent: `lostItem.return`
- Canonical method: `lostItem.p202.returnH6H8`
- Houses used: H6 and H8 only.
- Shared by the explicit lost-item route and its lost-animal alias. It is not a theft-attribution method.

## Primary-source rule
Arabic scan, printed p201 / working p202:

> في الضال ورجوعها: أقصد البيتين الثامن والسادس، فإن حل فيها أشكال سعيدة داخلة فهي ترجع، وإلا فلا.

Working Hebrew:

> באבדה ובשיבתה: כוון אל הבית השמיני והשישי. אם נמצאו שם צורות מיטיבות פנימיות — האבדה תשוב; ואם לא — לא.

This is a conjunctive rule: both relevant houses must contain figures that satisfy both predicates. The source supplies an explicit else branch, so there is no invented middle state.

## What “internal” means here
The same source defines the four internal figures (p57):
- כבוד נכנס / النصرة الداخلة — 2211
- סף נכנס / العتبة الداخلة — 2111
- ממון נכנס / القبض الداخل — 2121
- שפל ראש / الأنكيس — 2221

It also gives the structural definition: fire row closed (2) and earth row open (1). In canonical classification this is exactly `dakhalKharij === 'dakhil'`. The mujassad fixed/mutable categories are not silently treated as internal for this rule.

## What “benefic” means here
The canonical runtime uses the repaired three-way fortune classifier. For p202, the word `سعيدة` requires the pure `saad` class. Mixed figures are not promoted via tendency metadata. Of the four internal figures above, 2211, 2111 and 2121 are benefic; 2221 is malefic.

## Contract boundary
Return = true iff:

`H6.saadNahs === 'saad' && H6.dakhalKharij === 'dakhil' && H8.saadNahs === 'saad' && H8.dakhalKharij === 'dakhil'`

Otherwise the source verdict is that it does not return. No topic bundle, Dhamir, theft profile, witness/judge bundle, or alternative method is aggregated into this verdict.
