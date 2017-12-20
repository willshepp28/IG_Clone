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
|  /profilePic - route where you add profile pic
|--------------------------------------------------------------------------
*/
router
.route('/')
.get(checkAuthenticated, async (request, response) => {

    // only run this is the user is logged in
    if (request.session.isAuthenticated) {



        var followRequests = await getAllFollowRequests(request.session.user_id)
    }


    var users = await knex.select()
        .from('users')
        .where('id', request.session.user_id)
        .then((user) => {
            response.render('profilePic', { user, isAuthenticated: request.session.isAuthenticated, follow: followRequests });
        })
        .catch((error) => { console.log(error) })

})
.post(upload.any(), (request, response) => {


    var changeProfile = knex('users')
        .where('id', request.session.user_id)
        .update({
            profilePic: request.files[0].location
        })
        .then(() => {
            response.redirect('/profile')
        })
        .catch((error) => { console.log(error); response.redirect('/profilePic') })
})





function checkAuthenticated(request, response, next) {

// do any checks you want to in here

// CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
// you can do this however you want with whatever variables you set up
if (request.session.isAuthenticated)
    return next();

// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
response.redirect('/login');
}


module.exports = router;