# juwade · Signal systems

Chinese / English FPGA solution showcase, built with plain HTML, CSS and JavaScript.
The previous research dashboard is preserved, unchanged, at `research.html`.

## Run locally

No dependency install or build is needed:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Open the server's root page. This is also compatible with GitHub Pages.
The storefront makes no third-party asset requests and requires no backend.

## Catalog and translations

`assets/site.js` contains the bilingual catalog, reference specifications, source links,
UI translations and inquiry behavior. All product specifications describe existing
research implementations; availability, final hardware, licensing, price and mission
qualification are **not** asserted. Board illustrations are explicitly conceptual.
Replace them with approved product photography when available.

The three research sources are:

- [CSA / Kintex-7 SAR](https://github.com/juwadeLone/2048-2048cs-k7-sem)
- [Fault-tolerant FFT](https://github.com/juwadeLone/fault_tolerant_SDF_FFT_designs)
- [BP fault-injection platform](https://github.com/juwadeLone/BP_FT_platform)

Select Chinese / English in the header. The preference is stored locally;
`?lang=zh` and `?lang=en` provide explicit language links.
The retained research dashboard is the original Chinese page.

## Inquiries

The validated form creates a visible email draft addressed to the existing public
contact address, `1906233797@qq.com`. It does **not** send, upload or store inquiries.
Visitors explicitly open their email application to send it. Copy and UTF-8 text
download fallbacks work without an email handler. Only the language preference is
persisted; no contact data is saved to local storage.

Before a commercial launch, confirm the contact address, actual product configurations,
photos, availability, commercial rights and delivery terms with the owner. This initial
site has no payment, customer database, analytics or flight-qualification claims.

## Checks

## Experiment datasheets

Each product links to a bilingual, self-contained HTML datasheet under `datasheets/`.
Visitors can print/save PDF, download an offline HTML copy, or download its evidence JSON.
SAR figures are recounted from per-shot JSONL (`task.outcome`); BP figures preserve the
original campaign summary and 50 dB criterion, including Wilson intervals and exclusions.
Source links are pinned to commits and include original file SHA-256 digests.
The generator reads committed source bytes, ignoring staged/unstaged source edits.
Source links may require repository access and may return 404 for unauthorized readers;
downloadable JSON provides aggregate results/digests, not private raw logs. This PR
does not change repository visibility or publish the original experiment records.
FFT has a reference sheet with an explicit missing-numeric-results statement, not
invented measurement figures. Injection results are not radiation/flight qualification.

Regenerate all sheets from the three sibling checkouts:

```sh
python3 scripts/build_datasheets.py --help
python3 scripts/build_datasheets.py
```

## Validation

```sh
node --check assets/site.js
node --test tests/site.test.cjs
python3 -m unittest discover -s tests -p 'test_*.py'
```

## Corporate storefront and public SAR scenes

The homepage uses an original corporate product-portal layout: full-width SAR
banner, product center, application imagery, engineering capabilities, downloads,
and technical enquiry. The layout takes inspiration from the Milianke reference
site; its branding, images, claims and page code are not copied.

Three **real-world** NASA/JPL SIR-C/X-SAR scenes show San Francisco Bay, the
Manaus/Amazon region, and Death Valley. They illustrate SAR applications, **not
juwade board output, validation data, or a CSA/BP performance comparison**.
Cards and the hero crop thumbnails; the linked local images keep the complete
frame, resized proportionally and WebP-compressed without recoloring. Each
caption credits its NASA/JPL source; the site links the image-use policy and
states that credits do not imply endorsement. No NASA/JPL logos are used.

`assets/sar/scenes/provenance.json` records official source/download URLs,
caption credits, image-use policy, transformations, dimensions, and SHA-256
digests for both original downloads and local files. To reproduce, install
Pillow in your Python environment and run:

```sh
python3 scripts/import_public_sar.py
```

The script rejects changed original-source bytes when a manifest exists.
The static site itself has no Pillow, package, external-image or build dependency.

## SAR algorithms and board-validation images

The bilingual `#sar-imaging` section explains SAR focusing, the chirp scaling
algorithm (CSA), and back-projection (BP), with links to the matching products
and datasheets. Inside the expandable board-validation panel, three figures are original synthetic-point research
plots: FPGA nine-target output, a floating-point point-response reference, and
one fault-injection comparison. They are not terrain imagery or a CSA/BP
performance comparison. No GF-3 scene data or raw echoes are published.

Figure paths, pinned source commits, dimensions and SHA-256 digests are in
`assets/sar/provenance.json`. Reimport exact source bytes with:

```sh
python3 scripts/import_sar_figures.py --source ../2048-2048cs-k7-sem
```

Source links require repository access. Local gallery images and full-size
copies remain available without access to the source repository.
