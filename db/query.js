const crypto = require('crypto'),
    knex = require('./knex');


function getAllFollowRequests(userId) {

    return followRequests = knex.select('following.id', 'profilePic', 'username', 'user_id')
        .from('following')
        .where({
            following_id: userId,
            acceptOrReject: 0
        })
        .join('users', 'user_id', 'users.id')
        .returning('following.id')
        .then((followRequest) => {

            console.log(followRequest);

            return followRequest;

        })
        .catch(error => console.log(error));
};


module.exports = {
    getAllFollowRequests
}