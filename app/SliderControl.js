import React, { Component } from 'react';

class SliderControl extends Component {
  update(e){
  	//console.log(e.target.value);
  	this.props.update(e.target.value, this.props.groupIndex, this.props.controlIndex);
  }
  render() {
  	 

    return (
      <div className={"control-element"}>
       <h4>{this.props.info.label+": "+this.props.info.value}</h4>
       <input type="range" id="myRange" min={this.props.info.min} max={this.props.info.max}
       value={this.props.info.value} onChange={this.update.bind(this)}/>
      </div>
    );
  }
}

export default SliderControl;
