# Native PDF product screens

The seven Amaranth 10 screens are extracted from the supplied `Amaranth10 제품 소개서.pdf`, pages 18–23. `source-manifest.json` records the feature page, embedded image index, native dimensions, and pixel hash. The capture objects are shared across facing pages in this PDF.

`sources/` contains the unchanged native RGB capture pixels. Published PNGs use deterministic 2× Lanczos interpolation only. No learned super-resolution, OCR, text replacement, sharpening, or generated UI is applied. The original capture limits the recoverable detail; larger exports do not create missing text information.

Normal page previews are capped at the native capture width to avoid enlarging small text excessively. All original image content and aspect ratios are retained. Run `tools/prepare-brochure-screens.py` with the source PDF path to repeat extraction, or without arguments to export the retained source captures.

The NAHAGO home/detail composition is separate at `assets/subpages/flat-screens/nahago-mobile.png`. It uses the higher-resolution matching captures from the previously supplied WEHAGO service leaflet (PDF pages 55–56, corresponding to pages 56–57 in `WEHAGO 제품소개서(2).pdf`). Five existing phone crops are preserved and exported without sharpening or learned restoration by `tools/prepare-nahago-mobile.py`.
