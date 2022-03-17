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
