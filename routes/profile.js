const router = require('express').Router(),
    crypto = require('crypto'),
    AWS = require('aws-sdk'),
    multer = require('multer'),
    multerS3 = require('multer-S3'),
    knex = require('../db/knex'),
    { getAllFollowRequests } = require('../db/query');





AWS.config.loadFromPath('./config.json');
AWS.config.update({ signatureVersion: 'v4' });
var s3 = new AWS.S3();


var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ig-clone-v1',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '.jpg')
        }
    })
})





/*
|--------------------------------------------------------------------------
|  Profile Page - Get method to see ,logged in user's profile page
|--------------------------------------------------------------------------
*/
router
    .route('/')
    .get(checkAuthenticated, async (request, response) => {

        // only run this is the user is logged in
        if (request.session.isAuthenticated && request.session.follow < 2) {



            var followRequests = await getAllFollowRequests(request.session.user_id)
        }




        var user = await knex.select()
            .from('users')
            .where('id', request.session.user_id)
            .then((user) => {

                knex.select()
                    .from('posts')
                    .where('user_id', request.session.user_id)
                    .then((user_posts) => {
                        response.render('profile', { user, user_posts, isAuthenticated: request.session.user_id, myid: request.session.user_id, follow: followRequests })
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
    .route('/:id')
    .get(checkAuthenticated, async (request, response) => {

        // only run this is the user is logged in
        if (request.session.isAuthenticated && request.session.follow < 2) {

            var followRequests = await getAllFollowRequests(request.session.user_id)
        }




        var user = await knex.select()
            .from('users')
            .where('id', request.params.id)
            .then((user) => {


                // gets a count of all the users posts
                var postCount = knex.select()
                    .from('posts')
                    .where('user_id', request.params.id)
                    .count('posts.id')
                    .then((userPosts) => { user[0].postCount = userPosts[0].count })
                    .catch((error) => { console.log(error) });


                // gets a count fo all the users that that person is following
                var followingCount = knex.select()
                    .from('following')
                    .where({
                        following_id: request.session.user_id,
                        userId: request.params.id
                    })
                    .count('following.id')
                    .then((followingCounts) => { user[0].followingCount = followingCounts[0].count })
                    .catch((error) => { console.log(error) });


                // gets a count of the users followers
                var followerCount = knex.select()
                    .from('following')
                    .where({
                        following_id: request.params.id,
                        userId: request.session.user_id
                    })
                    .count('following.id')
                    .then((followerCounts) => { user[0].followerCount = followerCounts[0].count })
                    .catch((error) => { console.log(error) });




                user.follower = false;
                knex.select()
                    .from('posts')
                    .where('user_id', request.params.id)
                    .then((user_posts) => {

                        if (request.session.user_id === parseInt(request.params.id)) {

                            response.render('profile', { user, user_posts, isAuthenticated: request.session.user_id, follow: followRequests });
                        } else {


                            user.follower = true

                            knex.select()
                                .from('following')
                                .where({
                                    following_id: user[0].id,
                                    userId: request.session.user_id
                                })
                                .then((following) => {



                                    if (!following[0]) {
                                        console.log("nothing here")
                                    } else if (following[0].acceptOrReject === 1) {
                                        console.log("pending");

                                        user.isPending = true;

                                    } else {
                                        console.log("following")

                                        user.isFollowing = true;
                                    }

                                    console.log("profile____-________")
                                    console.log(user);
                                    console.log("profile____-________")



                                })
                                .catch((error) => { console.log(error) })






                            response.render('profile', { user, user_posts, isAuthenticated: request.session.user_id, follower_id: request.params.id, follow: followRequests })
                        }

                    })

            })
            .catch((error) => {
                console.log(error);
                response.redirect('/');
            });

    });


/*
|--------------------------------------------------------------------------
|  /profilePic - route where you add profile pic
|--------------------------------------------------------------------------
*/
router
    .route('/profilePic')
    .get(async (request, response) => {

        // only run this is the user is logged in
        if (request.session.isAuthenticated && request.session.follow < 2) {



            var followRequests = await getAllFollowRequests(request.session.user_id)
        }


        var user = knex.select()
            .from('users')
            .where('id', request.session.user_id)
            .then((user) => {
                response.render('profilePic', { user, isAuthenticated: request.session.isAuthenticated, follow: followRequests });
            })
            .catch((error) => { console.log(error) })

    })
    .post(upload.any(), (request, response) => {


        var changeProfile = knex('users')
            .where('id', request.session.user_id)
            .update({
                profilePic: request.files[0].location
            })
            .then(() => {
                response.redirect('/profile')
            })
            .catch((error) => { console.log(error); response.redirect('/profilePic') })
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