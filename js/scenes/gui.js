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

    this.username = this.add.text(16, 8, 'Username')
    this.username.setScale(2)

    fetch('/game/username.php')
      .then(data => data.json())
      .then(username => this.username.setText(username))

    const updateHealth = (health) => this.healthbar.draw(health)
    eventsCenter.on('update-health', updateHealth, this)

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventsCenter.off('update-health', updateHealth, this)
    })
  }
}