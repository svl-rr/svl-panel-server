// panel.js -- Get/Set Data Routines for processing WebSocket requests
//
// (The MIT License)
//
// Copyright (c) 2012 Silicon Valley Lines Model Railroad Club
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

$(document).ready(function() {
	var socket = io.connect();
	
	socket.on('connect', function () {
		console.log("CONNECTED");
		getPanelState();
	});

	socket.on('disconnect', function () {
		console.log("DISCONNECTED");
	});

	socket.on('update', function (data) {
		console.log('UPDATE');
		for (var i in data) {
			SetItemState(data[i]["name"],data[i]["value"]);
		}
	});

	$(".turnout").click(function(event) {
		event.preventDefault();
		var $target = $(event.target);
		var newState = $target.hasClass('thrown') ? 'closed' : 'thrown';
		socket.emit('set',[{type:'turnout', name:event.target.id, value:newState}]);
	});

	$("#get-button").click(function () {
		getPanelState();
	});
	
	function getPanelState() {
		socket.emit('get',GetActivePanelElements());
	};

	$("#reset-button").click(function resetState() {
		socket.emit('set',GetActivePanelElementsInitialState());
	});
});


//	SetItemState
//
//	Modify Panel Element Appearance based upon supplied id and state.
//	This function is called in response to receiving an update message
//	from the panel server via the web socket connection.
//
//	Item appearance in this example is modified by manipulating CSS
//	properties with jQuery. 

function SetItemState(itemId,itemState) {
	var theElement = document.getElementById(itemId);
	
	if (theElement) {
		console.log("Updating " + itemId + " to " + itemState);
		if ($(theElement).hasClass("turnout")) {
			if (itemState === "closed") {
				$(theElement).removeClass("thrown").addClass("closed");
			} else {
				$(theElement).removeClass("closed").addClass("thrown");
			}
		} else if ($(theElement).hasClass("sensor")) {
			if (itemState === "on") {
				$(theElement).removeClass("off").addClass("on");
			} else {
				$(theElement).removeClass("on").addClass("off");
			}
		}
	}
}
