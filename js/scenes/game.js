/* eslint-disable no-undef */
import { ParallaxBackground } from '../entities/background.js'
import { EntitiesManager, tags } from '../entities/entities.js'
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
      volume: 0.2,
      rate: 10
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
    this.finished = false

    this.parallaxBackground.create(this)
    this.ground = this.add.tileSprite(400, 600, 800, 192, 'ground')
    this.physics.add.existing(this.ground, true)

    this.distance = 0
    this.scoreText = this.add.text(690, 30, 'Score: 0')

    this.entitiyManager.create(this)
    this.player.create(this)
    this.healthbar.create(this)

    this.healthbar.initial(this.player.object.health)

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.scoreText.text = `Score: ${++this.distance}`
      }
    })

    backgroundMusics.overworld.once('complete', () => { this.finished = true })
    backgroundMusics.overworld.play()

    /** Adds overlap collision between the player and other entities */
    this.entitiyManager.entityNames.forEach((name) => {
      const entityGroup = this.entitiyManager.entities[name]
      this.physics.world.addOverlap(
        this.player.object,
        entityGroup.group,
        (player, otherEntity) => {
          switch (otherEntity.tag) {
            case tags.enemy: {
              if (!player.invisibility) {
                player.hit()
                console.group('Collision Player and ' + otherEntity.name)
                console.log('Collision detected!')
                console.log('Player health: ' + player.health)
                console.groupEnd('Collision Player and ' + otherEntity.name)
              }
              break
            }
            case tags.power:
              otherEntity.action(player)
              break

            default:
              console.warn('Unknown tag: ', otherEntity.name)
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
    if (this.finished) {
      this.player.object.x += 1
      this.input.keyboard.enabled = false
      this.player.object.setCollideWorldBounds(false)

      if (this.player.object.x > 900) {
        this.scene.start('UnderworldStage', {
          health: this.player.object.health
        })
      }
    }

    this.ground.tilePositionX += this.globalTileSpeed

    this.player.update(this)
    this.parallaxBackground.update(this)
    this.entitiyManager.update(this)

    if (this.globalTileSpeed <= 5 && this.distance % 20 === 0) {
      this.globalTileSpeed += 0.005
    }

    this.healthbar.draw(this.player.object.health)
  }
}
