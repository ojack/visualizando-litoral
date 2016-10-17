import React, { Component } from 'react';
var Dropzone = require('react-dropzone');

class CustomImage extends Component {
  onDrop(files) {
    console.log(this);
    console.log('Received files: ', files);
     var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            console.log(this);
            this.canvas.width = 400;
            this.canvas.height = 300;
            this.ctx = this.canvas.getContext('2d');
            this.ctx.drawImage(img,0,0, this.canvas.width, this.canvas.height);
        }.bind(this);
        img.src = event.target.result;
    }.bind(this);
    reader.readAsDataURL(files[0]);   
  }

  render() {
    var w = 40;
    var h = 40;
    var style = {
      position: "relative",
       width: w,
      height: h,
      display: "inline-block"
    };

     var canvasStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    };
       var dropStyle = {
           width: w,
          height: h,
          border: "1px dotted #fff",
          color: "#666"
        };
        var activeStyle = {
          width: w,
          height: h,
          backgroundColor: "#fff"
        };

      return (
       
        <div style={style}>
          <canvas style={canvasStyle} key="preview-canvas" ref={function(canvas) {
              console.log(canvas);
              console.log(this);
              this.canvas = canvas;
             this.props.setCanvas(canvas);
            }.bind(this)}></canvas>
          <div style={canvasStyle}><Dropzone style={dropStyle} activeStyle={activeStyle} onDrop={this.onDrop.bind(this)} disableClick={true}>
                <div></div>
              </Dropzone></div>
           
        </div>
      );
  } 
}

export default CustomImage;
