function getErrTooltip(s) {
    return document.getElementById(s + "Err");
}


(function () {
    document.getElementById("ajoutCoursBtn").addEventListener("click", () => {
        var check = true;
        var nomCours = document.getElementById("nomCoursInput");
        check = testChampVide(nomCours);

        var local = document.getElementById("LocalInput");
        check = testChampVide(local);

        var prof = document.getElementById("nomProfSelect");
        if (prof.selectedIndex == 0) {
            document.getElementById("nomProfInputErr").innerText = "*Choissisez une finalité";
            check = false;
        }
        else {
            prof = prof.selectedIndex;
            document.getElementById("nomProfInputErr").innerText = "";
        }
            
            

        var cdChoice = "";
        var finalites = ["I", "R", "G"];
        document.querySelectorAll(".cbFinalite").forEach((element, index) => {
            if (element.checked)
                cdChoice = cdChoice + finalites[index];
            else
                cdChoice = cdChoice + "-";

        });
        
        if (cdChoice === "---") {
            check = false;
            document.getElementById("cbFinaliteErr").innerText = "*Choissisez une finalité";
        }
        else
            document.getElementById("cbFinaliteErr").innerText = "";

        var typeCours = document.getElementById("typeCoursSelect").selectedIndex + 1;
        var bloc = document.getElementById("groupeSelect").selectedIndex + 1;
        var nbPlaces = typeCours == 1 ? 50 : 20;

        if (check != false) {
            var query = `INSERT INTO cours (id, bloc, intitule, type, finalite, idProf, nbrPlaces) 
                        VALUES (NULL, '${bloc}', '${nomCours.value}', '${typeCours}', '${cdChoice}', '${prof}', '${nbPlaces}')`;
            insertData(query);
        }

    })
})();



(function () {
    document.getElementById("ajoutProfBtn").addEventListener("click", () => {
        var check = true;

        var nomProf = document.getElementById("nomPfrofInput");
        check = nomVerification(nomProf);

        var prenomProf = document.getElementById("prenomProfInput");
        check = nomVerification(prenomProf);

        // console.log(check != false);
        if (check != false) {
            var query = `INSERT INTO professeur (id, nom, prenom) VALUES (NULL, '${nomProf.value.toUpperCase()}', '${prenomProf.value}')`;
            insertData(query);
        }
        
    });
})();

(function () {

    document.getElementById("ajoutHorBtn").addEventListener("click", () => {
        var check = true;

        var coursSelect = document.getElementById("nomCoursSelect");
        var idCours = coursSelect.options[coursSelect.selectedIndex].value;
        if (idCours == 0) {
            document.getElementById("nomCoursSelectErr").innerText = "*Choissisez un cour";
            check = false;
        }
        else 
            document.getElementById("nomProfInputErr").innerText = "";

        var jourSelect = document.getElementById("jourSelect");
        var idJour = jourSelect.options[jourSelect.selectedIndex].value;

        var dureeSelect = document.getElementById("heureDebutSelect");
        var idDuree = dureeSelect.options[dureeSelect.selectedIndex].value;

        if (check != false) {
            var query = `INSERT INTO horraire (idHorraire, idCours, idDuree, idJour) 
                            VALUES (NULL, '${idCours}', '${idDuree}', '${idJour}')`;
            insertData(query);
        }

    });
})();

function getSelectedOption(select) {

}



function insertData(query) {
    var url = "php/insertData.php?Query="+query;

    xhr = getXMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function() {
        var response = xhr.responseText;
        if (response == "OK") {
            alert("c bon");
        }
        if (response == "NOPE") {
            alert("pas bon");
        }
    }

    xhr.send();
}


function testChampVide(elem) {
    if (elem.value === "" || elem.value == null) {
        var error = getErrTooltip(elem.id);
        error.innerText = "*champs est requis";
        return false;
    }
    else {
        var error = getErrTooltip(elem.id);
        error.innerText = "";
    }
}

function nomVerification(item) {
    var name = item.value;
    var error = getErrTooltip(item.id);

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
}