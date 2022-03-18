import { paths } from "./paths.js";

export class Meteors {
  create(scene) {
    this.group = scene.physics.add.group({
      defaultKey: "meteor",
      maxSize: 5,
    });

    this.spawnSound = scene.sound.add("meteor");

    scene.anims.create({
      key: "meteor",
      frames: scene.anims.generateFrameNumbers("meteor", {
        start: 0,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "explosion",
      frames: scene.anims.generateFrameNumbers("metero_explosion", {
        start: 0,
        end: 6,
      }),
      frameRate: 60,
      repeat: 0,
      hideOnComplete: true,
    });

    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.addMeteor(),
    });
  }

  addMeteor() {
    let spawnRate = Math.random() * 10;

    if (spawnRate > 3) return;

    const meteor = this.group.get();

    if (!meteor) return;

    this.spawnSound.play();
    meteor.explode = false;
    meteor.x = 800;
    meteor.setSize(8, 8);
    meteor.setOffset(-4, 20);
    meteor.yPos = Math.random() * 400 + 100;
    meteor.angle = 45;
    meteor.pathFunc = paths.dive;
    meteor.anims.play("meteor");

    meteor.setName("Meteor_" + "WIP");
    meteor.setActive(true).setVisible(true);
  }

  update(scene) {
    this.group.children.iterate((meteor) => {
      meteor.setVelocityX(-200 - scene.globalSpeed * 50);
      meteor.y = meteor.pathFunc(meteor);
    });
  }
}
