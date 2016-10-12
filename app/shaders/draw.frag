//https://www.shadertoy.com/view/4dBSRK

#pragma glslify: import('./uniforms.glsl')

#pragma glslify: sdBox = require('glsl-sdf-primitives/sdBox')

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

vec2 squareFrame(vec2 screenSize, vec2 coord) {
  vec2 position = 2.0 * (coord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}


vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

float sdCircle(vec2 uv, vec2 origin, float radius)
{
    float d = length(uv - origin) - radius;
    return d;
}
// r^2 = x^2 + y^2
// r = sqrt(x^2 + y^2)
// r = length([x y])
// 0 = length([x y]) - r
float shape_circle(vec2 p) {
  return length(p) - 0.5;
}

// y = sin(5x + t) / 5
// 0 = sin(5x + t) / 5 - y
float shape_sine(vec2 p) {
  return p.y - sin(p.x * 5.0 + iGlobalTime) * 0.2;
}

float shape_box2d(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float shape_line(vec2 p, vec2 a, vec2 b) {
  vec2 dir = b - a;
  return abs(dot(normalize(vec2(dir.y, -dir.x)), a - p));
}

float shape_segment(vec2 p, vec2 a, vec2 b) {
  float d = shape_line(p, a, b);
  float d0 = dot(p - b, b - a);
  float d1 = dot(p - a, b - a);
  return d1 < 0.0 ? length(a - p) : d0 > 0.0 ? length(b - p) : d;
}

float shape_circles_smin(vec2 p, float t) {
  return smin(shape_circle(p - vec2(cos(t))), shape_circle(p + vec2(sin(t), 0)), 0.8);
}

vec3 draw_line(float d, float thickness) {
  const float aa = 3.0;
  return vec3(smoothstep(0.0, aa / iResolution.y, max(0.0, abs(d) - thickness)));
}

vec3 draw_line(float d) {
  return draw_line(d, 0.0025);
}

float draw_solid(float d) {
  return smoothstep(0.0, 3.0 / iResolution.y, max(0.0, d));
}

vec3 draw_polarity(float d, vec2 p) {
  p += iGlobalTime * -0.1 * sign(d) * vec2(0, 1);
  p = mod(p + 0.06125, 0.125) - 0.06125;
  float s = sign(d) * 0.5 + 0.5;
  float base = draw_solid(d);
  float neg = shape_box2d(p, vec2(0.045, 0.0085) * 0.5);
  float pos = shape_box2d(p, vec2(0.0085, 0.045) * 0.5);
  pos = min(pos, neg);
  float pol = mix(neg, pos, s);

  float amp = abs(base - draw_solid(pol)) - 0.9 * s;

  return vec3(1.0 - amp);
}

vec3 draw_distance(float d, vec2 p) {
  float t = clamp(d * 0.85, 0.0, 1.0);
  vec3 grad = mix(vec3(1, 0.8, 0.5), vec3(0.3, 0.8, 1), t);

  float d0 = abs(1.0 - draw_line(mod(d + 0.1, 0.2) - 0.1).x);
  float d1 = abs(1.0 - draw_line(mod(d + 0.025, 0.05) - 0.025).x);
  float d2 = abs(1.0 - draw_line(d).x);
  vec3 rim = vec3(max(d2 * 0.85, max(d0 * 0.25, d1 * 0.06125)));

  grad -= rim;
  grad -= mix(vec3(0.05, 0.35, 0.35), vec3(0.0), draw_solid(d));

  return grad;
}

float shape(vec2 p){
  return shape_circles_smin(p, iGlobalTime * 0.5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float t = iGlobalTime * 0.5;
  vec2 uv = squareFrame(iResolution.xy, fragCoord);
  float d;
 
  vec2 ro = vec2(iMouse.xy / iResolution.xy)*vec2(2.0, -2.0);
  //ro = squareFrame(iResolution.xy, ro);

  //vec2 rd = normalize(-ro);

  float circle = sdCircle(uv, ro, 0.2);
  float circle2 = shape_circle(uv);
 // d = shape(uv);
  d = smin(shape_circle(uv - vec2(cos(t))), circle, 0.8);
  
   // vec3 col = draw_distance(d, uv.xy);
     
 // vec3 col = draw_distance(circle2, uv);
  fragColor.rgb = vec3(1.0) - draw_distance(d, uv);
  fragColor.a   = 1.0;
}

#pragma glslify: import('./render.glsl')