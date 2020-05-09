(function () {
    // sendEmail();
})();

function sendEmail(url) {
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "jsproject2020@gmail.com",
        Password : "F09E7119C3957658F9F17089E69C0DEB859D",
        To : 'sahanan377@gmail.com',
        From : "jsproject2020@gmail.com",
        Subject : "This is the subject",
        Body : `<h1>Inscription avec succès!</h1><p>Vos choix : ${url}</p>`
    }).then(
      message => alert(message)
    );
}