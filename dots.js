const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

new p5()

const settings = {
  dimensions: [700, 700],
  p5: true,
}

const sketch = () => {
  background(248)
  noStroke()
  dR = random(0, 200)
  oR = random(1, 50)
  let shades1 = ['#F7003A', '#121122']
  let shades2 = ['#B08C3B', '#76A49F']
  let shade1 = random(shades1)
  let shade2 = random(shades2)
  cS1 = color(shade1)
  cS2 = color(shade2)

  let off = 0;

  return ({ width, height }) => {
    off = off + 0.001
    n = noise(off) * 2
    for (y1 = dR * n; y1 < height - dR * n; y1 = y1 + 20 * n) {
      for (x1 = dR * n; x1 < width - dR * n; x1 = x1 + 20 / n) {
        off = off + 0.001
        n = noise(off) * 2
        s = random(5, 10)
        fill(cS1)
        ellipse(x1, y1, s, s + 2)
        fill(cS2)
        ellipse(x1 + oR, y1 + oR, s, s + 2)
      }
    }
  }
}

canvasSketch(sketch, settings)
