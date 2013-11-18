var express = require("express"),
	http = require("http"),
	jade = require("jade"),
	stylus = require("stylus"),
	nib = require('nib'),
	app = express();



/* Set Express to use Jade, Stylus and dirs*/
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({
  src: __dirname + '/public/',
  dest: __dirname + '/public/',
  debug: true,
  force: true,
}));
app.use('/static', express.static(__dirname + '/public/'));
app.use("/styles", express.static(__dirname + '/public/styles'));

/*Server Variables */
var ipAddress = '127.0.0.1';
var portNum = 8080;

app.get("/", function(req, res) {
	res.render('template', {title:'Home'});
});

app.get("/about", function(req, res) {
	res.render('template', {title:'about'});
});

app.get("*.css", function(req, res) {
            res.header("Content-type", "text/css");

});


app.get("*", function(req, res) {
	res.render('template', {title:'Uh no! Page not found!'});
});

http.createServer(app).listen(portNum, ipAddress);
console.log('Server running at '+ipAddress+':'+portNum);
