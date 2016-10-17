//https://www.shadertoy.com/view/4dBSRK

#pragma glslify: import('./uniforms.glsl')

#pragma glslify: import('./sdRender2D/coordinates.glsl')

#pragma glslify: import('./sdRender2D/render.glsl')

#pragma glslify: sdCircle = require('./sdPrimitives2D/sdCircle')



void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  float t = iGlobalTime * 0.5;
  vec2 uv = squareFrame(iResolution.xy, fragCoord);

 float d;
 
  float circle0 = sdCircle(uv, mouseToScreen(agent0.xy, iResolution.xy), agent0.z/900.0);
  float circle1 = sdCircle(uv, mouseToScreen(agent1.xy, iResolution.xy), agent1.z/900.0);
  float circle2 = sdCircle(uv, mouseToScreen(agent2.xy, iResolution.xy), agent2.z/900.0);
  float circle3 = sdCircle(uv, mouseToScreen(agent3.xy, iResolution.xy), agent3.z/900.0);

  d = smin(circle0, circle1, 0.4);
  d = smin(d, circle2, 0.4);
   // vec3 col = draw_distance(d, uv.xy);
     
 // vec3 col = draw_distance(circle2, uv);
  fragColor.rgb = vec3(1.0) - draw_distance(smin(d, circle3, 0.4), uv);

  // fragColor.rgb = vec3(1.0) - draw_distance(circle0, uv);
  fragColor.a   = 1.0;
}

#pragma glslify: import('./render.glsl')