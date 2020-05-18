(() => {
    document.getElementById("ajoutCoursBtn").addEventListener("click", () => {
        var check = true;
        var nomCours = document.getElementById("nomCoursInput");
        check = champsVerif.vide(nomCours);

        var local = document.getElementById("LocalInput");
        check = champsVerif.vide(local);

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

        var typeCours = document.getElementById("typeCoursSelect");
        var bloc = document.getElementById("groupeSelect").selectedIndex + 1;
        var nbPlaces = typeCours.options[typeCours.selectedIndex].value;

        if (check != false) {
            var query = [`INSERT INTO cours (id, bloc, intitule, type, finalite, idProf, nbrPlaces) 
                        VALUES (NULL, '${bloc}', '${nomCours.value}', '${typeCours}', '${cdChoice}', '${prof}', '${nbPlaces}')`];
            setData(query, false);
            // insertData(query);
        }

    });


    document.getElementById("ajoutProfBtn").addEventListener("click", () => {
        var check = true;

        var nomProf = document.getElementById("nomPfrofInput");
        check = champsVerif.nom(nomProf);

        var prenomProf = document.getElementById("prenomProfInput");
        check = champsVerif.nom(prenomProf);

        // console.log(check != false);
        if (check != false) {
            var query = [`INSERT INTO professeur (id, nom, prenom) VALUES (NULL, '${nomProf.value.toUpperCase()}', '${prenomProf.value}')`];
            setData(query, false);
            // insertData(query);
        }
        
    });


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
            var query = [`INSERT INTO horraire (idHorraire, idCours, idDuree, idJour) 
                            VALUES (NULL, '${idCours}', '${idDuree}', '${idJour}')`];
            setData(query, false);
            // insertData(query);
        }

    });


    document.getElementById("modifNbPlaceBtn").addEventListener("click", () => {
        var check;
        var ids = [];
        var values = [];

        var select = document.getElementById("typeCoursSelect");

        document.querySelectorAll(".numberInput").forEach((element, index) => {
            var val = select.options[select.selectedIndex].value;
            check = champsVerif.numbers(element);
            if (check != false && element.value != val) {
                ids.push(index);
                values.push(element.value);
            }
        });

        if (!check && values.length != 0) {
            var queries = [];
            for(var i = 0; i < values.length; i++) 
                queries[i] = `UPDATE typecours SET nbrPlaces = ${values[i]} WHERE id = ${ids[i]}`;
            
            setData(queries, false);
        }

    });

    document.getElementById("ajoutUsersBtn").addEventListener("click", () => {
        check = true;

        var email = document.getElementById("emailEtudInput");
        check = champsVerif.email(email);

        var nom = document.getElementById("nomEtudInput");
        check = champsVerif.nom(nom);

        var prenom = document.getElementById("prenomEtudInput");
        check = champsVerif.nom(prenom);

        var idsJours = [];
        document.querySelectorAll(".cbJourImm").forEach((element, index) => {
            if (element.checked) {
                var id = element.id.substring(0, element.id.indexOf('-'));
                idsJours.push(id);
            }
        })
        if (idsJours.length == 0) {
            check = false;
            document.getElementById("cbJourImmErr").innerText = "*Choissisez au moin une date";
        }
        else
            document.getElementById("cbJourImmErr").innerText = "";

        if (check != false) {
            userObj.emialInput = email.value;
            userObj.nomInput = nom.value;
            userObj.prenomInput = prenom.value;
            
            var queryWhere = ``;
            for (var i = 0; i < idsJours.length; i++) {
                queryWhere += ` horraire.idJour = ${idsJours[i]}`;
                if (i != idsJours.length - 1)
                    queryWhere += ` OR`;
            }
                
            var query = [
                `SELECT horraire.idHorraire, jours.jour, duree.categorie
                 FROM horraire LEFT JOIN jours 
                    ON (horraire.idJour = jours.id) LEFT JOIN duree
                    ON (horraire.idDuree = duree.id)
                 WHERE ${queryWhere}
                 ORDER BY jours.jour, duree.debut`];
                
            getData(query, [(data) => {
                console.log(data);
                var curCategorie = data[0]["categorie"];
                var breakPoint = 0;
                var choices = [];
                for (var i = 0; i < data.length; i++) {
                    if (curCategorie != data[i]["categorie"]) {
                        var obj = {};
                        var rando = Math.floor(Math.random() * (i - breakPoint)) + breakPoint;
                        console.log(`i = ${i} : categorie = ${data[i]["categorie"]} : rando = ${rando}`);
                        obj["idHorraire"] = data[rando]["idHorraire"];
                        choices.push(obj);
                        breakPoint = i;
                        curCategorie = data[i]["categorie"];
                    }
                }
                console.log(choices);
                insertUser(userObj, choices, false);
            }]);
        }

    });



})();