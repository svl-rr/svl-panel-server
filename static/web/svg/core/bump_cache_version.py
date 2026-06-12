#!/usr/bin/env python3
"""Bump the ?v=<n> cache-busting query on panel script references.

Browsers cache the JS that SVG panels load via xlink:href very aggressively, so
a redeploy can keep serving stale code (a recurring trap during development).
Appending ?v=<n> makes each new version a distinct URL the browser must
refetch. Run this after changing any panel script, then redeploy and reload —
the new version forces fresh JS without clearing the cache by hand.

  python3 bump_cache_version.py            # auto-increment the version
  python3 bump_cache_version.py --version 5

External scripts (socket.io, absolute/remote URLs) are left untouched.
"""
import os
import re
import sys
import glob

HERE = os.path.dirname(os.path.abspath(__file__))
ROOTS = [os.path.join(HERE, "..", "userPanels"), HERE]   # userPanels + core SVGs

# xlink:href="<relative path>.js" with an optional existing ?v=N
HREF_RE = re.compile(r'(xlink:href=")([^":]+?\.js)(\?v=\d+)?(")')


def is_local(path):
    return not (path.startswith("/") or path.startswith("http"))


def svg_files():
    files = []
    for r in ROOTS:
        files += glob.glob(os.path.join(r, "*.svg"))
    return sorted(files)


def current_max_version(files):
    mx = 0
    for f in files:
        for m in re.finditer(r'\.js\?v=(\d+)"', open(f, encoding="utf-8").read()):
            mx = max(mx, int(m.group(1)))
    return mx


def main():
    args = sys.argv[1:]
    files = svg_files()
    if "--version" in args:
        version = int(args[args.index("--version") + 1])
    else:
        version = current_max_version(files) + 1

    print("Setting cache version ?v=%d across %d SVG files\n" % (version, len(files)))

    def repl(m):
        if not is_local(m.group(2)):
            return m.group(0)
        return "%s%s?v=%d%s" % (m.group(1), m.group(2), version, m.group(4))

    changed_files = 0
    total_refs = 0
    for f in files:
        src = open(f, encoding="utf-8").read()
        out = HREF_RE.sub(repl, src)
        if out != src:
            open(f, "w", encoding="utf-8").write(out)
            refs = len(re.findall(r"\.js\?v=%d\"" % version, out))
            print("  %-34s %d script refs" % (os.path.basename(f), refs))
            changed_files += 1
            total_refs += refs

    print("\nUpdated %d files (%d refs) to ?v=%d." % (changed_files, total_refs, version))
    print("Redeploy the SVGs + scripts, hard-refresh once, and future runs auto-increment.")


if __name__ == "__main__":
    main()
