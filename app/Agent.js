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
         // console.log(" point offset", this.points[this.points.length-1]);
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
      if(this.shape==0){ // if line, different update
        this.points = Path.addNextPoint(this.points);
      } else {
        this.stepIndex++;
        if(this.stepIndex >= this.points.length){
          this.restartAnimation();
        }
      }
    }
  
    
  }

  draw(){
    if(this.points.length > 0){
      this.ctx.fillStyle = this.color;
       this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size/5;
      var currPt = this.points[this.stepIndex];
      this.ctx.save();
     
      switch(this.shape) {
        case 0:
            this.ctx.beginPath();
            this.ctx.moveTo(this.points[0].x, this.points[0].y);
            for(var i = 1; i < this.points.length; i++){
              this.ctx.lineTo(this.points[i].x, this.points[i].y);
            }
            this.ctx.stroke();
            break;
        case 1:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.beginPath();
            this.ctx.arc(0, 0,this.size/2,50,0,2*Math.PI);
            this.ctx.fill();
            break;
        case 2:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.fillRect(-this.size/2, -this.size/2,this.size, this.size);
            break;
      } 
      
      this.ctx.restore();
    }
  }
}

export default Agent;
