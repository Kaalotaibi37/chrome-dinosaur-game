<?php
include('server.php');

if (!isset($_SESSION['username'])) {
    header("Location: index.php");
}

session_destroy();
header("Location: index.php");
