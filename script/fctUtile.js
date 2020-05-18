
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
      message => window.open(`message.html?code=1`, `_self`)
    );
}


var champsVerif = {

    email: (item) => {
        var emailFormat = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var error = champsVerif.tooltip(item.id);
        var email = item.value;
        
        if (email === "" || email == null) {
            error.innerText = "*email is required";
            return true;
        }
        else if (!emailFormat.test(email)) {
            error.innerText = "*email is invalid";
            return true;
        }
        else {
            var query = [`SELECT * FROM user WHERE email = "${email}";`];
            // var callBack = function(data)
            getData(query, [(data) => {
                if (data == false)
                    error.innerText = "";
                else
                    error.innerText = "*adresse email existe déjà";
            }]);
    
            if (error.innerText === "")
                return false;
            else
                return true;
        }
    },


    nom: (item) => {
        var name = item.value;
        var error = champsVerif.tooltip(item.id);
    
        if (name === "" || name == null) {
            error.innerText = "*champs est requis";
            return false;
        }        
        else if (!/^[a-z]+$/i.test(name)) {
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
                // drawTable.index++;
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
    }
    
}

var userObj = {
    emialInput: "",
    nomInput: "",
    prenomInput: "",
    etablInput: "",
    cbFinalite: ""
}

function insertUser(userData, choixData, msg) {
    
    querySelect = ["SELECT id FROM user ORDER BY id"];
    var idUser;
    getData(querySelect, [(data) => {
        
        if (data == false)
            idUser = 1;
        else
            idUser = parseInt(data[data.length - 1]["id"]) + 1;
            
        
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

        
        setData(queryList, msg);

    }]);
   
}