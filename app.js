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
      console.log("Fuck yea")
      // request.session.allNotifications = [
      //   likeNotifications = [],
        
      //   followNotifications = [],
      //   commentNotifications = []
      // ];

      request.session.follow = [];

      // request.session.allNotifications[0].push(1);
      // request.session.allNotifications[1].push({id:1, user_id: 2, caption: "you have followers"})
      // request.session.allNotifications[1].push({id:1, user_id: 3, caption: "what a great day"})
      // console.log("________");
      // request.session.allNotifications.forEach((i) => {
      //   console.log(i);
      // })
    }
   

   
    
  }

  if (request.session.follow){
    console.log("inside the middleware")
    request.session.follow.forEach((i) => {
      console.log(i);
    })
    console.log("inside the middleware")
    for(let i =0; i < 5; i++) {
      console.log("______________");
    }
  }

  if (!request.session.pageViews) {
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