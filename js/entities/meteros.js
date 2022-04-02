import { tags } from './entities.js'

export class Meteors {
  create (scene) {
    this.group = scene.physics.add.group({
      defaultKey: 'meteor',
      maxSize: 3
    })

    this.meteorType = {
      SMALL: 'small',
      LARGE: 'large'
    }

    this.spawnMod = 0
    this.spawnModThreshHold = 6
    this.explosionObject = null
    this.spawnSound = scene.sound.add('meteor')
    this.spawnSoundLarge = scene.sound.add('meteorLarge')

    scene.anims.create({
      key: 'meteor',
      frames: scene.anims.generateFrameNumbers('meteor', {
        start: 0,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    })

    scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => this.addMeteor(scene)
    })
  }

  explode (meteor) {
    if (this.explosionObject) {
      this.explosionObject.addExplosion(meteor.x, meteor.y, meteor.modScale)
    }
    meteor.destroy()
  }

  addMeteor (scene) {
    const firstDie = Math.floor(Math.random() * 6 + 1)
    const secondDie = Math.floor(Math.random() * 6 + 1)

    let currentType = null
    if (firstDie === 4 && secondDie === 4) {
      currentType = this.meteorType.LARGE
    } else if (firstDie === 4) {
      currentType = this.meteorType.SMALL
    }

    if (!currentType) return

    const meteor = this.group.get()

    if (!meteor) return

    console.group('Meteor spawn')
    console.log('Type: ' + currentType)
    console.log('Spawn mod: ' + this.spawnMod)
    console.groupEnd('Meteor spawn')

    meteor.x = 800
    meteor.setSize(8, 8)
    meteor.setOffset(-4, 20)
    switch (currentType) {
      case this.meteorType.SMALL:
        meteor.modScale = 1
        this.spawnSound.play()
        break
      case this.meteorType.LARGE: {
        meteor.modScale = 3
        meteor.setScale(3)
        this.spawnSoundLarge.play()
      }
    }

    meteor.angle = 45
    meteor.anims.play('meteor')
    meteor.tag = tags.enemy
    meteor.x += scene.cameras.main.scrollX + Math.floor(Math.random() * 2000)
    meteor.y -= 100
    meteor.setName('Meteor_' + currentType)
    meteor.setActive(true).setVisible(true)
  }

  update (scene) {
    this.group.children.iterate((meteor) => {
      meteor.setVelocityY(200)
      meteor.setVelocityX(-200)
    })
  }
}
