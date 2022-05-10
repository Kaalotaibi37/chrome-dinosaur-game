/* eslint-disable no-undef */
import { Leaderboard } from '../ui/leaderboard.js'

/**
 * The gameover's screen.
 * This scene launches once the player is defeated.
 */
export class Gameover extends Phaser.Scene {
  constructor () {
    super({ key: 'Gameover' })
    // Phaser.Scene.call(this, { key: 'Gameover' })
  }

  create (data) {
    console.log(data)
    this.leaderboard = new Leaderboard()
    this.leaderboard.create(this, data.score)

    this.lostLifeAudio = this.sound.add('lostLife')
    this.lostLifeAudio.play()

    this.player = this.physics.add.sprite(52, 58, 'player', 14)
    this.player.x = data.x % 1024
    this.player.y = data.y
    this.player.setScale(2)
    this.player.play('death')
    this.playDeathAnimation = false
    this.showLeaderboard = false
    this.time.addEvent({
      delay: 700,
      loop: false,
      callback: () => (this.playDeathAnimation = true)
    })

    const currentScene = this
    this.input.keyboard.on('keydown', function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        if (currentScene.showLeaderboard) {
          currentScene.scene.start('OverworldStage')
          currentScene.scene.stop()
        }
      }
    })
  }

  update () {
    if (this.playDeathAnimation) {
      this.player.setGravityY(850)
      this.player.setVelocityY(-500)
      this.playDeathAnimation = false
    }

    if (this.player.y >= 800) {
      this.player.y = 800
      this.showLeaderboard = true
    }

    this.leaderboard.update(this.showLeaderboard)
  }
}
