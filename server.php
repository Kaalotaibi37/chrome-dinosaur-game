<?php
session_start();

$username = "";
$email = "";
$errors = array();

// connect to db
$db = mysqli_connect('localhost', 'root', '', 'gameserver') or die("could not connect to database");

// if (isset($_GET['logout'])) {
//   session_destroy();
//   unset($_SESSION['username']);
//   header('Location: auth.php');
// }
