import { Player, BirdManager, GroundManager, MeteorManager } from "./game.js";
import { Healthbar, Leaderboard } from "./ui.js";

/**
 * The game's pause screen.
 * This scene pops after clicking a pause button.
 */
class Pause extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "Pause" });
  }

  preload() {
    this.load.image("pause", "assets/pause.png");
  }
  create(sound) {
    this.add.sprite(400, 300, "pause");
    const currentScene = this.scene;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        sound.resumeAll();
        currentScene.resume("Game");
        currentScene.stop();
      }
    });
  }
}

/**
 * The gameover's screen.
 * This scene launches once the player is defeated.
 */
class Gameover extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "Gameover" });
  }

  preload() {
    this.load.image("leaderboard", "assets/leaderboard.png");
  }

  create(data) {
    this.leaderboard = new Leaderboard(this);
    this.player = this.physics.add.sprite(52, 58, "player");

    this.lostLifeAudio = this.sound.add("lostLife");
    this.lostLifeAudio.play();

    this.player.x = data[0];
    this.player.y = data[1];
    this.player.setScale(2);
    this.player.play("death");
    this.playDeathAnimation = false;
    this.showLeaderboard = false;
    this.time.addEvent({
      delay: 700,
      loop: false,
      callback: () => (this.playDeathAnimation = true),
    });

    this.leaderboard.create(data[2], Phaser);

    const currentScene = this;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        if (currentScene.showLeaderboard) {
          currentScene.scene.start("Game");
          currentScene.scene.stop();
        }
      }
    });
  }

  update() {
    if (this.playDeathAnimation) {
      this.player.setGravityY(850);
      this.player.setVelocityY(-500);
      this.playDeathAnimation = false;
    }

    if (this.player.y >= 800) {
      this.player.y = 800;
      this.showLeaderboard = true;
    }

    this.leaderboard.update(this.showLeaderboard);
  }
}

/**
 * The game's main scene.
 * Here is where the main game loop and logic.
 */
