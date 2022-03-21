export class Healthbar {
  create (scene) {
    // this.healthbarBorder = scene.add.image(105, 40, 'healthbarBorder')
    // this.healthbar = scene.add.image(17, this.healthbarBorder.height / 2 - 8, 'healthbar')
    // this.healthbar.setOrigin(0, 0)
    this.health = scene.add.group()
    this.scene = scene
  }

  initial (health) {
    // this.health.maxSize = health
    for (let i = 0; i < health; i++) {
      this.health.add(this.scene.add.image(32 * i + 32 + i, 32, 'heart'))
    }
  }

  draw (health) {
    console.group('health')
    console.log('totalHealth: ' + this.health.getLength())
    console.log('currentHealth: ' + health)
    console.groupEnd('health')

    if (health < this.health.getLength()) {
      this.health.getChildren()[this.health.getLength() - 1].destroy()
    }
  }
}
