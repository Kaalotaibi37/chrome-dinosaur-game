<?php
session_start();

$username = "";
$email = "";
$errors = array();

// connect to db
$db = mysqli_connect('localhost', 'root', '', 'gameserver') or die("could not connect to database");
