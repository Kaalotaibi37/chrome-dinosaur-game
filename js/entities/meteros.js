import { paths } from "./paths.js";

export class Meteors {
  create(scene) {
    this.group = scene.physics.add.group({
      defaultKey: "meteor",
      maxSize: 4,
    });

    this.meteorType = {
      SMALL: "small",
      LARGE: "large",
    };

    this.explosionObject = null;
    this.spawnSound = scene.sound.add("meteor");
    this.spawnSoundLarge = scene.sound.add("meteorLarge");
    scene.physics.add.collider(this.group, scene.ground, (_, meteor) => {
      if (this.explosionObject) {
        this.explosionObject.addExplosion(meteor.x, meteor.y, meteor.modScale);
      }
      meteor.destroy();
    });

    scene.anims.create({
      key: "meteor",
      frames: scene.anims.generateFrameNumbers("meteor", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.addMeteor(),
    });
  }

  addMeteor() {
    const die_1 = Math.floor(Math.random() * 8 + 1);
    const die_2 = Math.floor(Math.random() * 8 + 1);
    const spawnRate = die_1 + die_2;

    let currentType = null;
    if (spawnRate >= 16) {
      currentType = this.meteorType.LARGE;
    } else if (spawnRate >= 12) {
      currentType = this.meteorType.SMALL;
    }

    if (!currentType) return;

    const meteor = this.group.get();

    if (!meteor) return;

    meteor.x = 800;
    meteor.setSize(8, 8);
    meteor.setOffset(-4, 20);
    switch (currentType) {
      case this.meteorType.SMALL:
        meteor.modScale = 1;
        this.spawnSound.play();
        break;
      case this.meteorType.LARGE: {
        meteor.modScale = 3;
        meteor.setScale(3);
        this.spawnSoundLarge.play();
      }
      default:
        break;
    }
    meteor.yPos = Math.random() * 400 + 100;
    meteor.angle = 45;
    meteor.pathFunc = paths.dive;
    meteor.anims.play("meteor");

    meteor.setName("Meteor_" + currentType);
    meteor.setActive(true).setVisible(true);
  }

  update(scene) {
    this.group.children.iterate((meteor) => {
      meteor.setVelocityX(-200 - scene.globalSpeed * 50);
      meteor.y = meteor.pathFunc(meteor);
    });
  }
}
