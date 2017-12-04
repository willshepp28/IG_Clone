const crypto = require('crypto');

var encrypt = function(password){
  return crypto.pbkdf2Sync(password, 'salt', 10, 512, 'sha512')
  .toString('base64');
};


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
       { username: 'willshepp44',profilePic: 'https://i.kinja-img.com/gawker-media/image/upload/s--vE_ofLB2--/c_fill,fl_progressive,g_center,h_200,q_80,w_200/gdlhsths0iqnoj5ri4vz.jpg', email: 'willsheppard2@gmail.com', number: '8431234567', password: encrypt('123')},
        { username: 'tomFord', profilePic: 'https://vg-images.condecdn.net/image/JZorwQxPJa9/crop/200/square', email: 'tomford@outlook.com', number: '5551238765', password: encrypt('tomford66')},
        { username: 'danny_ballin1',profilePic: 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAIA_wDGAAAAAQAAAAAAAAshAAAAJDJkMjVhNWZjLTZjOTktNGI3NC1iNTM4LWQ4MDAwNGE4YzIxNQ.jpg', email: 'dannyballin@gmail.com', number: '9996668888', password: encrypt('555')},
        { username: 'sarahlovin5', profilePic: 'https://media.licdn.com/mpr/mpr/shrink_200_200/p/3/005/019/28f/1b46279.jpg', email: 'sarahzzzworld@yahoo.com', number: '5551238888', password: encrypt('666')},
        { username: 'tommy_rules', profilePic: 'https://www.mumsnet.com/uploads/talk/201610/large-898199-images.jpg', email: 'tombrown@gmail.com', number:'7776663333', password: encrypt('1234')},
        { username: 'maryjohnson1', profilePic: 'http://rs223.pbsrc.com/albums/dd264/afrodite00/Random%20BW%20People/Cola.jpg~c200', email: 'maryjohnson@gmail.com', number:'2223334444',password: encrypt('1236')},
      ]);
    });
};
