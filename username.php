<?php
include('server.php');

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
}

$reply = json_encode($_SESSION['username']);

header("Content-Type: application/json; charset=UTF-8");
echo $reply;
