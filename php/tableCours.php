<?php 

    $con = @mysqli_connect('localhost','root','sahanan231','jourimmers');

    if (!$con) {
        echo "ERRSQL";
        die();
    }
    // echo "Initial character set is: " . mysqli_character_set_name($con);
    mysqli_set_charset($con, 'utf8');

    $querry =  "SELECT cours.bloc, cours.intitule, cours.type, duree.debut, duree.fin, cours.finalite, duree.categorie, jours.jour, horraire.idHorraire
                FROM cours, horraire, duree, jours
                WHERE horraire.idCours = cours.id
                AND horraire.idDuree = duree.id
                AND horraire.idJour = jours.id
                ORDER BY jours.jour, duree.debut;";
    $result = mysqli_query($con, $querry);

    if ($result == NULL)
        echo "ERRQUERY";
    else {
        if (mysqli_num_rows($result) > 0) {
            $myArray = array();
            while($row = mysqli_fetch_assoc($result)) {
                array_push($myArray, $row);
            }

            $myJSON = json_encode($myArray);
            echo $myJSON;
        }
        else 
            echo "NOTHING";
        
        mysqli_close($con);

    }

?>