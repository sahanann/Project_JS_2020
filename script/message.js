(function () {
    var errorAction = {};
    var url = new URL(window.location.href);

    var code = url.searchParams.get("code");
    var msgElem = document.getElementById("confBoxMsg");
    var titleElem = document.getElementById("confBoxMsgTitle");
    var imgBox = document.querySelector(".msgImage");

    errorAction["0"] = () => {
        titleElem.innerHTML = "Erreur";
        msgElem.innerHTML = "Problème avec le serveur";
        imgBox.setAttribute("class", "msgImageError");
    }

    errorAction["1"] = () => {
        titleElem.innerHTML = "Inscreption avec succès";
        msgElem.innerHTML = "Confirmation est envoyer a votre adresse";
        imgBox.setAttribute("class", "msgImageSuccess");
    }

    errorAction["2"] = () => {
        titleElem.innerHTML = "Erreur";
        msgElem.innerHTML = "La date d'inscription est expiere";
        imgBox.setAttribute("class", "msgImageError");
    }

    errorAction[code]();

})();