
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('following').del()
    .then(function () {
      // Inserts seed entries
      return knex('following').insert([
        // users that want to follow you

        /*

          following_id = the person you are trying to follow
          user_id = the person who is trying to follow you
        */

        //  first row users are following theirselves so that their posts can populuate on their newsfeed
        { following_id: 1, userId: 1, acceptOrReject: 2},
        { following_id: 2, userId: 2, acceptOrReject: 2},
        { following_id: 3, userId: 3, acceptOrReject: 2},
        { following_id: 4, userId: 4, acceptOrReject: 2},
        { following_id: 5, userId: 5, acceptOrReject: 2},
        { following_id: 6, userId: 6, acceptOrReject: 2},

        // other users
        { following_id: 1 , userId: 2},
        { following_id: 1 , userId: 3},
        { following_id: 2 , userId: 1},
        { following_id: 3, userId: 1},
        { following_id: 6, userId: 1}
      ]);
    });
};



