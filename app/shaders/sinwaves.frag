//https://www.shadertoy.com/view/XdyXz3#

#pragma glslify: import('./uniforms.glsl')

#define M_PI 3.1415926535897932384626433832795

const int waves = 40; //LAGGING? LOWER THIS VALUE TO LIKE 40 OR SOMETHING
const float wl = 15.0;
const float rs = 0.002;
const float speed = -0.01;
const float twist = 0.1;
const float bpm = 128.0 / 2.0;


float saw(float s){
    return mod(s,1.0);
}

float tri(float s){
    return asin(sin(s));
}

float sqr(float s){
    return sin(s)/abs(sin(s));
}

float wave( float angle, float phase, vec2 pos, float wavelength) {
  //if ( abs(2.0*M_PI/wavelength*(pos.x * cos(angle) - pos.y * sin(angle))) < sqrt(sqrt(.01+pos.y*pos.y + pos.x*pos.x))) {
  //  return -1000.0; 
  //}
  return .5+.5*sin(2.0*M_PI/wavelength*(phase + abs(pos.x * cos(angle) - pos.y * sin(angle))));
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

  vec2 center = vec2(.5*iResolution.x/iResolution.y,.5);
  
  vec2 position = ( fragCoord.xy / iResolution.xy );
  position -=  vec2(.5, .5);
  //position +=  -1.0 * iMouse.xy / iResolution.xy;
  position.x *= iResolution.x/iResolution.y;
  float color = 0.0;
    
    position *= vec2(2.0, 2.0);
    
    float t = 15.0*iGlobalTime;//*100.0 - mod(iGlobalTime,60.0/bpm) * 99.0;
    
    float ex = 1.5 + .5*sin(.1*t);
  for (int i = 1; i < waves; i+=1) {
    color += wave(twist * float(i) + rs * t * float(i), speed * t * float(1), position, wl/(pow(float(i),2.0)))/pow(float(i),1.0);
  }
  //if(color < 0.0) {
  //  color /= 3.0; 
  //}
  
    color = pow(2.0,color);
    t = t*.1;
    
    fragColor = vec4(.5+.5*sin(color+4.0*sin(t*.1)),
                     .5+.5*sin(color+3.0*sin(t*.11)),
                     .5+.5*sin(color+2.0*sin(t*.111)),
                     1.0);
    
  //fragColor = vec4( vec3(sqrt(.6*sin(color*1.1)*sin(t/2.0) + .4*sin(color*1.2)*sin(t/7.0)), 
  //        sqrt(.6*sin(color*1.3)*sin(t/3.0) + .4*sin(color*1.4)*sin(t/11.0)), 
  //        sqrt(.6*sin(color*1.5)*sin(t/5.0) + .4*sin(color*1.6)*sin(t/13.0) )), 1.0 );
}




void main() {
  
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  vec2 uv = gl_FragCoord.xy;
  mainImage(gl_FragColor, uv);
}