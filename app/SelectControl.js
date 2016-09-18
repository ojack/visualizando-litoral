import React, { Component } from 'react';

class SelectControl extends Component {
  update(ind, t){
  	t.props.update(ind, t.props.groupIndex, t.props.controlIndex);
  }

  render() {

  	 var options = this.props.info.options.map(function(name, ind){
  	 	var imgUrl;
  	 
  	 	if(this.props.info.value===ind){
  	 	//	imgUrl = require("./../images/"+name+"-selected-01.png");
        imgUrl = "./images/"+name+"-selected-01.png";
  	 	}else{
  	 	//	imgUrl = require("./../images/"+name+"-01.png");
      imgUrl = "./images/"+name+"-01.png";
  	 	}
  	 
  	 	return <img className="control-button" src={imgUrl} key={name} alt={name} onClick={this.update.bind(null, ind, this)} />;
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

export default SelectControl;
