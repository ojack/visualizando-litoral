//https://www.shadertoy.com/view/4dBSRK

//https://www.shadertoy.com/view/4dl3zn

#define PI 3.14159265359

precision highp float;
#define GLSLIFY 1

uniform vec3 iResolution;
uniform vec3 iMouse;
uniform sampler2D iChannel0;
uniform float iGlobalTime;

uniform vec4 agent0;
uniform vec4 agent1;
uniform vec4 agent2;
uniform vec4 agent3;
uniform vec4 agent4;
uniform vec4 agent5;
uniform vec4 agent6;
uniform vec4 agent7;
uniform vec4 agent8;
uniform vec4 agent9;

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

vec3 draw_line(float d, float thickness) {
  const float aa = 3.0;
  return vec3(smoothstep(0.0, aa / iResolution.y, max(0.0, abs(d) - thickness)));
}

vec3 draw_line(float d) {
  return draw_line(d, 0.0015);
}

float draw_solid(float d) {
  return smoothstep(0.0, 3.0 / iResolution.y, max(0.0, d));
}

vec3 draw_distance(float d, vec2 p) {
  float t = clamp(d * 0.85, 0.0, 1.0);
  //vec3 grad = mix(vec3(1, 0.8, 0.5), vec3(0.3, 0.8, 1), t);
	vec3 grad = vec3(0.0, 0.0, 0.0);
  float d0 = abs(1.0 - draw_line(mod(d + 0.1, 0.0002) - 0.1).x);
  float d1 = abs(1.0 - draw_line(mod(d + 0.0025, 0.05) - 0.025).x);
  float d2 = abs(1.0 - draw_line(d).x);
  vec3 rim = vec3(max(d2 , max(d0, d1)));
	//vec3 rim = d2;
  grad += rim;
  //grad += mix(vec3(0.05, 0.35, 0.35), vec3(0.0), draw_solid(d));

  return grad;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float circle(vec2 uv, vec2 origin, float radius)
{
    float d = length(uv - origin) - radius;
    return d;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float t = iGlobalTime * 0.5;
  vec2 uv = squareFrame(iResolution.xy, fragCoord);

 float d;
 
  float circle0 = circle(uv, mouseToScreen(agent0.xy, iResolution.xy), agent0.z/900.0);
  float circle1 = circle(uv, mouseToScreen(agent1.xy, iResolution.xy), agent1.z/900.0);
  float circle2 = circle(uv, mouseToScreen(agent2.xy, iResolution.xy), agent2.z/900.0);
  float circle3 = circle(uv, mouseToScreen(agent3.xy, iResolution.xy), agent3.z/900.0);

  d = smin(circle0, circle1, 0.4);
  d = smin(d, circle2, 0.4);
   // vec3 col = draw_distance(d, uv.xy);
     
 // vec3 col = draw_distance(circle2, uv);
  fragColor.rgb = draw_distance(smin(d, circle3, 0.4), uv);

  // fragColor.rgb = vec3(1.0) - draw_distance(circle0, uv);
  fragColor.a   = 1.0;
}

void main() {
  
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 uv = gl_FragCoord.xy;
  mainImage(gl_FragColor, uv);
}
