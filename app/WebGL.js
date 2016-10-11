var triangle = require('a-big-triangle')
var createShader = require('gl-shader')
var glslify = require('glslify')
var loop = require('raf-loop')

var gl, shader, time;

class WebGL {
  constructor(w, h) {
    time = Date.now();

    gl = require('webgl-context')({
      width: w,
      height: h
    });

    document.body.appendChild(gl.canvas);
   
    shader = createShader(gl, glslify('./shaders/waves.vert'), glslify('./shaders/waves.frag'));
    shader.bind()
    shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight, 0]
    shader.uniforms.iGlobalTime = time
    shader.uniforms.iChannel0 = 0
    

   //` loop(this.render).start();
  }
  
  render(dt){

    var width = gl.drawingBufferWidth
    var height = gl.drawingBufferHeight
    gl.viewport(0, 0, width, height)

    shader.bind()
    shader.uniforms.iGlobalTime = Date.now()-time;
    triangle(gl)
  }
  
}

export default WebGL;
