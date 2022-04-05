/* eslint-disable no-undef */
export class Preload extends Phaser.Scene {
  constructor () {
    super()
    Phaser.Scene.call(this, { key: 'Preload' })
  }

  preload () {
    const progressBox = this.add.graphics()
    const progressBar = this.add.graphics()
    const width = this.cameras.main.width
    const height = this.cameras.main.height
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#000000'
      }
    })
    const precentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '0x000000'
      }
    })
    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '0x000000'
      }
    })
    assetText.setOrigin(0.5, 0.5)
    precentText.setOrigin(0.5, 0.5)
    loadingText.setOrigin(0.5, 0.5)
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(240, 270, 320, 50)
    console.log('Loading...')
    this.load.on('progress', (value) => {
      console.log(value)
      progressBar.clear()
      progressBar.fillStyle(0xffffff, 1)
      progressBar.fillRect(250, 280, 300 * value, 30)
      precentText.setText(parseInt(value * 100) + '%')
    })
    this.load.on('fileprogress', (file) => {
      console.log(file.src)
      assetText.setText('Loading assets: ' + file.src)
    })
    this.load.on('complete', () => {
      console.log('complete')
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
      precentText.destroy()
      assetText.destroy()
      this.scene.start('UnderworldStage')
      this.scene.stop()
    })

    this.load.image('leaderboard', 'assets/leaderboard.png')
    this.load.image('pause', 'assets/pause.png')
    this.load.image('block', 'assets/block.png')
    this.load.image('blockLarge', 'assets/block_large.png')
    this.load.image('heart', 'assets/heart.png')
    this.load.image('healthbarBorder', 'assets/healthbar_border.png')
    this.load.image('healthbar', 'assets/healthbar.png')
    this.load.image('gameTiles', 'assets/game-tiles.png')
    this.load.image('spike', 'assets/spikes.png')
    this.load.image('background', 'assets/background.png')
    this.load.image('backgroundClouds', 'assets/background-clouds.png')

    this.load.audio('lostLife', 'assets/audio/lost_life.wav')
    this.load.audio('overworld', 'assets/audio/overworld.mp3')
    this.load.audio('overworld_2', 'assets/audio/overworld_2.mp3')
    this.load.audio('hit', 'assets/audio/hit.wav')
    this.load.audio('jump', 'assets/audio/jump.wav')
    this.load.audio('pause', 'assets/audio/pause.wav')
    this.load.audio('meteor', 'assets/audio/meteor.wav')
    this.load.audio('explosion', 'assets/audio/explosion.wav')
    this.load.audio('meteorLarge', 'assets/audio/meteor_large.wav')
    this.load.audio('healthup', 'assets/audio/gained_health.wav')

    this.load.spritesheet('loading', 'assets/loading_spinner.png', {
      frameWidth: 200,
      frameHeight: 200
    })
    this.load.spritesheet('spacebar', 'assets/SPACEALTERNATIVE.png', {
      frameWidth: 98,
      frameHeight: 21
    })
    this.load.spritesheet('arrow_up', 'assets/ARROWUP.png', {
      frameWidth: 19,
      frameHeight: 21
    })
    this.load.spritesheet('arrow_down', 'assets/ARROWDOWN.png', {
      frameWidth: 19,
      frameHeight: 21
    })
    this.load.spritesheet(
      'metero_explosion',
      'assets/meteor_explosion_sheet.png',
      {
        frameWidth: 64,
        frameHeight: 64
      }
    )
    this.load.spritesheet('meteor', 'assets/meteor_sheet.png', {
      frameWidth: 16,
      frameHeight: 32
    })
    this.load.spritesheet('bird', 'assets/Bird.png', {
      frameWidth: 50,
      frameHeight: 50
    })
    this.load.spritesheet('player', 'assets/player_spritesheet.png', {
      frameWidth: 52,
      frameHeight: 58
    })
  }

  create () {}
}
