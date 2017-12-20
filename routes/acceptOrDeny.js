/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
knex = require('../db/knex');






/*
|--------------------------------------------------------------------------
|   /acceptOrDeny/:choice/:userId - route where user can choice to accept or deny follow request
|--------------------------------------------------------------------------
*/    
router.post('/:choice/:userId', (request, response) => {
    
    
        /* 
           **** THIS DETERMINES ACCEPTS/DENIES FOLLOW REQUEST *****
     
                       
           This operation checks the request.params.choice to see whether user accepts or denys follower
    
           1 = pending
           2 = accept
         
            if acceptOrRequest isnt either 1 or 2 it means the user denies the follower so we delete the request out of the databsase
     
            If the user accepts, then we add a 1 to the following.acceptOrRequest 
            if the user denies, then we delete the specific row out of the following table
    */
    
    
        // if user accepts follow request
        if (request.params.choice === 'accept') {
    
            knex('following')
                .where({
                    following_id: request.session.user_id,
                    userId: request.params.userId
                })
                .update('acceptOrReject', 2)
                .then(() => { response.redirect('/') })
                .catch((error) => { console.log(error); response.send(error + " this is the error") });
    
        } else {
            // if user denys follow request
            knex('following')
                .where({
                    following_id: request.session.user_id,
                    userId: request.params.userId
                })
                .del()
                .then(() => {
    
    
                    response.redirect('/')
                })
                .catch((error) => { console.log(error); response.send(error + " this is the error") });
    
        }
    
    });





    module.exports = router;