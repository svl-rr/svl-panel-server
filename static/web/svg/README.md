# SVL Layout Control Center

Web-based dashboard and tools for operating the [Silicon Valley Lines](http://www.siliconvalleylines.com/) model railroad. Provides a central homepage linking to all layout control applications, designed to be hosted directly from JMRI's built-in web server.

## Overview

The Layout Control Center is a single-page dashboard (`home.html`) that links to five tools used during operating sessions:

| Tool | Port | Description |
|------|------|-------------|
| **Panel Server** | 3000 | JMRI's built-in panel server — track diagrams and dispatcher controls |
| **Cab Cam Assignment** | 8080 | Assign MJPEG camera streams to locomotives in the roster |
| **Signal Editor** | 5057 | Configure signal masts, aspects, route logic, and dispatch control |
| **Train Status** | — | Live dispatch board — each train's current named block, zone occupancy, event log, session stats, and replay |
| **LCC Node Registry** | 5059 | Browse and back up OpenLCB/LCC nodes on the layout bus |

Train Status and the LCC Node Registry are static HTML pages served alongside the dashboard. The other tools run as separate services on their own ports.

### Shared assets

Three files at the repo root are shared across pages and must be deployed to the SVG folder root alongside `home.html`:

- **`svl-theme.css`** — SVL brand theme (colors, header, cards) used by every page.
- **`svl-logo.svg`** — the SVL logo shown in page headers.
- **`block-names.js`** — the single source of truth mapping JMRI block numbers to names (e.g. `574 → Paso`). Loaded by Train Status. To rename a block, edit this file only; see [`block-names-review.md`](block-names-review.md) for open questions on a few South-end blocks.

## Hosting in JMRI

JMRI's web server can serve static files from the user preferences directory. For SVL, the repo contents are deployed directly into the SVG folder so they are served via the existing JMRI web server alias:

```
/Users/svl/Documents/GitHub/svl-panel-server/static/web/svg/
├── home.html                         ← Dashboard
├── svl-theme.css                     ← Shared theme (required by all pages)
├── svl-logo.svg                      ← Shared logo
├── block-names.js                    ← Shared block-number → name map
├── start-services.sh                 ← Service launcher
├── train-status/web/train-status.html
├── node-reg/web/node-registry.html
├── cam-assignment-gui/               ← Runs as a separate service
└── mast-editor/                      ← Runs as a separate service
```

> The dispatch panels themselves (`DispatchNorth.svg`, etc.) live in the
> sibling **svl-panel-server** repo, also served from this SVG folder. Train
> Status' replay feature embeds those panels read-only.

Once in place, open the dashboard at:

```
http://localhost:3000/prefs/svg/home.html
```

## Project Structure

```
layout-control-webgui/
├── home.html                  # Dashboard homepage
├── deploy.sh                  # Mirrors this repo into JMRI's svg/ folder
├── start-services.sh          # Starts all Python backend services
├── com.svl.layout-control.plist  # macOS LaunchAgent for auto-start at login
├── cam-assignment-gui/        # Cab Cam Assignment (Python/Flask, port 8080)
│   ├── server.py              # Flask routes
│   ├── jmri_client.py         # JMRI JSON API HTTP helpers
│   ├── roster_xml.py          # roster.xml / locomotive XML file helpers
│   ├── camera_store.py        # Camera library (cameras.json) storage
│   ├── stream_health.py       # Background TCP reachability checker for camera streams
│   ├── templates/index.html
│   ├── static/{style.css,app.js}
│   ├── cameras.json
│   ├── reload_roster.py       # JMRI Jython script for roster sync
│   └── README.md
├── mast-editor/               # Signal Editor (Python/Flask, port 5057)
│   ├── app.py
│   ├── jmri_variables.py
│   ├── templates/
│   ├── static/
│   └── README.md
├── node-reg/                  # LCC Node Registry (Python, port 5059)
│   ├── lcc_node_service.py
│   ├── web/
│   └── README.md
├── train-status/              # Train Status (static HTML)
│   ├── web/
│   └── README.md
├── block-names.js             # Shared block-number → name map
├── block-names-review.md      # Open questions on a few block names
├── svl-theme.css              # Shared SVL theme
├── svl-logo.svg               # Shared SVL logo
└── README.md                  # This file
```

## Prerequisites

- **JMRI** with the web server enabled (default port 3000)
- **Python 3.9+** for the Cab Cam Assignment and Signal Editor services
- **Python 3.8+** for the LCC Node Registry service (stdlib only, no pip dependencies)
- A modern web browser

## Getting Started

### 1. Deploy the dashboard

Clone the repo, then use the included `deploy.sh` to mirror it into the SVG folder served by JMRI. The script only touches files this repo owns — it leaves any pre-existing JMRI panel content in that folder (`core/`, `docs/`, `test/`, `train-log/`, `userPanels/`, `index.html`) untouched, even though it uses `rsync --delete` to keep the rest in sync.

```bash
git clone https://github.com/<your-org>/layout-control-webgui.git
cd layout-control-webgui
./deploy.sh --dry-run   # preview what would change
./deploy.sh             # deploy for real
```

By default it targets `~/Library/Preferences/JMRI/My_JMRI_Railroad.jmri/svg`. Override with `JMRI_PREFS_DIR` if your profile lives elsewhere (e.g. the SVL machine's symlinked location):

```bash
JMRI_PREFS_DIR=/Users/svl/Documents/GitHub/svl-panel-server/static/web ./deploy.sh
```

Re-run `./deploy.sh` any time you pull or make changes to push them live.

### 2. Install Python dependencies

```bash
pip install -r cam-assignment-gui/requirements.txt
pip install -r mast-editor/requirements.txt
# node-reg has no dependencies (stdlib only)
```

### 3. Start the backend services

Run all three services at once with the included startup script:

```bash
bash start-services.sh
```

The script kills any previous instances on ports 8080/5057/5059, then starts:

| Service | Port | Log file |
|---------|------|----------|
| Cab Cam Assignment | 8080 | `/tmp/svl-cam-assignment.log` |
| Signal Editor | 5057 | `/tmp/svl-signal-editor.log` |
| LCC Node Registry | 5059 | `/tmp/svl-node-registry.log` |

The Signal Editor requires a path to `signal_config.yaml`. By default the script uses `/Users/svl/Documents/GitHub/svl-signal-server/signal_config.yaml`. Override it with the `SVL_CONFIG_PATH` environment variable:

```bash
SVL_CONFIG_PATH=/path/to/signal_config.yaml bash start-services.sh
```

### 4. Auto-start at macOS login (LaunchAgent)

The services can start automatically when the user logs in. The included
installer generates the LaunchAgent with the correct absolute paths derived from
the repo location and your home directory — no hand-editing required:

```bash
bash install-launchagent.sh
```

If your `signal_config.yaml` isn't in the default location, point to it:

```bash
SVL_CONFIG_PATH=/path/to/signal_config.yaml bash install-launchagent.sh
```

**Uninstall:**

```bash
bash install-launchagent.sh --uninstall
```

The installer writes `~/Library/LaunchAgents/com.svl.layout-control.plist`,
auto-detects the Homebrew path (Apple Silicon vs Intel), and (re)loads the
agent. Logs go to `/tmp/svl-layout-control.log`. The committed
`com.svl.layout-control.plist` remains as a hand-editable reference template.

### 5. Open the dashboard

Navigate to `http://localhost:3000/prefs/svg/home.html` in your browser. All tools are accessible from the dashboard cards.

## Component Documentation

Each tool has its own detailed README:

- [Cab Cam Assignment](cam-assignment-gui/README.md) — camera stream management and roster editing
- [Signal Editor](mast-editor/README.md) — signal configuration with diagram view and live aspects
- [LCC Node Registry](node-reg/README.md) — OpenLCB node discovery, CDI browsing, and config backup
- [Train Status](train-status/README.md) — real-time dispatch board showing each train's current named block, with zone tracking, persistent event log, session stats, CSV export, session replay, and kiosk mode

## License

MIT — see [LICENSE](LICENSE) for details.
