import Path from './Path.js';

class Agent {
  constructor(ctx, settings) {
    this.points = [];
    this.stepIndex = 0;
    this.ctx = ctx;
   // this.image = settings.canvas;
    this.isRecording = false;
    this.size = settings.size.value;
    this.length = settings.length.value;
    this.repeat = settings.repeat.value;
    this.coordType = settings.coordType.value;
    var c = settings.color.value;
    this.color = "rgba("+c.r + "," + c.g + "," + c.b + "," + c.a + ")";
    this.shape = settings.shape.value;
    if(this.shape > 2){
      this.image = document.getElementById("c"+ this.shape)
    }
    console.log("IMAGE", this.image);
    //console.log("REPEAT", this.repeat);
  }

  addPoint(x, y, size){
    var pt = {x: x, y: y, size: size};
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
      this.points = Path.calculateOffset(this.points, point, this.stepIndex, true);
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
          //this.setOffset(this.points[this.points.length-1]);
          this.points = Path.calculateOffset(this.points, this.points[this.points.length-1], this.stepIndex, true);
         // console.log(this.points);
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

  currPt(){
    var pt = this.points[this.stepIndex];
    return [pt.x, pt.y, pt.size, this.shape];
  }

  draw(){
    if(this.points.length > 0){
      this.ctx.fillStyle = this.color;
       this.ctx.strokeStyle = this.color;
       
      var currPt = this.points[this.stepIndex];
      this.ctx.save();
     
      switch(this.shape) {
        case 0:
           var toDraw;
           if(this.isRecording){
            toDraw = this.points.length-1;
           } else {
            toDraw = Math.min(this.length, this.points.length-1);
          }
            for(var i = 0; i < toDraw; i++){
               this.ctx.beginPath();
              this.ctx.moveTo(this.points[i].x, this.points[i].y);
              this.ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
              this.ctx.lineWidth = this.points[i].size/2;
              this.ctx.stroke();
            }
            
            break;
        case 1:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.beginPath();
            //this.ctx.arc(0, 0,this.size/2,50,0,2*Math.PI);
            this.ctx.arc(0, 0,currPt.size/2,50,0,2*Math.PI);
            this.ctx.fill();
            break;
        case 2:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.fillRect(-currPt.size/2, -currPt.size/2,currPt.size, currPt.size);
            break;
        default:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.drawImage(this.image, -currPt.size/2, -currPt.size/2,currPt.size, currPt.size);
      } 
      
      this.ctx.restore();
    }
  }
}

export default Agent;
