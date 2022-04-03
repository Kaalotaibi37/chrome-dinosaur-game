import { Player } from '../../entities/player.js'
import { ChunkSystem } from '../../systems/chunk.js'
import { EntitiesManager } from '../../entities/entities.js'

/* eslint-disable no-undef */
export class UnderworldStage extends Phaser.Scene {
  constructor () {
    super()
    Phaser.Scene.call(this, { key: 'UnderworldStage' })
  }

  create (data) {
    data = { health: 20 }

    this.background = this.add.tileSprite(512, 320, 1024, 640, 'background')
    this.backgroundCloud = this.add.tileSprite(512, 320, 1024, 640, 'backgroundClouds')
    this.globalTileSpeed = 1
    this.distance = 100

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
    // this.chunkSystem.setOverlap(this, 9, this.player.object)

    this.background.setScrollFactor(0)
    this.backgroundCloud.setScrollFactor(0)
    // this.cameras.main.setBounds(0, 0, 4096, 640)
    // this.cameras.main.startFollow(this.player.object, true)

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
          key: 'UnderworldStage'
        })
        currentScene.scene.pause()
      }
    })
    // this.chunkSystem.updateChunks(this)
    // this.chunkSystem.conumeTiles(this.chunkSystem.chunks[0].layer)
    // this.chunkSystem.generateHeightTiles(this.chunkSystem.chunks[0].layer)
    // this.chunkSystem.generateSpikeTiles(this.chunkSystem.chunks[0].layer)
  }

  update (_, delta) {
    if (this.startAnimation) {
      this.player.object.x = Math.lerp(400, this.player.object.x, 0.99)
    }

    // console.log('Current chunk: ', this.chunkSystem.currentChunk(this.cameras.main.scrollX))
    const mod = 3073
    // const speed = 0
    const speed = 0.5

    if (!this.startAnimation) {
      // console.log('Camera: ', this.cameras.main.scrollX)
      this.cameras.main.scrollX += speed * delta
      this.player.object.setVelocityX(1000 * speed)
      this.background.tilePositionX += speed * 0.3
      this.backgroundCloud.tilePositionX += speed * 0.1
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

    this.player.update(this)
    this.entitiesManager.update(this)
  }
}
