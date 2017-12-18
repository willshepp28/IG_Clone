const crypto = require('crypto'),
    knex = require('./knex');





            // var followRequests = await knex.select('following.id', 'profilePic', 'username', 'user_id')
            //     .from('following')
            //     .where({
            //         following_id: request.session.user_id,
            //         acceptOrReject: 0
            //     })
            //     .join('users', 'user_id', 'users.id')
            //     .returning('following.id')
            //     .then((followRequest) => {

            //         return followRequest;

            //     })
            //     .catch(error => console.log(error));


async function getAllFollowRequests(userId) {

    return await knex.select('following.id', 'profilePic', 'username', 'user_id')
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