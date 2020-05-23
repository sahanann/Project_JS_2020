(function () {

    var userFieldVerif = {
        nomInput: champsVerif.nom,
        prenomInput: champsVerif.nom,
        emialInput: champsVerif.email
    };
    
    document.querySelectorAll(".ftextInput").forEach(item => {
        item.addEventListener("keyup", () => userFieldVerif[item.id](item));
    });


    var choixCoursElem = document.getElementById("choixCoursBtn");
    choixCoursElem.addEventListener("click", checkUserInfo);

    

    function checkUserInfo (e) {
        var objValues = {};
        var checkError = true;

        document.querySelectorAll(".ftextInput").forEach(item => {
            console.log(`check = ${checkError}`);
            if (userFieldVerif[item.id](item) == false)
                checkError = userFieldVerif[item.id](item);
            objValues[item.id] = item.value;
        });

        console.log(`check = ${checkError}`);
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
    }

    

    function messageModal(cours) {
        var modal = document.querySelector(".msgModalBox");

        modal.style.display = "block";

        var modalBody = document.querySelector(".msgModal-body");
        modalBody.innerHTML = "";
        for (var i = 0; i < cours.length; i++) {
            var p = document.createElement("p");
            p.innerHTML = cours[i];
            modalBody.appendChild(p);
        }

        document.querySelector(".closeMsgBox").addEventListener("click", () => {
            modal.style.display = "none";
        });

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
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
        document.querySelector(".dateBtnHolder").style.display = tableDisplay;

        if (tableDisplay != "none") {
            setTimeout(() => document.getElementById("tableMsgBox").style.display = tableDisplay, 500);
        }
        else
            document.getElementById("tableMsgBox").style.display = tableDisplay;
    
    
        var elemB = document.querySelector(className);
        elemB.style.height = "80px";
        elemB.classList.add("bigButton");
    
        elemA.classList.remove("bigButton");
        elemA.style.height = "600px";
    
        elemA.removeEventListener("click", callBackA);
        elemB.addEventListener("click", callBackB);
    }




    


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

        
        server.getData(query, [ (data) => {typeCours = data;},
            (data) => {
            var emptyCoursList = [];
            
            for (var i = 0; i < data.length; i++) 
                if(data[i]["nbrPlaceOccuper"] == typeCours[data[i]["type"]]["nbrPlaces"])
                    emptyCoursList.push(data[i]["intitule"]);
                
            
            if (emptyCoursList === undefined || emptyCoursList.length == 0) 
                insertUser(userData, data, () => sendEmail(userData["emialInput"]));
            else {
                messageModal(emptyCoursList);
                // alert(`Pas de places pour le(s) cours : ${emptyCoursList}`);
            }
                

        }]);

    });

    

    
})();

















