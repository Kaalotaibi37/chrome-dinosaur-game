<?php include('server.php');?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>
      Home Page
    </title>
  </head>

  <body>
    <h1 align = center>Dino Game</h1>
    
    <?php if(isset($_SESSION['success'])): ?>
        <h2>
            <?php 
                echo $_SESSION['success'];
                unset($_SESSION['success']);
            ?>
        </h2>
    <?php endif ?>

    <?php if(isset($_SESSION["username"])): ?>
        <p>Welcome <?php echo $_SESSION['username']; ?></p>
        <p><a href="auth.php?logout='1'">logout</a></p>
    <?php endif ?>

  </body>

 </html>