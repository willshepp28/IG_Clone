/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/

const router = require('express').Router(),
knex = require('../db/knex.js');

/*
|--------------------------------------------------------------------------
|  Home Page - the home page where you can see other users posts
|--------------------------------------------------------------------------
*/

// router.get('/', (request,response) => {
    
//     return knex.select()
//         .from('posts')
//         .then((post) => {
//             response.json(post);
//         });
// })
router
    .route('/')
    .get( async (request, response) => {

     



        var posts = await knex.select('username', 'users.id AS userId', 'photo', 'caption', 'profilePic', 'posts.id')
            .from('posts')
            // .limit(5)
            .join('users', 'user_id', 'users.id')
            .join('following', 'following_id', 'users.id')
            .where({
                userId: 1,
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


                    })
                    .catch((error) => {
                        console.log(error);
                        response.send(error);
                    })

                    response.json(post)

            })
            .catch((error) => {
                response.send(error + 'this is a error');
            });

    });


    router.get('/post', (request, response) => {
        return knex.select()
            .distinct('username')
            .from('posts')
            .then((post) => {
                response.json(post);
            })
    })


module.exports = router;