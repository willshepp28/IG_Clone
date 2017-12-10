/*
 |--------------------------------------------------------------------------
 | Require Dependencies
 |--------------------------------------------------------------------------
 */
const express = require('express'),
bodyParser = require('body-parser'),
session = require('express-session'),
validator = require('express-validator'),
path = require('path'),
morgan = require('morgan'),
bcrypt = require('bcrypt'),
handlebars = require('express-handlebars'),
index = require('./routes/index'),
Promise = require('bluebird'),
port = process.env.PORT || 3000;
application = express();



/*
|--------------------------------------------------------------------------
|  Middleware
|--------------------------------------------------------------------------
*/
// Register `hbs.engine` with the Express app.
application.engine('handlebars', handlebars({defaultLayout: 'main'}));
application.set('view engine', 'handlebars');

// Set Static Files
application.use('/assets', express.static(path.join(__dirname, 'public')));

application.use(morgan('dev'));
// application.use(morgan('combined'))


// parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
application.use(bodyParser.json());


application.use(session({
secret: 'somanyparts',
resave: false,
saveUninitialized: true,
cookie: { secure: false }
}));




application.use(function(request,response, next){

// if req.session.isAuthenitcated dosnet exist its false
  if (!request.session.isAuthenticated){
      request.session.isAuthenticated = false;

  }

  if (!request.session.pageViews){
      request.session.pageViews = 0;
 }// else if(request.session.pageViews > 0){
//       request.session.pageViews += 1;
//   }

request.session.pageViews += 1;

  // console.log(request.session)
  next();
});







/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
application.use('/', index);





/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
application.listen(port, () => {
console.log(`Server listening on port ${port}`);
});