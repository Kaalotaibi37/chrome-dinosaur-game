import { paths } from "./paths.js";

export class Meteors {
  create(scene) {
    this.group = scene.physics.add.group({
      defaultKey: "meteor",
      maxSize: 3,
    });

    this.meteorType = {
      SMALL: "small",
      LARGE: "large",
    };

    this.spawnMod = 0;
    this.spawnModThreshHold = 4;
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
    const spawnRate = (die_1 + die_2) * this.spawnMod * 100;

    let currentType = null;
    if (spawnRate >= 40) {
      currentType = this.meteorType.LARGE;
    } else if (spawnRate >= 18) {
      currentType = this.meteorType.SMALL;
    }

    if (!currentType) return;

    const meteor = this.group.get();

    if (!meteor) return;

    console.group("Meteor spawn");
    console.log("Type: " + currentType);
    console.log("Spawn mod: " + this.spawnMod);
    console.log("Spawn rate: " + spawnRate);
    console.groupEnd("Meteor spawn");

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
    if (this.spawnMod < this.spawnModThreshHold) {
      this.spawnMod = scene.distance * 0.03;
    }
    this.group.children.iterate((meteor) => {
      meteor.setVelocityX(-200 + meteor.modScale * 30);
      meteor.y = meteor.pathFunc(meteor);
    });
  }
}
