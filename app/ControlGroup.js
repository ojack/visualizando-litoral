import React, { Component } from 'react';
import SelectControl from './SelectControl.js';
import MultiSelect from './MultiSelect.js';
import SliderControl from './SliderControl.js';
import ColorPalette from './ColorPalette.js';
import CustomImage from './CustomImage.js';

class ControlGroup extends Component {
  render() {
  	 var controls = this.props.info.controls.map(function(obj, ind){
  	 	if(obj.type=="select"){
        // console.log("rendering select");
  	 		return <SelectControl {...this.props} controlIndex={ind} info={obj} images={this.props.images}/>
  	 	} else if(obj.type=="slider"){
  	 		return <SliderControl {...this.props} controlIndex={ind} info={obj} midi={this.props.midi}/>
  	 	} else if(obj.type=="color"){
       // return null;
        return <ColorPalette {...this.props} controlIndex={ind} info={obj} />
      } else if(obj.type=="multi-select"){
        //console.log("rendering multi");
        return <MultiSelect {...this.props} controlIndex={ind} info={obj} />
      } else if(obj.type=="custom-image"){
        return <CustomImage setCanvas={this.props.setCanvas}/>
      } else if(obj.type=="spacer"){
        return<div style={{width: obj.width, height: obj.height, display: "inline-block"}}></div>;
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
