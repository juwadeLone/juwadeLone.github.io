#!/usr/bin/env python3
"""Serve the existing seu_platform application without changing its source tree.

The public storefront stays static; this optional Python app runs separately.
"""
import argparse
import os
import sys
from http.server import ThreadingHTTPServer
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8090)
    args = parser.parse_args()
    siblings = Path(__file__).resolve().parents[2]
    platform = Path(os.environ.get("SEU_PLATFORM_ROOT", siblings / "seu-platform"))
    package = platform / "code/layout_ecc_sim"
    if not (package / "desktop/app.py").is_file():
        parser.error("Set SEU_PLATFORM_ROOT to a checkout of juwadeLone/seu_platform")
    os.environ.setdefault("ORBIT_SEU_ROOT", str(siblings / "tcas/code/orbit_seu"))
    sys.path.insert(0, str(package))
    # Upstream desktop routes import orbit_env as a sibling module.
    sys.path.insert(0, str(package / "desktop"))
    from desktop.app import _make_handler
    from layout_ecc import gui
    from desktop.orbit_env import compute_orbit_payload
    compute_orbit_payload()  # Fail startup clearly if the real spectra/model are missing.
    with ThreadingHTTPServer(("0.0.0.0", args.port), _make_handler(gui)) as server:
        print(f"Radiation simulation platform listening on port {args.port}", flush=True)
        server.serve_forever()


if __name__ == "__main__":
    main()
