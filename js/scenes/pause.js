/**
 * The game's pause screen.
 * This scene pops after clicking a pause button.
 */
export class Pause extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "Pause" });
  }

  create(sound) {
    this.add.sprite(400, 300, "pause");
    const currentScene = this.scene;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        sound.resumeAll();
        currentScene.resume("Game");
        currentScene.stop();
      }
    });
  }
}
