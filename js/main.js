/* eslint-disable no-undef */
import { Preload } from './scenes/preload.js'
import { Game } from './scenes/game.js'
import { Gameover } from './scenes/gameover.js'
import { Pause } from './scenes/pause.js'

/* This is the config for the game's scene */
const config = {
  // eslint-disable-next-line no-undef
  type: Phaser.AUTO, // Tell phaser to choose either Canvas or WebGL for rendering
  width: 800,
  height: 600,
  transparent: true,
  pixelArt: true, // Disables anti aliasing for sharper pixels.
  canvas: document.getElementById('myCanvas'), // Let the framework to choose my own Canvas
  physics: {
    // The game's physics configuration
    default: 'arcade',
    arcade: {
      debug: false,
      isPaused: false
    }
  },
  scene: [Preload, Game, Gameover, Pause]
}

// Launch the game.
// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config)
