export class Healthbar {
  constructor(game) {
    this.game = game;
    this.counter = 1;
  }

  create() {
    this.healthbarBorder = this.game.add.sprite(105, 40, "healthbarBorder");
    this.healthbar = this.game.add.sprite(105, 40, "healthbar");
  }

  draw() {
    this.healthbar.scaleX -= 0.25;
    this.healthbar.x -= 18;
  }
}

export class Leaderboard {
  constructor(game) {
    this.game = game;
    this.finalPosition = 250;
    this.alpha = 0;
    this.lerp = (value_0, value_1, value_t) => {
      return (1 - value_t) * value_0 + value_t * value_1;
    };
  }

  create(score, phaser) {
    let tempContent = [
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
      "mssalkhalifah ... " + score,
    ];

    let graphics = this.game.make.graphics();
    graphics.fillRect(152, 133, 340, 320);
    let mask = new phaser.Display.Masks.GeometryMask(this.game, graphics);

    this.score = score;
    this.leaderboard = this.game.add.sprite(400, -250, "leaderboard");
    this.leaderboard.setScale(1.2);
    this.leaderboard.setVisible(false);
    this.leaderboard.setAlpha(0, 0, 0, 0);

    this.arrow_down = this.game.add.sprite(230, -293, "arrow_down");
    this.arrow_up = this.game.add.sprite(230, -250, "arrow_up");
    this.spacebar = this.game.add.sprite(400, -250, "spacebar");

    this.arrow_up.setScale(2);
    this.arrow_up.setAlpha(0, 0, 0, 0);
    this.arrow_down.setScale(2);
    this.arrow_down.setAlpha(0, 0, 0, 0);
    this.spacebar.setScale(2);
    this.spacebar.setAlpha(0, 0, 0, 0);

    this.loadingSpinner = this.game.add.sprite(400, -250, "loading");
    this.loadingSpinner.setAlpha(0, 0, 0, 0);

    this.text = this.game.add.text(300, 120, tempContent).setOrigin(0);
    this.text.setMask(mask);
    this.text.setAlpha(0, 0, 0, 0);

    this.zone = this.game.add.zone(152, 130, 320, 256).setOrigin(0);

    this.game.anims.create({
      key: "loading",
      frames: this.game.anims.generateFrameNumbers("loading", {
        start: 0,
        end: 29,
      }),
      frameRate: 60,
      repeat: -1,
    });

    this.loadingSpinner.play("loading");

    this.game.anims.create({
      key: "arrow_down_hold",
      frames: this.game.anims.generateFrameNumbers("arrow_down", {
        frames: [1],
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.game.anims.create({
      key: "arrow_down_release",
      frames: this.game.anims.generateFrameNumbers("arrow_down", {
        frames: [1, 2, 0],
      }),
      frameRate: 24,
      repeat: 0,
    });

    this.game.anims.create({
      key: "arrow_up_hold",
      frames: this.game.anims.generateFrameNumbers("arrow_up", {
        frames: [1],
      }),
      frameRate: 10,
      repeat: 0,
    });

    this.game.anims.create({
      key: "arrow_up_release",
      frames: this.game.anims.generateFrameNumbers("arrow_up", {
        frames: [1, 2, 0],
      }),
      frameRate: 24,
      repeat: 0,
    });

    const leaderboardValue = this.text;
    const arrowDown = this.arrow_down;
    const arrowUp = this.arrow_up;

    this.game.input.keyboard.on("keyup", function (event) {
      if (event.keyCode === phaser.Input.Keyboard.KeyCodes.DOWN) {
        arrowDown.play("arrow_down_release");
      }
    });
    this.game.input.keyboard.on("keyup", function (event) {
      if (event.keyCode === phaser.Input.Keyboard.KeyCodes.UP) {
        arrowUp.play("arrow_up_release");
      }
    });
    this.game.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === phaser.Input.Keyboard.KeyCodes.DOWN) {
        leaderboardValue.y -= 10;
        arrowDown.play("arrow_down_hold");
      }
      console.log(leaderboardValue.y);
    });
    this.game.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === phaser.Input.Keyboard.KeyCodes.UP) {
        if (leaderboardValue.y < 120) {
          leaderboardValue.y += 10;
          arrowUp.play("arrow_up_hold");
        }
        console.log(leaderboardValue.y);
      }
    });

    this.isLoading = false;

    const loadingDone = () => {
      this.isLoading = true;
      this.alpha = 0;
    };

    setTimeout(loadingDone, 5000);
  }

  update(visible) {
    if (this.isLoading) {
      if (this.alpha <= 1) {
        let spinnerAlpha = 1 - this.alpha;
        this.loadingSpinner.setAlpha(
          spinnerAlpha,
          spinnerAlpha,
          spinnerAlpha,
          spinnerAlpha
        );
        this.text.setAlpha(this.alpha, this.alpha, this.alpha, this.alpha);
        this.alpha += 0.02;
      }
    }
    if (visible) {
      this.leaderboard.setVisible(true);
      if (this.leaderboard.y < 250) {
        this.leaderboard.y = this.lerp(251, this.leaderboard.y, 0.9);
        this.loadingSpinner.y = this.lerp(251, this.loadingSpinner.y, 0.9);
        this.arrow_up.y = this.lerp(250, this.arrow_up.y, 0.9);
        this.arrow_down.y = this.lerp(293, this.arrow_down.y, 0.9);
        this.spacebar.y = this.lerp(520, this.spacebar.y, 0.9);
        if (this.alpha <= 1) {
          this.alpha += 0.02;
          this.spacebar.setAlpha(
            this.alpha,
            this.alpha,
            this.alpha,
            this.alpha
          );
          this.loadingSpinner.setAlpha(
            this.alpha,
            this.alpha,
            this.alpha,
            this.alpha
          );
          this.arrow_up.setAlpha(
            this.alpha,
            this.alpha,
            this.alpha,
            this.alpha
          );
          this.arrow_down.setAlpha(
            this.alpha,
            this.alpha,
            this.alpha,
            this.alpha
          );
          this.leaderboard.setAlpha(
            this.alpha,
            this.alpha,
            this.alpha,
            this.alpha
          );
        }
      }
    }
  }
}
