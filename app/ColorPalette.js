"use strict";

import React, { Component } from 'react';
import ColorPicker from 'coloreact';


class ColorPalette extends Component {
  
  render(){
    var style = {
      position: "relative",
      width: "150px",
      height: "150px",
      display: "inline-block"
    }
    return (
      <div style = {style}>
         <ColorPicker
      opacity={true}
      color={this.props.info.value.rgbString}
      onChange={this.showColor.bind(this)}
       /> 
       </div>);
   
  }

  showColor(color) {
      console.log(color);
      console.log(this);
      this.props.update(color, this.props.groupIndex, this.props.controlIndex, "value");
     // this.setState({color: color});
  }
}

export default ColorPalette;
