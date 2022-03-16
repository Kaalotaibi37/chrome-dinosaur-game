import { Player, BirdManager } from "./game.js";

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
      frameWidth: 50,
      frameHeight: 50,
    });
  }

  create() {
    this.backgroundTile = this.add.tileSprite(400, 300, 800, 600, "ground");
    this.birds = new BirdManager(this);
    this.birds.create();
    this.player = new Player(this);
    this.player.create();

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.birds.addBird(),
    });
  }

  update() {
    this.player.update();
    this.birds.update();
    this.backgroundTile.tilePositionX += 3.5;
  }
}

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
  scene: [Game],
};

let game = new Phaser.Game(config);
