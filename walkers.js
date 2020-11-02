const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

new p5()

const settings = {
  dimensions: [800, 800],
  pixelRatio: 2,
  p5: true,
  animate: true,
}

const colors = ['saddlebrown', 'darkolivegreen', 'darkslategray']

class Walker {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.velocityX = random(-5, 5)
    this.velocityY = random(-5, 5)
    this.weight = random(1, 3)
    this.color = random(colors)
    this.draw()
  }

  isOut() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height
  }

  velocity() {
    this.velocityX += map(
      noise(this.x * 0.003, this.y * 0.003, millis() * 0.001),
      0,
      1,
      -1,
      1
    )
    this.velocityY += map(
      noise(this.y * 0.003, this.x * 0.003, millis() * 0.001),
      0,
      1,
      -1,
      1
    )
  }

  move() {
    this.x += this.velocityX
    this.y += this.velocityY
  }

  draw() {
    strokeWeight(this.weight)
    stroke(this.color)
    line(this.x, this.y, this.px, this.py)
    this.px = this.x
    this.py = this.y
  }
}

const sketch = () => {
  background('white')
  let walkers = []
  blendMode(MULTIPLY);

  for (let i = 0; i < 50; i++) {
    walkers.push(new Walker(width / 2, height / 2))
  }

  // stroke(0, 100)

  return () => {
    walkers.forEach((walker) => {      
      if (!walker.isOut()) {
        walker.velocity()
        walker.move()
        walker.draw()
      }
    })
  }
}

canvasSketch(sketch, settings)
