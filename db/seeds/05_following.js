
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
        { following_id: 1 , user_id: 2},
        { following_id: 1 , user_id: 3},
        { following_id: 2 , user_id: 1},
        { following_id: 3, user_id: 1},
        { following_id: 6, user_id: 1}
      ]);
    });
};


