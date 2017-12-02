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
       { username: 'willshepp44',profilePic: 'https://image.flaticon.com/icons/png/128/149/149452.png', email: 'willsheppard2@gmail.com', number: '8431234567', password: encrypt('123')},
        { username: 'tomFord', profilePic: 'https://image.flaticon.com/icons/png/128/149/149452.png', email: 'tomford@outlook.com', number: '5551238765', password: encrypt('tomford66')},
        { username: 'tammy_ballin1',profilePic: 'https://image.flaticon.com/icons/png/128/149/149452.png', email: 'tammyballin@gmail.com', number: '9996668888', password: encrypt('555')},
        { username: 'sarahlovin5', profilePic: 'https://image.flaticon.com/icons/png/128/149/149452.png', email: 'sarahzzzworld@yahoo.com', number: '5551238888', password: encrypt('666')},
        { username: 'tommy_rules', profilePic: 'https://image.flaticon.com/icons/png/128/149/149452.png', email: 'tombrown@gmail.com', number:'7776663333', password: encrypt('1234')},
        { username: 'maryjohnson1', profilePic: 'https://image.flaticon.com/icons/png/128/149/149452.png', email: 'maryjohnson@gmail.com', number:'2223334444',password: encrypt('1236')},
      ]);
    });
};
