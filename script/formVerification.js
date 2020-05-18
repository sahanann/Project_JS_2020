(function () {

    var userFieldVerif = {
        nomInput: champsVerif.nom,
        prenomInput: champsVerif.nom,
        emialInput: champsVerif.email
    };
    
    document.querySelectorAll(".ftextInput").forEach(item => {
        console.log(item.id);
        item.addEventListener("keyup", () => userFieldVerif[item.id](item));
    });


    var choixCoursElem = document.getElementById("choixCoursBtn");
    choixCoursElem.addEventListener("click", checkUserInfo);

    

    function checkUserInfo (e) {
        var objValues = {};
        var checkError = true;
        console.log("test");

        document.querySelectorAll(".ftextInput").forEach(item => {
            checkError = userFieldVerif[item.id](item);
            objValues[item.id] = item.value;
            console.log("test");
        });
    
        if (checkError != false) {
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

        var choixCours = e.target;
    
        while (choixCours.className.indexOf('choixCours') == -1) { // Cette boucle permet de remonter jusqu'à la zone de drop parente
            choixCours = choixCours.parentNode;
        }
    
        modifStyleOnClick("none", "block", "1000px", choixCours, ".formPanel", checkUserInfo, formPanelOnClick);
    
        
        document.getElementById("submitBtn").addEventListener("click", () => {
            
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
            [`SELECT id, nbrPlaces FROM typecours`,
            `SELECT horraire.idHorraire , cours.intitule, horraire.nbrPlaceOccuper, cours.type
            FROM horraire LEFT JOIN cours ON (horraire.idCours = cours.id)
            WHERE ${queryWhere}`];

            var typeCours;
    
            
            getData(query, [ (data) => {typeCours = data;},
                (data) => {
                var emptyCoursList = [];
                
                for (var i = 0; i < data.length; i++) 
                    if(data[i]["nbrPlaceOccuper"] == typeCours[data[i]["type"]]["nbrPlaces"])
                        emptyCoursList.push(data[i]["intitule"]);
                    
                
                if (emptyCoursList === undefined || emptyCoursList.length == 0) 
                    insertUser(userData, data, userData["emialInput"]);
                else 
                    alert(`Pas de places pour le(s) cours : ${emptyCoursList}`);
    
            }]);
    
        });
    }

    function formPanelOnClick(e) {
    
        var formPanel = e.target;
    
        while (formPanel.className.indexOf('formPanel') == -1) {
            formPanel = formPanel.parentNode;
        }
        
        modifStyleOnClick("block", "none", "300px", formPanel, ".choixCours", formPanelOnClick, checkUserInfo);
    
    }


    function modifStyleOnClick(formDisplay, tableDisplay, size, elemA, className, callBackA, callBackB) {
        document.getElementById("formHolder").style.display = formDisplay;
        document.getElementById("chxBtnHolder").style.display = formDisplay;
        document.getElementById("tblCoursHolder").style.display = tableDisplay;
        document.querySelector(".custom-select").style.display = tableDisplay;
        document.querySelectorAll(".choseDateHolder").forEach(item => {item.style.maxWidth = size;});
        document.getElementById("submitBtn").style.display = tableDisplay;
    
    
        var elemB = document.querySelector(className);
        elemB.style.height = "80px";
        elemB.classList.add("bigButton");
    
        elemA.classList.remove("bigButton");
        elemA.style.height = "600px";
    
        elemA.removeEventListener("click", callBackA);
        elemB.addEventListener("click", callBackB);
    }




    

    

    
})();

















