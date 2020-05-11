(() => {

    var addOptions = (select, value, text) => {
        var option = document.createElement("option");
        option.value = value;
        option.text = text;
        select.add(option);
    }

    var onExportBtnClicked = (data) => {
        let csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(element => {
            var row = Object.values(element).join(";");
            csvContent += row + "\r\n";
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link); // Required for FF

        link.click();
    }

    /**
     * - 0 : ajout des données dans le select de nomCoursSelect
     * - 1 : ajout des données dans le select de nomProfSelect
     * - 2 : ajout des données dans le select de jourSelect
     * - 3 : ajout des données dans le select de heureDebutSelect
     * - 4 : ajout des données des utilisateurs et leurs choix des cours
    */
    var editSelect = new Array(5);

    editSelect[0] = function(data) {
        var select = document.getElementById("nomCoursSelect");

        for(var i = 0; i < data.length; i++)
            addOptions(select, data[i]["id"], data[i]["intitule"]);

    }


    editSelect[1] = function(data) {

        var select = document.getElementById("nomProfSelect");

        for(var i = 0; i < data.length; i++)
            addOptions(select, data[i]["id"], data[i]["nom"] + " " + data[i]["prenom"]);
    }


    editSelect[2] = function(data) {
        var select = document.getElementById("jourSelect");

        for(var i = 0; i < data.length; i++)
            addOptions(select, data[i]["id"], data[i]["jour"]);
    }


    editSelect[3] = function(data) {
        var selectDebut = document.getElementById("heureDebutSelect");

        for(var i = 0; i < data.length; i++) {
            addOptions(selectDebut, data[i]["id"], data[i]["debut"] + " - " + data[i]["fin"]);
        }
            
    }


    editSelect[4] = function(data) {
        
        document.getElementById("exportListBtn").addEventListener("click", () => onExportBtnClicked(data));
        
        var addCell = (tr, value) => {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = value;
        }
        
        var tableHolder = document.getElementById("userTableHolder");

        var tableBase = document.querySelector(".userChoiceTable");

        drawTable.checkItem = data[0]["id"];
        drawTable.data = data;
        drawTable.check = () => {
            if (drawTable.checkItem != drawTable.data[drawTable.index]["id"]) {
                drawTable.checkItem = drawTable.data[drawTable.index]["id"];
                return false;
            }
            else
                return true;
        }
        drawTable.headers = ["jour", "debut", "fin", "bloc", "intitule", "type", "finalite"];

        
        for (var x = 0; drawTable.index < data.length; x++) {
            var table = tableBase.cloneNode(true);
            table.style.display = null;
            var username = `${data[drawTable.index]["nom"]} ${data[drawTable.index]["prenom"]}`;
            
            
            drawTable.buildRows(table);

            var nameElem = document.createElement("DIV");
            nameElem.innerHTML = username;
            nameElem.setAttribute("class", "userNameHolder");
            tableHolder.appendChild(nameElem);
            tableHolder.appendChild(table);
        }
    }
    
    var queries = ["SELECT id, intitule FROM cours;",
                    "SELECT id, nom, prenom FROM professeur;",
                    "SELECT id, jour FROM jours;",
                    "SELECT id, debut, fin, categorie FROM duree order by debut;",
                    "SELECT user.id, user.nom, user.prenom, SUBSTRING(jours.jour, 6, 5) AS jour, \
                        SUBSTRING(duree.debut, 1, 5) AS debut, SUBSTRING(duree.fin, 1, 5) AS fin, cours.bloc, cours.intitule, cours.type, cours.finalite \
                     FROM choix LEFT JOIN user \
                     ON(choix.idUser = user.id) LEFT JOIN horraire \
                     ON(choix.idHorraire = horraire.idHorraire) LEFT JOIN cours \
                     ON(horraire.idCours = cours.id) LEFT JOIN jours \
                     ON(horraire.idJour = jours.id) LEFT JOIN duree \
                     ON(horraire.idDuree = duree.id) \
                     ORDER BY user.nom, user.prenom, jours.jour, duree.debut"];

    
    getData(queries, editSelect);

})();



















