var triangle = require('a-big-triangle')
import Settings from './settings.json';
var createShader = require('gl-shader')
var glslify = require('glslify')
var loop = require('raf-loop')

var shaderProgs = [];
shaderProgs[0] = glslify('./shaders/draw.frag');
shaderProgs[1] = glslify('./shaders/eyes.frag');
shaderProgs[2] = glslify('./shaders/grid.frag');
shaderProgs[3] = glslify('./shaders/paper.frag');
shaderProgs[4] = glslify('./shaders/sinwaves.frag');
shaderProgs[5] = glslify('./shaders/voronoi.frag');


var gl, shader, time;

class WebGL {
  constructor(w, h) {
    this.mouse = [0.0, 0.0, 0.0];
    time = Date.now()/1000;
    this.shaderIndex = 0;

    gl = require('webgl-context')({
      width: w,
      height: h
    });

    document.body.appendChild(gl.canvas);
    this.shaderIndex = 0;
  // this.shaderProgs = [];
  /*  for(var i = 0; i < shaders.length; i++){
      var s = createShader(gl, glslify('./shaders/waves.vert'), glslify('./shaders/'+shaders[i]+'.frag'));
      this.shaderProgs.push(s);
    }
    shader = this.shaderProgs[this.shaderIndex];*/
    var s = shaderProgs[this.shaderIndex];
    console.log(s);
    shader = createShader(gl, glslify('./shaders/waves.vert'), s);
    shader.bind()
    shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight, 0]
    shader.uniforms.iGlobalTime = time
    shader.uniforms.iChannel0 = 0
    

   //` loop(this.render).start();
  }
  
  updatePoints(pt){
    if(pt){
      this.mouse = [pt.x, pt.y, 0.0];
      console.log(this.mouse);
    }
  }

  loadShader(){
    console.log("loading shader");
    //console.log(glslify('./shaders/sinwaves.frag'));
      shader = createShader(gl, glslify('./shaders/waves.vert'), shaderProgs[this.shaderIndex]);
      this.shaderIndex++;
      if(this.shaderIndex >= shaderProgs.length){
        this.shaderIndex = 0;
      }
   // shader = createShader(gl, glslify('./shaders/waves.vert'), glslify('./shaders/waves2.frag'));
    //this.render();
  }

  render(dt){
    var t = (Date.now()/1000-time);
   // console.log(t);
    var width = gl.drawingBufferWidth
    var height = gl.drawingBufferHeight
    gl.viewport(0, 0, width, height)

    shader.bind()
    shader.uniforms.iGlobalTime = t;
    shader.uniforms.iMouse = this.mouse;
    shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight, 0]
    triangle(gl)
  }
  
}



export default WebGL;
