#svl-panel-server

A web-based control panel server which allows multiple simultaneous web clients to work with [JMRI][]. This webserver is no longer a server, JMRI hosts the files and you update the panels SVG files via Inkscape and VS Code.

_NOTE: The panels are designed to work only at the [Silicon Valley Lines Model Railroad Club][]. You can replace the files in userPanels with your own to control your own layout (building upon the format as described in the docs directory). Place these files in your JMRI prefs folder so they do not get wiped out during updates on Mac and Linux.

## Deploying panel changes

JMRI serves the panels from a copy in its preferences folder, **not** from this
repo. So after editing files here you must copy them into the JMRI `svg` folder
and reload the panel in the browser. On this machine that folder is:

```
~/Library/Preferences/JMRI/My_JMRI_Railroad.jmri/svg
```

### Step 1 — bust the browser cache (only when a `.js` changed)

SVG panels load their JavaScript with `xlink:href`, which browsers cache very
aggressively — a redeploy will keep running the **old** code until the cache is
cleared. To avoid that, every panel's local script reference carries a `?v=<n>`
query (e.g. `../core/PanelCommon.js?v=2`). Bumping that number makes each new
version a distinct URL the browser is forced to refetch.

Run this after changing **any** panel script (it rewrites all panel SVGs and
auto-increments the version):

```bash
cd static/web/svg/core
python3 bump_cache_version.py            # ?v=2 -> ?v=3 across all panel SVGs
# or pin an explicit version: python3 bump_cache_version.py --version 7
```

External scripts (socket.io, absolute/remote URLs) are left untouched.

> If you changed only an `.svg` (no script edits), you can skip the bump — but
> bumping is always safe.

### Step 2 — copy the files into JMRI

Because the bump rewrites **every** panel SVG, copy all the panel files (static
files, so copying the whole set is the simplest reliable approach):

```bash
JM="$HOME/Library/Preferences/JMRI/My_JMRI_Railroad.jmri/svg"
REPO="$(pwd)/static/web/svg"          # run from the repo root

cp "$REPO"/userPanels/*.svg "$JM/userPanels/"
cp "$REPO"/userPanels/*.js  "$JM/userPanels/"
cp "$REPO"/core/*.js        "$JM/core/"
cp "$REPO"/core/*.svg       "$JM/core/"
```

To deploy a single file instead, copy just that file plus the bumped SVGs that
reference it.

### Step 3 — reload

Hard-refresh the panel in the browser (**Cmd-Shift-R**). Thanks to the `?v=`
bump, a normal reload will also pick up the new scripts.

##Software License

Copyright (c) 2011-2023 Silicon Valley Lines Model Railroad Club

This software is released under the "The MIT License":

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Silicon Valley Lines Model Railroad Club]: <http://www.siliconvalleylines.com/>
[nodejs]: <http://nodejs.org/>
[JMRI]: <http://jmri.sf.net/>
[socket.io]: <http://socket.io/>
[connect]: <http://www.senchalabs.org/connect/>
[JSON]: <http://json.org/>
