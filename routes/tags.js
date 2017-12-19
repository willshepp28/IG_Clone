
const router = require('express').Router(),
knex = require('../db/knex'),
{ getAllFollowRequests } = require('../db/query');






/*
|--------------------------------------------------------------------------
|  /Tags:hastag Page
|--------------------------------------------------------------------------
*/
router
    .route('/:id')
    .get(async (request, response) => {

        // only run this is the user is logged in
        if (request.session.isAuthenticated ) {

            var followRequests = await getAllFollowRequests(request.session.user_id)
        }



        // we need a regex to find all the # in 
        var categories = await knex.select('categories.id', 'category_name', 'post_id', 'category_id AS anotherId', 'photo', 'posts.id AS postId')
            .from('categories')
            .where('category_name', request.params.id)
            .innerJoin('posts_in_categories', 'categories.id', 'category_id')
            .innerJoin('posts', 'post_id', 'posts.id')
            .then((category) => {
             
            

                var categoryInfo = {};
                    categoryInfo.name = category[0].category_name;
                    categoryInfo.postCount = category.length;

              

                response.render('category', { category, follow: followRequests, categoryInfo  });

            })
            .catch((error) => { console.log(error); response.send(error + " this is the reason") });
    });






    module.exports = router;