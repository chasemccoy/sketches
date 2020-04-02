export const star = (x, y, r, n, inset) => {
  return context => {
    context.save();
    context.beginPath();
    context.translate(x, y);
    context.moveTo(0,0-r);
    for (var i = 0; i < n; i++) {
      context.rotate(Math.PI / n);
      context.lineTo(0, 0 - (r + inset));
      context.rotate(Math.PI / n);
      context.lineTo(0, 0 - r);
    }
    context.closePath();
    context.restore();
  }
}