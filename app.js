var express   = require('express'),
	http        = require('http'),
	jade        = require('jade'),
	stylus      = require('stylus'),
	nib         = require('nib'),
  mssql       = require('mssql'),
  sse         = require('sse'),
  cheerio     = require('cheerio'),
  request     = require('request'),
  //Custom files
  setupsql    = require('./lib/setupMSSQL.js'),
  readogp     = require('./lib/readOGP.js'),

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


/*Server Variables*/
var ipAddress   = '127.0.0.1',
    portNum     = process.env.PORT || 8080;
var sqlConfig = {server:'willscv.mssql.somee.com', user:'will', password:'willtest', database:'willscv'}
var sqlCon = new setupsql(sqlConfig);

/*Routes*/
app.get("/", function(req, res) {res.render('index', {title:'Home', topMargin:'30', primaryWrap:'none', aboutWrap:'none', wallWrap:'none', cvWrap:'none', workWrap:'none', addWrap:'none'});});

app.get("/about", function(req, res) {res.render('index', {title:'About', topMargin:'0', primaryWrap:'block', aboutWrap:'block', wallWrap:'none', cvWrap:'none', workWrap:'none', addWrap:'none'});});

app.get("/wall", function(req, res) {res.render('index', {title:'Wall', topMargin:'0', primaryWrap:'block', aboutWrap:'none', wallWrap:'block', cvWrap:'none', workWrap:'none', addWrap:'none'});});

app.get("/cv", function(req, res) {res.render('index', {title:'CV', topMargin:'0', primaryWrap:'block', aboutWrap:'none', wallWrap:'none', cvWrap:'block', workWrap:'none', addWrap:'none'});});

app.get("/work", function(req, res) {res.render('index', {title:'Work', topMargin:'0', primaryWrap:'block', aboutWrap:'none', wallWrap:'none', cvWrap:'none', workWrap:'block', addWrap:'none'});});

app.get("*", function(req, res) {res.render('404', {title:'Page not found!', topMargin:'0', primaryWrap:'block', aboutWrap:'none', wallWrap:'none', cvWrap:'none', workWrap:'none', addWrap:'block'});});

app.get("*.css", function(req, res) {res.header("Content-type", "text/css");});

// SSE for wall
var sseData
var request = new mssql.Request(sqlCon);
var sqlpoll = setInterval(function() {
  request.query("SELECT * FROM statuses", function(err, result){
    if(err) {
      console.log(err);
    } 
    else{
      sseData = result
    }
  });
}, 100)


/* Initiate Server*/
server = http.createServer(app)
server.listen(portNum, function() {
  var sseCon = new sse(server); // Create SSE listener
  sseCon.on('connection', function(client) {
    var eventStream = setInterval(function() { // SSE Stream
      if(typeof sseData !== 'undefined'){
        client.send(JSON.stringify(sseData))
      }
    }, 200); // SSE Interval
  });
  sseCon.on('close',function() {
    clearInterval(eventStream);
  });
});

geturl = new RegExp(//Regex for url detection - Needs improvement
          "(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g");

// Status Handler
app.put("/status", function(req, res) {
  var status = req.body.status
  var author = req.body.author
  var sqlrequest = new mssql.Request(sqlCon);
  
  // Check if URL is in status
  var statusURLs = status.match(geturl)
  if (statusURLs) {
    var i = 0;
    statusURLs.forEach(function(url) {
      var ogdata = new readogp(url, function(result) {
        i++;
        if (result.video) {// Embed/video formatting
          status = status + '<div class="og"><div class="media"><embed type="application/x-shockwave-flash"  src="'+result.video.url+'" allowfullscreen="true"></div><div class="content"><h4><a href="'+result.url+'">'+result.title+'</a></h4><p>'+result.description+'</div></div>'
        }
        else if (result.image) {// Img formatting
          status = status + '<div class="og"><div class="media"><img src="'+result.image+'"/></div><div class="content"><h4><a href="'+result.url+'">'+result.title+'</a></h4><p>'+result.description+'</div>'
        }
        
        if (i == statusURLs.length) {
          // Save Status to MSSQL and force update SSE data
          sqlrequest.query("INSERT INTO statuses VALUES ('"+status+"','"+author+"', '"+new Date()+"')",
          function(err, result){
            if(err) {
              console.log(err);
              res.send(500);
            } 
            else {//Return Ok and update table
              res.send(200);
              sqlrequest.query("SELECT * FROM statuses", function(err, result){
                if(err) {
                  console.log(err);
                } 
                else{
                  sseData = result
                }
              });
            }
          });
        }
      })
    })
  }
  else {
    // Crude dupe, should pulls this function out into readogp library
    sqlrequest.query("INSERT INTO statuses VALUES ('"+status+"','"+author+"', '"+new Date()+"')",
    function(err, result){
      if(err) {
        console.log(err);
        res.send(500);
      } 
      else {//Return Ok and update table
        res.send(200);
        sqlrequest.query("SELECT * FROM statuses", function(err, result){
          if(err) {
            console.log(err);
          } 
          else{
            sseData = result
          }
        });
      }
    });
  }
});

console.log('Server running at '+ipAddress+':'+portNum);
