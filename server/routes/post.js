/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
knex = require('../db/knex'),
{ getAllFollowRequests } = require('../db/query');






/*
|--------------------------------------------------------------------------
| /post/:id Page
|--------------------------------------------------------------------------
*/
router.get('/:id', async (request, response) => {
    
        // only run this is the user is logged in
        if (request.session.isAuthenticated) {
             var followRequests = await getAllFollowRequests(request.session.user_id)
        }
    
    
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
    
    
        response.render('comments', { post, comment, isAuthenticated: request.session.user_id, follow: followRequests })
    
    })




    module.exports = router;