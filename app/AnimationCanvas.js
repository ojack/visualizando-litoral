import Agent from './Agent.js';
import Settings from './settings.json';
import WebGL from './WebGL.js';
//import live from 'glslify-live';

class AnimationCanvas {
  constructor(canvId, settings, parent) {

    this.webGL = new WebGL(Settings.size.w, Settings.size.h);
    this.parent = parent;
    this.settings = settings;
    this.canvas = document.getElementById(canvId);
   // this.canvas.width = window.innerWidth;
   this.canvas.width = Settings.size.w;
   this.canvas.height = Settings.size.h;
   // this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');

    this.isDrawing = false;
    this.ctx.fillStyle = "#fff";
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.agents = [];
    this.currPath = [];
    console.log(this.settings);
    for(var i = 0; i < this.settings.track.value.length; i++){
      var agentsPerTrack = [];
      this.agents.push(agentsPerTrack);
    }
    this.currAgent = new Agent(this.ctx, this.settings);
    this.addEventListeners();
    this.mousePos = {x: 0, y: 0};
    this.render();
    this.isRecording = false;
    this.keysDown = [];
    this.ctx.translate(this.canvas.width/2, this.canvas.height/2);

    // live.on('update', function(filename, id) {
    //   console.log(filename);
    //   this.webGL.render();
    // });
    //var stream = this.canvas.captureStream(60); 
    // var mediaRecorder = new MediaRecorder(stream);
    // mediaRecorder.start();
  }

  addEventListeners(){
    this.canvas.onmousedown = function(e){
      this.currAgent = new Agent(this.ctx, this.settings);
      this.currAgent.isRecording = true;
      this.currAgent.addPoint(e.clientX-this.canvas.width/2, e.clientY-this.canvas.height/2, this.settings.size.value);
      this.agents[this.settings.track.recording].push(this.currAgent);
      this.isDrawing = true;
    }.bind(this);

    this.canvas.onmousemove = function(e){
      this.mousePos = {x: e.clientX-this.canvas.width/2, y: e.clientY-this.canvas.height/2};
     
    }.bind(this);


    this.canvas.onmouseup = function(e){
      this.isDrawing = false;
      this.currAgent.isRecording = false;
      this.currPath = this.currAgent.points.slice();
     // console.log("mouse up", JSON.stringify(this.currAgent.points));
    }.bind(this);

    // window.onresize = function(){
    //   this.canvas.width = window.innerWidth;
    //   this.canvas.height = window.innerHeight;
    // }.bind(this);

    window.onkeydown = function(e){
      var keyCode = e.keyCode || e.which;
      console.log(e);
      switch(keyCode) {
        case 65: // add, key a
          this.addAgent(this.mousePos);
          break;
        case 67: // clear
          this.agents[this.settings.track.recording] = [];
          break;
        case 102: // f, remove first
          if(this.agents[this.settings.track.recording].length > 0) this.agents[this.settings.track.recording].splice(0, 1);
          break;
        case 100: // d, remove last
          if(this.agents[this.settings.track.recording].length > 0) this.agents[this.settings.track.recording].splice(this.agents[this.settings.track.recording].length-1, 1);
          break;
        case 82:
          if(this.isRecording ){
            
            this.stopRecording();
          } else {
            
            this.startRecording();
          }
          break;
        case 83: //'s' shader
          this.webGL.loadShader();
          break;
        case 72: // h = hide controls
          this.parent.toggleControls();
          break;
        default:
          break;
     }
     if(this.keysDown.indexOf(keyCode) < 0){
        this.keysDown.push(keyCode);
        this.parent.setKeysDown(this.keysDown);
     }

    }.bind(this);
    window.onkeyup = function(e){
      console.log(this.keysDown);
      var keyCode = e.keyCode || e.which;
      if(this.keysDown.indexOf(keyCode) > -1){
        this.keysDown.splice(this.keysDown.indexOf(keyCode), 1);
        this.parent.setKeysDown(this.keysDown);
      }
   }.bind(this);
  }

  startRecording(){
    console.log("starting to record");
    this.isRecording = true;
    this.recordedBlobs = [];
    var stream = this.canvas.captureStream(60); 
    this.mediaRecorder = new MediaRecorder(stream);
  //  this.mediaRecorder.onstop = this.handleStop;
    this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
    this.mediaRecorder.start(10);
    this.canvas.className = "recording";
  }

  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }

  stopRecording(){
    console.log("stopping record");
    this.mediaRecorder.stop();
    this.isRecording = false;
    //console.log('Recorded Blobs: ', this.recordedBlobs);
    this.download();
    this.canvas.className = "";
  }

  download() {
    var blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    var date = new Date();

    a.download = "litoral-"+date.getDate()+"-"+date.getDate()+"-"+date.getHours()+"-"+date.getMinutes()+'.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    this.recordedBlobs = [];
    this.mediaRecorder = null;
  }

  addAgent(pos){
    console.log("add agent", this.currPath);
    var agent = new Agent(this.ctx, this.settings);
    if(this.settings.synchro.value==0){
     // agent.setPath(this.currAgent.points, this.currAgent.stepIndex);
      agent.setPath(this.currPath.slice(), this.currAgent.stepIndex)
    }else{
      agent.setPath(this.currPath.slice(), 0);
    }
    agent.setOffset(pos);
    this.agents[this.settings.track.recording].push(agent);
  }

  render(){
    //console.log("rendering");
    
     if(this.isDrawing){
        this.currAgent.addPoint(this.mousePos.x, this.mousePos.y, this.settings.size.value);
      }
    this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);
   
    for(var i = 0; i < this.agents.length; i++){
      if(this.settings.track.value[i]==true){
        for(var j = 0; j < this.agents[i].length; j++){
          this.agents[i][j].update();
          this.agents[i][j].draw();
        }
      }
    }
    this.webGL.updatePoints(this.currAgent.currPt());
    this.webGL.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default AnimationCanvas;
