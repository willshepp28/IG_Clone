const router = require('express').Router(),
    knex = require('../db/knex');






// home page
router
    .route('/')
    .get(async(request, response) => {

        var posts = await knex.select()
            .from('posts')
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









module.exports = router;