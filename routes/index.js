const router = require('express').Router(),
    knex = require('../db/knex');






// home page
router
    .route('/')
    .get(async(request, response) => {

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
    .get(async(request, response) => {

    })
    .post((request, response) => {
        
    });



// login page
router
    .route('/login')
    .get(async(request, response) => {

    })
    .post((request, response) => {

    });



// profile:id
router 
    .route('/profile:id')
    .get(async(request, response) => {

    });



// tags:hastag
router 
    .route('/tags:hastag')
    .get(async(request, response) => {

    });









module.exports = router;