# WEHAGO extra services mockups

Built-in imagegen, 2026-09-21. Five transparent PNGs (1536 × 1024) in this directory. Assigned in the user's explicit attachment order.

| File | Section | Clipboard source |
| --- | --- | --- |
| factoring.png | 매출채권팩토링 | 3a92344b-c8e4-4422-984d-f6ae0566acd8 |
| crm.png | WE CRM | a2fb44fb-82e3-4770-934f-972f05cb3ba2 |
| pms.png | WE PMS | 94678205-2976-409a-9b0a-d811baaaa18a |
| corporate.png | 경비청구 - 법인카드 | a4b4ffe9-3d3b-4eaf-9e2b-35fe991e3d10 |
| personal.png | 경비청구 - 개인카드 | 1291a427-2bec-4068-b389-2de3b0a218aa |

## Prompt set

Common: Recreate supplied screen faithfully as a premium near-frontal 3D monitor mockup, thin dark bezel and silver stand. Entire objects visible, landscape 1536x1024. Preserve original Korean UI without reinterpreting subject. Genuine transparent PNG alpha outside objects; no backdrop, floor or checkerboard.

- Factoring: preserve accounting evidence dashboard, receipt at right and cyan Smart A10 hub with 국세청, 영수증 and 신용카드 nodes. Restore cropped lower edges.
- CRM and corporate: preserve transaction table, blue general voucher toolbar, GUIDE TIP/거래처 정보 sidebar, floating 자동분개 modal with rows and apply/cancel buttons.
- PMS and personal: preserve business status table and six purple nodes 영업, 생산, 외주, 회계, 재고, 구매 around central document symbol at right.

Generated lettering may differ slightly from reference screenshots.

## High-resolution delivery (2026-09-21)

Final assets are upscaled to 3840 pixels wide with local Real-ESRGAN. Original
composition and alpha are retained; per-file model and dimensions are recorded in
`../product-upscale-manifest.json`. The initial render sizes above describe the
pre-upscale images. Transparent PNGs remain the source assets; matching high-quality
WebP copies reduce page download size. Small source lettering is not guaranteed to
be reconstructed exactly by an AI upscaler.
