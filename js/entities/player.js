export class Player {
  create(scene) {
    this.cursor = scene.input.keyboard.createCursorKeys();
    this.jumpSound = scene.sound.add("jump");
    this.hitSound = scene.sound.add("hit");
    this.object = scene.physics.add.sprite(52, 58, "player");
    this.object.setScale(2);
    this.object.setCollideWorldBounds(true);
    this.object.setGravityY(850);
    this.object.x = 50;
    this.object.y = 450;
    this.object.health = 4;
    this.object.invisibilty = false;
    this.cursor.space.repeat = 1;

    this.state = {
      RUN: "run",
      CROUCH: "crouch",
      JUMP: "jump",
      DEAD: "dead",
    };
    this.currentState = this.state.RUN;

    this.object.hit = () => {
      this.hitSound.play();
      scene.cameras.main.shake(100, 0.008);
      this.object.health -= 1;

      scene.time.addEvent({
        delay: 1400,
        loop: false,
        callback: () => (this.object.invisibility = false),
      });

      scene.time.addEvent({
        delay: 200,
        repeat: 7,
        callback: () => {
          this.object.setVisible(!this.object.visible);
        },
      });
    };

    scene.anims.create({
      key: "crouch",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 6,
        end: 11,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: "run",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 0,
        end: 5,
      }),
      frameRate: 12,
    });

    scene.anims.create({
      key: "jump",
      frames: scene.anims.generateFrameNumbers("player", {
        start: 12,
        end: 13,
      }),
      frameRate: 12,
      repeat: 0,
    });

    scene.anims.create({
      key: "death",
      frames: scene.anims.generateFrameNumbers("player", {
        frames: [
          14, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16,
          15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15,
          16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16, 15, 16,
        ],
      }),
      delay: 700,
      frameRate: 12,
      repeat: 0,
    });

    this.maxAnimationThreshHold = 25;
    this.object.anims.msPerFrame = 100;
  }

  update(scene) {
    let player = this.object;
    player.setVelocityX(0);

    if (player.anims.msPerFrame > this.maxAnimationThreshHold) {
      player.anims.msPerFrame = 100 - scene.distance * 0.5;
    } else {
      player.anims.msPerFrame = this.maxAnimationThreshHold;
    }

    if (player.health <= 0) {
      this.currentState = this.state.DEAD;
    }

    if (this.cursor.right.isDown) {
      player.setVelocityX(200);
    }

    if (this.cursor.left.isDown) {
      player.setVelocityX(-200);
    }

    switch (this.currentState) {
      case this.state.RUN: {
        player.setSize(15, 40);
        player.setOffset(20, 17);
        this.object.play("run", true);
        if (this.cursor.up.isDown) {
          player.anims.play("jump");
          player.setVelocityY(-550);
          this.jumpSound.play();
          this.currentState = this.state.JUMP;
        }
        if (this.cursor.down.isDown) {
          this.currentState = this.state.CROUCH;
        }
        break;
      }
      case this.state.CROUCH: {
        player.setSize(40, 18);
        player.setOffset(7, 39);
        player.anims.play("crouch", true);
        if (!this.cursor.down.isDown) {
          this.currentState = this.state.RUN;
        }
        break;
      }
      case this.state.JUMP: {
        player.setSize(13, 30);
        player.setOffset(22, 19);
        if (player.y >= 448) {
          this.currentState = this.state.RUN;
        }
        break;
      }
      case this.state.DEAD: {
        scene.sound.stopAll();
        player.setVisible(false);
        scene.scene.launch("Gameover", [player.x, player.y, scene.distance]);
        scene.scene.pause();
        break;
      }
    }
    if (player.y > 448) {
      player.y = 448;
    }
  }
}
