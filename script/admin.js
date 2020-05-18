(() => {
    
    function exportHTML(name){
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
             "xmlns:w='urn:schemas-microsoft-com:office:word' "+
             "xmlns='http://www.w3.org/TR/REC-html40'>"+
             "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title> \
             <style> body {background-color: powderblue; font-family: sans-serif;}</style> </head><body>";
        var footer = "</body></html>";
        var sourceHTML = header+document.getElementById("source-html").innerHTML+footer;
        
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${name}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }

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
    var editSelect = new Array(7);

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
            var userId = data[drawTable.index]["id"];
            var ind = drawTable.index;
            
            
            drawTable.buildRows(table);

            var nameElem = document.createElement("DIV");
            nameElem.innerHTML = username;
            nameElem.setAttribute("class", "userNameHolder");
            tableHolder.appendChild(nameElem);
            tableHolder.appendChild(table);

            var button = document.createElement("button");
            button.innerHTML = "Attestation";
            button.setAttribute("class", "attestationBtn");
            button.setAttribute("id", `${userId}-BtnAtt`);
            button.addEventListener("click", (element) => {
                var target = element.target;
                var id = target.id.substring(0, target.id.indexOf('-'));
                createAttestation(id);
            });
            tableHolder.appendChild(button);
        }
    }

    function createAttestation(id) {
        var query = [
            `SELECT DISTINCT user.nom, user.prenom, jours.jour
             FROM choix LEFT JOIN user
                ON(choix.idUser = user.id) LEFT JOIN horraire
                ON(choix.idHorraire = horraire.idHorraire) LEFT JOIN jours
                ON(horraire.idJour = jours.id)
             WHERE user.id = ${id}`];
        
        getData(query, [(data) => {
            var fullName = `${data[0]["nom"]} ${data[0]["prenom"]}`.toUpperCase()
            document.getElementById("attUserName").innerHTML = fullName;
            
            var datesHolder = document.getElementById("attJoursPres");
            datesHolder.innerHTML = "";

            for (var i = 0; i < data.length; i++) {
                var h3 = document.createElement("h3");
                h3.innerHTML = data[i]["jour"];
                datesHolder.appendChild(h3);
            }

            exportHTML(fullName);
        }]);
    }

    editSelect[5] = (data) => {
        var select = document.getElementById("typeCoursSelect");

        document.querySelectorAll(".numberInput").forEach((element, index) => {
            element.value = data[index]["nbrPlaces"];
            addOptions(select, data[index]["nbrPlaces"], data[index]["typeCours"]);
        });
    }

    editSelect[6] = (data) => {
        var cbHolder = document.getElementById("idCbJourImm")
        for (var i = 0; i < data.length; i++) {
            var label = document.createElement("label");
            var input = document.createElement("input");
            var span = document.createElement("span");
            
            label.setAttribute("class", "container");
            label.innerHTML = data[i]["jour"];

            input.type = "checkbox";
            input.setAttribute("class", "cbJourImm");
            input.setAttribute("id", `${data[i]["id"]}-cbJourImm`);

            span.setAttribute("class", "checkmark");

            label.appendChild(input);
            label.appendChild(span);
            cbHolder.appendChild(label);
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
                     ORDER BY user.nom, user.prenom, jours.jour, duree.debut",
                    "SELECT nbrPlaces, typeCours FROM typecours",
                    "SELECT DISTINCT jours.id, jours.jour \
                     FROM jours RIGHT JOIN horraire ON(jours.id = horraire.idJour)"];

    
    getData(queries, editSelect);

})();


















