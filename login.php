<?php
include('server.php');

if (!array_key_exists('username_login', $_POST) or !array_key_exists('password_login', $_POST)) {
    header('Location: index.php');
}

$username = mysqli_real_escape_string($db, $_POST['username_login']);
$password = mysqli_real_escape_string($db, $_POST['password_login']);

if (empty($username)) {
    array_push($errors, "Username is required");
}
if (empty($password)) {
    array_push($errors, "Password is required");
}

if (count($errors) == 0) {
    $result = mysqli_query($db, "SELECT s_password FROM user WHERE username='$username' limit 1");
    $hashed_password = mysqli_fetch_array($result)["s_password"];
    if (!password_verify($password, $hashed_password)) {
        header("Location: index.php");
        die();
    }
    $_SESSION['username'] = $username;
    $_SESSION['success'] = "You are logged in";
    header('Location: game.php'); //redirect to the home page (dino game)
}
