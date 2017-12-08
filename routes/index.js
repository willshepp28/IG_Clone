

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


                knex.select('comments.id', 'user_comment', 'post_id', 'username')
                    .from('comments')
                    .leftJoin('users', 'user_id', 'users.id')
                    .then((comment) => {

                        // creating a for loop to run throught the amount of posts in database
                        for (let i = 0; i < post.length; i++) {


                            // We need to run a second for loop based on whatever is has entries posts or comments 
                         if (post.length > comment.length){ 
                            for (let j = 0; j < post.length; j++) {
                                
                              
                                   // check to see if there is even a comment even exists
                               if (comment[j]) {
     

                                   // check the specific post.id against all post_id in comments
                                   if (post[i].id === comment[j].post_id) {
                                 
                                       // only creates a myComments array if none is created
                                       if (!post[i].myComments) {
                                           post[i].myComments = [];
                                       }

                                     
                                       // push username and comment into myComments on poticular post        
                                           post[i].myComments.push({ username: comment[j].username, usercomments: comment[j].user_comment });
    
                                   }
                           }
                       }


                         } else {
                            for (let j = 0; j < comment.length; j++) {
                                
                              
                                   // check to see if there is even a comment a
                               if (comment[j]) {
     

                                   // check the specific post.id against all post_id in comments
                                   if (post[i].id === comment[j].post_id) {
                                 
                                       // only creates a myComments array if none is created
                                       if (!post[i].myComments) {
                                           post[i].myComments = [];
                                       }

                                     
                                       // push username and comment into myComments on poticular post
                                    
                                           post[i].myComments.push({ username: comment[j].username, usercomments: comment[j].user_comment });
                                    
                                      
                                
                                   }
                           }
                       }
                         }
 
                          
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




router.get('/post/:id', async(request, response) => {

    var post = knex.select()
        .from('posts')
        .innerJoin('comments', 'post_id', 'posts.id')
        .where('id', request.params.id)
        
        .then((post) => {

            console.log(post);
            response.render('comments', { post, isAuthenticated: request.session.user_id })
        })
        .catch((error) => {
            console.log(error);
            response.send(error + " is the reason")
        })
})


router.post('/addComment/:id', (request, response) => {
    
    var comment = knex('comments')
        .insert({
            post_id: request.params.id,
            user_id: request.session.user_id,
            user_comment: request.body.user_comment
        })
        .then(() =>{
            console.log('post is successful')
            response.redirect('/')
        })
        .catch(error => {
            response.send(error + ' this is the error');
        });
})







module.exports = router;