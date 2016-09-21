<?php 
    $responseData = file_get_contents("../data/contacts.txt");
    json_encode($responseData);
    echo $responseData;
?>
