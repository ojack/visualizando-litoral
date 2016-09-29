(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Path = require("./Path.js");

var _Path2 = _interopRequireDefault(_Path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Agent = function () {
  function Agent(ctx, settings) {
    _classCallCheck(this, Agent);

    this.points = [];
    this.stepIndex = 0;
    this.ctx = ctx;
    this.isRecording = false;
    this.size = settings.size.value;
    this.length = settings.length.value;
    this.repeat = settings.repeat.value;
    this.coordType = settings.coordType.value;
    this.color = settings.color.value.rgbString;
    this.shape = settings.shape.value;
    console.log("REPEAT", this.repeat);
  }

  _createClass(Agent, [{
    key: "addPoint",
    value: function addPoint(x, y, size) {
      var pt = { x: x, y: y, size: size };
      var polar = _Path2.default.toPolar(pt);
      pt.theta = polar.theta;
      pt.r = polar.r;
      this.points.push(pt);
    }
  }, {
    key: "setPath",
    value: function setPath(points, index) {
      this.points = points;
      this.stepIndex = index;
    }
  }, {
    key: "setOffset",
    value: function setOffset(point) {
      if (this.coordType == 0) {
        this.points = _Path2.default.calculateOffset(this.points, point, this.stepIndex, true);
      } else {
        this.points = _Path2.default.calculatePolarOffset(this.points, point, this.stepIndex);
      }

      // this.points = Path.calculatePolarOffset(this.points, point, this.stepIndex);
    }
  }, {
    key: "restartAnimation",
    value: function restartAnimation() {
      this.stepIndex = 0;
      switch (this.repeat) {
        case 1:
          // console.log(" point offset", this.points[this.points.length-1]);
          this.setOffset(this.points[this.points.length - 1]);
          console.log(this.points);
          break;
        case 2:
          this.points = _Path2.default.reverse(this.points);
          break;
        default:
          break;
      }
    }
  }, {
    key: "update",
    value: function update() {

      if (this.isRecording) {
        this.stepIndex = this.points.length - 1;
      } else {
        if (this.shape == 0) {
          // if line, different update
          this.points = _Path2.default.addNextPoint(this.points);
        } else {
          this.stepIndex++;
          if (this.stepIndex >= this.points.length) {
            this.restartAnimation();
          }
        }
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      if (this.points.length > 0) {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;

        var currPt = this.points[this.stepIndex];
        this.ctx.save();

        switch (this.shape) {
          case 0:
            var toDraw;
            if (this.isRecording) {
              toDraw = this.points.length - 1;
            } else {
              toDraw = Math.min(this.length, this.points.length - 1);
            }
            for (var i = 0; i < toDraw; i++) {
              this.ctx.beginPath();
              this.ctx.moveTo(this.points[i].x, this.points[i].y);
              this.ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
              this.ctx.lineWidth = this.points[i].size / 2;
              this.ctx.stroke();
            }

            break;
          case 1:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.beginPath();
            //this.ctx.arc(0, 0,this.size/2,50,0,2*Math.PI);
            this.ctx.arc(0, 0, currPt.size / 2, 50, 0, 2 * Math.PI);
            this.ctx.fill();
            break;
          case 2:
            this.ctx.translate(currPt.x, currPt.y);
            this.ctx.fillRect(-currPt.size / 2, -currPt.size / 2, currPt.size, currPt.size);
            break;
        }

        this.ctx.restore();
      }
    }
  }]);

  return Agent;
}();

exports.default = Agent;

},{"./Path.js":9}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Agent = require('./Agent.js');

var _Agent2 = _interopRequireDefault(_Agent);

var _settings = require('./settings.json');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AnimationCanvas = function () {
  function AnimationCanvas(canvId, settings, parent) {
    _classCallCheck(this, AnimationCanvas);

    this.parent = parent;
    this.settings = settings;
    this.canvas = document.getElementById(canvId);
    // this.canvas.width = window.innerWidth;
    this.canvas.width = _settings2.default.size.w;
    this.canvas.height = _settings2.default.size.h;
    // this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');

    this.isDrawing = false;
    this.ctx.fillStyle = "#fff";
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.agents = [];
    console.log(this.settings);
    for (var i = 0; i < this.settings.track.value.length; i++) {
      var agentsPerTrack = [];
      this.agents.push(agentsPerTrack);
    }
    this.currAgent = new _Agent2.default(this.ctx, this.settings);
    this.addEventListeners();
    this.mousePos = { x: 0, y: 0 };
    this.render();
    this.isRecording = false;
    this.keysDown = [];
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    //var stream = this.canvas.captureStream(60); 
    // var mediaRecorder = new MediaRecorder(stream);
    // mediaRecorder.start();
  }

  _createClass(AnimationCanvas, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      this.canvas.onmousedown = function (e) {
        this.currAgent = new _Agent2.default(this.ctx, this.settings);
        this.currAgent.isRecording = true;
        this.currAgent.addPoint(e.clientX - this.canvas.width / 2, e.clientY - this.canvas.height / 2, this.settings.size.value);
        this.agents[this.settings.track.recording].push(this.currAgent);
        this.isDrawing = true;
      }.bind(this);

      this.canvas.onmousemove = function (e) {
        this.mousePos = { x: e.clientX - this.canvas.width / 2, y: e.clientY - this.canvas.height / 2 };
      }.bind(this);

      this.canvas.onmouseup = function (e) {
        this.isDrawing = false;
        this.currAgent.isRecording = false;
      }.bind(this);

      // window.onresize = function(){
      //   this.canvas.width = window.innerWidth;
      //   this.canvas.height = window.innerHeight;
      // }.bind(this);

      window.onkeydown = function (e) {
        var keyCode = e.keyCode || e.which;
        console.log(e);
        switch (keyCode) {
          case 65:
            // add, key a
            this.addAgent(this.mousePos);
            break;
          case 67:
            // clear
            this.agents[this.settings.track.recording] = [];
            break;
          case 102:
            // f, remove first
            if (this.agents[this.settings.track.recording].length > 0) this.agents[this.settings.track.recording].splice(0, 1);
            break;
          case 100:
            // d, remove last
            if (this.agents[this.settings.track.recording].length > 0) this.agents[this.settings.track.recording].splice(this.agents[this.settings.track.recording].length - 1, 1);
            break;
          case 82:
            if (this.isRecording) {

              this.stopRecording();
            } else {

              this.startRecording();
            }
            break;
          case 72:
            // h = hide controls
            this.parent.toggleControls();
            break;
          default:
            break;
        }
        if (this.keysDown.indexOf(keyCode) < 0) {
          this.keysDown.push(keyCode);
          this.parent.setKeysDown(this.keysDown);
        }
      }.bind(this);
      window.onkeyup = function (e) {
        console.log(this.keysDown);
        var keyCode = e.keyCode || e.which;
        if (this.keysDown.indexOf(keyCode) > -1) {
          this.keysDown.splice(this.keysDown.indexOf(keyCode), 1);
          this.parent.setKeysDown(this.keysDown);
        }
      }.bind(this);
    }
  }, {
    key: 'startRecording',
    value: function startRecording() {
      console.log("starting to record");
      this.isRecording = true;
      this.recordedBlobs = [];
      var stream = this.canvas.captureStream(60);
      this.mediaRecorder = new MediaRecorder(stream);
      //  this.mediaRecorder.onstop = this.handleStop;
      this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
      this.mediaRecorder.start(10);
      this.canvas.className = "recording";
    }
  }, {
    key: 'handleDataAvailable',
    value: function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    }
  }, {
    key: 'stopRecording',
    value: function stopRecording() {
      console.log("stopping record");
      this.mediaRecorder.stop();
      this.isRecording = false;
      //console.log('Recorded Blobs: ', this.recordedBlobs);
      this.download();
      this.canvas.className = "";
    }
  }, {
    key: 'download',
    value: function download() {
      var blob = new Blob(this.recordedBlobs, { type: 'video/webm' });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      var date = new Date();

      a.download = "litoral-" + date.getDate() + "-" + date.getDate() + "-" + date.getHours() + "-" + date.getMinutes() + '.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      this.recordedBlobs = [];
      this.mediaRecorder = null;
    }
  }, {
    key: 'addAgent',
    value: function addAgent(pos) {
      var agent = new _Agent2.default(this.ctx, this.settings);
      if (this.settings.synchro.value == 0) {
        agent.setPath(this.currAgent.points, this.currAgent.stepIndex);
      } else {
        agent.setPath(this.currAgent.points, 0);
      }
      agent.setOffset(pos);
      this.agents[this.settings.track.recording].push(agent);
    }
  }, {
    key: 'render',
    value: function render() {
      //console.log("rendering");
      if (this.isDrawing) {
        this.currAgent.addPoint(this.mousePos.x, this.mousePos.y, this.settings.size.value);
      }
      this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
      for (var i = 0; i < this.agents.length; i++) {
        if (this.settings.track.value[i] == true) {
          for (var j = 0; j < this.agents[i].length; j++) {
            this.agents[i][j].update();
            this.agents[i][j].draw();
          }
        }
      }
      window.requestAnimationFrame(this.render.bind(this));
    }
  }]);

  return AnimationCanvas;
}();

exports.default = AnimationCanvas;

},{"./Agent.js":1,"./settings.json":14}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Controls = require('./Controls.js');

var _Controls2 = _interopRequireDefault(_Controls);

var _AnimationCanvas = require('./AnimationCanvas.js');

var _AnimationCanvas2 = _interopRequireDefault(_AnimationCanvas);

var _Midi = require('./Midi.js');

var _Midi2 = _interopRequireDefault(_Midi);

var _options = require('./options.json');

var _options2 = _interopRequireDefault(_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import './App.css';

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = { options: _options2.default, showControls: true, keysDown: [] };

    var settings = {};
    for (var i = 0; i < _this.state.options.length; i++) {
      var group = _this.state.options[i].controls;
      for (var j = 0; j < group.length; j++) {
        settings[group[j].name] = group[j];
      }
    }
    _this.settings = settings;
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.anim = new _AnimationCanvas2.default("draw", this.settings, this);
      this.midi = new _Midi2.default();
      this.setState({ midi: this.midi });
    }
  }, {
    key: 'toggleControls',
    value: function toggleControls() {
      console.log("togglinh controls");
      this.setState({ showControls: this.state.showControls ? false : true });
    }
  }, {
    key: 'setKeysDown',
    value: function setKeysDown(keys) {
      this.setState({ keysDown: keys });
    }
  }, {
    key: 'update',
    value: function update(newValue, groupIndex, controlIndex, propertyName) {
      var newOptions = this.state.options;
      newOptions[groupIndex].controls[controlIndex][propertyName] = newValue;
      this.setState({ options: newOptions });
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%"
      };
      var controls = [];
      if (this.state.showControls) {
        controls = _react2.default.createElement(_Controls2.default, { update: this.update.bind(this), midi: this.state.midi, keysDown: this.state.keysDown, options: this.state.options });
      }
      return _react2.default.createElement(
        'div',
        { style: style },
        _react2.default.createElement('canvas', { id: 'draw' }),
        controls
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;

},{"./AnimationCanvas.js":2,"./Controls.js":6,"./Midi.js":7,"./options.json":13,"react":"react"}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _coloreact = require('coloreact');

var _coloreact2 = _interopRequireDefault(_coloreact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColorPalette = function (_Component) {
  _inherits(ColorPalette, _Component);

  function ColorPalette() {
    _classCallCheck(this, ColorPalette);

    return _possibleConstructorReturn(this, (ColorPalette.__proto__ || Object.getPrototypeOf(ColorPalette)).apply(this, arguments));
  }

  _createClass(ColorPalette, [{
    key: 'render',
    value: function render() {
      var style = {
        position: "relative",
        width: "150px",
        height: "150px"
      };
      return _react2.default.createElement(
        'div',
        { style: style },
        _react2.default.createElement(_coloreact2.default, {
          opacity: true,
          color: this.props.info.value.rgbString,
          onChange: this.showColor.bind(this)
        })
      );
    }
  }, {
    key: 'showColor',
    value: function showColor(color) {
      console.log(color);
      console.log(this);
      this.props.update(color, this.props.groupIndex, this.props.controlIndex, "value");
      // this.setState({color: color});
    }
  }]);

  return ColorPalette;
}(_react.Component);

exports.default = ColorPalette;

},{"coloreact":19,"react":"react"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SelectControl = require('./SelectControl.js');

var _SelectControl2 = _interopRequireDefault(_SelectControl);

var _MultiSelect = require('./MultiSelect.js');

var _MultiSelect2 = _interopRequireDefault(_MultiSelect);

var _SliderControl = require('./SliderControl.js');

var _SliderControl2 = _interopRequireDefault(_SliderControl);

var _ColorPalette = require('./ColorPalette.js');

var _ColorPalette2 = _interopRequireDefault(_ColorPalette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ControlGroup = function (_Component) {
  _inherits(ControlGroup, _Component);

  function ControlGroup() {
    _classCallCheck(this, ControlGroup);

    return _possibleConstructorReturn(this, (ControlGroup.__proto__ || Object.getPrototypeOf(ControlGroup)).apply(this, arguments));
  }

  _createClass(ControlGroup, [{
    key: 'render',
    value: function render() {
      var controls = this.props.info.controls.map(function (obj, ind) {
        if (obj.type == "select") {
          // console.log("rendering select");
          return _react2.default.createElement(_SelectControl2.default, _extends({}, this.props, { controlIndex: ind, info: obj }));
        } else if (obj.type == "slider") {
          return _react2.default.createElement(_SliderControl2.default, _extends({}, this.props, { controlIndex: ind, info: obj, midi: this.props.midi }));
        } else if (obj.type == "color") {
          return _react2.default.createElement(_ColorPalette2.default, _extends({}, this.props, { controlIndex: ind, info: obj }));
        } else if (obj.type == "multi-select") {
          //console.log("rendering multi");
          return _react2.default.createElement(_MultiSelect2.default, _extends({}, this.props, { controlIndex: ind, info: obj }));
        }
      }.bind(this));

      return _react2.default.createElement(
        'div',
        { className: 'control-group' },
        _react2.default.createElement(
          'h3',
          null,
          this.props.info.label
        ),
        controls
      );
    }
  }]);

  return ControlGroup;
}(_react.Component);

exports.default = ControlGroup;

},{"./ColorPalette.js":4,"./MultiSelect.js":8,"./SelectControl.js":10,"./SliderControl.js":11,"react":"react"}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ControlGroup = require('./ControlGroup.js');

var _ControlGroup2 = _interopRequireDefault(_ControlGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controls = function (_Component) {
  _inherits(Controls, _Component);

  function Controls() {
    _classCallCheck(this, Controls);

    return _possibleConstructorReturn(this, (Controls.__proto__ || Object.getPrototypeOf(Controls)).apply(this, arguments));
  }

  _createClass(Controls, [{
    key: 'render',
    value: function render() {
      var groups = this.props.options.map(function (obj, ind) {
        return _react2.default.createElement(_ControlGroup2.default, { info: obj, update: this.props.update, midi: this.props.midi, groupIndex: ind, keysDown: this.props.keysDown, key: "groups " + ind });
      }.bind(this));
      return _react2.default.createElement(
        'div',
        { className: 'controls' },
        groups
      );
    }
  }]);

  return Controls;
}(_react.Component);

exports.default = Controls;

},{"./ControlGroup.js":5,"react":"react"}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*utility functions for calculating path*/

var Midi = function () {
  function Midi() {
    _classCallCheck(this, Midi);

    console.log("init midi");
    navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure);
    this.channels = [];
  }

  _createClass(Midi, [{
    key: "onMIDISuccess",
    value: function onMIDISuccess(access) {
      console.log(access);
      this.midi = access;
      this.midi.inputs.forEach(function (entry) {
        entry.onmidimessage = this.handleMessage.bind(this);
      }.bind(this));
      // this.listInputsAndOutputs(access);
    }
  }, {
    key: "setChannel",
    value: function setChannel(channel, parent, callback) {
      //  if(this.midi){
      this.channels[channel] = { parent: parent, callback: callback };
      /* } else {
         console.log("NO MIDI!");
       }*/
    }
  }, {
    key: "listInputsAndOutputs",
    value: function listInputsAndOutputs(midiAccess) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = midiAccess.inputs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entry = _step.value;

          var input = entry[1];

          console.log("Input port [type:'" + input.type + "'] id:'" + input.id + "' manufacturer:'" + input.manufacturer + "' name:'" + input.name + "' version:'" + input.version + "'");
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = midiAccess.outputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          //var output = entry[1];
          // console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
          //   "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
          //   "' version:'" + output.version + "'" );

          var entry = _step2.value;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "onMIDIFailure",
    value: function onMIDIFailure(msg) {
      console.log("failed to get midi");
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(msg) {
      // console.log(msg.data);
      var channel = msg.data[1];
      console.log(this.channels);
      if (this.channels[channel] != null) {
        // console.log(this.channels)
        this.channels[channel].callback.call(this.channels[channel].parent, msg.data[2]);
      }
    }
  }]);

  return Midi;
}();

exports.default = Midi;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MultiSelect = function (_Component) {
  _inherits(MultiSelect, _Component);

  function MultiSelect() {
    _classCallCheck(this, MultiSelect);

    return _possibleConstructorReturn(this, (MultiSelect.__proto__ || Object.getPrototypeOf(MultiSelect)).apply(this, arguments));
  }

  _createClass(MultiSelect, [{
    key: "update",
    value: function update(ind, t) {
      // console.log(t.props.info);
      var values = t.props.info.value.slice();
      if (t.props.keysDown.indexOf(16) > -1) {
        //shift key pressed
        console.log("SHIFT");
        t.props.update(ind, t.props.groupIndex, t.props.controlIndex, "recording");
        if (!values[ind]) {
          values[ind] = true;
          t.props.update(values, t.props.groupIndex, t.props.controlIndex, "value");
        }
      } else {

        values[ind] = values[ind] ? false : true;
        t.props.update(values, t.props.groupIndex, t.props.controlIndex, "value");
      }
    }
  }, {
    key: "render",
    value: function render() {
      //  console.log("rendering multi");
      var options = this.props.info.options.map(function (name, ind) {
        var className = "control-button";
        if (this.props.info.value[ind]) className += " selected";
        if (this.props.info.recording == ind) className += " recording";
        return _react2.default.createElement(
          "div",
          { className: className, key: name, onClick: this.update.bind(null, ind, this) },
          name
        );
      }.bind(this));
      var label = [];
      if (this.props.info.label) label = _react2.default.createElement(
        "h4",
        null,
        this.props.info.label
      );
      return _react2.default.createElement(
        "div",
        { className: "control-element" },
        label,
        options
      );
    }
  }]);

  return MultiSelect;
}(_react.Component);

exports.default = MultiSelect;

},{"react":"react"}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*utility functions for calculating path*/


var _settings = require("./settings.json");

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = function () {
  function Path() {
    _classCallCheck(this, Path);
  }

  _createClass(Path, null, [{
    key: "reverse",
    value: function reverse(points) {
      return points.reverse();
    }
  }, {
    key: "calculateOffset",
    value: function calculateOffset(points, offset, index, boundsCheck) {
      /*translate by difference between old starting point and new*/
      // 
      if (points.length > index) {
        if (boundsCheck) {
          if (offset.x > _settings2.default.size.w / 2) offset.x -= _settings2.default.size.w;
          if (offset.x < -_settings2.default.size.w / 2) offset.x += _settings2.default.size.w;
          if (offset.y > _settings2.default.size.h / 2) offset.y -= _settings2.default.size.h;
          if (offset.y < -_settings2.default.size.h / 2) offset.y += _settings2.default.size.h;
        }
        var off = { x: offset.x - points[index].x, y: offset.y - points[index].y };

        return points.map(function (pt) {
          var newPt = this.addPolarCoords({ x: pt.x + off.x, y: pt.y + off.y, size: pt.size });
          // if(newPt.x > window.innerWidth) newPt.x -= window.innerWidth;
          // if(newPt.x < 0) newPt.x += window.innerWidth;
          // if(newPt.y > window.innerHeight) newPt.y -= window.innerHeight;
          // if(newPt.y < 0) newPt.y += window.innerHeight;
          return newPt;
        }.bind(this));
      } else {
        return points;
      }
    }

    /* create continuous line */

  }, {
    key: "addNextPoint",
    value: function addNextPoint(points) {
      if (points.length >= 2) {
        var off = { x: points[1].x - points[0].x, y: points[1].y - points[0].y };
        var newPt = { x: points[points.length - 1].x + off.x, y: points[points.length - 1].y + off.y, size: points[1].size };

        /* TO DO : if ENTIRE line outside bounds, offset all points. but what about large shapes?? split lines?c*/
        // if(newPt.x > Settings.size.w/2) newPt.x -= Settings.size.w;
        // if(newPt.x < -Settings.size.w/2) newPt.x += Settings.size.w;
        // if(newPt.y > Settings.size.h/2) newPt.y -= Settings.size.h;
        // if(newPt.y < -Settings.size.h/2) newPt.y += Settings.size.h;

        points.splice(0, 1);
        points.push(this.addPolarCoords(newPt));
        return points;
      } else {
        return points;
      }
    }
  }, {
    key: "calculatePolarOffset",
    value: function calculatePolarOffset(points, o, index) {
      //console.log("calc offset", o);
      var p = this.toPolar(o);
      console.log("rect", o);
      console.log("polar", p);
      console.log("re-rect", this.toRect(p));

      var offset = this.addPolarCoords(o);
      if (points.length > index) {
        console.log("original point", points[index]);
        var off = { theta: offset.theta - points[index].theta, r: offset.r - points[index].r };
        console.log("difference", off);
        return points.map(function (pt) {
          var newPt = this.addRectCoords({ r: pt.r + off.r, theta: pt.theta + off.theta, size: pt.size });
          // var newPt = this.addRectCoords({theta: pt.theta + off.theta, r: pt.r});
          return newPt;
        }.bind(this));
      } else {
        return points;
      }
    }
  }, {
    key: "addRectCoords",
    value: function addRectCoords(pt) {
      var rect = this.toRect(pt);
      pt.x = rect.x;
      pt.y = rect.y;
      return pt;
    }
  }, {
    key: "toRect",
    value: function toRect(pt) {
      var x = pt.r * Math.cos(pt.theta);
      var y = pt.r * Math.sin(pt.theta);
      return { x: x, y: y };
    }
  }, {
    key: "addPolarCoords",
    value: function addPolarCoords(pt) {
      //console.log("point", pt);
      var polar = this.toPolar(pt);
      // console.log("polar", polar);
      pt.theta = polar.theta;
      pt.r = polar.r;
      return pt;
    }
  }, {
    key: "toPolar",
    value: function toPolar(pt) {
      var theta = Math.atan2(pt.y, pt.x);
      var r = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
      return { theta: theta, r: r };
    }
  }]);

  return Path;
}();

exports.default = Path;

},{"./settings.json":14}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectControl = function (_Component) {
  _inherits(SelectControl, _Component);

  function SelectControl() {
    _classCallCheck(this, SelectControl);

    return _possibleConstructorReturn(this, (SelectControl.__proto__ || Object.getPrototypeOf(SelectControl)).apply(this, arguments));
  }

  _createClass(SelectControl, [{
    key: "update",
    value: function update(ind, t) {
      t.props.update(ind, t.props.groupIndex, t.props.controlIndex, "value");
    }
  }, {
    key: "render",
    value: function render() {

      var options = this.props.info.options.map(function (name, ind) {
        var imgUrl;

        if (this.props.info.value === ind) {
          //	imgUrl = require("./../images/"+name+"-selected-01.png");
          imgUrl = "./images/" + name + "-selected-01.png";
        } else {
          //	imgUrl = require("./../images/"+name+"-01.png");
          imgUrl = "./images/" + name + "-01.png";
        }

        return _react2.default.createElement("img", { className: "control-button", src: imgUrl, key: name, alt: name, onClick: this.update.bind(null, ind, this) });
      }.bind(this));
      var label = [];
      if (this.props.info.label) label = _react2.default.createElement(
        "h4",
        null,
        this.props.info.label
      );
      return _react2.default.createElement(
        "div",
        { className: "control-element" },
        label,
        options
      );
    }
  }]);

  return SelectControl;
}(_react.Component);

exports.default = SelectControl;

},{"react":"react"}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SliderControl = function (_Component) {
  _inherits(SliderControl, _Component);

  function SliderControl() {
    _classCallCheck(this, SliderControl);

    return _possibleConstructorReturn(this, (SliderControl.__proto__ || Object.getPrototypeOf(SliderControl)).apply(this, arguments));
  }

  _createClass(SliderControl, [{
    key: "update",
    value: function update(e) {
      //console.log(e.target.value);
      this.props.update(e.target.value, this.props.groupIndex, this.props.controlIndex, "value");
    }
  }, {
    key: "updateFromMidi",
    value: function updateFromMidi(val) {
      console.log("MIDI UPDATE", val, this);
      var scaledVal = ~~((val + this.props.info.min) * (this.props.info.max - this.props.info.min) / 127) - 1;
      this.props.update(scaledVal, this.props.groupIndex, this.props.controlIndex, "value");
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "render",
    value: function render() {
      console.log("midi channel", this.props.midi);
      if ("midiChannel" in this.props.info && this.props.midi) {

        this.props.midi.setChannel(this.props.info.midiChannel, this, this.updateFromMidi);
      }

      return _react2.default.createElement(
        "div",
        { className: "control-element" },
        _react2.default.createElement(
          "h4",
          null,
          this.props.info.label + ": " + this.props.info.value
        ),
        _react2.default.createElement("input", { type: "range", id: "myRange", min: this.props.info.min, max: this.props.info.max,
          value: this.props.info.value, onChange: this.update.bind(this) })
      );
    }
  }]);

  return SliderControl;
}(_react.Component);

exports.default = SliderControl;

},{"react":"react"}],12:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.getElementById('root'));

},{"./App":3,"react":"react","react-dom":"react-dom"}],13:[function(require,module,exports){
module.exports=[
	{
		"label": "forma",
		"controls": [
			{
				"type": "select", 
				"name": "shape",
				"options": ["line", "circle", "square"],
				"value": 1
			},
			{
				"type": "slider",
				"name": "size",
				"label": "tamaño",
				"value": 89,
				"min": 1,
				"max": 300,
				"midiChannel": 0
			},
			{
				"type": "slider",
				"name": "length",
				"label": "long. de linea",
				"value": 20,
				"min": 1,
				"max": 300,
				"midiChannel": 1
			},
			{
				"type": "color", 
				"name": "color",
				"value": {
					"rgbString": "rgb(255, 255, 255)"
				}
			}

		]
	},
	{
		"label": "animación",
		"controls": [
			{
				"type": "select", 
				"label": "ciclo",
				"name": "repeat",
				"options": ["repeat-repeat", "repeat-continue", "repeat-reverse"],
				"value": 1
			},
			{
				"type": "select", 
				"label": "sincronización",
				"name": "synchro",
				"options": ["synchro-synced", "synchro-offbeat"],
				"value": 1
			},
			{
				"type": "select", 
				"label": "coordenadas",
				"name": "coordType",
				"options": ["coordenadas-rect", "coordenadas-polar"],
				"value": 0
			}
			

		]
	},
	{
		"label": "track",
		"controls": [
			{
				"type": "multi-select",
				"name": "track",
				"label": "(click: visibilidad, shift + click: grabar)",
				"options": [1, 2, 3, 4],
				"value": [true, false, false, false],
				"recording": 0
				
			}
		]
	}

]
},{}],14:[function(require,module,exports){
module.exports={
	"size" : {"w": 1280, "h": 720}
}
},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Slider = require('./Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _Map = require('./Map');

var _Map2 = _interopRequireDefault(_Map);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _tinycolor = require('tinycolor2');

var _tinycolor2 = _interopRequireDefault(_tinycolor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColorPicker = function (_Component) {
  _inherits(ColorPicker, _Component);

  function ColorPicker(props) {
    _classCallCheck(this, ColorPicker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ColorPicker).call(this, props));

    var c = (0, _tinycolor2.default)(_this.props.color).toHsv();
    _this.state = {
      color: _this.toPercentage(c)
    };

    _this.throttle = (0, _throttle2.default)(function (fn, data) {
      fn(data);
    }, 100);

    _this.handleSaturationValueChange = _this.handleSaturationValueChange.bind(_this);
    _this.handleHueChange = _this.handleHueChange.bind(_this);
    _this.handleAlphaChange = _this.handleAlphaChange.bind(_this);
    _this.showLastValue = _this.showLastValue.bind(_this);
    return _this;
  }

  _createClass(ColorPicker, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!_tinycolor2.default.equals(nextProps.color, this.state.color)) {
        var c = (0, _tinycolor2.default)(nextProps.color).toHsv();
        this.setState({
          color: this.toPercentage(c)
        });
      }
    }
  }, {
    key: 'toPercentage',
    value: function toPercentage(hsv) {
      var h = hsv.h;
      var s = hsv.s;
      var v = hsv.v;
      var a = hsv.a;

      return {
        h: h,
        s: s * 100,
        v: v * 100,
        a: a
      };
    }
  }, {
    key: 'handleHueChange',
    value: function handleHueChange(h) {
      var _state$color = this.state.color;
      var s = _state$color.s;
      var v = _state$color.v;
      var a = _state$color.a;

      this.update({ h: h, s: s, v: v, a: a });
    }
  }, {
    key: 'handleSaturationValueChange',
    value: function handleSaturationValueChange(s, v) {
      var _state$color2 = this.state.color;
      var h = _state$color2.h;
      var a = _state$color2.a;

      this.update({ h: h, s: s, v: v, a: a });
    }
  }, {
    key: 'handleAlphaChange',
    value: function handleAlphaChange(a) {
      var _state$color3 = this.state.color;
      var h = _state$color3.h;
      var s = _state$color3.s;
      var v = _state$color3.v;

      this.update({ h: h, s: s, v: v, a: a });
    }
  }, {
    key: 'getAlpha',
    value: function getAlpha() {
      return this.state.color.a === undefined ? 1 : this.state.color.a;
    }
  }, {
    key: 'getBackgroundHue',
    value: function getBackgroundHue() {
      return (0, _tinycolor2.default)({
        h: this.state.color.h,
        s: 100,
        v: 100 }).toRgbString();
    }
  }, {
    key: 'getBackgroundGradient',
    value: function getBackgroundGradient() {
      var _state$color4 = this.state.color;
      var h = _state$color4.h;
      var s = _state$color4.s;
      var v = _state$color4.v;

      var opaque = (0, _tinycolor2.default)({
        h: h,
        s: s,
        v: v,
        a: 1 }).toRgbString();
      return 'linear-gradient(to right, rgba(0,0,0,0) 0%, ' + opaque + ' 100%)';
    }
  }, {
    key: 'update',
    value: function update(color) {
      this.setState({ color: color });
      this.throttle(this.props.onChange, this.output());
    }
  }, {
    key: 'output',
    value: function output() {
      var c = (0, _tinycolor2.default)(this.state.color);
      return {
        hsl: c.toHsl(),
        hex: c.toHex(),
        hexString: c.toHexString(),
        rgb: c.toRgb(),
        rgbString: c.toRgbString()
      };
      return c;
    }
  }, {
    key: 'showLastValue',
    value: function showLastValue() {
      this.props.onComplete && this.props.onComplete(this.output());
    }
  }, {
    key: 'render',
    value: function render() {
      var _state$color5 = this.state.color;
      var h = _state$color5.h;
      var s = _state$color5.s;
      var v = _state$color5.v;
      var a = _state$color5.a;

      return _react2.default.createElement(
        'div',
        {
          className: this.props.className || 'ColorPicker',
          style: this.props.style },
        _react2.default.createElement(_Slider2.default, {
          className: 'HueSlider',
          vertical: true,
          value: h,
          type: 'hue',
          max: 360,
          onChange: this.handleHueChange,
          onComplete: this.showLastValue,
          style: {
            right: '1.3em',
            bottom: this.props.opacity ? '2.5em' : '1.3em'
          },
          trackStyle: {
            borderRadius: '1em',
            background: 'linear-gradient(to bottom,\n              #FF0000 0%,\n              #FF0099 10%,\n              #CD00FF 20%,\n              #3200FF 30%,\n              #0066FF 40%,\n              #00FFFD 50%,\n              #00FF66 60%,\n              #35FF00 70%,\n              #CDFF00 80%,\n              #FF9900 90%,\n              #FF0000 100%\n            )'
          },
          pointerStyle: {
            boxShadow: 'inset 0 0 0 1px #ccc,0 1px 2px #ccc',
            borderRadius: '100%'
          } }),
        this.props.opacity && _react2.default.createElement(_Slider2.default, {
          className: 'OpacitySlider',
          type: 'opacity',
          value: a,
          max: 1,
          background: this.getBackgroundGradient(),
          onChange: this.handleAlphaChange,
          onComplete: this.showLastValue,
          style: {
            bottom: '1.3em',
            right: '2.5em',
            height: 8,
            background: '#fff url("data:image/gif;base64,R0lGODdhEAAQAPEAAMvLy8zMzP///wAAACwAAAAAEAAQAEACHYxvosstCAEMrq6Jj812Y59NIDQipdY5XLWqH4sVADs=") repeat',
            backgroundSize: '8px 8px'
          },
          trackStyle: {
            borderRadius: '1em',
            background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, #FFF 100%)'
          },
          pointerStyle: {
            boxShadow: 'inset 0 0 0 1px #ccc,0 1px 2px #ccc',
            borderRadius: '100%'
          } }),
        _react2.default.createElement(_Map2.default, {
          x: s,
          y: v,
          max: 100,
          backgroundColor: this.getBackgroundHue(),
          onChange: this.handleSaturationValueChange,
          onComplete: this.showLastValue,
          style: {
            top: 0,
            left: 0,
            right: '2.5em',
            bottom: this.props.opacity ? '2.5em' : '1.3em'
          },
          pointerStyle: {
            borderColor: (0, _tinycolor2.default)(this.state.color).isDark() ? "#fff" : "#000"
          }
        })
      );
    }
  }]);

  return ColorPicker;
}(_react.Component);

