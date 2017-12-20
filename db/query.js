const crypto = require('crypto'),
    knex = require('./knex');




/*
|--------------------------------------------------------------------------
|  GET all follow requests
|--------------------------------------------------------------------------
*/
async function getAllFollowRequests(userId) {

    return await knex.select('following.id', 'profilePic', 'username', 'userId', 'acceptOrReject')
        .from('following')
        .where({
            following_id: userId,
            acceptOrReject: 1
        })
        .join('users', 'userId', 'users.id')
        .returning('following.id')
        .then((followRequest) => {

            followRequest.forEach(request => {
                
                console.log(request);
                console.log('_______')
            })

            

            return followRequest;

        })
        .catch(error => console.log(error));
};





/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/









module.exports = {
    getAllFollowRequests
}