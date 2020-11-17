/*var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const session = require('express-session');
var bodyParser = require('body-parser');
var httpClient = require('request');
var jsforce = require('jsforce');

//initialize session
app.use(session({secret: 'S3CRE7', resave: true, saveUninitialized: true}));

//bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//***********Authenntication */
//Soap API - Username,PWD
/*var username = 'anand.kumaraswamy@nteligroup.com.cpqone';
var password = 'cpq12345!';
var conn = new jsforce.Connection({
  
   loginUrl : 'https://nteli-dev-ed.my.salesforce.com'
});
conn.login(username, password, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
  // ...
});
//

//Oath2 
//********** jsForce connection
const oauth2 = new jsforce.OAuth2({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://nteli-dev-ed.my.salesforce.com',
    clientId : '3MVG9l2zHsylwlpTUSEsHzF36ZUlVsQb_hkxy9ob8mdnQc2QQNOUrPJcD9Al0mUfnzSj6UaCH8_rX7yMTksHw',
    clientSecret : '0BD74C61FF3B8005396D778BEFB33ADCCCCB6A3F4DE51A22C68B2F56FCCF1F15',
    redirectUri : 'http://localhost:3000/token'
  }
});
//
// Get authorization url and redirect to it.
//
app.get('/auth/login', function(req, res) {
  res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
});
app.get('/token', function(req, res) {
  var conn = new jsforce.Connection({ oauth2 : oauth2 });
  var code = req.query.code;//('code');
  conn.authorize(code, function(err, userInfo) {
    if (err) { return console.error(err); }
    // Now you can get the access token, refresh token, and instance URL information.
    // Save them to establish connection next time.
    console.log('Access Token:',conn.accessToken);
    console.log('Refresh Token:',conn.refreshToken);
    console.log('Instance URL:',conn.instanceUrl);
    console.log("User ID: " + userInfo.id);
    console.log("Org ID: " + userInfo.organizationId);
    // ...
    res.send('success'); // or your desired response
  });
});

//
// Call the Org
//
app.get('/api/accounts', function(req, res) {
  // if auth has not been set, redirect to index
      if (!req.session.accessToken || !req.session.instanceUrl) { res.redirect('/'); }
  //SOQL query
      let q = 'SELECT id, name FROM account LIMIT 10';
  //instantiate connection
      let conn = new jsforce.Connection({
          oauth2 : {oauth2},
          accessToken: req.session.accessToken,
          instanceUrl: req.session.instanceUrl
     });
  //set records array
      let records = [];
      let query = conn.query(q)
         .on("record", function(record) {
           records.push(record);
         })
         .on("end", function() {
           console.log("total in database : " + query.totalSize);
           console.log("total fetched : " + query.totalFetched);
           res.json(records);
         })
         .on("error", function(err) {
           console.error(err);
         })
         .run({ autoFetch : true, maxFetch : 4000 });
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;*/

