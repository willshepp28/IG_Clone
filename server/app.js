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
  acceotOrDeny = require('./routes/acceptOrDeny'),
  addComment = require('./routes/addComment'),
  addPost = require('./routes/addPost'),
  following = require('./routes/following'),
  likes = require('./routes/likes'),
  profilePic = require('./routes/profilePic'),
  discover = require('./routes/discover'),
  tags = require('./routes/tags')
  post = require('./routes/post'),
  profile = require('./routes/profile'),
  index = require('./routes/index'),
  Promise = require('bluebird'),
  port = process.env.PORT || 8000;
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


  next();
});







/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
application.use('/acceptOrDeny', acceotOrDeny);
application.use('/addComment', addComment);
application.use('/addPost', addPost);
application.use('/following', following);
application.use('/likes', likes);
application.use('/profilePic', profilePic);
application.use('/discover', discover);
application.use('/tags', tags);
application.use('/post', post);
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