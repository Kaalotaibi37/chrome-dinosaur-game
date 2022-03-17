import { Player, BirdManager, GroundManager } from "./game.js";

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
  create() {
    this.add.sprite(400, 300, "pause");
    const currentScene = this.scene;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
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
    this.load.image("gameover", "assets/gameover.png");
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  create(data) {
    console.log("Passed data: ", data);
    this.add.sprite(400, 300, "gameover");
    this.player = this.physics.add.sprite(52, 58, "player");
    this.player.x = data[0];
    this.player.y = data[1];
    this.player.setScale(2);
    this.player.play("death");
    this.playDeathAnimation = false;
    this.time.addEvent({
      delay: 1000,
      loop: false,
      callback: () => (this.playDeathAnimation = true),
    });
  }

  update() {
    if (this.playDeathAnimation) {
      this.player.setGravityY(850);
      this.player.setVelocityY(-400);
      this.playDeathAnimation = false;
    }
    if (this.cursor.left.isDown) {
      this.scene.stop();
      this.scene.start("Game");
    }
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
    this.backgroundTile = this.add.tileSprite(400, 600, 800, 192, "ground");
    this.physics.add.existing(this.backgroundTile, true);
    console.log(this.backgroundTile);
    this.birds = new BirdManager(this);
    this.birds.create();
    this.player = new Player(this);
    this.player.create();
    this.globalSpeed = 0;

    this.time.addEvent({
      delay: 1000,
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
          console.group("Collision Player and bird");
          console.log("Collision detected!");
          console.log("Player health: " + player.health);
          console.groupEnd("Collision Player and bird");
        }
      }
    );
    const currentScene = this.scene;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        currentScene.launch("Pause");
        currentScene.pause();
      }
    });

    this.physics.add.collider(this.player.object, this.backgroundTile);
  }

  update() {
    if (this.player.object.health <= 0) {
    }

    this.player.update();
    this.birds.update();
    let tileSpeed = 1 + this.globalSpeed;
    if (tileSpeed <= 20) {
      this.backgroundTile.tilePositionX += tileSpeed;
    }
  }
}

/* This is the config for the game's scene */
let config = {
  type: Phaser.AUTO, // Tell phaser to choose either Canvas or WebGL for rendering
  width: 800,
  height: 600,
  pixelArt: true, // Disables anti aliasing for sharper pixels.
  canvas: document.getElementById("myCanvas"), // Let the framework to choose my own Canvas
  physics: {
    // The game's physics configuration
    default: "arcade",
    arcade: {
      debug: true,
      isPaused: false,
    },
  },
  scene: [Game, Gameover, Pause],
};

let game = new Phaser.Game(config); // Launch the game.
