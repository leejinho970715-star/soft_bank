# Verified product captures, 2026-10-23

These assets replace the additionally flagged generated screenshots. `manifest.json` records each original source, crop, output dimensions, and native pixel SHA-256. Exported images contain the original capture pixels; smaller captures use deterministic Lanczos interpolation only. No OCR, learned restoration, sharpening, or generated text is applied.

| Screen | Selected source |
| --- | --- |
| Smart A10 four-module overview | Retained official four-panel composition, `official-corrected/sources/smart-a10-modules.png` |
| Smart A10 personal income tax | Main complete UI region of retained official `official-corrected/sources/income-tax.png` |
| WEHAGO fax | Supplied `WEHAGO 제품소개서.pdf`, PDF page 51 (printed page 52), full device panel |
| ONE News / ONE Studio | Retained original official `oneai-hq/reference-4.png` and `reference-5.png`; only the headline area already represented as HTML is omitted |
| PMS contract status | Retained official `original/d04779dd94eecf.png` |
| OmniEsol Groupware / ONECHAMBER / ONEFFICE | Original embedded captures retained before generated variants, as mapped in `regenerated/manifest.json` |

The supplied PDFs do not contain an identical ONE News, ONE Studio, or standalone PMS contract screen. Those placements therefore use the matching original captures rather than an unrelated product interface. See `brochure-screens/README.md` for the seven Amaranth 10 PDF captures and the NAHAGO source selection.

Normal previews stay within the original capture width. Increasing the export dimensions does not recover details absent from the source. The fax crop excludes the rest of the brochure page; the full PDF/page is not published.
