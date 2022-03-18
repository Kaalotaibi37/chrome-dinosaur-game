import { ParallaxBackground } from "../entities/background.js";
import { EntitiesManager } from "../entities/entities.js";
import { Player } from "../entities/player.js";
import { Healthbar } from "../ui/healthbar.js";

/**
 * The game's main scene.
 * Here is where the main game loop and logic.
 */
export class Game extends Phaser.Scene {
  constructor() {
    super();
    Phaser.Scene.call(this, { key: "Game" });
  }

  create() {
    this.pauseSound = this.sound.add("pause");
    this.explosionSound = this.sound.add("explosion");
    this.backgroundSound_1 = this.sound.add("overworld");
    this.backgroundSound_2 = this.sound.add("overworld_2");

    this.parallaxBackground = new ParallaxBackground();
    this.entitiyManager = new EntitiesManager();
    this.player = new Player();
    this.healthbar = new Healthbar();

    this.globalSpeed = 0;
    this.globalTileSpeed = 1;

    this.parallaxBackground.create(this);
    this.ground = this.add.tileSprite(400, 600, 800, 192, "ground");
    this.physics.add.existing(this.ground, true);

    this.distance = 0;
    this.scoreText = this.add.text(690, 30, "Score: 0");

    this.entitiyManager.create(this);
    this.player.create(this);
    this.healthbar.create(this);

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        this.scoreText.text = `Score: ${++this.distance}`;
      },
    });

    this.time.addEvent({
      delay: 92000,
      loop: false,
      callback: () => this.backgroundSound_2.play({ volume: 0.5 }),
    });
    this.backgroundSound_1.play({
      volume: 0.1,
    });

    /** Adds overlap collision between the player and other entities */
    this.entitiyManager.entityNames.forEach((name) => {
      const entityGroup = this.entitiyManager.entities[name];
      this.physics.world.addOverlap(
        this.player.object,
        entityGroup.group,
        (player, otherEntity) => {
          if (!player.invisibility) {
            player.invisibility = true;
            player.hit();
            this.healthbar.draw(player.health);
            console.group("Collision Player and " + otherEntity.name);
            console.log("Collision detected!");
            console.log("Player health: " + player.health);
            console.groupEnd("Collision Player and " + otherEntity.name);
          }
        }
      );
    });

    this.physics.add.collider(this.player.object, this.ground);

    const currentScene = this;
    const playPauseSound = this.pauseSound;
    this.input.keyboard.on("keydown", function (event) {
      if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        currentScene.sound.pauseAll();
        playPauseSound.play();
        currentScene.scene.launch("Pause", currentScene.sound);
        currentScene.scene.pause();
      }
    });
  }

  update() {
    this.ground.tilePositionX += this.globalTileSpeed;

    this.parallaxBackground.update(this);
    this.player.update(this);
    this.entitiyManager.update(this);

    if (this.globalTileSpeed <= 5 && this.distance % 20 == 0) {
      this.globalTileSpeed += 0.005;
    }
  }
}
