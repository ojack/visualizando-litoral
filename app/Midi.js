/*utility functions for calculating path*/

class Midi {
  constructor(){
   // console.log("init midi");
    navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure );
    this.channels = [];
  }

  onMIDISuccess(access){
   // console.log(access);
    this.midi = access;
    this.midi.inputs.forEach(function(entry){entry.onmidimessage = this.handleMessage.bind(this)}.bind(this));
   // this.listInputsAndOutputs(access);
  }

  setChannel(channel, parent, callback){
  //  if(this.midi){
      this.channels[channel] = {parent: parent, callback: callback};
   /* } else {
      console.log("NO MIDI!");
    }*/
  }

  listInputsAndOutputs( midiAccess ) {
    for (var entry of midiAccess.inputs) {
      var input = entry[1];
      
      // console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      //   "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      //   "' version:'" + input.version + "'" );
    }

    for (var entry of midiAccess.outputs) {
      //var output = entry[1];
      // console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      //   "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      //   "' version:'" + output.version + "'" );
    }
  }

  onMIDIFailure(msg){
    console.log("failed to get midi");
  }

  handleMessage(msg){
   // console.log(msg.data);
    var channel = msg.data[1];
   // console.log(this.channels);
    if(this.channels[channel]!=null){
     // console.log(this.channels)
      this.channels[channel].callback.call(this.channels[channel].parent, msg.data[2]);
    }
  }
}

export default Midi;
