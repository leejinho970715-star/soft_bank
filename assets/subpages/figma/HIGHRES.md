# Centered product cutouts

The existing product visuals are preserved in the same feature order. The user explicitly allowed retaining and enlarging existing mockups when that gave the more reliable result.

`tools/prepare-centered-assets.py` resamples the transparent cutouts to 3840 pixels wide with Lanczos interpolation and mild edge sharpening. This does not reconstruct or invent UI text or additional detail. Alpha is resized separately and preserved, with no solid black background added. PNG is retained and quality-94 WebP is served where supported.

Original SHA-256 hashes and output dimensions are recorded in `assets/subpages/product-upscale-manifest.json`. Existing Real-ESRGAN outputs in the custom product folders are unchanged.

The pre-change archive `output/softbank-product-mockups-20260923.zip` contains 125 PNGs, grouped by their existing product folders. It is a local deliverable and is excluded from the website deployment.
