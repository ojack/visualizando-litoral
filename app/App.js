import React, { Component } from 'react';
import Controls from './Controls.js';
import AnimationCanvas from './AnimationCanvas.js';
import Midi from './Midi.js';
import CustomImage from './CustomImage.js';
import options from './options.json';

//import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    
    
    this.state = {options: options, showControls: true, keysDown: [], images: []};

    var settings = {};
    for(var i = 0; i < this.state.options.length; i++){
      var group = this.state.options[i].controls;
      for(var j = 0; j < group.length; j++){
        if("name" in group[j]){
          settings[group[j].name] = group[j];
        }
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

  setCanvas(canvas){
    console.log("SET");
    this.settings.canvas = canvas;
  }

  addUploadedImage(image){
    var images = this.state.images;
    var newOptions = this.state.options;
    newOptions[0].controls[0].options.push(image);
    this.setState({options: newOptions});
   // this.setState({images: images});
  }

  render() {
    var style = {
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%"
    };
    var controls, draw = [];
    if(this.state.showControls){
      controls = <Controls update={this.update.bind(this)} midi={this.state.midi} keysDown={this.state.keysDown} options={this.state.options} setCanvas={this.addUploadedImage.bind(this)} images={this.state.images}/>
    }
    console.log("val", this.settings.shape.value);
   


    return <div style={style}>
      <canvas id="draw"></canvas>
      {controls}
      {draw}
    </div>;
  }
}

export default App;
