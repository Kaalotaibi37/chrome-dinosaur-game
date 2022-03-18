import { paths } from "./paths.js";

export class Birds {
  create(scene) {
    this.group = scene.physics.add.group({
      defaultKey: "bird",
      maxSize: 2,
    });

    scene.anims.create({
      key: "fly",
      frames: scene.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.time.addEvent({
      delay: 700,
      loop: true,
      callback: () => this.addBird(scene),
    });
  }

  addBird(scene) {
    const pathKeys = Object.keys(paths);
    const index = Math.floor(Math.random() * pathKeys.length);
    console.log(pathKeys[index]);

    const bird = this.group.get();

    if (!bird) return;

    bird.anims.play("fly");

    if (this.group.maxSize < 30) {
      this.group.maxSize += Math.floor(scene.globalSpeed * Math.random());
    }

    bird.setSize(25, 20);

    bird.x = 850;

    switch (pathKeys[index]) {
      case paths.parabola.name: {
        bird.yPos = Math.floor(Math.random() * 600 + 100);
        bird.xPos = Math.floor(Math.random() * 600 + 100);
        bird.pathFunc = paths.parabola;
        break;
      }
      case paths.wave.name: {
        bird.waveHeight = 100 + Math.floor(Math.random() * 111);
        bird.waveLength = 100 + Math.floor(Math.random() * 100);
        bird.pathFunc = paths.wave;
        break;
      }
      default: {
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
        bird.pathFunc = paths.horizontalLine;
        break;
      }
    }

    bird.setName("Bird_" + bird.pathFunc.name);
    bird.setActive(true).setVisible(true);
  }

  update(scene) {
    this.group.children.iterate((bird) => {
      bird.setVelocityX(-200 - scene.globalSpeed * 30);
      bird.y = bird.pathFunc(bird);
      if (bird.x < 0) {
        this.group.killAndHide(bird);
      }
    });
  }
}
