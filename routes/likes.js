/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
knex = require('../db/knex');





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
            });
    
    
    })





    module.exports = router;