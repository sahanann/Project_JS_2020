<?php 

    include 'db.php';

    $query = !empty($_GET['Query']) ? $_GET['Query']: NULL;


    $result = mysqli_query($con, $query);

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