ColorPicker.propTypes = {
  color: _react.PropTypes.string.isRequired,
  onChange: _react.PropTypes.func.isRequired,
  onComplete: _react.PropTypes.func
};

ColorPicker.defaultProps = {
  color: 'rgba(0,0,0,1)'
};

exports.default = ColorPicker;
},{"./Map":17,"./Slider":18,"lodash/throttle":28,"react":"react","tinycolor2":30}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = draggable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _throttle = require('lodash/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};
var getDocument = function getDocument(element) {
  return element.ownerDocument;
};
var clamp = function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
};
var getDisplayName = function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

function draggable() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return function wrappedInDraggable(WrappedComponent) {
    var Draggable = function (_Component) {
      _inherits(Draggable, _Component);

      function Draggable(props) {
        _classCallCheck(this, Draggable);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Draggable).call(this, props));

        _this.state = { active: false };

        _this.throttle = (0, _throttle2.default)(function (fn, data) {
          return fn(data);
        }, 30);
        _this.getPercentageValue = _this.getPercentageValue.bind(_this);
        _this.startUpdates = _this.startUpdates.bind(_this);
        _this.handleUpdate = _this.handleUpdate.bind(_this);
        _this.stopUpdates = _this.stopUpdates.bind(_this);
        _this.getPosition = _this.getPosition.bind(_this);
        _this.getScaledValue = _this.getScaledValue.bind(_this);
        _this.updateBoundingRect = _this.updateBoundingRect.bind(_this);
        _this.updatePosition = _this.updatePosition.bind(_this);
        return _this;
      }

      _createClass(Draggable, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.document = getDocument(_reactDom2.default.findDOMNode(this));
          var window = this.window = this.document.defaultView;

          window.addEventListener("resize", this.updateBoundingRect);
          window.addEventListener("scroll", this.updateBoundingRect);

          this.updateBoundingRect();
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var window = this.window;

          window.removeEventListener("resize", this.updateBoundingRect);
          window.removeEventListener("scroll", this.updateBoundingRect);
        }
      }, {
        key: 'startUpdates',
        value: function startUpdates(e) {
          var document = this.document;

          e.preventDefault();

          this.updateBoundingRect();
          document.addEventListener("mousemove", this.handleUpdate);
          document.addEventListener("touchmove", this.handleUpdate);
          document.addEventListener("mouseup", this.stopUpdates);
          document.addEventListener("touchend", this.stopUpdates);

          var _getPosition = this.getPosition(e);

          var x = _getPosition.x;
          var y = _getPosition.y;

          this.setState({ active: true });
          this.updatePosition({ x: x, y: y });
          // this.throttle(this.updatePosition, { x, y });
        }
      }, {
        key: 'handleUpdate',
        value: function handleUpdate(e) {
          if (this.state.active) {
            e.preventDefault();

            var _getPosition2 = this.getPosition(e);

            var x = _getPosition2.x;
            var y = _getPosition2.y;

            this.updatePosition({ x: x, y: y });
            // this.throttle(this.updatePosition, { x, y });
          }
        }
      }, {
        key: 'stopUpdates',
        value: function stopUpdates() {
          if (this.state.active) {
            var document = this.document;


            document.removeEventListener("mousemove", this.handleUpdate);
            document.removeEventListener("touchmove", this.handleUpdate);
            document.removeEventListener("mouseup", this.stopUpdates);
            document.removeEventListener("touchend", this.stopUpdates);

            this.props.onComplete();
            this.setState({ active: false });
          }
        }
      }, {
        key: 'updatePosition',
        value: function updatePosition(_ref) {
          var clientX = _ref.x;
          var clientY = _ref.y;
          var rect = this.state.rect;


          if (options.single) {
            var value = this.props.vertical ? (rect.bottom - clientY) / rect.height : (clientX - rect.left) / rect.width;
            return this.props.onChange(this.getScaledValue(value));
          }

          var x = (clientX - rect.left) / rect.width;
          var y = (rect.bottom - clientY) / rect.height;
          return this.props.onChange(this.getScaledValue(x), this.getScaledValue(y));
        }
      }, {
        key: 'getPosition',
        value: function getPosition(e) {
          if (e.touches) {
            e = e.touches[0];
          }

          return {
            x: e.clientX,
            y: e.clientY
          };
        }
      }, {
        key: 'getPercentageValue',
        value: function getPercentageValue(value) {
          return value / this.props.max * 100 + "%";
        }
      }, {
        key: 'getScaledValue',
        value: function getScaledValue(value) {
          return clamp(value, 0, 1) * this.props.max;
        }
      }, {
        key: 'updateBoundingRect',
        value: function updateBoundingRect() {
          var rect = _reactDom2.default.findDOMNode(this).getBoundingClientRect();
          this.setState({ rect: rect });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, this.state, {
            startUpdates: this.startUpdates,
            getPercentageValue: this.getPercentageValue }));
        }
      }]);

      return Draggable;
    }(_react.Component);

    Draggable.displayName = 'draggable(' + getDisplayName(WrappedComponent) + ')';
    Draggable.WrappedComponent = WrappedComponent;
    Draggable.propTypes = {
      onChange: _react.PropTypes.func.isRequired,
      onComplete: _react.PropTypes.func,
      max: _react.PropTypes.number
    };
    Draggable.defaultProps = {
      onChange: noop,
      onComplete: noop,
      max: 1
    };

    return (0, _hoistNonReactStatics2.default)(Draggable, WrappedComponent);
  };
}
},{"hoist-non-react-statics":20,"lodash/throttle":28,"react":"react","react-dom":"react-dom"}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Draggable = require('./Draggable');

var _Draggable2 = _interopRequireDefault(_Draggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Map = function (_Component) {
  _inherits(Map, _Component);

  function Map() {
    _classCallCheck(this, Map);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Map).apply(this, arguments));
  }

  _createClass(Map, [{
    key: 'getMapStyles',
    value: function getMapStyles() {
      var _Map$defaultStyles = Map.defaultStyles;
      var map = _Map$defaultStyles.map;
      var mapActive = _Map$defaultStyles.mapActive;

      return Object.assign({}, map, this.props.style && this.props.style, this.props.active && mapActive);
    }
  }, {
    key: 'getPointerStyles',
    value: function getPointerStyles() {
      var _Map$defaultStyles2 = Map.defaultStyles;
      var pointer = _Map$defaultStyles2.pointer;
      var pointerDark = _Map$defaultStyles2.pointerDark;
      var pointerLight = _Map$defaultStyles2.pointerLight;

      return Object.assign({}, pointer, this.props.pointerStyle && this.props.pointerStyle, {
        left: this.props.getPercentageValue(this.props.x),
        bottom: this.props.getPercentageValue(this.props.y)
      });
    }
  }, {
    key: 'getBgStyles',
    value: function getBgStyles() {
      var bg = Map.defaultStyles.bg;
      var backgroundColor = this.props.backgroundColor;

      return Object.assign({}, bg, { backgroundColor: backgroundColor });
    }
  }, {
    key: 'render',
    value: function render() {
      var bgOverlay = Map.defaultStyles.bgOverlay;

      return _react2.default.createElement(
        'div',
        {
          className: this.props.className,
          style: this.getMapStyles(),
          onMouseDown: this.props.startUpdates,
          onTouchStart: this.props.startUpdates },
        _react2.default.createElement(
          'div',
          { className: 'Map__Background', style: this.getBgStyles() },
          _react2.default.createElement('span', { className: 'Map__Background__overlay', style: bgOverlay })
        ),
        this.props.rect && _react2.default.createElement('div', { className: 'Map__Pointer', style: this.getPointerStyles() })
      );
    }
  }]);

  return Map;
}(_react.Component);

Map.propTypes = {
  x: _react2.default.PropTypes.number.isRequired,
  y: _react2.default.PropTypes.number.isRequired,
  backgroundColor: _react2.default.PropTypes.string,
  className: _react2.default.PropTypes.string
};

Map.defaultProps = {
  x: 0,
  y: 0,
  backgroundColor: 'transparent',
  className: 'Map'
};

Map.defaultStyles = {
  // Map
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'hidden',
    userSelect: 'none'
  },
  mapActive: {
    cursor: 'none'
  },

  // Pointer
  pointer: {
    position: 'absolute',
    width: 10,
    height: 10,
    marginLeft: -5,
    marginBottom: -5,
    borderRadius: '100%',
    border: '1px solid',
    willChange: 'auto'
  },

  // Background
  bg: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  bgOverlay: {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%),\n                 linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)'
  }
};

exports.default = (0, _Draggable2.default)()(Map);
},{"./Draggable":16,"react":"react"}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _horizontalSlider;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Draggable = require('./Draggable');

var _Draggable2 = _interopRequireDefault(_Draggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slider = function (_Component) {
  _inherits(Slider, _Component);

  function Slider() {
    _classCallCheck(this, Slider);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Slider).apply(this, arguments));
  }

  _createClass(Slider, [{
    key: 'getPointerStyles',
    value: function getPointerStyles() {
      var pointer = Slider.defaultStyles.pointer;

      var attr = this.props.vertical ? 'bottom' : 'left';
      return Object.assign({}, pointer, this.props.pointerStyle && this.props.pointerStyle, _defineProperty({}, attr, this.props.getPercentageValue(this.props.value)));
    }
  }, {
    key: 'getSliderStyles',
    value: function getSliderStyles() {
      var _Slider$defaultStyles = Slider.defaultStyles;
      var slider = _Slider$defaultStyles.slider;
      var verticalSlider = _Slider$defaultStyles.verticalSlider;
      var horizontalSlider = _Slider$defaultStyles.horizontalSlider;

      return Object.assign({}, slider, this.props.vertical && verticalSlider, !this.props.vertical && horizontalSlider, this.props.style && this.props.style);
    }
  }, {
    key: 'getTrackStyles',
    value: function getTrackStyles() {
      var _Slider$defaultStyles2 = Slider.defaultStyles;
      var track = _Slider$defaultStyles2.track;
      var horizontalTrack = _Slider$defaultStyles2.horizontalTrack;
      var verticalTrack = _Slider$defaultStyles2.verticalTrack;
      var opacityTrack = _Slider$defaultStyles2.opacityTrack;
      var hueTrack = _Slider$defaultStyles2.hueTrack;

      var background = this.props.background;
      return Object.assign({}, track, this.props.vertical && verticalTrack, !this.props.vertical && horizontalTrack, this.props.trackStyle && this.props.trackStyle, this.props.background && { background: this.props.background });
    }
  }, {
    key: 'render',
    value: function render() {
      var _Slider$defaultStyles3 = Slider.defaultStyles;
      var opacitySlider = _Slider$defaultStyles3.opacitySlider;
      var opacitySlider__track = _Slider$defaultStyles3.opacitySlider__track;

      return _react2.default.createElement(
        'div',
        {
          className: this.props.className || 'Slider',
          style: this.getSliderStyles(),
          onMouseDown: this.props.startUpdates,
          onTouchStart: this.props.startUpdates },
        _react2.default.createElement('div', { className: 'Slider__Track', style: this.getTrackStyles() }),
        this.props.rect && _react2.default.createElement('div', { className: 'Slider__Pointer', style: this.getPointerStyles() })
      );
    }
  }]);

  return Slider;
}(_react.Component);

Slider.propTypes = {
  value: _react.PropTypes.number.isRequired,
  background: _react.PropTypes.string
};

Slider.defaultProps = {
  value: 0,
  background: ''
};

Slider.defaultStyles = {
  // Slider
  slider: {
    position: 'absolute',
    userSelect: 'none'
  },
  horizontalSlider: (_horizontalSlider = {
    height: 8,
    left: 0,
    right: 0
  }, _defineProperty(_horizontalSlider, 'height', 10), _defineProperty(_horizontalSlider, 'cursor', 'ew-resize'), _horizontalSlider),
  verticalSlider: {
    top: 0,
    bottom: 0,
    width: 10,
    cursor: 'ns-resize'
  },

  // Track
  track: {
    background: '#efefef',
    position: 'absolute'
  },
  horizontalTrack: {
    height: '100%',
    left: 0,
    right: 0
  },
  verticalTrack: {
    bottom: 0,
    top: 0,
    width: '100%'
  },

  // Pointer
  pointer: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginBottom: -8,
    background: '#efefef',
    willChange: 'auto'
  }
};

exports.default = (0, _Draggable2.default)({ single: true })(Slider);
},{"./Draggable":16,"react":"react"}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Map = exports.Slider = undefined;

var _ColorPicker = require('./components/ColorPicker');

var _ColorPicker2 = _interopRequireDefault(_ColorPicker);

var _Slider2 = require('./components/Slider');

var _Slider3 = _interopRequireDefault(_Slider2);

var _Map2 = require('./components/Map');

var _Map3 = _interopRequireDefault(_Map2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Slider = _Slider3.default;
exports.Map = _Map3.default;
exports.default = _ColorPicker2.default;
},{"./components/ColorPicker":15,"./components/Map":17,"./components/Slider":18}],20:[function(require,module,exports){
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    arguments: true,
    arity: true
};

var isGetOwnPropertySymbolsAvailable = typeof Object.getOwnPropertySymbols === 'function';

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, customStatics) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components
        var keys = Object.getOwnPropertyNames(sourceComponent);

        /* istanbul ignore else */
        if (isGetOwnPropertySymbolsAvailable) {
            keys = keys.concat(Object.getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            if (!REACT_STATICS[keys[i]] && !KNOWN_STATICS[keys[i]] && (!customStatics || !customStatics[keys[i]])) {
                try {
                    targetComponent[keys[i]] = sourceComponent[keys[i]];
                } catch (error) {

                }
            }
        }
    }

    return targetComponent;
};

},{}],21:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],22:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":21}],23:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":24,"./now":27,"./toNumber":29}],24:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],25:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],26:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":25}],27:[function(require,module,exports){
var root = require('./_root');

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;

},{"./_root":22}],28:[function(require,module,exports){
var debounce = require('./debounce'),
    isObject = require('./isObject');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;

},{"./debounce":23,"./isObject":24}],29:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":24,"./isSymbol":26}],30:[function(require,module,exports){
// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

(function(Math) {

var trimLeft = /^\s+/,
    trimRight = /\s+$/,
    tinyCounter = 0,
    mathRound = Math.round,
    mathMin = Math.min,
    mathMax = Math.max,
    mathRandom = Math.random;

function tinycolor (color, opts) {

    color = (color) ? color : '';
    opts = opts || { };

    // If input is already a tinycolor, return itself
    if (color instanceof tinycolor) {
       return color;
    }
    // If we are called as a function, call using new instead
    if (!(this instanceof tinycolor)) {
        return new tinycolor(color, opts);
    }

    var rgb = inputToRGB(color);
    this._originalInput = color,
    this._r = rgb.r,
    this._g = rgb.g,
    this._b = rgb.b,
    this._a = rgb.a,
    this._roundA = mathRound(100*this._a) / 100,
    this._format = opts.format || rgb.format;
    this._gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this._r < 1) { this._r = mathRound(this._r); }
    if (this._g < 1) { this._g = mathRound(this._g); }
    if (this._b < 1) { this._b = mathRound(this._b); }

    this._ok = rgb.ok;
    this._tc_id = tinyCounter++;
}

tinycolor.prototype = {
    isDark: function() {
        return this.getBrightness() < 128;
    },
    isLight: function() {
        return !this.isDark();
    },
    isValid: function() {
        return this._ok;
    },
    getOriginalInput: function() {
      return this._originalInput;
    },
    getFormat: function() {
        return this._format;
    },
    getAlpha: function() {
        return this._a;
    },
    getBrightness: function() {
        //http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    },
    getLuminance: function() {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb.r/255;
        GsRGB = rgb.g/255;
        BsRGB = rgb.b/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    },
    setAlpha: function(value) {
        this._a = boundAlpha(value);
        this._roundA = mathRound(100*this._a) / 100;
        return this;
    },
    toHsv: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
    },
    toHsvString: function() {
        var hsv = rgbToHsv(this._r, this._g, this._b);
        var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
        return (this._a == 1) ?
          "hsv("  + h + ", " + s + "%, " + v + "%)" :
          "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
    },
    toHsl: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
    },
    toHslString: function() {
        var hsl = rgbToHsl(this._r, this._g, this._b);
        var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
        return (this._a == 1) ?
          "hsl("  + h + ", " + s + "%, " + l + "%)" :
          "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
    },
    toHex: function(allow3Char) {
        return rgbToHex(this._r, this._g, this._b, allow3Char);
    },
    toHexString: function(allow3Char) {
        return '#' + this.toHex(allow3Char);
    },
    toHex8: function(allow4Char) {
        return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
    },
    toHex8String: function(allow4Char) {
        return '#' + this.toHex8(allow4Char);
    },
    toRgb: function() {
        return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
    },
    toRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
          "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
    },
    toPercentageRgb: function() {
        return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
    },
    toPercentageRgbString: function() {
        return (this._a == 1) ?
          "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
          "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
    },
    toName: function() {
        if (this._a === 0) {
            return "transparent";
        }

        if (this._a < 1) {
            return false;
        }

        return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
    },
    toFilter: function(secondColor) {
        var hex8String = '#' + rgbaToArgbHex(this._r, this._g, this._b, this._a);
        var secondHex8String = hex8String;
        var gradientType = this._gradientType ? "GradientType = 1, " : "";

        if (secondColor) {
            var s = tinycolor(secondColor);
            secondHex8String = '#' + rgbaToArgbHex(s._r, s._g, s._b, s._a);
        }

        return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
    },
    toString: function(format) {
        var formatSet = !!format;
        format = format || this._format;

        var formattedString = false;
        var hasAlpha = this._a < 1 && this._a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");

        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === "name" && this._a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === "rgb") {
            formattedString = this.toRgbString();
        }
        if (format === "prgb") {
            formattedString = this.toPercentageRgbString();
        }
        if (format === "hex" || format === "hex6") {
            formattedString = this.toHexString();
        }
        if (format === "hex3") {
            formattedString = this.toHexString(true);
        }
        if (format === "hex4") {
            formattedString = this.toHex8String(true);
        }
        if (format === "hex8") {
            formattedString = this.toHex8String();
        }
        if (format === "name") {
            formattedString = this.toName();
        }
        if (format === "hsl") {
            formattedString = this.toHslString();
        }
        if (format === "hsv") {
            formattedString = this.toHsvString();
        }

        return formattedString || this.toHexString();
    },
    clone: function() {
        return tinycolor(this.toString());
    },

    _applyModification: function(fn, args) {
        var color = fn.apply(null, [this].concat([].slice.call(args)));
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this.setAlpha(color._a);
        return this;
    },
    lighten: function() {
        return this._applyModification(lighten, arguments);
    },
    brighten: function() {
        return this._applyModification(brighten, arguments);
    },
    darken: function() {
        return this._applyModification(darken, arguments);
    },
    desaturate: function() {
        return this._applyModification(desaturate, arguments);
    },
    saturate: function() {
        return this._applyModification(saturate, arguments);
    },
    greyscale: function() {
        return this._applyModification(greyscale, arguments);
    },
    spin: function() {
        return this._applyModification(spin, arguments);
    },

    _applyCombination: function(fn, args) {
        return fn.apply(null, [this].concat([].slice.call(args)));
    },
    analogous: function() {
        return this._applyCombination(analogous, arguments);
    },
    complement: function() {
        return this._applyCombination(complement, arguments);
    },
    monochromatic: function() {
        return this._applyCombination(monochromatic, arguments);
    },
    splitcomplement: function() {
        return this._applyCombination(splitcomplement, arguments);
    },
    triad: function() {
        return this._applyCombination(triad, arguments);
    },
    tetrad: function() {
        return this._applyCombination(tetrad, arguments);
    }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function(color, opts) {
    if (typeof color == "object") {
        var newColor = {};
        for (var i in color) {
            if (color.hasOwnProperty(i)) {
                if (i === "a") {
                    newColor[i] = color[i];
                }
                else {
                    newColor[i] = convertToPercentage(color[i]);
                }
            }
        }
        color = newColor;
    }

    return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {

    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;

    if (typeof color == "string") {
        color = stringInputToObject(color);
    }

    if (typeof color == "object") {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = "hsv";
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = "hsl";
        }

        if (color.hasOwnProperty("a")) {
            a = color.a;
        }
    }

    a = boundAlpha(a);

    return {
        ok: ok,
        format: color.format || format,
        r: mathMin(255, mathMax(rgb.r, 0)),
        g: mathMin(255, mathMax(rgb.g, 0)),
        b: mathMin(255, mathMax(rgb.b, 0)),
        a: a
    };
}


// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b){
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255
    };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = mathMax(r, g, b), min = mathMin(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    // Return a 3 character hex if possible
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {

    var hex = [
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16)),
        pad2(convertDecimalToHex(a))
    ];

    // Return a 4 character hex if possible
    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }

    return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {

    var hex = [
        pad2(convertDecimalToHex(a)),
        pad2(mathRound(r).toString(16)),
        pad2(mathRound(g).toString(16)),
        pad2(mathRound(b).toString(16))
    ];

    return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
    if (!color1 || !color2) { return false; }
    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};

tinycolor.random = function() {
    return tinycolor.fromRatio({
        r: mathRandom(),
        g: mathRandom(),
        b: mathRandom()
    });
};


// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function desaturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function saturate(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return tinycolor(hsl);
}

function greyscale(color) {
    return tinycolor(color).desaturate(100);
}

function lighten (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

function brighten(color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var rgb = tinycolor(color).toRgb();
    rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
    rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
    rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
    return tinycolor(rgb);
}

function darken (color, amount) {
    amount = (amount === 0) ? 0 : (amount || 10);
    var hsl = tinycolor(color).toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function spin(color, amount) {
    var hsl = tinycolor(color).toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function complement(color) {
    var hsl = tinycolor(color).toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return tinycolor(hsl);
}

function triad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
    ];
}

function tetrad(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
        tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
    ];
}

function splitcomplement(color) {
    var hsl = tinycolor(color).toHsl();
    var h = hsl.h;
    return [
        tinycolor(color),
        tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
        tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
}

function analogous(color, results, slices) {
    results = results || 6;
    slices = slices || 30;

    var hsl = tinycolor(color).toHsl();
    var part = 360 / slices;
    var ret = [tinycolor(color)];

    for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(tinycolor(hsl));
    }
    return ret;
}

function monochromatic(color, results) {
    results = results || 6;
    var hsv = tinycolor(color).toHsv();
    var h = hsv.h, s = hsv.s, v = hsv.v;
    var ret = [];
    var modification = 1 / results;

    while (results--) {
        ret.push(tinycolor({ h: h, s: s, v: v}));
        v = (v + modification) % 1;
    }

    return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function(color1, color2, amount) {
    amount = (amount === 0) ? 0 : (amount || 50);

    var rgb1 = tinycolor(color1).toRgb();
    var rgb2 = tinycolor(color2).toRgb();

    var p = amount / 100;

    var rgba = {
        r: ((rgb2.r - rgb1.r) * p) + rgb1.r,
        g: ((rgb2.g - rgb1.g) * p) + rgb1.g,
        b: ((rgb2.b - rgb1.b) * p) + rgb1.b,
        a: ((rgb2.a - rgb1.a) * p) + rgb1.a
    };

    return tinycolor(rgba);
};


// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function(color1, color2) {
    var c1 = tinycolor(color1);
    var c2 = tinycolor(color2);
    return (Math.max(c1.getLuminance(),c2.getLuminance())+0.05) / (Math.min(c1.getLuminance(),c2.getLuminance())+0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function(color1, color2, wcag2) {
    var readability = tinycolor.readability(color1, color2);
    var wcag2Parms, out;

    out = false;

    wcag2Parms = validateWCAG2Parms(wcag2);
    switch (wcag2Parms.level + wcag2Parms.size) {
        case "AAsmall":
        case "AAAlarge":
            out = readability >= 4.5;
            break;
        case "AAlarge":
            out = readability >= 3;
            break;
        case "AAAsmall":
            out = readability >= 7;
            break;
    }
    return out;

};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function(baseColor, colorList, args) {
    var bestColor = null;
    var bestScore = 0;
    var readability;
    var includeFallbackColors, level, size ;
    args = args || {};
    includeFallbackColors = args.includeFallbackColors ;
    level = args.level;
    size = args.size;

    for (var i= 0; i < colorList.length ; i++) {
        readability = tinycolor.readability(baseColor, colorList[i]);
        if (readability > bestScore) {
            bestScore = readability;
            bestColor = tinycolor(colorList[i]);
        }
    }

    if (tinycolor.isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
        return bestColor;
    }
    else {
        args.includeFallbackColors=false;
        return tinycolor.mostReadable(baseColor,["#fff", "#000"],args);
    }
};


// Big List of Colors
// ------------------
// <http://www.w3.org/TR/css3-color/#svg-color>
var names = tinycolor.names = {
    aliceblue: "f0f8ff",
    antiquewhite: "faebd7",
    aqua: "0ff",
    aquamarine: "7fffd4",
    azure: "f0ffff",
    beige: "f5f5dc",
    bisque: "ffe4c4",
    black: "000",
    blanchedalmond: "ffebcd",
    blue: "00f",
    blueviolet: "8a2be2",
    brown: "a52a2a",
    burlywood: "deb887",
    burntsienna: "ea7e5d",
    cadetblue: "5f9ea0",
    chartreuse: "7fff00",
    chocolate: "d2691e",
    coral: "ff7f50",
    cornflowerblue: "6495ed",
    cornsilk: "fff8dc",
    crimson: "dc143c",
    cyan: "0ff",
    darkblue: "00008b",
    darkcyan: "008b8b",
    darkgoldenrod: "b8860b",
    darkgray: "a9a9a9",
    darkgreen: "006400",
    darkgrey: "a9a9a9",
    darkkhaki: "bdb76b",
    darkmagenta: "8b008b",
    darkolivegreen: "556b2f",
    darkorange: "ff8c00",
    darkorchid: "9932cc",
    darkred: "8b0000",
    darksalmon: "e9967a",
    darkseagreen: "8fbc8f",
    darkslateblue: "483d8b",
    darkslategray: "2f4f4f",
    darkslategrey: "2f4f4f",
    darkturquoise: "00ced1",
    darkviolet: "9400d3",
    deeppink: "ff1493",
    deepskyblue: "00bfff",
    dimgray: "696969",
    dimgrey: "696969",
    dodgerblue: "1e90ff",
    firebrick: "b22222",
    floralwhite: "fffaf0",
    forestgreen: "228b22",
    fuchsia: "f0f",
    gainsboro: "dcdcdc",
    ghostwhite: "f8f8ff",
    gold: "ffd700",
    goldenrod: "daa520",
    gray: "808080",
    green: "008000",
    greenyellow: "adff2f",
    grey: "808080",
    honeydew: "f0fff0",
    hotpink: "ff69b4",
    indianred: "cd5c5c",
    indigo: "4b0082",
    ivory: "fffff0",
    khaki: "f0e68c",
    lavender: "e6e6fa",
    lavenderblush: "fff0f5",
    lawngreen: "7cfc00",
    lemonchiffon: "fffacd",
    lightblue: "add8e6",
    lightcoral: "f08080",
    lightcyan: "e0ffff",
    lightgoldenrodyellow: "fafad2",
    lightgray: "d3d3d3",
    lightgreen: "90ee90",
    lightgrey: "d3d3d3",
    lightpink: "ffb6c1",
    lightsalmon: "ffa07a",
    lightseagreen: "20b2aa",
    lightskyblue: "87cefa",
    lightslategray: "789",
    lightslategrey: "789",
    lightsteelblue: "b0c4de",
    lightyellow: "ffffe0",
    lime: "0f0",
    limegreen: "32cd32",
    linen: "faf0e6",
    magenta: "f0f",
    maroon: "800000",
    mediumaquamarine: "66cdaa",
    mediumblue: "0000cd",
    mediumorchid: "ba55d3",
    mediumpurple: "9370db",
    mediumseagreen: "3cb371",
    mediumslateblue: "7b68ee",
    mediumspringgreen: "00fa9a",
    mediumturquoise: "48d1cc",
    mediumvioletred: "c71585",
    midnightblue: "191970",
    mintcream: "f5fffa",
    mistyrose: "ffe4e1",
    moccasin: "ffe4b5",
    navajowhite: "ffdead",
    navy: "000080",
    oldlace: "fdf5e6",
    olive: "808000",
    olivedrab: "6b8e23",
    orange: "ffa500",
    orangered: "ff4500",
    orchid: "da70d6",
    palegoldenrod: "eee8aa",
    palegreen: "98fb98",
    paleturquoise: "afeeee",
    palevioletred: "db7093",
    papayawhip: "ffefd5",
    peachpuff: "ffdab9",
    peru: "cd853f",
    pink: "ffc0cb",
    plum: "dda0dd",
    powderblue: "b0e0e6",
    purple: "800080",
    rebeccapurple: "663399",
    red: "f00",
    rosybrown: "bc8f8f",
    royalblue: "4169e1",
    saddlebrown: "8b4513",
    salmon: "fa8072",
    sandybrown: "f4a460",
    seagreen: "2e8b57",
    seashell: "fff5ee",
    sienna: "a0522d",
    silver: "c0c0c0",
    skyblue: "87ceeb",
    slateblue: "6a5acd",
    slategray: "708090",
    slategrey: "708090",
    snow: "fffafa",
    springgreen: "00ff7f",
    steelblue: "4682b4",
    tan: "d2b48c",
    teal: "008080",
    thistle: "d8bfd8",
    tomato: "ff6347",
    turquoise: "40e0d0",
    violet: "ee82ee",
    wheat: "f5deb3",
    white: "fff",
    whitesmoke: "f5f5f5",
    yellow: "ff0",
    yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);


// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
    var flipped = { };
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            flipped[o[i]] = i;
        }
    }
    return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
    a = parseFloat(a);

    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }

    return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = mathMin(max, mathMax(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
    return mathMin(1, mathMax(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
    return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
    if (n <= 1) {
        n = (n * 100) + "%";
    }

    return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
    return (parseIntFromHex(h) / 255);
}

var matchers = (function() {

    // <http://www.w3.org/TR/css3-values/#integers>
    var CSS_INTEGER = "[-\\+]?\\d+%?";

    // <http://www.w3.org/TR/css3-values/#number-value>
    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

    // Actual matching.
    // Parentheses and commas are optional, but not required.
    // Whitespace can take the place of commas or opening paren
    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

    return {
        CSS_UNIT: new RegExp(CSS_UNIT),
        rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
        rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
        hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
        hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
        hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
        hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
        hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
    };
})();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
    return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color == 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }

    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match;
    if ((match = matchers.rgb.exec(color))) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    if ((match = matchers.rgba.exec(color))) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    if ((match = matchers.hsl.exec(color))) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    if ((match = matchers.hsla.exec(color))) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    if ((match = matchers.hsv.exec(color))) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    if ((match = matchers.hsva.exec(color))) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    if ((match = matchers.hex8.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex6.exec(color))) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? "name" : "hex"
        };
    }
    if ((match = matchers.hex4.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            a: convertHexToDecimal(match[4] + '' + match[4]),
            format: named ? "name" : "hex8"
        };
    }
    if ((match = matchers.hex3.exec(color))) {
        return {
            r: parseIntFromHex(match[1] + '' + match[1]),
            g: parseIntFromHex(match[2] + '' + match[2]),
            b: parseIntFromHex(match[3] + '' + match[3]),
            format: named ? "name" : "hex"
        };
    }

    return false;
}

