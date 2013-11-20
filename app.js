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
app.use(express.static('public'));
app.use(express.favicon("public/images/favicon.ico")); 

/*Server Variables */
var ipAddress = '127.0.0.1';
var portNum = 8080;

/*Routes*/
app.get("/", function(req, res) {
	res.render('index', {title:'Home',
    topMargin:'30',
    primaryWrap:'none',
    aboutWrap:'none',
    blogWrap:'none',
    cvWrap:'none',
    workWrap:'none',
    addWrap:'none'
  });
});

app.get("/about", function(req, res) {
	res.render('index', {title:'About',
    topMargin:'0',
    primaryWrap:'block',
    aboutWrap:'block',
    blogWrap:'none',
    cvWrap:'none',
    workWrap:'none',
    addWrap:'none'
  });
});

app.get("/blog", function(req, res) {
	res.render('index', {title:'Blog',
    topMargin:'0',
    primaryWrap:'block',
    aboutWrap:'none',
    blogWrap:'block',
    cvWrap:'none',
    workWrap:'none',
    addWrap:'none'
  });
});

app.get("/cv", function(req, res) {
	res.render('index', {title:'CV',
    topMargin:'0',
    primaryWrap:'block',
    aboutWrap:'none',
    blogWrap:'none',
    cvWrap:'block',
    workWrap:'none',
    addWrap:'none'
  });
});

app.get("/work", function(req, res) {
	res.render('index', {title:'Work',
    topMargin:'0',
    primaryWrap:'block',
    aboutWrap:'none',
    blogWrap:'none',
    cvWrap:'none',
    workWrap:'block',
    addWrap:'none'
  });
});

app.get("*.css", function(req, res) {
            res.header("Content-type", "text/css");
});

app.get("*", function(req, res) {
	res.render('404', {title:'Page not found!',
    topMargin:'0',
    primaryWrap:'block',
    aboutWrap:'none',
    blogWrap:'none',
    cvWrap:'none',
    workWrap:'none',
    addWrap:'block'
  });
});

http.createServer(app).listen(portNum, ipAddress);
console.log('Server running at '+ipAddress+':'+portNum);
