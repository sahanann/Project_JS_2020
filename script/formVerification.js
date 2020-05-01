
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
    choixCours.addEventListener("click", choixCoursOnClick);
})();


function choixCoursOnClick(e) {
    document.getElementById("formHolder").style.display = "none";
    document.getElementById("chxBtnHolder").style.display = "none";
    document.getElementById("tblCoursHolder").style.display = "block";
    document.querySelector(".custom-select").style.display = "block";
    document.querySelector(".choseDateHolder").style.maxWidth = "1000px";

    var choixCours = e.target;

    while (choixCours.className.indexOf('choixCours') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
        choixCours = choixCours.parentNode;
    }


    var formPanel = document.querySelector(".formPanel");
    formPanel.style.height = "80px";
    formPanel.classList.add("bigButton");

    choixCours.classList.remove("bigButton");
    // choixCours.style.height = "500px";
    // var rr = 
    choixCours.style.height = "600px";
    choixCours.style.cursor = "default";
    

    choixCours.removeEventListener("click", choixCoursOnClick);
    formPanel.addEventListener("click", formPanelOnClick);
}

function formPanelOnClick(e) {
    document.getElementById("chxBtnHolder").style.display = "block";
    document.getElementById("formHolder").style.display = "block";
    document.getElementById("tblCoursHolder").style.display = "none";
    document.querySelector(".custom-select").style.display = "none";
    document.querySelector(".choseDateHolder").style.maxWidth = "300px";


    var formPanel = e.target;

    while (formPanel.className.indexOf('formPanel') == -1) {
        formPanel = formPanel.parentNode;
    }


    var choixCours = document.querySelector(".choixCours");
    choixCours.style.height = "80px";
    // choixCours.style.backgroundColor = "rgb(236, 22, 68)";
    choixCours.classList.add('bigButton');
    choixCours.style.cursor = "pointer";

    formPanel.style.height = "600px";
    formPanel.classList.remove('bigButton');

    formPanel.removeEventListener("click", formPanelOnClick);
    choixCours.addEventListener("click", choixCoursOnClick);

}