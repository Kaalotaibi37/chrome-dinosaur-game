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
    player.setVelocityX(0);

    if (this.cursor.right.isDown) {
      player.setVelocityX(200);
    }

    if (this.cursor.left.isDown) {
      player.setVelocityX(-200);
    }

    if (this.cursor.up.isDown && player.y >= 470) {
      player.setVelocityY(-550);
    }

    if (this.cursor.down.isDown && player.y >= 470) {
      player.anims.play("crouch", true);
      player.setSize(50, 35);
      player.setOffset(0, 15);
    }
  }
}

const birdPaths = {
  horizontalLine: (bird) => {
    return bird.y;
  },
  wave: (bird) => {
    const yPosition = 531.875 - (23 * bird.waveHeight) / 16;
    return bird.waveHeight * Math.sin(bird.x / bird.waveLength) + yPosition;
  },
  dive: (bird) => {
    return -bird.x + bird.yPos + 450;
  },
  parabola: (bird) => {
    return -(Math.pow(bird.x - bird.xPos, 2) / bird.yPos) + 490;
  },
};

export class BirdManager {
  constructor(game) {
    this.game = game;
  }

  create() {
    this.group = this.game.physics.add.group({
      defaultKey: "bird",
      maxSize: 7,
      createCallback: (bird) => {
        bird.setName(`bird_${this.getLength()}`);
        console.log(`Spawned bird: ${bird.name}`);
      },
      removeCallback: (bird) => {
        console.log(`Removed bird: ${bird.name}`);
      },
    });
  }

  addBird() {
    const paths = Object.keys(birdPaths);
    const index = Math.floor(Math.random() * paths.length);
    console.log(paths[index]);

    const bird = this.group.get();

    if (!bird) return;

    bird.setSize(25, 20);

    bird.x = 850;

    switch (paths[index]) {
      case birdPaths.horizontalLine.name: {
        const y = [
          445,
          445,
          480,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
        ];
        const index = Math.floor(Math.random() * y.length);
        bird.y = y[index];
        bird.pathFunc = birdPaths.horizontalLine;
        break;
      }
      case birdPaths.dive.name: {
        bird.yPos = Math.floor(Math.random() * 600 + 100);
        bird.pathFunc = birdPaths.dive;
        break;
      }
      case birdPaths.parabola.name: {
        bird.yPos = Math.floor(Math.random() * 600 + 100);
        bird.xPos = Math.floor(Math.random() * 600 + 100);
        bird.pathFunc = birdPaths.parabola;
        break;
      }
      case birdPaths.wave.name: {
        bird.waveHeight = 100 + Math.floor(Math.random() * 111);
        bird.waveLength = 100 + Math.floor(Math.random() * 100);
        bird.pathFunc = birdPaths.wave;
        break;
      }
    }

    bird.setActive(true).setVisible(true);
  }

  update() {
    this.group.children.iterate((bird) => {
      bird.setVelocityX(-200);
      bird.y = bird.pathFunc(bird);
      if (bird.x < 0 || bird.y > 495) {
        this.group.killAndHide(bird);
      }
    });
  }
}
