
function getErrTooltip(s) {
    return document.getElementById(s + "Err");
}

var check = {};

check["emialInput"] = function(item) {
    var emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var error = getErrTooltip(item.id);
    var email = item.value;
    
    if (email === "" || email == null) {
        error.innerText = "*email is required";
        return true;
    }
    else if (!emailFormat.test(email)) {
        error.innerText = "*email is invalid";
        return true;
    }
    else {
        error.innerText = "";
        return false;
    }
};

check["nomInput"] = function(item) {
    var name = item.value;
    var error = getErrTooltip(item.id);

    if (name === "" || name == null) {
        error.innerText = "*champs est requis";
        return true;
    }        
    else if (!/^[a-z]+$/i.test(name)) {
        error.innerText = "*champ est invalide";
        return true;
    }
    else {
        error.innerText = "";
        return false;
    }
};

check["prenomInput"] = check["nomInput"];
check["etablInput"] = check["nomInput"];




(function () {
    
    document.querySelectorAll(".ftextInput").forEach(item => {
        item.addEventListener("keyup", () => check[item.id](item));
    });

    var choixCours = document.querySelector(".choixCours");
    choixCours.addEventListener("click", (e) => {
        choixCours.style.background = "white";
        document.querySelector(".formPanel").style.height = "100px";
        document.getElementById("formHolder").style.display = "none";
        choixCours.style.height = "500px";
    });
})();
