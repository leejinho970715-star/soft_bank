# User-accepted AI product screens

All 28 regenerated candidates are applied at 34 image placements by explicit user request on 2026-10-23. Known text and UI differences remain in manifest.json; these images are not certified identical to their originals.

Native assets remain unchanged at each originalFile path in manifest.json.

To restore all originals and keep them restored across builds:

    node tools/apply-reviewed-screen-variants.mjs --restore
    npm run build

To reapply all generated variants:

    node tools/apply-reviewed-screen-variants.mjs --apply
    npm run build

The manifest records each image hash, original path, page placements and known differences.
