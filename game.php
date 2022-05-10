<?php
include('server.php');
if (!array_key_exists('username', $_SESSION)) {
  header("Location: register.php");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./css/style.css" />
  <title>Chrome Dino</title>
</head>

<body>
  <header>
    <h1>Chrome Dinosaur Game</h1>
  </header>

  <!-- My own canvas -->
  <canvas id="myCanvas"></canvas>
  <section id="content">
    <h1>Footer</h1>
  </section>

  <!-- The framework module -->
  <script type="module" src="game/../lib/phaser.min.js"></script>

  <!-- The main JavaScript module -->
  <script type="module" src="game/../js/main.js"></script>
</body>

</html>