class Actor {
  constructor(game) {
    this.game = game;
  }
}

export class Player extends Actor {
  create() {
    this.cursor = this.game.input.keyboard.createCursorKeys();
    this.object = this.game.physics.add.sprite(50, 50, "player");
    this.object.setCollideWorldBounds(true);
    this.object.setGravityY(850);
    this.object.x = 50;
    this.object.y = 470;

    this.game.anims.create({
      key: "crouch",
      frames: [{ key: "player", frame: 1 }],
      frameRate: 10,
    });

    this.game.anims.create({
      key: "idle",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 10,
    });
  }

  update() {
    let player = this.object;
    player.anims.play("idle", true);
    player.setSize(30, 50);
    if (this.cursor.up.isDown && player.y >= 470) {
      player.setGravityY(850);
      player.setVelocityY(-550);
    }

    if (this.cursor.down.isDown && player.y >= 470) {
      player.anims.play("crouch", true);
      player.setSize(50, 35);
      player.setOffset(0, 15);
    }
  }
}

export class Bird extends Actor {
  create() {
    this.object = this.game.physics.add.sprite(50, 50, "bird");
    this.object.setSize(20, 20);
    this.object.x = 400;
    this.object.y = 300;
  }

  update() {
    // this.object.x -= 1;
  }
}
