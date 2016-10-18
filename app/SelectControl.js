import React, { Component } from 'react';

class SelectControl extends Component {
  update(ind, t){
  	t.props.update(ind, t.props.groupIndex, t.props.controlIndex, "value");
  }

  render() {
 
  	 var options = this.props.info.options.map(function(name, ind){
  	 	var imgUrl;
       var className = "control-button";
        if(this.props.info.value===ind){
          className+= " selected";
        }
      
        console.log("NAME", typeof(name));
        if(typeof(name)=="object"){
          return <canvas className={className} key={ind} id={"c"+ind} onClick={this.update.bind(null, ind, this)} 
          ref={function(canvas) {
              if(canvas!=null) {
                canvas.width = 400;
                canvas.height = 300;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(name,0,0, canvas.width, canvas.height);
              }
           //  this.props.setCanvas(canvas);
            }.bind(this)}></canvas>
        } else {
        /*using icon from font awesome rather than custom image*/
    	   if(name.includes("fa")){
          className+= " fa "+name;
          return <div className={className} onClick={this.update.bind(null, ind, this)}></div>;
         } else {
      	 	if(this.props.info.value===ind){
      	 	//	imgUrl = require("./../images/"+name+"-selected-01.png");
            imgUrl = "./images/"+name+"-selected-01.png";
      	 	}else{
      	 	//	imgUrl = require("./../images/"+name+"-01.png");
          imgUrl = "./images/"+name+"-01.png";
      	 	}
      	 
      	 	return <img className={className} src={imgUrl} key={name} alt={name} onClick={this.update.bind(null, ind, this)} />;
    	   }
       }
     }.bind(this));

     /* uploaded images become shape options */
   /*  if(this.props.info.name=="shape"){
      this.props.images.map(function(image, index){
         options.push(<canvas className="control-button" key={"ca"+index} ref={function(canvas) {
              console.log("DRAWING", canvas, image);
              if(canvas!=null) {
                canvas.width = 400;
                canvas.height = 300;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image,0,0, canvas.width, canvas.height);
              }
           //  this.props.setCanvas(canvas);
            }.bind(this)}></canvas>);
      }.bind(this));
     }*/

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
