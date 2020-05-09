(function () {
    var url = new URL(window.location.href);

    var email = url.searchParams.get("email");
    if (email) {
        
        var queryEmail = 
        [`SELECT id \
        FROM user \
        WHERE email = "${email}"`]

        
        getData(queryEmail, [(data) => {
            if (data != false) {
                var idUser = data[0]["id"];
                var query = 
                [`SELECT jours.jour, duree.debut, duree.fin, cours.bloc, cours.intitule, cours.type, cours.finalite
                  FROM choix LEFT JOIN horraire 
                       ON(choix.idHorraire = horraire.idHorraire) LEFT JOIN cours
                       ON(horraire.idCours = cours.id) LEFT JOIN jours
                       ON(horraire.idJour = jours.id) LEFT JOIN duree
                       ON(horraire.idDuree = duree.id)
                  WHERE choix.idUser = ${idUser}
                  ORDER BY jours.jour, duree.debut`];
                
                getData(query, [(data) => {
                    console.log(data);
                    var addCell = (tr, value) => {
                        var tabCell = tr.insertCell(-1);
                        tabCell.innerHTML = value;
                    }
                    var headers = ["jour", "debut", "fin", "bloc", "intitule", "type", "finalite"];

                    var table = document.querySelector(".tabelCoursHorr");
                    for (var i = 0; i < data.length; i++) {
                        tr = table.insertRow(-1);

                        for (var j = 0; j < headers.length; j++) {
                            if (headers[j] === "type") {
                                if (data[i]["type"] == 1) 
                                    addCell(tr, "Théorie");
                                else if (data[i]["type"] == 2)
                                    addCell(tr, "Labo");
                                else
                                    addCell(tr, "TFE");
                            }
                            else if (headers[j] === "finalite") {
                                var str = data[i]["finalite"];
                                var final = ["I", "R", "G"];
                                for (var x = 0; x < 3; x++)
                                    if (str.charAt(x) === final[x])
                                        addCell(tr, " x ");
                                    else 
                                        addCell(tr, "   ");
                            }
                            else {
                                addCell(tr, data[i][headers[j]]);
                            }
                        }
                    }
                }])
            }
        }])
    }
    
})();