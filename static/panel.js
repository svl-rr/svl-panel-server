$(document).ready(function() {
	var socket = io.connect();
	
	socket.on('connect', function () {
		console.log("CONNECTED");
		socket.send('hello');
	});

	socket.on('message', function (message) {
		console.log('SERVER:'+message);
	});

	socket.on('disconnect', function () {
		console.log("DISCONNECTED");
	});

	socket.on('update', function (data) {
		console.log('UPDATE');
		for (i in data) {
			SetItemState(data[i]["name"],data[i]["state"]);
		}
	});

	$("div.turnout").click(function(event) {
		event.preventDefault();
		var $target = $(event.target);
		$target.toggleClass("thrown closed");
		var newState = $target.hasClass('thrown') ? 'thrown' : 'closed';
		socket.emit('set',[{name:event.target.id, state:newState}]);
	});

	$("div.logo").click(function(event) {
		event.preventDefault();
		$("#i1").toggleClass("on off");
		var newState = $('#i1').hasClass('on') ? 'on' : 'off';
		socket.emit('set',[{ name:'i1', state:newState}]);
	});

});
	
function SetItemState(itemId,itemState) {
	var theElement = document.getElementById(itemId);
	
	if (theElement) {
		console.log("Updating " + itemId + " to " + itemState);
	}
}