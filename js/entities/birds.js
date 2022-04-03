import { tags } from './entities.js'
import { paths } from './paths.js'

export class Birds {
  create (scene) {
    this.group = scene.physics.add.group({
      defaultKey: 'bird',
      maxSize: 5
    })

    scene.anims.create({
      key: 'fly',
      frames: scene.anims.generateFrameNumbers('bird', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    })

    scene.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => this.addBird(scene)
    })
  }

  addBird (scene) {
    const dice = Math.floor(Math.random() * 6 + 1)

    if (dice !== 1) return

    const currentPath = paths.horizontalLine

    const bird = this.group.get()

    if (!bird) return

    console.group('Bird spwan')
    console.log('Path: ' + currentPath.name)
    console.groupEnd('Bird spawn')

    bird.anims.play('fly')
    bird.setSize(25, 20)
    bird.x = 850

    switch (currentPath.name) {
      case paths.parabola.name: {
        bird.yPos = Math.floor(Math.random() * 600 + 100)
        bird.xPos = Math.floor(Math.random() * 600 + 100)
        bird.pathFunc = paths.parabola
        break
      }
      case paths.wave.name: {
        bird.waveHeight = 100 + Math.floor(Math.random() * 111)
        bird.waveLength = 100 + Math.floor(Math.random() * 100)
        bird.pathFunc = paths.wave
        break
      }
      default: {
        const y = [
          425,
          425,
          425,
          425,
          480,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100,
          Math.random() * 330 + 100
        ]
        const index = Math.floor(Math.random() * y.length)
        bird.y = y[index]
        bird.pathFunc = paths.horizontalLine
        break
      }
    }

    bird.tag = tags.enemy
    bird.x += scene.cameras.main.scrollX + 1024
    bird.setName('Bird_' + bird.pathFunc.name)
    bird.setActive(true).setVisible(true)
  }

  update (scene) {
    this.group.children.iterate((bird) => {
      bird.setVelocityX(-200)
      bird.y = bird.pathFunc(bird)
      if (bird.x - scene.cameras.main.scrollX < 0) {
        this.group.killAndHide(bird)
      }
    })
  }
}
