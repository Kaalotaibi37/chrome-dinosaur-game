import { Birds } from './birds.js'
import { Meteors } from './meteros.js'
import { Explosion } from './explosion.js'
import { Blocks } from './blocks.js'

export class EntitiesManager {
  create (scene) {
    this.entities = {
      birds: new Birds(),
      meteors: new Meteors(),
      explosions: new Explosion(),
      blocks: new Blocks()
    }
    this.entityNames = Object.keys(this.entities)
    this.entityNames.forEach((name) => this.entities[name].create(scene))
    this.entities.meteors.explosionObject = this.entities.explosions
  }

  update (scene) {
    this.entityNames.forEach((name) => this.entities[name].update(scene))
  }
}
