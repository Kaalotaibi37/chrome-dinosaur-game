import { Healthbar } from '../ui/healthbar.js'
import eventsCenter from '../utils/eventsCenter.js'

/* eslint-disable no-undef */
export class GameHUD extends Phaser.Scene {
  constructor () {
    super()
    Phaser.Scene.call(this, { key: 'GameHUD' })
  }

  create () {
    this.healthbar = new Healthbar()
    this.healthbar.create(this)
    this.healthbar.initial(5)
    this.scoreText = this.add.text(16, 80, 'score: ', { fontFamily: 'ARCADECLASSIC', color: 'black', fontSize: '4em' })
    this.scoreNumberText = this.add.text(140, 80, '', { fontFamily: 'ARCADECLASSIC', color: 'red', fontSize: '4em' })
    this.username = this.add.text(16, 8, '', { fontFamily: 'ARCADECLASSIC', color: 'black', fontSize: '4em' })

    fetch('/game/username.php')
      .then(data => data.json())
      .then(username => this.username.setText(username))

    const updateHealth = (health) => this.healthbar.draw(health)
    const updateScore = (score) => {
      this.scoreNumberText.setText(`${score}`)
    }

    eventsCenter.on('update-health', updateHealth, this)
    eventsCenter.on('update-score', updateScore, this)

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventsCenter.off('update-health', updateHealth, this)
      eventsCenter.off('update-score', updateScore, this)
    })
  }
}
