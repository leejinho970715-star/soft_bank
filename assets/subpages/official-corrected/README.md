# Corrected product mockups — 2026-10-06

These 21 transparent RGBA PNGs replace the confirmed mismatches in the official product image audit. Six placements correct reversed screen mappings; fifteen use the matching official function screens. The source page, corrected feature, file dimensions and hashes are recorded in `manifest.json`.

Every final image is 2,560 pixels wide. Original UI pixels and their aspect ratio are preserved, so small text retains the detail available in its original source; increasing the output size does not invent missing source detail. `composition.json` records the source and crop for each image. The PNG exterior is fully transparent; the monitor frame is black.

The black monitor material was created with the built-in image generation tool, with transparent background enabled. Prompt intent: a high-resolution, photorealistic black desktop monitor template, front-facing and centered, with a clean matte black bezel and black stand; a blank screen without UI, text, icons or logos; the complete monitor inside the canvas with clean edges and a fully transparent background.

The final interface is composed from the recorded original screen pixels using native Canvas, rather than generated text. Serve the repository locally and open `/tools/render-official-product-mockups.html` to reproduce the compositions. The page exposes each PNG as the corresponding `png-<key>` textarea data URL. The renderer's checkerboard is preview-only and is not included in the PNG.

The existing product generator applies only these feature-scoped corrections through `tools/official-product-image-corrections.mjs`. Other placements sharing the previous source files are preserved.
