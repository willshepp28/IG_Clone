
/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
knex = require('../db/knex');





/*
|--------------------------------------------------------------------------
|  /Following/:id Route - post method where users follow other users
|--------------------------------------------------------------------------
*/
router.post('/:id', (request, response) => {
    
    
        console.log('following id is ' + request.params.id);
    
        var checkUser = knex.select()
            .from('following')
            .where({
                following_id: request.params.id,
                userId: request.session.user_id
            })
            .then((following) => {
    
    
                // if not following already user makes
                if (!following[0]) {
    
    
                    knex('following')
                        .insert({
                            following_id: request.params.id,
                            userId: request.session.user_id
                        })
                        .then(() => {
                            console.log("Request to follow, successfully sent.");
    
                        })
                        .catch((error) => {
                            console.log(error);
                            response.send(error);
                        })
    
                } else {
    
                    knex('following')
                        .where({
                            following_id: request.params.id,
                            userId: request.session.user_id
                        })
                        .del()
                        .then(() => { })
                        .catch((error) => {
                            console.log(error);
                            response.send(error + " this is the error");
                        })
    
                }
    
                response.redirect('/')
    
    
            })
            .catch((error) => { })
    
    });
    

    
    module.exports = router;