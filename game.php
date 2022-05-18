<?php
include('server.php');

if (!isset($_SESSION['username'])) {
  header("Location: index.php");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./css/style.css" />
  <link rel="preload" as="font" href="./assets/fonts/Arcade classic/ARCADECLASSIC.TTF" type="font/ttf" crossorigin>
  <title>Chrome Dino</title>
</head>

<body>
  <!-- Force font to preload -->
  <div style="font-family:ARCADECLASSIC; position:absolute; left:-1000px; visibility:hidden;">.</div>

  <header>
    <img style="margin: 2rem; width: 20rem;" src="./assets/Title.png" alt="">
  </header>

  <!-- My own canvas -->
  <canvas id="myCanvas"></canvas>
  <section id="content">
    <img id="keyboard" src="./assets/keyboards.png" alt="keyboard" style="width: 30rem;">
    <a href="logout.php">
      <button id="logoutButton" style="margin-top: 2rem;">Log out</button>
    </a>
  </section>

  <!-- The framework module -->
  <script type="module" src="game/../lib/phaser.min.js"></script>

  <!-- The main JavaScript module -->
  <script type="module" src="game/../js/main.js"></script>
</body>

</html>