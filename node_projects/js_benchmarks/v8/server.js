var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('PRIVKEY2.PEM', 'utf8');
var certificate = fs.readFileSync('new-servercert.cer', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();

app.get('/hello.txt', function(req, res) {
	var body = 'Hello world';
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.get('/v8', function(req, res){
	res.sendfile(__dirname + '/run.html');
});

app.get('/*', function(req, res){
	var resource = req.params[0];
	// console.log(resource);
	res.sendfile(resource);
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3001);
httpsServer.listen(4001);
console.log('Listening on port 3001 for http ad port 4001 for https');