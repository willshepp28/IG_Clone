
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        { post_id: 1 , user_id: 2, user_comment: "Yesssss. Today is about positive vibes, and good juju"},
        { post_id: 1 , user_id: 3, user_comment: "Thank you. I needed this."},
        { post_id: 1 , user_id: 4, user_comment: "#Positivity"}
      ]);
    });
};



