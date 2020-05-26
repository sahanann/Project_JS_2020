(function () {
    var url = new URL(window.location.href);

    var email = url.searchParams.get("email");
    if (email) {
        
        var queryEmail = 
        [`SELECT id, nom, prenom \
        FROM user \
        WHERE email = "${email}"`]

        
        server.getData(queryEmail, [(data) => {
            if (data != false) {
                document.getElementById("confBoxMsgTitle").innerHTML = `${data[0]["nom"].toUpperCase()} ${data[0]["prenom"]}`;

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
                
                server.getData(query, [(data) => {
                    drawTable.data = data;
                    drawTable.headers = ["jour", "debut", "fin", "bloc", "intitule", "type", "finalite"];
                    drawTable.buildRows(document.querySelector(".tabelCoursHorr"));
                }])
            }
        }])
    }
    
})();