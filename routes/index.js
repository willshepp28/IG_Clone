const router = require('express').Router(),
    crypto = require('crypto'),
    knex = require('../db/knex');



var hashtag = '\S*#(?:\[[^\]]+\]|\S+)';


// home page
router
    .route('/')
    .get(async (request, response) => {

        var posts = await knex.select()
            .from('posts')
            .innerJoin('users', 'user_id', 'users.id')
            .then((post) => {

                response.render('home', { post });
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

    });



// profile:id
router
    .route('/profile:id')
    .get(async (request, response) => {

    });



// tags:hastag
router
    .route('/tags:hastag')
    .get(async (request, response) => {

    });









module.exports = router;