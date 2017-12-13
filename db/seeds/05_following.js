
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('following').del()
    .then(function () {
      // Inserts seed entries
      return knex('following').insert([
        { following_id: 1 , user_id: 2},
        { following_id: 1 , user_id: 3}
      ]);
    });
};


