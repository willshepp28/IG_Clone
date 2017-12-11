
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('following').del()
    .then(function () {
      // Inserts seed entries
      return knex('following').insert([
        {id: 1, following_id: 1 , user_id: 2}
      ]);
    });
};


