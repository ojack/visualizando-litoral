import React, { Component } from 'react';

class MultiSelect extends Component {
  update(ind, t){
   // console.log(t.props.info);
   var values = t.props.info.value.slice();
    if(t.props.keysDown.indexOf(16) > -1){//shift key pressed
      console.log("SHIFT");
      t.props.update(ind, t.props.groupIndex, t.props.controlIndex, "recording");
      if(!values[ind]){
        values[ind] = true;
        t.props.update(values, t.props.groupIndex, t.props.controlIndex, "value");
      }
    } else {
       
      values[ind] = values[ind] ? false : true;
      t.props.update(values, t.props.groupIndex, t.props.controlIndex, "value");
    }
   
  }

  render() {
  //  console.log("rendering multi");
  	 var options = this.props.info.options.map(function(name, ind){
        var className = "control-button";
        if(this.props.info.value[ind]) className+= " selected";
        if(this.props.info.recording==ind) className+= " recording";
        return <div className={className} key={name} onClick={this.update.bind(null, ind, this)}>{name}</div>
  	   
  	   
     }.bind(this));
     var label = [];
     if(this.props.info.label) label = (<h4>{this.props.info.label}</h4>);
    return (
      <div className={"control-element"}>
        {label}
       {options}
      </div>
    );
  }
}

export default MultiSelect;
