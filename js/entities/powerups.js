import { tags } from './entities.js'
import { paths } from './paths.js'

export class PowerUpManager {
  create (scene) {
    this.group = scene.physics.add.group()
    // this.group.add(new Health().create(scene, 400, 300))

    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        // eslint-disable-next-line no-undef
        const dice = Math.floor(Math.random() * 32) + 1
        if (dice === 1) {
          const y = Math.random() * 100 + 300
          this.group.add(new Health().create(scene, 800, y))
        }
      }
    })
  }

  update (scene) {
    this.group.children.iterate((powerUp) => {
      powerUp.myUpdate()
    })
  }
}

class Health {
  create (scene, x, y) {
    this.object = scene.physics.add.sprite(x, y, 'heart')
    this.healthUpAudio = scene.sound.add('healthup')
    this.object.name = 'Heart Power up'
    this.object.tag = tags.power
    this.pathFunc = paths.horizontalLine

    this.object.action = (player) => {
      this.healthUpAudio.play()
      player.health += 1

      console.group('Heart Power up!')
      console.log('Gained 1 health!, Player health: ', player.health)
      console.groupEnd('Heart Power up!')

      this.object.destroy()
    }
    this.object.myUpdate = () => {
      this.object.x += -3
      this.object.y = this.pathFunc(this.object)
      if (this.object.x < -50) {
        this.object.destroy()
      }
    }

    return this.object
  }
}
