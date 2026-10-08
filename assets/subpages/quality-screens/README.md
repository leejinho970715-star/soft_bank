# Product screen clarity exports

Applied to Amaranth 10, nonprofit Amaranth 10 and selected WEHAGO screens.
`manifest.json` records each prior asset, public source, native input size/hash,
output size/hash, edge removal, scale, sharpening and transparent padding.

- Prefer larger native official PDF/help-center screenshots when they show the same feature.
- Reject larger screenshots when their native JPEG compression makes the UI less legible.
- Retain the existing CRM screenshot for that reason; use its original UI pixels.
- For inputs below 1800px, use Lanczos3 at 2x and the recorded mild sharpening.
  This improves rendering edges but **cannot recover detail absent from the source**.
- Remove only the verified 2px decorative perimeter of screen sharing, financial
  services and budget screenshots. Preserve all internal table lines and labels.
- KEEP uses the larger native KEEP view from the product brochure, without a
  device composite or decorative border.
- Export lossless RGBA PNG with 12px transparent outer padding. Internal white
  backgrounds belong to the real UI and remain opaque.
- Most entries preserve the original product pixels without generated text.
- On 2026-10-08 the user explicitly authorized generated clarity improvement
  for eight selected blurry screens when clearer originals were unavailable.
  Those entries use `*-restored-v2.png` and are recorded separately in
  `reconstruction-20261008.json`, including the source references and prompts.
  They are reconstructed illustrations based on actual screens, not pixel-exact
  native captures. Example data and fine visual details may differ.
- Reconstruction keeps each feature's layout, title, navigation, tables and
  controls, with reviewed Korean text. No new device frame is added.
- Keep all white UI panels opaque. Transparent background generation can remove
  white interface regions incorrectly, so generate an opaque screen and add
  a uniform 12px true-alpha exterior only during PNG export.
- Keep the complete exported rectangle in both the page and image dialog.

`tools/product-screen-quality.mjs` applies this mapping after the legacy and native
screen mappings. The main-page preview and image dialog use the same complete PNG.
