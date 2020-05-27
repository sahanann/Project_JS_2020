(() => {

    var msgBoxTimer;

    function callActionMsgBox(id, msg) {
        var box = document.getElementById(id);
        box.innerHTML = msg;
        // box.style.display = "block";
        box.style.opacity = "1";
        box.style.bottom = "-18px";
        clearTimeout(msgBoxTimer);
        msgBoxTimer = setTimeout(() => { 
            box.style.opacity = "0"; 
            box.style.bottom = "-60px";
        }, 3000);

    }

    var addOptions = (select, value, text) => {
        var option = document.createElement("option");
        option.value = value;
        option.text = text;
        select.add(option);
    }


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
        var checkBoxFinalite = document.querySelectorAll(".cbFinalite");
        checkBoxFinalite.forEach((element, index) => {
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
        // var nbPlaces = typeCours.options[typeCours.selectedIndex].value;
        // console.log(`nbrPlace = ${nbPlaces}`);

        if (check != false) {
            lastIdNumbers.coursId++;
            var nomCoursValue = nomCours.value;
            var query = [`INSERT INTO cours (id, bloc, intitule, type, finalite, idProf) 
                        VALUES (${lastIdNumbers.coursId}, '${bloc}', '${nomCours.value}', '${typeCours}', '${cdChoice}', '${prof}')`];
            server.setData(query, () => {
                var select = document.getElementById("nomCoursSelect");
                addOptions(select, lastIdNumbers.coursId, nomCoursValue);
                callActionMsgBox("1-actionMsgBox", "Cours a été ajouté");
            });

            local.value = ""
            nomCours.value = "";
            checkBoxFinalite.forEach((element) => {element.checked = false;});
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
            var nom = nomProf.value.toUpperCase();
            var prenom = prenomProf.value
            lastIdNumbers.profId++;
            var query = [`INSERT INTO professeur (id, nom, prenom) VALUES (${lastIdNumbers.profId}, '${nom}', '${prenom}')`];
            server.setData(query, () => {
                var select = document.getElementById("nomProfSelect");
                addOptions(select, lastIdNumbers.profId, `${nom} ${prenom}`);
                callActionMsgBox("2-actionMsgBox", "Le professeur a été ajouté");
            });

            nomProf.value = "";
            prenomProf.value = "";
        }
        
    });


    document.getElementById("ajoutHorBtn").addEventListener("click", () => {
        var check = true;

        var coursSelect = document.getElementById("nomCoursSelect");
        var idCours = coursSelect.options[coursSelect.selectedIndex].value;
        if (idCours == 0) {
            document.getElementById("nomCoursSelectErr").innerText = "*Choisissez un cours";
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

            server.setData(query, () => {callActionMsgBox("3-actionMsgBox", "Horaire a été ajouté");});
        }

    });


    document.getElementById("modifNbPlaceBtn").addEventListener("click", () => {
        var check;
        var ids = [];
        var values = [];

        var select = document.getElementById("typeCoursSelect");

        document.querySelectorAll(".numberInput").forEach((element, index) => {
            var val = select.options[index].value;
            check = champsVerif.vide(element);
            if (check != false && element.value != val) {
                ids.push(index + 1);
                values.push(element.value);
            }
        });


        if (!check && values.length != 0) {
            var queries = [];
            for(var i = 0; i < values.length; i++) 
                queries[i] = `UPDATE typecours SET nbrPlaces = ${values[i]} WHERE id = ${ids[i]}`;
            
            server.setData(queries, () => {
                callActionMsgBox("4-actionMsgBox", "Modification avec succès");
                for(var i = 0; i < values.length; i++) {
                    select.options[ids[i] - 1].value = values[i];
                }

            });
        }
        else if (values.length == 0)
            callActionMsgBox("4-actionMsgBox", "Rien a modifer");

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
        var choixJour = document.querySelectorAll(".cbJourImm");
        choixJour.forEach((element) => {
            if (element.checked) {
                var id = element.id.substring(0, element.id.indexOf('-'));
                idsJours.push(id);
            }
        });

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
                `SELECT horraire.idHorraire, jours.jour, duree.categorie, SUBSTRING(jours.jour, 6, 5) AS jour,
                    SUBSTRING(duree.debut, 1, 5) AS debut, SUBSTRING(duree.fin, 1, 5) AS fin, cours.bloc, 
                    cours.intitule, cours.type, cours.finalite
                 FROM horraire LEFT JOIN cours
                    ON (horraire.idCours = cours.id) LEFT JOIN jours 
                    ON (horraire.idJour = jours.id) LEFT JOIN duree
                    ON (horraire.idDuree = duree.id)
                 WHERE ${queryWhere}
                 ORDER BY jours.jour, duree.debut`];
                
            server.getData(query, [(data) => {
                // console.log(data);
                var curCategorie = -1;
                var breakPoint = 0;
                var choices = [];
                for (var i = 0; i < data.length; i++) {
                    if (curCategorie != data[i]["categorie"]) {
                        var obj = {};
                        var rando = Math.floor(Math.random() * (i - breakPoint)) + breakPoint;
                        // console.log(`i = ${i} : categorie = ${data[i]["categorie"]} : rando = ${rando}`);
                        obj["idHorraire"] = data[rando]["idHorraire"];
                        choices.push(data[rando]);
                        breakPoint = i;
                        curCategorie = data[i]["categorie"];
                    }
                }
                // console.log(choices);
                insertUser(userObj, choices, () => {
                    var tableHolder = document.getElementById("userTableHolder");
                    var tableBase = document.querySelector(".userChoiceTable");
                    drawTable.index = 0;
                    drawTable.check = () => true;
                    drawTable.headers = ["jour", "debut", "fin", "bloc", "intitule", "type", "finalite"];

                    drawTable.data = choices;

                    var table = tableBase.cloneNode(true);
                    table.style.display = null;
                    var username = `${userObj.nomInput} ${userObj.prenomInput}`;
                    var userId = lastIdNumbers.userId;

                    table.setAttribute("id", `${userId}-listCoursTable`);

                    drawTable.buildRows(table);

                    var nameElem = document.createElement("DIV");
                    nameElem.innerHTML = username;
                    nameElem.setAttribute("class", "userNameHolder");
                    tableHolder.appendChild(nameElem);
                    tableHolder.appendChild(table);

                    var buttonHolder = document.createElement("div");
                    buttonHolder.setAttribute("class", "scndBtnHolder");

                    drawTable.btnAttestation(buttonHolder, `${userId}-BtnAtt`);
                    drawTable.btnPlanning(buttonHolder, `${userId}-BtnPlan`);

                    tableHolder.appendChild(buttonHolder);

                    callActionMsgBox("5-actionMsgBox", "L'étudiant a été ajouté");
                });
            }]);

            email.value = "";
            nom.value = "";
            prenom.value = "";
            choixJour.forEach((element) => {element.checked = false;});
        }

    });

    document.getElementById("modiParamBtn").addEventListener("click", () => {
        var queries = [];

        var dateInput = document.getElementById("periodeInsInput");
        if (champsVerif.vide(dateInput) != false) {
            if (dateInput.value != param.jour) {
                queries.push(`UPDATE param SET periodeInscription = '${dateInput.value}' WHERE param.id = 0`);
            }
        }

        var minNbChoix = document.getElementById("nbMinChoixInput");
        if (champsVerif.vide(minNbChoix) != false) {
            if (minNbChoix.value != param.minChoix)
                queries.push(`UPDATE param SET nbChoixMin = '${minNbChoix.value}' WHERE param.id = 0`);
        }

        if (queries.length != 0) {
            server.setData(queries, () => {
                callActionMsgBox("6-actionMsgBox", "Modification avec succès");
                param.jour = dateInput.value;
                param.minChoix = minNbChoix.value;
            });
        }
        else
            callActionMsgBox("6-actionMsgBox", "Rien a modifer");

    })



})();