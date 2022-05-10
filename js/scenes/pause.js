/* eslint-disable no-undef */
/**
 * The game's pause screen.
 * This scene pops after clicking a pause button.
 */
export class Pause extends Phaser.Scene {
  constructor () {
    super({ key: 'Pause' })
  }

  create (data) {
    this.pauseSound = this.sound.add('pause')
    this.add.sprite(512, 300, 'pause')

    this.pauseSound.play()

    const currentScene = this.scene
    this.input.keyboard.on('keydown', function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        data.sound.resumeAll()
        currentScene.resume(data.key)
        currentScene.stop()
      }
    })
  }
}
