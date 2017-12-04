const router = require('express').Router(),
    crypto = require('crypto'),
    knex = require('../db/knex');



// var hashtag = '\S*#(?:\[[^\]]+\]|\S+)';


// home page
router
    .route('/')
    .get(async (request, response) => {


        var posts = await knex.select()
            .from('posts')
            .innerJoin('users', 'user_id', 'users.id')
            .then((post) => {

                response.render('home', { post, isAuthenticated: request.session.isAuthenticated, username: request.session.username });
            })
            .catch((err) => {
                response.send(err);
            })
    });



// signup page
router
    .route('/signup')
    .get(async (request, response) => {
        response.render("signup");
    })
    .post((request, response) => {



        var encrypt = function (password) { return crypto.pbkdf2Sync(password, 'salt', 10, 512, 'sha512').toString('base64');};

       var users = knex('users')
            .insert({
                username: request.body.username,
                email: request.body.email,
                number: request.body.number,
                password:  encrypt(request.body.password)
            
            })
            .then(() => {
                response.redirect('/')
            })
            .catch((error) => {
                console.log("________________");
                console.log(request.body);
                console.log("________________")
                console.log(error);
                response.redirect('/signup');
            });


    });



// login page
router
    .route('/login')
    .get(async (request, response) => {
        response.render("login");
    })
    .post((request, response) => {

        var decrypt = crypto.pbkdf2Sync(request.body.password, 'salt', 10, 512, 'sha512').toString('base64');

    
        // when user logs in decrypt password, set username and isAuthenticated in session, then redirect to /
        var user = knex.select()
            .from('users')
            .where({
                username: request.body.username,
                password: decrypt
            })
            .then((user) => {

                request.session.isAuthenticated = true;

                
                request.session.user_id = user[0].id;
                request.session.username = user[0].username;

                response.redirect('/');
            })
            .catch((error) => {
                console.log(error);
                response.redirect('/login');
            })
    });



// profile:id
router
    .route('/profile')
    .get(async (request, response) => {

        console.log(typeof request.session.user_id);

        var user = await knex.select()
            .from('users')
            .where('id', request.session.user_id)
            .then((user) => {

                knex.select()
                    .from('posts')
                    .where('user_id', request.session.user_id)
                    .then((user_posts) => {
                        response.render('profile', { user , user_posts,isAuthenticated: request.session.username })
                    })
                
            })
            .catch((error) => {
                console.log(error);
                response.redirect('/');
            });
        
    });



router.post('/addPost',async(request, response) => {

    console.log("____________");
    console.log(request.body);

    var addPost = knex('posts')
        .insert({
            photo: request.body.photo,
            caption: request.body.caption,
            user_id: request.session.user_id
        })
        .then(() => {
            response.redirect('/profile');
        })
        .catch((error) => {
            console.log(error);
            response.redirect('/');
        })

})



// tags:hastag
router
    .route('/tags:hastag')
    .get(async (request, response) => {

    });









module.exports = router;