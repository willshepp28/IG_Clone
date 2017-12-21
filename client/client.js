// Client.JS


const API_URL = 'http://localhost:8000/api/v1/user';






$(() => {
    $.get(API_URL)
        .then(user => {

            // Get the class with the id of users
            const $user = $('#users');


            user.forEach(i => {
                $user.append(`<h2>${i.password}</h2><br>`);
            })
        })
});


$(() => {
    $.get(API_URL)
        .then((user) => {

            const $user = $('#users');

            user.forEach(user => {
                $user.append(`<img src="${user.profilePic}"></img>`)
            })
        })
})