class Game extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "Game" });
  }

  preload() {
    this.load.image("ground", "assets/background.png");
    this.load.image("sky", "assets/background_sky.png");
    this.load.image("cloud", "assets/background_cloud.png");
    this.load.image("cloud_2", "assets/background_cloud2.png");
    this.load.image("mountain", "assets/background_mountain.png");
    this.load.audio("lostLife", "assets/audio/lost_life.wav");
    this.load.audio("overworld", "assets/audio/overworld.mp3");
    this.load.audio("overworld_2", "assets/audio/overworld_2.mp3");
    this.load.audio("hit", "assets/audio/hit.wav");
    this.load.audio("jump", "assets/audio/jump.wav");
    this.load.audio("pause", "assets/audio/pause.wav");
    this.load.audio("meteor", "assets/audio/meteor.wav");
    this.load.audio("explosion", "assets/audio/explosion.wav");
    this.load.spritesheet("loading", "assets/loading_spinner.png", {
      frameWidth: 200,
      frameHeight: 200,
    });
    this.load.spritesheet("spacebar", "assets/SPACEALTERNATIVE.png", {
      frameWidth: 98,
      frameHeight: 21,
    });
    this.load.spritesheet("arrow_up", "assets/ARROWUP.png", {
      frameWidth: 19,
      frameHeight: 21,
    });
    this.load.spritesheet("arrow_down", "assets/ARROWDOWN.png", {
      frameWidth: 19,
      frameHeight: 21,
    });
    this.load.spritesheet(
      "metero_explosion",
      "assets/meteor_explosion_sheet.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    this.load.spritesheet("meteor", "assets/meteor_sheet.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.image(
      "mountain_foreground",
      "assets/background_mountain_foreground.png"
    );
    this.load.image("healthbarBorder", "assets/healthbar_border.png");
    this.load.image("healthbar", "assets/healthbar.png");
    this.load.spritesheet("bird", "assets/Bird.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.spritesheet("player", "assets/player_spritesheet.png", {
      frameWidth: 52,
      frameHeight: 58,
    });
  }

  create() {
    this.pauseSound = this.sound.add("pause");
    this.explosionSound = this.sound.add("explosion");
    this.backgroundSound_1 = this.sound.add("overworld");
    this.backgroundSound_2 = this.sound.add("overworld_2");
    this.backgroundSky = this.add.tileSprite(400, 300, 800, 600, "sky");
    this.backgroundCloud = this.add.tileSprite(400, 300, 800, 600, "cloud");
    this.backgroundForeground = this.add.tileSprite(
      400,
      300,
      800,
      600,
      "cloud_2"
    );
    this.backgroundMountain = this.add.tileSprite(
      400,
      300,
      800,
      600,
      "mountain"
    );
    this.backgroundMountainForeground = this.add.tileSprite(
      400,
      300,
      800,
      600,
      "mountain_foreground"
    );
    this.backgroundTile = this.add.tileSprite(400, 600, 800, 192, "ground");
    this.physics.add.existing(this.backgroundTile, true);
    this.currentScore = 0;
    this.scoreText = this.add.text(690, 30, "Score: 0");
    this.birds = new BirdManager(this);
    this.player = new Player(this);
    this.healthbar = new Healthbar(this);
    this.meteors = new MeteorManager(this);
    this.globalSpeed = 0;
    this.globalTileSpeed = 1;

    this.player.create();
    this.birds.create();
    this.healthbar.create();
    this.meteors.create();

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => (this.scoreText.text = `Score: ${++this.currentScore}`),
    });

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.meteors.addMeteor(),
    });

    this.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => this.birds.addBird(),
    });

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => (this.globalSpeed += 0.05),
    });

    this.physics.world.addOverlap(
      this.player.object,
      this.birds.group,
      (player, _) => {
        if (!player.invisibility) {
          player.invisibility = true;
          player.hit();
          this.healthbar.draw(player.health);
          console.group("Collision Player and bird");
          console.log("Collision detected!");
          console.log("Player health: " + player.health);
          console.groupEnd("Collision Player and bird");
        }
      }
    );

    this.physics.world.addOverlap(
      this.player.object,
      this.meteors.group,
      (player, _) => {
        if (!player.invisibility) {
          player.invisibility = true;
          player.hit();
          this.healthbar.draw(player.health);
          console.group("Collision Player and meteor");
          console.log("Collision detected!");
          console.log("Player health: " + player.health);
          console.groupEnd("Collision Player and meteor");
        }
      }
    );

    const currentScene = this;
    const playPauseSound = this.pauseSound;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        currentScene.sound.pauseAll();
        playPauseSound.play();
        currentScene.scene.launch("Pause", currentScene.sound);
        currentScene.scene.pause();
      }
    });

    this.physics.add.collider(this.player.object, this.backgroundTile);
    this.physics.add.collider(
      this.meteors.group,
      this.backgroundTile,
      (_, meteor) => {
        this.explosionSound.play({
          volume: 0.2,
          rate: 2,
        });
        meteor.destroy();
        this.add
          .sprite(meteor.x, meteor.y, "metero_explosion")
          .play("explosion");
      }
    );

    this.time.addEvent({
      delay: 79200,
      loop: false,
      callback: () => this.backgroundSound_2.play({ volume: 0.5 }),
    });
    this.backgroundSound_1.play({
      volume: 0.5,
    });
  }

  update() {
    this.backgroundSky.tilePositionX += 0.005 + this.globalTileSpeed * 0.05;
    this.backgroundCloud.tilePositionX += 0.01 + this.globalTileSpeed * 0.05;
    this.backgroundForeground.tilePositionX +=
      0.02 + this.globalTileSpeed * 0.05;
    this.backgroundMountain.tilePositionX +=
      0.035 + this.globalTileSpeed * 0.05;
    this.backgroundMountainForeground.tilePositionX +=
      0.05 + this.globalTileSpeed * 0.05;
    this.backgroundTile.tilePositionX += this.globalTileSpeed;
    this.player.update();
    this.birds.update();
    this.meteors.update();
    if (this.globalTileSpeed <= 10) {
      this.globalTileSpeed += this.globalSpeed * 0.00005;
    }
  }
}

/* This is the config for the game's scene */
let config = {
  type: Phaser.AUTO, // Tell phaser to choose either Canvas or WebGL for rendering
  width: 800,
  height: 600,
  transparent: true,
  pixelArt: true, // Disables anti aliasing for sharper pixels.
  canvas: document.getElementById("myCanvas"), // Let the framework to choose my own Canvas
  physics: {
    // The game's physics configuration
    default: "arcade",
    arcade: {
      debug: false,
      isPaused: false,
    },
  },
  scene: [Game, Gameover, Pause],
};

let game = new Phaser.Game(config); // Launch the game.
