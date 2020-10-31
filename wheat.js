const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

new p5()

const settings = {
  dimensions: [800, 800],
  p5: true
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

  // return ({ width, height }) => {
  //   if (x1 < 640 || x2 < 640) {
  //     line(x1, y, x2 + paddingX, y + paddingY)
  //     y = y + paddingY

  //     if (y > 620) {
  //       x1 = x1 + paddingX
  //       x2 = x2 + paddingX
  //       paddingX = random(0, 35)
  //       y = 50
  //     }
  //   }

  //   if (frameCount > random(0, 35)) {
  //     c = random(colors)
  //     stroke(color(c))
  //     paddingY = random(0, 35)
  //     frameCount = 0
  //   }
  // }
}

canvasSketch(sketch, settings)
