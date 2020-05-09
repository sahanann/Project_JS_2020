
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
        var query = [`SELECT * FROM user WHERE email = "${email}";`];
        // var callBack = function(data)
        getData(query, [(data) => {
            var error = document.getElementById("emialInputErr");
            if (data == false)
                error.innerText = "";
            else
                error.innerText = "*adresse email existe déjà";
        }]);

        if (error.innerText === "")
            return false;
        else
            return true;
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




(function () {
    
    document.querySelectorAll(".ftextInput").forEach(item => {
        console.log(item.id);
        item.addEventListener("keyup", () => check[item.id](item));
    });

    

    var choixCours = document.getElementById("choixCoursBtn");
    choixCours.addEventListener("click", checkUserInfo);
})();

function checkUserInfo(e) {
    var isAnyError = false;
    var objValues = {};
    document.querySelectorAll(".ftextInput").forEach(item => {
        if (check[item.id](item))
            isAnyError = true;
        else 
            objValues[item.id] = item.value;
                    
    });


    

    if (!isAnyError) {
        objValues["etablInput"] = document.getElementById("etablInput").value;

        var cdChoice = "";
        var finalites = ["I", "R", "G"];
        document.querySelectorAll(".cbFinalite").forEach((element, index) => {
            if (element.checked)
                cdChoice = cdChoice + finalites[index];
            else
                cdChoice = cdChoice + "-";

        });
        objValues["cbFinalite"] = cdChoice;

        afficheTableCours(e, objValues);
    }
}




function afficheTableCours(e, userData) {
    document.getElementById("formHolder").style.display = "none";
    document.getElementById("chxBtnHolder").style.display = "none";
    document.getElementById("tblCoursHolder").style.display = "block";
    document.querySelector(".custom-select").style.display = "block";
    document.querySelectorAll(".choseDateHolder").forEach(item => {item.style.maxWidth = "1000px";});
    document.getElementById("submitBtn").style.display = "block";

    var choixCours = e.target;

    while (choixCours.className.indexOf('choixCours') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
        choixCours = choixCours.parentNode;
    }


    var formPanel = document.querySelector(".formPanel");
    formPanel.style.height = "80px";
    formPanel.classList.add("bigButton");

    choixCours.classList.remove("bigButton");
    choixCours.style.height = "600px";
    choixCours.style.cursor = "default";
    

    choixCours.removeEventListener("click", checkUserInfo);
    formPanel.addEventListener("click", formPanelOnClick);

    
    document.getElementById("submitBtn").addEventListener("click", () => {
        
        // console.log(userData);
        var selectedValues = [];

        for(var i = 1; i <= 4; i++) {
            var className = `.tblCoursG${i}Selected`;
            document.querySelectorAll(className).forEach(element => selectedValues.push(element.lastChild.innerHTML));
        }

        var queryWhere = ``;
        for (var i = 0; i < selectedValues.length; i++) {
            queryWhere += ` horraire.idHorraire = ${selectedValues[i]}`
            if (i != selectedValues.length - 1)
                queryWhere += ` OR`;
        }

        var query = 
        [`SELECT cours.id, cours.intitule, cours.nbrPlaces
        FROM horraire LEFT JOIN cours ON (horraire.idCours = cours.id)
        WHERE ${queryWhere}
        ORDER BY cours.id;`];

        // console.log(query);

        console.log(query);
        getData(query, [(data) => {
            var emptyCoursList = [];
            // console.log(data);
            for (var i = 0; i < data.length; i++) {
                if(data[i]["nbrPlaces"] == 0) {
                    emptyCoursList.push(data[i]["intitule"])
                }
            }

            // console.log(data);
            
            if (emptyCoursList === undefined || emptyCoursList.length == 0) {
                insertUser(userData, data);
            }
            else {
                alert(`Pas de places pour le(s) cours : ${emptyCoursList}`);
            }

        }]);

    });
}


function insertUser(userData, choixData) {
    
    querySelect = ["SELECT id FROM user ORDER BY id"];
    var idUser;
    getData(querySelect, [(data) => {
        
        if (data == false)
            idUser = 1;
        else
            idUser = parseInt(data[data.length - 1]["id"]) + 1;
            
        
        var queryInsertUser = `INSERT INTO user(id, nom, prenom, email, etablissement, finalite) \
            VALUES ("${idUser}", "${userData["nomInput"]}", "${userData["prenomInput"]}", \
            "${userData["emialInput"]}", "${userData["etablInput"]}", "${userData["cbFinalite"]}");`;
        
        console.log(`id uder = ${idUser}`);
        console.log(`query user = ${queryInsertUser}`);

        var queryValues = ``;
        for (var i = 0; i < choixData.length; i++) {
            queryValues += `(${idUser}, ${choixData[i]["id"]})`;
            if (i != choixData.length - 1)
                queryValues += `, `;
        }
        var queryInsertChoix = `INSERT INTO choix(idUser, idHorraire) VALUES ${queryValues}`;


        var queryList = [queryInsertUser, queryInsertChoix];
        for (var i = 0; i < choixData.length; i++) {
            var updateQuery = `UPDATE cours SET nbrPlaces = nbrPlaces - 1 WHERE cours.id = ${choixData[i]["id"]}`;
            queryList.push(updateQuery);
        }

        
        setData(queryList, true);

    }]);
   
}








function formPanelOnClick(e) {
    document.getElementById("chxBtnHolder").style.display = "block";
    document.getElementById("formHolder").style.display = "block";
    document.getElementById("tblCoursHolder").style.display = "none";
    document.querySelector(".custom-select").style.display = "none";
    document.querySelectorAll(".choseDateHolder").forEach(item => {item.style.maxWidth = "300px";});
    document.getElementById("submitBtn").style.display = "none";


    var formPanel = e.target;

    while (formPanel.className.indexOf('formPanel') == -1) {
        formPanel = formPanel.parentNode;
    }


    var choixCours = document.querySelector(".choixCours");
    choixCours.style.height = "80px";
    choixCours.classList.add('bigButton');
    choixCours.style.cursor = "pointer";

    formPanel.style.height = "600px";
    formPanel.classList.remove('bigButton');

    formPanel.removeEventListener("click", formPanelOnClick);
    choixCours.addEventListener("click", checkUserInfo);

}