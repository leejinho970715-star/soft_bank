# Real product screen exports

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
- No generated/retyped text, redesigned UI, added device frame, or source-content crop.

`tools/product-screen-quality.mjs` applies this mapping after the legacy and native
screen mappings. The main-page preview and image dialog use the same complete PNG.
