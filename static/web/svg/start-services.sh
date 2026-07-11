#!/bin/bash
# ── SVL Layout Control Center — Service Launcher ───────────────────────────
#
# Starts all Python backend services for the layout control web GUI.
# Intended to be run at macOS login via a LaunchAgent (see below).
#
# Services started:
#   - Cab Cam Assignment   (port 8080)
#   - Signal Editor        (port 5057)
#   - LCC Node Registry    (port 5059)
#
# Install as a LaunchAgent (runs at login):
#
#   cp com.svl.layout-control.plist ~/Library/LaunchAgents/
#   launchctl load ~/Library/LaunchAgents/com.svl.layout-control.plist
#
# Logs are written to /tmp/svl-*.log
# ────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="/tmp"
SVL_CONFIG_PATH="${SVL_CONFIG_PATH:-$(eval echo ~)/Documents/GitHub/svl-signal-server/signal_config.yaml}"

echo "$(date): Starting SVL layout control services from $SCRIPT_DIR"

# ── Kill any previous instances ────────────────────────────────────────────

for PORT in 8080 5057 5059; do
  PID=$(lsof -ti :"$PORT" 2>/dev/null)
  if [ -n "$PID" ]; then
    echo "Killing existing process on port $PORT (PID $PID)"
    kill "$PID" 2>/dev/null
    sleep 1
  fi
done

# ── Cab Cam Assignment (port 8080) ─────────────────────────────────────────

echo "Starting Cab Cam Assignment on port 8080..."
cd "$SCRIPT_DIR/cam-assignment-gui"
JMRI_PREFS_DIR="${JMRI_PREFS_DIR:-$(eval echo ~)/Library/CloudStorage/GoogleDrive-jamesbrassill@siliconvalleylines.com/My Drive/Global Roster/JMRI-Roster}" \
  python3 server.py \
  >> "$LOG_DIR/svl-cam-assignment.log" 2>&1 &

# ── Signal Editor (port 5057) ──────────────────────────────────────────────
# Set SVL_CONFIG_PATH to your signal_config.yaml location.

if [ -n "$SVL_CONFIG_PATH" ]; then
  echo "Starting Signal Editor on port 5057..."
  cd "$SCRIPT_DIR/mast-editor"
  python3 app.py "$SVL_CONFIG_PATH" --jmri-host localhost --jmri-port 3000 \
    >> "$LOG_DIR/svl-signal-editor.log" 2>&1 &
else
  echo "Skipping Signal Editor — SVL_CONFIG_PATH not set"
fi

# ── LCC Node Registry (port 5059) ─────────────────────────────────────────

echo "Starting LCC Node Registry on port 5059..."
cd "$SCRIPT_DIR/node-reg"
python3 lcc_node_service.py \
  >> "$LOG_DIR/svl-node-registry.log" 2>&1 &

# ── Done ───────────────────────────────────────────────────────────────────

echo "$(date): All services started."
echo "  Cab Cam Assignment   → http://localhost:8080"
if [ -n "$SVL_CONFIG_PATH" ]; then
  echo "  Signal Editor        → http://localhost:5057"
fi
echo "  LCC Node Registry    → http://localhost:5059"

wait
