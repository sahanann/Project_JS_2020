(function () {

    openTables();

    
    // alert("test");
    var ajoutSlider = document.getElementById("ajoutProfBtn");
    ajoutSlider.addEventListener("click", () => {
        // location.reload();
    })
})();



function openTables() {
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
        console.log(data);
        var addCell = (tr, value) => {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = value;
        }
        
        var tableHolder = document.getElementById("userTableHolder");
        var curUserID = data[0]["id"];
        var headers = ["jour", "debut", "fin", "bloc", "intitule", "type", "finalite"];

        var tableBase = document.querySelector(".userChoiceTable");

        var indx = 0;
        for (var x = 0; indx < data.length; x++) {
            var table = tableBase.cloneNode(true);
            table.style.display = null;
            var username = `${data[indx]["nom"]} ${data[indx]["prenom"]}`;
            console.log(username);


            for (; indx < data.length; indx++) {
                if (curUserID != data[indx]["id"]) {
                    curUserID = data[indx]["id"];
                    break;
                }

                tr = table.insertRow(-1);
                for (var j = 0; j < headers.length; j++) {
                    if (headers[j] === "type") {
						if (data[indx]["type"] == 1) 
							addCell(tr, "Théorie");
						else if (data[indx]["type"] == 2)
							addCell(tr, "Labo");
						else
							addCell(tr, "TFE");
                    }
                    else if (headers[j] === "finalite") {
                        var str = data[indx]["finalite"];
						var final = ["I", "R", "G"];
						for (var x = 0; x < 3; x++)
							if (str.charAt(x) === final[x])
								addCell(tr, " x ");
							else 
								addCell(tr, "   ");
                    }
                    else 
                        addCell(tr, data[indx][headers[j]]);
                }
            }
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

}








function addOptions(select, value, text) {
    var option = document.createElement("option");
    option.value = value;
    option.text = text;
    select.add(option);
}











function getXMLHttpRequest() {
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject) {
		if (window.ActiveXObject) {
			try {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} else {
			xhr = new XMLHttpRequest(); 
		}
	} else {
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}
	
	return xhr;
}