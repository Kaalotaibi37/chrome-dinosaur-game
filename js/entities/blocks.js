export class Blocks {
  create(scene) {
    this.group = scene.physics.add.group({
      maxSize: 1,
    });
    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.addBlock(scene),
    });
  }

  addBlock(scene) {
    const die_1 = Math.floor(Math.random() * 14 + 1);

    if (die_1 <= 5) {
      const die_2 = Math.floor(Math.random() * 6 + 1);

      let block = null;
      if (die_2 >= 6) {
        block = this.group.get(1000, 472, "blockLarge");
      } else if (die_2 >= 4) {
        block = this.group.get(1000, 472, "block");
      }

      if (!block) return;

      block.setName("Block_" + "WIP");

      console.group("Block spawn");
      console.log(block.name);
      console.log("Spawn value: " + die_2);
      console.groupEnd("Block spawn");
    }
  }

  update(scene) {
    this.group.children.iterate((block) => {
      block.x -= scene.globalTileSpeed;
      if (block.x <= -200) {
        block.destroy();
      }
    });
  }
}
