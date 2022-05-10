export class Explosion {
  create (scene) {
    this.group = scene.physics.add.group({
      defaultKey: 'explosion'
    })

    scene.anims.create({
      key: 'explosion',
      frames: scene.anims.generateFrameNumbers('metero_explosion', {
        start: 0,
        end: 6
      }),
      frameRate: 12,
      repeat: 0,
      hideOnComplete: true
    })

    this.explosionSound = scene.sound.add('explosion')
    this.explosionSoundLarge = scene.sound.add('explosion')
    this.mainCamera = scene.cameras.main
    this.scene = scene
  }

  addExplosion (x, y, scale) {
    const volume = 0.15 * Math.pow(scale, 2) - 0.25 * scale + 0.4
    const rate = -0.2 * Math.pow(scale, 2) + 0.3 * scale + 1.9
    console.log(volume)

    const explosionType =
      scale >= 3 ? this.explosionSoundLarge : this.explosionSound

    explosionType.play({
      volume: volume,
      rate: rate
    })

    if (scale >= 3) {
      this.mainCamera.shake(500, 0.01)
    }

    const explosion = this.group.get(x, y)
    explosion.setName('Explosion_scale_' + scale)
    explosion.setScale(scale * 2)

    const reset = () => {
      explosion.setSize(1, 1)
      explosion.setOffset(1000, 1000)
    }

    reset()

    this.scene.time.addEvent({
      delay: 400,
      loop: false,
      callback: reset
    })
    this.scene.time.addEvent({
      delay: 300,
      loop: false,
      callback: () => {
        if (scale >= 3) {
          explosion.setSize(30, 30)
          explosion.setOffset(17, 20)
        } else {
          explosion.setSize(30, 20)
          explosion.setOffset(17, 25)
        }
      }
    })

    explosion.play('explosion')
    explosion.once('animationcomplete', () => {
      console.log('Explosion finished')
      explosion.destroy()
    })
  }

  update (scene) {}
}
