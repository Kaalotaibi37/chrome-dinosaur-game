import { Healthbar } from '../ui/healthbar.js'

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
  }

  update () {
    this.healthbar.draw(5)
  }
}
