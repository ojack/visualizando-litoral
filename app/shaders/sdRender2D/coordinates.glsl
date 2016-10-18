vec2 squareFrame(vec2 screenSize, vec2 coord) {
  vec2 position = 2.0 * (coord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}

vec2 mouseToScreen(vec2 m, vec2 res){
  vec2 n = (m.xy / res.xy)* 2.0;
  n.x *= (res.x / res.y);
  n.y *= -1.0;
  return n;
}