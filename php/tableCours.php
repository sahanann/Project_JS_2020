<?php 

    $con = @mysqli_connect('localhost','root','sahanan231','jourimmers');

    if (!$con) {
        echo "ERRSQL";
        die();
    }
    echo "Initial character set is: " . mysqli_character_set_name($con);
    mysqli_set_charset($con, 'utf8');
    echo "Initial character set is: " . mysqli_character_set_name($con);

    $querry = "Select * From cours";
    $result = mysqli_query($con, $querry);

    if ($result == NULL)
        echo "ERRQUERY";
    else {
        $myArray = array();
        
        while($row = mysqli_fetch_assoc($result)) {
            // mysqli_set_charset($row, 'utf8');
            // echo $row[2];
            // echo implode(" ",$row);
            // echo  utf8_decode (implode(" ",$row));
            array_push($myArray, $row);
        }

        // echo implode(" ",$myArray);
        // $myJSON = json_encode($myArray);
        $myJSON = json_encode($myArray);
    
        echo $myJSON;
        // echo "prprpr";
    }

?>