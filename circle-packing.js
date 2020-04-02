const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048]
};

const circles = [];
const minRadius = 30;
const maxRadius = 400;
const totalCircles = 500;
const gap = 20;
const createCircleAttempts = 500;


const sketch = ({width, height}) => {
  const createAndDrawCircle = () => {
    var newCircle;
    var circleSafeToDraw = false;
    
    for(var tries = 0; tries < createCircleAttempts; tries++) {
      newCircle = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        radius: minRadius
      }
      
      if (doesCircleHaveACollision(newCircle)) {
        continue;
      } else {
        circleSafeToDraw = true;
        break;
      }
    }
  
    if(!circleSafeToDraw) {
      return () => {};
    }
    
    for(var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
      newCircle.radius = radiusSize;
      if(doesCircleHaveACollision(newCircle)){
        newCircle.radius--;
        break;
      } 
    }
    
    return context => {
      circles.push(newCircle);
      context.beginPath();
      context.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2 * Math.PI);
      context.stroke(); 
    }
  }
  
  const doesCircleHaveACollision = circle => {
    for(var i = 0; i < circles.length; i++) {
      var otherCircle = circles[i];
      var a = circle.radius + otherCircle.radius + gap;
      var x = circle.x - otherCircle.x;
      var y = circle.y - otherCircle.y;
  
      if (a >= Math.sqrt((x * x) + (y * y))) {
        return true;
      }
    }
    
    if(circle.x + circle.radius >= width ||
       circle.x - circle.radius <= 0) {
      return true;
    }
      
    if(circle.y + circle.radius >= height ||
        circle.y - circle.radius <= 0) {
      return true;
    }
    
    return false;
  }
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'black'
    context.lineWidth = 4;
    
    Array.from(new Array(totalCircles)).forEach(circle => {
      createAndDrawCircle()(context)
    })
  };
};

canvasSketch(sketch, settings);
