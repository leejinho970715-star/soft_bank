# Native product screens for the October 20 website revision

The PNG files preserve the original pixels from the supplied product proposals. No product UI text was generated or redrawn.

- WEHAGO portal: logistics enhancement proposal, page 33. Three consecutive image strips rejoined at their original scale.
- WEHAGO mobile: the same proposal, page 39.
- Accounting and invoice processing: the same proposal, page 17. Two consecutive strips rejoined at their original scale.
- Configurable shipment input and integrated logistics: the same proposal, page 28. Full native screens retained.
- Service icons: the supplied WEHAGO ONE AI proposal, page 4. Supplementary code-native SVG symbols are in `assets/service-icons/`.
- Amaranth desktop and mobile: previously retained official Amaranth product catalogs. See `manifest.json` for source pages and native dimensions.

Use `tools/extract-october-reference-assets.py` to repeat extraction from the originals. The build uses these committed exports and does not need the source documents.

`amaranth-portal-highres.png` (2x) and `amaranth-mobile-highres.png` (3x) are Lanczos resamples of the native Amaranth screens with a light unsharp mask, used by the 1240px home mockup. AI upscaling was rejected because it rewrote small labels and faces. Rebuild them with `tools/prepare-home-amaranth-highres.py`.
