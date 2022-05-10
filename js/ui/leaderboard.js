/* eslint-disable no-undef */
export class Leaderboard {
  create (scene, score) {
    this.finalPosition = 300
    this.alpha = 0
    this.leaderboardWidth = 512
    this.spinnerAlpha = 0
    this.lerp = (value0, value1, t) => {
      return (1 - t) * value0 + t * value1
    }

    const graphics = scene.make.graphics()
    graphics.fillRect(152, 163, this.leaderboardWidth, 320)
    const mask = new Phaser.Display.Masks.GeometryMask(scene, graphics)

    this.score = score
    this.leaderboard = scene.add.sprite(this.leaderboardWidth, -250, 'leaderboard')
    this.leaderboard.setScale(1.2)
    this.leaderboard.setVisible(false)
    this.leaderboard.setAlpha(0)

    this.arrow_down = scene.add.sprite(this.leaderboardWidth - 200, -293, 'arrow_down')
    this.arrow_up = scene.add.sprite(this.leaderboardWidth - 200, -250, 'arrow_up')
    this.spacebar = scene.add.sprite(this.leaderboardWidth, -250, 'spacebar')

    this.arrow_up.setScale(2)
    this.arrow_up.setAlpha(0)
    this.arrow_down.setScale(2)
    this.arrow_down.setAlpha(0)
    this.spacebar.setScale(2)
    this.spacebar.setAlpha(0)

    this.loadingSpinner = scene.add.sprite(this.leaderboardWidth, -250, 'loading')
    this.loadingSpinner.setAlpha(0, 0, 0, 0)

    this.text = scene.add.text(this.leaderboardWidth - 100, 180, '').setOrigin(0)
    this.text.setMask(mask)
    this.text.setAlpha(0)

    this.zone = scene.add.zone(152, 130, 320, 256).setOrigin(0)

    this.isLoading = true
    Promise.all([
      fetch('game/../server.score.post.php', { method: 'post', body: JSON.stringify({ score: score }) }),
      fetch('game/../server.score.get.php')
    ]).then(responses => Promise.all(responses.map(response => response.json())))
      .then(responses => {
        console.log(responses)

        const scores = Object.keys(responses[1]).map(key => {
          return [key, responses[1][key]]
        })

        scores.push([responses[0].updated ? 'You (NEW!)' : 'You', responses[0].new_score])
        scores.sort((value1, value2) => value2[1] - value1[1])

        const leaderboardContent = scores.map(
          (value) => `${value[0]} ... ${value[1]}`
        )

        this.isLoading = false
        this.text.setText(leaderboardContent)
      })

    scene.anims.create({
      key: 'loading',
      frames: scene.anims.generateFrameNumbers('loading', {
        start: 0,
        end: 29
      }),
      frameRate: 60,
      repeat: -1
    })

    this.loadingSpinner.play('loading')

    scene.anims.create({
      key: 'arrow_down_hold',
      frames: scene.anims.generateFrameNumbers('arrow_down', {
        frames: [1]
      }),
      frameRate: 10,
      repeat: 0
    })

    scene.anims.create({
      key: 'arrow_down_release',
      frames: scene.anims.generateFrameNumbers('arrow_down', {
        frames: [1, 2, 0]
      }),
      frameRate: 24,
      repeat: 0
    })

    scene.anims.create({
      key: 'arrow_up_hold',
      frames: scene.anims.generateFrameNumbers('arrow_up', {
        frames: [1]
      }),
      frameRate: 10,
      repeat: 0
    })

    scene.anims.create({
      key: 'arrow_up_release',
      frames: scene.anims.generateFrameNumbers('arrow_up', {
        frames: [1, 2, 0]
      }),
      frameRate: 24,
      repeat: 0
    })

    const leaderboardValue = this.text
    const arrowDown = this.arrow_down
    const arrowUp = this.arrow_up

    scene.input.keyboard.on('keyup', function (event) {
      switch (event.keyCode) {
        case Phaser.Input.Keyboard.KeyCodes.UP:
          arrowUp.play('arrow_up_release')
          break

        case Phaser.Input.Keyboard.KeyCodes.DOWN:
          arrowDown.play('arrow_down_release')
          break
      }
    })

    scene.input.keyboard.on('keydown', function (event) {
      switch (event.keyCode) {
        case Phaser.Input.Keyboard.KeyCodes.UP:
          if (leaderboardValue.y < 180) {
            leaderboardValue.y += 10
            arrowUp.play('arrow_up_hold')
          }
          break

        case Phaser.Input.Keyboard.KeyCodes.DOWN:
          leaderboardValue.y -= 10
          arrowDown.play('arrow_down_hold')
          break
      }
      console.log(leaderboardValue.y)
    })
  }

  update (visible) {
    if (visible) {
      this.leaderboard.setVisible(true)
      if (this.leaderboard.y < this.finalPosition) {
        this.leaderboard.y = this.lerp(this.finalPosition + 1, this.leaderboard.y, 0.9)
        this.loadingSpinner.y = this.lerp(this.finalPosition + 1, this.loadingSpinner.y, 0.9)
        this.arrow_up.y = this.lerp(this.finalPosition, this.arrow_up.y, 0.9)
        this.arrow_down.y = this.lerp(this.finalPosition + 43, this.arrow_down.y, 0.9)
        this.spacebar.y = this.lerp(this.finalPosition + 270, this.spacebar.y, 0.9)
        if (this.alpha <= 1) {
          this.alpha += 0.02
          this.spacebar.setAlpha(this.alpha)
          this.loadingSpinner.setAlpha(this.alpha)
          this.arrow_up.setAlpha(this.alpha)
          this.arrow_down.setAlpha(this.alpha)
          this.leaderboard.setAlpha(this.alpha)
        }
      } else {
        if (!this.isLoading) {
          if (this.spinnerAlpha <= 1) {
            const spinnerAlpha = 1 - this.spinnerAlpha
            this.loadingSpinner.setAlpha(spinnerAlpha)
            this.text.setAlpha(this.spinnerAlpha)
            this.spinnerAlpha += 0.02
          }
        }
      }
    }
  }
}
