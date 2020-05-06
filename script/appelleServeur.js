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
	
	
	// console.log(headers);
	var tableGrpClass = ["tblCoursG1", "tblCoursG2", "tblCoursG3", "tblCoursG4"];

	var tableBase = document.querySelector(".tabelCoursHorr");

	var datesList = [];
	var leDate = obj[0]["jour"];
	datesList.push(leDate);
	addElemToSelect(leDate);

	
	var indx = 0;
	for (var xx = 0; indx < obj.length; xx++) {
		var table = tableBase.cloneNode(true);
		var idString = "tableCours" + xx;
		table.setAttribute("id", idString);
		if (xx == 0)
			table.style.display = null;
		else
			table.style.display = "none";

		for (;indx < obj.length; indx++) {
			if (leDate != obj[indx]["jour"]) {
				leDate = obj[indx]["jour"];
				addElemToSelect(leDate);
				datesList.push(leDate);
				break;
			}
			else {
				tr = table.insertRow(-1);
				tr.classList.add("tableRowStyle");
				tr.classList.add(tableGrpClass[parseInt(obj[indx]["categorie"]) - 1]);
				tr.classList.add("tableNum" + xx);
				tr.addEventListener("click", tableRowOnClick);
		
		
		
				for (var j = 0; j < headers.length - 3; j++) {
					
					if (headers[j] === "type") {
						if (obj[indx]["type"] == 1) 
							addCell(tr, "Théorie");
						else if (obj[indx]["type"] == 2)
							addCell(tr, "Labo");
						else
							addCell(tr, "TFE");
					}
					else if (headers[j] === "finalite") {
						var str = obj[indx]["finalite"];
						var final = ["I", "R", "G"];
						for (var x = 0; x < 3; x++)
							if (str.charAt(x) === final[x])
								addCell(tr, " x ");
							else 
								addCell(tr, "   ");
						
						var strId = obj[indx]["idHorraire"];
						var tabCell = tr.insertCell(-1);
						tabCell.setAttribute("class", "invisibleCell");
						tabCell.innerHTML = strId;
					}
					else {
						addCell(tr, obj[indx][headers[j]]);
					}
				}
			}
				
	
	
			

		}

		document.getElementById("tblCoursHolder").appendChild(table);
	}
	// document.getElementById("tableCours2").style.display = null;

	
}

function addCell(tr, value) {
	var tabCell = tr.insertCell(-1);
	tabCell.innerHTML = value;
}

var minChoice = 2;
var selectedCount = [0, 0, 0];
var currentTable = 0;

function tableRowOnClick(e) {
	var row = e.target;

    while (row.className.indexOf('tableRowStyle') == -1) {
        row = row.parentNode;
	}

	console.log(row.lastChild);

	var tableNum = row.classList[2];
	var groupe = row.classList[1];
	var selected = groupe + "Selected";

	if(row.classList.contains(selected)) {
		row.classList.remove(selected);
		selectedCount[currentTable]--;
	}
	else {
		var elements = document.getElementsByClassName(groupe + " " + tableNum);
		// console.log(elements[0]);
		for (var i = 0; i < elements.length; i++)
			if(elements[i].classList.contains(selected)) {
				elements[i].classList.remove(selected);
				selectedCount[currentTable]--;
				break;
			}
				
		row.classList.add(selected);
		selectedCount[currentTable]++;
	}

	console.log(selectedCount[currentTable]);
	if (selectedCount[currentTable] > 0 && selectedCount[currentTable] < minChoice) {
		document.getElementById("datesSelector").disabled = true;
		document.getElementById("submitBtn").disabled = true;
	}
	else {
		document.getElementById("datesSelector").disabled = false;
		document.getElementById("submitBtn").disabled = false;
	}

	// console.log(row);
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