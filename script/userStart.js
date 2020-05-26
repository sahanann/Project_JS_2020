(() => {

	var selectedCount = [];
	var currentTable = 0;

	document.getElementById("prevTableBtn").addEventListener("click", (e) => {
		document.getElementById("datesSelector").selectedIndex = currentTable - 1;
		if (selectedCount[currentTable] >= param.minChoix || selectedCount[currentTable] == 0)
			changeTable(currentTable - 1);
	});

	document.getElementById("nextTableBtn").addEventListener("click", (e) => {
		document.getElementById("datesSelector").selectedIndex = currentTable + 1;
		if (selectedCount[currentTable] >= param.minChoix || selectedCount[currentTable] == 0)
			changeTable(currentTable + 1);
	})

	function changeTable(index) {
		var curTableId = "tableCours" + currentTable;
		var seltableId = "tableCours" + index;

		document.getElementById(seltableId).style.display = null;
		document.getElementById(curTableId).style.display = "none";

		var prevBtn = document.getElementById("prevTableBtn");
		var nextBtn = document.getElementById("nextTableBtn");

		if (index == 0) {
			prevBtn.disabled = true;
			nextBtn.disabled = false;
		}
		else if (index == document.getElementById("datesSelector").length - 1) {
			prevBtn.disabled = false;
			nextBtn.disabled = true;
		}
		else {
			prevBtn.disabled = false;
			nextBtn.disabled = false;
		}

		currentTable = index;
	}

	function addElemToSelect(value) {
		var x = document.getElementById("datesSelector");
		var option = document.createElement("option");
		option.text = value;
		x.add(option);
		selectedCount.push(0);
	}

	document.getElementById("datesSelector").addEventListener("change", (e) => 
		changeTable(e.target.selectedIndex));


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
	
		while (row.className.indexOf('tableRowStyle') == -1) 
			row = row.parentNode;
	
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


		var submitBtn = document.getElementById("submitBtn");
		var datesSelector = document.getElementById("datesSelector");
	
		if (selectedCount[currentTable] > 0 && selectedCount[currentTable] < param.minChoix) {
			datesSelector.disabled = true;
			submitBtn.disabled = true;
		}
		else {
			datesSelector.disabled = false;
			if (selectedCount[currentTable] == 0) {
				for (var i = 0; i < selectedCount.length; i++) 
					if (selectedCount[i] > 0) {
						submitBtn.disabled = false;
						msgBox.style.backgroundColor = 'green';
						break;
					}
					else {
						submitBtn.disabled = true;
					}
						
			}
			else
				submitBtn.disabled = false;
				
		}
	}

	var callbacks = [];

	callbacks[0] = (data) => {
		var today = new Date();
		var datePeriode = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		today = yyyy + '-' + mm + '-' + dd;
		datePeriode = data[0]["periodeInscription"]

		// console.log(`today = ${today} | periode = ${datePeriode}`);

		if (today > datePeriode) {
			window.open(`message.html?code=2`, `_self`);
		}
		else {
			param.minChoix = data[0]["nbChoixMin"];
			document.getElementById("idChoixMin").innerHTML = param.minChoix;
		}
	}

	callbacks[1] = (data) => createTable(data);

	callbacks[2] = (data) => lastIdNumbers.userId = data[0]["id"];

	



	var query = ["SELECT * FROM param",
		"SELECT cours.bloc, cours.intitule, cours.type, SUBSTRING(duree.debut, 1, 5) AS debut, \
		SUBSTRING(duree.fin, 1, 5) AS fin, cours.finalite, duree.categorie, jours.jour, horraire.idHorraire \
	FROM cours, horraire, duree, jours \
	WHERE horraire.idCours = cours.id \
	AND horraire.idDuree = duree.id \
	AND horraire.idJour = jours.id \
	ORDER BY jours.jour, duree.debut;",
	"SELECT * FROM user ORDER BY id DESC LIMIT 1"];




	server.getData(query, callbacks);
    
})();

















