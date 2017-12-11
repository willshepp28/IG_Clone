const router = require('express').Router(),
crypto = require('crypto'),
knex = require('../db/knex');




/*
|--------------------------------------------------------------------------
|  Profile Page - Get method to see ,logged in user's profile page
|--------------------------------------------------------------------------
*/
router
.route('/profile')
.get(async (request, response) => {



    var user = await knex.select()
        .from('users')
        .where('id', request.session.user_id)
        .then((user) => {

            knex.select()
                .from('posts')
                .where('user_id', request.session.user_id)
                .then((user_posts) => {
                    response.render('profile', { user, user_posts, isAuthenticated: request.session.user_id, myid: request.session.user_id })
                })

        })
        .catch((error) => {
            console.log(error);
            response.redirect('/');
        });

});





/*
|--------------------------------------------------------------------------
|  Follower Profile Page - Get method where users can see other users proflie
|--------------------------------------------------------------------------
*/
router
.route('/profile/:id')
.get(async (request, response) => {

    var user = await knex.select()
        .from('users')
        .where('id', request.params.id)
        .then((user) => {

            knex.select()
                .from('posts')
                .where('user_id', request.params.id)
                .then((user_posts) => {

                    if (request.session.user_id === parseInt(request.params.id)) {

                        response.render('profile', { user, user_posts, isAuthenticated: request.session.user_id });
                    } else {
                        response.render('profile', { user, user_posts, isAuthenticated: request.session.user_id, follower_id: request.params.id, follower: true })
                    }

                })

        })
        .catch((error) => {
            console.log(error);
            response.redirect('/');
        });

});




module.exports = router;