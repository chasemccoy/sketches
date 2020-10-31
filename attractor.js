const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 900, 600 ],
  animate: true,
  duration: 100,
  // loop: false
};

let A = 50 ; let CZ = 100 ; let KL = 100 ; let K = 0.01 ; 
let dPXmin = 0.00001 ; let KdPX = 0.1 ; let PXmin = -150 ; let PXmax = 0 ; let dT = 0.01 ;

let PX = 0 ; let PY = 0 ; let T = 0 ; let Tmax = 0 ; let X = 0 ; let Y = 0 ; let Z = 0 ; 
let dPX = 0 ; let Q = 0 ; let Qmax = 0 ; let L = 0 ; let F = 0 ; let BX = 0 ; let BY = 0 ; let MLS = 0 ; let I = 0 ;

function point(x, y, context){
  context.fillStyle = 'white';
  context.beginPath();
  context.arc(x, y, 4, 0, 2 * Math.PI, true);
  context.fill();
}

const sketch = () => {
  return ({ context, width, height, time }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);
    
    if ( I == 0 ) {
      for ( Q = 0 ; Q < Qmax ; Q++ ) {
        for( T = 0 ; T < Tmax ; T = T + dT ) {
          Z = A * Math.sin(T)+CZ ;
          L = Math.sqrt((X*X)+(Z*Z)) ;
          F = (L-KL)*K ;
          Y = Y - (F*X/L) ;
          X = X + Y ; 
        }
      
        point(+X*4+450, +Y*40+300, context); 
        point(-X*4+450, -Y*40+300, context);
        L = Math.sqrt(Math.pow(X-BX,2)+Math.pow(Y-BY,2)) ;
        if ( L > 0 ){ dPX = dPX/L*KdPX ; }
        if ( dPX < dPXmin ){ dPX = dPXmin ; }
      
        PX = PX + dPX ; PY = 0 ;      
        BX = X ; BY = Y ; X = PX ; Y = PY ;
        if ( PX > PXmax ){ Q = Qmax ; I = 1 ; }
      }
      
      if ( time - MLS > 20 && Qmax > 1 ) {
         Qmax = Qmax - 1;
      } else { 
        Qmax = Qmax + 1; 
      }
      
      MLS = time; 
    }
    
    if ( I > 0 ) {
      context.fillStyle = 'black';
      context.fillRect(-1,-1,901,601);
      I = I + 1 ;
      
      if ( I > 40 ){ 
        I = 0 ;  Tmax = Tmax + 0.5 ;
        PX = PXmin ; PY = 0 ; dPX = KdPX ; X = PX ; Y = PY ;
      }
    }
  };
};

canvasSketch(sketch, settings);
