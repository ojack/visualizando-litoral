import Path from './Path.js';

class Agent {
  constructor(ctx, settings) {
    this.points = [];
    this.stepIndex = 0;
    this.ctx = ctx;
    this.isRecording = false;
    this.size = settings.size.value;
    this.repeat = settings.repeat.value;
    this.coordType = settings.coordType.value;
    this.color = settings.color.value.rgbString;
    this.shape = settings.shape.value;
    console.log("REPEAT", this.repeat);
  }

  addPoint(x, y){
    var pt = {x: x, y: y};
    var polar = Path.toPolar(pt);
    pt.theta = polar.theta;
    pt.r = polar.r;
   this.points.push(pt);
  }

  setPath(points, index){
    this.points = points;
    this.stepIndex = index;
  }
  
  setOffset(point){
    if(this.coordType==0){
      this.points = Path.calculateOffset(this.points, point, this.stepIndex);
    } else {
      this.points = Path.calculatePolarOffset(this.points, point, this.stepIndex);
    }
    
   
   // this.points = Path.calculatePolarOffset(this.points, point, this.stepIndex);
    
  }

  restartAnimation(){
    this.stepIndex = 0;
    switch(this.repeat) {
      case 1:
          console.log(" point offset", this.points[this.points.length-1]);
          this.setOffset(this.points[this.points.length-1]);
          break;
      case 2:
          this.points = Path.reverse(this.points);
          break;
      default:
          break;
    } 
  }

  update(){
    if(this.isRecording){
      this.stepIndex = this.points.length - 1;
    } else {
      this.stepIndex++;
      if(this.stepIndex >= this.points.length){
        this.restartAnimation();
      }
    }
   
   
  }

  draw(){
    if(this.points.length > 0){
      this.ctx.fillStyle = this.color;
      var currPt = this.points[this.stepIndex];
      this.ctx.fillRect(currPt.x-this.size/2,currPt.y-this.size/2,this.size, this.size);
    }
  }
}

export default Agent;
