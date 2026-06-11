#!/usr/bin/env python3
"""Inject blockname="<name>" metadata into dispatch panel SVGs.

Reads the canonical block-number -> name map from the layout-control-webgui
`block-names.js` (window.SVL_BLOCK_NAMES) and writes a matching `blockname`
attribute onto every track element whose id is BLOCK<n> (including segment
suffixes like BLOCK574A / BLOCK574B). TrainLabel text elements are left alone.

The attribute is metadata only — the dispatch runtime does not depend on it —
so this is a safe, idempotent annotation pass. Re-running updates names in
place rather than duplicating them.

Usage:
    python3 inject_block_names.py [--dry-run] [--names /path/to/block-names.js]

By default it edits ../userPanels/*.svg next to this script and locates
block-names.js automatically (deployed svg root, then the sibling
layout-control-webgui repo).
"""
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
PANELS_DIR = os.path.normpath(os.path.join(HERE, "..", "userPanels"))

NAME_CANDIDATES = [
    os.path.join(HERE, "..", "block-names.js"),                       # deployed svg root
    os.path.normpath(os.path.join(HERE, "..", "..", "..", "..", "..",
                     "layout-control-webgui", "block-names.js")),     # sibling repo
    os.path.expanduser("~/Documents/GitHub/layout-control-webgui/block-names.js"),
]

TAG_RE = re.compile(r"<(?:path|rect|line|polyline|polygon|ellipse|circle|g)\b[^>]*?>", re.S)
ID_RE = re.compile(r'id="BLOCK(\d+)([A-Za-z]*)"')
EXISTING_BLOCKNAME_RE = re.compile(r'\s*blockname="[^"]*"')


def load_names(path):
    """Parse `123: 'Name'` pairs out of block-names.js."""
    txt = open(path, encoding="utf-8").read()
    names = {}
    for m in re.finditer(r"(\d+)\s*:\s*'([^']*)'", txt):
        names[m.group(1)] = m.group(2)
    return names


def find_names_file(explicit):
    for cand in ([explicit] if explicit else []) + NAME_CANDIDATES:
        if cand and os.path.isfile(cand):
            return cand
    return None


def process_tag(tag, names, stats):
    m = ID_RE.search(tag)
    if not m:
        return tag
    num, suffix = m.group(1), m.group(2)
    if "Label" in suffix:                 # BLOCK###TrainLabel etc.
        return tag
    if num not in names:
        stats["missing"].add(num)
        return tag
    # Idempotent: drop any existing blockname, then insert the canonical one
    # immediately after the id attribute.
    cleaned = EXISTING_BLOCKNAME_RE.sub("", tag)
    id_attr = 'id="BLOCK%s%s"' % (num, suffix)
    new_tag = cleaned.replace(id_attr, id_attr + ' blockname="%s"' % names[num], 1)
    stats["written"] += 1
    stats["blocks"].add(num)
    return new_tag


def process_file(path, names, dry_run):
    src = open(path, encoding="utf-8").read()
    stats = {"written": 0, "blocks": set(), "missing": set()}
    out = TAG_RE.sub(lambda mm: process_tag(mm.group(0), names, stats), src)
    changed = out != src
    if changed and not dry_run:
        open(path, "w", encoding="utf-8").write(out)
    return changed, stats


def main():
    args = sys.argv[1:]
    dry_run = "--dry-run" in args
    explicit = None
    if "--names" in args:
        explicit = args[args.index("--names") + 1]

    names_file = find_names_file(explicit)
    if not names_file:
        print("ERROR: could not find block-names.js. Pass --names <path>.", file=sys.stderr)
        return 1
    names = load_names(names_file)
    print("Using names from: %s (%d blocks)" % (names_file, len(names)))
    print("Panels dir:       %s" % PANELS_DIR)
    print("Mode:             %s\n" % ("DRY RUN (no writes)" if dry_run else "writing in place"))

    all_missing = set()
    total_written = 0
    for svg in sorted(glob.glob(os.path.join(PANELS_DIR, "*.svg"))):
        changed, stats = process_file(svg, names, dry_run)
        if stats["written"] or stats["missing"]:
            flag = "*" if changed else " "
            print("%s %-34s %3d block-tags  (%d distinct blocks)%s" % (
                flag, os.path.basename(svg), stats["written"], len(stats["blocks"]),
                "  missing: " + ",".join(sorted(stats["missing"], key=int)) if stats["missing"] else ""))
        total_written += stats["written"]
        all_missing |= stats["missing"]

    print("\nTotal block-tags annotated: %d" % total_written)
    if all_missing:
        print("Blocks present in panels but absent from block-names.js: %s"
              % ", ".join(sorted(all_missing, key=int)))
    print("Done." + ("" if not dry_run else "  (dry run — nothing written)"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
