# Tactile-JEPA website

Static research website for **Tactile-JEPA: Topology-Aware Self-Supervised Representation Learning for Distributed Tactile Sensors**.

## GitHub Pages

In Settings → Pages, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save. GitHub publishes subsequent pushes automatically; no build tools or separate server are required. The empty .nojekyll file disables Jekyll processing.

Expected address: https://bosbobos.github.io/Tactile-JEPA/

- / — academic edition (main page)
- /academic/ — academic edition alias
- /academic-balanced/ — preserved balanced edition (commit 2536c24)
- /academic-plain/ — preserved plain academic edition (commit a1027aa)
- /interactive-v1/ — preserved version before the paper-style introduction update (commit eb26791)
- /original/ — archived presentation edition
- /editorial/ — archived editorial edition

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

## Academic page

The academic edition is the public entry point. It follows a restrained paper-page layout, with serif typography, ruled sections and standard data tables. Downstream tasks use visible buttons and remember the last selection for each dataset. Error bars stay centred on their bars at every screen width. Its dataset selector controls the graph and results together; target strategy, sampling playback, layout and target/context controls stay close to the figure. Four muted target colours and local/global marker shapes distinguish overlapping masks. Display settings do not alter reported experimental scores.

The paper and author affiliations are linked to [arXiv:2609.24385](https://arxiv.org/abs/2609.24385). The research code is at [E-Kovtun/tactile](https://github.com/E-Kovtun/tactile); this repository hosts only the website.

## Data and figures

See data/provenance.json. The website includes repository sensor graphs and illustrative masks, plus the supplied teaser11.pdf and pretrain2.pdf and their PNG renderings. Results are transcribed from the manuscript. Raw recordings, model checkpoints and training code are not bundled.

Flat / 3D changes display coordinates only. Socks and DECO 3D shapes are illustrative, not measured poses; Xela uses a saved hand geometry. Graph adjacency, node IDs and masks are preserved. The manuscript uses fixed sensor adjacency for mask sampling. Read the provenance notes before changing scientific content.

## Brand assets

The Sber AI logo is sourced from the [official Sber AI team page](https://developers.sber.ru/kak-v-sbere/teams/sberai). The arXiv, GitHub and Hugging Face SVG icons are from [Simple Icons](https://github.com/simple-icons/simple-icons) (CC0). Brand marks remain the property of their respective owners.

The preserved `/interactive-v1/` page has its own HTML, stylesheet and renderer; it reuses the unchanged geometry and image assets. The main page pairs the teaser with the abstract and paper/code/checkpoint links, with the Sber AI mark under the affiliations. Abstract percentages are reported in arXiv:2609.24385v1 (20.8% orientation error and 6.3% force error reductions).

## Preserved plain edition

`/academic-plain/` preserves the published academic version from commit `a1027aa`, including its own styles and renderer. It shares only the unchanged data and image assets. The main edition keeps the paper typography while using a compact figure-control margin and understated blue accents.

## Preserved balanced edition

`/academic-balanced/` preserves commit `2536c24` with its own styles, renderer and layout code. The main page adds dataset thumbnails derived from the flat sensor coordinates, a clearer target palette and brief result transitions. Reduced-motion preferences disable these transitions. Numerical results, graph adjacency and sampling remain unchanged.

The current academic page places task-specific result commentary beside the bar chart on wider screens. Illustrated dataset profiles link to the corresponding explorer view. Ablation glyphs distinguish local and global targets; highlighted cells mark the best reported mean within each column, without implying statistical significance.

The colour system distinguishes dataset identity (blue / terracotta / violet), individual targets, and compared methods. Method colours stay constant across tasks; target colours stay constant across datasets. Text labels and marker shapes remain available alongside colour. Preserved editions retain their original monochrome sketch assets.
