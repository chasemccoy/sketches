const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

new p5()

const settings = {
  dimensions: [700, 700],
  p5: true,
}

const sketch = () => {
  return ({ width, height }) => {
    // fill background color
    background('#ededed')

    // slow down the animation loop to 1 frame per second
    frameRate(1)

    // randomly choose a whole number between 50 ... 250
    var count = floor(random(50, 250))

    // start at center of screen
    var x = width / 2
    var y = height / 2

    // begin a shape
    beginShape()

    // place starting vertex
    vertex(x, y)

    // for each N in count
    for (var i = 0; i < count; i++) {
      // how far to offset in a square in negative or positive direction
      var off = random([10, 20, 40]) * random([-1, 1])

      // choose A or B, whether is even or is odd
      if (i % 2 === 0) {
        x += off
      } else {
        y += off
      }

      // if the path walks too far away, re-center it
      if (x < width * 0.25 || x > width * 0.75) x = width / 2
      if (y < height * 0.25 || y > height * 0.75) y = height / 2

      // place vertex
      vertex(x, y)
    }

    // place ending vertices so the shape fills in nicely
    vertex(width / 2, y)
    vertex(width / 2, height / 2)

    // setup styles
    stroke('black')
    strokeWeight(width * 0.005)
    strokeJoin(ROUND)
    strokeCap(ROUND)
    fill('white')

    // draw the shape
    endShape()
  }
}

canvasSketch(sketch, settings)
