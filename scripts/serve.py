#!/usr/bin/env python3
"""Serve the static site with WebP support, including on minimal Python VMs."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class SiteHandler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".webp": "image/webp"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    handler = partial(SiteHandler, directory=str(root))
    with ThreadingHTTPServer(("0.0.0.0", args.port), handler) as server:
        print(f"Serving {root} on port {args.port}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
