/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
knex = require('../db/knex');






/*
|--------------------------------------------------------------------------
|  /addComment/:id - Post method where users add comments
|--------------------------------------------------------------------------
*/
router.post('/:id', (request, response) => {
    
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
    

    




module.exports = router;