
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments();
            table.string('username').notNullable();
            table.string('profilePic').notNullable().defaultTo('http://cas.nyu.edu/content/nyu-as/cas/newstudents/college-cohort-program/freshman-year/2016-2017-college-leaders/_jcr_content/par/columncontrol_379702044/parcol1/image.img.png/1488560657847.png');
            table.string('email').notNullable();
            table.integer('age');
            table.integer('number');
            table.boolean('privacy_level').defaultTo(false);
            table.timestamp('date_joined').defaultTo(knex.fn.now());
        })
        .createTable('followers', (table) => {
            table.increments();
            table.integer('following_id').unsigned().references('id').inTable('users').onDelete('cascade');
            table.integer('rejectOrDeny').notNullable().defaultTo(0);
            table.timestamp('follow_date').defaultTo(knex.fn.now());
        })
        .createTable('following', (table) => {
            table.increments();
            table.integer('following_id').unsigned().references('id').inTable('users').onDelete('cascade');
            table.integer('rejectOrDeny').notNullable().defaultTo(0);
            table.integer('status').defaultTo(0);
            table.timestamp('follow_date').defaultTo(knex.fn.now());
        })
        .createTable('posts', (table) => {
            table.increments();
            table.string('photo').notNullable();
            table.text('caption');
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade');
        })
        .createTable('likes', (table) => {
            table.increments();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade');
            table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('cascade');

        })
        .createTable('comments', (table) =>{
            table.increments();
            table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('cascade');
            table.text('user_comment').notNullable();
        })

};

exports.down = function(knex, Promise) {
   return knex.schema.dropTable('comments').dropTable('likes').dropTable('posts').dropTable('following').dropTable('followers').dropTable('users');
};
