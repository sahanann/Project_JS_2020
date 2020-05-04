<?php 

    $con = @mysqli_connect('localhost','root','sahanan231','jourimmers');

    if (!$con) {
        echo "ERRSQL";
        die();
    }
    // echo "Initial character set is: " . mysqli_character_set_name($con);
    mysqli_set_charset($con, 'utf8');
    
?>