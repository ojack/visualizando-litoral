import React, { Component } from 'react';
import Controls from './Controls.js';
import AnimationCanvas from './AnimationCanvas.js';
import options from './options.json';

//import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    
    this.state = {options: options, showControls: true};

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
    this.anim = new AnimationCanvas("draw", this.settings);
  }
  
  update(newValue, groupIndex, controlIndex){
    var newOptions = this.state.options;
    newOptions[groupIndex].controls[controlIndex].value = newValue;
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
      controls = <Controls update={this.update.bind(this)} options={this.state.options}/>
    }
    return <div style={style}>
      <canvas id="draw"></canvas>
      {controls}
    </div>;
  }
}

export default App;
