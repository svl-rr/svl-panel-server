#svl-panel-server

A web-based control panel server which allows multiple simultaneous web clients to work with [JMRI][].

_NOTE: The program is specifically designed to work only at the [Silicon Valley Lines Model Railroad Club][]._

##How Does it work?
svl-panel-server is built upon [connect][] and [socket.io][], and works in concert with the [JMRI][] miniWebServer.
Server-side and client-side JavaScript is used to glue everything together.
At startup, the server connects to the JMRI server to determine the state of each turnout and sensor.
Subsequent updates to the layout state are obtained via XmlHttpRequest.

Each client establishes a [socket.io][] connection back to the server.
The client sends [JSON][] messages via the connection to either look up or manipulate the layout state.
Whenever the state of the layout changes, each connected client receives update message to keep the user interfaces in synch everywhere.

##Installing the Software
* Install [JMRI][]
* Install [nodejs][]
* Download The Sources
* Install required modules with "npm install"

##Running the Server
Launch JMRI and start the miniWebServer before running via:

	node app.js

##Software License

This software is released under the "The MIT License":

>Copyright (c) 2011-2012 Silicon Valley Lines Model Railroad Club

>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[Silicon Valley Lines Model Railroad Club]: <http://www.siliconvalleylines.com/>
[nodejs]: <http://nodejs.org/>
[JMRI]: <http://jmri.sf.net/>
[socket.io]: <http://socket.io/>
[connect]: <http://www.senchalabs.org/connect/>
[JSON]: <http://json.org/>
