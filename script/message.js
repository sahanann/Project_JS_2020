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
        titleElem.innerHTML = "Inscription avec succès";
        msgElem.innerHTML = "Une confirmation est envoyée à votre adresse";
        imgBox.setAttribute("class", "msgImageSuccess");
    }

    errorAction["2"] = () => {
        titleElem.innerHTML = "Erreur";
        msgElem.innerHTML = "La date d'inscription est expirée";
        imgBox.setAttribute("class", "msgImageError");
    }

    errorAction[code]();

})();