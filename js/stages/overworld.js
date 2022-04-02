export class OverworldStage {
  create (scene) {
    this.group = scene.physics.add.staticGroup({
      maxSize: 25
    })

    // this.temp = scene.physics.add.staticSprite(400, 600, 'overworld_ground', 0)
    // this.group.add(this.temp)
  }

  generateTile (scene) {
    const offsetX = Math.floor(scene.cameras.main.worldView.x)
    // const offsetX = Math.ceil(scene.cameras.main.worldView.x)
    const tile = this.group.get((this.group.getLength() * 32) + 100, 600, 'overworld_ground')
    if (!tile) return
    tile.refreshBody()
    tile.setActive(true).setVisible(true)
  }

  update (scene) {
    this.generateTile(scene)

    this.group.children.iterate((block) => {
      if (block.x <= -32) {
        this.group.killAndHide(block)
      }
    })
  }
}
