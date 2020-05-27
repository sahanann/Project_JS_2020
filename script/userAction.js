(() => {

    var userFieldVerif = {
        nomInput: champsVerif.nom,
        prenomInput: champsVerif.nom,
        emialInput: champsVerif.email
    };
    
    document.querySelectorAll(".ftextInput").forEach(item => {
        item.addEventListener("keyup", () => userFieldVerif[item.id](item));
    });

    document.getElementById("choixCoursBtn").addEventListener("click", checkUserInfo);
    
    var userValues = {};
    function checkUserInfo (e) {
        
        var checkError = true;

        document.querySelectorAll(".ftextInput").forEach(item => {
            if (userFieldVerif[item.id](item) == false)
                checkError = userFieldVerif[item.id](item);
            userValues[item.id] = item.value;
        });


        if (checkError != false) {
            userValues["etablInput"] = document.getElementById("etablInput").value;
    
            var cdChoice = "";
            var finalites = ["I", "R", "G"];
            document.querySelectorAll(".cbFinalite").forEach((element, index) => {
                if (element.checked)
                    cdChoice = cdChoice + finalites[index];
                else
                    cdChoice = cdChoice + "-";
    
            });
            userValues["cbFinalite"] = cdChoice;
    
            afficheTableCours(e);
        }
    }


    function afficheTableCours(e) {
        var choixCours = e.target;
    
        while (choixCours.className.indexOf('choixCours') == -1)
            choixCours = choixCours.parentNode;
    
        modifStyleOnClick("none", "block", "1000px", choixCours, ".formPanel", checkUserInfo, formPanelOnClick);
    }

    

    function messageModal(title, content) {
        document.getElementById("msgModalTitle").innerHTML = title;
        var modal = document.querySelector(".msgModalBox");

        modal.style.display = "block";

        var modalBody = document.querySelector(".msgModal-body");
        modalBody.innerHTML = "";
        for (var i = 0; i < content.length; i++) 
            modalBody.innerHTML += content[i];

        document.querySelector(".closeMsgBox").addEventListener("click", () => modal.style.display = "none");

        window.onclick = (event) => {
            if (event.target == modal)
                modal.style.display = "none";
        }
    }

    function formPanelOnClick(e) {
    
        var formPanel = e.target;
    
        while (formPanel.className.indexOf('formPanel') == -1) 
            formPanel = formPanel.parentNode;
        
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
                    if(data[i]["nbrPlaceOccuper"] == typeCours[parseInt(data[i]["type"]) - 1]["nbrPlaces"])
                        emptyCoursList[i] = `<p>${data[i]["intitule"]}</p>`;
                
                if (emptyCoursList === undefined || emptyCoursList.length == 0) 
                    insertUser(userValues, data, () => sendEmail(userValues["emialInput"]));
                else {
                    messageModal("Pas de places pour le(s) cours suivant(s)", emptyCoursList);
                }
                    

            }]);

    });


    document.getElementById("helpTableBtn").addEventListener("click", () => {
        messageModal("Aide", [
            "<h4>Chaque couleur dans le tableau représente differentes plages horaire:</h4>",
            "<p style='margin-left:40px'>Jaune : 8h20 / 8h50 – 10h20</p>",
            "<p style='margin-left:40px'>Bleu  : 10h30 – 12h30 / 13h</p>",
            "<p style='margin-left:40px'>Rouge : 13h / 13h30 – 15h / 15h30</p>",
            "<p style='margin-left:40px'>Vert  : 15h / 15h30 – 16h / 17h30</p>",
            "<h5>Vous pouvez choisir qu'un cours par plage</h5>"
        ]);
    });


    document.getElementById("adminIconBtn").addEventListener("click", () => {
        window.open(`adminConnect.html`, `_self`);
    })
    
})();

















