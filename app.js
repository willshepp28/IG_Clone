/*
 |--------------------------------------------------------------------------
 | Require Dependencies
 |--------------------------------------------------------------------------
 */
const express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  expressValidator = require('express-validator'),
  flash = require('connect-flash'),
  path = require('path'),
  morgan = require('morgan'),
  bcrypt = require('bcrypt'),
  handlebars = require('express-handlebars'),
  // likes = require('./routes/likes'),
  profile = require('./routes/profile'),
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
application.engine('handlebars', handlebars({ defaultLayout: 'main' }));
application.set('view engine', 'handlebars');

// Set Static Files
application.use('/assets', express.static(path.join(__dirname, 'public')));

application.use(morgan('dev'));
// application.use(morgan('combined'))


// parse application/x-www-form-urlencoded
application.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
application.use(bodyParser.json());

application.use(expressValidator());


application.use(session({
  secret: 'somanyparts',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// express messages
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res)();
//   next();
// });



// // Express Validator Middleware
// applic.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));




application.use(function (request, response, next) {

  // if req.session.isAuthenitcated dosnet exist its false
  if (!request.session.isAuthenticated) {
    request.session.isAuthenticated = false;

  }

  // if user is logged in create request.session.allNotifications array
  if (request.session.isAuthenticated) {

    if(!request.session.follow){


      request.session.follow = [];

    } 
  }


  if (!request.session.pageViews) {
    request.session.pageViews = 0;
  }
  request.session.pageViews += 1;

  next();
});







/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

// application.use('/likes', likes);
application.use('/profile', profile);
application.use('/', index);





/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
application.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});