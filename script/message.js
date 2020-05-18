(function () {
    var url = new URL(window.location.href);

    var code = url.searchParams.get("code");
    var msgElem = document.getElementById("confBoxMsg");
    var titleElem = document.getElementById("confBoxMsgTitle");
    var imgBox = document.querySelector(".msgImage");
    
    if (code == 1) {
        titleElem.innerHTML = "Inscreption avec succès";
        msgElem.innerHTML = "Confirmation est envoyer a votre adresse";
        imgBox.setAttribute("class", "msgImageSuccess");
    }
    if (code == 0) {
        titleElem.innerHTML = "Erreur";
        msgElem.innerHTML = "Problème avec le serveur";
        imgBox.setAttribute("class", "msgImageError");
    }
    
})();