
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments();
            table.string('username').notNullable();
            table.string('profilePic').notNullable().defaultTo('http://cas.nyu.edu/content/nyu-as/cas/newstudents/college-cohort-program/freshman-year/2016-2017-college-leaders/_jcr_content/par/columncontrol_379702044/parcol1/image.img.png/1488560657847.png');
            table.string('email').notNullable();
            table.integer('age');
            table.integer('number');
            table.boolean('privacy_level').defaultTo(false)
        })
        .createTable('followers', (table) => {
            table.increments();
        })
        .createTable('following', (table) => {
            table.increments();
            table.integer('status').defaultTo(0);
        })
        .createTable('posts', (table) => {
            table.increments();
        })
        .createTable('likes', (table) => {
            table.increments();

        })
        .createTable('comments', (table) =>{
            table.increments();
        })
        .createTable('messages', (table) => {
            table.increments();
        })

};

exports.down = function(knex, Promise) {
  
};
