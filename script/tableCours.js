(function () {

	

	// url = require('url');
	// var url = new URL(window.location.href);

	// http://web2020/projet_JS_2020/user.html?year=2017&month=february
	// console.log(url.searchParams.get("month"));
	// console.log(`${url.origin}/message.html`);

	var minChoice = 2;
	var selectedCount = [0, 0, 0];
	var currentTable = 0;


	function createTable(data) {
		
		var tableGrpClass = ["tblCoursG1", "tblCoursG2", "tblCoursG3", "tblCoursG4"];
	
		var tableBase = document.querySelector(".tabelCoursHorr");
	
		drawTable.checkItem = data[0]["jour"];
        drawTable.data = data;
        drawTable.check = () => {
            if (drawTable.checkItem != drawTable.data[drawTable.index]["jour"]) {
                drawTable.checkItem = drawTable.data[drawTable.index]["jour"];
                return false;
            }
            else
                return true;
        }
		drawTable.headers = ["bloc", "intitule", "type", "debut", "fin", "finalite"];
		drawTable.buildCustomCell = (tr) => {
			var strId = drawTable.data[drawTable.index]["idHorraire"];
			var tabCell = tr.insertCell(-1);
			tabCell.setAttribute("class", "invisibleCell");
			tabCell.innerHTML = strId;
		}

		drawTable.createRow = (table) => {
			console.log(tableGrpClass[parseInt(drawTable.data[drawTable.index]["categorie"]) - 1]);
			var tr = table.insertRow(-1)
			tr.classList.add("tableRowStyle");
			tr.classList.add(tableGrpClass[parseInt(drawTable.data[drawTable.index]["categorie"]) - 1]);
			tr.classList.add("tableNum" + xx);
			tr.addEventListener("click", tableRowOnClick);
			return tr;
		}
		

		for (var xx = 0; drawTable.index < data.length; xx++) {
			leDate = data[drawTable.index]["jour"];
			var table = tableBase.cloneNode(true);
			var idString = "tableCours" + xx;
			table.setAttribute("id", idString);
			if (xx == 0)
				table.style.display = null;
			else
				table.style.display = "none";
			
			drawTable.buildRows(table);
	
			addElemToSelect(leDate);
			document.getElementById("tblCoursHolder").appendChild(table);
		}	
	}


	function tableRowOnClick(e) {
		var row = e.target;
	
		while (row.className.indexOf('tableRowStyle') == -1) {
			row = row.parentNode;
		}
	
		var tableNum = row.classList[2];
		var groupe = row.classList[1];
		var selected = groupe + "Selected";
	
		if(row.classList.contains(selected)) {
			row.classList.remove(selected);
			selectedCount[currentTable]--;
		}
		else {
			var elements = document.getElementsByClassName(groupe + " " + tableNum);
			for (var i = 0; i < elements.length; i++)
				if(elements[i].classList.contains(selected)) {
					elements[i].classList.remove(selected);
					selectedCount[currentTable]--;
					break;
				}
					
			row.classList.add(selected);
			selectedCount[currentTable]++;
		}
	
		if (selectedCount[currentTable] > 0 && selectedCount[currentTable] < minChoice) {
			document.getElementById("datesSelector").disabled = true;
			document.getElementById("submitBtn").disabled = true;
		}
		else {
			document.getElementById("datesSelector").disabled = false;
			document.getElementById("submitBtn").disabled = false;
		}
	}




	var query = ["SELECT cours.bloc, cours.intitule, cours.type, duree.debut, duree.fin, cours.finalite, duree.categorie, jours.jour, horraire.idHorraire \
	FROM cours, horraire, duree, jours \
	WHERE horraire.idCours = cours.id \
	AND horraire.idDuree = duree.id \
	AND horraire.idJour = jours.id \
	ORDER BY jours.jour, duree.debut;"];

	getData(query, [(data) => {
		if (data != false) 
			createTable(data);
		else
			alert("probleme de serveur");
	}]);
    
})();

















