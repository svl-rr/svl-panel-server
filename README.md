# SVL Panel Server

A web-based control panel interface that allows multiple simultaneous web clients to interact with [JMRI][] (Java Model Railroad Interface).

Originally built with a standalone Node.js server, the system now runs directly on JMRI's internal web server and WebSocket JSON interface. Panel graphics are authored and edited in [Inkscape][], with control logic written in JavaScript.

> **Note:** The panels and configurations in this repository are designed for the [Silicon Valley Lines Model Railroad Club][] layout. However, the architecture and core communication libraries can be adapted for any JMRI-controlled model railroad by replacing the panels in `userPanels` and tailoring the turnout, sensor, and memory addresses.

---

## Architecture & How It Works

- **Web Server:** JMRI's built-in HTTP server hosts the static files (`HTML`, `SVG`, `JS`, and `CSS`).
- **Real-Time Communication:** Clients connect to JMRI's JSON WebSocket endpoint (`/json/`) using `ServerComms.js`.
  - Automatically adapts to HTTP (`ws://`) or HTTPS (`wss://`) and works across arbitrary ports and reverse proxies.
  - Bi-directional synchronization keeps track occupancy, turnout states, and dispatch memories updated across all connected devices in real time.
  - Automatic reconnection with exponential backoff and connection keep-alive pings.

## Repository Structure

```
├── README.md                      # Project documentation
├── svl-config.xml                 # Canonical JMRI layout configuration file
├── static/
│   ├── index.html                 # Web root redirect to panel index
│   └── web/svg/
│       ├── core/                  # Core communication and panel logic
│       │   ├── ServerComms.js     # WebSocket connection & JMRI JSON protocol handler
│       │   ├── PanelCommon.js     # Base panel interactions, turnout & sensor UI
│       │   ├── DispatchCommon.js  # Dispatcher board logic & CTC route handling
│       │   ├── PanelDefs.svg      # Shared SVG symbol library (signals, switches, LEDs)
│       │   └── *.sh               # Utility scripts (turnout/block address auditing)
│       ├── userPanels/            # Layout SVG panels & station-specific scripts
│       │   ├── index.svg          # Visual layout map & panel launcher
│       │   ├── panelMatrix.html   # Overview matrix of all mainline/branch panels
│       │   ├── dispatchMatrix.html# Overview matrix for dispatcher panels
│       │   └── *.svg / *.js       # Station and yard panels (Cavanaugh, Fremont, etc.)
│       ├── docs/                  # SVL Soft Panel specification & DCC turnout lists
│       └── test/                  # Test fixtures and experimental panels
```

---

## Getting Started

### 1. JMRI Web Server Setup
1. Launch **JMRI** (PanelPro).
2. Ensure the **JMRI Web Server** and **JSON Server** are enabled in JMRI Preferences (**Preferences > Start Up > Add > Start Web Server**).
3. Place or link the contents of the `static` directory in your JMRI user files / preferences directory so JMRI serves the files statically without being overwritten during JMRI application upgrades.

### 2. Accessing the Panels
- Open any modern web browser and navigate to:
  ```
  http://<jmri-host>:<port>/
  ```
  *(Default JMRI web server port is typically `12080` or configured locally to `3000` / `80`)*
- The browser will load the interactive layout map (`index.svg`) where you can click any station or yard to open its control panel.
- To view multiple panels simultaneously, open `panelMatrix.html` or `dispatchMatrix.html`.

### 3. Editing and Creating Panels
- **Graphics:** Open panel SVG files in [Inkscape][]. Ensure element `id` attributes match JMRI hardware names (e.g., `TO123` for turnouts, `BLOCK45` for occupancy blocks).
- **Scripts:** Edit matching `.js` files in `userPanels/` using VS Code or your preferred text editor.
- **Symbol Library:** Run `static/web/svg/core/copyPanelDefsToAll.sh` to propagate updated definitions from `PanelDefs.svg` across all user panels.

---

## Software License

Copyright (c) 2011-2026 Silicon Valley Lines Model Railroad Club

This software is released under the "The MIT License":

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Silicon Valley Lines Model Railroad Club]: http://www.siliconvalleylines.com/
[JMRI]: https://www.jmri.org/
[Inkscape]: https://inkscape.org/
[JSON]: https://www.json.org/
