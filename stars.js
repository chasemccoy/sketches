const canvasSketch = require('canvas-sketch');
const { star } = require('./utils');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = 'black';
    context.lineWidth = 16;
    
    const radius = width / 4;
    const points = 12;
    const inset = 50;
    
    star(width / 2, height / 2, radius, points, inset)(context)
    context.stroke()
  };
};

canvasSketch(sketch, settings);
