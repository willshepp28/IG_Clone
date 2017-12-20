const router = require('express').Router(),
knex = require('../db/knex'),
{ getAllFollowRequests } = require('../db/query');






router
.route('/discover')
.get(checkAuthenticated, async (request, response) => {

    // only run this is the user is logged in
    if (request.session.isAuthenticated) {

        var followRequests = await getAllFollowRequests(request.session.user_id)
    }


    // Get the users to show in discover people
    var potentialFollowers = await knex.select()
        .from('users')
        .limit(4)
        .whereNot('id', request.session.user_id)
        .then((user) => {


            // check the database to see which users the current user is already trying to follow and exclude them
            knex('following')
                .where('userId', request.session.user_id)
                .then((follow) => {

                    for (let i = 0; i < user.length; i++) {

                        for (let j = 0; j < follow.length; j++) {

                            // if users.id matchs the following.following_id, then delete from array
                            if (user[i].id === follow[j].following_id) {
                                remove(user, user[i]);
                            }
                        }
                    }
                })
                .catch((error) => { console.log(error + " this is a error") })


            return user;


        })
        .catch((error) => { console.log(error) });



    // some posts
    var discoverPosts = await knex.select()
        .from('posts')
        .limit(10)
        .then((post) => { return post; })
        .catch((error) => { console.log(error + " this is the error"); response.send(error + " this is a error") })


    response.render('discover', { potentialFollowers, discoverPosts, isAuthenticated: request.session.isAuthenticated, follow: followRequests })
})


function checkAuthenticated(request, response, next) {
    
        // do any checks you want to in here
    
        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if (request.session.isAuthenticated)
            return next();
    
        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        response.redirect('/login');
    }
    


module.exports = router;