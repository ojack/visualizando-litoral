import Settings from './settings.json';
import Editor from 'glsl-editor';
import FileSaver from 'file-saver';

require('glsl-editor/css')
require('glsl-editor/theme')

var triangle = require('a-big-triangle')

var createShader = require('gl-shader')
var glslify = require('glslify')
var loop = require('raf-loop')

var shaderProgs = [];
//shaderProgs[0] = glslify('./shaders/solid.frag');
//shaderProgs[1] = glslify('./shaders/blackandwhite.frag');
shaderProgs[0] = glslify('./shaders/test.frag');
shaderProgs[1] = glslify('./shaders/squircle.frag');
shaderProgs[2] = glslify('./shaders/blackandwhite.frag');
shaderProgs[3] = glslify('./shaders/draw.frag');
shaderProgs[4] = glslify('./shaders/eyes.frag');
shaderProgs[5] = glslify('./shaders/grid.frag');
shaderProgs[6] = glslify('./shaders/paper.frag');
shaderProgs[7] = glslify('./shaders/sinwaves.frag');
shaderProgs[8] = glslify('./shaders/voronoi.frag');


var gl, shader, time;

var vert = glslify('./shaders/waves.vert');

class WebGL {
  constructor(w, h) {
   

    this.mouse = [0.0, 0.0, 0.0];
    time = Date.now()/1000;
    this.shaderIndex = 0;

    this.agentPoints = [];
    for(var i = 0; i < 10; i++){
      this.agentPoints[i] = [0.0, 0.0, 0.0, 0.0];
    }
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
    shader = createShader(gl, vert, s);
    shader.bind()
    shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight, 0]
    shader.uniforms.iGlobalTime = time
    shader.uniforms.iChannel0 = 0
    
    
    this.addEditor();
   //` loop(this.render).start();
  }
  
  addEditor(){
   var div = document.createElement("div");
   div.style.position = "fixed";
   div.style.top = 0;
   div.style.right = 0;
   div.style.width = "50%";
   div.style.height = "100%";
   div.style.display = "none";
   document.body.appendChild(div);

   this.editorDiv = div;
    var editor = Editor({value: shaderProgs[0], container: div});
    editor.wrap.style.position = 'absolute'
    editor.wrap.style.bottom = 0
    editor.wrap.style.right = '0%'
    editor.wrap.style.left = 0
    editor.wrap.style.top = 0

    var load = document.createElement("div");
    load.className = "control-button";
    load.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
    load.style.position = "absolute";
    load.style.top = "0px";
    load.style.left = "-40px";
    div.appendChild(load);

    load.onclick = function(){
      console.log(editor.getValue());
      this.updateShader(editor.getValue());
    }.bind(this);

    var dl = document.createElement("div");
    dl.className = "control-button";
    dl.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>';
    dl.style.position = "absolute";
    dl.style.top = "40px";
    dl.style.left = "-40px";
    div.appendChild(dl);
    dl.onclick = function(){
      var blob = new Blob([editor.getValue()], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "hey.frag", true);
    }.bind(this);
    this.editor = editor;
  }

  toggleEditor(){
    this.editorDiv.style.display = this.editorDiv.style.display == 'none' ? 'block' : 'none';
    this.editor.resize();
  }
  updateShader(src){
    shader.update(vert, src);
   
  }

  updatePoints(pts){
    this.agentPoints = pts;

    //console.log(pts);
  }

  loadShader(){
    console.log("loading shader");
     var s = shaderProgs[this.shaderIndex];
   // console.log(s);
    //console.log(glslify('./shaders/sinwaves.frag'));
      shader = createShader(gl, vert, s);
      this.editor.setValue(s);
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
    //shader.uniforms.iMouse = this.mouse;
    for(var i = 0; i < this.agentPoints.length; i++){
      shader.uniforms["agent"+i]=this.agentPoints[i];
    }
    shader.uniforms.iResolution = [gl.drawingBufferWidth, gl.drawingBufferHeight, 0]
    triangle(gl)
  }
  
}



export default WebGL;
