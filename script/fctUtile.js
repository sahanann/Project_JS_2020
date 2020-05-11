
function callMessagePage(code) {
    

    var myWindow = window.open(`message.html?code=${code}`, `_self`);
    // myWindow.document.getElementById("confBoxMsg") = code;
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
                var error = document.getElementById("emialInputErr");
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