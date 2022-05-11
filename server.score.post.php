<?php
include('server.php');

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
}

$username = $_SESSION['username'];
$result = mysqli_query($db, "SELECT score FROM user WHERE username = '$username' limit 1");
$input = json_decode(file_get_contents('php://input'), true);

$old_score = (int) mysqli_fetch_assoc($result)["score"];
$new_score = (int) $input["score"];

$response = array("new_score" => $new_score, "old_score" => $old_score, "updated" => false);
if ($new_score > $old_score) {
    $query = "UPDATE user SET score = $new_score WHERE username = '$username'";
    mysqli_query($db, $query);
    $response["updated"] = true;
}

header("Content-Type: application/json; charset=UTF-8");
echo json_encode($response);
