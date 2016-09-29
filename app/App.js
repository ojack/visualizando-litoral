import React, { Component } from 'react';
import Controls from './Controls.js';
import AnimationCanvas from './AnimationCanvas.js';
import Midi from './Midi.js';
import options from './options.json';

//import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    
    
    this.state = {options: options, showControls: true, keysDown: []};

    var settings = {};
    for(var i = 0; i < this.state.options.length; i++){
      var group = this.state.options[i].controls;
      for(var j = 0; j < group.length; j++){
        settings[group[j].name] = group[j];
      }
    }
    this.settings = settings;
  }

  componentDidMount(){
    this.anim = new AnimationCanvas("draw", this.settings, this);
    this.midi = new Midi();
    this.setState({midi: this.midi});
  }
  
  toggleControls(){
    console.log("togglinh controls");
    this.setState({showControls: this.state.showControls ? false: true});
  }

  setKeysDown(keys){
    this.setState({keysDown: keys});
  }

  update(newValue, groupIndex, controlIndex, propertyName){
    var newOptions = this.state.options;
    newOptions[groupIndex].controls[controlIndex][propertyName] = newValue;
    this.setState({options: newOptions});
  }

  

  render() {
    var style = {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%"
    };
    var controls = [];
    if(this.state.showControls){
      controls = <Controls update={this.update.bind(this)} midi={this.state.midi} keysDown={this.state.keysDown} options={this.state.options}/>
    }
    return <div style={style}>
      <canvas id="draw"></canvas>
      {controls}
    </div>;
  }
}

export default App;
