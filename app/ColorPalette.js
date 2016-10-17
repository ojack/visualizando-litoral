"use strict";

import React, { Component } from 'react';
import reactCSS from 'reactcss'
//import ColorPicker from 'coloreact';
//import ColorPicker from 'react-color-picker'
 import { ChromePicker } from 'react-color';


class ColorPalette extends Component {
  constructor(props){
    super(props);
    this.state = {displayColorPicker: false}
  }
 

  handleClick(){
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose(){
    this.setState({ displayColorPicker: false })
  }

  render(){
    var style = {
      position: "relative",
      width: "150px",
      height: "150px",
      display: "inline-block"
    }

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${ this.props.info.value.r }, ${ this.props.info.value.g }, ${ this.props.info.value.b }, ${ this.props.info.value.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          left: '-10px',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className="control-element">
        <div style={ styles.swatch } onClick={ this.handleClick.bind(this) }>
          <div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose.bind(this) }/>
          <ChromePicker color={ this.props.info.value } onChange={ this.handleChange.bind(this) } />
        </div> : null }

      </div>);
   
  }

  handleChange(color) {
      console.log(color);
     // console.log(this);
    this.props.update(color.rgb, this.props.groupIndex, this.props.controlIndex, "value");
     // this.setState({color: color});
  }
}

export default ColorPalette;
