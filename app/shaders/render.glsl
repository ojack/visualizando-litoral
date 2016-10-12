void main() {
  
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 uv = gl_FragCoord.xy;
  mainImage(gl_FragColor, uv);
}
