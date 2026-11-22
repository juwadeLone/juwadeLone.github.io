#!/usr/bin/env python3
"""Import NASA/JPL SAR scenes under the linked JPL image-use policy.

These are external application illustrations, never juwade board test results.
Requires Pillow; does not affect the dependency-free static website.
"""
import hashlib
import io
import json
from pathlib import Path
from urllib.request import urlopen

from PIL import Image

POLICY = "https://www.jpl.nasa.gov/jpl-image-use-policy/"
SCENES = [
    ("PIA01791", "san-francisco", "San Francisco Bay, California", "NASA/JPL",
     "space-radar-image-of-san-francisco-california"),
    ("PIA01706", "amazon-manaus", "Manaus, Brazil", "NASA/JPL-Caltech",
     "space-radar-image-of-manaus-brazil"),
    ("PIA01349", "death-valley", "Death Valley, California", "NASA/JPL",
     "color-image-of-death-valley-california-from-sir-c"),
]


def main():
    output = Path(__file__).resolve().parents[1] / "assets" / "sar" / "scenes"
    output.mkdir(exist_ok=True)
    manifest_path = output / "provenance.json"
    previous = {}
    if manifest_path.exists():
        previous = {s["id"]: s for s in json.loads(manifest_path.read_text())["scenes"]}
    scenes = []
    for ident, name, place, credit, slug in SCENES:
        original = f"https://images-assets.nasa.gov/image/{ident}/{ident}~orig.jpg"
        content = urlopen(original, timeout=45).read()
        original_digest = hashlib.sha256(content).hexdigest()
        if ident in previous and previous[ident]["original_sha256"] != original_digest:
            raise ValueError(f"Source bytes changed for {ident}; review before updating provenance")
        with Image.open(io.BytesIO(content)) as source:
            native = source.size
            image = source.convert("RGB")
        image.thumbnail((1800, 1800))
        file = name + ".webp"
        image.save(output / file, "WEBP", quality=87)
        scenes.append({
            "id": ident, "file": file, "place": place,
            "instrument": "SIR-C/X-SAR", "credit": credit,
            "source": f"https://www.jpl.nasa.gov/images/{ident.lower()}-{slug}/",
            "original_url": original,
            "original_width": native[0], "original_height": native[1],
            "original_sha256": original_digest,
            "width": image.width, "height": image.height,
            "sha256": hashlib.sha256((output / file).read_bytes()).hexdigest(),
            "changes": "Resized proportionally to 1800px maximum; WebP compression. Cards/banner crop with CSS; full local image remains uncropped. No recoloring.",
        })
    manifest_path.write_text(json.dumps({
        "scope": "External real-world SAR application illustrations, not juwade board outputs or validation data.",
        "policy_url": POLICY,
        "usage": "JPL public-site images may be used for any purpose with credit, subject to caption-specific ownership and policy exceptions. These captions credit NASA/JPL or NASA/JPL-Caltech; no third-party ownership is stated. No endorsement is implied.",
        "scenes": scenes,
    }, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(scenes)} credited NASA/JPL SAR scenes.")


if __name__ == "__main__":
    main()
