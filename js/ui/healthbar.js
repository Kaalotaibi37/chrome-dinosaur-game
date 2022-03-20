export class Healthbar {
  create (scene) {
    this.healthbarBorder = scene.add.sprite(105, 40, 'healthbarBorder')
    this.healthbar = scene.add.sprite(105, 40, 'healthbar')
    this.counter = 1
  }

  draw () {
    this.healthbar.scaleX -= 0.25
    this.healthbar.x -= 18
  }
}
