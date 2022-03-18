export class ParallaxBackground {
  create(scene) {
    this.backgroundSky = scene.add.tileSprite(400, 300, 800, 600, "sky");
    this.backgroundCloud = scene.add.tileSprite(400, 300, 800, 600, "cloud");
    this.backgroundForeground = scene.add.tileSprite(
      400,
      300,
      800,
      600,
      "cloud_2"
    );
    this.backgroundMountain = scene.add.tileSprite(
      400,
      300,
      800,
      600,
      "mountain"
    );
    this.backgroundMountainForeground = scene.add.tileSprite(
      400,
      300,
      800,
      600,
      "mountain_foreground"
    );
  }

  update(scene) {
    this.backgroundSky.tilePositionX += 0.005 + scene.globalSpeed * 0.05;
    this.backgroundCloud.tilePositionX += 0.01 + scene.globalSpeed * 0.05;
    this.backgroundForeground.tilePositionX += 0.02 + scene.globalSpeed * 0.05;
    this.backgroundMountain.tilePositionX += 0.035 + scene.globalSpeed * 0.05;
    this.backgroundMountainForeground.tilePositionX +=
      0.05 + scene.globalSpeed * 0.05;
  }
}
