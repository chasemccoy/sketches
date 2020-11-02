const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

new p5()

const settings = {
  dimensions: [800, 800],
  pixelRatio: 2,
  p5: true,
  // animate: true
}

const inside = (point, bounds) => {
  var x = point.x
  var y = point.y

  var inside = false
  for (var i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
    var xi = bounds[i].x,
      yi = bounds[i].y
    var xj = bounds[j].x,
      yj = bounds[j].y

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }

  return inside
}

// Radius is the min distance between points
const poissonDiscSampler = (width, height, radius, { bounds }) => {
  const r = radius
  const k = 30
  const grid = []
  const active = []
  const w = r / Math.sqrt(2)

  // Step 0
  const cols = floor(width / w)
  const rows = floor(height / w)
  for (let i = 0; i < cols * rows; i++) {
    grid[i] = undefined
  }

  // Step 1
  const x = width / 2
  const y = height / 2
  const i = floor(x / w)
  const j = floor(y / w)
  const position = createVector(x, y)
  grid[i + j * cols] = position
  active.push(position)

  // Step 2
  while (active.length > 0) {
    const randomIndex = floor(random(active.length))
    const pos = active[randomIndex]
    let found = false

    for (let n = 0; n < k; n++) {
      const sample = p5.Vector.random2D()
      const m = random(r, 2 * r)
      sample.setMag(m)
      sample.add(pos)

      const col = floor(sample.x / w)
      const row = floor(sample.y / w)

      if (
        col > -1 &&
        row > -1 &&
        col < cols &&
        row < rows &&
        !grid[col + row * cols]
      ) {
        let ok = true
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const index = col + i + (row + j) * cols
            const neighbor = grid[index]

            if (neighbor) {
              const d = p5.Vector.dist(sample, neighbor)
              if (d < r) {
                ok = false
              }
            }
          }
        }

        if (ok) {
          found = true
          grid[col + row * cols] = sample
          active.push(sample)
        }
      }
    }

    if (!found) {
      active.splice(randomIndex, 1)
    }
  }

  for (let index = 0; index < grid.length; index++) {
    if (grid[index]) {
      strokeWeight(2)
      const v = createVector(grid[index].x, grid[index].y)

      if (inside(v, bounds)) {
        point(v)
      }
    }
  }
}

const chaikin = (arr, num) => {
  if (num === 0) return arr
  const l = arr.length
  const smooth = arr
    .map((c, i) => {
      return [
        [
          0.75 * c.x + 0.25 * arr[(i + 1) % l].x,
          0.75 * c.y + 0.25 * arr[(i + 1) % l].y,
        ],
        [
          0.25 * c.x + 0.75 * arr[(i + 1) % l].x,
          0.25 * c.y + 0.75 * arr[(i + 1) % l].y,
        ],
      ]
    })
    .flat()
    .map(v => createVector(v[0], v[1]))
  return num === 1 ? smooth : chaikin(smooth, num - 1)
}

const sketch = () => {
  return () => {
    background('white')
    const boxes = 4
    const gap = 20
    const padding = 50
    const boxHeight = (height - padding * 2 - gap * (boxes - 1)) / boxes
    const densities = [14, 10, 6, 4]

    for (let i = 0; i < boxes; i++) {
      const x = padding
      const y = padding + boxHeight * i + gap * i
      const w = width - padding * 2
      strokeWeight(2)
      // rect(x, y, w, boxHeight)

      const bounds = [
        createVector(x, y),
        createVector(x, y + boxHeight),
        createVector(x + w, y + boxHeight),
        createVector(x + w, y),
      ]

      const smoothedBounds = chaikin(bounds, 0)

      beginShape()
      smoothedBounds.forEach((point) => {
        vertex(point.x, point.y)
      })
      endShape(CLOSE)

      poissonDiscSampler(width, height, densities[i], { bounds: smoothedBounds })
    }
  }
}

canvasSketch(sketch, settings)
