

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
           
            .leftJoin('users', 'users.id', 'user_id')
            // .fullOuterJoin('comments', 'posts.id', 'post_id')
            .then((post) => {

              
                
                knex.select()
                    .from('comments')
                    .leftJoin('users', 'user_id', 'users.id')
                    .then((comment) => {

                        

                        // creating a for loop to run throught the amount of comments in database
                        for(let i = 0; i < comment.length; i++) {
                            

                            // check to see if the currne post.id is equal to the current comment.post_id
                            if (post[i].id === comment[i].post_id) {

                                // if so
                                // create a myComments array on that post
                                post[i].myComments = [];

                                // create another for loop to run through the amount of comments in database
                                // and if the position in the new comment[j].post_id is equal to the current position of the post[i].id in the last for loop
                                // add the user comment to the myComment array in the current post
                                for (let j = 0; j < comment.length; j++) {
                                    console.log("inside for loop")
                                    console.log(comment[j])
                                    if (post[i].id === comment[j].post_id) {
                                        post[i].myComments.push({ username: comment[j].username, usercomments: comment[j].user_comment });
                                        
                                    }
                                   
                                }
                         
                                
                            }
                           
                        }
                        
                        console.log(post);
                    

                        response.render('home', { post, isAuthenticated: request.session.isAuthenticated, username: request.session.username });
                    })
                    .catch((error) => {
                        console.log(error);
                        response.send(error);
                    })
                        
                  

            })
            .catch((error) => {
                response.send(error + 'this is a error');
            });



    });



// signup page
router
    .route('/signup')
    .get(async (request, response) => {
        response.render("signup");
    })
    .post((request, response) => {



        var encrypt = function (password) { return crypto.pbkdf2Sync(password, 'salt', 10, 512, 'sha512').toString('base64'); };

        var users = knex('users')
            .insert({
                username: request.body.username,
                email: request.body.email,
                number: request.body.number,
                password: encrypt(request.body.password)

            })
            .then(() => {
                response.redirect('/')
            })
            .catch((error) => {
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



// profile
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


// follower profile
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



router.post('/addPost', async (request, response) => {

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

});


// follow users
router.post('/following/:id', (request, response) => {

    var followUser = knex('following')
        .insert({
            following_id: request.params.id,
            user_id: request.session.user_id
        })
        .then(() => {
            console.log("Request to follow, successfully sent.");
            response.redirect('/')
        })
        .catch((error) => {
            console.log(error);
            response.send(error);
        })
})



// tags:hastag
router
    .route('/tags:hastag')
    .get(async (request, response) => {

    });









module.exports = router;