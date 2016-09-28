import React, { Component } from 'react';
import ControlGroup from './ControlGroup.js';

class Controls extends Component {
  render() {
    var groups = this.props.options.map(function(obj, ind){
      return <ControlGroup info={obj} update={this.props.update} groupIndex={ind} keysDown={this.props.keysDown} key={"groups "+ind}/>
    }.bind(this));
    return (
      <div className="controls">
       {groups}
      </div>
    );
  }
}

export default Controls;
