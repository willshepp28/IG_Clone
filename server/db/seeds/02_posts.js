
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        { photo: 'https://i2.wp.com/www.thefreshquotes.com/wp-content/uploads/2016/07/The-Goal-Isnt-About-The-Money-The-Goal-Is-Living-Life-The-Way-I-Want-To..png?resize=400%2C400&ssl=1', caption: 'living life to the fullest', user_id: 1},
        { photo: 'https://d2tml28x3t0b85.cloudfront.net/tracks/artworks/000/157/758/original/cd4e47.jpeg?1460513101', caption: 'Getting Money', user_id: 2},
        { photo: 'https://www.city-spree.com/editable/images/menuitems/19518.jpg', caption: 'I love food so much', user_id: 3},
        { photo: 'https://cdn.vox-cdn.com/thumbor/nqQlbcrkrxgFHHXcNCuc02oaJL4=/400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/9276359/jbareham_170917_2000_0027_squ.jpg', caption: '#IphoneGang', user_id: 4},
        { photo: 'https://pbs.twimg.com/profile_images/662591353562492928/z--rRZLH.jpg', caption: 'That new Chris brown is fire', user_id: 5},
        { photo: 'https://i.pinimg.com/736x/86/26/57/8626574ec1a1f5fa87b64f8a2e1858a9--ron-swanson-meme-steaks.jpg', caption: 'Iam so hungry', user_id: 1},
        { photo: 'https://www.trafalgar.com/~/media/images/website-refresh/hero-square/bestofturkey-hero-sq-468087725.jpg?w=400&h=400', caption: 'I want to travel so bad', user_id: 1}
      ]);
    });
};
