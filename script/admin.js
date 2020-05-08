(function () {

    openTables();

    
    // alert("test");
    var ajoutSlider = document.getElementById("ajoutProfBtn");
    ajoutSlider.addEventListener("click", () => {
        // location.reload();
    })
})();



function openTables() {
    var headers = ["cours", "professeur", "jours", "duree"];
    var queries = {};
    queries["cours"] = "SELECT id, intitule FROM cours;";
    queries["professeur"] = "SELECT id, nom, prenom FROM professeur;";
    queries["jours"] = "SELECT id, jour FROM jours;";
    queries["duree"] = "SELECT id, debut, fin, categorie FROM duree order by debut;";


    xhr = getXMLHttpRequest();

    (function loop(i, length) {
        if (i>= length)
            return;

        var header = headers[i];
        var url = "php/getData.php?Query="+queries[header];
        xhr.open("GET", url, true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                var response = xhr.responseText;

                if (response == "ERRSQL")
                    alert("Err conexion bd");
                else if (response == "NOTHING")
                    alert("No data found");
                else if (response == "ERRQUERY")
                    alert("Err Query");
                else 
                    editSelect[header](JSON.parse(xhr.responseText));

                loop(i + 1, length);
            }
        }

        xhr.send();

    })(0, headers.length);
    
}


var editSelect = {};

editSelect["cours"] = function(data) {
    var select = document.getElementById("nomCoursSelect");

    for(var i = 0; i < data.length; i++)
        addOptions(select, data[i]["id"], data[i]["intitule"]);

}

editSelect["professeur"] = function(data) {

    var select = document.getElementById("nomProfSelect");

    for(var i = 0; i < data.length; i++)
        addOptions(select, data[i]["id"], data[i]["nom"] + " " + data[i]["prenom"]);
}

editSelect["jours"] = function(data) {
    var select = document.getElementById("jourSelect");

    for(var i = 0; i < data.length; i++)
        addOptions(select, data[i]["id"], data[i]["jour"]);
}

editSelect["duree"] = function(data) {
    var selectDebut = document.getElementById("heureDebutSelect");
    // var selectFin = document.getElementById("heureFinSelect");


    for(var i = 0; i < data.length; i++) {
        addOptions(selectDebut, data[i]["id"], data[i]["debut"] + " - " + data[i]["fin"]);
    }
        
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