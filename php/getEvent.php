<?php 
    $responseData = file_get_contents("../data/events.txt");
    json_encode($responseData);
    echo $responseData;
?>
