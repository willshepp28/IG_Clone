const router = require('express').Router(),
    knex = require('../db/knex');







router
    .route('/')
    .get(async(request, response) => {
        response.render('home');
    });



router
    .route('/signup')
    .get(async(request, response) => {

    })
    .post((request, response) => {
        
    });





    
module.exports = router;