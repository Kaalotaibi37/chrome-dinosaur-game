<?php
  session_start();

  $username = "";
  $email = "";
  $errors = array();

  // connect to db
  $db = mysqli_connect('localhost','root','','gameserver') or die("could not connect to database");

  if(isset($_POST['Register'])){

    $username = mysqli_real_escape_string($db, $_POST['username']);
    $email = mysqli_real_escape_string($db, $_POST['email']);
    $password_1 = mysqli_real_escape_string($db, $_POST['password']);
    $password_2 = mysqli_real_escape_string($db, $_POST['conf-password']);

    // validation
    if(empty($username)){
      array_push($errors, "Username is required");
    }
    if(empty($email)){
      array_push($errors, "Email is required");
    }
    if(empty($password_1)){
      array_push($errors, "Password is required");
    }
    if($password_1 != $password_2){
      array_push($errors, "Passwords does not match");
    }

    // if there are no errors, insert the user to the database
    if(count($errors) == 0){

      $secure_password = md5($password_1); // encrypt the password before storing in db
      $sql = "INSERT INTO user (username, email, s_password) VALUES('$username', '$email', '$secure_password')";
      mysqli_query($db, $sql);

      $_SESSION['username'] = $username;
      $_SESSION['success'] = "You are logged in";
      header('location : index.php'); //redirect to the home page (dino game)
    }
  }

 ?>