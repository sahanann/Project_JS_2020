<?php 

    include 'db.php';

    $query = !empty($_GET['Query']) ? $_GET['Query']: NULL;

    if (mysqli_query($con, $query))
        echo "OK";
    else
        echo "NOPE";

    mysqli_close($con);

?>