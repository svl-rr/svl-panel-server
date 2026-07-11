#!/bin/bash
# ── SVL Layout Control — LaunchAgent Installer ─────────────────────────────
#
# Generates and installs the macOS LaunchAgent so the Python services start at
# login — without hand-editing absolute paths. All paths are derived from this
# script's own location and your home directory.
#
#   bash install-launchagent.sh            # install (or reinstall)
#   bash install-launchagent.sh --uninstall
#
# Override the signal config path if it isn't in the default location:
#   SVL_CONFIG_PATH=/path/to/signal_config.yaml bash install-launchagent.sh
# ───────────────────────────────────────────────────────────────────────────
set -euo pipefail

LABEL="com.svl.layout-control"
PLIST_DST="$HOME/Library/LaunchAgents/${LABEL}.plist"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
START_SCRIPT="$SCRIPT_DIR/start-services.sh"
SVL_CONFIG_PATH="${SVL_CONFIG_PATH:-$HOME/Documents/GitHub/svl-signal-server/signal_config.yaml}"

# Homebrew bin differs on Apple Silicon (/opt/homebrew) vs Intel (/usr/local).
BREW_BIN="/opt/homebrew/bin"; [ -d "$BREW_BIN" ] || BREW_BIN="/usr/local/bin"

uninstall() {
  if [ -f "$PLIST_DST" ]; then
    launchctl unload "$PLIST_DST" 2>/dev/null || true
    rm -f "$PLIST_DST"
    echo "Uninstalled $LABEL"
  else
    echo "Nothing to uninstall ($PLIST_DST not found)"
  fi
}

if [ "${1:-}" = "--uninstall" ]; then
  uninstall
  exit 0
fi

# ── Preflight ──────────────────────────────────────────────────────────────
[ -f "$START_SCRIPT" ] || { echo "ERROR: start-services.sh not found at $START_SCRIPT" >&2; exit 1; }
if [ ! -f "$SVL_CONFIG_PATH" ]; then
  echo "WARNING: signal config not found at $SVL_CONFIG_PATH"
  echo "         The Signal Editor will be skipped until the path is valid."
  echo "         Re-run with SVL_CONFIG_PATH=/correct/path to fix."
fi

# ── Generate plist ─────────────────────────────────────────────────────────
mkdir -p "$(dirname "$PLIST_DST")"
cat > "$PLIST_DST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LABEL}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>${START_SCRIPT}</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>SVL_CONFIG_PATH</key>
        <string>${SVL_CONFIG_PATH}</string>
        <key>PATH</key>
        <string>${BREW_BIN}:/usr/local/bin:/usr/bin:/bin</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>StandardOutPath</key>
    <string>/tmp/svl-layout-control.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/svl-layout-control.log</string>
</dict>
</plist>
PLIST

# ── (Re)load ───────────────────────────────────────────────────────────────
launchctl unload "$PLIST_DST" 2>/dev/null || true
launchctl load "$PLIST_DST"

echo "Installed $LABEL"
echo "  start script : $START_SCRIPT"
echo "  signal config: $SVL_CONFIG_PATH"
echo "  homebrew bin : $BREW_BIN"
echo "  logs         : /tmp/svl-layout-control.log"
echo "Services will start now and at every login. Uninstall: bash install-launchagent.sh --uninstall"
