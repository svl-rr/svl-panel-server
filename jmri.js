var http = require('http');
var parser = require('xml2json');

function xmlioRequest(host,port,parms,callback) {

	var postData = parser.toXml(parms);
	var postOptions = {
	  host: host,
	  port: port,
	  path: '/xmlio',
	  method: 'POST',
	  headers: {
		  'Content-Type': 'text/xml',
		  'Content-Length': postData.length
	  }
	};

	var responseXML = [];
	
	var req = http.request(postOptions, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (dataChunk) {
		  responseXML.push(dataChunk);
	  });
  
	  res.on('end',function () {
		var jsonData = parser.toJson(responseXML.toString());
		console.log(responseXML.toString());
		console.log(jsonData);
		if (typeof(callback) == 'function') {
			callback(jsonData);
		}
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
	console.log('sending: '+postData);
	req.write(postData);
	req.end();
}

exports.xmlioRequest = xmlioRequest;
