# Instagram Clone


----

**What is this?** 

This is my own version of instagram.

---


## Technologies Used

```js
 HTML/CSS
 Express
 Handlebars
 Knex/ PostgreSQL
 
```




## Site Layout

![](public/img/wireframe/Home.png)

![](public/img/wireframe/Profile_Page.png)

![](public/img/wireframe/Tags.png)

## Features

  * Upload/ Delete Media (photos)
  * Registration
  * Send Direct Messages
  * Search
  * News Feed
  * Ability to Follow/ Unfollow
  * Like Content
  * Search & Iterate for Location, Users, Hashtags


  ## Challenges

  * Setting relations for friends following other friends
  * Setting it up so user only sees people they are following
  * Adding the abiltiy for users to add hashtag categories based off what content they tag
  * Capturing hashtags, that users use in their post caption



  ## Requirements

  * User should be able to register
  * User should be able to login
  * User should be able to post content
  * User should only be able to see the posts of users that they are following
  * Users should be able to see their own profile page
  * Users should be able to see the profile pictures of others users
  * Users should can go see other profile pictures, but wont be able to actually see the posts of users they arent following.
  * Users should be able to search for content associated with certain tags
  * Users should be able to like pictures
  * Users should only get be able to like one time per post
  * Users should be able to comment on posts


   ## Problems/Challenges/Solutions

   * Switched from Bootstrap 3 to 4, for the ability to utilize flexbox.
   * Maybe using regex so when user uses a hashtag on caption we put it in that category



   ## Gotchas to learn from

   * order your tables in your drop function based on relation. Delete tables that rely on other tables first.
   * when seeding database in knex js , dont add id values manually. If you do it will mess up that auto incrementing procress
   