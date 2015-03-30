#svl-panel-server

A web-based control panel server which allows multiple simultaneous web clients to work with [JMRI][]. At this point the server is used only to provide support to 1st gen iPads, which can not communicate with JMRI directly via websockets.

_NOTE: The panels are designed to work only at the [Silicon Valley Lines Model Railroad Club][]. You can replace the files in userPanels with your own to control your own layout (building upon the format as described in the docs directory)._

##How Does it work?
svl-panel-server is built upon [connect][] and [socket.io][], and relays [JSON][] messages to the [JMRI][] miniWebServer via WebSockets.
Server-side and client-side JavaScript is used to glue everything together.

Each client establishes a [socket.io][] connection to this server. The client sends  messages via the connection to either look up or manipulate the layout state. Whenever the state of the layout changes, each connected client receives update message to keep the user interfaces in synch everywhere.

##Installing the Software
* Install [JMRI][]
* Install [nodejs][]
* Download The Sources
* Install required modules with "npm install"

##Running the Server
Launch JMRI and start the miniWebServer before running via:

	node app.js

##Software License

Copyright (c) 2011-2012 Silicon Valley Lines Model Railroad Club

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
