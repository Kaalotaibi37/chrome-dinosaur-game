/* eslint-disable no-undef */
import { ParallaxBackground } from '../entities/background.js'
import { EntitiesManager } from '../entities/entities.js'
import { Player } from '../entities/player.js'
import { Healthbar } from '../ui/healthbar.js'

/**
 * The game's main scene.
 * Here is where the main game loop and logic.
 */
export class Game extends Phaser.Scene {
  constructor () {
    super()
    Phaser.Scene.call(this, { key: 'Game' })
  }

  create () {
    const musicConfig = {
      volume: 0.2
    }
    const backgroundMusics = {
      overworld: this.sound.add('overworld', musicConfig),
      overworld2: this.sound.add('overworld_2', musicConfig)
    }

    this.parallaxBackground = new ParallaxBackground()
    this.entitiyManager = new EntitiesManager()
    this.player = new Player()
    this.healthbar = new Healthbar()

    this.globalTileSpeed = 1

    this.parallaxBackground.create(this)
    this.ground = this.add.tileSprite(400, 600, 800, 192, 'ground')
    this.physics.add.existing(this.ground, true)

    this.distance = 0
    this.scoreText = this.add.text(690, 30, 'Score: 0')

    this.entitiyManager.create(this)
    this.player.create(this)
    this.healthbar.create(this)

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.scoreText.text = `Score: ${++this.distance}`
      }
    })

    backgroundMusics.overworld.once('complete', () => backgroundMusics.overworld2.play())
    backgroundMusics.overworld.play()

    /** Adds overlap collision between the player and other entities */
    this.entitiyManager.entityNames.forEach((name) => {
      const entityGroup = this.entitiyManager.entities[name]
      this.physics.world.addOverlap(
        this.player.object,
        entityGroup.group,
        (player, otherEntity) => {
          if (!player.invisibility) {
            player.invisibility = true
            player.hit()
            this.healthbar.draw(player.health)
            console.group('Collision Player and ' + otherEntity.name)
            console.log('Collision detected!')
            console.log('Player health: ' + player.health)
            console.groupEnd('Collision Player and ' + otherEntity.name)
          }
        }
      )
    })

    this.physics.add.collider(this.player.object, this.ground)

    const currentScene = this
    this.input.keyboard.on('keydown', function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        currentScene.sound.pauseAll()
        currentScene.scene.launch('Pause', currentScene.sound)
        currentScene.scene.pause()
      }
    })
  }

  update () {
    this.ground.tilePositionX += this.globalTileSpeed

    this.parallaxBackground.update(this)
    this.player.update(this)
    this.entitiyManager.update(this)

    if (this.globalTileSpeed <= 5 && this.distance % 20 === 0) {
      this.globalTileSpeed += 0.005
    }
  }
}
