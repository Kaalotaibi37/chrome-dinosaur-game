import { Player, Bird } from "./game.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  canvas: document.getElementById("myCanvas"),
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      height: 495,
      isPaused: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);
let backgroundTile;
let player;
let bird;

function preload() {
  this.load.image("ground", "assets/background.png");
  this.load.spritesheet("bird", "assets/Bird.png", {
    frameWidth: 50,
    frameHeight: 50,
  });
  this.load.spritesheet("player", "assets/player_spritesheet.png", {
    frameWidth: 50,
    frameHeight: 50,
  });
}

function create() {
  backgroundTile = this.add.tileSprite(400, 300, 800, 600, "ground");

  player = new Player(this);
  player.create();

  bird = new Bird(this);
  bird.create();
}

function update() {
  player.update();
  bird.update();
  backgroundTile.tilePositionX += 3.5;
}
