const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

new p5()

const settings = {
  dimensions: [800, 800],
  p5: true,
  pixelRatio: 2
}

const sketch = () => {
  background('floralwhite')
  const colors = ['saddlebrown', 'darkolivegreen', 'darkslategray']
  c = random(colors)
  stroke(color(c))
  let paddingX = random(0, 35)
  let paddingY = random(0, 35)
  const padding = 100

  return ({ width, height }) => {
    const usableArea = width - padding * 2

    for (let x = padding; x < width - padding;) {
      let lineLength = random(usableArea / 30, usableArea / 6)

      if (x + lineLength > width - padding) {
        lineLength = width - padding - x
      }

      const wobble = random(lineLength / 6, lineLength / 2)

      for (let y = padding; y < height - padding;) {
        const x1 = x
        const x2 = x1 + lineLength
        const y1 = y
        const y2 = y1 + wobble
        strokeWeight(random(1, 2) * noise(x, y))
        line(x1, y1, x2, y2)

        y += 15 * noise(x, y)
      }

      x += lineLength
    }
  }
}

canvasSketch(sketch, settings)
