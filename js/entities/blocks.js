import { tags } from './entities.js'

export class Blocks {
  create (scene) {
    this.group = scene.physics.add.group({
      maxSize: 1
    })
    scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.addBlock(scene)
    })
  }

  addBlock (scene) {
    const firstDie = Math.floor(Math.random() * 14 + 1)

    if (firstDie <= 100) {
      const secondDie = Math.floor(Math.random() * 8 + 1)

      let block = null

      if (secondDie <= 1) {
        block = this.group.get(1000, 387, 'blockLarge')
        if (!block) return
        block.setOrigin(0, 0)
        block.setSize(101, 110)
        block.setOffset(9, 10)
      } else if (secondDie >= 7) {
        block = this.group.get(1000, 444, 'block')
        if (!block) return
        block.setOrigin(0, 0)
        block.setSize(49, 46)
        block.setOffset(7, 13)
      } else {
        return
      }

      block.tag = tags.enemy
      block.setName('Block_' + 'WIP')

      console.group('Block spawn')
      console.log(block.name)
      console.log('Spawn value: ' + secondDie)
      console.groupEnd('Block spawn')
    }
  }

  update (scene) {
    this.group.children.iterate((block) => {
      block.x -= scene.globalTileSpeed
      if (block.x <= -200) {
        block.destroy()
      }
    })
  }
}
