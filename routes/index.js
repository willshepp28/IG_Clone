

const router = require('express').Router(),
    crypto = require('crypto'),
    { getAllFollowRequests } = require('../db/query'),
    AWS = require('aws-sdk');
    multer = require('multer'),
    multerS3 = require('multer-S3'),
    knex = require('../db/knex');



// var hashtag = '\S*#(?:\[[^\]]+\]|\S+)';           *** Dont worry about me for now

AWS.config.loadFromPath('./config.json');
AWS.config.update({signatureVersion: 'v4'});
var s3 = new AWS.S3();


var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'ig-clone-v1',
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + '.jpg')
      }
    })
  })

/*
|--------------------------------------------------------------------------
|  /profile/upload
|--------------------------------------------------------------------------
*/

router
  .route('/profile/upload')
  .get((request, response) => {
        response.render('upload')
  })
  .post(upload.any(),(request, response) => {

        
      
        response.send(request.files[0].location + " " + request.body.whatever);
        console.log(request.files);
  })    


/*
|--------------------------------------------------------------------------
|  Home Page - the home page where you can see other users posts
|--------------------------------------------------------------------------
*/
router
    .route('/')
    .get(checkAuthenticated, async (request, response) => {

        // only run this is the user is logged in
        if (request.session.isAuthenticated && request.session.follow < 2) {

            var followRequests = await knex.select('following.id', 'profilePic', 'username', 'user_id')
                .from('following')
                .where({
                    following_id: request.session.user_id,
                    acceptOrReject: 0
                })
                .join('users', 'user_id', 'users.id')
                .returning('following.id')
                .then((followRequest) => {

                    return followRequest;

                })
                .catch(error => console.log(error));


        }











        var posts = await knex.select('username', 'users.id AS userId', 'photo', 'caption', 'profilePic', 'posts.id')
            .from('posts')
            // .limit(5)
            .join('users', 'user_id', 'users.id')
            .orderBy('date_created', 'desc')
            .then((post) => {

                // post.forEach(i => { console.log("______"); console.log(post)})


                knex.select()
                    .from('following')
                    .where('user_id', request.session.user_id)
                    .where('acceptOrReject', 1)
                    .then((follow) => {

                        for(let i = 0; i < post.length; i++) {
                            console.log("_________");
                            console.log(follow[i])
                            console.log("_________");
                        }
                     


                    })



                // for each caption that has a hashtag push into hashArr
                post.forEach((i) => {
                    // var hashMatch = request.body.caption.match(/\S*#(?:\[[^\]]+\]|\S+)/);
                    // hashMatch[0].replace('#', '')


                    // .replace(/#(\S*)/g,'<a href="localhost:3000/tags/">#$1</a>')

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

                            // console.log("__________-");

                            // console.log(request.session.follow);

                            // console.log("__________-");

                            // console.log(post);
                            response.render('home', { post, isAuthenticated: request.session.isAuthenticated, username: request.session.username, follow: followRequests });
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




router.get('/')



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

        request.check('username', 'The username you entered doesn\'t belong to an account').isEmpty();
        request.check('email', "Please enter a valid email address").notEmpty().isEmail();
        request.check("password", "Password should be combination of one uppercase , one lower case, one special char, one digit").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i");
        request.check('password', 'Sorry, your password was incorrect. Please double-check your password.').notEmpty().isLength({ min: 4 })
        request.check('number', 'Please enter a valid number').isMobilePhone().notEmpty();


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
                .then(() => {
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





/*
|--------------------------------------------------------------------------
|  Profile Page - Get method to see ,logged in user's profile page
|--------------------------------------------------------------------------
*/
router
    .route('/profile')
    .get(checkAuthenticated, async (request, response) => {



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
    .get(checkAuthenticated, async (request, response) => {

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





/*
|--------------------------------------------------------------------------
|  /addPost Route  - Post method where users add posts
|--------------------------------------------------------------------------
*/
router.post('/addPost', upload.any(), async (request, response) => {

    // router
    // .route('/profile/upload')
    // .get((request, response) => {
    //       response.render('upload')
    // })
    // .post(upload.any(),(request, response) => {
        
    //       response.send(request.files);
    //       console.log(request.files);
    // })    

    // regex express to check and see if our caption has a hastag inside of it
    var hashMatch = request.body.caption.match(/\S*#(?:\[[^\]]+\]|\S+)/);



    /* 
   **** THIS HOW POSTS ARE CREATED *****

   
   This operation creates a post that users create

   It also checks that caption the user writes to see if a hashtag is in the caption
   Then creates a category if not is created, and adds that post to that specific category.
*/

    var addPost = knex('posts')
        .insert({
            photo: request.files[0].location,
            caption: request.body.caption,
            user_id: request.session.user_id
        })
        .returning('id')
        .then((post) => {


            // checks to see if any hashtags in users caption
            if (hashMatch) {

                knex('categories')
                    .insert({
                        category_name: hashMatch[0].replace('#', '') // removes the hash symbol from hashtag
                    })
                    .then(() => {

                        knex.select()
                            .from('categories')
                            .where('category_name', hashMatch[0].replace('#', ''))
                            .then((category) => {
                                knex('posts_in_categories')
                                    .insert({
                                        post_id: post[0],
                                        category_id: category[0].id
                                    })
                                    .then(() => { console.log('Getting matches') })
                                    .catch((error) => { console.log(error) });
                            })
                    })
                    .catch((error) => { console.log(error) })
            }


            response.redirect('/profile');
        })
        .catch((error) => {
            console.log(error);
            response.redirect('/');
        })

});





/*
|--------------------------------------------------------------------------
|  /Following/:id Route - post method where users follow other users
|--------------------------------------------------------------------------
*/
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





/*
|--------------------------------------------------------------------------
|  /Tags:hastag Page
|--------------------------------------------------------------------------
*/
router
    .route('/tags/:id')
    .get(async (request, response) => {

        // we need a regex to find all the # in 

        var categories = await knex.select('categories.id', 'category_name', 'post_id', 'category_id AS anotherId')
            .from('categories')
            .where('category_name', request.params.id)
            .innerJoin('posts_in_categories', 'categories.id', 'category_id')
            .then((category) => {

                knex.select()
                    .from('posts')
                    .where('posts.id', category[0].post_id)
                    .then((post) => {
                        response.render('category', { category, post });
                    })
                    .catch((error) => { console.log(error) });


            })
            .catch((error) => { console.log(error); response.send(error + " this is the reason") });
    });





/*
|--------------------------------------------------------------------------
| /post/:id Page
|--------------------------------------------------------------------------
*/
router.get('/post/:id', async (request, response) => {

    // var post = knex.select()
    //     .from('posts')
    //     .innerJoin('comments', 'posts.id', 'post_id')
    //     .where('posts.id', request.params.id)

    //     .then((post) => {

    //         console.log(post);
    //         response.render('comments', { post, isAuthenticated: request.session.user_id })
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         response.send(error + " is the reason")

    //     })


    var post = await knex.select()
        .from('posts')
        .innerJoin('users', 'user_id', 'users.id')
        .where('posts.id', request.params.id)
        .then((posts) => { console.log(posts); return posts; })
        .catch((error) => { console.log(error + " this is a post error") });


    var comment = await knex.select()
        .from('comments')
        .innerJoin('users', 'user_id', 'users.id')
        .where('post_id', request.params.id)
        .then((comments) => { return comments; })
        .catch((error) => { console.log(error + " this is a comment error") })


    response.render('comments', { post, comment, isAuthenticated: request.session.user_id })

})





/*
|--------------------------------------------------------------------------
|  /addComment/:id - Post method where users add comments
|--------------------------------------------------------------------------
*/
router.post('/addComment/:id', (request, response) => {

    var comment = knex('comments')
        .insert({
            post_id: request.params.id,
            user_id: request.session.user_id,
            user_comment: request.body.user_comment
        })
        .then(() => {
            console.log('post is successful')
            response.redirect('/')
        })
        .catch(error => {
            response.send(error + ' this is the error');
        });
});





/*
|--------------------------------------------------------------------------
|  /likes/:id - Post method where users like/dislike a post
|--------------------------------------------------------------------------
*/
router.post('/likes/:id', (request, response) => {



    var likes = knex.select()
        .from('likes')
        .where('user_id', request.session.user_id)
        .then(like => {


            /* 
                   **** THIS DETERMINES LIKES/UNLIKES *****
   
                               
                   This operation runs through all the lies returned from the database
                    and checks to see the if the like[i]posts.id matches the request.params.id.
   
                    If there is a match then user unliked post, because user already liked the post
                    If there isnt a match then user likes post, becuase that tells us none is their.
           */


            /**
          *  We have the likes back from the specific user
              now we need to check if any of the likes.post_id match the post.id stored on the requeste.params.id object
 
              If there is any matches, then we'll delete the like from the database
              If there are no matches, then we'll add a like to the database
          */

            // we need this to run throught the like array
            // but stop after that first match


            // check the whole like array and see if we find a post_id to make posts.id
            if (like.find(matchingPostId)) {

                // match so user unlikes post
                knex('likes')
                    .where('post_id', request.params.id)
                    .where('user_id', request.session.user_id)
                    .del()
                    .then(() => { })
                    .catch((error) => {
                        console.log(error);
                        response.send(error + " this is the error");
                    })

            } else {
                // no matches found so user likes post
                knex('likes')
                    .insert({
                        user_id: request.session.user_id,
                        post_id: request.params.id
                    })
                    .then(() => { })
                    .catch((error) => {
                        response.send(error + " this is the error");
                    });
            }


            // function that we use for the likes:id route
            // helps us see if a users already likes a post
            // so we can know whether to like/dislke post
            function matchingPostId(post) {
                console.log(post.post_id);
                console.log(request.params.id);
                return post.post_id === parseInt(request.params.id);
            }

            response.redirect('/')
        })
        .catch((error) => {
            console.log(error);
            response.send(error);
        })


});




router.post('/acceptOrDeny/:choice/:userId', (request, response) => {


    /* 
       **** THIS DETERMINES ACCEPTS/DENIES FOLLOW REQUEST *****
 
                   
       This operation checks the request.params.choice to see whether user accepts or denys follower

       0 = pending
       1 = accept
       2 = deny
 
        If the user accepts, then we add a 1 to the following.acceptOrRequest 
        if the user denies, then we delete the specific row out of the following table
*/


    // if user accepts follow request
    if (request.params.choice === 'accept') {

        knex('following')
            .where({
                following_id: request.params.userId,
                user_id: request.session.user_id
            })
            .update('acceptOrReject', 1)
            .then(() => { response.redirect('/') })
            .catch((error) => { console.log(error); response.send(error + " this is the error") });

    } else {
        // if user denys follow request
        knex('following')
            .where({
                following_id: request.session.user_id,
                user_id: request.params.userId
            })
            .del()
            .then(() => {


                response.redirect('/')
            })
            .catch((error) => { console.log(error); response.send(error + " this is the error") });

    }

})



router
    .route('/discover')
    .get(checkAuthenticated, async (request, response) => {


        // Get the users to show in discover people
        var potentialFollowers = await knex.select()
            .from('users')
            .limit(4)
            .whereNot('id', request.session.user_id)
            .then((user) => {


                // check the database to see which users the current user is already trying to follow and exclude them
                knex('following')
                    .where('user_id', request.session.user_id)
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


        response.render('discover', { potentialFollowers, discoverPosts, isAuthenticated: request.session.isAuthenticated })
    })


// function remove(array, element) {
//     return array.filter(e => e !== element);
// }

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