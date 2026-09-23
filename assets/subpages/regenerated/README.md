# Product presentation assets

These PNGs were recreated with the built-in image generation tool from the existing product references at the user's request. They are presentation illustrations, not pixel-identical software captures. Source mappings and generation prompts are recorded in `manifest.json`. Native generated resolution is retained; WebP alternatives are encoded at quality 97.

Device compositions face forward. Flat UI assets receive a separate CSS frame; compositions already containing devices do not receive a second frame. Transparent PNG alpha is retained outside device and 3D silhouettes.

`ui-084.png` is the separately requested Smart A10 3D ecosystem. `pms-workflow-3d.png` and `manufacturing-workflow-3d.png` are text-free 3D workflows. Their Korean titles and descriptions are rendered as HTML in `tools/pms-assets.mjs`, so those labels stay sharp and editable.

The OmniEsol dashboard and video meeting visual were regenerated again to correct identified text/background problems. The original source files remain available under their existing directories.
