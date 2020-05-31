<?php
session_start();


// Get File Name
$filename = $_FILES['file']['name'];

if (!isset($_SESSION)) {
    echo "2";
    die();
}


// Get Location Where File will be saved on server
$location = "./uploads/" . session_id() . "/" . $_POST["type"];

if (!file_exists($location)) {
    if (!file_exists("./uploads/" . session_id()))
        mkdir("./uploads/" . session_id());
    mkdir($location);
}

$location .= "/" . $filename;

if ($isValid = move_uploaded_file($_FILES['file']['tmp_name'], $location)) {
    echo $location;
    $_SESSION[$_POST["type"] . "_file"] = $location;
} else {
    echo "0";
}
