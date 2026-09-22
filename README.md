# Tactile-JEPA website

Static research website for **Tactile-JEPA: Topology-Aware Self-Supervised Representation Learning for Distributed Tactile Sensors**.

## GitHub Pages

In Settings → Pages, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save. GitHub publishes subsequent pushes automatically; no build tools or separate server are required. The empty .nojekyll file disables Jekyll processing.

Expected address: https://bosbobos.github.io/Tactile-JEPA/

- / — academic edition (main page)
- /academic/ — academic edition alias
- /original/ — original presentation edition
- /editorial/ — editorial edition

All links are relative and work under the repository's /Tactile-JEPA/ prefix. Shared JavaScript, geometry, masks and images live at the repository root. There is no dependency on the earlier Sites hosting.

## Local preview

From this directory:

```sh
conda run --no-capture-output -n IAD python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173/. Direct file:// viewing cannot fetch geometry JSON.

## Editing and validation

Edit index.html for the main page, academic/index.html for its alias, and the other editions in their folders. app.js and layouts.js are shared by all editions. To publish changes, commit and push to main.

```sh
node --check app.js
node scripts/check-data.mjs
node scripts/check-layouts.mjs
```

## Data and figures

See data/provenance.json. The website includes repository sensor graphs and illustrative masks, plus the supplied teaser11.pdf and pretrain2.pdf and their PNG renderings. Results are transcribed from the manuscript. Raw recordings, model checkpoints and training code are not bundled.

Flat / 3D changes display coordinates only. Socks and DECO 3D shapes are illustrative, not measured poses; Xela uses a saved hand geometry. Graph adjacency, node IDs and masks are preserved. The manuscript uses fixed sensor adjacency for mask sampling. Read the provenance notes before changing scientific content.
