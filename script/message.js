(function () {
    var url = new URL(window.location.href);

    var code = url.searchParams.get("code");
    var msgElem = document.getElementById("confBoxMsg");
    var titleElem = document.getElementById("confBoxMsgTitle");
    if (code == 1) {
        titleElem.innerHTML = "Inscreption avec succès";
        msgElem.innerHTML = "Confirmation est envoyer a votre adresse";
    }
    
})();