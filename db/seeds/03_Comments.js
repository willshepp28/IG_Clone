
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () {
      // Inserts seed entries
      return knex('comments').insert([
        { post_id: 1 , user_id: 2, user_comment: "Yesssss. Today is about positive vibes, and good juju"},
        { post_id: 1 , user_id: 3, user_comment: "Thank you. I needed this."},
        { post_id: 1 , user_id: 4, user_comment: "#Positivity"},
        { post_id: 1 , user_id: 4, user_comment: "I wish i could click like a million times"},
        { post_id: 3 , user_id: 2, user_comment: "I love Moe's soooo much!!!!"},
        { post_id: 7 , user_id: 5, user_comment: "That is so beautiful. I've gotta get my passport."},
        { post_id: 5, user_id: 1, user_comment: "Yes my dude, that Chris Brizzy off the chain"},
        { post_id: 5, user_id: 4, user_comment: "Yes he is my baby #myFutureHusband"},
        { post_id: 5, user_id: 1, user_comment: "@sarahlovin5 We really dont care"}

      ]);
    });
};



