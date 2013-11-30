var express   = require('express'),
	http        = require('http'),
	jade        = require('jade'),
	stylus      = require('stylus'),
	nib         = require('nib'),
  mssql       = require('mssql'),
  sse         = require('sse'),
  //Custom files
  setupsql    = require('./lib/setupMSSQL.js'),

	app         = express();

/* Set Express to use Jade, Stylus and dirs*/
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(stylus.middleware({
  src: __dirname + '/public/',
  dest: __dirname + '/public/',
  debug: true,
  force: true,
}));

app.use(express.static('public'));
app.use(express.favicon("public/images/favicon.ico"));


/*Server Variables */
var ipAddress   = '127.0.0.1',
    portNum     = 8080;

var sqlConfig = {server:'willscv.mssql.somee.com', user:'will', password:'willtest', database:'willscv'}
var sqlCon = new setupsql(sqlConfig);

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

app.get("/wall", function(req, res) {
	res.render('index', {title:'Wall',
    topMargin:'0',
    primaryWrap:'block',
    aboutWrap:'none',
    blogWrap:'block',
    cvWrap:'none',
    workWrap:'none',
    addWrap:'none',
    blogid:'id0001'
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

var sseData
var request = new mssql.Request(sqlCon);
request.query("SELECT * FROM statuses", function(err, result){
  if(err) {
    console.log(err);
  } 
  else{
    sseData = result
  }
});


server = http.createServer(app)
server.listen(portNum, ipAddress, function() {
  var sseCon = new sse(server);
  sseCon.on('connection', function(client) {
    console.log('Client Connected');
    var eventStream = setInterval(function() {
      if(typeof sseData !== 'undefined'){
        client.send(JSON.stringify(sseData))
      }
    }, 200);
  });
  sseCon.on('close',function() {
    clearInterval(eventStream);
  });
});

app.put("/status", function(req, res) {
  var status = req.body.status
  // Push status to SQL
  var request = new mssql.Request(sqlCon);
  request.query("INSERT INTO statuses VALUES ('"+status+"', 1, '"+new Date()+"')",
  function(err, result){
    if(err) {
      console.log(err);
      res.send(500);
    } 
    else {
      res.send(200);
      // Update SSE data
      request.query("SELECT * FROM statuses", function(err, result){
        if(err) {
          console.log(err);
        } 
        else{
          sseData = result
        }
      });
    }
  });
});

console.log('Server running at '+ipAddress+':'+portNum);
