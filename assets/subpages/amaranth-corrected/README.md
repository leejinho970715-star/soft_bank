# Amaranth10 feature corrections

These three transparent PNG presentations replace only the mismatched board,
fax/SMS and HR tax-report images in Amaranth10 and Amaranth10 (nonprofit).
They use a front-facing black-bezel desktop monitor without a mobile mockup.

Native size: 1536 × 1024 pixels. PNG alpha and generated pixels are preserved.
The built-in imagegen tool recreated the reference UI for presentation; these
are not pixel-identical software captures. Sources and complete prompts are
recorded in `manifest.json`. HR report headings were proofread and corrected.

`tools/amaranth-image-corrections.mjs` applies the six feature-scoped references
after existing screen layout rules. Existing meeting and banking image files
are not overwritten. Each PNG includes its own frame and stand, so it uses
`sb-faithful-reference` without a second CSS monitor frame.
