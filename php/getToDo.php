<?php 
    $responseData = file_get_contents("../data/todo.txt");
    json_encode($responseData);
    echo $responseData;
?>
