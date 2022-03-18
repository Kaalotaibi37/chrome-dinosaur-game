import { paths } from "./paths.js";

export class Birds {
  create(scene) {
    this.group = scene.physics.add.group({
      defaultKey: "bird",
      maxSize: 1,
    });

    this.spawnRateThreshHold = 10;
    this.spawnMod = 0;
    this.spawnModThreshHold = 2;

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
    const die_1 = Math.floor(Math.random() * 6 + 1);
    const die_2 = Math.floor(Math.random() * 6 + 1);
    const spawnValue = (die_1 + die_2) * this.spawnMod;

    let currentPath = paths.horizontalLine;
    if (spawnValue >= 16) {
      currentPath = paths.wave;
    } else if (spawnValue < 16 && spawnValue >= 10) {
      currentPath = paths.parabola;
    }

    const bird = this.group.get();

    if (!bird) return;

    console.group("Bird spwan");
    console.log("Path: " + currentPath.name);
    console.log("Spwan mod: " + this.spawnMod);
    console.log("Spawn value: " + spawnValue);
    console.groupEnd("Bird spawn");

    bird.anims.play("fly");
    bird.setSize(25, 20);
    bird.x = 850;

    switch (currentPath.name) {
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
          425,
          425,
          425,
          425,
          480,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
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
    if (
      Math.floor(scene.distance / 30 > this.group.maxSize) &&
      this.group.maxSize < this.spawnRateThreshHold
    ) {
      this.group.maxSize += 1;
    }

    if (
      Math.floor(scene.distance / 10) > this.spawnMod &&
      this.spawnMod < this.spawnModThreshHold
    ) {
      this.spawnMod += 0.0001;
    }

    this.group.children.iterate((bird) => {
      bird.setVelocityX(-200 - scene.distance * 0.5);
      bird.y = bird.pathFunc(bird);
      if (bird.x < 0) {
        this.group.killAndHide(bird);
      }
    });
  }
}