function validateWCAG2Parms(parms) {
    // return valid WCAG2 parms for isReadable.
    // If input parms are invalid, return {"level":"AA", "size":"small"}
    var level, size;
    parms = parms || {"level":"AA", "size":"small"};
    level = (parms.level || "AA").toUpperCase();
    size = (parms.size || "small").toLowerCase();
    if (level !== "AA" && level !== "AAA") {
        level = "AA";
    }
    if (size !== "small" && size !== "large") {
        size = "small";
    }
    return {"level":level, "size":size};
}

// Node: Export function
if (typeof module !== "undefined" && module.exports) {
    module.exports = tinycolor;
}
// AMD/requirejs: Define the module
else if (typeof define === 'function' && define.amd) {
    define(function () {return tinycolor;});
}
// Browser: Expose to window
else {
    window.tinycolor = tinycolor;
}

})(Math);

},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvQWdlbnQuanMiLCJhcHAvQW5pbWF0aW9uQ2FudmFzLmpzIiwiYXBwL0FwcC5qcyIsImFwcC9Db2xvclBhbGV0dGUuanMiLCJhcHAvQ29udHJvbEdyb3VwLmpzIiwiYXBwL0NvbnRyb2xzLmpzIiwiYXBwL01pZGkuanMiLCJhcHAvTXVsdGlTZWxlY3QuanMiLCJhcHAvUGF0aC5qcyIsImFwcC9TZWxlY3RDb250cm9sLmpzIiwiYXBwL1NsaWRlckNvbnRyb2wuanMiLCJhcHAvaW5kZXguanMiLCJhcHAvb3B0aW9ucy5qc29uIiwiYXBwL3NldHRpbmdzLmpzb24iLCJub2RlX21vZHVsZXMvY29sb3JlYWN0L2xpYi9jb21wb25lbnRzL0NvbG9yUGlja2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yZWFjdC9saWIvY29tcG9uZW50cy9EcmFnZ2FibGUuanMiLCJub2RlX21vZHVsZXMvY29sb3JlYWN0L2xpYi9jb21wb25lbnRzL01hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb2xvcmVhY3QvbGliL2NvbXBvbmVudHMvU2xpZGVyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yZWFjdC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Rocm90dGxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIm5vZGVfbW9kdWxlcy90aW55Y29sb3IyL3Rpbnljb2xvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7O0lBRU0sSztBQUNKLGlCQUFZLEdBQVosRUFBaUIsUUFBakIsRUFBMkI7QUFBQTs7QUFDekIsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUssU0FBTCxHQUFpQixDQUFqQjtBQUNBLFNBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLLElBQUwsR0FBWSxTQUFTLElBQVQsQ0FBYyxLQUExQjtBQUNBLFNBQUssTUFBTCxHQUFjLFNBQVMsTUFBVCxDQUFnQixLQUE5QjtBQUNBLFNBQUssTUFBTCxHQUFjLFNBQVMsTUFBVCxDQUFnQixLQUE5QjtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFTLFNBQVQsQ0FBbUIsS0FBcEM7QUFDQSxTQUFLLEtBQUwsR0FBYSxTQUFTLEtBQVQsQ0FBZSxLQUFmLENBQXFCLFNBQWxDO0FBQ0EsU0FBSyxLQUFMLEdBQWEsU0FBUyxLQUFULENBQWUsS0FBNUI7QUFDQSxZQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLEtBQUssTUFBM0I7QUFDRDs7Ozs2QkFFUSxDLEVBQUcsQyxFQUFHLEksRUFBSztBQUNsQixVQUFJLEtBQUssRUFBQyxHQUFHLENBQUosRUFBTyxHQUFHLENBQVYsRUFBYSxNQUFNLElBQW5CLEVBQVQ7QUFDQSxVQUFJLFFBQVEsZUFBSyxPQUFMLENBQWEsRUFBYixDQUFaO0FBQ0EsU0FBRyxLQUFILEdBQVcsTUFBTSxLQUFqQjtBQUNBLFNBQUcsQ0FBSCxHQUFPLE1BQU0sQ0FBYjtBQUNELFdBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsRUFBakI7QUFDQTs7OzRCQUVPLE0sRUFBUSxLLEVBQU07QUFDcEIsV0FBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLFdBQUssU0FBTCxHQUFpQixLQUFqQjtBQUNEOzs7OEJBRVMs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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGF0aCBmcm9tICcuL1BhdGguanMnO1xuXG5jbGFzcyBBZ2VudCB7XG4gIGNvbnN0cnVjdG9yKGN0eCwgc2V0dGluZ3MpIHtcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xuICAgIHRoaXMuc3RlcEluZGV4ID0gMDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zaXplID0gc2V0dGluZ3Muc2l6ZS52YWx1ZTtcbiAgICB0aGlzLmxlbmd0aCA9IHNldHRpbmdzLmxlbmd0aC52YWx1ZTtcbiAgICB0aGlzLnJlcGVhdCA9IHNldHRpbmdzLnJlcGVhdC52YWx1ZTtcbiAgICB0aGlzLmNvb3JkVHlwZSA9IHNldHRpbmdzLmNvb3JkVHlwZS52YWx1ZTtcbiAgICB0aGlzLmNvbG9yID0gc2V0dGluZ3MuY29sb3IudmFsdWUucmdiU3RyaW5nO1xuICAgIHRoaXMuc2hhcGUgPSBzZXR0aW5ncy5zaGFwZS52YWx1ZTtcbiAgICBjb25zb2xlLmxvZyhcIlJFUEVBVFwiLCB0aGlzLnJlcGVhdCk7XG4gIH1cblxuICBhZGRQb2ludCh4LCB5LCBzaXplKXtcbiAgICB2YXIgcHQgPSB7eDogeCwgeTogeSwgc2l6ZTogc2l6ZX07XG4gICAgdmFyIHBvbGFyID0gUGF0aC50b1BvbGFyKHB0KTtcbiAgICBwdC50aGV0YSA9IHBvbGFyLnRoZXRhO1xuICAgIHB0LnIgPSBwb2xhci5yO1xuICAgdGhpcy5wb2ludHMucHVzaChwdCk7XG4gIH1cblxuICBzZXRQYXRoKHBvaW50cywgaW5kZXgpe1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuICAgIHRoaXMuc3RlcEluZGV4ID0gaW5kZXg7XG4gIH1cbiAgXG4gIHNldE9mZnNldChwb2ludCl7XG4gICAgaWYodGhpcy5jb29yZFR5cGU9PTApe1xuICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZU9mZnNldCh0aGlzLnBvaW50cywgcG9pbnQsIHRoaXMuc3RlcEluZGV4LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHRoaXMucG9pbnRzLCBwb2ludCwgdGhpcy5zdGVwSW5kZXgpO1xuICAgIH1cbiAgICBcbiAgIFxuICAgLy8gdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHRoaXMucG9pbnRzLCBwb2ludCwgdGhpcy5zdGVwSW5kZXgpO1xuICAgIFxuICB9XG5cbiAgcmVzdGFydEFuaW1hdGlvbigpe1xuICAgIHRoaXMuc3RlcEluZGV4ID0gMDtcbiAgICBzd2l0Y2godGhpcy5yZXBlYXQpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIHBvaW50IG9mZnNldFwiLCB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGgtMV0pO1xuICAgICAgICAgIHRoaXMuc2V0T2Zmc2V0KHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aC0xXSk7XG4gICAgICAgICAgY29uc29sZS5sb2codGhpcy5wb2ludHMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICAgIHRoaXMucG9pbnRzID0gUGF0aC5yZXZlcnNlKHRoaXMucG9pbnRzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgfSBcbiAgfVxuXG4gIHVwZGF0ZSgpe1xuXG4gICAgaWYodGhpcy5pc1JlY29yZGluZyl7XG4gICAgICB0aGlzLnN0ZXBJbmRleCA9IHRoaXMucG9pbnRzLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuc2hhcGU9PTApeyAvLyBpZiBsaW5lLCBkaWZmZXJlbnQgdXBkYXRlXG4gICAgICAgIHRoaXMucG9pbnRzID0gUGF0aC5hZGROZXh0UG9pbnQodGhpcy5wb2ludHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGVwSW5kZXgrKztcbiAgICAgICAgaWYodGhpcy5zdGVwSW5kZXggPj0gdGhpcy5wb2ludHMubGVuZ3RoKXtcbiAgICAgICAgICB0aGlzLnJlc3RhcnRBbmltYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgXG4gICAgXG4gIH1cblxuICBkcmF3KCl7XG4gICAgaWYodGhpcy5wb2ludHMubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICBcbiAgICAgIHZhciBjdXJyUHQgPSB0aGlzLnBvaW50c1t0aGlzLnN0ZXBJbmRleF07XG4gICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgIFxuICAgICAgc3dpdGNoKHRoaXMuc2hhcGUpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICB2YXIgdG9EcmF3O1xuICAgICAgICAgICBpZih0aGlzLmlzUmVjb3JkaW5nKXtcbiAgICAgICAgICAgIHRvRHJhdyA9IHRoaXMucG9pbnRzLmxlbmd0aC0xO1xuICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9EcmF3ID0gTWF0aC5taW4odGhpcy5sZW5ndGgsIHRoaXMucG9pbnRzLmxlbmd0aC0xKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgdG9EcmF3OyBpKyspe1xuICAgICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLnBvaW50c1tpXS54LCB0aGlzLnBvaW50c1tpXS55KTtcbiAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHRoaXMucG9pbnRzW2krMV0ueCwgdGhpcy5wb2ludHNbaSsxXS55KTtcbiAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gdGhpcy5wb2ludHNbaV0uc2l6ZS8yO1xuICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShjdXJyUHQueCwgY3VyclB0LnkpO1xuICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAvL3RoaXMuY3R4LmFyYygwLCAwLHRoaXMuc2l6ZS8yLDUwLDAsMipNYXRoLlBJKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmFyYygwLCAwLGN1cnJQdC5zaXplLzIsNTAsMCwyKk1hdGguUEkpO1xuICAgICAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShjdXJyUHQueCwgY3VyclB0LnkpO1xuICAgICAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoLWN1cnJQdC5zaXplLzIsIC1jdXJyUHQuc2l6ZS8yLGN1cnJQdC5zaXplLCBjdXJyUHQuc2l6ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgIH0gXG4gICAgICBcbiAgICAgIHRoaXMuY3R4LnJlc3RvcmUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWdlbnQ7XG4iLCJpbXBvcnQgQWdlbnQgZnJvbSAnLi9BZ2VudC5qcyc7XG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qc29uJztcblxuY2xhc3MgQW5pbWF0aW9uQ2FudmFzIHtcbiAgY29uc3RydWN0b3IoY2FudklkLCBzZXR0aW5ncywgcGFyZW50KSB7XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FudklkKTtcbiAgIC8vIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICB0aGlzLmNhbnZhcy53aWR0aCA9IFNldHRpbmdzLnNpemUudztcbiAgIHRoaXMuY2FudmFzLmhlaWdodCA9IFNldHRpbmdzLnNpemUuaDtcbiAgIC8vIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IFwiI2ZmZlwiO1xuICAgIHRoaXMuY3R4LmxpbmVKb2luID0gXCJyb3VuZFwiO1xuICAgIHRoaXMuY3R4LmxpbmVDYXAgPSBcInJvdW5kXCI7XG4gICAgdGhpcy5hZ2VudHMgPSBbXTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnNldHRpbmdzKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5zZXR0aW5ncy50cmFjay52YWx1ZS5sZW5ndGg7IGkrKyl7XG4gICAgICB2YXIgYWdlbnRzUGVyVHJhY2sgPSBbXTtcbiAgICAgIHRoaXMuYWdlbnRzLnB1c2goYWdlbnRzUGVyVHJhY2spO1xuICAgIH1cbiAgICB0aGlzLmN1cnJBZ2VudCA9IG5ldyBBZ2VudCh0aGlzLmN0eCwgdGhpcy5zZXR0aW5ncyk7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xuICAgIHRoaXMubW91c2VQb3MgPSB7eDogMCwgeTogMH07XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5rZXlzRG93biA9IFtdO1xuICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh0aGlzLmNhbnZhcy53aWR0aC8yLCB0aGlzLmNhbnZhcy5oZWlnaHQvMik7XG4gICAgLy92YXIgc3RyZWFtID0gdGhpcy5jYW52YXMuY2FwdHVyZVN0cmVhbSg2MCk7IFxuICAgIC8vIHZhciBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtKTtcbiAgICAvLyBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVycygpe1xuICAgIHRoaXMuY2FudmFzLm9ubW91c2Vkb3duID0gZnVuY3Rpb24oZSl7XG4gICAgICB0aGlzLmN1cnJBZ2VudCA9IG5ldyBBZ2VudCh0aGlzLmN0eCwgdGhpcy5zZXR0aW5ncyk7XG4gICAgICB0aGlzLmN1cnJBZ2VudC5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgICB0aGlzLmN1cnJBZ2VudC5hZGRQb2ludChlLmNsaWVudFgtdGhpcy5jYW52YXMud2lkdGgvMiwgZS5jbGllbnRZLXRoaXMuY2FudmFzLmhlaWdodC8yLCB0aGlzLnNldHRpbmdzLnNpemUudmFsdWUpO1xuICAgICAgdGhpcy5hZ2VudHNbdGhpcy5zZXR0aW5ncy50cmFjay5yZWNvcmRpbmddLnB1c2godGhpcy5jdXJyQWdlbnQpO1xuICAgICAgdGhpcy5pc0RyYXdpbmcgPSB0cnVlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHRoaXMuY2FudmFzLm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSl7XG4gICAgICB0aGlzLm1vdXNlUG9zID0ge3g6IGUuY2xpZW50WC10aGlzLmNhbnZhcy53aWR0aC8yLCB5OiBlLmNsaWVudFktdGhpcy5jYW52YXMuaGVpZ2h0LzJ9O1xuICAgICBcbiAgICB9LmJpbmQodGhpcyk7XG5cblxuICAgIHRoaXMuY2FudmFzLm9ubW91c2V1cCA9IGZ1bmN0aW9uKGUpe1xuICAgICAgdGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY3VyckFnZW50LmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKXtcbiAgICAvLyAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgLy8gICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgLy8gfS5iaW5kKHRoaXMpO1xuXG4gICAgd2luZG93Lm9ua2V5ZG93biA9IGZ1bmN0aW9uKGUpe1xuICAgICAgdmFyIGtleUNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgc3dpdGNoKGtleUNvZGUpIHtcbiAgICAgICAgY2FzZSA2NTogLy8gYWRkLCBrZXkgYVxuICAgICAgICAgIHRoaXMuYWRkQWdlbnQodGhpcy5tb3VzZVBvcyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNjc6IC8vIGNsZWFyXG4gICAgICAgICAgdGhpcy5hZ2VudHNbdGhpcy5zZXR0aW5ncy50cmFjay5yZWNvcmRpbmddID0gW107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTAyOiAvLyBmLCByZW1vdmUgZmlyc3RcbiAgICAgICAgICBpZih0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10ubGVuZ3RoID4gMCkgdGhpcy5hZ2VudHNbdGhpcy5zZXR0aW5ncy50cmFjay5yZWNvcmRpbmddLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMDA6IC8vIGQsIHJlbW92ZSBsYXN0XG4gICAgICAgICAgaWYodGhpcy5hZ2VudHNbdGhpcy5zZXR0aW5ncy50cmFjay5yZWNvcmRpbmddLmxlbmd0aCA+IDApIHRoaXMuYWdlbnRzW3RoaXMuc2V0dGluZ3MudHJhY2sucmVjb3JkaW5nXS5zcGxpY2UodGhpcy5hZ2VudHNbdGhpcy5zZXR0aW5ncy50cmFjay5yZWNvcmRpbmddLmxlbmd0aC0xLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA4MjpcbiAgICAgICAgICBpZih0aGlzLmlzUmVjb3JkaW5nICl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc3RvcFJlY29yZGluZygpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNzI6IC8vIGggPSBoaWRlIGNvbnRyb2xzXG4gICAgICAgICAgdGhpcy5wYXJlbnQudG9nZ2xlQ29udHJvbHMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgfVxuICAgICBpZih0aGlzLmtleXNEb3duLmluZGV4T2Yoa2V5Q29kZSkgPCAwKXtcbiAgICAgICAgdGhpcy5rZXlzRG93bi5wdXNoKGtleUNvZGUpO1xuICAgICAgICB0aGlzLnBhcmVudC5zZXRLZXlzRG93bih0aGlzLmtleXNEb3duKTtcbiAgICAgfVxuXG4gICAgfS5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5vbmtleXVwID0gZnVuY3Rpb24oZSl7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmtleXNEb3duKTtcbiAgICAgIHZhciBrZXlDb2RlID0gZS5rZXlDb2RlIHx8IGUud2hpY2g7XG4gICAgICBpZih0aGlzLmtleXNEb3duLmluZGV4T2Yoa2V5Q29kZSkgPiAtMSl7XG4gICAgICAgIHRoaXMua2V5c0Rvd24uc3BsaWNlKHRoaXMua2V5c0Rvd24uaW5kZXhPZihrZXlDb2RlKSwgMSk7XG4gICAgICAgIHRoaXMucGFyZW50LnNldEtleXNEb3duKHRoaXMua2V5c0Rvd24pO1xuICAgICAgfVxuICAgfS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgc3RhcnRSZWNvcmRpbmcoKXtcbiAgICBjb25zb2xlLmxvZyhcInN0YXJ0aW5nIHRvIHJlY29yZFwiKTtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnJlY29yZGVkQmxvYnMgPSBbXTtcbiAgICB2YXIgc3RyZWFtID0gdGhpcy5jYW52YXMuY2FwdHVyZVN0cmVhbSg2MCk7IFxuICAgIHRoaXMubWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSk7XG4gIC8vICB0aGlzLm1lZGlhUmVjb3JkZXIub25zdG9wID0gdGhpcy5oYW5kbGVTdG9wO1xuICAgIHRoaXMubWVkaWFSZWNvcmRlci5vbmRhdGFhdmFpbGFibGUgPSB0aGlzLmhhbmRsZURhdGFBdmFpbGFibGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLm1lZGlhUmVjb3JkZXIuc3RhcnQoMTApO1xuICAgIHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9IFwicmVjb3JkaW5nXCI7XG4gIH1cblxuICBoYW5kbGVEYXRhQXZhaWxhYmxlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmRhdGEgJiYgZXZlbnQuZGF0YS5zaXplID4gMCkge1xuICAgICAgdGhpcy5yZWNvcmRlZEJsb2JzLnB1c2goZXZlbnQuZGF0YSk7XG4gICAgfVxuICB9XG5cbiAgc3RvcFJlY29yZGluZygpe1xuICAgIGNvbnNvbGUubG9nKFwic3RvcHBpbmcgcmVjb3JkXCIpO1xuICAgIHRoaXMubWVkaWFSZWNvcmRlci5zdG9wKCk7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuICAgIC8vY29uc29sZS5sb2coJ1JlY29yZGVkIEJsb2JzOiAnLCB0aGlzLnJlY29yZGVkQmxvYnMpO1xuICAgIHRoaXMuZG93bmxvYWQoKTtcbiAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcIlwiO1xuICB9XG5cbiAgZG93bmxvYWQoKSB7XG4gICAgdmFyIGJsb2IgPSBuZXcgQmxvYih0aGlzLnJlY29yZGVkQmxvYnMsIHt0eXBlOiAndmlkZW8vd2VibSd9KTtcbiAgICB2YXIgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIGEuaHJlZiA9IHVybDtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBhLmRvd25sb2FkID0gXCJsaXRvcmFsLVwiK2RhdGUuZ2V0RGF0ZSgpK1wiLVwiK2RhdGUuZ2V0RGF0ZSgpK1wiLVwiK2RhdGUuZ2V0SG91cnMoKStcIi1cIitkYXRlLmdldE1pbnV0ZXMoKSsnLndlYm0nO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XG4gICAgYS5jbGljaygpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGEpO1xuICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9LCAxMDApO1xuICAgIHRoaXMucmVjb3JkZWRCbG9icyA9IFtdO1xuICAgIHRoaXMubWVkaWFSZWNvcmRlciA9IG51bGw7XG4gIH1cblxuICBhZGRBZ2VudChwb3Mpe1xuICAgIHZhciBhZ2VudCA9IG5ldyBBZ2VudCh0aGlzLmN0eCwgdGhpcy5zZXR0aW5ncyk7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5zeW5jaHJvLnZhbHVlPT0wKXtcbiAgICAgIGFnZW50LnNldFBhdGgodGhpcy5jdXJyQWdlbnQucG9pbnRzLCB0aGlzLmN1cnJBZ2VudC5zdGVwSW5kZXgpO1xuICAgIH1lbHNle1xuICAgICAgYWdlbnQuc2V0UGF0aCh0aGlzLmN1cnJBZ2VudC5wb2ludHMsIDApO1xuICAgIH1cbiAgICBhZ2VudC5zZXRPZmZzZXQocG9zKTtcbiAgICB0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10ucHVzaChhZ2VudCk7XG4gIH1cblxuICByZW5kZXIoKXtcbiAgICAvL2NvbnNvbGUubG9nKFwicmVuZGVyaW5nXCIpO1xuICAgICBpZih0aGlzLmlzRHJhd2luZyl7XG4gICAgICAgIHRoaXMuY3VyckFnZW50LmFkZFBvaW50KHRoaXMubW91c2VQb3MueCwgdGhpcy5tb3VzZVBvcy55LCB0aGlzLnNldHRpbmdzLnNpemUudmFsdWUpO1xuICAgICAgfVxuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgtdGhpcy5jYW52YXMud2lkdGgvMiwgLXRoaXMuY2FudmFzLmhlaWdodC8yLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5hZ2VudHMubGVuZ3RoOyBpKyspe1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy50cmFjay52YWx1ZVtpXT09dHJ1ZSl7XG4gICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCB0aGlzLmFnZW50c1tpXS5sZW5ndGg7IGorKyl7XG4gICAgICAgICAgdGhpcy5hZ2VudHNbaV1bal0udXBkYXRlKCk7XG4gICAgICAgICAgdGhpcy5hZ2VudHNbaV1bal0uZHJhdygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIuYmluZCh0aGlzKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uQ2FudmFzO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBDb250cm9scyBmcm9tICcuL0NvbnRyb2xzLmpzJztcbmltcG9ydCBBbmltYXRpb25DYW52YXMgZnJvbSAnLi9BbmltYXRpb25DYW52YXMuanMnO1xuaW1wb3J0IE1pZGkgZnJvbSAnLi9NaWRpLmpzJztcbmltcG9ydCBvcHRpb25zIGZyb20gJy4vb3B0aW9ucy5qc29uJztcblxuLy9pbXBvcnQgJy4vQXBwLmNzcyc7XG5cbmNsYXNzIEFwcCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtvcHRpb25zOiBvcHRpb25zLCBzaG93Q29udHJvbHM6IHRydWUsIGtleXNEb3duOiBbXX07XG5cbiAgICB2YXIgc2V0dGluZ3MgPSB7fTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5zdGF0ZS5vcHRpb25zLmxlbmd0aDsgaSsrKXtcbiAgICAgIHZhciBncm91cCA9IHRoaXMuc3RhdGUub3B0aW9uc1tpXS5jb250cm9scztcbiAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBncm91cC5sZW5ndGg7IGorKyl7XG4gICAgICAgIHNldHRpbmdzW2dyb3VwW2pdLm5hbWVdID0gZ3JvdXBbal07XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCl7XG4gICAgdGhpcy5hbmltID0gbmV3IEFuaW1hdGlvbkNhbnZhcyhcImRyYXdcIiwgdGhpcy5zZXR0aW5ncywgdGhpcyk7XG4gICAgdGhpcy5taWRpID0gbmV3IE1pZGkoKTtcbiAgICB0aGlzLnNldFN0YXRlKHttaWRpOiB0aGlzLm1pZGl9KTtcbiAgfVxuICBcbiAgdG9nZ2xlQ29udHJvbHMoKXtcbiAgICBjb25zb2xlLmxvZyhcInRvZ2dsaW5oIGNvbnRyb2xzXCIpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Nob3dDb250cm9sczogdGhpcy5zdGF0ZS5zaG93Q29udHJvbHMgPyBmYWxzZTogdHJ1ZX0pO1xuICB9XG5cbiAgc2V0S2V5c0Rvd24oa2V5cyl7XG4gICAgdGhpcy5zZXRTdGF0ZSh7a2V5c0Rvd246IGtleXN9KTtcbiAgfVxuXG4gIHVwZGF0ZShuZXdWYWx1ZSwgZ3JvdXBJbmRleCwgY29udHJvbEluZGV4LCBwcm9wZXJ0eU5hbWUpe1xuICAgIHZhciBuZXdPcHRpb25zID0gdGhpcy5zdGF0ZS5vcHRpb25zO1xuICAgIG5ld09wdGlvbnNbZ3JvdXBJbmRleF0uY29udHJvbHNbY29udHJvbEluZGV4XVtwcm9wZXJ0eU5hbWVdID0gbmV3VmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b3B0aW9uczogbmV3T3B0aW9uc30pO1xuICB9XG5cbiAgXG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBzdHlsZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICB0b3A6IFwiMHB4XCIsXG4gICAgICBsZWZ0OiBcIjBweFwiLFxuICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgaGVpZ2h0OiBcIjEwMCVcIlxuICAgIH07XG4gICAgdmFyIGNvbnRyb2xzID0gW107XG4gICAgaWYodGhpcy5zdGF0ZS5zaG93Q29udHJvbHMpe1xuICAgICAgY29udHJvbHMgPSA8Q29udHJvbHMgdXBkYXRlPXt0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpfSBtaWRpPXt0aGlzLnN0YXRlLm1pZGl9IGtleXNEb3duPXt0aGlzLnN0YXRlLmtleXNEb3dufSBvcHRpb25zPXt0aGlzLnN0YXRlLm9wdGlvbnN9Lz5cbiAgICB9XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxjYW52YXMgaWQ9XCJkcmF3XCI+PC9jYW52YXM+XG4gICAgICB7Y29udHJvbHN9XG4gICAgPC9kaXY+O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbG9yUGlja2VyIGZyb20gJ2NvbG9yZWFjdCc7XG5cblxuY2xhc3MgQ29sb3JQYWxldHRlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgXG4gIHJlbmRlcigpe1xuICAgIHZhciBzdHlsZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICB3aWR0aDogXCIxNTBweFwiLFxuICAgICAgaGVpZ2h0OiBcIjE1MHB4XCJcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGUgPSB7c3R5bGV9PlxuICAgICAgICAgPENvbG9yUGlja2VyXG4gICAgICBvcGFjaXR5PXt0cnVlfVxuICAgICAgY29sb3I9e3RoaXMucHJvcHMuaW5mby52YWx1ZS5yZ2JTdHJpbmd9XG4gICAgICBvbkNoYW5nZT17dGhpcy5zaG93Q29sb3IuYmluZCh0aGlzKX1cbiAgICAgICAvPiBcbiAgICAgICA8L2Rpdj4pO1xuICAgXG4gIH1cblxuICBzaG93Q29sb3IoY29sb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGNvbG9yKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGUoY29sb3IsIHRoaXMucHJvcHMuZ3JvdXBJbmRleCwgdGhpcy5wcm9wcy5jb250cm9sSW5kZXgsIFwidmFsdWVcIik7XG4gICAgIC8vIHRoaXMuc2V0U3RhdGUoe2NvbG9yOiBjb2xvcn0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbG9yUGFsZXR0ZTtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgU2VsZWN0Q29udHJvbCBmcm9tICcuL1NlbGVjdENvbnRyb2wuanMnO1xuaW1wb3J0IE11bHRpU2VsZWN0IGZyb20gJy4vTXVsdGlTZWxlY3QuanMnO1xuaW1wb3J0IFNsaWRlckNvbnRyb2wgZnJvbSAnLi9TbGlkZXJDb250cm9sLmpzJztcbmltcG9ydCBDb2xvclBhbGV0dGUgZnJvbSAnLi9Db2xvclBhbGV0dGUuanMnO1xuXG5jbGFzcyBDb250cm9sR3JvdXAgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gIFx0IHZhciBjb250cm9scyA9IHRoaXMucHJvcHMuaW5mby5jb250cm9scy5tYXAoZnVuY3Rpb24ob2JqLCBpbmQpe1xuICBcdCBcdGlmKG9iai50eXBlPT1cInNlbGVjdFwiKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZW5kZXJpbmcgc2VsZWN0XCIpO1xuICBcdCBcdFx0cmV0dXJuIDxTZWxlY3RDb250cm9sIHsuLi50aGlzLnByb3BzfSBjb250cm9sSW5kZXg9e2luZH0gaW5mbz17b2JqfSAvPlxuICBcdCBcdH0gZWxzZSBpZihvYmoudHlwZT09XCJzbGlkZXJcIil7XG4gIFx0IFx0XHRyZXR1cm4gPFNsaWRlckNvbnRyb2wgey4uLnRoaXMucHJvcHN9IGNvbnRyb2xJbmRleD17aW5kfSBpbmZvPXtvYmp9IG1pZGk9e3RoaXMucHJvcHMubWlkaX0vPlxuICBcdCBcdH0gZWxzZSBpZihvYmoudHlwZT09XCJjb2xvclwiKXtcbiAgICAgICAgcmV0dXJuIDxDb2xvclBhbGV0dGUgey4uLnRoaXMucHJvcHN9IGNvbnRyb2xJbmRleD17aW5kfSBpbmZvPXtvYmp9IC8+XG4gICAgICB9IGVsc2UgaWYob2JqLnR5cGU9PVwibXVsdGktc2VsZWN0XCIpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwicmVuZGVyaW5nIG11bHRpXCIpO1xuICAgICAgICByZXR1cm4gPE11bHRpU2VsZWN0IHsuLi50aGlzLnByb3BzfSBjb250cm9sSW5kZXg9e2luZH0gaW5mbz17b2JqfSAvPlxuICAgICAgfVxuICBcdCB9LmJpbmQodGhpcykpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbC1ncm91cFwiPlxuICAgICAgIDxoMz57dGhpcy5wcm9wcy5pbmZvLmxhYmVsfTwvaDM+XG4gICAgICAge2NvbnRyb2xzfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sR3JvdXA7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbnRyb2xHcm91cCBmcm9tICcuL0NvbnRyb2xHcm91cC5qcyc7XG5cbmNsYXNzIENvbnRyb2xzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHZhciBncm91cHMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9iaiwgaW5kKXtcbiAgICAgIHJldHVybiA8Q29udHJvbEdyb3VwIGluZm89e29ian0gdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0gbWlkaT17dGhpcy5wcm9wcy5taWRpfSBncm91cEluZGV4PXtpbmR9IGtleXNEb3duPXt0aGlzLnByb3BzLmtleXNEb3dufSBrZXk9e1wiZ3JvdXBzIFwiK2luZH0vPlxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbHNcIj5cbiAgICAgICB7Z3JvdXBzfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9scztcbiIsIi8qdXRpbGl0eSBmdW5jdGlvbnMgZm9yIGNhbGN1bGF0aW5nIHBhdGgqL1xuXG5jbGFzcyBNaWRpIHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICBjb25zb2xlLmxvZyhcImluaXQgbWlkaVwiKTtcbiAgICBuYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MoKS50aGVuKHRoaXMub25NSURJU3VjY2Vzcy5iaW5kKHRoaXMpLCB0aGlzLm9uTUlESUZhaWx1cmUgKTtcbiAgICB0aGlzLmNoYW5uZWxzID0gW107XG4gIH1cblxuICBvbk1JRElTdWNjZXNzKGFjY2Vzcyl7XG4gICAgY29uc29sZS5sb2coYWNjZXNzKTtcbiAgICB0aGlzLm1pZGkgPSBhY2Nlc3M7XG4gICAgdGhpcy5taWRpLmlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KXtlbnRyeS5vbm1pZGltZXNzYWdlID0gdGhpcy5oYW5kbGVNZXNzYWdlLmJpbmQodGhpcyl9LmJpbmQodGhpcykpO1xuICAgLy8gdGhpcy5saXN0SW5wdXRzQW5kT3V0cHV0cyhhY2Nlc3MpO1xuICB9XG5cbiAgc2V0Q2hhbm5lbChjaGFubmVsLCBwYXJlbnQsIGNhbGxiYWNrKXtcbiAgLy8gIGlmKHRoaXMubWlkaSl7XG4gICAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxdID0ge3BhcmVudDogcGFyZW50LCBjYWxsYmFjazogY2FsbGJhY2t9O1xuICAgLyogfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiTk8gTUlESSFcIik7XG4gICAgfSovXG4gIH1cblxuICBsaXN0SW5wdXRzQW5kT3V0cHV0cyggbWlkaUFjY2VzcyApIHtcbiAgICBmb3IgKHZhciBlbnRyeSBvZiBtaWRpQWNjZXNzLmlucHV0cykge1xuICAgICAgdmFyIGlucHV0ID0gZW50cnlbMV07XG4gICAgICBcbiAgICAgIGNvbnNvbGUubG9nKCBcIklucHV0IHBvcnQgW3R5cGU6J1wiICsgaW5wdXQudHlwZSArIFwiJ10gaWQ6J1wiICsgaW5wdXQuaWQgK1xuICAgICAgICBcIicgbWFudWZhY3R1cmVyOidcIiArIGlucHV0Lm1hbnVmYWN0dXJlciArIFwiJyBuYW1lOidcIiArIGlucHV0Lm5hbWUgK1xuICAgICAgICBcIicgdmVyc2lvbjonXCIgKyBpbnB1dC52ZXJzaW9uICsgXCInXCIgKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBlbnRyeSBvZiBtaWRpQWNjZXNzLm91dHB1dHMpIHtcbiAgICAgIC8vdmFyIG91dHB1dCA9IGVudHJ5WzFdO1xuICAgICAgLy8gY29uc29sZS5sb2coIFwiT3V0cHV0IHBvcnQgW3R5cGU6J1wiICsgb3V0cHV0LnR5cGUgKyBcIiddIGlkOidcIiArIG91dHB1dC5pZCArXG4gICAgICAvLyAgIFwiJyBtYW51ZmFjdHVyZXI6J1wiICsgb3V0cHV0Lm1hbnVmYWN0dXJlciArIFwiJyBuYW1lOidcIiArIG91dHB1dC5uYW1lICtcbiAgICAgIC8vICAgXCInIHZlcnNpb246J1wiICsgb3V0cHV0LnZlcnNpb24gKyBcIidcIiApO1xuICAgIH1cbiAgfVxuXG4gIG9uTUlESUZhaWx1cmUobXNnKXtcbiAgICBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBnZXQgbWlkaVwiKTtcbiAgfVxuXG4gIGhhbmRsZU1lc3NhZ2UobXNnKXtcbiAgIC8vIGNvbnNvbGUubG9nKG1zZy5kYXRhKTtcbiAgICB2YXIgY2hhbm5lbCA9IG1zZy5kYXRhWzFdO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuY2hhbm5lbHMpO1xuICAgIGlmKHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0hPW51bGwpe1xuICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmNoYW5uZWxzKVxuICAgICAgdGhpcy5jaGFubmVsc1tjaGFubmVsXS5jYWxsYmFjay5jYWxsKHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0ucGFyZW50LCBtc2cuZGF0YVsyXSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1pZGk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuXG5jbGFzcyBNdWx0aVNlbGVjdCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHVwZGF0ZShpbmQsIHQpe1xuICAgLy8gY29uc29sZS5sb2codC5wcm9wcy5pbmZvKTtcbiAgIHZhciB2YWx1ZXMgPSB0LnByb3BzLmluZm8udmFsdWUuc2xpY2UoKTtcbiAgICBpZih0LnByb3BzLmtleXNEb3duLmluZGV4T2YoMTYpID4gLTEpey8vc2hpZnQga2V5IHByZXNzZWRcbiAgICAgIGNvbnNvbGUubG9nKFwiU0hJRlRcIik7XG4gICAgICB0LnByb3BzLnVwZGF0ZShpbmQsIHQucHJvcHMuZ3JvdXBJbmRleCwgdC5wcm9wcy5jb250cm9sSW5kZXgsIFwicmVjb3JkaW5nXCIpO1xuICAgICAgaWYoIXZhbHVlc1tpbmRdKXtcbiAgICAgICAgdmFsdWVzW2luZF0gPSB0cnVlO1xuICAgICAgICB0LnByb3BzLnVwZGF0ZSh2YWx1ZXMsIHQucHJvcHMuZ3JvdXBJbmRleCwgdC5wcm9wcy5jb250cm9sSW5kZXgsIFwidmFsdWVcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICBcbiAgICAgIHZhbHVlc1tpbmRdID0gdmFsdWVzW2luZF0gPyBmYWxzZSA6IHRydWU7XG4gICAgICB0LnByb3BzLnVwZGF0ZSh2YWx1ZXMsIHQucHJvcHMuZ3JvdXBJbmRleCwgdC5wcm9wcy5jb250cm9sSW5kZXgsIFwidmFsdWVcIik7XG4gICAgfVxuICAgXG4gIH1cblxuICByZW5kZXIoKSB7XG4gIC8vICBjb25zb2xlLmxvZyhcInJlbmRlcmluZyBtdWx0aVwiKTtcbiAgXHQgdmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLmluZm8ub3B0aW9ucy5tYXAoZnVuY3Rpb24obmFtZSwgaW5kKXtcbiAgICAgICAgdmFyIGNsYXNzTmFtZSA9IFwiY29udHJvbC1idXR0b25cIjtcbiAgICAgICAgaWYodGhpcy5wcm9wcy5pbmZvLnZhbHVlW2luZF0pIGNsYXNzTmFtZSs9IFwiIHNlbGVjdGVkXCI7XG4gICAgICAgIGlmKHRoaXMucHJvcHMuaW5mby5yZWNvcmRpbmc9PWluZCkgY2xhc3NOYW1lKz0gXCIgcmVjb3JkaW5nXCI7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBrZXk9e25hbWV9IG9uQ2xpY2s9e3RoaXMudXBkYXRlLmJpbmQobnVsbCwgaW5kLCB0aGlzKX0+e25hbWV9PC9kaXY+XG4gIFx0ICAgXG4gIFx0ICAgXG4gICAgIH0uYmluZCh0aGlzKSk7XG4gICAgIHZhciBsYWJlbCA9IFtdO1xuICAgICBpZih0aGlzLnByb3BzLmluZm8ubGFiZWwpIGxhYmVsID0gKDxoND57dGhpcy5wcm9wcy5pbmZvLmxhYmVsfTwvaDQ+KTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e1wiY29udHJvbC1lbGVtZW50XCJ9PlxuICAgICAgICB7bGFiZWx9XG4gICAgICAge29wdGlvbnN9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE11bHRpU2VsZWN0O1xuIiwiLyp1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgY2FsY3VsYXRpbmcgcGF0aCovXG5pbXBvcnQgU2V0dGluZ3MgZnJvbSAnLi9zZXR0aW5ncy5qc29uJztcblxuY2xhc3MgUGF0aCB7XG4gIHN0YXRpYyByZXZlcnNlKHBvaW50cyl7XG4gICAgcmV0dXJuIHBvaW50cy5yZXZlcnNlKCk7XG4gIH1cblxuICBzdGF0aWMgY2FsY3VsYXRlT2Zmc2V0KHBvaW50cywgb2Zmc2V0LCBpbmRleCwgYm91bmRzQ2hlY2spe1xuICAgIC8qdHJhbnNsYXRlIGJ5IGRpZmZlcmVuY2UgYmV0d2VlbiBvbGQgc3RhcnRpbmcgcG9pbnQgYW5kIG5ldyovXG4gICAgIC8vIFxuICAgaWYocG9pbnRzLmxlbmd0aCA+IGluZGV4KXtcbiAgICBpZihib3VuZHNDaGVjayl7XG4gICAgICBpZihvZmZzZXQueCA+IFNldHRpbmdzLnNpemUudy8yKSBvZmZzZXQueCAtPSBTZXR0aW5ncy5zaXplLnc7XG4gICAgICBpZihvZmZzZXQueCA8IC1TZXR0aW5ncy5zaXplLncvMikgb2Zmc2V0LnggKz0gU2V0dGluZ3Muc2l6ZS53O1xuICAgICAgaWYob2Zmc2V0LnkgPiBTZXR0aW5ncy5zaXplLmgvMikgb2Zmc2V0LnkgLT0gU2V0dGluZ3Muc2l6ZS5oO1xuICAgICAgaWYob2Zmc2V0LnkgPCAtU2V0dGluZ3Muc2l6ZS5oLzIpIG9mZnNldC55ICs9IFNldHRpbmdzLnNpemUuaDtcbiAgICB9XG4gICAgdmFyIG9mZiA9IHt4OiBvZmZzZXQueC1wb2ludHNbaW5kZXhdLngsIHk6IG9mZnNldC55LXBvaW50c1tpbmRleF0ueX1cblxuICAgIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uKHB0KXtcbiAgICAgIHZhciBuZXdQdCA9IHRoaXMuYWRkUG9sYXJDb29yZHMoe3g6IHB0LnggKyBvZmYueCwgeTogcHQueSArIG9mZi55LCBzaXplOiBwdC5zaXplfSk7XG4gICAgICAvLyBpZihuZXdQdC54ID4gd2luZG93LmlubmVyV2lkdGgpIG5ld1B0LnggLT0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAvLyBpZihuZXdQdC54IDwgMCkgbmV3UHQueCArPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIC8vIGlmKG5ld1B0LnkgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIG5ld1B0LnkgLT0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgLy8gaWYobmV3UHQueSA8IDApIG5ld1B0LnkgKz0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgcmV0dXJuIG5ld1B0O1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICB9IGVsc2Uge1xuICAgIHJldHVybiBwb2ludHM7XG4gICB9XG4gICAgXG4gIH1cblxuXG4gIC8qIGNyZWF0ZSBjb250aW51b3VzIGxpbmUgKi9cbiAgc3RhdGljIGFkZE5leHRQb2ludChwb2ludHMpe1xuICAgIGlmKHBvaW50cy5sZW5ndGggPj0gMil7XG4gICAgICB2YXIgb2ZmID0ge3g6IHBvaW50c1sxXS54LXBvaW50c1swXS54LCB5OiBwb2ludHNbMV0ueS1wb2ludHNbMF0ueX07XG4gICAgICB2YXIgbmV3UHQgPSB7eDogcG9pbnRzW3BvaW50cy5sZW5ndGgtMV0ueCArIG9mZi54LCB5OiBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXS55ICsgb2ZmLnksIHNpemU6IHBvaW50c1sxXS5zaXplfTtcbiAgICAgXG4gICAgIC8qIFRPIERPIDogaWYgRU5USVJFIGxpbmUgb3V0c2lkZSBib3VuZHMsIG9mZnNldCBhbGwgcG9pbnRzLiBidXQgd2hhdCBhYm91dCBsYXJnZSBzaGFwZXM/PyBzcGxpdCBsaW5lcz9jKi9cbiAgICAgIC8vIGlmKG5ld1B0LnggPiBTZXR0aW5ncy5zaXplLncvMikgbmV3UHQueCAtPSBTZXR0aW5ncy5zaXplLnc7XG4gICAgICAvLyBpZihuZXdQdC54IDwgLVNldHRpbmdzLnNpemUudy8yKSBuZXdQdC54ICs9IFNldHRpbmdzLnNpemUudztcbiAgICAgIC8vIGlmKG5ld1B0LnkgPiBTZXR0aW5ncy5zaXplLmgvMikgbmV3UHQueSAtPSBTZXR0aW5ncy5zaXplLmg7XG4gICAgICAvLyBpZihuZXdQdC55IDwgLVNldHRpbmdzLnNpemUuaC8yKSBuZXdQdC55ICs9IFNldHRpbmdzLnNpemUuaDtcblxuICAgICAgcG9pbnRzLnNwbGljZSgwLCAxKTtcbiAgICAgIHBvaW50cy5wdXNoKHRoaXMuYWRkUG9sYXJDb29yZHMobmV3UHQpKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHBvaW50cywgbywgaW5kZXgpe1xuICAgIC8vY29uc29sZS5sb2coXCJjYWxjIG9mZnNldFwiLCBvKTtcbiAgICB2YXIgcCA9IHRoaXMudG9Qb2xhcihvKTtcbiAgICAgY29uc29sZS5sb2coXCJyZWN0XCIsIG8pO1xuICAgIGNvbnNvbGUubG9nKFwicG9sYXJcIiwgcCk7XG4gICAgIGNvbnNvbGUubG9nKFwicmUtcmVjdFwiLCB0aGlzLnRvUmVjdChwKSk7XG5cbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5hZGRQb2xhckNvb3JkcyhvKTtcbiAgICBpZihwb2ludHMubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgY29uc29sZS5sb2coXCJvcmlnaW5hbCBwb2ludFwiLCBwb2ludHNbaW5kZXhdKTtcbiAgICAgIHZhciBvZmYgPSB7dGhldGE6IG9mZnNldC50aGV0YSAtIHBvaW50c1tpbmRleF0udGhldGEsIHI6IG9mZnNldC5yIC0gcG9pbnRzW2luZGV4XS5yfTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGlmZmVyZW5jZVwiLCBvZmYpO1xuICAgICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24ocHQpe1xuICAgICAgICB2YXIgbmV3UHQgPSB0aGlzLmFkZFJlY3RDb29yZHMoe3I6IHB0LnIgKyBvZmYuciwgdGhldGE6IHB0LnRoZXRhICsgb2ZmLnRoZXRhLCBzaXplOiBwdC5zaXplfSk7XG4gICAgICAgLy8gdmFyIG5ld1B0ID0gdGhpcy5hZGRSZWN0Q29vcmRzKHt0aGV0YTogcHQudGhldGEgKyBvZmYudGhldGEsIHI6IHB0LnJ9KTtcbiAgICAgICAgcmV0dXJuIG5ld1B0O1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYWRkUmVjdENvb3JkcyhwdCl7XG4gICAgdmFyIHJlY3QgPSB0aGlzLnRvUmVjdChwdCk7XG4gICAgcHQueCA9IHJlY3QueDtcbiAgICBwdC55ID0gcmVjdC55O1xuICAgIHJldHVybiBwdDtcbiAgfVxuXG4gIHN0YXRpYyB0b1JlY3QocHQpe1xuICAgIHZhciB4ID0gcHQucipNYXRoLmNvcyhwdC50aGV0YSk7XG4gICAgdmFyIHkgPSBwdC5yKk1hdGguc2luKHB0LnRoZXRhKTtcbiAgICByZXR1cm4gKHt4OiB4LCB5OiB5fSk7XG4gIH1cblxuICBzdGF0aWMgYWRkUG9sYXJDb29yZHMocHQpe1xuICAgIC8vY29uc29sZS5sb2coXCJwb2ludFwiLCBwdCk7XG4gICAgdmFyIHBvbGFyID0gdGhpcy50b1BvbGFyKHB0KTtcbiAgIC8vIGNvbnNvbGUubG9nKFwicG9sYXJcIiwgcG9sYXIpO1xuICAgIHB0LnRoZXRhID0gcG9sYXIudGhldGE7XG4gICAgcHQuciA9IHBvbGFyLnI7XG4gICAgcmV0dXJuIHB0O1xuICB9XG5cbiAgc3RhdGljIHRvUG9sYXIocHQpe1xuICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIocHQueSAsIHB0LngpO1xuICAgIHZhciByID0gTWF0aC5zcXJ0KHB0LngqcHQueCArIHB0LnkqcHQueSk7XG4gICAgcmV0dXJuICh7dGhldGE6IHRoZXRhLCByOiByfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGF0aDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIFNlbGVjdENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICB1cGRhdGUoaW5kLCB0KXtcbiAgXHR0LnByb3BzLnVwZGF0ZShpbmQsIHQucHJvcHMuZ3JvdXBJbmRleCwgdC5wcm9wcy5jb250cm9sSW5kZXgsIFwidmFsdWVcIik7XG4gIH1cblxuICByZW5kZXIoKSB7XG5cbiAgXHQgdmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLmluZm8ub3B0aW9ucy5tYXAoZnVuY3Rpb24obmFtZSwgaW5kKXtcbiAgXHQgXHR2YXIgaW1nVXJsO1xuICBcdCBcbiAgXHQgXHRpZih0aGlzLnByb3BzLmluZm8udmFsdWU9PT1pbmQpe1xuICBcdCBcdC8vXHRpbWdVcmwgPSByZXF1aXJlKFwiLi8uLi9pbWFnZXMvXCIrbmFtZStcIi1zZWxlY3RlZC0wMS5wbmdcIik7XG4gICAgICAgIGltZ1VybCA9IFwiLi9pbWFnZXMvXCIrbmFtZStcIi1zZWxlY3RlZC0wMS5wbmdcIjtcbiAgXHQgXHR9ZWxzZXtcbiAgXHQgXHQvL1x0aW1nVXJsID0gcmVxdWlyZShcIi4vLi4vaW1hZ2VzL1wiK25hbWUrXCItMDEucG5nXCIpO1xuICAgICAgaW1nVXJsID0gXCIuL2ltYWdlcy9cIituYW1lK1wiLTAxLnBuZ1wiO1xuICBcdCBcdH1cbiAgXHQgXG4gIFx0IFx0cmV0dXJuIDxpbWcgY2xhc3NOYW1lPVwiY29udHJvbC1idXR0b25cIiBzcmM9e2ltZ1VybH0ga2V5PXtuYW1lfSBhbHQ9e25hbWV9IG9uQ2xpY2s9e3RoaXMudXBkYXRlLmJpbmQobnVsbCwgaW5kLCB0aGlzKX0gLz47XG4gIFx0IH0uYmluZCh0aGlzKSk7XG4gICAgIHZhciBsYWJlbCA9IFtdO1xuICAgICBpZih0aGlzLnByb3BzLmluZm8ubGFiZWwpIGxhYmVsID0gKDxoND57dGhpcy5wcm9wcy5pbmZvLmxhYmVsfTwvaDQ+KTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e1wiY29udHJvbC1lbGVtZW50XCJ9PlxuICAgICAgICB7bGFiZWx9XG4gICAgICAge29wdGlvbnN9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGVjdENvbnRyb2w7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuXG5cbmNsYXNzIFNsaWRlckNvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICB1cGRhdGUoZSl7XG4gIFx0Ly9jb25zb2xlLmxvZyhlLnRhcmdldC52YWx1ZSk7XG4gIFx0dGhpcy5wcm9wcy51cGRhdGUoZS50YXJnZXQudmFsdWUsIHRoaXMucHJvcHMuZ3JvdXBJbmRleCwgdGhpcy5wcm9wcy5jb250cm9sSW5kZXgsIFwidmFsdWVcIik7XG4gIH1cblxuICB1cGRhdGVGcm9tTWlkaSh2YWwpe1xuICAgIGNvbnNvbGUubG9nKFwiTUlESSBVUERBVEVcIiwgdmFsLCB0aGlzKTtcbiAgICB2YXIgc2NhbGVkVmFsID0gfn4oKHZhbCsgdGhpcy5wcm9wcy5pbmZvLm1pbikgKiAodGhpcy5wcm9wcy5pbmZvLm1heCAtIHRoaXMucHJvcHMuaW5mby5taW4pIC8gMTI3KS0xO1xuICAgIHRoaXMucHJvcHMudXBkYXRlKHNjYWxlZFZhbCwgdGhpcy5wcm9wcy5ncm91cEluZGV4LCB0aGlzLnByb3BzLmNvbnRyb2xJbmRleCwgXCJ2YWx1ZVwiKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCl7XG5cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgXHQgY29uc29sZS5sb2coXCJtaWRpIGNoYW5uZWxcIiwgdGhpcy5wcm9wcy5taWRpKTtcbiAgICBpZihcIm1pZGlDaGFubmVsXCIgaW4gdGhpcy5wcm9wcy5pbmZvICYmIHRoaXMucHJvcHMubWlkaSl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnByb3BzLm1pZGkuc2V0Q2hhbm5lbCh0aGlzLnByb3BzLmluZm8ubWlkaUNoYW5uZWwsIHRoaXMsIHRoaXMudXBkYXRlRnJvbU1pZGkpO1xuICAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e1wiY29udHJvbC1lbGVtZW50XCJ9PlxuICAgICAgIDxoND57dGhpcy5wcm9wcy5pbmZvLmxhYmVsK1wiOiBcIit0aGlzLnByb3BzLmluZm8udmFsdWV9PC9oND5cbiAgICAgICA8aW5wdXQgdHlwZT1cInJhbmdlXCIgaWQ9XCJteVJhbmdlXCIgbWluPXt0aGlzLnByb3BzLmluZm8ubWlufSBtYXg9e3RoaXMucHJvcHMuaW5mby5tYXh9XG4gICAgICAgdmFsdWU9e3RoaXMucHJvcHMuaW5mby52YWx1ZX0gb25DaGFuZ2U9e3RoaXMudXBkYXRlLmJpbmQodGhpcyl9Lz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyQ29udHJvbDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBBcHAgZnJvbSAnLi9BcHAnO1xuXG5SZWFjdERPTS5yZW5kZXIoXG4gIDxBcHAgLz4sXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jylcbik7XG4iLCJtb2R1bGUuZXhwb3J0cz1bXG5cdHtcblx0XHRcImxhYmVsXCI6IFwiZm9ybWFcIixcblx0XHRcImNvbnRyb2xzXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwic2VsZWN0XCIsIFxuXHRcdFx0XHRcIm5hbWVcIjogXCJzaGFwZVwiLFxuXHRcdFx0XHRcIm9wdGlvbnNcIjogW1wibGluZVwiLCBcImNpcmNsZVwiLCBcInNxdWFyZVwiXSxcblx0XHRcdFx0XCJ2YWx1ZVwiOiAxXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcInR5cGVcIjogXCJzbGlkZXJcIixcblx0XHRcdFx0XCJuYW1lXCI6IFwic2l6ZVwiLFxuXHRcdFx0XHRcImxhYmVsXCI6IFwidGFtYcOxb1wiLFxuXHRcdFx0XHRcInZhbHVlXCI6IDg5LFxuXHRcdFx0XHRcIm1pblwiOiAxLFxuXHRcdFx0XHRcIm1heFwiOiAzMDAsXG5cdFx0XHRcdFwibWlkaUNoYW5uZWxcIjogMFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwic2xpZGVyXCIsXG5cdFx0XHRcdFwibmFtZVwiOiBcImxlbmd0aFwiLFxuXHRcdFx0XHRcImxhYmVsXCI6IFwibG9uZy4gZGUgbGluZWFcIixcblx0XHRcdFx0XCJ2YWx1ZVwiOiAyMCxcblx0XHRcdFx0XCJtaW5cIjogMSxcblx0XHRcdFx0XCJtYXhcIjogMzAwLFxuXHRcdFx0XHRcIm1pZGlDaGFubmVsXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcImNvbG9yXCIsIFxuXHRcdFx0XHRcIm5hbWVcIjogXCJjb2xvclwiLFxuXHRcdFx0XHRcInZhbHVlXCI6IHtcblx0XHRcdFx0XHRcInJnYlN0cmluZ1wiOiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdF1cblx0fSxcblx0e1xuXHRcdFwibGFiZWxcIjogXCJhbmltYWNpw7NuXCIsXG5cdFx0XCJjb250cm9sc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcInNlbGVjdFwiLCBcblx0XHRcdFx0XCJsYWJlbFwiOiBcImNpY2xvXCIsXG5cdFx0XHRcdFwibmFtZVwiOiBcInJlcGVhdFwiLFxuXHRcdFx0XHRcIm9wdGlvbnNcIjogW1wicmVwZWF0LXJlcGVhdFwiLCBcInJlcGVhdC1jb250aW51ZVwiLCBcInJlcGVhdC1yZXZlcnNlXCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcInNlbGVjdFwiLCBcblx0XHRcdFx0XCJsYWJlbFwiOiBcInNpbmNyb25pemFjacOzblwiLFxuXHRcdFx0XHRcIm5hbWVcIjogXCJzeW5jaHJvXCIsXG5cdFx0XHRcdFwib3B0aW9uc1wiOiBbXCJzeW5jaHJvLXN5bmNlZFwiLCBcInN5bmNocm8tb2ZmYmVhdFwiXSxcblx0XHRcdFx0XCJ2YWx1ZVwiOiAxXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcInR5cGVcIjogXCJzZWxlY3RcIiwgXG5cdFx0XHRcdFwibGFiZWxcIjogXCJjb29yZGVuYWRhc1wiLFxuXHRcdFx0XHRcIm5hbWVcIjogXCJjb29yZFR5cGVcIixcblx0XHRcdFx0XCJvcHRpb25zXCI6IFtcImNvb3JkZW5hZGFzLXJlY3RcIiwgXCJjb29yZGVuYWRhcy1wb2xhclwiXSxcblx0XHRcdFx0XCJ2YWx1ZVwiOiAwXG5cdFx0XHR9XG5cdFx0XHRcblxuXHRcdF1cblx0fSxcblx0e1xuXHRcdFwibGFiZWxcIjogXCJ0cmFja1wiLFxuXHRcdFwiY29udHJvbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcInR5cGVcIjogXCJtdWx0aS1zZWxlY3RcIixcblx0XHRcdFx0XCJuYW1lXCI6IFwidHJhY2tcIixcblx0XHRcdFx0XCJsYWJlbFwiOiBcIihjbGljazogdmlzaWJpbGlkYWQsIHNoaWZ0ICsgY2xpY2s6IGdyYWJhcilcIixcblx0XHRcdFx0XCJvcHRpb25zXCI6IFsxLCAyLCAzLCA0XSxcblx0XHRcdFx0XCJ2YWx1ZVwiOiBbdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXG5cdFx0XHRcdFwicmVjb3JkaW5nXCI6IDBcblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XVxuXHR9XG5cbl0iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwic2l6ZVwiIDoge1wid1wiOiAxMjgwLCBcImhcIjogNzIwfVxufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX1NsaWRlciA9IHJlcXVpcmUoJy4vU2xpZGVyJyk7XG5cbnZhciBfU2xpZGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1NsaWRlcik7XG5cbnZhciBfTWFwID0gcmVxdWlyZSgnLi9NYXAnKTtcblxudmFyIF9NYXAyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTWFwKTtcblxudmFyIF90aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC90aHJvdHRsZScpO1xuXG52YXIgX3Rocm90dGxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblxudmFyIF90aW55Y29sb3IgPSByZXF1aXJlKCd0aW55Y29sb3IyJyk7XG5cbnZhciBfdGlueWNvbG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rpbnljb2xvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIENvbG9yUGlja2VyID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzKENvbG9yUGlja2VyLCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBDb2xvclBpY2tlcihwcm9wcykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb2xvclBpY2tlcik7XG5cbiAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQ29sb3JQaWNrZXIpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgIHZhciBjID0gKDAsIF90aW55Y29sb3IyLmRlZmF1bHQpKF90aGlzLnByb3BzLmNvbG9yKS50b0hzdigpO1xuICAgIF90aGlzLnN0YXRlID0ge1xuICAgICAgY29sb3I6IF90aGlzLnRvUGVyY2VudGFnZShjKVxuICAgIH07XG5cbiAgICBfdGhpcy50aHJvdHRsZSA9ICgwLCBfdGhyb3R0bGUyLmRlZmF1bHQpKGZ1bmN0aW9uIChmbiwgZGF0YSkge1xuICAgICAgZm4oZGF0YSk7XG4gICAgfSwgMTAwKTtcblxuICAgIF90aGlzLmhhbmRsZVNhdHVyYXRpb25WYWx1ZUNoYW5nZSA9IF90aGlzLmhhbmRsZVNhdHVyYXRpb25WYWx1ZUNoYW5nZS5iaW5kKF90aGlzKTtcbiAgICBfdGhpcy5oYW5kbGVIdWVDaGFuZ2UgPSBfdGhpcy5oYW5kbGVIdWVDaGFuZ2UuYmluZChfdGhpcyk7XG4gICAgX3RoaXMuaGFuZGxlQWxwaGFDaGFuZ2UgPSBfdGhpcy5oYW5kbGVBbHBoYUNoYW5nZS5iaW5kKF90aGlzKTtcbiAgICBfdGhpcy5zaG93TGFzdFZhbHVlID0gX3RoaXMuc2hvd0xhc3RWYWx1ZS5iaW5kKF90aGlzKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ29sb3JQaWNrZXIsIFt7XG4gICAga2V5OiAnY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICBpZiAoIV90aW55Y29sb3IyLmRlZmF1bHQuZXF1YWxzKG5leHRQcm9wcy5jb2xvciwgdGhpcy5zdGF0ZS5jb2xvcikpIHtcbiAgICAgICAgdmFyIGMgPSAoMCwgX3Rpbnljb2xvcjIuZGVmYXVsdCkobmV4dFByb3BzLmNvbG9yKS50b0hzdigpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBjb2xvcjogdGhpcy50b1BlcmNlbnRhZ2UoYylcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndG9QZXJjZW50YWdlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9QZXJjZW50YWdlKGhzdikge1xuICAgICAgdmFyIGggPSBoc3YuaDtcbiAgICAgIHZhciBzID0gaHN2LnM7XG4gICAgICB2YXIgdiA9IGhzdi52O1xuICAgICAgdmFyIGEgPSBoc3YuYTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaDogaCxcbiAgICAgICAgczogcyAqIDEwMCxcbiAgICAgICAgdjogdiAqIDEwMCxcbiAgICAgICAgYTogYVxuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVIdWVDaGFuZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVIdWVDaGFuZ2UoaCkge1xuICAgICAgdmFyIF9zdGF0ZSRjb2xvciA9IHRoaXMuc3RhdGUuY29sb3I7XG4gICAgICB2YXIgcyA9IF9zdGF0ZSRjb2xvci5zO1xuICAgICAgdmFyIHYgPSBfc3RhdGUkY29sb3IudjtcbiAgICAgIHZhciBhID0gX3N0YXRlJGNvbG9yLmE7XG5cbiAgICAgIHRoaXMudXBkYXRlKHsgaDogaCwgczogcywgdjogdiwgYTogYSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVTYXR1cmF0aW9uVmFsdWVDaGFuZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVTYXR1cmF0aW9uVmFsdWVDaGFuZ2Uocywgdikge1xuICAgICAgdmFyIF9zdGF0ZSRjb2xvcjIgPSB0aGlzLnN0YXRlLmNvbG9yO1xuICAgICAgdmFyIGggPSBfc3RhdGUkY29sb3IyLmg7XG4gICAgICB2YXIgYSA9IF9zdGF0ZSRjb2xvcjIuYTtcblxuICAgICAgdGhpcy51cGRhdGUoeyBoOiBoLCBzOiBzLCB2OiB2LCBhOiBhIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZUFscGhhQ2hhbmdlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlQWxwaGFDaGFuZ2UoYSkge1xuICAgICAgdmFyIF9zdGF0ZSRjb2xvcjMgPSB0aGlzLnN0YXRlLmNvbG9yO1xuICAgICAgdmFyIGggPSBfc3RhdGUkY29sb3IzLmg7XG4gICAgICB2YXIgcyA9IF9zdGF0ZSRjb2xvcjMucztcbiAgICAgIHZhciB2ID0gX3N0YXRlJGNvbG9yMy52O1xuXG4gICAgICB0aGlzLnVwZGF0ZSh7IGg6IGgsIHM6IHMsIHY6IHYsIGE6IGEgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0QWxwaGEnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBbHBoYSgpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmNvbG9yLmEgPT09IHVuZGVmaW5lZCA/IDEgOiB0aGlzLnN0YXRlLmNvbG9yLmE7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0QmFja2dyb3VuZEh1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJhY2tncm91bmRIdWUoKSB7XG4gICAgICByZXR1cm4gKDAsIF90aW55Y29sb3IyLmRlZmF1bHQpKHtcbiAgICAgICAgaDogdGhpcy5zdGF0ZS5jb2xvci5oLFxuICAgICAgICBzOiAxMDAsXG4gICAgICAgIHY6IDEwMCB9KS50b1JnYlN0cmluZygpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldEJhY2tncm91bmRHcmFkaWVudCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJhY2tncm91bmRHcmFkaWVudCgpIHtcbiAgICAgIHZhciBfc3RhdGUkY29sb3I0ID0gdGhpcy5zdGF0ZS5jb2xvcjtcbiAgICAgIHZhciBoID0gX3N0YXRlJGNvbG9yNC5oO1xuICAgICAgdmFyIHMgPSBfc3RhdGUkY29sb3I0LnM7XG4gICAgICB2YXIgdiA9IF9zdGF0ZSRjb2xvcjQudjtcblxuICAgICAgdmFyIG9wYXF1ZSA9ICgwLCBfdGlueWNvbG9yMi5kZWZhdWx0KSh7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIHM6IHMsXG4gICAgICAgIHY6IHYsXG4gICAgICAgIGE6IDEgfSkudG9SZ2JTdHJpbmcoKTtcbiAgICAgIHJldHVybiAnbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDAsMCwwLDApIDAlLCAnICsgb3BhcXVlICsgJyAxMDAlKSc7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndXBkYXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKGNvbG9yKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY29sb3I6IGNvbG9yIH0pO1xuICAgICAgdGhpcy50aHJvdHRsZSh0aGlzLnByb3BzLm9uQ2hhbmdlLCB0aGlzLm91dHB1dCgpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdvdXRwdXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvdXRwdXQoKSB7XG4gICAgICB2YXIgYyA9ICgwLCBfdGlueWNvbG9yMi5kZWZhdWx0KSh0aGlzLnN0YXRlLmNvbG9yKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhzbDogYy50b0hzbCgpLFxuICAgICAgICBoZXg6IGMudG9IZXgoKSxcbiAgICAgICAgaGV4U3RyaW5nOiBjLnRvSGV4U3RyaW5nKCksXG4gICAgICAgIHJnYjogYy50b1JnYigpLFxuICAgICAgICByZ2JTdHJpbmc6IGMudG9SZ2JTdHJpbmcoKVxuICAgICAgfTtcbiAgICAgIHJldHVybiBjO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3Nob3dMYXN0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93TGFzdFZhbHVlKCkge1xuICAgICAgdGhpcy5wcm9wcy5vbkNvbXBsZXRlICYmIHRoaXMucHJvcHMub25Db21wbGV0ZSh0aGlzLm91dHB1dCgpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZW5kZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgX3N0YXRlJGNvbG9yNSA9IHRoaXMuc3RhdGUuY29sb3I7XG4gICAgICB2YXIgaCA9IF9zdGF0ZSRjb2xvcjUuaDtcbiAgICAgIHZhciBzID0gX3N0YXRlJGNvbG9yNS5zO1xuICAgICAgdmFyIHYgPSBfc3RhdGUkY29sb3I1LnY7XG4gICAgICB2YXIgYSA9IF9zdGF0ZSRjb2xvcjUuYTtcblxuICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJ0NvbG9yUGlja2VyJyxcbiAgICAgICAgICBzdHlsZTogdGhpcy5wcm9wcy5zdHlsZSB9LFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfU2xpZGVyMi5kZWZhdWx0LCB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnSHVlU2xpZGVyJyxcbiAgICAgICAgICB2ZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgICB2YWx1ZTogaCxcbiAgICAgICAgICB0eXBlOiAnaHVlJyxcbiAgICAgICAgICBtYXg6IDM2MCxcbiAgICAgICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVIdWVDaGFuZ2UsXG4gICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5zaG93TGFzdFZhbHVlLFxuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICByaWdodDogJzEuM2VtJyxcbiAgICAgICAgICAgIGJvdHRvbTogdGhpcy5wcm9wcy5vcGFjaXR5ID8gJzIuNWVtJyA6ICcxLjNlbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRyYWNrU3R5bGU6IHtcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzFlbScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSxcXG4gICAgICAgICAgICAgICNGRjAwMDAgMCUsXFxuICAgICAgICAgICAgICAjRkYwMDk5IDEwJSxcXG4gICAgICAgICAgICAgICNDRDAwRkYgMjAlLFxcbiAgICAgICAgICAgICAgIzMyMDBGRiAzMCUsXFxuICAgICAgICAgICAgICAjMDA2NkZGIDQwJSxcXG4gICAgICAgICAgICAgICMwMEZGRkQgNTAlLFxcbiAgICAgICAgICAgICAgIzAwRkY2NiA2MCUsXFxuICAgICAgICAgICAgICAjMzVGRjAwIDcwJSxcXG4gICAgICAgICAgICAgICNDREZGMDAgODAlLFxcbiAgICAgICAgICAgICAgI0ZGOTkwMCA5MCUsXFxuICAgICAgICAgICAgICAjRkYwMDAwIDEwMCVcXG4gICAgICAgICAgICApJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9pbnRlclN0eWxlOiB7XG4gICAgICAgICAgICBib3hTaGFkb3c6ICdpbnNldCAwIDAgMCAxcHggI2NjYywwIDFweCAycHggI2NjYycsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJ1xuICAgICAgICAgIH0gfSksXG4gICAgICAgIHRoaXMucHJvcHMub3BhY2l0eSAmJiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfU2xpZGVyMi5kZWZhdWx0LCB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnT3BhY2l0eVNsaWRlcicsXG4gICAgICAgICAgdHlwZTogJ29wYWNpdHknLFxuICAgICAgICAgIHZhbHVlOiBhLFxuICAgICAgICAgIG1heDogMSxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0aGlzLmdldEJhY2tncm91bmRHcmFkaWVudCgpLFxuICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUFscGhhQ2hhbmdlLFxuICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMuc2hvd0xhc3RWYWx1ZSxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgYm90dG9tOiAnMS4zZW0nLFxuICAgICAgICAgICAgcmlnaHQ6ICcyLjVlbScsXG4gICAgICAgICAgICBoZWlnaHQ6IDgsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZiB1cmwoXCJkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EZGhFQUFRQVBFQUFNdkx5OHpNelAvLy93QUFBQ3dBQUFBQUVBQVFBRUFDSFl4dm9zc3RDQUVNcnE2Smo4MTJZNTlOSURRaXBkWTVYTFdxSDRzVkFEcz1cIikgcmVwZWF0JyxcbiAgICAgICAgICAgIGJhY2tncm91bmRTaXplOiAnOHB4IDhweCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHRyYWNrU3R5bGU6IHtcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzFlbScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDI1NSwyNTUsMjU1LDApIDAlLCAjRkZGIDEwMCUpJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9pbnRlclN0eWxlOiB7XG4gICAgICAgICAgICBib3hTaGFkb3c6ICdpbnNldCAwIDAgMCAxcHggI2NjYywwIDFweCAycHggI2NjYycsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMDAlJ1xuICAgICAgICAgIH0gfSksXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9NYXAyLmRlZmF1bHQsIHtcbiAgICAgICAgICB4OiBzLFxuICAgICAgICAgIHk6IHYsXG4gICAgICAgICAgbWF4OiAxMDAsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmdldEJhY2tncm91bmRIdWUoKSxcbiAgICAgICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVTYXR1cmF0aW9uVmFsdWVDaGFuZ2UsXG4gICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5zaG93TGFzdFZhbHVlLFxuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgcmlnaHQ6ICcyLjVlbScsXG4gICAgICAgICAgICBib3R0b206IHRoaXMucHJvcHMub3BhY2l0eSA/ICcyLjVlbScgOiAnMS4zZW0nXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb2ludGVyU3R5bGU6IHtcbiAgICAgICAgICAgIGJvcmRlckNvbG9yOiAoMCwgX3Rpbnljb2xvcjIuZGVmYXVsdCkodGhpcy5zdGF0ZS5jb2xvcikuaXNEYXJrKCkgPyBcIiNmZmZcIiA6IFwiIzAwMFwiXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ29sb3JQaWNrZXI7XG59KF9yZWFjdC5Db21wb25lbnQpO1xuXG5Db2xvclBpY2tlci5wcm9wVHlwZXMgPSB7XG4gIGNvbG9yOiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICBvbkNoYW5nZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIG9uQ29tcGxldGU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuY1xufTtcblxuQ29sb3JQaWNrZXIuZGVmYXVsdFByb3BzID0ge1xuICBjb2xvcjogJ3JnYmEoMCwwLDAsMSknXG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBDb2xvclBpY2tlcjsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGRyYWdnYWJsZTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX3JlYWN0RG9tID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XG5cbnZhciBfcmVhY3REb20yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3REb20pO1xuXG52YXIgX2hvaXN0Tm9uUmVhY3RTdGF0aWNzID0gcmVxdWlyZSgnaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MnKTtcblxudmFyIF9ob2lzdE5vblJlYWN0U3RhdGljczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9ob2lzdE5vblJlYWN0U3RhdGljcyk7XG5cbnZhciBfdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gvdGhyb3R0bGUnKTtcblxudmFyIF90aHJvdHRsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aHJvdHRsZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIG5vb3AgPSBmdW5jdGlvbiBub29wKCkge307XG52YXIgZ2V0RG9jdW1lbnQgPSBmdW5jdGlvbiBnZXREb2N1bWVudChlbGVtZW50KSB7XG4gIHJldHVybiBlbGVtZW50Lm93bmVyRG9jdW1lbnQ7XG59O1xudmFyIGNsYW1wID0gZnVuY3Rpb24gY2xhbXAodmFsLCBtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsLCBtaW4pLCBtYXgpO1xufTtcbnZhciBnZXREaXNwbGF5TmFtZSA9IGZ1bmN0aW9uIGdldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpIHtcbiAgcmV0dXJuIFdyYXBwZWRDb21wb25lbnQuZGlzcGxheU5hbWUgfHwgV3JhcHBlZENvbXBvbmVudC5uYW1lIHx8ICdDb21wb25lbnQnO1xufTtcblxuZnVuY3Rpb24gZHJhZ2dhYmxlKCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkSW5EcmFnZ2FibGUoV3JhcHBlZENvbXBvbmVudCkge1xuICAgIHZhciBEcmFnZ2FibGUgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICAgICAgX2luaGVyaXRzKERyYWdnYWJsZSwgX0NvbXBvbmVudCk7XG5cbiAgICAgIGZ1bmN0aW9uIERyYWdnYWJsZShwcm9wcykge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgRHJhZ2dhYmxlKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRHJhZ2dhYmxlKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICAgICAgX3RoaXMuc3RhdGUgPSB7IGFjdGl2ZTogZmFsc2UgfTtcblxuICAgICAgICBfdGhpcy50aHJvdHRsZSA9ICgwLCBfdGhyb3R0bGUyLmRlZmF1bHQpKGZ1bmN0aW9uIChmbiwgZGF0YSkge1xuICAgICAgICAgIHJldHVybiBmbihkYXRhKTtcbiAgICAgICAgfSwgMzApO1xuICAgICAgICBfdGhpcy5nZXRQZXJjZW50YWdlVmFsdWUgPSBfdGhpcy5nZXRQZXJjZW50YWdlVmFsdWUuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLnN0YXJ0VXBkYXRlcyA9IF90aGlzLnN0YXJ0VXBkYXRlcy5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGxlVXBkYXRlID0gX3RoaXMuaGFuZGxlVXBkYXRlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5zdG9wVXBkYXRlcyA9IF90aGlzLnN0b3BVcGRhdGVzLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5nZXRQb3NpdGlvbiA9IF90aGlzLmdldFBvc2l0aW9uLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5nZXRTY2FsZWRWYWx1ZSA9IF90aGlzLmdldFNjYWxlZFZhbHVlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QgPSBfdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLnVwZGF0ZVBvc2l0aW9uID0gX3RoaXMudXBkYXRlUG9zaXRpb24uYmluZChfdGhpcyk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgIH1cblxuICAgICAgX2NyZWF0ZUNsYXNzKERyYWdnYWJsZSwgW3tcbiAgICAgICAga2V5OiAnY29tcG9uZW50RGlkTW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgICAgICAgdGhpcy5kb2N1bWVudCA9IGdldERvY3VtZW50KF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZSh0aGlzKSk7XG4gICAgICAgICAgdmFyIHdpbmRvdyA9IHRoaXMud2luZG93ID0gdGhpcy5kb2N1bWVudC5kZWZhdWx0VmlldztcblxuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KTtcbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCk7XG5cbiAgICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudFdpbGxVbm1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgICAgICAgIHZhciB3aW5kb3cgPSB0aGlzLndpbmRvdztcblxuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KTtcbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc3RhcnRVcGRhdGVzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0YXJ0VXBkYXRlcyhlKSB7XG4gICAgICAgICAgdmFyIGRvY3VtZW50ID0gdGhpcy5kb2N1bWVudDtcblxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLmhhbmRsZVVwZGF0ZSk7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmhhbmRsZVVwZGF0ZSk7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5zdG9wVXBkYXRlcyk7XG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuc3RvcFVwZGF0ZXMpO1xuXG4gICAgICAgICAgdmFyIF9nZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24oZSk7XG5cbiAgICAgICAgICB2YXIgeCA9IF9nZXRQb3NpdGlvbi54O1xuICAgICAgICAgIHZhciB5ID0gX2dldFBvc2l0aW9uLnk7XG5cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oeyB4OiB4LCB5OiB5IH0pO1xuICAgICAgICAgIC8vIHRoaXMudGhyb3R0bGUodGhpcy51cGRhdGVQb3NpdGlvbiwgeyB4LCB5IH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2hhbmRsZVVwZGF0ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVVcGRhdGUoZSkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgX2dldFBvc2l0aW9uMiA9IHRoaXMuZ2V0UG9zaXRpb24oZSk7XG5cbiAgICAgICAgICAgIHZhciB4ID0gX2dldFBvc2l0aW9uMi54O1xuICAgICAgICAgICAgdmFyIHkgPSBfZ2V0UG9zaXRpb24yLnk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oeyB4OiB4LCB5OiB5IH0pO1xuICAgICAgICAgICAgLy8gdGhpcy50aHJvdHRsZSh0aGlzLnVwZGF0ZVBvc2l0aW9uLCB7IHgsIHkgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3N0b3BVcGRhdGVzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN0b3BVcGRhdGVzKCkge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZSkge1xuICAgICAgICAgICAgdmFyIGRvY3VtZW50ID0gdGhpcy5kb2N1bWVudDtcblxuXG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuaGFuZGxlVXBkYXRlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5oYW5kbGVVcGRhdGUpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcy5zdG9wVXBkYXRlcyk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5zdG9wVXBkYXRlcyk7XG5cbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Db21wbGV0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogZmFsc2UgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3VwZGF0ZVBvc2l0aW9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZVBvc2l0aW9uKF9yZWYpIHtcbiAgICAgICAgICB2YXIgY2xpZW50WCA9IF9yZWYueDtcbiAgICAgICAgICB2YXIgY2xpZW50WSA9IF9yZWYueTtcbiAgICAgICAgICB2YXIgcmVjdCA9IHRoaXMuc3RhdGUucmVjdDtcblxuXG4gICAgICAgICAgaWYgKG9wdGlvbnMuc2luZ2xlKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLnByb3BzLnZlcnRpY2FsID8gKHJlY3QuYm90dG9tIC0gY2xpZW50WSkgLyByZWN0LmhlaWdodCA6IChjbGllbnRYIC0gcmVjdC5sZWZ0KSAvIHJlY3Qud2lkdGg7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmdldFNjYWxlZFZhbHVlKHZhbHVlKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHggPSAoY2xpZW50WCAtIHJlY3QubGVmdCkgLyByZWN0LndpZHRoO1xuICAgICAgICAgIHZhciB5ID0gKHJlY3QuYm90dG9tIC0gY2xpZW50WSkgLyByZWN0LmhlaWdodDtcbiAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmdldFNjYWxlZFZhbHVlKHgpLCB0aGlzLmdldFNjYWxlZFZhbHVlKHkpKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRQb3NpdGlvbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQb3NpdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUudG91Y2hlcykge1xuICAgICAgICAgICAgZSA9IGUudG91Y2hlc1swXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZS5jbGllbnRYLFxuICAgICAgICAgICAgeTogZS5jbGllbnRZXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRQZXJjZW50YWdlVmFsdWUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UGVyY2VudGFnZVZhbHVlKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlIC8gdGhpcy5wcm9wcy5tYXggKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRTY2FsZWRWYWx1ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTY2FsZWRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBjbGFtcCh2YWx1ZSwgMCwgMSkgKiB0aGlzLnByb3BzLm1heDtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVCb3VuZGluZ1JlY3QnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlQm91bmRpbmdSZWN0KCkge1xuICAgICAgICAgIHZhciByZWN0ID0gX3JlYWN0RG9tMi5kZWZhdWx0LmZpbmRET01Ob2RlKHRoaXMpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWN0OiByZWN0IH0pO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3JlbmRlcicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFdyYXBwZWRDb21wb25lbnQsIF9leHRlbmRzKHt9LCB0aGlzLnByb3BzLCB0aGlzLnN0YXRlLCB7XG4gICAgICAgICAgICBzdGFydFVwZGF0ZXM6IHRoaXMuc3RhcnRVcGRhdGVzLFxuICAgICAgICAgICAgZ2V0UGVyY2VudGFnZVZhbHVlOiB0aGlzLmdldFBlcmNlbnRhZ2VWYWx1ZSB9KSk7XG4gICAgICAgIH1cbiAgICAgIH1dKTtcblxuICAgICAgcmV0dXJuIERyYWdnYWJsZTtcbiAgICB9KF9yZWFjdC5Db21wb25lbnQpO1xuXG4gICAgRHJhZ2dhYmxlLmRpc3BsYXlOYW1lID0gJ2RyYWdnYWJsZSgnICsgZ2V0RGlzcGxheU5hbWUoV3JhcHBlZENvbXBvbmVudCkgKyAnKSc7XG4gICAgRHJhZ2dhYmxlLldyYXBwZWRDb21wb25lbnQgPSBXcmFwcGVkQ29tcG9uZW50O1xuICAgIERyYWdnYWJsZS5wcm9wVHlwZXMgPSB7XG4gICAgICBvbkNoYW5nZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgICBvbkNvbXBsZXRlOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgICBtYXg6IF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG4gICAgfTtcbiAgICBEcmFnZ2FibGUuZGVmYXVsdFByb3BzID0ge1xuICAgICAgb25DaGFuZ2U6IG5vb3AsXG4gICAgICBvbkNvbXBsZXRlOiBub29wLFxuICAgICAgbWF4OiAxXG4gICAgfTtcblxuICAgIHJldHVybiAoMCwgX2hvaXN0Tm9uUmVhY3RTdGF0aWNzMi5kZWZhdWx0KShEcmFnZ2FibGUsIFdyYXBwZWRDb21wb25lbnQpO1xuICB9O1xufSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0RyYWdnYWJsZSA9IHJlcXVpcmUoJy4vRHJhZ2dhYmxlJyk7XG5cbnZhciBfRHJhZ2dhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RyYWdnYWJsZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIE1hcCA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gIF9pbmhlcml0cyhNYXAsIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIE1hcCgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTWFwKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTWFwKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhNYXAsIFt7XG4gICAga2V5OiAnZ2V0TWFwU3R5bGVzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TWFwU3R5bGVzKCkge1xuICAgICAgdmFyIF9NYXAkZGVmYXVsdFN0eWxlcyA9IE1hcC5kZWZhdWx0U3R5bGVzO1xuICAgICAgdmFyIG1hcCA9IF9NYXAkZGVmYXVsdFN0eWxlcy5tYXA7XG4gICAgICB2YXIgbWFwQWN0aXZlID0gX01hcCRkZWZhdWx0U3R5bGVzLm1hcEFjdGl2ZTtcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG1hcCwgdGhpcy5wcm9wcy5zdHlsZSAmJiB0aGlzLnByb3BzLnN0eWxlLCB0aGlzLnByb3BzLmFjdGl2ZSAmJiBtYXBBY3RpdmUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldFBvaW50ZXJTdHlsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQb2ludGVyU3R5bGVzKCkge1xuICAgICAgdmFyIF9NYXAkZGVmYXVsdFN0eWxlczIgPSBNYXAuZGVmYXVsdFN0eWxlcztcbiAgICAgIHZhciBwb2ludGVyID0gX01hcCRkZWZhdWx0U3R5bGVzMi5wb2ludGVyO1xuICAgICAgdmFyIHBvaW50ZXJEYXJrID0gX01hcCRkZWZhdWx0U3R5bGVzMi5wb2ludGVyRGFyaztcbiAgICAgIHZhciBwb2ludGVyTGlnaHQgPSBfTWFwJGRlZmF1bHRTdHlsZXMyLnBvaW50ZXJMaWdodDtcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHBvaW50ZXIsIHRoaXMucHJvcHMucG9pbnRlclN0eWxlICYmIHRoaXMucHJvcHMucG9pbnRlclN0eWxlLCB7XG4gICAgICAgIGxlZnQ6IHRoaXMucHJvcHMuZ2V0UGVyY2VudGFnZVZhbHVlKHRoaXMucHJvcHMueCksXG4gICAgICAgIGJvdHRvbTogdGhpcy5wcm9wcy5nZXRQZXJjZW50YWdlVmFsdWUodGhpcy5wcm9wcy55KVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0QmdTdHlsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCZ1N0eWxlcygpIHtcbiAgICAgIHZhciBiZyA9IE1hcC5kZWZhdWx0U3R5bGVzLmJnO1xuICAgICAgdmFyIGJhY2tncm91bmRDb2xvciA9IHRoaXMucHJvcHMuYmFja2dyb3VuZENvbG9yO1xuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYmcsIHsgYmFja2dyb3VuZENvbG9yOiBiYWNrZ3JvdW5kQ29sb3IgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIGJnT3ZlcmxheSA9IE1hcC5kZWZhdWx0U3R5bGVzLmJnT3ZlcmxheTtcblxuICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUsXG4gICAgICAgICAgc3R5bGU6IHRoaXMuZ2V0TWFwU3R5bGVzKCksXG4gICAgICAgICAgb25Nb3VzZURvd246IHRoaXMucHJvcHMuc3RhcnRVcGRhdGVzLFxuICAgICAgICAgIG9uVG91Y2hTdGFydDogdGhpcy5wcm9wcy5zdGFydFVwZGF0ZXMgfSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgeyBjbGFzc05hbWU6ICdNYXBfX0JhY2tncm91bmQnLCBzdHlsZTogdGhpcy5nZXRCZ1N0eWxlcygpIH0sXG4gICAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nLCB7IGNsYXNzTmFtZTogJ01hcF9fQmFja2dyb3VuZF9fb3ZlcmxheScsIHN0eWxlOiBiZ092ZXJsYXkgfSlcbiAgICAgICAgKSxcbiAgICAgICAgdGhpcy5wcm9wcy5yZWN0ICYmIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ01hcF9fUG9pbnRlcicsIHN0eWxlOiB0aGlzLmdldFBvaW50ZXJTdHlsZXMoKSB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gTWFwO1xufShfcmVhY3QuQ29tcG9uZW50KTtcblxuTWFwLnByb3BUeXBlcyA9IHtcbiAgeDogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgeTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgYmFja2dyb3VuZENvbG9yOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLnN0cmluZyxcbiAgY2xhc3NOYW1lOiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuTWFwLmRlZmF1bHRQcm9wcyA9IHtcbiAgeDogMCxcbiAgeTogMCxcbiAgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICBjbGFzc05hbWU6ICdNYXAnXG59O1xuXG5NYXAuZGVmYXVsdFN0eWxlcyA9IHtcbiAgLy8gTWFwXG4gIG1hcDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBib3R0b206IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgbGVmdDogMCxcbiAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnXG4gIH0sXG4gIG1hcEFjdGl2ZToge1xuICAgIGN1cnNvcjogJ25vbmUnXG4gIH0sXG5cbiAgLy8gUG9pbnRlclxuICBwb2ludGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgd2lkdGg6IDEwLFxuICAgIGhlaWdodDogMTAsXG4gICAgbWFyZ2luTGVmdDogLTUsXG4gICAgbWFyZ2luQm90dG9tOiAtNSxcbiAgICBib3JkZXJSYWRpdXM6ICcxMDAlJyxcbiAgICBib3JkZXI6ICcxcHggc29saWQnLFxuICAgIHdpbGxDaGFuZ2U6ICdhdXRvJ1xuICB9LFxuXG4gIC8vIEJhY2tncm91bmRcbiAgYmc6IHtcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB3aWR0aDogJzEwMCUnXG4gIH0sXG4gIGJnT3ZlcmxheToge1xuICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCByZ2JhKDAsMCwwLDApIDAlLHJnYmEoMCwwLDAsMSkgMTAwJSksXFxuICAgICAgICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoMjU1LDI1NSwyNTUsMSkgMCUscmdiYSgyNTUsMjU1LDI1NSwwKSAxMDAlKSdcbiAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9EcmFnZ2FibGUyLmRlZmF1bHQpKCkoTWFwKTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfaG9yaXpvbnRhbFNsaWRlcjtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxudmFyIF9yZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBfcmVhY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcmVhY3QpO1xuXG52YXIgX0RyYWdnYWJsZSA9IHJlcXVpcmUoJy4vRHJhZ2dhYmxlJyk7XG5cbnZhciBfRHJhZ2dhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RyYWdnYWJsZSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIFNsaWRlciA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gIF9pbmhlcml0cyhTbGlkZXIsIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIFNsaWRlcigpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2xpZGVyKTtcblxuICAgIHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoU2xpZGVyKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhTbGlkZXIsIFt7XG4gICAga2V5OiAnZ2V0UG9pbnRlclN0eWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvaW50ZXJTdHlsZXMoKSB7XG4gICAgICB2YXIgcG9pbnRlciA9IFNsaWRlci5kZWZhdWx0U3R5bGVzLnBvaW50ZXI7XG5cbiAgICAgIHZhciBhdHRyID0gdGhpcy5wcm9wcy52ZXJ0aWNhbCA/ICdib3R0b20nIDogJ2xlZnQnO1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHBvaW50ZXIsIHRoaXMucHJvcHMucG9pbnRlclN0eWxlICYmIHRoaXMucHJvcHMucG9pbnRlclN0eWxlLCBfZGVmaW5lUHJvcGVydHkoe30sIGF0dHIsIHRoaXMucHJvcHMuZ2V0UGVyY2VudGFnZVZhbHVlKHRoaXMucHJvcHMudmFsdWUpKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0U2xpZGVyU3R5bGVzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2xpZGVyU3R5bGVzKCkge1xuICAgICAgdmFyIF9TbGlkZXIkZGVmYXVsdFN0eWxlcyA9IFNsaWRlci5kZWZhdWx0U3R5bGVzO1xuICAgICAgdmFyIHNsaWRlciA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlcy5zbGlkZXI7XG4gICAgICB2YXIgdmVydGljYWxTbGlkZXIgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMudmVydGljYWxTbGlkZXI7XG4gICAgICB2YXIgaG9yaXpvbnRhbFNsaWRlciA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlcy5ob3Jpem9udGFsU2xpZGVyO1xuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc2xpZGVyLCB0aGlzLnByb3BzLnZlcnRpY2FsICYmIHZlcnRpY2FsU2xpZGVyLCAhdGhpcy5wcm9wcy52ZXJ0aWNhbCAmJiBob3Jpem9udGFsU2xpZGVyLCB0aGlzLnByb3BzLnN0eWxlICYmIHRoaXMucHJvcHMuc3R5bGUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldFRyYWNrU3R5bGVzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0VHJhY2tTdHlsZXMoKSB7XG4gICAgICB2YXIgX1NsaWRlciRkZWZhdWx0U3R5bGVzMiA9IFNsaWRlci5kZWZhdWx0U3R5bGVzO1xuICAgICAgdmFyIHRyYWNrID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMi50cmFjaztcbiAgICAgIHZhciBob3Jpem9udGFsVHJhY2sgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMyLmhvcml6b250YWxUcmFjaztcbiAgICAgIHZhciB2ZXJ0aWNhbFRyYWNrID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMi52ZXJ0aWNhbFRyYWNrO1xuICAgICAgdmFyIG9wYWNpdHlUcmFjayA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczIub3BhY2l0eVRyYWNrO1xuICAgICAgdmFyIGh1ZVRyYWNrID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMi5odWVUcmFjaztcblxuICAgICAgdmFyIGJhY2tncm91bmQgPSB0aGlzLnByb3BzLmJhY2tncm91bmQ7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdHJhY2ssIHRoaXMucHJvcHMudmVydGljYWwgJiYgdmVydGljYWxUcmFjaywgIXRoaXMucHJvcHMudmVydGljYWwgJiYgaG9yaXpvbnRhbFRyYWNrLCB0aGlzLnByb3BzLnRyYWNrU3R5bGUgJiYgdGhpcy5wcm9wcy50cmFja1N0eWxlLCB0aGlzLnByb3BzLmJhY2tncm91bmQgJiYgeyBiYWNrZ3JvdW5kOiB0aGlzLnByb3BzLmJhY2tncm91bmQgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF9TbGlkZXIkZGVmYXVsdFN0eWxlczMgPSBTbGlkZXIuZGVmYXVsdFN0eWxlcztcbiAgICAgIHZhciBvcGFjaXR5U2xpZGVyID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMy5vcGFjaXR5U2xpZGVyO1xuICAgICAgdmFyIG9wYWNpdHlTbGlkZXJfX3RyYWNrID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMy5vcGFjaXR5U2xpZGVyX190cmFjaztcblxuICAgICAgcmV0dXJuIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAnZGl2JyxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5wcm9wcy5jbGFzc05hbWUgfHwgJ1NsaWRlcicsXG4gICAgICAgICAgc3R5bGU6IHRoaXMuZ2V0U2xpZGVyU3R5bGVzKCksXG4gICAgICAgICAgb25Nb3VzZURvd246IHRoaXMucHJvcHMuc3RhcnRVcGRhdGVzLFxuICAgICAgICAgIG9uVG91Y2hTdGFydDogdGhpcy5wcm9wcy5zdGFydFVwZGF0ZXMgfSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnU2xpZGVyX19UcmFjaycsIHN0eWxlOiB0aGlzLmdldFRyYWNrU3R5bGVzKCkgfSksXG4gICAgICAgIHRoaXMucHJvcHMucmVjdCAmJiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdTbGlkZXJfX1BvaW50ZXInLCBzdHlsZTogdGhpcy5nZXRQb2ludGVyU3R5bGVzKCkgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNsaWRlcjtcbn0oX3JlYWN0LkNvbXBvbmVudCk7XG5cblNsaWRlci5wcm9wVHlwZXMgPSB7XG4gIHZhbHVlOiBfcmVhY3QuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBiYWNrZ3JvdW5kOiBfcmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufTtcblxuU2xpZGVyLmRlZmF1bHRQcm9wcyA9IHtcbiAgdmFsdWU6IDAsXG4gIGJhY2tncm91bmQ6ICcnXG59O1xuXG5TbGlkZXIuZGVmYXVsdFN0eWxlcyA9IHtcbiAgLy8gU2xpZGVyXG4gIHNsaWRlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHVzZXJTZWxlY3Q6ICdub25lJ1xuICB9LFxuICBob3Jpem9udGFsU2xpZGVyOiAoX2hvcml6b250YWxTbGlkZXIgPSB7XG4gICAgaGVpZ2h0OiA4LFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDBcbiAgfSwgX2RlZmluZVByb3BlcnR5KF9ob3Jpem9udGFsU2xpZGVyLCAnaGVpZ2h0JywgMTApLCBfZGVmaW5lUHJvcGVydHkoX2hvcml6b250YWxTbGlkZXIsICdjdXJzb3InLCAnZXctcmVzaXplJyksIF9ob3Jpem9udGFsU2xpZGVyKSxcbiAgdmVydGljYWxTbGlkZXI6IHtcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIHdpZHRoOiAxMCxcbiAgICBjdXJzb3I6ICducy1yZXNpemUnXG4gIH0sXG5cbiAgLy8gVHJhY2tcbiAgdHJhY2s6IHtcbiAgICBiYWNrZ3JvdW5kOiAnI2VmZWZlZicsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgfSxcbiAgaG9yaXpvbnRhbFRyYWNrOiB7XG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMFxuICB9LFxuICB2ZXJ0aWNhbFRyYWNrOiB7XG4gICAgYm90dG9tOiAwLFxuICAgIHRvcDogMCxcbiAgICB3aWR0aDogJzEwMCUnXG4gIH0sXG5cbiAgLy8gUG9pbnRlclxuICBwb2ludGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgYm90dG9tOiAnNTAlJyxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB3aWR0aDogMTYsXG4gICAgaGVpZ2h0OiAxNixcbiAgICBtYXJnaW5MZWZ0OiAtOCxcbiAgICBtYXJnaW5Cb3R0b206IC04LFxuICAgIGJhY2tncm91bmQ6ICcjZWZlZmVmJyxcbiAgICB3aWxsQ2hhbmdlOiAnYXV0bydcbiAgfVxufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gKDAsIF9EcmFnZ2FibGUyLmRlZmF1bHQpKHsgc2luZ2xlOiB0cnVlIH0pKFNsaWRlcik7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5NYXAgPSBleHBvcnRzLlNsaWRlciA9IHVuZGVmaW5lZDtcblxudmFyIF9Db2xvclBpY2tlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Db2xvclBpY2tlcicpO1xuXG52YXIgX0NvbG9yUGlja2VyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0NvbG9yUGlja2VyKTtcblxudmFyIF9TbGlkZXIyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1NsaWRlcicpO1xuXG52YXIgX1NsaWRlcjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TbGlkZXIyKTtcblxudmFyIF9NYXAyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL01hcCcpO1xuXG52YXIgX01hcDMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9NYXAyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5TbGlkZXIgPSBfU2xpZGVyMy5kZWZhdWx0O1xuZXhwb3J0cy5NYXAgPSBfTWFwMy5kZWZhdWx0O1xuZXhwb3J0cy5kZWZhdWx0ID0gX0NvbG9yUGlja2VyMi5kZWZhdWx0OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIFlhaG9vISBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBOZXcgQlNEIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJFQUNUX1NUQVRJQ1MgPSB7XG4gICAgY2hpbGRDb250ZXh0VHlwZXM6IHRydWUsXG4gICAgY29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGRlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogdHJ1ZSxcbiAgICBnZXREZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgbWl4aW5zOiB0cnVlLFxuICAgIHByb3BUeXBlczogdHJ1ZSxcbiAgICB0eXBlOiB0cnVlXG59O1xuXG52YXIgS05PV05fU1RBVElDUyA9IHtcbiAgICBuYW1lOiB0cnVlLFxuICAgIGxlbmd0aDogdHJ1ZSxcbiAgICBwcm90b3R5cGU6IHRydWUsXG4gICAgY2FsbGVyOiB0cnVlLFxuICAgIGFyZ3VtZW50czogdHJ1ZSxcbiAgICBhcml0eTogdHJ1ZVxufTtcblxudmFyIGlzR2V0T3duUHJvcGVydHlTeW1ib2xzQXZhaWxhYmxlID0gdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09ICdmdW5jdGlvbic7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaG9pc3ROb25SZWFjdFN0YXRpY3ModGFyZ2V0Q29tcG9uZW50LCBzb3VyY2VDb21wb25lbnQsIGN1c3RvbVN0YXRpY3MpIHtcbiAgICBpZiAodHlwZW9mIHNvdXJjZUNvbXBvbmVudCAhPT0gJ3N0cmluZycpIHsgLy8gZG9uJ3QgaG9pc3Qgb3ZlciBzdHJpbmcgKGh0bWwpIGNvbXBvbmVudHNcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2VDb21wb25lbnQpO1xuXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICAgIGlmIChpc0dldE93blByb3BlcnR5U3ltYm9sc0F2YWlsYWJsZSkge1xuICAgICAgICAgICAga2V5cyA9IGtleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc291cmNlQ29tcG9uZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmICghUkVBQ1RfU1RBVElDU1trZXlzW2ldXSAmJiAhS05PV05fU1RBVElDU1trZXlzW2ldXSAmJiAoIWN1c3RvbVN0YXRpY3MgfHwgIWN1c3RvbVN0YXRpY3Nba2V5c1tpXV0pKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0Q29tcG9uZW50W2tleXNbaV1dID0gc291cmNlQ29tcG9uZW50W2tleXNbaV1dO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0Q29tcG9uZW50O1xufTtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCJ2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL2RlYm91bmNlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCIvLyBUaW55Q29sb3IgdjEuNC4xXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYmdyaW5zL1RpbnlDb2xvclxuLy8gQnJpYW4gR3JpbnN0ZWFkLCBNSVQgTGljZW5zZVxuXG4oZnVuY3Rpb24oTWF0aCkge1xuXG52YXIgdHJpbUxlZnQgPSAvXlxccysvLFxuICAgIHRyaW1SaWdodCA9IC9cXHMrJC8sXG4gICAgdGlueUNvdW50ZXIgPSAwLFxuICAgIG1hdGhSb3VuZCA9IE1hdGgucm91bmQsXG4gICAgbWF0aE1pbiA9IE1hdGgubWluLFxuICAgIG1hdGhNYXggPSBNYXRoLm1heCxcbiAgICBtYXRoUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbmZ1bmN0aW9uIHRpbnljb2xvciAoY29sb3IsIG9wdHMpIHtcblxuICAgIGNvbG9yID0gKGNvbG9yKSA/IGNvbG9yIDogJyc7XG4gICAgb3B0cyA9IG9wdHMgfHwgeyB9O1xuXG4gICAgLy8gSWYgaW5wdXQgaXMgYWxyZWFkeSBhIHRpbnljb2xvciwgcmV0dXJuIGl0c2VsZlxuICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIHRpbnljb2xvcikge1xuICAgICAgIHJldHVybiBjb2xvcjtcbiAgICB9XG4gICAgLy8gSWYgd2UgYXJlIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBjYWxsIHVzaW5nIG5ldyBpbnN0ZWFkXG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIHRpbnljb2xvcikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aW55Y29sb3IoY29sb3IsIG9wdHMpO1xuICAgIH1cblxuICAgIHZhciByZ2IgPSBpbnB1dFRvUkdCKGNvbG9yKTtcbiAgICB0aGlzLl9vcmlnaW5hbElucHV0ID0gY29sb3IsXG4gICAgdGhpcy5fciA9IHJnYi5yLFxuICAgIHRoaXMuX2cgPSByZ2IuZyxcbiAgICB0aGlzLl9iID0gcmdiLmIsXG4gICAgdGhpcy5fYSA9IHJnYi5hLFxuICAgIHRoaXMuX3JvdW5kQSA9IG1hdGhSb3VuZCgxMDAqdGhpcy5fYSkgLyAxMDAsXG4gICAgdGhpcy5fZm9ybWF0ID0gb3B0cy5mb3JtYXQgfHwgcmdiLmZvcm1hdDtcbiAgICB0aGlzLl9ncmFkaWVudFR5cGUgPSBvcHRzLmdyYWRpZW50VHlwZTtcblxuICAgIC8vIERvbid0IGxldCB0aGUgcmFuZ2Ugb2YgWzAsMjU1XSBjb21lIGJhY2sgaW4gWzAsMV0uXG4gICAgLy8gUG90ZW50aWFsbHkgbG9zZSBhIGxpdHRsZSBiaXQgb2YgcHJlY2lzaW9uIGhlcmUsIGJ1dCB3aWxsIGZpeCBpc3N1ZXMgd2hlcmVcbiAgICAvLyAuNSBnZXRzIGludGVycHJldGVkIGFzIGhhbGYgb2YgdGhlIHRvdGFsLCBpbnN0ZWFkIG9mIGhhbGYgb2YgMVxuICAgIC8vIElmIGl0IHdhcyBzdXBwb3NlZCB0byBiZSAxMjgsIHRoaXMgd2FzIGFscmVhZHkgdGFrZW4gY2FyZSBvZiBieSBgaW5wdXRUb1JnYmBcbiAgICBpZiAodGhpcy5fciA8IDEpIHsgdGhpcy5fciA9IG1hdGhSb3VuZCh0aGlzLl9yKTsgfVxuICAgIGlmICh0aGlzLl9nIDwgMSkgeyB0aGlzLl9nID0gbWF0aFJvdW5kKHRoaXMuX2cpOyB9XG4gICAgaWYgKHRoaXMuX2IgPCAxKSB7IHRoaXMuX2IgPSBtYXRoUm91bmQodGhpcy5fYik7IH1cblxuICAgIHRoaXMuX29rID0gcmdiLm9rO1xuICAgIHRoaXMuX3RjX2lkID0gdGlueUNvdW50ZXIrKztcbn1cblxudGlueWNvbG9yLnByb3RvdHlwZSA9IHtcbiAgICBpc0Rhcms6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRCcmlnaHRuZXNzKCkgPCAxMjg7XG4gICAgfSxcbiAgICBpc0xpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzRGFyaygpO1xuICAgIH0sXG4gICAgaXNWYWxpZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vaztcbiAgICB9LFxuICAgIGdldE9yaWdpbmFsSW5wdXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX29yaWdpbmFsSW5wdXQ7XG4gICAgfSxcbiAgICBnZXRGb3JtYXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9ybWF0O1xuICAgIH0sXG4gICAgZ2V0QWxwaGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYTtcbiAgICB9LFxuICAgIGdldEJyaWdodG5lc3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2h0dHA6Ly93d3cudzMub3JnL1RSL0FFUlQjY29sb3ItY29udHJhc3RcbiAgICAgICAgdmFyIHJnYiA9IHRoaXMudG9SZ2IoKTtcbiAgICAgICAgcmV0dXJuIChyZ2IuciAqIDI5OSArIHJnYi5nICogNTg3ICsgcmdiLmIgKiAxMTQpIC8gMTAwMDtcbiAgICB9LFxuICAgIGdldEx1bWluYW5jZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vaHR0cDovL3d3dy53My5vcmcvVFIvMjAwOC9SRUMtV0NBRzIwLTIwMDgxMjExLyNyZWxhdGl2ZWx1bWluYW5jZWRlZlxuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICB2YXIgUnNSR0IsIEdzUkdCLCBCc1JHQiwgUiwgRywgQjtcbiAgICAgICAgUnNSR0IgPSByZ2Iuci8yNTU7XG4gICAgICAgIEdzUkdCID0gcmdiLmcvMjU1O1xuICAgICAgICBCc1JHQiA9IHJnYi5iLzI1NTtcblxuICAgICAgICBpZiAoUnNSR0IgPD0gMC4wMzkyOCkge1IgPSBSc1JHQiAvIDEyLjkyO30gZWxzZSB7UiA9IE1hdGgucG93KCgoUnNSR0IgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7fVxuICAgICAgICBpZiAoR3NSR0IgPD0gMC4wMzkyOCkge0cgPSBHc1JHQiAvIDEyLjkyO30gZWxzZSB7RyA9IE1hdGgucG93KCgoR3NSR0IgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7fVxuICAgICAgICBpZiAoQnNSR0IgPD0gMC4wMzkyOCkge0IgPSBCc1JHQiAvIDEyLjkyO30gZWxzZSB7QiA9IE1hdGgucG93KCgoQnNSR0IgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7fVxuICAgICAgICByZXR1cm4gKDAuMjEyNiAqIFIpICsgKDAuNzE1MiAqIEcpICsgKDAuMDcyMiAqIEIpO1xuICAgIH0sXG4gICAgc2V0QWxwaGE6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2EgPSBib3VuZEFscGhhKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fcm91bmRBID0gbWF0aFJvdW5kKDEwMCp0aGlzLl9hKSAvIDEwMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB0b0hzdjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc3YgPSByZ2JUb0hzdih0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgcmV0dXJuIHsgaDogaHN2LmggKiAzNjAsIHM6IGhzdi5zLCB2OiBoc3YudiwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9Ic3ZTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHN2ID0gcmdiVG9Ic3YodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHZhciBoID0gbWF0aFJvdW5kKGhzdi5oICogMzYwKSwgcyA9IG1hdGhSb3VuZChoc3YucyAqIDEwMCksIHYgPSBtYXRoUm91bmQoaHN2LnYgKiAxMDApO1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwiaHN2KFwiICArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIHYgKyBcIiUpXCIgOlxuICAgICAgICAgIFwiaHN2YShcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIHYgKyBcIiUsIFwiKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvSHNsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzbCA9IHJnYlRvSHNsKHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICByZXR1cm4geyBoOiBoc2wuaCAqIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sLCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b0hzbFN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc2wgPSByZ2JUb0hzbCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgdmFyIGggPSBtYXRoUm91bmQoaHNsLmggKiAzNjApLCBzID0gbWF0aFJvdW5kKGhzbC5zICogMTAwKSwgbCA9IG1hdGhSb3VuZChoc2wubCAqIDEwMCk7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJoc2woXCIgICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgbCArIFwiJSlcIiA6XG4gICAgICAgICAgXCJoc2xhKFwiICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgbCArIFwiJSwgXCIrIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9IZXg6IGZ1bmN0aW9uKGFsbG93M0NoYXIpIHtcbiAgICAgICAgcmV0dXJuIHJnYlRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIGFsbG93M0NoYXIpO1xuICAgIH0sXG4gICAgdG9IZXhTdHJpbmc6IGZ1bmN0aW9uKGFsbG93M0NoYXIpIHtcbiAgICAgICAgcmV0dXJuICcjJyArIHRoaXMudG9IZXgoYWxsb3czQ2hhcik7XG4gICAgfSxcbiAgICB0b0hleDg6IGZ1bmN0aW9uKGFsbG93NENoYXIpIHtcbiAgICAgICAgcmV0dXJuIHJnYmFUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCB0aGlzLl9hLCBhbGxvdzRDaGFyKTtcbiAgICB9LFxuICAgIHRvSGV4OFN0cmluZzogZnVuY3Rpb24oYWxsb3c0Q2hhcikge1xuICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hleDgoYWxsb3c0Q2hhcik7XG4gICAgfSxcbiAgICB0b1JnYjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGhSb3VuZCh0aGlzLl9yKSwgZzogbWF0aFJvdW5kKHRoaXMuX2cpLCBiOiBtYXRoUm91bmQodGhpcy5fYiksIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvUmdiU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcInJnYihcIiAgKyBtYXRoUm91bmQodGhpcy5fcikgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fZykgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fYikgKyBcIilcIiA6XG4gICAgICAgICAgXCJyZ2JhKFwiICsgbWF0aFJvdW5kKHRoaXMuX3IpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2cpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2IpICsgXCIsIFwiICsgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b1BlcmNlbnRhZ2VSZ2I6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9yLCAyNTUpICogMTAwKSArIFwiJVwiLCBnOiBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9nLCAyNTUpICogMTAwKSArIFwiJVwiLCBiOiBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9iLCAyNTUpICogMTAwKSArIFwiJVwiLCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b1BlcmNlbnRhZ2VSZ2JTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwicmdiKFwiICArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX3IsIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2csIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2IsIDI1NSkgKiAxMDApICsgXCIlKVwiIDpcbiAgICAgICAgICBcInJnYmEoXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9yLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9nLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9iLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9hID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ0cmFuc3BhcmVudFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2EgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGV4TmFtZXNbcmdiVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgdHJ1ZSldIHx8IGZhbHNlO1xuICAgIH0sXG4gICAgdG9GaWx0ZXI6IGZ1bmN0aW9uKHNlY29uZENvbG9yKSB7XG4gICAgICAgIHZhciBoZXg4U3RyaW5nID0gJyMnICsgcmdiYVRvQXJnYkhleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCB0aGlzLl9hKTtcbiAgICAgICAgdmFyIHNlY29uZEhleDhTdHJpbmcgPSBoZXg4U3RyaW5nO1xuICAgICAgICB2YXIgZ3JhZGllbnRUeXBlID0gdGhpcy5fZ3JhZGllbnRUeXBlID8gXCJHcmFkaWVudFR5cGUgPSAxLCBcIiA6IFwiXCI7XG5cbiAgICAgICAgaWYgKHNlY29uZENvbG9yKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHRpbnljb2xvcihzZWNvbmRDb2xvcik7XG4gICAgICAgICAgICBzZWNvbmRIZXg4U3RyaW5nID0gJyMnICsgcmdiYVRvQXJnYkhleChzLl9yLCBzLl9nLCBzLl9iLCBzLl9hKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcInByb2dpZDpEWEltYWdlVHJhbnNmb3JtLk1pY3Jvc29mdC5ncmFkaWVudChcIitncmFkaWVudFR5cGUrXCJzdGFydENvbG9yc3RyPVwiK2hleDhTdHJpbmcrXCIsZW5kQ29sb3JzdHI9XCIrc2Vjb25kSGV4OFN0cmluZytcIilcIjtcbiAgICB9LFxuICAgIHRvU3RyaW5nOiBmdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGZvcm1hdFNldCA9ICEhZm9ybWF0O1xuICAgICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgdGhpcy5fZm9ybWF0O1xuXG4gICAgICAgIHZhciBmb3JtYXR0ZWRTdHJpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGhhc0FscGhhID0gdGhpcy5fYSA8IDEgJiYgdGhpcy5fYSA+PSAwO1xuICAgICAgICB2YXIgbmVlZHNBbHBoYUZvcm1hdCA9ICFmb3JtYXRTZXQgJiYgaGFzQWxwaGEgJiYgKGZvcm1hdCA9PT0gXCJoZXhcIiB8fCBmb3JtYXQgPT09IFwiaGV4NlwiIHx8IGZvcm1hdCA9PT0gXCJoZXgzXCIgfHwgZm9ybWF0ID09PSBcImhleDRcIiB8fCBmb3JtYXQgPT09IFwiaGV4OFwiIHx8IGZvcm1hdCA9PT0gXCJuYW1lXCIpO1xuXG4gICAgICAgIGlmIChuZWVkc0FscGhhRm9ybWF0KSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIFwidHJhbnNwYXJlbnRcIiwgYWxsIG90aGVyIG5vbi1hbHBoYSBmb3JtYXRzXG4gICAgICAgICAgICAvLyB3aWxsIHJldHVybiByZ2JhIHdoZW4gdGhlcmUgaXMgdHJhbnNwYXJlbmN5LlxuICAgICAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJuYW1lXCIgJiYgdGhpcy5fYSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvTmFtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9SZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcInJnYlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJwcmdiXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9QZXJjZW50YWdlUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXhcIiB8fCBmb3JtYXQgPT09IFwiaGV4NlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4U3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXgzXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXhTdHJpbmcodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXg0XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXg4U3RyaW5nKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4OFwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4OFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvTmFtZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaHNsXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9Ic2xTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhzdlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSHN2U3RyaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0dGVkU3RyaW5nIHx8IHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgICB9LFxuICAgIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRpbnljb2xvcih0aGlzLnRvU3RyaW5nKCkpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlNb2RpZmljYXRpb246IGZ1bmN0aW9uKGZuLCBhcmdzKSB7XG4gICAgICAgIHZhciBjb2xvciA9IGZuLmFwcGx5KG51bGwsIFt0aGlzXS5jb25jYXQoW10uc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgICAgICB0aGlzLl9yID0gY29sb3IuX3I7XG4gICAgICAgIHRoaXMuX2cgPSBjb2xvci5fZztcbiAgICAgICAgdGhpcy5fYiA9IGNvbG9yLl9iO1xuICAgICAgICB0aGlzLnNldEFscGhhKGNvbG9yLl9hKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBsaWdodGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGxpZ2h0ZW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBicmlnaHRlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihicmlnaHRlbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGRhcmtlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihkYXJrZW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBkZXNhdHVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGRlc2F0dXJhdGUsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzYXR1cmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihzYXR1cmF0ZSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGdyZXlzY2FsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihncmV5c2NhbGUsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzcGluOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKHNwaW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcblxuICAgIF9hcHBseUNvbWJpbmF0aW9uOiBmdW5jdGlvbihmbiwgYXJncykge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgW3RoaXNdLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgfSxcbiAgICBhbmFsb2dvdXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihhbmFsb2dvdXMsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBjb21wbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24oY29tcGxlbWVudCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIG1vbm9jaHJvbWF0aWM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihtb25vY2hyb21hdGljLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc3BsaXRjb21wbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24oc3BsaXRjb21wbGVtZW50LCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgdHJpYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbih0cmlhZCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHRldHJhZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKHRldHJhZCwgYXJndW1lbnRzKTtcbiAgICB9XG59O1xuXG4vLyBJZiBpbnB1dCBpcyBhbiBvYmplY3QsIGZvcmNlIDEgaW50byBcIjEuMFwiIHRvIGhhbmRsZSByYXRpb3MgcHJvcGVybHlcbi8vIFN0cmluZyBpbnB1dCByZXF1aXJlcyBcIjEuMFwiIGFzIGlucHV0LCBzbyAxIHdpbGwgYmUgdHJlYXRlZCBhcyAxXG50aW55Y29sb3IuZnJvbVJhdGlvID0gZnVuY3Rpb24oY29sb3IsIG9wdHMpIHtcbiAgICBpZiAodHlwZW9mIGNvbG9yID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgdmFyIG5ld0NvbG9yID0ge307XG4gICAgICAgIGZvciAodmFyIGkgaW4gY29sb3IpIHtcbiAgICAgICAgICAgIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBcImFcIikge1xuICAgICAgICAgICAgICAgICAgICBuZXdDb2xvcltpXSA9IGNvbG9yW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29sb3JbaV0gPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29sb3IgPSBuZXdDb2xvcjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGlueWNvbG9yKGNvbG9yLCBvcHRzKTtcbn07XG5cbi8vIEdpdmVuIGEgc3RyaW5nIG9yIG9iamVjdCwgY29udmVydCB0aGF0IGlucHV0IHRvIFJHQlxuLy8gUG9zc2libGUgc3RyaW5nIGlucHV0czpcbi8vXG4vLyAgICAgXCJyZWRcIlxuLy8gICAgIFwiI2YwMFwiIG9yIFwiZjAwXCJcbi8vICAgICBcIiNmZjAwMDBcIiBvciBcImZmMDAwMFwiXG4vLyAgICAgXCIjZmYwMDAwMDBcIiBvciBcImZmMDAwMDAwXCJcbi8vICAgICBcInJnYiAyNTUgMCAwXCIgb3IgXCJyZ2IgKDI1NSwgMCwgMClcIlxuLy8gICAgIFwicmdiIDEuMCAwIDBcIiBvciBcInJnYiAoMSwgMCwgMClcIlxuLy8gICAgIFwicmdiYSAoMjU1LCAwLCAwLCAxKVwiIG9yIFwicmdiYSAyNTUsIDAsIDAsIDFcIlxuLy8gICAgIFwicmdiYSAoMS4wLCAwLCAwLCAxKVwiIG9yIFwicmdiYSAxLjAsIDAsIDAsIDFcIlxuLy8gICAgIFwiaHNsKDAsIDEwMCUsIDUwJSlcIiBvciBcImhzbCAwIDEwMCUgNTAlXCJcbi8vICAgICBcImhzbGEoMCwgMTAwJSwgNTAlLCAxKVwiIG9yIFwiaHNsYSAwIDEwMCUgNTAlLCAxXCJcbi8vICAgICBcImhzdigwLCAxMDAlLCAxMDAlKVwiIG9yIFwiaHN2IDAgMTAwJSAxMDAlXCJcbi8vXG5mdW5jdGlvbiBpbnB1dFRvUkdCKGNvbG9yKSB7XG5cbiAgICB2YXIgcmdiID0geyByOiAwLCBnOiAwLCBiOiAwIH07XG4gICAgdmFyIGEgPSAxO1xuICAgIHZhciBzID0gbnVsbDtcbiAgICB2YXIgdiA9IG51bGw7XG4gICAgdmFyIGwgPSBudWxsO1xuICAgIHZhciBvayA9IGZhbHNlO1xuICAgIHZhciBmb3JtYXQgPSBmYWxzZTtcblxuICAgIGlmICh0eXBlb2YgY29sb3IgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBjb2xvciA9IHN0cmluZ0lucHV0VG9PYmplY3QoY29sb3IpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY29sb3IgPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAoaXNWYWxpZENTU1VuaXQoY29sb3IucikgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IuZykgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IuYikpIHtcbiAgICAgICAgICAgIHJnYiA9IHJnYlRvUmdiKGNvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmIpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gU3RyaW5nKGNvbG9yLnIpLnN1YnN0cigtMSkgPT09IFwiJVwiID8gXCJwcmdiXCIgOiBcInJnYlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzVmFsaWRDU1NVbml0KGNvbG9yLmgpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLnMpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLnYpKSB7XG4gICAgICAgICAgICBzID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5zKTtcbiAgICAgICAgICAgIHYgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnYpO1xuICAgICAgICAgICAgcmdiID0gaHN2VG9SZ2IoY29sb3IuaCwgcywgdik7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBcImhzdlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzVmFsaWRDU1NVbml0KGNvbG9yLmgpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLnMpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLmwpKSB7XG4gICAgICAgICAgICBzID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5zKTtcbiAgICAgICAgICAgIGwgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLmwpO1xuICAgICAgICAgICAgcmdiID0gaHNsVG9SZ2IoY29sb3IuaCwgcywgbCk7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBcImhzbFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KFwiYVwiKSkge1xuICAgICAgICAgICAgYSA9IGNvbG9yLmE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhID0gYm91bmRBbHBoYShhKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG9rOiBvayxcbiAgICAgICAgZm9ybWF0OiBjb2xvci5mb3JtYXQgfHwgZm9ybWF0LFxuICAgICAgICByOiBtYXRoTWluKDI1NSwgbWF0aE1heChyZ2IuciwgMCkpLFxuICAgICAgICBnOiBtYXRoTWluKDI1NSwgbWF0aE1heChyZ2IuZywgMCkpLFxuICAgICAgICBiOiBtYXRoTWluKDI1NSwgbWF0aE1heChyZ2IuYiwgMCkpLFxuICAgICAgICBhOiBhXG4gICAgfTtcbn1cblxuXG4vLyBDb252ZXJzaW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gYHJnYlRvSHNsYCwgYHJnYlRvSHN2YCwgYGhzbFRvUmdiYCwgYGhzdlRvUmdiYCBtb2RpZmllZCBmcm9tOlxuLy8gPGh0dHA6Ly9tamlqYWNrc29uLmNvbS8yMDA4LzAyL3JnYi10by1oc2wtYW5kLXJnYi10by1oc3YtY29sb3ItbW9kZWwtY29udmVyc2lvbi1hbGdvcml0aG1zLWluLWphdmFzY3JpcHQ+XG5cbi8vIGByZ2JUb1JnYmBcbi8vIEhhbmRsZSBib3VuZHMgLyBwZXJjZW50YWdlIGNoZWNraW5nIHRvIGNvbmZvcm0gdG8gQ1NTIGNvbG9yIHNwZWNcbi8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbG9yLz5cbi8vICpBc3N1bWVzOiogciwgZywgYiBpbiBbMCwgMjU1XSBvciBbMCwgMV1cbi8vICpSZXR1cm5zOiogeyByLCBnLCBiIH0gaW4gWzAsIDI1NV1cbmZ1bmN0aW9uIHJnYlRvUmdiKHIsIGcsIGIpe1xuICAgIHJldHVybiB7XG4gICAgICAgIHI6IGJvdW5kMDEociwgMjU1KSAqIDI1NSxcbiAgICAgICAgZzogYm91bmQwMShnLCAyNTUpICogMjU1LFxuICAgICAgICBiOiBib3VuZDAxKGIsIDI1NSkgKiAyNTVcbiAgICB9O1xufVxuXG4vLyBgcmdiVG9Ic2xgXG4vLyBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNMLlxuLy8gKkFzc3VtZXM6KiByLCBnLCBhbmQgYiBhcmUgY29udGFpbmVkIGluIFswLCAyNTVdIG9yIFswLCAxXVxuLy8gKlJldHVybnM6KiB7IGgsIHMsIGwgfSBpbiBbMCwxXVxuZnVuY3Rpb24gcmdiVG9Ic2wociwgZywgYikge1xuXG4gICAgciA9IGJvdW5kMDEociwgMjU1KTtcbiAgICBnID0gYm91bmQwMShnLCAyNTUpO1xuICAgIGIgPSBib3VuZDAxKGIsIDI1NSk7XG5cbiAgICB2YXIgbWF4ID0gbWF0aE1heChyLCBnLCBiKSwgbWluID0gbWF0aE1pbihyLCBnLCBiKTtcbiAgICB2YXIgaCwgcywgbCA9IChtYXggKyBtaW4pIC8gMjtcblxuICAgIGlmKG1heCA9PSBtaW4pIHtcbiAgICAgICAgaCA9IHMgPSAwOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICAgICAgcyA9IGwgPiAwLjUgPyBkIC8gKDIgLSBtYXggLSBtaW4pIDogZCAvIChtYXggKyBtaW4pO1xuICAgICAgICBzd2l0Y2gobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGggLz0gNjtcbiAgICB9XG5cbiAgICByZXR1cm4geyBoOiBoLCBzOiBzLCBsOiBsIH07XG59XG5cbi8vIGBoc2xUb1JnYmBcbi8vIENvbnZlcnRzIGFuIEhTTCBjb2xvciB2YWx1ZSB0byBSR0IuXG4vLyAqQXNzdW1lczoqIGggaXMgY29udGFpbmVkIGluIFswLCAxXSBvciBbMCwgMzYwXSBhbmQgcyBhbmQgbCBhcmUgY29udGFpbmVkIFswLCAxXSBvciBbMCwgMTAwXVxuLy8gKlJldHVybnM6KiB7IHIsIGcsIGIgfSBpbiB0aGUgc2V0IFswLCAyNTVdXG5mdW5jdGlvbiBoc2xUb1JnYihoLCBzLCBsKSB7XG4gICAgdmFyIHIsIGcsIGI7XG5cbiAgICBoID0gYm91bmQwMShoLCAzNjApO1xuICAgIHMgPSBib3VuZDAxKHMsIDEwMCk7XG4gICAgbCA9IGJvdW5kMDEobCwgMTAwKTtcblxuICAgIGZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCkge1xuICAgICAgICBpZih0IDwgMCkgdCArPSAxO1xuICAgICAgICBpZih0ID4gMSkgdCAtPSAxO1xuICAgICAgICBpZih0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICAgICAgaWYodCA8IDEvMikgcmV0dXJuIHE7XG4gICAgICAgIGlmKHQgPCAyLzMpIHJldHVybiBwICsgKHEgLSBwKSAqICgyLzMgLSB0KSAqIDY7XG4gICAgICAgIHJldHVybiBwO1xuICAgIH1cblxuICAgIGlmKHMgPT09IDApIHtcbiAgICAgICAgciA9IGcgPSBiID0gbDsgLy8gYWNocm9tYXRpY1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHEgPSBsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzO1xuICAgICAgICB2YXIgcCA9IDIgKiBsIC0gcTtcbiAgICAgICAgciA9IGh1ZTJyZ2IocCwgcSwgaCArIDEvMyk7XG4gICAgICAgIGcgPSBodWUycmdiKHAsIHEsIGgpO1xuICAgICAgICBiID0gaHVlMnJnYihwLCBxLCBoIC0gMS8zKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyByOiByICogMjU1LCBnOiBnICogMjU1LCBiOiBiICogMjU1IH07XG59XG5cbi8vIGByZ2JUb0hzdmBcbi8vIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU1Zcbi8vICpBc3N1bWVzOiogciwgZywgYW5kIGIgYXJlIGNvbnRhaW5lZCBpbiB0aGUgc2V0IFswLCAyNTVdIG9yIFswLCAxXVxuLy8gKlJldHVybnM6KiB7IGgsIHMsIHYgfSBpbiBbMCwxXVxuZnVuY3Rpb24gcmdiVG9Ic3YociwgZywgYikge1xuXG4gICAgciA9IGJvdW5kMDEociwgMjU1KTtcbiAgICBnID0gYm91bmQwMShnLCAyNTUpO1xuICAgIGIgPSBib3VuZDAxKGIsIDI1NSk7XG5cbiAgICB2YXIgbWF4ID0gbWF0aE1heChyLCBnLCBiKSwgbWluID0gbWF0aE1pbihyLCBnLCBiKTtcbiAgICB2YXIgaCwgcywgdiA9IG1heDtcblxuICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgIHMgPSBtYXggPT09IDAgPyAwIDogZCAvIG1heDtcblxuICAgIGlmKG1heCA9PSBtaW4pIHtcbiAgICAgICAgaCA9IDA7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN3aXRjaChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGggLz0gNjtcbiAgICB9XG4gICAgcmV0dXJuIHsgaDogaCwgczogcywgdjogdiB9O1xufVxuXG4vLyBgaHN2VG9SZ2JgXG4vLyBDb252ZXJ0cyBhbiBIU1YgY29sb3IgdmFsdWUgdG8gUkdCLlxuLy8gKkFzc3VtZXM6KiBoIGlzIGNvbnRhaW5lZCBpbiBbMCwgMV0gb3IgWzAsIDM2MF0gYW5kIHMgYW5kIHYgYXJlIGNvbnRhaW5lZCBpbiBbMCwgMV0gb3IgWzAsIDEwMF1cbi8vICpSZXR1cm5zOiogeyByLCBnLCBiIH0gaW4gdGhlIHNldCBbMCwgMjU1XVxuIGZ1bmN0aW9uIGhzdlRvUmdiKGgsIHMsIHYpIHtcblxuICAgIGggPSBib3VuZDAxKGgsIDM2MCkgKiA2O1xuICAgIHMgPSBib3VuZDAxKHMsIDEwMCk7XG4gICAgdiA9IGJvdW5kMDEodiwgMTAwKTtcblxuICAgIHZhciBpID0gTWF0aC5mbG9vcihoKSxcbiAgICAgICAgZiA9IGggLSBpLFxuICAgICAgICBwID0gdiAqICgxIC0gcyksXG4gICAgICAgIHEgPSB2ICogKDEgLSBmICogcyksXG4gICAgICAgIHQgPSB2ICogKDEgLSAoMSAtIGYpICogcyksXG4gICAgICAgIG1vZCA9IGkgJSA2LFxuICAgICAgICByID0gW3YsIHEsIHAsIHAsIHQsIHZdW21vZF0sXG4gICAgICAgIGcgPSBbdCwgdiwgdiwgcSwgcCwgcF1bbW9kXSxcbiAgICAgICAgYiA9IFtwLCBwLCB0LCB2LCB2LCBxXVttb2RdO1xuXG4gICAgcmV0dXJuIHsgcjogciAqIDI1NSwgZzogZyAqIDI1NSwgYjogYiAqIDI1NSB9O1xufVxuXG4vLyBgcmdiVG9IZXhgXG4vLyBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdG8gaGV4XG4vLyBBc3N1bWVzIHIsIGcsIGFuZCBiIGFyZSBjb250YWluZWQgaW4gdGhlIHNldCBbMCwgMjU1XVxuLy8gUmV0dXJucyBhIDMgb3IgNiBjaGFyYWN0ZXIgaGV4XG5mdW5jdGlvbiByZ2JUb0hleChyLCBnLCBiLCBhbGxvdzNDaGFyKSB7XG5cbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKG1hdGhSb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChnKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChiKS50b1N0cmluZygxNikpXG4gICAgXTtcblxuICAgIC8vIFJldHVybiBhIDMgY2hhcmFjdGVyIGhleCBpZiBwb3NzaWJsZVxuICAgIGlmIChhbGxvdzNDaGFyICYmIGhleFswXS5jaGFyQXQoMCkgPT0gaGV4WzBdLmNoYXJBdCgxKSAmJiBoZXhbMV0uY2hhckF0KDApID09IGhleFsxXS5jaGFyQXQoMSkgJiYgaGV4WzJdLmNoYXJBdCgwKSA9PSBoZXhbMl0uY2hhckF0KDEpKSB7XG4gICAgICAgIHJldHVybiBoZXhbMF0uY2hhckF0KDApICsgaGV4WzFdLmNoYXJBdCgwKSArIGhleFsyXS5jaGFyQXQoMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhleC5qb2luKFwiXCIpO1xufVxuXG4vLyBgcmdiYVRvSGV4YFxuLy8gQ29udmVydHMgYW4gUkdCQSBjb2xvciBwbHVzIGFscGhhIHRyYW5zcGFyZW5jeSB0byBoZXhcbi8vIEFzc3VtZXMgciwgZywgYiBhcmUgY29udGFpbmVkIGluIHRoZSBzZXQgWzAsIDI1NV0gYW5kXG4vLyBhIGluIFswLCAxXS4gUmV0dXJucyBhIDQgb3IgOCBjaGFyYWN0ZXIgcmdiYSBoZXhcbmZ1bmN0aW9uIHJnYmFUb0hleChyLCBnLCBiLCBhLCBhbGxvdzRDaGFyKSB7XG5cbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKG1hdGhSb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChnKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChiKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKGNvbnZlcnREZWNpbWFsVG9IZXgoYSkpXG4gICAgXTtcblxuICAgIC8vIFJldHVybiBhIDQgY2hhcmFjdGVyIGhleCBpZiBwb3NzaWJsZVxuICAgIGlmIChhbGxvdzRDaGFyICYmIGhleFswXS5jaGFyQXQoMCkgPT0gaGV4WzBdLmNoYXJBdCgxKSAmJiBoZXhbMV0uY2hhckF0KDApID09IGhleFsxXS5jaGFyQXQoMSkgJiYgaGV4WzJdLmNoYXJBdCgwKSA9PSBoZXhbMl0uY2hhckF0KDEpICYmIGhleFszXS5jaGFyQXQoMCkgPT0gaGV4WzNdLmNoYXJBdCgxKSkge1xuICAgICAgICByZXR1cm4gaGV4WzBdLmNoYXJBdCgwKSArIGhleFsxXS5jaGFyQXQoMCkgKyBoZXhbMl0uY2hhckF0KDApICsgaGV4WzNdLmNoYXJBdCgwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGV4LmpvaW4oXCJcIik7XG59XG5cbi8vIGByZ2JhVG9BcmdiSGV4YFxuLy8gQ29udmVydHMgYW4gUkdCQSBjb2xvciB0byBhbiBBUkdCIEhleDggc3RyaW5nXG4vLyBSYXJlbHkgdXNlZCwgYnV0IHJlcXVpcmVkIGZvciBcInRvRmlsdGVyKClcIlxuZnVuY3Rpb24gcmdiYVRvQXJnYkhleChyLCBnLCBiLCBhKSB7XG5cbiAgICB2YXIgaGV4ID0gW1xuICAgICAgICBwYWQyKGNvbnZlcnREZWNpbWFsVG9IZXgoYSkpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChyKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChnKS50b1N0cmluZygxNikpLFxuICAgICAgICBwYWQyKG1hdGhSb3VuZChiKS50b1N0cmluZygxNikpXG4gICAgXTtcblxuICAgIHJldHVybiBoZXguam9pbihcIlwiKTtcbn1cblxuLy8gYGVxdWFsc2Bcbi8vIENhbiBiZSBjYWxsZWQgd2l0aCBhbnkgdGlueWNvbG9yIGlucHV0XG50aW55Y29sb3IuZXF1YWxzID0gZnVuY3Rpb24gKGNvbG9yMSwgY29sb3IyKSB7XG4gICAgaWYgKCFjb2xvcjEgfHwgIWNvbG9yMikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICByZXR1cm4gdGlueWNvbG9yKGNvbG9yMSkudG9SZ2JTdHJpbmcoKSA9PSB0aW55Y29sb3IoY29sb3IyKS50b1JnYlN0cmluZygpO1xufTtcblxudGlueWNvbG9yLnJhbmRvbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aW55Y29sb3IuZnJvbVJhdGlvKHtcbiAgICAgICAgcjogbWF0aFJhbmRvbSgpLFxuICAgICAgICBnOiBtYXRoUmFuZG9tKCksXG4gICAgICAgIGI6IG1hdGhSYW5kb20oKVxuICAgIH0pO1xufTtcblxuXG4vLyBNb2RpZmljYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGFua3MgdG8gbGVzcy5qcyBmb3Igc29tZSBvZiB0aGUgYmFzaWNzIGhlcmVcbi8vIDxodHRwczovL2dpdGh1Yi5jb20vY2xvdWRoZWFkL2xlc3MuanMvYmxvYi9tYXN0ZXIvbGliL2xlc3MvZnVuY3Rpb25zLmpzPlxuXG5mdW5jdGlvbiBkZXNhdHVyYXRlKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5zIC09IGFtb3VudCAvIDEwMDtcbiAgICBoc2wucyA9IGNsYW1wMDEoaHNsLnMpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gc2F0dXJhdGUoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLnMgKz0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5zID0gY2xhbXAwMShoc2wucyk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiBncmV5c2NhbGUoY29sb3IpIHtcbiAgICByZXR1cm4gdGlueWNvbG9yKGNvbG9yKS5kZXNhdHVyYXRlKDEwMCk7XG59XG5cbmZ1bmN0aW9uIGxpZ2h0ZW4gKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5sICs9IGFtb3VudCAvIDEwMDtcbiAgICBoc2wubCA9IGNsYW1wMDEoaHNsLmwpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gYnJpZ2h0ZW4oY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciByZ2IgPSB0aW55Y29sb3IoY29sb3IpLnRvUmdiKCk7XG4gICAgcmdiLnIgPSBtYXRoTWF4KDAsIG1hdGhNaW4oMjU1LCByZ2IuciAtIG1hdGhSb3VuZCgyNTUgKiAtIChhbW91bnQgLyAxMDApKSkpO1xuICAgIHJnYi5nID0gbWF0aE1heCgwLCBtYXRoTWluKDI1NSwgcmdiLmcgLSBtYXRoUm91bmQoMjU1ICogLSAoYW1vdW50IC8gMTAwKSkpKTtcbiAgICByZ2IuYiA9IG1hdGhNYXgoMCwgbWF0aE1pbigyNTUsIHJnYi5iIC0gbWF0aFJvdW5kKDI1NSAqIC0gKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihyZ2IpO1xufVxuXG5mdW5jdGlvbiBkYXJrZW4gKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5sIC09IGFtb3VudCAvIDEwMDtcbiAgICBoc2wubCA9IGNsYW1wMDEoaHNsLmwpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuLy8gU3BpbiB0YWtlcyBhIHBvc2l0aXZlIG9yIG5lZ2F0aXZlIGFtb3VudCB3aXRoaW4gWy0zNjAsIDM2MF0gaW5kaWNhdGluZyB0aGUgY2hhbmdlIG9mIGh1ZS5cbi8vIFZhbHVlcyBvdXRzaWRlIG9mIHRoaXMgcmFuZ2Ugd2lsbCBiZSB3cmFwcGVkIGludG8gdGhpcyByYW5nZS5cbmZ1bmN0aW9uIHNwaW4oY29sb3IsIGFtb3VudCkge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGh1ZSA9IChoc2wuaCArIGFtb3VudCkgJSAzNjA7XG4gICAgaHNsLmggPSBodWUgPCAwID8gMzYwICsgaHVlIDogaHVlO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuLy8gQ29tYmluYXRpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRoYW5rcyB0byBqUXVlcnkgeENvbG9yIGZvciBzb21lIG9mIHRoZSBpZGVhcyBiZWhpbmQgdGhlc2Vcbi8vIDxodHRwczovL2dpdGh1Yi5jb20vaW5mdXNpb24valF1ZXJ5LXhjb2xvci9ibG9iL21hc3Rlci9qcXVlcnkueGNvbG9yLmpzPlxuXG5mdW5jdGlvbiBjb21wbGVtZW50KGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wuaCA9IChoc2wuaCArIDE4MCkgJSAzNjA7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiB0cmlhZChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGggPSBoc2wuaDtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aW55Y29sb3IoY29sb3IpLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDEyMCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAyNDApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSlcbiAgICBdO1xufVxuXG5mdW5jdGlvbiB0ZXRyYWQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBoID0gaHNsLmg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGlueWNvbG9yKGNvbG9yKSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyA5MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAxODApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMjcwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pXG4gICAgXTtcbn1cblxuZnVuY3Rpb24gc3BsaXRjb21wbGVtZW50KGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaCA9IGhzbC5oO1xuICAgIHJldHVybiBbXG4gICAgICAgIHRpbnljb2xvcihjb2xvciksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgNzIpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmx9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAyMTYpICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmx9KVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIGFuYWxvZ291cyhjb2xvciwgcmVzdWx0cywgc2xpY2VzKSB7XG4gICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgNjtcbiAgICBzbGljZXMgPSBzbGljZXMgfHwgMzA7XG5cbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBwYXJ0ID0gMzYwIC8gc2xpY2VzO1xuICAgIHZhciByZXQgPSBbdGlueWNvbG9yKGNvbG9yKV07XG5cbiAgICBmb3IgKGhzbC5oID0gKChoc2wuaCAtIChwYXJ0ICogcmVzdWx0cyA+PiAxKSkgKyA3MjApICUgMzYwOyAtLXJlc3VsdHM7ICkge1xuICAgICAgICBoc2wuaCA9IChoc2wuaCArIHBhcnQpICUgMzYwO1xuICAgICAgICByZXQucHVzaCh0aW55Y29sb3IoaHNsKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIG1vbm9jaHJvbWF0aWMoY29sb3IsIHJlc3VsdHMpIHtcbiAgICByZXN1bHRzID0gcmVzdWx0cyB8fCA2O1xuICAgIHZhciBoc3YgPSB0aW55Y29sb3IoY29sb3IpLnRvSHN2KCk7XG4gICAgdmFyIGggPSBoc3YuaCwgcyA9IGhzdi5zLCB2ID0gaHN2LnY7XG4gICAgdmFyIHJldCA9IFtdO1xuICAgIHZhciBtb2RpZmljYXRpb24gPSAxIC8gcmVzdWx0cztcblxuICAgIHdoaWxlIChyZXN1bHRzLS0pIHtcbiAgICAgICAgcmV0LnB1c2godGlueWNvbG9yKHsgaDogaCwgczogcywgdjogdn0pKTtcbiAgICAgICAgdiA9ICh2ICsgbW9kaWZpY2F0aW9uKSAlIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuLy8gVXRpbGl0eSBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG50aW55Y29sb3IubWl4ID0gZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgNTApO1xuXG4gICAgdmFyIHJnYjEgPSB0aW55Y29sb3IoY29sb3IxKS50b1JnYigpO1xuICAgIHZhciByZ2IyID0gdGlueWNvbG9yKGNvbG9yMikudG9SZ2IoKTtcblxuICAgIHZhciBwID0gYW1vdW50IC8gMTAwO1xuXG4gICAgdmFyIHJnYmEgPSB7XG4gICAgICAgIHI6ICgocmdiMi5yIC0gcmdiMS5yKSAqIHApICsgcmdiMS5yLFxuICAgICAgICBnOiAoKHJnYjIuZyAtIHJnYjEuZykgKiBwKSArIHJnYjEuZyxcbiAgICAgICAgYjogKChyZ2IyLmIgLSByZ2IxLmIpICogcCkgKyByZ2IxLmIsXG4gICAgICAgIGE6ICgocmdiMi5hIC0gcmdiMS5hKSAqIHApICsgcmdiMS5hXG4gICAgfTtcblxuICAgIHJldHVybiB0aW55Y29sb3IocmdiYSk7XG59O1xuXG5cbi8vIFJlYWRhYmlsaXR5IEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA8aHR0cDovL3d3dy53My5vcmcvVFIvMjAwOC9SRUMtV0NBRzIwLTIwMDgxMjExLyNjb250cmFzdC1yYXRpb2RlZiAoV0NBRyBWZXJzaW9uIDIpXG5cbi8vIGBjb250cmFzdGBcbi8vIEFuYWx5emUgdGhlIDIgY29sb3JzIGFuZCByZXR1cm5zIHRoZSBjb2xvciBjb250cmFzdCBkZWZpbmVkIGJ5IChXQ0FHIFZlcnNpb24gMilcbnRpbnljb2xvci5yZWFkYWJpbGl0eSA9IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XG4gICAgdmFyIGMxID0gdGlueWNvbG9yKGNvbG9yMSk7XG4gICAgdmFyIGMyID0gdGlueWNvbG9yKGNvbG9yMik7XG4gICAgcmV0dXJuIChNYXRoLm1heChjMS5nZXRMdW1pbmFuY2UoKSxjMi5nZXRMdW1pbmFuY2UoKSkrMC4wNSkgLyAoTWF0aC5taW4oYzEuZ2V0THVtaW5hbmNlKCksYzIuZ2V0THVtaW5hbmNlKCkpKzAuMDUpO1xufTtcblxuLy8gYGlzUmVhZGFibGVgXG4vLyBFbnN1cmUgdGhhdCBmb3JlZ3JvdW5kIGFuZCBiYWNrZ3JvdW5kIGNvbG9yIGNvbWJpbmF0aW9ucyBtZWV0IFdDQUcyIGd1aWRlbGluZXMuXG4vLyBUaGUgdGhpcmQgYXJndW1lbnQgaXMgYW4gb3B0aW9uYWwgT2JqZWN0LlxuLy8gICAgICB0aGUgJ2xldmVsJyBwcm9wZXJ0eSBzdGF0ZXMgJ0FBJyBvciAnQUFBJyAtIGlmIG1pc3Npbmcgb3IgaW52YWxpZCwgaXQgZGVmYXVsdHMgdG8gJ0FBJztcbi8vICAgICAgdGhlICdzaXplJyBwcm9wZXJ0eSBzdGF0ZXMgJ2xhcmdlJyBvciAnc21hbGwnIC0gaWYgbWlzc2luZyBvciBpbnZhbGlkLCBpdCBkZWZhdWx0cyB0byAnc21hbGwnLlxuLy8gSWYgdGhlIGVudGlyZSBvYmplY3QgaXMgYWJzZW50LCBpc1JlYWRhYmxlIGRlZmF1bHRzIHRvIHtsZXZlbDpcIkFBXCIsc2l6ZTpcInNtYWxsXCJ9LlxuXG4vLyAqRXhhbXBsZSpcbi8vICAgIHRpbnljb2xvci5pc1JlYWRhYmxlKFwiIzAwMFwiLCBcIiMxMTFcIikgPT4gZmFsc2Vcbi8vICAgIHRpbnljb2xvci5pc1JlYWRhYmxlKFwiIzAwMFwiLCBcIiMxMTFcIix7bGV2ZWw6XCJBQVwiLHNpemU6XCJsYXJnZVwifSkgPT4gZmFsc2VcbnRpbnljb2xvci5pc1JlYWRhYmxlID0gZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIsIHdjYWcyKSB7XG4gICAgdmFyIHJlYWRhYmlsaXR5ID0gdGlueWNvbG9yLnJlYWRhYmlsaXR5KGNvbG9yMSwgY29sb3IyKTtcbiAgICB2YXIgd2NhZzJQYXJtcywgb3V0O1xuXG4gICAgb3V0ID0gZmFsc2U7XG5cbiAgICB3Y2FnMlBhcm1zID0gdmFsaWRhdGVXQ0FHMlBhcm1zKHdjYWcyKTtcbiAgICBzd2l0Y2ggKHdjYWcyUGFybXMubGV2ZWwgKyB3Y2FnMlBhcm1zLnNpemUpIHtcbiAgICAgICAgY2FzZSBcIkFBc21hbGxcIjpcbiAgICAgICAgY2FzZSBcIkFBQWxhcmdlXCI6XG4gICAgICAgICAgICBvdXQgPSByZWFkYWJpbGl0eSA+PSA0LjU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFBbGFyZ2VcIjpcbiAgICAgICAgICAgIG91dCA9IHJlYWRhYmlsaXR5ID49IDM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIkFBQXNtYWxsXCI6XG4gICAgICAgICAgICBvdXQgPSByZWFkYWJpbGl0eSA+PSA3O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBvdXQ7XG5cbn07XG5cbi8vIGBtb3N0UmVhZGFibGVgXG4vLyBHaXZlbiBhIGJhc2UgY29sb3IgYW5kIGEgbGlzdCBvZiBwb3NzaWJsZSBmb3JlZ3JvdW5kIG9yIGJhY2tncm91bmRcbi8vIGNvbG9ycyBmb3IgdGhhdCBiYXNlLCByZXR1cm5zIHRoZSBtb3N0IHJlYWRhYmxlIGNvbG9yLlxuLy8gT3B0aW9uYWxseSByZXR1cm5zIEJsYWNrIG9yIFdoaXRlIGlmIHRoZSBtb3N0IHJlYWRhYmxlIGNvbG9yIGlzIHVucmVhZGFibGUuXG4vLyAqRXhhbXBsZSpcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUodGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiMxMjNcIiwgW1wiIzEyNFwiLCBcIiMxMjVcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczpmYWxzZX0pLnRvSGV4U3RyaW5nKCk7IC8vIFwiIzExMjI1NVwiXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjMTIzXCIsIFtcIiMxMjRcIiwgXCIjMTI1XCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6dHJ1ZX0pLnRvSGV4U3RyaW5nKCk7ICAvLyBcIiNmZmZmZmZcIlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiNhODAxNWFcIiwgW1wiI2ZhZjNmM1wiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOnRydWUsbGV2ZWw6XCJBQUFcIixzaXplOlwibGFyZ2VcIn0pLnRvSGV4U3RyaW5nKCk7IC8vIFwiI2ZhZjNmM1wiXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiI2E4MDE1YVwiLCBbXCIjZmFmM2YzXCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6dHJ1ZSxsZXZlbDpcIkFBQVwiLHNpemU6XCJzbWFsbFwifSkudG9IZXhTdHJpbmcoKTsgLy8gXCIjZmZmZmZmXCJcbnRpbnljb2xvci5tb3N0UmVhZGFibGUgPSBmdW5jdGlvbihiYXNlQ29sb3IsIGNvbG9yTGlzdCwgYXJncykge1xuICAgIHZhciBiZXN0Q29sb3IgPSBudWxsO1xuICAgIHZhciBiZXN0U2NvcmUgPSAwO1xuICAgIHZhciByZWFkYWJpbGl0eTtcbiAgICB2YXIgaW5jbHVkZUZhbGxiYWNrQ29sb3JzLCBsZXZlbCwgc2l6ZSA7XG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgaW5jbHVkZUZhbGxiYWNrQ29sb3JzID0gYXJncy5pbmNsdWRlRmFsbGJhY2tDb2xvcnMgO1xuICAgIGxldmVsID0gYXJncy5sZXZlbDtcbiAgICBzaXplID0gYXJncy5zaXplO1xuXG4gICAgZm9yICh2YXIgaT0gMDsgaSA8IGNvbG9yTGlzdC5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgcmVhZGFiaWxpdHkgPSB0aW55Y29sb3IucmVhZGFiaWxpdHkoYmFzZUNvbG9yLCBjb2xvckxpc3RbaV0pO1xuICAgICAgICBpZiAocmVhZGFiaWxpdHkgPiBiZXN0U2NvcmUpIHtcbiAgICAgICAgICAgIGJlc3RTY29yZSA9IHJlYWRhYmlsaXR5O1xuICAgICAgICAgICAgYmVzdENvbG9yID0gdGlueWNvbG9yKGNvbG9yTGlzdFtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGlueWNvbG9yLmlzUmVhZGFibGUoYmFzZUNvbG9yLCBiZXN0Q29sb3IsIHtcImxldmVsXCI6bGV2ZWwsXCJzaXplXCI6c2l6ZX0pIHx8ICFpbmNsdWRlRmFsbGJhY2tDb2xvcnMpIHtcbiAgICAgICAgcmV0dXJuIGJlc3RDb2xvcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFyZ3MuaW5jbHVkZUZhbGxiYWNrQ29sb3JzPWZhbHNlO1xuICAgICAgICByZXR1cm4gdGlueWNvbG9yLm1vc3RSZWFkYWJsZShiYXNlQ29sb3IsW1wiI2ZmZlwiLCBcIiMwMDBcIl0sYXJncyk7XG4gICAgfVxufTtcblxuXG4vLyBCaWcgTGlzdCBvZiBDb2xvcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29sb3IvI3N2Zy1jb2xvcj5cbnZhciBuYW1lcyA9IHRpbnljb2xvci5uYW1lcyA9IHtcbiAgICBhbGljZWJsdWU6IFwiZjBmOGZmXCIsXG4gICAgYW50aXF1ZXdoaXRlOiBcImZhZWJkN1wiLFxuICAgIGFxdWE6IFwiMGZmXCIsXG4gICAgYXF1YW1hcmluZTogXCI3ZmZmZDRcIixcbiAgICBhenVyZTogXCJmMGZmZmZcIixcbiAgICBiZWlnZTogXCJmNWY1ZGNcIixcbiAgICBiaXNxdWU6IFwiZmZlNGM0XCIsXG4gICAgYmxhY2s6IFwiMDAwXCIsXG4gICAgYmxhbmNoZWRhbG1vbmQ6IFwiZmZlYmNkXCIsXG4gICAgYmx1ZTogXCIwMGZcIixcbiAgICBibHVldmlvbGV0OiBcIjhhMmJlMlwiLFxuICAgIGJyb3duOiBcImE1MmEyYVwiLFxuICAgIGJ1cmx5d29vZDogXCJkZWI4ODdcIixcbiAgICBidXJudHNpZW5uYTogXCJlYTdlNWRcIixcbiAgICBjYWRldGJsdWU6IFwiNWY5ZWEwXCIsXG4gICAgY2hhcnRyZXVzZTogXCI3ZmZmMDBcIixcbiAgICBjaG9jb2xhdGU6IFwiZDI2OTFlXCIsXG4gICAgY29yYWw6IFwiZmY3ZjUwXCIsXG4gICAgY29ybmZsb3dlcmJsdWU6IFwiNjQ5NWVkXCIsXG4gICAgY29ybnNpbGs6IFwiZmZmOGRjXCIsXG4gICAgY3JpbXNvbjogXCJkYzE0M2NcIixcbiAgICBjeWFuOiBcIjBmZlwiLFxuICAgIGRhcmtibHVlOiBcIjAwMDA4YlwiLFxuICAgIGRhcmtjeWFuOiBcIjAwOGI4YlwiLFxuICAgIGRhcmtnb2xkZW5yb2Q6IFwiYjg4NjBiXCIsXG4gICAgZGFya2dyYXk6IFwiYTlhOWE5XCIsXG4gICAgZGFya2dyZWVuOiBcIjAwNjQwMFwiLFxuICAgIGRhcmtncmV5OiBcImE5YTlhOVwiLFxuICAgIGRhcmtraGFraTogXCJiZGI3NmJcIixcbiAgICBkYXJrbWFnZW50YTogXCI4YjAwOGJcIixcbiAgICBkYXJrb2xpdmVncmVlbjogXCI1NTZiMmZcIixcbiAgICBkYXJrb3JhbmdlOiBcImZmOGMwMFwiLFxuICAgIGRhcmtvcmNoaWQ6IFwiOTkzMmNjXCIsXG4gICAgZGFya3JlZDogXCI4YjAwMDBcIixcbiAgICBkYXJrc2FsbW9uOiBcImU5OTY3YVwiLFxuICAgIGRhcmtzZWFncmVlbjogXCI4ZmJjOGZcIixcbiAgICBkYXJrc2xhdGVibHVlOiBcIjQ4M2Q4YlwiLFxuICAgIGRhcmtzbGF0ZWdyYXk6IFwiMmY0ZjRmXCIsXG4gICAgZGFya3NsYXRlZ3JleTogXCIyZjRmNGZcIixcbiAgICBkYXJrdHVycXVvaXNlOiBcIjAwY2VkMVwiLFxuICAgIGRhcmt2aW9sZXQ6IFwiOTQwMGQzXCIsXG4gICAgZGVlcHBpbms6IFwiZmYxNDkzXCIsXG4gICAgZGVlcHNreWJsdWU6IFwiMDBiZmZmXCIsXG4gICAgZGltZ3JheTogXCI2OTY5NjlcIixcbiAgICBkaW1ncmV5OiBcIjY5Njk2OVwiLFxuICAgIGRvZGdlcmJsdWU6IFwiMWU5MGZmXCIsXG4gICAgZmlyZWJyaWNrOiBcImIyMjIyMlwiLFxuICAgIGZsb3JhbHdoaXRlOiBcImZmZmFmMFwiLFxuICAgIGZvcmVzdGdyZWVuOiBcIjIyOGIyMlwiLFxuICAgIGZ1Y2hzaWE6IFwiZjBmXCIsXG4gICAgZ2FpbnNib3JvOiBcImRjZGNkY1wiLFxuICAgIGdob3N0d2hpdGU6IFwiZjhmOGZmXCIsXG4gICAgZ29sZDogXCJmZmQ3MDBcIixcbiAgICBnb2xkZW5yb2Q6IFwiZGFhNTIwXCIsXG4gICAgZ3JheTogXCI4MDgwODBcIixcbiAgICBncmVlbjogXCIwMDgwMDBcIixcbiAgICBncmVlbnllbGxvdzogXCJhZGZmMmZcIixcbiAgICBncmV5OiBcIjgwODA4MFwiLFxuICAgIGhvbmV5ZGV3OiBcImYwZmZmMFwiLFxuICAgIGhvdHBpbms6IFwiZmY2OWI0XCIsXG4gICAgaW5kaWFucmVkOiBcImNkNWM1Y1wiLFxuICAgIGluZGlnbzogXCI0YjAwODJcIixcbiAgICBpdm9yeTogXCJmZmZmZjBcIixcbiAgICBraGFraTogXCJmMGU2OGNcIixcbiAgICBsYXZlbmRlcjogXCJlNmU2ZmFcIixcbiAgICBsYXZlbmRlcmJsdXNoOiBcImZmZjBmNVwiLFxuICAgIGxhd25ncmVlbjogXCI3Y2ZjMDBcIixcbiAgICBsZW1vbmNoaWZmb246IFwiZmZmYWNkXCIsXG4gICAgbGlnaHRibHVlOiBcImFkZDhlNlwiLFxuICAgIGxpZ2h0Y29yYWw6IFwiZjA4MDgwXCIsXG4gICAgbGlnaHRjeWFuOiBcImUwZmZmZlwiLFxuICAgIGxpZ2h0Z29sZGVucm9keWVsbG93OiBcImZhZmFkMlwiLFxuICAgIGxpZ2h0Z3JheTogXCJkM2QzZDNcIixcbiAgICBsaWdodGdyZWVuOiBcIjkwZWU5MFwiLFxuICAgIGxpZ2h0Z3JleTogXCJkM2QzZDNcIixcbiAgICBsaWdodHBpbms6IFwiZmZiNmMxXCIsXG4gICAgbGlnaHRzYWxtb246IFwiZmZhMDdhXCIsXG4gICAgbGlnaHRzZWFncmVlbjogXCIyMGIyYWFcIixcbiAgICBsaWdodHNreWJsdWU6IFwiODdjZWZhXCIsXG4gICAgbGlnaHRzbGF0ZWdyYXk6IFwiNzg5XCIsXG4gICAgbGlnaHRzbGF0ZWdyZXk6IFwiNzg5XCIsXG4gICAgbGlnaHRzdGVlbGJsdWU6IFwiYjBjNGRlXCIsXG4gICAgbGlnaHR5ZWxsb3c6IFwiZmZmZmUwXCIsXG4gICAgbGltZTogXCIwZjBcIixcbiAgICBsaW1lZ3JlZW46IFwiMzJjZDMyXCIsXG4gICAgbGluZW46IFwiZmFmMGU2XCIsXG4gICAgbWFnZW50YTogXCJmMGZcIixcbiAgICBtYXJvb246IFwiODAwMDAwXCIsXG4gICAgbWVkaXVtYXF1YW1hcmluZTogXCI2NmNkYWFcIixcbiAgICBtZWRpdW1ibHVlOiBcIjAwMDBjZFwiLFxuICAgIG1lZGl1bW9yY2hpZDogXCJiYTU1ZDNcIixcbiAgICBtZWRpdW1wdXJwbGU6IFwiOTM3MGRiXCIsXG4gICAgbWVkaXVtc2VhZ3JlZW46IFwiM2NiMzcxXCIsXG4gICAgbWVkaXVtc2xhdGVibHVlOiBcIjdiNjhlZVwiLFxuICAgIG1lZGl1bXNwcmluZ2dyZWVuOiBcIjAwZmE5YVwiLFxuICAgIG1lZGl1bXR1cnF1b2lzZTogXCI0OGQxY2NcIixcbiAgICBtZWRpdW12aW9sZXRyZWQ6IFwiYzcxNTg1XCIsXG4gICAgbWlkbmlnaHRibHVlOiBcIjE5MTk3MFwiLFxuICAgIG1pbnRjcmVhbTogXCJmNWZmZmFcIixcbiAgICBtaXN0eXJvc2U6IFwiZmZlNGUxXCIsXG4gICAgbW9jY2FzaW46IFwiZmZlNGI1XCIsXG4gICAgbmF2YWpvd2hpdGU6IFwiZmZkZWFkXCIsXG4gICAgbmF2eTogXCIwMDAwODBcIixcbiAgICBvbGRsYWNlOiBcImZkZjVlNlwiLFxuICAgIG9saXZlOiBcIjgwODAwMFwiLFxuICAgIG9saXZlZHJhYjogXCI2YjhlMjNcIixcbiAgICBvcmFuZ2U6IFwiZmZhNTAwXCIsXG4gICAgb3JhbmdlcmVkOiBcImZmNDUwMFwiLFxuICAgIG9yY2hpZDogXCJkYTcwZDZcIixcbiAgICBwYWxlZ29sZGVucm9kOiBcImVlZThhYVwiLFxuICAgIHBhbGVncmVlbjogXCI5OGZiOThcIixcbiAgICBwYWxldHVycXVvaXNlOiBcImFmZWVlZVwiLFxuICAgIHBhbGV2aW9sZXRyZWQ6IFwiZGI3MDkzXCIsXG4gICAgcGFwYXlhd2hpcDogXCJmZmVmZDVcIixcbiAgICBwZWFjaHB1ZmY6IFwiZmZkYWI5XCIsXG4gICAgcGVydTogXCJjZDg1M2ZcIixcbiAgICBwaW5rOiBcImZmYzBjYlwiLFxuICAgIHBsdW06IFwiZGRhMGRkXCIsXG4gICAgcG93ZGVyYmx1ZTogXCJiMGUwZTZcIixcbiAgICBwdXJwbGU6IFwiODAwMDgwXCIsXG4gICAgcmViZWNjYXB1cnBsZTogXCI2NjMzOTlcIixcbiAgICByZWQ6IFwiZjAwXCIsXG4gICAgcm9zeWJyb3duOiBcImJjOGY4ZlwiLFxuICAgIHJveWFsYmx1ZTogXCI0MTY5ZTFcIixcbiAgICBzYWRkbGVicm93bjogXCI4YjQ1MTNcIixcbiAgICBzYWxtb246IFwiZmE4MDcyXCIsXG4gICAgc2FuZHlicm93bjogXCJmNGE0NjBcIixcbiAgICBzZWFncmVlbjogXCIyZThiNTdcIixcbiAgICBzZWFzaGVsbDogXCJmZmY1ZWVcIixcbiAgICBzaWVubmE6IFwiYTA1MjJkXCIsXG4gICAgc2lsdmVyOiBcImMwYzBjMFwiLFxuICAgIHNreWJsdWU6IFwiODdjZWViXCIsXG4gICAgc2xhdGVibHVlOiBcIjZhNWFjZFwiLFxuICAgIHNsYXRlZ3JheTogXCI3MDgwOTBcIixcbiAgICBzbGF0ZWdyZXk6IFwiNzA4MDkwXCIsXG4gICAgc25vdzogXCJmZmZhZmFcIixcbiAgICBzcHJpbmdncmVlbjogXCIwMGZmN2ZcIixcbiAgICBzdGVlbGJsdWU6IFwiNDY4MmI0XCIsXG4gICAgdGFuOiBcImQyYjQ4Y1wiLFxuICAgIHRlYWw6IFwiMDA4MDgwXCIsXG4gICAgdGhpc3RsZTogXCJkOGJmZDhcIixcbiAgICB0b21hdG86IFwiZmY2MzQ3XCIsXG4gICAgdHVycXVvaXNlOiBcIjQwZTBkMFwiLFxuICAgIHZpb2xldDogXCJlZTgyZWVcIixcbiAgICB3aGVhdDogXCJmNWRlYjNcIixcbiAgICB3aGl0ZTogXCJmZmZcIixcbiAgICB3aGl0ZXNtb2tlOiBcImY1ZjVmNVwiLFxuICAgIHllbGxvdzogXCJmZjBcIixcbiAgICB5ZWxsb3dncmVlbjogXCI5YWNkMzJcIlxufTtcblxuLy8gTWFrZSBpdCBlYXN5IHRvIGFjY2VzcyBjb2xvcnMgdmlhIGBoZXhOYW1lc1toZXhdYFxudmFyIGhleE5hbWVzID0gdGlueWNvbG9yLmhleE5hbWVzID0gZmxpcChuYW1lcyk7XG5cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cblxuLy8gYHsgJ25hbWUxJzogJ3ZhbDEnIH1gIGJlY29tZXMgYHsgJ3ZhbDEnOiAnbmFtZTEnIH1gXG5mdW5jdGlvbiBmbGlwKG8pIHtcbiAgICB2YXIgZmxpcHBlZCA9IHsgfTtcbiAgICBmb3IgKHZhciBpIGluIG8pIHtcbiAgICAgICAgaWYgKG8uaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIGZsaXBwZWRbb1tpXV0gPSBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmbGlwcGVkO1xufVxuXG4vLyBSZXR1cm4gYSB2YWxpZCBhbHBoYSB2YWx1ZSBbMCwxXSB3aXRoIGFsbCBpbnZhbGlkIHZhbHVlcyBiZWluZyBzZXQgdG8gMVxuZnVuY3Rpb24gYm91bmRBbHBoYShhKSB7XG4gICAgYSA9IHBhcnNlRmxvYXQoYSk7XG5cbiAgICBpZiAoaXNOYU4oYSkgfHwgYSA8IDAgfHwgYSA+IDEpIHtcbiAgICAgICAgYSA9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG59XG5cbi8vIFRha2UgaW5wdXQgZnJvbSBbMCwgbl0gYW5kIHJldHVybiBpdCBhcyBbMCwgMV1cbmZ1bmN0aW9uIGJvdW5kMDEobiwgbWF4KSB7XG4gICAgaWYgKGlzT25lUG9pbnRaZXJvKG4pKSB7IG4gPSBcIjEwMCVcIjsgfVxuXG4gICAgdmFyIHByb2Nlc3NQZXJjZW50ID0gaXNQZXJjZW50YWdlKG4pO1xuICAgIG4gPSBtYXRoTWluKG1heCwgbWF0aE1heCgwLCBwYXJzZUZsb2F0KG4pKSk7XG5cbiAgICAvLyBBdXRvbWF0aWNhbGx5IGNvbnZlcnQgcGVyY2VudGFnZSBpbnRvIG51bWJlclxuICAgIGlmIChwcm9jZXNzUGVyY2VudCkge1xuICAgICAgICBuID0gcGFyc2VJbnQobiAqIG1heCwgMTApIC8gMTAwO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBmbG9hdGluZyBwb2ludCByb3VuZGluZyBlcnJvcnNcbiAgICBpZiAoKE1hdGguYWJzKG4gLSBtYXgpIDwgMC4wMDAwMDEpKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIC8vIENvbnZlcnQgaW50byBbMCwgMV0gcmFuZ2UgaWYgaXQgaXNuJ3QgYWxyZWFkeVxuICAgIHJldHVybiAobiAlIG1heCkgLyBwYXJzZUZsb2F0KG1heCk7XG59XG5cbi8vIEZvcmNlIGEgbnVtYmVyIGJldHdlZW4gMCBhbmQgMVxuZnVuY3Rpb24gY2xhbXAwMSh2YWwpIHtcbiAgICByZXR1cm4gbWF0aE1pbigxLCBtYXRoTWF4KDAsIHZhbCkpO1xufVxuXG4vLyBQYXJzZSBhIGJhc2UtMTYgaGV4IHZhbHVlIGludG8gYSBiYXNlLTEwIGludGVnZXJcbmZ1bmN0aW9uIHBhcnNlSW50RnJvbUhleCh2YWwpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsLCAxNik7XG59XG5cbi8vIE5lZWQgdG8gaGFuZGxlIDEuMCBhcyAxMDAlLCBzaW5jZSBvbmNlIGl0IGlzIGEgbnVtYmVyLCB0aGVyZSBpcyBubyBkaWZmZXJlbmNlIGJldHdlZW4gaXQgYW5kIDFcbi8vIDxodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc0MjIwNzIvamF2YXNjcmlwdC1ob3ctdG8tZGV0ZWN0LW51bWJlci1hcy1hLWRlY2ltYWwtaW5jbHVkaW5nLTEtMD5cbmZ1bmN0aW9uIGlzT25lUG9pbnRaZXJvKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT0gXCJzdHJpbmdcIiAmJiBuLmluZGV4T2YoJy4nKSAhPSAtMSAmJiBwYXJzZUZsb2F0KG4pID09PSAxO1xufVxuXG4vLyBDaGVjayB0byBzZWUgaWYgc3RyaW5nIHBhc3NlZCBpbiBpcyBhIHBlcmNlbnRhZ2VcbmZ1bmN0aW9uIGlzUGVyY2VudGFnZShuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09PSBcInN0cmluZ1wiICYmIG4uaW5kZXhPZignJScpICE9IC0xO1xufVxuXG4vLyBGb3JjZSBhIGhleCB2YWx1ZSB0byBoYXZlIDIgY2hhcmFjdGVyc1xuZnVuY3Rpb24gcGFkMihjKSB7XG4gICAgcmV0dXJuIGMubGVuZ3RoID09IDEgPyAnMCcgKyBjIDogJycgKyBjO1xufVxuXG4vLyBSZXBsYWNlIGEgZGVjaW1hbCB3aXRoIGl0J3MgcGVyY2VudGFnZSB2YWx1ZVxuZnVuY3Rpb24gY29udmVydFRvUGVyY2VudGFnZShuKSB7XG4gICAgaWYgKG4gPD0gMSkge1xuICAgICAgICBuID0gKG4gKiAxMDApICsgXCIlXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIG47XG59XG5cbi8vIENvbnZlcnRzIGEgZGVjaW1hbCB0byBhIGhleCB2YWx1ZVxuZnVuY3Rpb24gY29udmVydERlY2ltYWxUb0hleChkKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VGbG9hdChkKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xufVxuLy8gQ29udmVydHMgYSBoZXggdmFsdWUgdG8gYSBkZWNpbWFsXG5mdW5jdGlvbiBjb252ZXJ0SGV4VG9EZWNpbWFsKGgpIHtcbiAgICByZXR1cm4gKHBhcnNlSW50RnJvbUhleChoKSAvIDI1NSk7XG59XG5cbnZhciBtYXRjaGVycyA9IChmdW5jdGlvbigpIHtcblxuICAgIC8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXZhbHVlcy8jaW50ZWdlcnM+XG4gICAgdmFyIENTU19JTlRFR0VSID0gXCJbLVxcXFwrXT9cXFxcZCslP1wiO1xuXG4gICAgLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdmFsdWVzLyNudW1iZXItdmFsdWU+XG4gICAgdmFyIENTU19OVU1CRVIgPSBcIlstXFxcXCtdP1xcXFxkKlxcXFwuXFxcXGQrJT9cIjtcblxuICAgIC8vIEFsbG93IHBvc2l0aXZlL25lZ2F0aXZlIGludGVnZXIvbnVtYmVyLiAgRG9uJ3QgY2FwdHVyZSB0aGUgZWl0aGVyL29yLCBqdXN0IHRoZSBlbnRpcmUgb3V0Y29tZS5cbiAgICB2YXIgQ1NTX1VOSVQgPSBcIig/OlwiICsgQ1NTX05VTUJFUiArIFwiKXwoPzpcIiArIENTU19JTlRFR0VSICsgXCIpXCI7XG5cbiAgICAvLyBBY3R1YWwgbWF0Y2hpbmcuXG4gICAgLy8gUGFyZW50aGVzZXMgYW5kIGNvbW1hcyBhcmUgb3B0aW9uYWwsIGJ1dCBub3QgcmVxdWlyZWQuXG4gICAgLy8gV2hpdGVzcGFjZSBjYW4gdGFrZSB0aGUgcGxhY2Ugb2YgY29tbWFzIG9yIG9wZW5pbmcgcGFyZW5cbiAgICB2YXIgUEVSTUlTU0lWRV9NQVRDSDMgPSBcIltcXFxcc3xcXFxcKF0rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilcXFxccypcXFxcKT9cIjtcbiAgICB2YXIgUEVSTUlTU0lWRV9NQVRDSDQgPSBcIltcXFxcc3xcXFxcKF0rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilbLHxcXFxcc10rKFwiICsgQ1NTX1VOSVQgKyBcIilcXFxccypcXFxcKT9cIjtcblxuICAgIHJldHVybiB7XG4gICAgICAgIENTU19VTklUOiBuZXcgUmVnRXhwKENTU19VTklUKSxcbiAgICAgICAgcmdiOiBuZXcgUmVnRXhwKFwicmdiXCIgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgICAgIHJnYmE6IG5ldyBSZWdFeHAoXCJyZ2JhXCIgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgICAgIGhzbDogbmV3IFJlZ0V4cChcImhzbFwiICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgICAgICBoc2xhOiBuZXcgUmVnRXhwKFwiaHNsYVwiICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgICAgICBoc3Y6IG5ldyBSZWdFeHAoXCJoc3ZcIiArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICAgICAgaHN2YTogbmV3IFJlZ0V4cChcImhzdmFcIiArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICAgICAgaGV4MzogL14jPyhbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KSQvLFxuICAgICAgICBoZXg2OiAvXiM/KFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pJC8sXG4gICAgICAgIGhleDQ6IC9eIz8oWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pJC8sXG4gICAgICAgIGhleDg6IC9eIz8oWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pJC9cbiAgICB9O1xufSkoKTtcblxuLy8gYGlzVmFsaWRDU1NVbml0YFxuLy8gVGFrZSBpbiBhIHNpbmdsZSBzdHJpbmcgLyBudW1iZXIgYW5kIGNoZWNrIHRvIHNlZSBpZiBpdCBsb29rcyBsaWtlIGEgQ1NTIHVuaXRcbi8vIChzZWUgYG1hdGNoZXJzYCBhYm92ZSBmb3IgZGVmaW5pdGlvbikuXG5mdW5jdGlvbiBpc1ZhbGlkQ1NTVW5pdChjb2xvcikge1xuICAgIHJldHVybiAhIW1hdGNoZXJzLkNTU19VTklULmV4ZWMoY29sb3IpO1xufVxuXG4vLyBgc3RyaW5nSW5wdXRUb09iamVjdGBcbi8vIFBlcm1pc3NpdmUgc3RyaW5nIHBhcnNpbmcuICBUYWtlIGluIGEgbnVtYmVyIG9mIGZvcm1hdHMsIGFuZCBvdXRwdXQgYW4gb2JqZWN0XG4vLyBiYXNlZCBvbiBkZXRlY3RlZCBmb3JtYXQuICBSZXR1cm5zIGB7IHIsIGcsIGIgfWAgb3IgYHsgaCwgcywgbCB9YCBvciBgeyBoLCBzLCB2fWBcbmZ1bmN0aW9uIHN0cmluZ0lucHV0VG9PYmplY3QoY29sb3IpIHtcblxuICAgIGNvbG9yID0gY29sb3IucmVwbGFjZSh0cmltTGVmdCwnJykucmVwbGFjZSh0cmltUmlnaHQsICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgIHZhciBuYW1lZCA9IGZhbHNlO1xuICAgIGlmIChuYW1lc1tjb2xvcl0pIHtcbiAgICAgICAgY29sb3IgPSBuYW1lc1tjb2xvcl07XG4gICAgICAgIG5hbWVkID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY29sb3IgPT0gJ3RyYW5zcGFyZW50Jykge1xuICAgICAgICByZXR1cm4geyByOiAwLCBnOiAwLCBiOiAwLCBhOiAwLCBmb3JtYXQ6IFwibmFtZVwiIH07XG4gICAgfVxuXG4gICAgLy8gVHJ5IHRvIG1hdGNoIHN0cmluZyBpbnB1dCB1c2luZyByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgIC8vIEtlZXAgbW9zdCBvZiB0aGUgbnVtYmVyIGJvdW5kaW5nIG91dCBvZiB0aGlzIGZ1bmN0aW9uIC0gZG9uJ3Qgd29ycnkgYWJvdXQgWzAsMV0gb3IgWzAsMTAwXSBvciBbMCwzNjBdXG4gICAgLy8gSnVzdCByZXR1cm4gYW4gb2JqZWN0IGFuZCBsZXQgdGhlIGNvbnZlcnNpb24gZnVuY3Rpb25zIGhhbmRsZSB0aGF0LlxuICAgIC8vIFRoaXMgd2F5IHRoZSByZXN1bHQgd2lsbCBiZSB0aGUgc2FtZSB3aGV0aGVyIHRoZSB0aW55Y29sb3IgaXMgaW5pdGlhbGl6ZWQgd2l0aCBzdHJpbmcgb3Igb2JqZWN0LlxuICAgIHZhciBtYXRjaDtcbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMucmdiLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRjaFsxXSwgZzogbWF0Y2hbMl0sIGI6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5yZ2JhLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRjaFsxXSwgZzogbWF0Y2hbMl0sIGI6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHNsLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIGw6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc2xhLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIGw6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHN2LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIHY6IG1hdGNoWzNdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc3ZhLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4geyBoOiBtYXRjaFsxXSwgczogbWF0Y2hbMl0sIHY6IG1hdGNoWzNdLCBhOiBtYXRjaFs0XSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4OC5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGE6IGNvbnZlcnRIZXhUb0RlY2ltYWwobWF0Y2hbNF0pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXg4XCJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDYuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleFwiXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXg0LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdICsgJycgKyBtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0gKyAnJyArIG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSArICcnICsgbWF0Y2hbM10pLFxuICAgICAgICAgICAgYTogY29udmVydEhleFRvRGVjaW1hbChtYXRjaFs0XSArICcnICsgbWF0Y2hbNF0pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXg4XCJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDMuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0gKyAnJyArIG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSArICcnICsgbWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdICsgJycgKyBtYXRjaFszXSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleFwiXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVdDQUcyUGFybXMocGFybXMpIHtcbiAgICAvLyByZXR1cm4gdmFsaWQgV0NBRzIgcGFybXMgZm9yIGlzUmVhZGFibGUuXG4gICAgLy8gSWYgaW5wdXQgcGFybXMgYXJlIGludmFsaWQsIHJldHVybiB7XCJsZXZlbFwiOlwiQUFcIiwgXCJzaXplXCI6XCJzbWFsbFwifVxuICAgIHZhciBsZXZlbCwgc2l6ZTtcbiAgICBwYXJtcyA9IHBhcm1zIHx8IHtcImxldmVsXCI6XCJBQVwiLCBcInNpemVcIjpcInNtYWxsXCJ9O1xuICAgIGxldmVsID0gKHBhcm1zLmxldmVsIHx8IFwiQUFcIikudG9VcHBlckNhc2UoKTtcbiAgICBzaXplID0gKHBhcm1zLnNpemUgfHwgXCJzbWFsbFwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChsZXZlbCAhPT0gXCJBQVwiICYmIGxldmVsICE9PSBcIkFBQVwiKSB7XG4gICAgICAgIGxldmVsID0gXCJBQVwiO1xuICAgIH1cbiAgICBpZiAoc2l6ZSAhPT0gXCJzbWFsbFwiICYmIHNpemUgIT09IFwibGFyZ2VcIikge1xuICAgICAgICBzaXplID0gXCJzbWFsbFwiO1xuICAgIH1cbiAgICByZXR1cm4ge1wibGV2ZWxcIjpsZXZlbCwgXCJzaXplXCI6c2l6ZX07XG59XG5cbi8vIE5vZGU6IEV4cG9ydCBmdW5jdGlvblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRpbnljb2xvcjtcbn1cbi8vIEFNRC9yZXF1aXJlanM6IERlZmluZSB0aGUgbW9kdWxlXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge3JldHVybiB0aW55Y29sb3I7fSk7XG59XG4vLyBCcm93c2VyOiBFeHBvc2UgdG8gd2luZG93XG5lbHNlIHtcbiAgICB3aW5kb3cudGlueWNvbG9yID0gdGlueWNvbG9yO1xufVxuXG59KShNYXRoKTtcbiJdfQ==
