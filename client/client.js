
/////////////////////////////
////    client side     ////
///////////////////////////


const API_URL = 'http://localhost:8000/api/v1/user';
const API_POST = 'http://localhost:8000/api/v1/post';








// $(() => {
//     $.get(API_URL)
//         .then((user) => {

//             const $user = $('#users');

//             user.forEach(user => {
//                 $user.append(`<img src="${user.profilePic}"></img>`)
//             })
//         })
// });



$(() => {
    $.get(API_POST)
        .then(post => {

           
            const $user = $('#users');


        post.forEach(posts => {
            $user.append(`
            
            <div class="row">
            <div class="col-lg-5 col-md-7 col-12 mx-auto">
              <div class="card ">
                <p class="card-header white-bg">
                  <a href="/profile/${posts.userId}">
                    <img src="${posts.profilePic}" alt="user profile picture" style="height: 25px;" class="rounded-circle">
                    <strong>${posts.username}</strong>
                  </a>
                </p>
                <img class="card-img-top img-fluid" src="${posts.photo}" alt="Card image cap">
                <div class="card-block">
        
        
                 
                  <div class="d-flex flex-row my-flex-container iconContainer">
        
                    <form action="/likes/" method="post">
                      <button type="submit" class="likePost">
                        <span class="ig_sprites navIcons" id="heart2"></span>
                      </button>
                    </form>
        
        
        
                 
                    <span class="order-2 commentBtn ig_sprites navIcons" id="comments"></span>
        
        
        
        
                   
                    <span class="order-3 ml-auto ig_sprites navIcons" id="save"></span>
        
                  </div>
        
                </div>
              </div>
            </div>
           </div>
            
            
            `)
        })
        })
})