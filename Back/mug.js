var request = require('request');
var fs = require('fs');
var formData = {
  files: fs.createReadStream('./checking/x.jpeg'),
};
request.post({
	url:'http://nae-165-254-189-17.jarvice.com:9080/powerai-vision/api/dlapis/505302f0-f5de-47a5-a125-e2ea8990e1d8',
	formData: formData
	}, function optionalCallback(err, httpResponse, body) {
  		if (err) {
    		return console.error('upload failed:', err);
  		}
  		if(JSON.parse(body).classified.length>=1)
  			console.log(1);
  		else
  			console.log(0);
  	});
