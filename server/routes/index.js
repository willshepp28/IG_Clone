/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
    crypto = require('crypto'),
    { getAllFollowRequests } = require('../db/query'),
    knex = require('../db/knex');







/*
|--------------------------------------------------------------------------
|  Home Page - the home page where you can see other users posts
|--------------------------------------------------------------------------

*/

// router.get('/', checkAuthenticated, async(request, response) => {

//     // only show follow request if your is logged in
//     if(request.session.isAuthenticated) {
//         var followRequests = await getAllFollowRequests(request.session.user_id);
//     }

//     var post = await knex.select()
//         .from('posts')
//         .join('users', 'user_id', 'users.id')
//         .join('likes', 'posts.id', 'post_id')
//         // .count('likes.id')
//         // .distinct()
//         .then((user) => {
//             response.json(user);
//         });
// })



router
    .route('/')
    .get(checkAuthenticated, async (request, response) => {

        // only run this is the user is logged in
        if (request.session.isAuthenticated) {

            var followRequests = await getAllFollowRequests(request.session.user_id)
        }




        var posts = await knex.select('username', 'users.id AS userId', 'photo', 'caption', 'profilePic', 'posts.id')
            .from('posts')
            // .limit(5)
            .join('users', 'user_id', 'users.id')
            .join('following', 'following_id', 'users.id')
            .where({
                userId: request.session.user_id,
                acceptOrReject: 2
            })
            .orderBy('date_created', 'desc')
            .then((post) => {







                // for each caption that has a hashtag push into hashArr
                post.forEach((i) => {
                   

                    // if the captions have hastage
                    if (i.caption.match(/\S*#(?:\[[^\]]+\]|\S+)/)) {

                        if (!i.hashArr) {
                            i.hashArr = [];
                        }

                        hashtag = i.caption.match(/\S*#(?:\[[^\]]+\]|\S+)/)

                        i.hashArr.push(hashtag[0].replace('#', ''));
                        i.caption = i.caption.replace(/\#\S+/g, '');

                    }



                })

                knex.select()
                    .from('likes')
                    .then((like) => {

                        /* 
                            **** THIS HOW LIKES ARE DISPLAYED *****

                            
                            This operation runs through all the posts returned from the database
                            and checks to see the if the posts.id matches the likes.post_id.

                            If they match then the like is added to a postLikes variable that is attached to the specific post
                        */

                        for (let a = 0; a < post.length; a++) {

                            // We run the nested for loop based on which table returned from the database is longest in length
                            if (post.length > like.length) {


                                for (let b = 0; b < post.length; b++) {

                                    // check if a like even exists at the specific index 
                                    if (like[b]) {

                                        if (post[a].id === like[b].post_id) {

                                            // if post[a].postLikes isnt already created, we create it.
                                            if (!post[a].postLikes) {
                                                var nums = [];

                                            }

                                            // we push the specific index into nums array
                                            nums.push(b);

                                            // then we get the length of all indexs in nums array,
                                            // put it in postLikes
                                            // and now we have the total number of likes on that specific post
                                            post[a].postLikes = nums.length;


                                        }
                                    }


                                } // end of var j for loop

                            } else {


                                for (let b = 0; b < like.length; b++) {


                                    if (like[b]) {


                                        if (post[a].id === like[b].post_id) {

                                            if (!post[a].postLikes) {
                                                var nums = [];

                                            }

                                            nums.push(b);

                                            // get the length of all likes in nums array and put it on postLikes
                                            post[a].postLikes = nums.length;


                                        }
                                    }


                                } // end of var j for loop

                            }

                        }

                    })
                    .catch((error) => {
                        response.send(error + " this is the error")
                    })




                /* 
                    **** THIS IS HOW COMMENTS ARE DISPLAYED *****

                    
                    This operation runs through all the posts returned from the database
                    and checks to see the if the posts.id matches the comment[j].post_id.

                    If they match then the comment is added to a post[i].myComments array that is attached to the specific post
                */
                knex.select('comments.id', 'user_comment', 'post_id', 'username')
                    .from('comments')
                    .leftJoin('users', 'user_id', 'users.id')
                    .then((comment) => {

                        // creating a for loop to run throught the amount of posts in database
                        for (let i = 0; i < post.length; i++) {


                            // We run the nested for loop based on which table returned from the database is longest in length
                            if (post.length > comment.length) {
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

                        // if user is logged in let them comment on posts
                        if (request.session.isAuthenticated) {
                            post.forEach(i => {

                                i.userComment = true;
                            });
                        }

                        if (request.session.isAuthenticated) {

                            // response.render('home', { post, isAuthenticated: request.session.isAuthenticated, username: request.session.username, follow: followRequests });
                            response.json(post);
                        } else {
                            response.render('home', { post });
                        }

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







/*
|--------------------------------------------------------------------------
|  Sign Up Page - Page where users sign up
|--------------------------------------------------------------------------
*/
router
    .route('/signup')
    .get(async (request, response) => {
        response.render("signup", { errors: request.session.errors });
    })
    .post((request, response) => {

        request.check('username', 'Please enter a username').notEmpty();
        request.check('email', "Please enter a valid email address").notEmpty().isEmail();
        // request.check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
        // request.check('password', 'Sorry, your password was incorrect. Please double-check your password.').notEmpty().isLength({ min: 4 })
        request.check('password', 'Please enter a valid password').notEmpty().isLength({ min: 4 });


        var errors = request.validationErrors();

        if (errors) {
            request.session.errors = errors;
            response.redirect('/signup')
        } else {


            var encrypt = function (password) { return crypto.pbkdf2Sync(password, 'salt', 10, 512, 'sha512').toString('base64'); };

            var users = knex('users')
                .insert({
                    username: request.body.username,
                    email: request.body.email,
                    number: request.body.number,
                    password: encrypt(request.body.password)

                })
                .returning('id')
                .then((id) => {


                    // user is following theirself. Helps us with populating their own posts on newsfeed in '/' route
                    knex('following')
                    insert({
                        following_id: id[0],
                        userId: id[0],
                        acceptOrReject: 2
                    })
                        .then(() => { })
                        .catch((error) => { console.log(error); response.redirect('/signup') })

                    response.redirect('/')
                })
                .catch((error) => {
                    console.log(error);
                    response.redirect('/signup');
                });
        }

    });








/*
|--------------------------------------------------------------------------
|  Login Page - Page where users login 
|--------------------------------------------------------------------------
*/
router
    .route('/login')
    .get(async (request, response) => {
        response.render("login", { errors: request.session.errors });
        request.session.errors = null;
    })
    .post((request, response) => {

        request.check('username', 'The username you entered doesn\'t belong to an account').notEmpty();
        request.check('password', 'Sorry, your password was incorrect. Please double-check your password.').isLength({ min: 3 })

        var errors = request.validationErrors();

        if (errors) {
            request.session.errors = errors;
            response.redirect('/login')
        } else {


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
        }
    });








function remove(array, element) {
    const index = array.indexOf(element);

    if (index !== -1) {
        array.splice(index, 1);
    }
}


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