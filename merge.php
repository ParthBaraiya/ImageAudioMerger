<?php

session_start();

$audio_data = isset($_SESSION["audio_file"]) ? $_SESSION["audio_file"] : "";
$image_data = isset($_SESSION["image_file"]) ? $_SESSION["image_file"] : "";

$location = "./outputs/" . session_id();


if (!file_exists($location)) {
    mkdir($location);
}

if (isset($_SESSION["filecounter"])) {
    $_SESSION["filecounter"]++;
} else {
    $_SESSION["filecounter"] = 0;
}

$location .= "/" . session_id() . $_SESSION["filecounter"] . ".mp4";



$res = shell_exec("ffmpeg\\bin\\ffmpeg -loop 1 -i $image_data -i $audio_data -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest $location");
echo "$location";

//command
// ffmpeg -loop 1 -i $image_data -i $audio_data -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest out.mp4