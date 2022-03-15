let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  canvas: document.getElementById("myCanvas"),
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
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
let platform;
let backgroundTile;
let player;
let cursor;

function preload() {
  this.load.image("ground", "assets/background.png");
  //   this.load.image("player", "assets/player.png");
  this.load.spritesheet("player", "assets/player_spritesheet.png", {
    frameWidth: 50,
    frameHeight: 50,
  });
}

function create() {
  cursor = this.input.keyboard.createCursorKeys();
  backgroundTile = this.add.tileSprite(400, 300, 800, 600, "ground");

  player = this.physics.add.sprite(50, 50, "player");
  player.setCollideWorldBounds(true);
  player.setGravityY(850);

  this.anims.create({
    key: "crouch",
    frames: [{ key: "player", frame: 1 }],
    frameRate: 10,
  });

  this.anims.create({
    key: "idle",
    frames: [{ key: "player", frame: 0 }],
    frameRate: 10,
  });
}

function update() {
  player.anims.play("idle", true);
  player.setSize(50, 50);
  if (cursor.up.isDown && player.y >= 470) {
    player.setGravityY(850);
    player.setVelocityY(-550);
  }

  if (cursor.down.isDown && player.y >= 470) {
    player.anims.play("crouch", true);
    player.setSize(50, 35);
    player.setOffset(0, 15);
  }

  backgroundTile.tilePositionX += 3.5;
}
