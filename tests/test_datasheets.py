"""Regression checks for evidence provenance; uses only Python's standard library."""
import hashlib
import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest


SPEC = importlib.util.spec_from_file_location(
    "datasheets", Path(__file__).resolve().parents[1] / "scripts/build_datasheets.py")
datasheets = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(datasheets)


class EvidenceProvenance(unittest.TestCase):
    def test_dirty_checkout_does_not_change_pinned_evidence(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            def git(*args):
                return subprocess.check_output(["git", "-C", str(repo), *args])
            git("init", "--quiet")
            original = b'{"count": 800}\n'
            evidence_file = repo / "summary.json"
            evidence_file.write_bytes(original)
            git("add", "summary.json")
            git("commit", "--quiet", "-m", "Add evidence")
            sha = datasheets.commit(repo)
            evidence_file.write_text('{"count": 999}\n')
            git("add", "summary.json")
            evidence_file.write_text('{"count": 1}\n')
            sources = []
            actual = datasheets.read(repo, "summary.json", sources, "example", sha)
            self.assertEqual(actual, original)
            self.assertEqual(sources[0]["sha256"], hashlib.sha256(original).hexdigest())
            self.assertEqual(sources[0]["commit"], sha)
            self.assertIn("/blob/" + sha + "/", sources[0]["url"])


if __name__ == "__main__":
    unittest.main()
