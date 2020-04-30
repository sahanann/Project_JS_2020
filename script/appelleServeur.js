(function () {
    
    openTableHorraire();
})();

function openTableHorraire() {
    var xhr = getXMLHttpRequest();

    xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			var response = xhr.responseText;

			if (response == "ERRSQL")
				alert("Err conexion bd");
			else if (response == "NOTHING") {
                alert("No data found");
			}
			else if (response == "ERRQUERY")
				alert("Err Query");
			else {
				createTable(JSON.parse(xhr.responseText));
			}
		}
    }

    xhr.open("GET", "php/tableCours.php",true);
    xhr.send();
}

function createTable(obj) {
	var headers = [];
    for (var i = 0; i < obj.length; i++) {
        for (var key in obj[i]) {
            if (headers.indexOf(key) === -1) {
                headers.push(key);
            }
        }
	}
	
	var table = document.querySelector(".tabelCoursHorr");
	console.log(headers);

	for (var i = 0; i < obj.length; i++) {
		tr = table.insertRow(-1);
		for (var j = 0; j < headers.length; j++) {
			
			if (headers[j] === "type") {
				if (obj[i][headers[j]] == 1) 
					addCell(tr, "Théorie");
				else if (obj[i][headers[j]] == 2)
					addCell(tr, "Labo");
				else
					addCell(tr, "TFE");
			}
			else if (headers[j] === "finalite") {
				var str = obj[i][headers[j]];
				var final = ["I", "R", "G"];
				for (var x = 0; x < 3; x++)
					if (str.charAt(x) === final[x])
						addCell(tr, " x ");
					else 
						addCell(tr, "   ");
				
			}
			else {
				addCell(tr, obj[i][headers[j]]);
			}
			// var tabCell = tr.insertCell(-1);
			// tabCell.innerHTML = obj[i][headers[j]];
			
		}
	}
}

function addCell(tr, value) {
	var tabCell = tr.insertCell(-1);
	tabCell.innerHTML = value;
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