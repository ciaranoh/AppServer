var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('../../keys2/PRIVKEY2.PEM', 'utf8');
var certificate = fs.readFileSync('../../keys2/new-servercert.cer', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var app = express();

app.all('*', function(req, res, next) {
  //console.log(req.params[0]);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
 });

app.get('/hello.txt', function(req, res) {
	var body = 'Hello world';
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.get('/hello1.txt', function(req, res){
	res.send('Hello World!');
});

app.get('/path', function(req, res){
	res.send(__dirname);
})

app.get('/Navigation_Timing_Detect', function(req, res){
	res.sendfile('Navigation_Timing_Detect.html');
});

app.get('/boomerang', function(req, res){
	res.sendfile('doc/howtos/howto-0.html');
});

app.get('/episodes', function(req, res){
	res.sendfile('ex1.html');
});

app.get('/sunspider', function(req, res){
	res.sendfile(__dirname + '/js_benchmarks/sunspider/driver.html');
});

app.get('/v8', function(req, res){
	res.sendfile(__dirname + '/js_benchmarks/v8/run.html');
});

app.get('/octane', function(req, res){
	res.sendfile(__dirname + '/js_benchmarks/octane/index.html');
});

app.get('/5k_image', function(req, res){
	res.sendfile('5k_image.html');
});

app.get('/10k_image', function(req, res){
	res.sendfile('10k_image.html');
});

app.get('/15k_image', function(req, res){
	res.sendfile('15k_image.html');
});

app.get('/browser_testing', function(req, res){
	res.sendfile('browser_testing.html');
});
app.get('/browser_testing_with_proxy', function(req, res){
	res.sendfile('browser_testing_with_proxy.html');
});
app.get('/browser_testing_jquery', function(req, res){
	res.sendfile('browser_testing_jquery.html');
});

app.get('/browser_testing_jquery_without_proxy', function(req, res){
	res.sendfile('browser_testing_jquery_without_proxy.html');
});

app.get('/browser_testing_jquery_form', function(req, res){
	res.sendfile('browser_testing_jquery_form.html');
});

app.get('/browser_testing_jquery_form_without_proxy', function(req, res){
	res.sendfile('browser_testing_jquery_form_without_proxy.html');
});

app.get('/auto_print_results', function(req, res){
	res.sendfile('auto_print_results.html');
});

app.get('/checkAjax', function(req, res){
	res.sendfile('ajax_supported.html');
});

app.get('/ajax_info.html', function(req, res){
	res.sendfile(__dirname + '/ajax_info.html');
});

var count = 0;
app.get('/2k', function(req, res){
	res.sendfile('2k.html');
	console.log((++count) + " 2k");
});


app.get('/5k', function(req, res){
	res.sendfile('5k.html');
	console.log((++count) + " 5k");
});

app.get('/10k', function(req, res){
	res.sendfile('10k.html');
	console.log((++count) + " 10k");
});

app.get('/10k_with_images', function(req, res){
	res.sendfile('10k_with_images.html');
});


app.get('/250k', function(req, res){
	res.sendfile('250k.html');
});
app.get('/100k', function(req, res){
	res.sendfile('100k.html');
	console.log((++count) + " 100k");
});

app.get('/images/:imageFile', function(req, res){
	var image_file = "images/" + req.params.imageFile;
	// console.log(image_file);
	res.sendfile(image_file);
})

app.get('/jquery_demo', function(req, res){
	res.sendfile(__dirname + '/jquery_demo/haha.html');
});

app.get('/jquery_demo/*', function(req, res){
	var resource = 'jquery_demo/' + req.params[0];
	// console.log(resource);
	res.sendfile(resource);
});

app.get('/favicon.ico', function(req, res){
	res.writeHead(200, {'Content-Type': 'image/x-icon'});
	res.end();
});

app.get('/*', function(req, res){
	var resource = req.params[0];
	// console.log(resource);
	res.sendfile(resource);
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(4000);
//app.listen(3000);
console.log('Listening on port 3000 for http ad port 4000 for https');