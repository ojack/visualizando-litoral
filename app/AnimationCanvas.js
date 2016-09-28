import Agent from './Agent.js';
import Settings from './settings.json';

class AnimationCanvas {
  constructor(canvId, settings, parent) {
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
    this.agents = [];
    this.currAgent = new Agent(this.ctx, this.settings);
    this.addEventListeners();
    this.mousePos = {x: 0, y: 0};
    this.render();
    this.isRecording = false;

    this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
    //var stream = this.canvas.captureStream(60); 
    // var mediaRecorder = new MediaRecorder(stream);
    // mediaRecorder.start();
  }

  addEventListeners(){
    this.canvas.onmousedown = function(e){
      this.currAgent = new Agent(this.ctx, this.settings);
      this.currAgent.isRecording = true;
      this.currAgent.addPoint(e.clientX-this.canvas.width/2, e.clientY-this.canvas.height/2);
      this.agents.push(this.currAgent);
      this.isDrawing = true;
    }.bind(this);

    this.canvas.onmousemove = function(e){
      this.mousePos = {x: e.clientX-this.canvas.width/2, y: e.clientY-this.canvas.height/2};
     
    }.bind(this);


    this.canvas.onmouseup = function(e){
      this.isDrawing = false;
      this.currAgent.isRecording = false;
    }.bind(this);

    // window.onresize = function(){
    //   this.canvas.width = window.innerWidth;
    //   this.canvas.height = window.innerHeight;
    // }.bind(this);

    window.onkeypress = function(e){
      var keyCode = e.keyCode || e.which;
      console.log(keyCode);
      switch(keyCode) {
        case 97: // add
          this.addAgent(this.mousePos);
          break;
        case 99: // clear
          this.agents = [];
          break;
        case 102: // f, remove first
          if(this.agents.length > 0) this.agents.splice(0, 1);
          break;
        case 100: // d, remove last
          if(this.agents.length > 0) this.agents.splice(this.agents.length-1, 1);
          break;
        case 114:
          if(this.isRecording ){
            
            this.stopRecording();
          } else {
            
            this.startRecording();
          }
          break;
        case 104: // h = hide controls
          this.parent.toggleControls();
          break;
        default:
          break;
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
    var agent = new Agent(this.ctx, this.settings);
    if(this.settings.synchro.value==0){
      agent.setPath(this.currAgent.points, this.currAgent.stepIndex);
    }else{
      agent.setPath(this.currAgent.points, 0);
    }
    agent.setOffset(pos);
    this.agents.push(agent);
  }

  render(){
    //console.log("rendering");
     if(this.isDrawing){
        this.currAgent.addPoint(this.mousePos.x, this.mousePos.y);
      }
    this.ctx.clearRect(-this.canvas.width/2, -this.canvas.height/2, this.canvas.width, this.canvas.height);
    for(var i = 0; i < this.agents.length; i++){
      this.agents[i].update();
      this.agents[i].draw();
    }
    window.requestAnimationFrame(this.render.bind(this));
  }
}

export default AnimationCanvas;
