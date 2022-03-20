export const paths = {
  horizontalLine: (entity) => {
    return entity.y
  },
  wave: (entity) => {
    const yPosition = 531.875 - (23 * entity.waveHeight) / 16
    return (
      entity.waveHeight * Math.sin(entity.x / entity.waveLength) + yPosition
    )
  },
  dive: (entity) => {
    return -entity.x + entity.yPos + 450
  },
  parabola: (entity) => {
    return -(Math.pow(entity.x - entity.xPos, 2) / entity.yPos) + 490
  }
}
