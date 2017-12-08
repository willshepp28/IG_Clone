

const router = require('express').Router(),
    crypto = require('crypto'),
    knex = require('../db/knex');



// var hashtag = '\S*#(?:\[[^\]]+\]|\S+)';


// home page
router
    .route('/')
    .get(async (request, response) => {


        var posts = await knex.select('username', 'photo', 'caption', 'profilePic','posts.id')
            .from('posts')

            .join('users', 'user_id', 'users.id')
            // .fullOuterJoin('comments', 'posts.id', 'post_id')
            .then((post) => {

                console.log('up top');
                post.forEach(i => {
                    console.log(i)
                    console.log("This is a post")
                    console.log("___________");
                    console.log("___________");
                    console.log("___________");
                })


                knex.select()
                    .from('comments')
                    .leftJoin('users', 'user_id', 'users.id')
                    .then((comment) => {

                        // comment.forEach(i => {
                        //     console.log('This is a comment')
                        //     console.log(i)
                        //     console.log("___________");
                        //     console.log("___________");
                        //     console.log("___________");
                        // })
        


                        // creating a for loop to run throught the amount of comments in database
                        for (let i = 0; i < post.length; i++) {


                            // check to see if there is even a comment a

                                for (let j = 0; j < post.length; j++) {
                                     console.log('in it')

                                    if (comment[j]) {

                                    

                                        // check the specific post.id against all post_id in comments
                                        if (post[i].id === comment[j].post_id) {
                                            
                                            // console.log('outside')
                                            // console.log("_______________");
                                            // console.log("_______________");
                                            // console.log(i + " this is i")
                                            // console.log(j + " this is j");
                                            // console.log("_______________");
                                            // console.log("_______________");
                                            // console.log('inside')

                                            // only creates a myComments array if none is created
                                            if (!post[i].myComments) {
                                                post[i].myComments = [];
                                            }

                                            //    console.log(comment[j]);
                                            //     console.log("pushed " + j)
                                            //     console.log(j);
                                            post[i].myComments.push({ username: comment[j].username, usercomments: comment[j].user_comment });
                                            // post[i].myComments.push({  usercomments: comment[j].user_comment });
                                            // comment[j];
                                            // console.log("Post.id is " + post[i].id);
                                            // console.log("The post id associated with Comments is " + comment[j].post_id);
                                            // console.log(post[i].myComments);

                                        }
                                    


                                }

                            }

                            // console.log('EEEEEEEENNNNNNNDDDDDDDDDDDDDD');
                          
                        }

                  

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