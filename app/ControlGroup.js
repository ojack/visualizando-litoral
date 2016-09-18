import React, { Component } from 'react';
import SelectControl from './SelectControl.js';
import SliderControl from './SliderControl.js';
import ColorPalette from './ColorPalette.js';

class ControlGroup extends Component {
  render() {
  	 var controls = this.props.info.controls.map(function(obj, ind){
  	 	if(obj.type=="select"){
  	 		return <SelectControl {...this.props} controlIndex={ind} info={obj} />
  	 	} else if(obj.type=="slider"){
  	 		return <SliderControl {...this.props} controlIndex={ind} info={obj} />
  	 	} else if(obj.type=="color"){
        return <ColorPalette {...this.props} controlIndex={ind} info={obj} />
      }
  	 }.bind(this));

    return (
      <div className="control-group">
       <h3>{this.props.info.label}</h3>
       {controls}
      </div>
    );
  }
}

export default ControlGroup;
