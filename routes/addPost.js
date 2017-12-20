/*
|--------------------------------------------------------------------------
|  Dependencies
|--------------------------------------------------------------------------
*/
const router = require('express').Router(),
crypto = require('crypto'),
AWS = require('aws-sdk'),
multer = require('multer'),
multerS3 = require('multer-S3'),
knex = require('../db/knex'),
{ getAllFollowRequests } = require('../db/query');





AWS.config.loadFromPath('./config.json');
AWS.config.update({ signatureVersion: 'v4' });
var s3 = new AWS.S3();


var upload = multer({
storage: multerS3({
    s3: s3,
    bucket: 'ig-clone-v1',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + '.jpg')
    }
})
})








/*
|--------------------------------------------------------------------------
|  /addPost Route  - Post method where users add posts
|--------------------------------------------------------------------------
*/
router.post('/', upload.any(), async (request, response) => {
   
    
        // regex express to check and see if our caption has a hastag inside of it
        var hashMatch = request.body.caption.match(/\S*#(?:\[[^\]]+\]|\S+)/);
    
    
    
        /* 
       **** THIS HOW POSTS ARE CREATED *****
    
       
       This operation creates a post that users create
    
       It also checks that caption the user writes to see if a hashtag is in the caption
       Then creates a category if not is created, and adds that post to that specific category.
    */
    
        var addPost = knex('posts')
            .insert({
                photo: request.files[0].location,
                caption: request.body.caption,
                user_id: request.session.user_id
            })
            .returning('id')
            .then((post) => {
    
    
                // checks to see if any hashtags in users caption
                if (hashMatch) {
    
                    knex.select()
                        .from('categories')
                        .where('category_name', hashMatch[0].replace('#', ''))
                        .then((category) => {
    
                            // if category doesnt already exist
                            if (!category[0]) {
    
                                knex('categories')
                                    .insert({
                                        category_name: hashMatch[0].replace('#', '') // removes the hash symbol from hashtag
                                    })
                                    .then(() => {
    
                                        knex.select()
                                            .from('categories')
                                            .where('category_name', hashMatch[0].replace('#', ''))
                                            .then((category) => {
                                                knex('posts_in_categories')
                                                    .insert({
                                                        post_id: post[0],
                                                        category_id: category[0].id
                                                    })
                                                    .then(() => { console.log('Getting matches') })
                                                    .catch((error) => { console.log(error) });
                                            })
                                    })
                                    .catch((error) => { console.log(error) })
    
                            } else {
    
                                // else just add post_id and category_id in post_in_categories table
    
                                knex.select()
                                    .from('categories')
                                    .where('category_name', hashMatch[0].replace('#', ''))
                                    .then((category) => {
                                        knex('posts_in_categories')
                                            .insert({
                                                post_id: post[0],
                                                category_id: category[0].id
                                            })
                                            .then(() => { console.log('Getting matches') })
                                            .catch((error) => { console.log(error) });
                                    })
    
                            }
                        })
    
    
                }
    
    
                response.redirect('/profile');
            })
            .catch((error) => {
                console.log(error);
                response.redirect('/');
            })
    
    });

    




    module.exports = router;