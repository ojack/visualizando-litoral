import React, { Component } from 'react';


class SliderControl extends Component {
  update(e){
  	//console.log(e.target.value);
  	this.props.update(e.target.value, this.props.groupIndex, this.props.controlIndex, "value");
  }

  updateFromMidi(val){
    console.log("MIDI UPDATE", val, this);
    var scaledVal = ~~((val+ this.props.info.min) * (this.props.info.max - this.props.info.min) / 127)-1;
    this.props.update(scaledVal, this.props.groupIndex, this.props.controlIndex, "value");
  }

  componentDidMount(){

  }

  render() {
  	 console.log("midi channel", this.props.midi);
    if("midiChannel" in this.props.info && this.props.midi){
        
        this.props.midi.setChannel(this.props.info.midiChannel, this, this.updateFromMidi);
     }

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
