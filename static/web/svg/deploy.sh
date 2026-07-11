#!/bin/bash
# Deploy this repo to the JMRI profile directory JMRI actually serves pages
# and runs scripts from, mirroring it exactly (deletes stale files at the
# destination that no longer exist in the source).
#
# The destination also holds JMRI's own legacy panel content (core/, docs/,
# test/, train-log/, userPanels/, index.html) that predates this repo and
# isn't tracked here — those are explicitly excluded so --delete can never
# touch them.
#
# Usage:
#   ./deploy.sh           # mirror for real
#   ./deploy.sh --dry-run # show what would change, without touching anything

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
JMRI_PREFS_DIR="${JMRI_PREFS_DIR:-$HOME/Library/Preferences/JMRI/My_JMRI_Railroad.jmri}"
DEST="$JMRI_PREFS_DIR/svg"

RSYNC_FLAGS=(-a --delete
  --exclude='.git/'
  --exclude='.claude/'
  --exclude='.gitignore'
  --exclude='.DS_Store'
  --exclude='__pycache__/'
  --exclude='*.pyc'
  --exclude='.pytest_cache/'
  --exclude='cam-assignment-gui/tests/'
  --exclude='cam-assignment-gui/pytest.ini'
  --exclude='cam-assignment-gui/requirements-dev.txt'
  # JMRI's own legacy panel content — never managed by this repo
  --exclude='core/'
  --exclude='docs/'
  --exclude='test/'
  --exclude='train-log/'
  --exclude='userPanels/'
  # leading slash anchors this to the repo root only — unanchored, this
  # would also match (and silently exclude) cam-assignment-gui/templates/
  # index.html and mast-editor/templates/index.html, which it did until
  # this fix.
  --exclude='/index.html'
  # Live runtime data the deployed app writes to (saved cameras, operator
  # assignments) — not deployed source. Without this, --delete would
  # silently overwrite real operating-session data with whatever's
  # (possibly stale) in the repo on every deploy.
  --exclude='cam-assignment-gui/cameras.json'
  --exclude='cam-assignment-gui/operators.json'
  # Experimental go2rtc/WebThrottle scaffolding — gitignored, has its own
  # camera-deploy.sh for pushing specific files to a live JMRI web/ install.
  # Never meant to be mirrored into svg/ alongside the real apps.
  --exclude='/cabcamupdate/')

if [ "${1:-}" = "--dry-run" ]; then
  RSYNC_FLAGS+=(--dry-run -v)
  echo "Dry run — showing changes only, nothing will be written."
fi

if [ ! -d "$JMRI_PREFS_DIR" ]; then
  echo "JMRI prefs dir not found: $JMRI_PREFS_DIR" >&2
  echo "Set JMRI_PREFS_DIR to override." >&2
  exit 1
fi

mkdir -p "$DEST"
echo "Source: $SCRIPT_DIR/"
echo "Dest:   $DEST/"
rsync "${RSYNC_FLAGS[@]}" "$SCRIPT_DIR/" "$DEST/"

if [ "${1:-}" != "--dry-run" ]; then
  echo "Done."
fi
