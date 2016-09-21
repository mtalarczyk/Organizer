<?php 
    $data=file_get_contents("php://input");
    file_put_contents("../data/contacts.txt", $data);
    echo $data;
?>
