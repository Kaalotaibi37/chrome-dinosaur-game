class Chunk {
  constructor (id, x) {
    this.x = x
    this.data = []
    this.width = 16
    this.height = 10
    this.id = id
    for (let i = 0; i < 10; i++) {
      const subData = []
      for (let j = 0; j < 16; j++) {
        subData.push(-1)
      }
      this.data.push(subData)
    }

    this.data[7].fill(1, 0, this.width)
    this.data[8].fill(4, 0, this.width)
    this.data[9].fill(4, 0, this.width)
  }

  create (scene) {
    this.map = scene.make.tilemap({ data: this.data, tileWidth: 64, tileHeight: 64 })
    this.tiles = this.map.addTilesetImage('gameTiles')
    this.layer = this.map.createLayer(0, this.tiles, 0, 0)
    this.spikeLayer = this.map.createLayer(1, this.tiles, 0, 0)
    this.map.setCollisionBetween(0, 8)
    this.layer.x = this.x
    console.log(this.layer)
  }

  isInChunk (otherX) {
    return otherX >= this.x && otherX <= this.x + (64 * this.width)
  }
}

export class ChunkSystem {
  constructor (n, totalWidth) {
    this.chunkWidth = totalWidth / n
    this.chunks = []
    for (let i = 0; i < n; i++) {
      const chunk = new Chunk(i, this.chunkWidth * i)
      this.chunks.push(chunk)
    }
  }

  create (scene) {
    this.chunks.forEach((chunk) => chunk.create(scene))
  }

  setCollider (scene, gameObject, callBack) {
    this.chunks.forEach((chunk) => {
      scene.physics.add.collider(gameObject, chunk.layer, callBack)
    })
  }

  setOverlap (scene, tileType, gameObject, callBack) {
    this.chunks.forEach((chunk) => {
      chunk.map.setTileIndexCallback(tileType, callBack, scene)
    })
  }

  generateSpikeTiles (chunk) {
    const dice = Math.floor(Math.random() * 10)

    if (dice >= 6) return

    const skip = Math.floor(Math.random() * 15)
    const groundTile = chunk.layer.findByIndex(1, skip)

    console.log('ground Tile: ', groundTile)
    if (!groundTile) return

    const width = Math.floor(Math.random() * 4 + 1)

    for (let i = groundTile.x; i < width + groundTile.x; i++) {
      const tile = chunk.layer.getTileAt(i, groundTile.y)
      if (tile && [0, 1, 2].includes(tile.index)) {
        chunk.spikeLayer.putTileAt(9, i, groundTile.y - 1)
      }
    }
  }

  generateHeightTiles (chunk) {
    const dice = Math.floor(Math.random() * 10)
    if (dice >= 5) return

    const maxWidth = 6
    const minWidth = 3
    const startY = 5
    const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth
    const startX = Math.floor(Math.random() * (15 - maxWidth)) + 1

    chunk.fill(3, startX, startY, width)
    chunk.fill(1, startX + 1, startY, width - 2)
    chunk.fill(4, startX + 1, startY + 1, width - 2)
    chunk.putTileAt(0, startX, startY)
    chunk.putTileAt(2, startX + width - 1, startY)
  }

  conumeTiles (chunk) {
    const dice = Math.floor(Math.random() * 10)
    if (dice >= 7) return

    const startX = Math.floor(Math.random() * 8) + 1
    const startY = 7
    const width = 5

    chunk.fill(-1, startX, startY, width)

    chunk.putTileAt(2, startX - 1, startY)
    chunk.fill(5, startX - 1, startY + 1, 1, 2)

    chunk.putTileAt(0, startX + width, startY)
    chunk.fill(3, startX + width, startY + 1, 1, 2)
  }

  updateChunks (scene) {
    const chunk = this.chunks.pop()
    const update = async () => {
      chunk.layer.x = 0
      this.chunks.forEach((chunk) => {
        chunk.layer.x += 1024
        // chunk.spikeLayer.x += 1024
      })
      for (let i = 0; i < this.chunks.length; i++) {
        this.chunks[i].layer.fill(null)
        this.chunks[i].spikeLayer.fill(-1, 0, 0)
        this.chunks[i].layer.fill(1, 0, 7)
        this.chunks[i].layer.fill(4, 0, 8)
        // this.conumeTiles(this.chunks[i].layer)
        // this.generateHeightTiles(this.chunks[i].layer)
        this.generateSpikeTiles(this.chunks[i])
      }
    }
    update().then(() => this.chunks.unshift(chunk))
  }

  currentChunk (x) {
    const currentChunk = this.chunks.find((chunk) => chunk.isInChunk(x))

    return (currentChunk) ? currentChunk.id : -1
  }
}
