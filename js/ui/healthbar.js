export class Healthbar {
  create (scene) {
    this.health = scene.add.group()
    this.scene = scene
  }

  initial (health) {
    for (let i = 0; i < health; i++) {
      this.health.add(this.scene.add.image(32 * i + 32 + i, 32, 'heart'))
    }
  }

  draw (health) {
    if (health < this.health.getLength()) {
      this.health.getChildren()[this.health.getLength() - 1].destroy()

      console.group('Healthbar: gained health')
      console.log('Lost health: ' + this.health.getLength())
      console.log('currentHealth: ' + health)
      console.groupEnd('Healthbar: gained health')
    }

    if (health > this.health.getLength()) {
      for (let i = this.health.getLength(); i < health; i++) {
        this.health.add(this.scene.add.image(32 * i + 32 + i, 32, 'heart'))
      }

      console.group('Healthbar: lost health')
      console.log('Gained health: ' + this.health.getLength())
      console.log('currentHealth: ' + health)
      console.groupEnd('Healthbar: lost health')
    }
  }
}
