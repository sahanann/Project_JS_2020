
// function callMessagePage(code) {
    

//     var myWindow = window.open(`message.html?code=${code}`, `_self`);
//     // myWindow.document.getElementById("confBoxMsg") = code;
// }

function sendEmail(email) {
    console.log(email);
    var url = new URL(window.location.href);
    var dir = url.pathname.substring(0, url.pathname.lastIndexOf('/'));

	var choixUrl =  `${url.origin}${dir}/choixUser.html?email=${email}`;
    
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "jsproject2020@gmail.com",
        Password : "F09E7119C3957658F9F17089E69C0DEB859D",
        To : email,
        From : "jsproject2020@gmail.com",
        Subject : "This is the subject",
        Body : `<h1>Inscription avec succès!</h1><p>Vos choix : ${choixUrl}</p>`
    }).then(
      () => window.open(`message.html?code=1`, `_self`)
    );
}


var champsVerif = {

    email: (item) => {
        var emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var error = champsVerif.tooltip(item.id);
        var email = item.value;
        
        if (email === "" || email == null) {
            error.innerText = "*email is required";
            return false;
        }
        else if (!emailFormat.test(email)) {
            error.innerText = "*email is invalid";
            return false;
        }
        else {
            var query = [`SELECT * FROM user WHERE email = "${email}";`];
            // var callBack = function(data)
            server.getData(query, [(data) => {
                if (data == false)
                    error.innerText = "";
                else
                    error.innerText = "*adresse email existe déjà";
            }]);
    
            if (error.innerText === "")
                return true;
            else
                return false;
        }
    },


    nom: (item) => {
        var name = item.value;
        var error = champsVerif.tooltip(item.id);
    
        if (name === "" || name == null) {
            error.innerText = "*champs est requis";
            return false;
        }        
        else if (!/^[a-z '-]+$/i.test(name)) {
            error.innerText = "*champ est invalide";
            return false;
        }
        else {
            error.innerText = "";
        }
    },

    vide: (item) => {
        if (item.value === "" || item.value == null) {
            var error = champsVerif.tooltip(item.id);
            error.innerText = "*champs est requis";
            return false;
        }
        else {
            var error = champsVerif.tooltip(item.id);
            error.innerText = "";
        }
    },

    numbers: (item) => {
        var number = item.value;
        var error = champsVerif.tooltip(item.id);

        console.log(number);
    
        if (number === "" || number == null) {
            error.innerText = "*champs est requis";
            return false;
        }        
        else if (!/[^0-9]/.test(number)) {
            error.innerText = "*champ est invalide";
            return false;
        }
        else {
            error.innerText = "";
        }
        
    },

    tooltip: (val) => { return document.getElementById(val + "Err")}

};


var drawTable = {
    data: {},
    headers: [],
    
    table: "",
    checkItem: true,
    check: () => true,
    index: 0,
    createRow: (table) => table.insertRow(-1),
    buildCustomCell: () => {},

    
    buildRows: (table) => {
        for (; drawTable.index < drawTable.data.length; drawTable.index++) {
            if(!drawTable.check()) {
                break;
            }
            var tr = drawTable.createRow(table);
            drawTable.buildCells(drawTable.index, tr);
        }
    },

    buildCells: (index, tr) => {
        for (var i = 0; i < drawTable.headers.length; i++) {
            if (drawTable.headers[i] === "type") {
                if (drawTable.data[index]["type"] == 1) 
                    drawTable.addCell(tr, "Théorie");
                else if (drawTable.data[index]["type"] == 2)
                    drawTable.addCell(tr, "Labo");
                else
                    drawTable.addCell(tr, "TFE");
            }
            else if (drawTable.headers[i] === "finalite") {
                var str = drawTable.data[index]["finalite"];
                var final = ["I", "R", "G"];
                for (var x = 0; x < 3; x++)
                    if (str.charAt(x) === final[x])
                        drawTable.addCell(tr, " x ");
                    else 
                        drawTable.addCell(tr, "   ");
                
                drawTable.buildCustomCell(tr);
            }
            else
                drawTable.addCell(tr, drawTable.data[index][drawTable.headers[i]]);
        }
    },

    addCell: (tr, value) => {
        var tabCell = tr.insertCell(-1);
        tabCell.innerHTML = value;
    },

    createBtn: (id, value) => {
        var button = document.createElement("button");
        button.setAttribute("class", "sencondaryBtn");
        button.setAttribute("id", id);
        button.innerHTML = value;
        return button;
    },

    btnAttestation: (holder, id) => {
        var btn = drawTable.createBtn(id, "Attestation");
        btn.addEventListener("click", (element) => {
            var target = element.target;
            var id = target.id.substring(0, target.id.indexOf('-'));
            drawTable.createAttestation(id);
        });

        holder.appendChild(btn);
    },

    btnPlanning: (holder, id) => {
        var btn = drawTable.createBtn(id, "Planning");
        btn.addEventListener("click", (element) => {
            var target = element.target;
            var id = target.id.substring(0, target.id.indexOf('-'));
            drawTable.createPlanning(id);
        });

        holder.appendChild(btn);
    },

    createPlanning: (id) => {
        var tableid = `${id}-listCoursTable`;
        var table = document.getElementById(tableid).cloneNode(true);

        var tableHoder = document.getElementById("planTableHolder");

        tableHoder.innerHTML = "";
        tableHoder.appendChild(table);

        var query = [ `SELECT nom, prenom FROM user WHERE user.id = ${id}`];

        server.getData(query, [(data) => {
            var name = `${data[0]["nom"]} ${data[0]["prenom"]}`;

            document.getElementById("planUserName").innerHTML = name.toUpperCase();

            drawTable.exportHTML(name, "planning-source-html");
        }]);
    },

    createAttestation: (id) => {
        var query = [
            `SELECT DISTINCT user.nom, user.prenom, jours.jour
             FROM choix LEFT JOIN user
                ON(choix.idUser = user.id) LEFT JOIN horraire
                ON(choix.idHorraire = horraire.idHorraire) LEFT JOIN jours
                ON(horraire.idJour = jours.id)
             WHERE user.id = ${id}`];
        
        server.getData(query, [(data) => {
            var fullName = `${data[0]["nom"]} ${data[0]["prenom"]}`.toUpperCase()
            document.getElementById("attUserName").innerHTML = fullName;
            
            var datesHolder = document.getElementById("attJoursPres");
            datesHolder.innerHTML = "";

            for (var i = 0; i < data.length; i++) {
                var h3 = document.createElement("h3");
                h3.innerHTML = data[i]["jour"];
                datesHolder.appendChild(h3);
            }

            drawTable.exportHTML(fullName, "source-html");
        }]);
    },

    exportHTML: (name, source) => {
        var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
             "xmlns:w='urn:schemas-microsoft-com:office:word' "+
             "xmlns='http://www.w3.org/TR/REC-html40'>"+
             "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title> \
             <style> body {background-color: powderblue; font-family: sans-serif;}</style> </head><body>";
        var footer = "</body></html>";
        var sourceHTML = header+document.getElementById(source).innerHTML+footer;
        
        var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        var fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${name}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    }
    
}

var userObj = {
    emialInput: "",
    nomInput: "",
    prenomInput: "",
    etablInput: "",
    cbFinalite: ""
}

function insertUser(userData, choixData, callBack) {
    
    lastIdNumbers.userId++;
    var idUser = lastIdNumbers.userId;

    var queryInsertUser = `INSERT INTO user(id, nom, prenom, email, etablissement, finalite) \
        VALUES ("${idUser}", "${userData["nomInput"]}", "${userData["prenomInput"]}", \
        "${userData["emialInput"]}", "${userData["etablInput"]}", "${userData["cbFinalite"]}");`;
    
    console.log(`id uder = ${idUser}`);
    console.log(`query user = ${queryInsertUser}`);

    var queryValues = ``;
    for (var i = 0; i < choixData.length; i++) {
        queryValues += `(${idUser}, ${choixData[i]["idHorraire"]})`;
        if (i != choixData.length - 1)
            queryValues += `, `;
    }
    var queryInsertChoix = `INSERT INTO choix(idUser, idHorraire) VALUES ${queryValues}`;


    var queryList = [queryInsertUser, queryInsertChoix];
    for (var i = 0; i < choixData.length; i++) {
        var updateQuery = `UPDATE horraire SET nbrPlaceOccuper += 1 WHERE horraire.idHorraire = ${choixData[i]["idHorraire"]}`;
        queryList.push(updateQuery);
    }

    
    server.setData(queryList, callBack);   
}

var lastIdNumbers = {
    coursId: 0,
    profId: 0,
    userId: 0,
}



var param = {
    minChoix: "",
    jour: ""
}