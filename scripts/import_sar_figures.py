#!/usr/bin/env python3
"""Publish only pinned synthetic-point figures, not GF-3 scenes or raw echoes."""
import argparse
import hashlib
import json
from pathlib import Path
import struct
import subprocess

COMMIT = "b9c7ece95b6882c0872890720a81a64072540c25"
FIGURES = {
    "point-target-board.png": ("results/k7_port/point3x3w_focus_board.png", "FPGA fixed-point output"),
    "point-target-focus.png": ("experiments/seu_mechanism/point_focus.png", "Floating-point reference"),
    "point-target-injection.png": ("results/k7_cram/sem_campaign_pt3x3w/figs/sdc_0001_C.png", "Single fault-injection example"),
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="Local 2048-2048cs-k7-sem clone")
    args = parser.parse_args()
    output = Path(__file__).resolve().parents[1] / "assets" / "sar"
    output.mkdir(exist_ok=True)
    figures = []
    for name, (path, processing) in FIGURES.items():
        content = subprocess.check_output(["git", "-C", str(args.source), "show", f"{COMMIT}:{path}"])
        assert content[:8] == b"\x89PNG\r\n\x1a\n"
        width, height = struct.unpack(">II", content[16:24])
        (output / name).write_bytes(content)
        figures.append({
            "file": name, "width": width, "height": height,
            "dataset": "Synthetic point targets", "processing": processing,
            "source_path": path, "commit": COMMIT,
            "sha256": hashlib.sha256(content).hexdigest(),
            "url": f"https://github.com/juwadeLone/2048-2048cs-k7-sem/blob/{COMMIT}/{path}",
        })
    manifest = {
        "attribution": "juwade / 2048-2048cs-k7-sem research repository",
        "source_access": "Repository access required; links may return 404 without permission.",
        "scope": "Original, unmodified synthetic-point figures; no GF-3 scene imagery or raw echoes.",
        "figures": figures,
    }
    (output / "provenance.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(figures)} pinned synthetic-point figures.")


if __name__ == "__main__":
    main()
