
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        {id: 1, photo: 'https://i2.wp.com/www.thefreshquotes.com/wp-content/uploads/2016/07/The-Goal-Isnt-About-The-Money-The-Goal-Is-Living-Life-The-Way-I-Want-To..png?resize=400%2C400&ssl=1', caption: 'living life to the fullest', user_id: 1},
        {id: 2, photo: 'https://d2tml28x3t0b85.cloudfront.net/tracks/artworks/000/157/758/original/cd4e47.jpeg?1460513101', caption: 'Getting Money', user_id: 2},
        {id: 3, photo: 'https://www.city-spree.com/editable/images/menuitems/19518.jpg', caption: 'I love food so much', user_id: 3},
        {id: 4, photo: 'https://cdn.vox-cdn.com/thumbor/nqQlbcrkrxgFHHXcNCuc02oaJL4=/400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9276359/jbareham_170917_2000_0027_squ.jpg', caption: '#IphoneGang', user_id: 4},
        {id: 5, photo: 'https://pbs.twimg.com/profile_images/662591353562492928/z--rRZLH.jpg', caption: 'That new Chris brown is fire', user_id: 5},
      ]);
    });
};
