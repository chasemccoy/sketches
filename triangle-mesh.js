const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048],
  bleed: 64
};

const drawTriangle = (a, b, c) => {
  return context => {
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.lineTo(c.x, c.y);
    context.lineTo(a.x, a.y);
    context.closePath();
    context.stroke();
  }
}

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineJoin = 'bevel';
    
     // Now draw a white rectangle in the center
    // context.strokeStyle = 'red';
    // context.lineWidth = 4;
    // context.strokeRect(width / 4, height / 4, width / 2, height / 2);
    
    // context.beginPath();
    // context.arc(width / 2, width / 2, width / 4, 0, Math.PI * 2, false);
    context.lineWidth = 4;
    // context.strokeStyle = 'blue';
    // context.stroke();
    // context.fill()
    
    const margin = width / 12;
    let line = []
    const lines = []
    const gap = width / 8;
    let odd = false;

    for (let y = (margin + gap) / 2; y <= height - margin; y+= gap) {
      odd = !odd
      line = [];
      for (let x = (margin + gap) / 2; x <= width - margin; x+= gap) {
        const dot = {x: x + (odd ? gap / 2 : 0), y}
        line.push({
          x: x + (Math.random()*.8 - .4) * gap  + (odd ? gap/2 : 0),
          y: y + (Math.random()*.8 - .4) * gap
        });
        
        // context.beginPath();
        // context.arc(dot.x, dot.y, 8, 0, 2 * Math.PI, true);
        // context.fillStyle = 'black';
        // context.fill();
      }
      lines.push(line);
    }
    
    var dotLine;
    odd = true;
    
    for(var y = 0; y < lines.length - 1; y++) {
      odd = !odd;
      dotLine = [];
      for(var i = 0; i < lines[y].length; i++) {
        dotLine.push(odd ? lines[y][i]   : lines[y+1][i]);
        dotLine.push(odd ? lines[y+1][i] : lines[y][i]);
      }
      for(var i = 0; i < dotLine.length - 2; i++) {
        var gray = Math.floor(Math.random()*16).toString(16);
        context.fillStyle = '#' + gray + gray + gray; 
        context.fill();
        const triangle = drawTriangle(dotLine[i], dotLine[i+1], dotLine[i+2]);
        triangle(context);
      }
    }
    
    
  };
};

canvasSketch(sketch, settings);
