import { Birds } from "./birds.js";
import { Meteors } from "./meteros.js";

export class EntitiesManager {
  create(scene) {
    this.entities = {
      birds: new Birds(),
      meteors: new Meteors(),
    };
    this.entityNames = Object.keys(this.entities);
    this.entityNames.forEach((name) => this.entities[name].create(scene));
  }

  update(scene) {
    this.entityNames.forEach((name) => this.entities[name].update(scene));
  }
}
