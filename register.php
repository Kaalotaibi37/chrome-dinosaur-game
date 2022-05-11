<?php
include('server.php');

if (
    !isset($_POST['username'])
    or !isset($_POST['email'])
    or !isset($_POST['password'])
    or !isset($_POST['conf-password'])
    or !isset($_SESSION['username'])
) {
    header('Location: index.php');
}

$username = mysqli_real_escape_string($db, $_POST['username']);
$email = mysqli_real_escape_string($db, $_POST['email']);
$password_1 = mysqli_real_escape_string($db, $_POST['password']);
$password_2 = mysqli_real_escape_string($db, $_POST['conf-password']);

// validation
if (empty($username)) {
    array_push($errors, "Username is required");
}
if (empty($email)) {
    array_push($errors, "Email is required");
}
if (empty($password_1)) {
    array_push($errors, "Password is required");
}
if ($password_1 != $password_2) {
    array_push($errors, "Passwords does not match");
}

// if there are no errors, register the user to the database
if (count($errors) == 0) {
    $secure_password = password_hash($password_1, PASSWORD_DEFAULT); // encrypt the password before storing in db
    $sql = "INSERT INTO user (username, email, s_password) VALUES('$username', '$email', '$secure_password')";
    mysqli_query($db, $sql);

    $_SESSION['username'] = $username;
    $_SESSION['success'] = "You are logged in";
    header('Location: game.php'); //redirect to the home page (dino game)
}
