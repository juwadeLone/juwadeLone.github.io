"""Extract the selected measured figures from the owner's Second Brain PDFs.

Requires PyMuPDF and Pillow only when importing. No PDF is copied to this site.
The public manifest retains authorship, experimental context and file hashes.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets/sar/papers"
PAPERS = [
    {
        "title": "A Nonorthogonal Cartesian Fast BP Algorithm for High-Squint Spaceborne SAR Imaging",
        "authors": "Pengwei Lan, Guang-Cai Sun, Jixiang Xiang, Mengdao Xing, Likun Liu, Tianyi Sun",
        "doi": "10.1109/TGRS.2026.3672193", "year": 2026,
        "figures": [(13, 928, 21, "dubai-no-cfbp.webp", "Smartsat-X1 data acquired over Dubai on 2025-07-28; focused with NO-CFBP. Section V-B, Fig. 21.")],
    },
    {
        "title": "A Real-Time Unified Focusing Algorithm RT-UFA for Multi-Mode SAR via Azimuth Sub-Aperture Complex-Valued Image Combining and Scaling",
        "authors": "Guang-Cai Sun, Yanbin Liu, Mengdao Xing, Shiyu Wang, Jun Yang, Zheng Bao, Min Bao",
        "doi": "10.1109/TGRS.2021.3104598", "year": 2022,
        "figures": [
            (14, 273, 19, "airborne-spotlight.webp", "Airborne spotlight SAR, focused with RT-UFA. Section V-B and Table V; not the neighboring GF-3 figures."),
            (15, 292, 22, "airborne-tops.webp", "Airborne Ku-band TOPS SAR, focused with RT-UFA. Section V-B-4 and Table VII."),
        ],
    },
]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--paper-root", type=Path, default=ROOT.parent / "juwade-second-brain")
    parser.add_argument("--check", action="store_true", help="Check delivered image hashes without importing PDFs")
    args = parser.parse_args()
    if args.check:
        manifest = json.loads((DEST / "provenance.json").read_text(encoding="utf-8"))
        for scene in manifest["scenes"]:
            assert sha((DEST / scene["file"]).read_bytes()) == scene["sha256"], scene["file"]
        print("Measured-paper figure hashes match.")
        return
    import fitz
    from PIL import Image

    commit = subprocess.check_output(["git", "-C", str(args.paper_root), "rev-parse", "HEAD"], text=True).strip()
    manifest = {
        "scope": "Measured SAR figure excerpts from papers in the owner's Second Brain, not this storefront's FPGA board outputs or benchmarks.",
        "rights": "Copyright remains with IEEE and the respective authors. Selected figure excerpts at the owner's request; no open license or publisher endorsement is claimed. No original PDFs or raw echoes are redistributed.",
        "changes": "Embedded raster images extracted without cropping, recoloring, contrast adjustment or upscaling; lossless WebP encoding. Full images remain available; frames are decorative, not real-time processing.",
        "repository": "https://github.com/juwadeLone/juwade-second-brain", "commit": commit,
        "scenes": [],
    }
    DEST.mkdir(exist_ok=True)
    for paper in PAPERS:
        relative = "文献/SAR成像算法/" + paper["title"] + ".pdf"
        pdf = (args.paper_root / relative).read_bytes()
        pinned = subprocess.check_output(["git", "-C", str(args.paper_root), "show", commit + ":" + relative])
        assert pdf == pinned, "PDF differs from pinned repository revision: " + relative
        doc = fitz.open(stream=pdf, filetype="pdf")
        for page, xref, figure, filename, context in paper["figures"]:
            assert xref in [im[0] for im in doc[page - 1].get_images()], filename
            embedded = doc.extract_image(xref)["image"]
            image = Image.open(io.BytesIO(embedded))
            image.save(DEST / filename, "WEBP", lossless=True, method=6)
            with Image.open(DEST / filename) as result:
                assert result.convert("RGB").tobytes() == image.convert("RGB").tobytes()
            manifest["scenes"].append({
                "file": filename, "width": image.width, "height": image.height,
                "sha256": sha((DEST / filename).read_bytes()), "embedded_sha256": sha(embedded),
                "title": paper["title"], "authors": paper["authors"], "year": paper["year"],
                "doi": "https://doi.org/" + paper["doi"], "figure": figure, "pdf_page": page,
                "pdf_path": relative, "pdf_sha256": sha(pdf), "pdf_xref": xref,
                "source": manifest["repository"] + "/blob/" + commit + "/" + quote(relative),
                "source_access": "Repository access may be required; use the DOI for the publisher record.",
                "context": context,
            })
        doc.close()
    (DEST / "provenance.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Extracted three measured figures; decoded pixels unchanged.")


if __name__ == "__main__":
    main()
