import { Preload } from './scenes/preload.js'
// import { Game } from './scenes/game.js'
import { Gameover } from './scenes/gameover.js'
import { Pause } from './scenes/pause.js'
import { GameHUD } from './scenes/gui.js'
import { OverworldStage } from './scenes/stages/overworld.js'

Math.lerp = (value0, value1, t) => {
  return (1 - t) * value0 + t * value1
}

/* This is the config for the game's scene */
const config = {
  // eslint-disable-next-line no-undef
  type: Phaser.WebGL, // Tell phaser to choose either Canvas or WebGL for rendering
  width: 64 * 16,
  height: 64 * 10,
  transparent: true,
  pixelArt: true, // Disables anti aliasing for sharper pixels.
  canvas: document.getElementById('myCanvas'), // Let the framework to choose my own Canvas
  physics: {
    // The game's physics configuration
    default: 'arcade',
    arcade: {
      debug: true,
      isPaused: false,
      width: 4096,
      height: 640,
      fixedStep: false
    }
  },
  scene: [Preload, Gameover, OverworldStage, Pause, GameHUD]
}

// Launch the game.
// eslint-disable-next-line no-new, no-undef
new Phaser.Game(config)
