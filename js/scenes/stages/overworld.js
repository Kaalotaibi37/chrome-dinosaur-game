import { Player } from '../../entities/player.js'
import { ChunkSystem } from '../../systems/chunk.js'
import { EntitiesManager, tags } from '../../entities/entities.js'
import eventsCenter from '../../utils/eventsCenter.js'

/* eslint-disable no-undef */
export class OverworldStage extends Phaser.Scene {
  constructor () {
    super({ key: 'OverworldStage' })
  }

  create (data) {
    data = { health: 5 }

    this.background = this.add.tileSprite(512, 320, 1024, 640, 'background')
    this.backgroundCloud = this.add.tileSprite(512, 320, 1024, 640, 'backgroundClouds')
    this.globalTileSpeed = 1
    this.distance = 100
    this.score = 0

    this.chunkSystem = new ChunkSystem(4, 4096)
    this.player = new Player()
    this.entitiesManager = new EntitiesManager()

    this.player.create(this)
    this.chunkSystem.create(this)
    this.entitiesManager.create(this)

    this.player.object.health = data.health

    this.chunkSystem.setCollider(this, this.player.object)
    this.chunkSystem.setCollider(this, this.entitiesManager.entities.meteors.group,
      (meteor) => {
        this.entitiesManager.entities.meteors.explode(meteor)
      })

    this.entitiesManager.entityNames.forEach((key) => {
      const group = this.entitiesManager.entities[key].group
      this.physics.add.overlap(this.player.object, group, (player, other) => {
        switch (other.tag) {
          case tags.enemy:
            if (!player.invisibility) {
              player.hit()
              eventsCenter.emit('update-health', player.health)
            }
            break
          case tags.power:
            other.action(player)
            eventsCenter.emit('update-health', player.health)
            break
          default:
            break
        }
      })
    })

    this.physics.add.overlap(this.player.object, this.chunkSystem.spikesGroup, (player) => {
      if (!player.invisibility) {
        player.hit()
        eventsCenter.emit('update-health', player.health)
      }
    })

    this.background.setScrollFactor(0)
    this.backgroundCloud.setScrollFactor(0)

    this.scene.launch('GameHUD')

    // Starts start animation
    this.input.keyboard.enabled = false
    this.player.object.y = 0
    this.player.object.x = -100
    this.player.object.setCollideWorldBounds(false)
    this.startAnimation = true
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.startAnimation = false
        this.input.keyboard.enabled = true
        this.player.object.setCollideWorldBounds(true)
      }
    })

    const currentScene = this
    this.input.keyboard.on('keydown', function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        currentScene.sound.pauseAll()
        currentScene.scene.launch('Pause', {
          sound: currentScene.sound,
          key: 'OverworldStage'
        })
        currentScene.scene.pause()
      }
    })

    currentScene.scene.moveBelow('OverworldStage', 'Gameover')

    this.chunkSystem.generateSpikeTiles(this.chunkSystem.chunks[1])
    this.chunkSystem.generateSpikeTiles(this.chunkSystem.chunks[2])
    this.chunkSystem.generateSpikeTiles(this.chunkSystem.chunks[3])

    // this.currentLayerText = this.add.text(512, 10, 'Current Chunk')
    // this.currentLayerText.setScale(3)
    // this.currentLayerText.setScrollFactor(0)

    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.score += 1
        eventsCenter.emit('update-score', this.score)
      },
      loop: true
    })

    // Play music
    this.sound.play('overworld', { volume: 0.3 })
  }

  update (_, delta) {
    if (this.startAnimation) {
      this.player.object.x = Math.lerp(400, this.player.object.x, 0.99)
    }

    // console.log('Current chunk: ', this.chunkSystem.currentChunk(this.cameras.main.scrollX))
    const mod = 3073
    // const speed = 0
    const speed = 0.5

    // this.currentLayerText.setText('Current Chunk: ' + this.chunkSystem.currentChunk(this.player.object.x))

    if (!this.startAnimation) {
      this.cameras.main.scrollX += speed * delta
      this.player.object.setVelocityX(1000 * speed)
      this.background.tilePositionX += speed * 0.3
      this.backgroundCloud.tilePositionX += speed * 0.1
      if (this.player.object.x - this.cameras.main.scrollX < -64) {
        this.player.object.health -= 9999
      }
    }

    if (this.cameras.main.scrollX >= mod) {
      this.cameras.main.scrollX = 0
      this.player.object.x = this.player.object.x - mod
      this.entitiesManager.entities.birds.group.children.iterate((bird) => {
        bird.x = bird.x - mod
      })
      this.entitiesManager.entities.meteors.group.children.iterate((meteor) => {
        meteor.x -= mod
      })
      this.entitiesManager.entities.powerups.group.children.iterate((powerUp) => {
        powerUp.x = powerUp.x - mod
      })
      this.chunkSystem.updateChunks(this)
    }

    this.chunkSystem.spikesGroup.children.iterate((spike) => {
      if (spike && spike.x - this.cameras.main.scrollX < -64) {
        spike.destroy()
      }
    })

    this.player.update(this)
    this.entitiesManager.update(this)
  }
}
