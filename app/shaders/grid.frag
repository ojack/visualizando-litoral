//https://www.shadertoy.com/view/4dBSRK

#pragma glslify: import('./uniforms.glsl')

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2  px = 4.0*(-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;
    
    float id = 0.5 + 0.5*cos(iGlobalTime + sin(dot(floor(px+0.5),vec2(113.1,17.81)))*43758.545);
    
    vec3  co = 0.5 + 0.5*cos(iGlobalTime + 3.5*id + vec3(0.0,1.57,3.14) );
    
    vec2  pa = smoothstep( 0.0, 0.2, id*(0.5 + 0.5*cos(6.2831*px)) );
    
    fragColor = vec4( co*pa.x*pa.y, 1.0 );
}


void main() {
  
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 uv = gl_FragCoord.xy;
  mainImage(gl_FragColor, uv);
}