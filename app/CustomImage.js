import React, { Component } from 'react';
var Dropzone = require('react-dropzone');

class CustomImage extends Component {
  onDrop(files) {
    console.log(this);
    console.log('Received files: ', files);
    files.map(function(file){
        var reader = new FileReader();
      reader.onload = function(event){
          var img = new Image();
          img.onload = function(){
             
              this.props.setCanvas(img);
          }.bind(this);
          img.src = event.target.result;
      }.bind(this);
      reader.readAsDataURL(file);   
    }.bind(this));
    //  var reader = new FileReader();
    // reader.onload = function(event){
    //     var img = new Image();
    //     img.onload = function(){
           
    //         this.props.setCanvas(img);
    //     }.bind(this);
    //     img.src = event.target.result;
    // }.bind(this);
    // reader.readAsDataURL(files[0]);   
  }

  render() {
    var w = 60;
    var h = 60;
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
      height: "100%",
      color: "#fff"
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
        var iconStyle = {
          fontSize: "40px",
          margin: "10px"
        }
      return (
       
        <div style={style}>
         
          <div style={canvasStyle}><Dropzone style={dropStyle} activeStyle={activeStyle} onDrop={this.onDrop.bind(this)} disableClick={true}>
                <i style={iconStyle} className="fa fa-file-image-o"></i>
              </Dropzone></div>
           
        </div>
      );
  } 
}

export default CustomImage;
