<?php
include('server.php');

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
}

$username = $_SESSION['username'];
$result = mysqli_query($db, "SELECT username, score FROM user WHERE username != '$username'");

$response = array();
while ($row = mysqli_fetch_array($result)) {
    $response[$row["username"]] = $row["score"];
}


header("Content-Type: application/json; charset=UTF-8");
echo json_encode($response);
