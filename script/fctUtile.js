(function () {
    // callMessagePage(1);
    // var url = new URL(window.location.href);

    // console.log(url);
})();


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


// var drawTable = {
//     headers: [],
    
//     table,
//     group,

//     buildRow:
    
// }

// drawTable.headers = "hello";
// drawTable.run();