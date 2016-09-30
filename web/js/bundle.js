(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Path = require('./Path.js');

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
    //console.log("REPEAT", this.repeat);
  }

  _createClass(Agent, [{
    key: 'addPoint',
    value: function addPoint(x, y, size) {
      var pt = { x: x, y: y, size: size };
      var polar = _Path2.default.toPolar(pt);
      pt.theta = polar.theta;
      pt.r = polar.r;
      this.points.push(pt);
    }
  }, {
    key: 'setPath',
    value: function setPath(points, index) {
      this.points = points;
      this.stepIndex = index;
    }
  }, {
    key: 'setOffset',
    value: function setOffset(point) {
      if (this.coordType == 0) {
        this.points = _Path2.default.calculateOffset(this.points, point, this.stepIndex, true);
      } else {
        this.points = _Path2.default.calculatePolarOffset(this.points, point, this.stepIndex);
      }

      // this.points = Path.calculatePolarOffset(this.points, point, this.stepIndex);
    }
  }, {
    key: 'restartAnimation',
    value: function restartAnimation() {
      this.stepIndex = 0;
      switch (this.repeat) {
        case 1:
          // console.log(" point offset", this.points[this.points.length-1]);
          //this.setOffset(this.points[this.points.length-1]);
          this.points = _Path2.default.calculateOffset(this.points, this.points[this.points.length - 1], this.stepIndex, true);
          // console.log(this.points);
          break;
        case 2:
          this.points = _Path2.default.reverse(this.points);
          break;
        default:
          break;
      }
    }
  }, {
    key: 'update',
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
    key: 'draw',
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
    this.currPath = [];
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
        this.currPath = this.currAgent.points.slice();
        console.log("mouse up", this.currAgent.points, this.currPath);
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
      console.log("add agent", this.currPath);
      var agent = new _Agent2.default(this.ctx, this.settings);
      if (this.settings.synchro.value == 0) {
        // agent.setPath(this.currAgent.points, this.currAgent.stepIndex);
        agent.setPath(this.currPath.slice(), this.currAgent.stepIndex);
      } else {
        agent.setPath(this.currPath.slice(), 0);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvQWdlbnQuanMiLCJhcHAvQW5pbWF0aW9uQ2FudmFzLmpzIiwiYXBwL0FwcC5qcyIsImFwcC9Db2xvclBhbGV0dGUuanMiLCJhcHAvQ29udHJvbEdyb3VwLmpzIiwiYXBwL0NvbnRyb2xzLmpzIiwiYXBwL01pZGkuanMiLCJhcHAvTXVsdGlTZWxlY3QuanMiLCJhcHAvUGF0aC5qcyIsImFwcC9TZWxlY3RDb250cm9sLmpzIiwiYXBwL1NsaWRlckNvbnRyb2wuanMiLCJhcHAvaW5kZXguanMiLCJhcHAvb3B0aW9ucy5qc29uIiwiYXBwL3NldHRpbmdzLmpzb24iLCJub2RlX21vZHVsZXMvY29sb3JlYWN0L2xpYi9jb21wb25lbnRzL0NvbG9yUGlja2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yZWFjdC9saWIvY29tcG9uZW50cy9EcmFnZ2FibGUuanMiLCJub2RlX21vZHVsZXMvY29sb3JlYWN0L2xpYi9jb21wb25lbnRzL01hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb2xvcmVhY3QvbGliL2NvbXBvbmVudHMvU2xpZGVyLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yZWFjdC9saWIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaG9pc3Qtbm9uLXJlYWN0LXN0YXRpY3MvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Rocm90dGxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIm5vZGVfbW9kdWxlcy90aW55Y29sb3IyL3Rpbnljb2xvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7O0lBRU0sSztBQUNKLGlCQUFZLEdBQVosRUFBaUIsUUFBakIsRUFBMkI7QUFBQTs7QUFDekIsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUssU0FBTCxHQUFpQixDQUFqQjtBQUNBLFNBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxTQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLLElBQUwsR0FBWSxTQUFTLElBQVQsQ0FBYyxLQUExQjtBQUNBLFNBQUssTUFBTCxHQUFjLFNBQVMsTUFBVCxDQUFnQixLQUE5QjtBQUNBLFNBQUssTUFBTCxHQUFjLFNBQVMsTUFBVCxDQUFnQixLQUE5QjtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFTLFNBQVQsQ0FBbUIsS0FBcEM7QUFDQSxTQUFLLEtBQUwsR0FBYSxTQUFTLEtBQVQsQ0FBZSxLQUFmLENBQXFCLFNBQWxDO0FBQ0EsU0FBSyxLQUFMLEdBQWEsU0FBUyxLQUFULENBQWUsS0FBNUI7QUFDQTtBQUNEOzs7OzZCQUVRLEMsRUFBRyxDLEVBQUcsSSxFQUFLO0FBQ2xCLFVBQUksS0FBSyxFQUFDLEdBQUcsQ0FBSixFQUFPLEdBQUcsQ0FBVixFQUFhLE1BQU0sSUFBbkIsRUFBVDtBQUNBLFVBQUksUUFBUSxlQUFLLE9BQUwsQ0FBYSxFQUFiLENBQVo7QUFDQSxTQUFHLEtBQUgsR0FBVyxNQUFNLEtBQWpCO0FBQ0EsU0FBRyxDQUFILEdBQU8sTUFBTSxDQUFiO0FBQ0QsV0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixFQUFqQjtBQUNBOzs7NEJBRU8sTSxFQUFRLEssRUFBTTtBQUNwQixXQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0Q7Ozs4QkFFUyxLLEVBQU07QUFDZCxVQUFHLEtBQUssU0FBTCxJQUFnQixDQUFu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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBhdGggZnJvbSAnLi9QYXRoLmpzJztcblxuY2xhc3MgQWdlbnQge1xuICBjb25zdHJ1Y3RvcihjdHgsIHNldHRpbmdzKSB7XG4gICAgdGhpcy5wb2ludHMgPSBbXTtcbiAgICB0aGlzLnN0ZXBJbmRleCA9IDA7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuc2l6ZSA9IHNldHRpbmdzLnNpemUudmFsdWU7XG4gICAgdGhpcy5sZW5ndGggPSBzZXR0aW5ncy5sZW5ndGgudmFsdWU7XG4gICAgdGhpcy5yZXBlYXQgPSBzZXR0aW5ncy5yZXBlYXQudmFsdWU7XG4gICAgdGhpcy5jb29yZFR5cGUgPSBzZXR0aW5ncy5jb29yZFR5cGUudmFsdWU7XG4gICAgdGhpcy5jb2xvciA9IHNldHRpbmdzLmNvbG9yLnZhbHVlLnJnYlN0cmluZztcbiAgICB0aGlzLnNoYXBlID0gc2V0dGluZ3Muc2hhcGUudmFsdWU7XG4gICAgLy9jb25zb2xlLmxvZyhcIlJFUEVBVFwiLCB0aGlzLnJlcGVhdCk7XG4gIH1cblxuICBhZGRQb2ludCh4LCB5LCBzaXplKXtcbiAgICB2YXIgcHQgPSB7eDogeCwgeTogeSwgc2l6ZTogc2l6ZX07XG4gICAgdmFyIHBvbGFyID0gUGF0aC50b1BvbGFyKHB0KTtcbiAgICBwdC50aGV0YSA9IHBvbGFyLnRoZXRhO1xuICAgIHB0LnIgPSBwb2xhci5yO1xuICAgdGhpcy5wb2ludHMucHVzaChwdCk7XG4gIH1cblxuICBzZXRQYXRoKHBvaW50cywgaW5kZXgpe1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuICAgIHRoaXMuc3RlcEluZGV4ID0gaW5kZXg7XG4gIH1cbiAgXG4gIHNldE9mZnNldChwb2ludCl7XG4gICAgaWYodGhpcy5jb29yZFR5cGU9PTApe1xuICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZU9mZnNldCh0aGlzLnBvaW50cywgcG9pbnQsIHRoaXMuc3RlcEluZGV4LCB0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHRoaXMucG9pbnRzLCBwb2ludCwgdGhpcy5zdGVwSW5kZXgpO1xuICAgIH1cbiAgICBcbiAgIFxuICAgLy8gdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHRoaXMucG9pbnRzLCBwb2ludCwgdGhpcy5zdGVwSW5kZXgpO1xuICAgIFxuICB9XG5cbiAgcmVzdGFydEFuaW1hdGlvbigpe1xuICAgIHRoaXMuc3RlcEluZGV4ID0gMDtcbiAgICBzd2l0Y2godGhpcy5yZXBlYXQpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIHBvaW50IG9mZnNldFwiLCB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGgtMV0pO1xuICAgICAgICAgIC8vdGhpcy5zZXRPZmZzZXQodGhpcy5wb2ludHNbdGhpcy5wb2ludHMubGVuZ3RoLTFdKTtcbiAgICAgICAgICB0aGlzLnBvaW50cyA9IFBhdGguY2FsY3VsYXRlT2Zmc2V0KHRoaXMucG9pbnRzLCB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGgtMV0sIHRoaXMuc3RlcEluZGV4LCB0cnVlKTtcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucG9pbnRzKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgICB0aGlzLnBvaW50cyA9IFBhdGgucmV2ZXJzZSh0aGlzLnBvaW50cyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgIH0gXG4gIH1cblxuICB1cGRhdGUoKXtcblxuICAgIGlmKHRoaXMuaXNSZWNvcmRpbmcpe1xuICAgICAgdGhpcy5zdGVwSW5kZXggPSB0aGlzLnBvaW50cy5sZW5ndGggLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZih0aGlzLnNoYXBlPT0wKXsgLy8gaWYgbGluZSwgZGlmZmVyZW50IHVwZGF0ZVxuICAgICAgICB0aGlzLnBvaW50cyA9IFBhdGguYWRkTmV4dFBvaW50KHRoaXMucG9pbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RlcEluZGV4Kys7XG4gICAgICAgIGlmKHRoaXMuc3RlcEluZGV4ID49IHRoaXMucG9pbnRzLmxlbmd0aCl7XG4gICAgICAgICAgdGhpcy5yZXN0YXJ0QW5pbWF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIFxuICB9XG5cbiAgZHJhdygpe1xuICAgIGlmKHRoaXMucG9pbnRzLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgXG4gICAgICB2YXIgY3VyclB0ID0gdGhpcy5wb2ludHNbdGhpcy5zdGVwSW5kZXhdO1xuICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICBcbiAgICAgIHN3aXRjaCh0aGlzLnNoYXBlKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgdmFyIHRvRHJhdztcbiAgICAgICAgICAgaWYodGhpcy5pc1JlY29yZGluZyl7XG4gICAgICAgICAgICB0b0RyYXcgPSB0aGlzLnBvaW50cy5sZW5ndGgtMTtcbiAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvRHJhdyA9IE1hdGgubWluKHRoaXMubGVuZ3RoLCB0aGlzLnBvaW50cy5sZW5ndGgtMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRvRHJhdzsgaSsrKXtcbiAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odGhpcy5wb2ludHNbaV0ueCwgdGhpcy5wb2ludHNbaV0ueSk7XG4gICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyh0aGlzLnBvaW50c1tpKzFdLngsIHRoaXMucG9pbnRzW2krMV0ueSk7XG4gICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHRoaXMucG9pbnRzW2ldLnNpemUvMjtcbiAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoY3VyclB0LngsIGN1cnJQdC55KTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgLy90aGlzLmN0eC5hcmMoMCwgMCx0aGlzLnNpemUvMiw1MCwwLDIqTWF0aC5QSSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5hcmMoMCwgMCxjdXJyUHQuc2l6ZS8yLDUwLDAsMipNYXRoLlBJKTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICB0aGlzLmN0eC50cmFuc2xhdGUoY3VyclB0LngsIGN1cnJQdC55KTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KC1jdXJyUHQuc2l6ZS8yLCAtY3VyclB0LnNpemUvMixjdXJyUHQuc2l6ZSwgY3VyclB0LnNpemUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICB9IFxuICAgICAgXG4gICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFnZW50O1xuIiwiaW1wb3J0IEFnZW50IGZyb20gJy4vQWdlbnQuanMnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MuanNvbic7XG5cbmNsYXNzIEFuaW1hdGlvbkNhbnZhcyB7XG4gIGNvbnN0cnVjdG9yKGNhbnZJZCwgc2V0dGluZ3MsIHBhcmVudCkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZJZCk7XG4gICAvLyB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgdGhpcy5jYW52YXMud2lkdGggPSBTZXR0aW5ncy5zaXplLnc7XG4gICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBTZXR0aW5ncy5zaXplLmg7XG4gICAvLyB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5pc0RyYXdpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcbiAgICB0aGlzLmN0eC5saW5lSm9pbiA9IFwicm91bmRcIjtcbiAgICB0aGlzLmN0eC5saW5lQ2FwID0gXCJyb3VuZFwiO1xuICAgIHRoaXMuYWdlbnRzID0gW107XG4gICAgdGhpcy5jdXJyUGF0aCA9IFtdO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc2V0dGluZ3MpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnNldHRpbmdzLnRyYWNrLnZhbHVlLmxlbmd0aDsgaSsrKXtcbiAgICAgIHZhciBhZ2VudHNQZXJUcmFjayA9IFtdO1xuICAgICAgdGhpcy5hZ2VudHMucHVzaChhZ2VudHNQZXJUcmFjayk7XG4gICAgfVxuICAgIHRoaXMuY3VyckFnZW50ID0gbmV3IEFnZW50KHRoaXMuY3R4LCB0aGlzLnNldHRpbmdzKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgdGhpcy5tb3VzZVBvcyA9IHt4OiAwLCB5OiAwfTtcbiAgICB0aGlzLnJlbmRlcigpO1xuICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmtleXNEb3duID0gW107XG4gICAgdGhpcy5jdHgudHJhbnNsYXRlKHRoaXMuY2FudmFzLndpZHRoLzIsIHRoaXMuY2FudmFzLmhlaWdodC8yKTtcbiAgICAvL3ZhciBzdHJlYW0gPSB0aGlzLmNhbnZhcy5jYXB0dXJlU3RyZWFtKDYwKTsgXG4gICAgLy8gdmFyIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0pO1xuICAgIC8vIG1lZGlhUmVjb3JkZXIuc3RhcnQoKTtcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXJzKCl7XG4gICAgdGhpcy5jYW52YXMub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKXtcbiAgICAgIHRoaXMuY3VyckFnZW50ID0gbmV3IEFnZW50KHRoaXMuY3R4LCB0aGlzLnNldHRpbmdzKTtcbiAgICAgIHRoaXMuY3VyckFnZW50LmlzUmVjb3JkaW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VyckFnZW50LmFkZFBvaW50KGUuY2xpZW50WC10aGlzLmNhbnZhcy53aWR0aC8yLCBlLmNsaWVudFktdGhpcy5jYW52YXMuaGVpZ2h0LzIsIHRoaXMuc2V0dGluZ3Muc2l6ZS52YWx1ZSk7XG4gICAgICB0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10ucHVzaCh0aGlzLmN1cnJBZ2VudCk7XG4gICAgICB0aGlzLmlzRHJhd2luZyA9IHRydWU7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5jYW52YXMub25tb3VzZW1vdmUgPSBmdW5jdGlvbihlKXtcbiAgICAgIHRoaXMubW91c2VQb3MgPSB7eDogZS5jbGllbnRYLXRoaXMuY2FudmFzLndpZHRoLzIsIHk6IGUuY2xpZW50WS10aGlzLmNhbnZhcy5oZWlnaHQvMn07XG4gICAgIFxuICAgIH0uYmluZCh0aGlzKTtcblxuXG4gICAgdGhpcy5jYW52YXMub25tb3VzZXVwID0gZnVuY3Rpb24oZSl7XG4gICAgICB0aGlzLmlzRHJhd2luZyA9IGZhbHNlO1xuICAgICAgdGhpcy5jdXJyQWdlbnQuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY3VyclBhdGggPSB0aGlzLmN1cnJBZ2VudC5wb2ludHMuc2xpY2UoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwibW91c2UgdXBcIiwgdGhpcy5jdXJyQWdlbnQucG9pbnRzLCB0aGlzLmN1cnJQYXRoKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpe1xuICAgIC8vICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAvLyAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAvLyB9LmJpbmQodGhpcyk7XG5cbiAgICB3aW5kb3cub25rZXlkb3duID0gZnVuY3Rpb24oZSl7XG4gICAgICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICBzd2l0Y2goa2V5Q29kZSkge1xuICAgICAgICBjYXNlIDY1OiAvLyBhZGQsIGtleSBhXG4gICAgICAgICAgdGhpcy5hZGRBZ2VudCh0aGlzLm1vdXNlUG9zKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA2NzogLy8gY2xlYXJcbiAgICAgICAgICB0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10gPSBbXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxMDI6IC8vIGYsIHJlbW92ZSBmaXJzdFxuICAgICAgICAgIGlmKHRoaXMuYWdlbnRzW3RoaXMuc2V0dGluZ3MudHJhY2sucmVjb3JkaW5nXS5sZW5ndGggPiAwKSB0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10uc3BsaWNlKDAsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDEwMDogLy8gZCwgcmVtb3ZlIGxhc3RcbiAgICAgICAgICBpZih0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10ubGVuZ3RoID4gMCkgdGhpcy5hZ2VudHNbdGhpcy5zZXR0aW5ncy50cmFjay5yZWNvcmRpbmddLnNwbGljZSh0aGlzLmFnZW50c1t0aGlzLnNldHRpbmdzLnRyYWNrLnJlY29yZGluZ10ubGVuZ3RoLTEsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDgyOlxuICAgICAgICAgIGlmKHRoaXMuaXNSZWNvcmRpbmcgKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdGFydFJlY29yZGluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSA3MjogLy8gaCA9IGhpZGUgY29udHJvbHNcbiAgICAgICAgICB0aGlzLnBhcmVudC50b2dnbGVDb250cm9scygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGJyZWFrO1xuICAgICB9XG4gICAgIGlmKHRoaXMua2V5c0Rvd24uaW5kZXhPZihrZXlDb2RlKSA8IDApe1xuICAgICAgICB0aGlzLmtleXNEb3duLnB1c2goa2V5Q29kZSk7XG4gICAgICAgIHRoaXMucGFyZW50LnNldEtleXNEb3duKHRoaXMua2V5c0Rvd24pO1xuICAgICB9XG5cbiAgICB9LmJpbmQodGhpcyk7XG4gICAgd2luZG93Lm9ua2V5dXAgPSBmdW5jdGlvbihlKXtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMua2V5c0Rvd24pO1xuICAgICAgdmFyIGtleUNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcbiAgICAgIGlmKHRoaXMua2V5c0Rvd24uaW5kZXhPZihrZXlDb2RlKSA+IC0xKXtcbiAgICAgICAgdGhpcy5rZXlzRG93bi5zcGxpY2UodGhpcy5rZXlzRG93bi5pbmRleE9mKGtleUNvZGUpLCAxKTtcbiAgICAgICAgdGhpcy5wYXJlbnQuc2V0S2V5c0Rvd24odGhpcy5rZXlzRG93bik7XG4gICAgICB9XG4gICB9LmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGFydFJlY29yZGluZygpe1xuICAgIGNvbnNvbGUubG9nKFwic3RhcnRpbmcgdG8gcmVjb3JkXCIpO1xuICAgIHRoaXMuaXNSZWNvcmRpbmcgPSB0cnVlO1xuICAgIHRoaXMucmVjb3JkZWRCbG9icyA9IFtdO1xuICAgIHZhciBzdHJlYW0gPSB0aGlzLmNhbnZhcy5jYXB0dXJlU3RyZWFtKDYwKTsgXG4gICAgdGhpcy5tZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtKTtcbiAgLy8gIHRoaXMubWVkaWFSZWNvcmRlci5vbnN0b3AgPSB0aGlzLmhhbmRsZVN0b3A7XG4gICAgdGhpcy5tZWRpYVJlY29yZGVyLm9uZGF0YWF2YWlsYWJsZSA9IHRoaXMuaGFuZGxlRGF0YUF2YWlsYWJsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMubWVkaWFSZWNvcmRlci5zdGFydCgxMCk7XG4gICAgdGhpcy5jYW52YXMuY2xhc3NOYW1lID0gXCJyZWNvcmRpbmdcIjtcbiAgfVxuXG4gIGhhbmRsZURhdGFBdmFpbGFibGUoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZGF0YSAmJiBldmVudC5kYXRhLnNpemUgPiAwKSB7XG4gICAgICB0aGlzLnJlY29yZGVkQmxvYnMucHVzaChldmVudC5kYXRhKTtcbiAgICB9XG4gIH1cblxuICBzdG9wUmVjb3JkaW5nKCl7XG4gICAgY29uc29sZS5sb2coXCJzdG9wcGluZyByZWNvcmRcIik7XG4gICAgdGhpcy5tZWRpYVJlY29yZGVyLnN0b3AoKTtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgLy9jb25zb2xlLmxvZygnUmVjb3JkZWQgQmxvYnM6ICcsIHRoaXMucmVjb3JkZWRCbG9icyk7XG4gICAgdGhpcy5kb3dubG9hZCgpO1xuICAgIHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9IFwiXCI7XG4gIH1cblxuICBkb3dubG9hZCgpIHtcbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKHRoaXMucmVjb3JkZWRCbG9icywge3R5cGU6ICd2aWRlby93ZWJtJ30pO1xuICAgIHZhciB1cmwgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgYS5ocmVmID0gdXJsO1xuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcblxuICAgIGEuZG93bmxvYWQgPSBcImxpdG9yYWwtXCIrZGF0ZS5nZXREYXRlKCkrXCItXCIrZGF0ZS5nZXREYXRlKCkrXCItXCIrZGF0ZS5nZXRIb3VycygpK1wiLVwiK2RhdGUuZ2V0TWludXRlcygpKycud2VibSc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcbiAgICBhLmNsaWNrKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XG4gICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xuICAgIH0sIDEwMCk7XG4gICAgdGhpcy5yZWNvcmRlZEJsb2JzID0gW107XG4gICAgdGhpcy5tZWRpYVJlY29yZGVyID0gbnVsbDtcbiAgfVxuXG4gIGFkZEFnZW50KHBvcyl7XG4gICAgY29uc29sZS5sb2coXCJhZGQgYWdlbnRcIiwgdGhpcy5jdXJyUGF0aCk7XG4gICAgdmFyIGFnZW50ID0gbmV3IEFnZW50KHRoaXMuY3R4LCB0aGlzLnNldHRpbmdzKTtcbiAgICBpZih0aGlzLnNldHRpbmdzLnN5bmNocm8udmFsdWU9PTApe1xuICAgICAvLyBhZ2VudC5zZXRQYXRoKHRoaXMuY3VyckFnZW50LnBvaW50cywgdGhpcy5jdXJyQWdlbnQuc3RlcEluZGV4KTtcbiAgICAgIGFnZW50LnNldFBhdGgodGhpcy5jdXJyUGF0aC5zbGljZSgpLCB0aGlzLmN1cnJBZ2VudC5zdGVwSW5kZXgpXG4gICAgfWVsc2V7XG4gICAgICBhZ2VudC5zZXRQYXRoKHRoaXMuY3VyclBhdGguc2xpY2UoKSwgMCk7XG4gICAgfVxuICAgIGFnZW50LnNldE9mZnNldChwb3MpO1xuICAgIHRoaXMuYWdlbnRzW3RoaXMuc2V0dGluZ3MudHJhY2sucmVjb3JkaW5nXS5wdXNoKGFnZW50KTtcbiAgfVxuXG4gIHJlbmRlcigpe1xuICAgIC8vY29uc29sZS5sb2coXCJyZW5kZXJpbmdcIik7XG4gICAgIGlmKHRoaXMuaXNEcmF3aW5nKXtcbiAgICAgICAgdGhpcy5jdXJyQWdlbnQuYWRkUG9pbnQodGhpcy5tb3VzZVBvcy54LCB0aGlzLm1vdXNlUG9zLnksIHRoaXMuc2V0dGluZ3Muc2l6ZS52YWx1ZSk7XG4gICAgICB9XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KC10aGlzLmNhbnZhcy53aWR0aC8yLCAtdGhpcy5jYW52YXMuaGVpZ2h0LzIsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmFnZW50cy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZih0aGlzLnNldHRpbmdzLnRyYWNrLnZhbHVlW2ldPT10cnVlKXtcbiAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHRoaXMuYWdlbnRzW2ldLmxlbmd0aDsgaisrKXtcbiAgICAgICAgICB0aGlzLmFnZW50c1tpXVtqXS51cGRhdGUoKTtcbiAgICAgICAgICB0aGlzLmFnZW50c1tpXVtqXS5kcmF3KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRpb25DYW52YXM7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbnRyb2xzIGZyb20gJy4vQ29udHJvbHMuanMnO1xuaW1wb3J0IEFuaW1hdGlvbkNhbnZhcyBmcm9tICcuL0FuaW1hdGlvbkNhbnZhcy5qcyc7XG5pbXBvcnQgTWlkaSBmcm9tICcuL01pZGkuanMnO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi9vcHRpb25zLmpzb24nO1xuXG4vL2ltcG9ydCAnLi9BcHAuY3NzJztcblxuY2xhc3MgQXBwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpe1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBcbiAgICBcbiAgICB0aGlzLnN0YXRlID0ge29wdGlvbnM6IG9wdGlvbnMsIHNob3dDb250cm9sczogdHJ1ZSwga2V5c0Rvd246IFtdfTtcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnN0YXRlLm9wdGlvbnMubGVuZ3RoOyBpKyspe1xuICAgICAgdmFyIGdyb3VwID0gdGhpcy5zdGF0ZS5vcHRpb25zW2ldLmNvbnRyb2xzO1xuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IGdyb3VwLmxlbmd0aDsgaisrKXtcbiAgICAgICAgc2V0dGluZ3NbZ3JvdXBbal0ubmFtZV0gPSBncm91cFtqXTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICB0aGlzLmFuaW0gPSBuZXcgQW5pbWF0aW9uQ2FudmFzKFwiZHJhd1wiLCB0aGlzLnNldHRpbmdzLCB0aGlzKTtcbiAgICB0aGlzLm1pZGkgPSBuZXcgTWlkaSgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe21pZGk6IHRoaXMubWlkaX0pO1xuICB9XG4gIFxuICB0b2dnbGVDb250cm9scygpe1xuICAgIGNvbnNvbGUubG9nKFwidG9nZ2xpbmggY29udHJvbHNcIik7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2hvd0NvbnRyb2xzOiB0aGlzLnN0YXRlLnNob3dDb250cm9scyA/IGZhbHNlOiB0cnVlfSk7XG4gIH1cblxuICBzZXRLZXlzRG93bihrZXlzKXtcbiAgICB0aGlzLnNldFN0YXRlKHtrZXlzRG93bjoga2V5c30pO1xuICB9XG5cbiAgdXBkYXRlKG5ld1ZhbHVlLCBncm91cEluZGV4LCBjb250cm9sSW5kZXgsIHByb3BlcnR5TmFtZSl7XG4gICAgdmFyIG5ld09wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG4gICAgbmV3T3B0aW9uc1tncm91cEluZGV4XS5jb250cm9sc1tjb250cm9sSW5kZXhdW3Byb3BlcnR5TmFtZV0gPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtvcHRpb25zOiBuZXdPcHRpb25zfSk7XG4gIH1cblxuICBcblxuICByZW5kZXIoKSB7XG4gICAgdmFyIHN0eWxlID0ge1xuICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgIHRvcDogXCIwcHhcIixcbiAgICAgIGxlZnQ6IFwiMHB4XCIsXG4gICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICBoZWlnaHQ6IFwiMTAwJVwiXG4gICAgfTtcbiAgICB2YXIgY29udHJvbHMgPSBbXTtcbiAgICBpZih0aGlzLnN0YXRlLnNob3dDb250cm9scyl7XG4gICAgICBjb250cm9scyA9IDxDb250cm9scyB1cGRhdGU9e3RoaXMudXBkYXRlLmJpbmQodGhpcyl9IG1pZGk9e3RoaXMuc3RhdGUubWlkaX0ga2V5c0Rvd249e3RoaXMuc3RhdGUua2V5c0Rvd259IG9wdGlvbnM9e3RoaXMuc3RhdGUub3B0aW9uc30vPlxuICAgIH1cbiAgICByZXR1cm4gPGRpdiBzdHlsZT17c3R5bGV9PlxuICAgICAgPGNhbnZhcyBpZD1cImRyYXdcIj48L2NhbnZhcz5cbiAgICAgIHtjb250cm9sc31cbiAgICA8L2Rpdj47XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29sb3JQaWNrZXIgZnJvbSAnY29sb3JlYWN0JztcblxuXG5jbGFzcyBDb2xvclBhbGV0dGUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBcbiAgcmVuZGVyKCl7XG4gICAgdmFyIHN0eWxlID0ge1xuICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgIHdpZHRoOiBcIjE1MHB4XCIsXG4gICAgICBoZWlnaHQ6IFwiMTUwcHhcIlxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZSA9IHtzdHlsZX0+XG4gICAgICAgICA8Q29sb3JQaWNrZXJcbiAgICAgIG9wYWNpdHk9e3RydWV9XG4gICAgICBjb2xvcj17dGhpcy5wcm9wcy5pbmZvLnZhbHVlLnJnYlN0cmluZ31cbiAgICAgIG9uQ2hhbmdlPXt0aGlzLnNob3dDb2xvci5iaW5kKHRoaXMpfVxuICAgICAgIC8+IFxuICAgICAgIDwvZGl2Pik7XG4gICBcbiAgfVxuXG4gIHNob3dDb2xvcihjb2xvcikge1xuICAgICAgY29uc29sZS5sb2coY29sb3IpO1xuICAgICAgY29uc29sZS5sb2codGhpcyk7XG4gICAgICB0aGlzLnByb3BzLnVwZGF0ZShjb2xvciwgdGhpcy5wcm9wcy5ncm91cEluZGV4LCB0aGlzLnByb3BzLmNvbnRyb2xJbmRleCwgXCJ2YWx1ZVwiKTtcbiAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7Y29sb3I6IGNvbG9yfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sb3JQYWxldHRlO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTZWxlY3RDb250cm9sIGZyb20gJy4vU2VsZWN0Q29udHJvbC5qcyc7XG5pbXBvcnQgTXVsdGlTZWxlY3QgZnJvbSAnLi9NdWx0aVNlbGVjdC5qcyc7XG5pbXBvcnQgU2xpZGVyQ29udHJvbCBmcm9tICcuL1NsaWRlckNvbnRyb2wuanMnO1xuaW1wb3J0IENvbG9yUGFsZXR0ZSBmcm9tICcuL0NvbG9yUGFsZXR0ZS5qcyc7XG5cbmNsYXNzIENvbnRyb2xHcm91cCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgXHQgdmFyIGNvbnRyb2xzID0gdGhpcy5wcm9wcy5pbmZvLmNvbnRyb2xzLm1hcChmdW5jdGlvbihvYmosIGluZCl7XG4gIFx0IFx0aWYob2JqLnR5cGU9PVwic2VsZWN0XCIpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlbmRlcmluZyBzZWxlY3RcIik7XG4gIFx0IFx0XHRyZXR1cm4gPFNlbGVjdENvbnRyb2wgey4uLnRoaXMucHJvcHN9IGNvbnRyb2xJbmRleD17aW5kfSBpbmZvPXtvYmp9IC8+XG4gIFx0IFx0fSBlbHNlIGlmKG9iai50eXBlPT1cInNsaWRlclwiKXtcbiAgXHQgXHRcdHJldHVybiA8U2xpZGVyQ29udHJvbCB7Li4udGhpcy5wcm9wc30gY29udHJvbEluZGV4PXtpbmR9IGluZm89e29ian0gbWlkaT17dGhpcy5wcm9wcy5taWRpfS8+XG4gIFx0IFx0fSBlbHNlIGlmKG9iai50eXBlPT1cImNvbG9yXCIpe1xuICAgICAgICByZXR1cm4gPENvbG9yUGFsZXR0ZSB7Li4udGhpcy5wcm9wc30gY29udHJvbEluZGV4PXtpbmR9IGluZm89e29ian0gLz5cbiAgICAgIH0gZWxzZSBpZihvYmoudHlwZT09XCJtdWx0aS1zZWxlY3RcIil7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJyZW5kZXJpbmcgbXVsdGlcIik7XG4gICAgICAgIHJldHVybiA8TXVsdGlTZWxlY3Qgey4uLnRoaXMucHJvcHN9IGNvbnRyb2xJbmRleD17aW5kfSBpbmZvPXtvYmp9IC8+XG4gICAgICB9XG4gIFx0IH0uYmluZCh0aGlzKSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250cm9sLWdyb3VwXCI+XG4gICAgICAgPGgzPnt0aGlzLnByb3BzLmluZm8ubGFiZWx9PC9oMz5cbiAgICAgICB7Y29udHJvbHN9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xHcm91cDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29udHJvbEdyb3VwIGZyb20gJy4vQ29udHJvbEdyb3VwLmpzJztcblxuY2xhc3MgQ29udHJvbHMgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgdmFyIGdyb3VwcyA9IHRoaXMucHJvcHMub3B0aW9ucy5tYXAoZnVuY3Rpb24ob2JqLCBpbmQpe1xuICAgICAgcmV0dXJuIDxDb250cm9sR3JvdXAgaW5mbz17b2JqfSB1cGRhdGU9e3RoaXMucHJvcHMudXBkYXRlfSBtaWRpPXt0aGlzLnByb3BzLm1pZGl9IGdyb3VwSW5kZXg9e2luZH0ga2V5c0Rvd249e3RoaXMucHJvcHMua2V5c0Rvd259IGtleT17XCJncm91cHMgXCIraW5kfS8+XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250cm9sc1wiPlxuICAgICAgIHtncm91cHN9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xzO1xuIiwiLyp1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgY2FsY3VsYXRpbmcgcGF0aCovXG5cbmNsYXNzIE1pZGkge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIGNvbnNvbGUubG9nKFwiaW5pdCBtaWRpXCIpO1xuICAgIG5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2VzcygpLnRoZW4odGhpcy5vbk1JRElTdWNjZXNzLmJpbmQodGhpcyksIHRoaXMub25NSURJRmFpbHVyZSApO1xuICAgIHRoaXMuY2hhbm5lbHMgPSBbXTtcbiAgfVxuXG4gIG9uTUlESVN1Y2Nlc3MoYWNjZXNzKXtcbiAgICBjb25zb2xlLmxvZyhhY2Nlc3MpO1xuICAgIHRoaXMubWlkaSA9IGFjY2VzcztcbiAgICB0aGlzLm1pZGkuaW5wdXRzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpe2VudHJ5Lm9ubWlkaW1lc3NhZ2UgPSB0aGlzLmhhbmRsZU1lc3NhZ2UuYmluZCh0aGlzKX0uYmluZCh0aGlzKSk7XG4gICAvLyB0aGlzLmxpc3RJbnB1dHNBbmRPdXRwdXRzKGFjY2Vzcyk7XG4gIH1cblxuICBzZXRDaGFubmVsKGNoYW5uZWwsIHBhcmVudCwgY2FsbGJhY2spe1xuICAvLyAgaWYodGhpcy5taWRpKXtcbiAgICAgIHRoaXMuY2hhbm5lbHNbY2hhbm5lbF0gPSB7cGFyZW50OiBwYXJlbnQsIGNhbGxiYWNrOiBjYWxsYmFja307XG4gICAvKiB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJOTyBNSURJIVwiKTtcbiAgICB9Ki9cbiAgfVxuXG4gIGxpc3RJbnB1dHNBbmRPdXRwdXRzKCBtaWRpQWNjZXNzICkge1xuICAgIGZvciAodmFyIGVudHJ5IG9mIG1pZGlBY2Nlc3MuaW5wdXRzKSB7XG4gICAgICB2YXIgaW5wdXQgPSBlbnRyeVsxXTtcbiAgICAgIFxuICAgICAgY29uc29sZS5sb2coIFwiSW5wdXQgcG9ydCBbdHlwZTonXCIgKyBpbnB1dC50eXBlICsgXCInXSBpZDonXCIgKyBpbnB1dC5pZCArXG4gICAgICAgIFwiJyBtYW51ZmFjdHVyZXI6J1wiICsgaW5wdXQubWFudWZhY3R1cmVyICsgXCInIG5hbWU6J1wiICsgaW5wdXQubmFtZSArXG4gICAgICAgIFwiJyB2ZXJzaW9uOidcIiArIGlucHV0LnZlcnNpb24gKyBcIidcIiApO1xuICAgIH1cblxuICAgIGZvciAodmFyIGVudHJ5IG9mIG1pZGlBY2Nlc3Mub3V0cHV0cykge1xuICAgICAgLy92YXIgb3V0cHV0ID0gZW50cnlbMV07XG4gICAgICAvLyBjb25zb2xlLmxvZyggXCJPdXRwdXQgcG9ydCBbdHlwZTonXCIgKyBvdXRwdXQudHlwZSArIFwiJ10gaWQ6J1wiICsgb3V0cHV0LmlkICtcbiAgICAgIC8vICAgXCInIG1hbnVmYWN0dXJlcjonXCIgKyBvdXRwdXQubWFudWZhY3R1cmVyICsgXCInIG5hbWU6J1wiICsgb3V0cHV0Lm5hbWUgK1xuICAgICAgLy8gICBcIicgdmVyc2lvbjonXCIgKyBvdXRwdXQudmVyc2lvbiArIFwiJ1wiICk7XG4gICAgfVxuICB9XG5cbiAgb25NSURJRmFpbHVyZShtc2cpe1xuICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkIHRvIGdldCBtaWRpXCIpO1xuICB9XG5cbiAgaGFuZGxlTWVzc2FnZShtc2cpe1xuICAgLy8gY29uc29sZS5sb2cobXNnLmRhdGEpO1xuICAgIHZhciBjaGFubmVsID0gbXNnLmRhdGFbMV07XG4gICAgY29uc29sZS5sb2codGhpcy5jaGFubmVscyk7XG4gICAgaWYodGhpcy5jaGFubmVsc1tjaGFubmVsXSE9bnVsbCl7XG4gICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2hhbm5lbHMpXG4gICAgICB0aGlzLmNoYW5uZWxzW2NoYW5uZWxdLmNhbGxiYWNrLmNhbGwodGhpcy5jaGFubmVsc1tjaGFubmVsXS5wYXJlbnQsIG1zZy5kYXRhWzJdKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWlkaTtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIE11bHRpU2VsZWN0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgdXBkYXRlKGluZCwgdCl7XG4gICAvLyBjb25zb2xlLmxvZyh0LnByb3BzLmluZm8pO1xuICAgdmFyIHZhbHVlcyA9IHQucHJvcHMuaW5mby52YWx1ZS5zbGljZSgpO1xuICAgIGlmKHQucHJvcHMua2V5c0Rvd24uaW5kZXhPZigxNikgPiAtMSl7Ly9zaGlmdCBrZXkgcHJlc3NlZFxuICAgICAgY29uc29sZS5sb2coXCJTSElGVFwiKTtcbiAgICAgIHQucHJvcHMudXBkYXRlKGluZCwgdC5wcm9wcy5ncm91cEluZGV4LCB0LnByb3BzLmNvbnRyb2xJbmRleCwgXCJyZWNvcmRpbmdcIik7XG4gICAgICBpZighdmFsdWVzW2luZF0pe1xuICAgICAgICB2YWx1ZXNbaW5kXSA9IHRydWU7XG4gICAgICAgIHQucHJvcHMudXBkYXRlKHZhbHVlcywgdC5wcm9wcy5ncm91cEluZGV4LCB0LnByb3BzLmNvbnRyb2xJbmRleCwgXCJ2YWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgIFxuICAgICAgdmFsdWVzW2luZF0gPSB2YWx1ZXNbaW5kXSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgIHQucHJvcHMudXBkYXRlKHZhbHVlcywgdC5wcm9wcy5ncm91cEluZGV4LCB0LnByb3BzLmNvbnRyb2xJbmRleCwgXCJ2YWx1ZVwiKTtcbiAgICB9XG4gICBcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgLy8gIGNvbnNvbGUubG9nKFwicmVuZGVyaW5nIG11bHRpXCIpO1xuICBcdCB2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMuaW5mby5vcHRpb25zLm1hcChmdW5jdGlvbihuYW1lLCBpbmQpe1xuICAgICAgICB2YXIgY2xhc3NOYW1lID0gXCJjb250cm9sLWJ1dHRvblwiO1xuICAgICAgICBpZih0aGlzLnByb3BzLmluZm8udmFsdWVbaW5kXSkgY2xhc3NOYW1lKz0gXCIgc2VsZWN0ZWRcIjtcbiAgICAgICAgaWYodGhpcy5wcm9wcy5pbmZvLnJlY29yZGluZz09aW5kKSBjbGFzc05hbWUrPSBcIiByZWNvcmRpbmdcIjtcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9IGtleT17bmFtZX0gb25DbGljaz17dGhpcy51cGRhdGUuYmluZChudWxsLCBpbmQsIHRoaXMpfT57bmFtZX08L2Rpdj5cbiAgXHQgICBcbiAgXHQgICBcbiAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgdmFyIGxhYmVsID0gW107XG4gICAgIGlmKHRoaXMucHJvcHMuaW5mby5sYWJlbCkgbGFiZWwgPSAoPGg0Pnt0aGlzLnByb3BzLmluZm8ubGFiZWx9PC9oND4pO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17XCJjb250cm9sLWVsZW1lbnRcIn0+XG4gICAgICAgIHtsYWJlbH1cbiAgICAgICB7b3B0aW9uc31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTXVsdGlTZWxlY3Q7XG4iLCIvKnV0aWxpdHkgZnVuY3Rpb25zIGZvciBjYWxjdWxhdGluZyBwYXRoKi9cbmltcG9ydCBTZXR0aW5ncyBmcm9tICcuL3NldHRpbmdzLmpzb24nO1xuXG5jbGFzcyBQYXRoIHtcbiAgc3RhdGljIHJldmVyc2UocG9pbnRzKXtcbiAgICByZXR1cm4gcG9pbnRzLnJldmVyc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBjYWxjdWxhdGVPZmZzZXQocG9pbnRzLCBvZmZzZXQsIGluZGV4LCBib3VuZHNDaGVjayl7XG4gICAgLyp0cmFuc2xhdGUgYnkgZGlmZmVyZW5jZSBiZXR3ZWVuIG9sZCBzdGFydGluZyBwb2ludCBhbmQgbmV3Ki9cbiAgICAgLy8gXG4gICBpZihwb2ludHMubGVuZ3RoID4gaW5kZXgpe1xuICAgIGlmKGJvdW5kc0NoZWNrKXtcbiAgICAgIGlmKG9mZnNldC54ID4gU2V0dGluZ3Muc2l6ZS53LzIpIG9mZnNldC54IC09IFNldHRpbmdzLnNpemUudztcbiAgICAgIGlmKG9mZnNldC54IDwgLVNldHRpbmdzLnNpemUudy8yKSBvZmZzZXQueCArPSBTZXR0aW5ncy5zaXplLnc7XG4gICAgICBpZihvZmZzZXQueSA+IFNldHRpbmdzLnNpemUuaC8yKSBvZmZzZXQueSAtPSBTZXR0aW5ncy5zaXplLmg7XG4gICAgICBpZihvZmZzZXQueSA8IC1TZXR0aW5ncy5zaXplLmgvMikgb2Zmc2V0LnkgKz0gU2V0dGluZ3Muc2l6ZS5oO1xuICAgIH1cbiAgICB2YXIgb2ZmID0ge3g6IG9mZnNldC54LXBvaW50c1tpbmRleF0ueCwgeTogb2Zmc2V0LnktcG9pbnRzW2luZGV4XS55fVxuXG4gICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24ocHQpe1xuICAgICAgdmFyIG5ld1B0ID0gdGhpcy5hZGRQb2xhckNvb3Jkcyh7eDogcHQueCArIG9mZi54LCB5OiBwdC55ICsgb2ZmLnksIHNpemU6IHB0LnNpemV9KTtcbiAgICAgIC8vIGlmKG5ld1B0LnggPiB3aW5kb3cuaW5uZXJXaWR0aCkgbmV3UHQueCAtPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIC8vIGlmKG5ld1B0LnggPCAwKSBuZXdQdC54ICs9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgLy8gaWYobmV3UHQueSA+IHdpbmRvdy5pbm5lckhlaWdodCkgbmV3UHQueSAtPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAvLyBpZihuZXdQdC55IDwgMCkgbmV3UHQueSArPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICByZXR1cm4gbmV3UHQ7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBvaW50cztcbiAgIH1cbiAgICBcbiAgfVxuXG5cbiAgLyogY3JlYXRlIGNvbnRpbnVvdXMgbGluZSAqL1xuICBzdGF0aWMgYWRkTmV4dFBvaW50KHBvaW50cyl7XG4gICAgaWYocG9pbnRzLmxlbmd0aCA+PSAyKXtcbiAgICAgIHZhciBvZmYgPSB7eDogcG9pbnRzWzFdLngtcG9pbnRzWzBdLngsIHk6IHBvaW50c1sxXS55LXBvaW50c1swXS55fTtcbiAgICAgIHZhciBuZXdQdCA9IHt4OiBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXS54ICsgb2ZmLngsIHk6IHBvaW50c1twb2ludHMubGVuZ3RoLTFdLnkgKyBvZmYueSwgc2l6ZTogcG9pbnRzWzFdLnNpemV9O1xuICAgICBcbiAgICAgLyogVE8gRE8gOiBpZiBFTlRJUkUgbGluZSBvdXRzaWRlIGJvdW5kcywgb2Zmc2V0IGFsbCBwb2ludHMuIGJ1dCB3aGF0IGFib3V0IGxhcmdlIHNoYXBlcz8/IHNwbGl0IGxpbmVzP2MqL1xuICAgICAgLy8gaWYobmV3UHQueCA+IFNldHRpbmdzLnNpemUudy8yKSBuZXdQdC54IC09IFNldHRpbmdzLnNpemUudztcbiAgICAgIC8vIGlmKG5ld1B0LnggPCAtU2V0dGluZ3Muc2l6ZS53LzIpIG5ld1B0LnggKz0gU2V0dGluZ3Muc2l6ZS53O1xuICAgICAgLy8gaWYobmV3UHQueSA+IFNldHRpbmdzLnNpemUuaC8yKSBuZXdQdC55IC09IFNldHRpbmdzLnNpemUuaDtcbiAgICAgIC8vIGlmKG5ld1B0LnkgPCAtU2V0dGluZ3Muc2l6ZS5oLzIpIG5ld1B0LnkgKz0gU2V0dGluZ3Muc2l6ZS5oO1xuXG4gICAgICBwb2ludHMuc3BsaWNlKDAsIDEpO1xuICAgICAgcG9pbnRzLnB1c2godGhpcy5hZGRQb2xhckNvb3JkcyhuZXdQdCkpO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY2FsY3VsYXRlUG9sYXJPZmZzZXQocG9pbnRzLCBvLCBpbmRleCl7XG4gICAgLy9jb25zb2xlLmxvZyhcImNhbGMgb2Zmc2V0XCIsIG8pO1xuICAgIHZhciBwID0gdGhpcy50b1BvbGFyKG8pO1xuICAgICBjb25zb2xlLmxvZyhcInJlY3RcIiwgbyk7XG4gICAgY29uc29sZS5sb2coXCJwb2xhclwiLCBwKTtcbiAgICAgY29uc29sZS5sb2coXCJyZS1yZWN0XCIsIHRoaXMudG9SZWN0KHApKTtcblxuICAgIHZhciBvZmZzZXQgPSB0aGlzLmFkZFBvbGFyQ29vcmRzKG8pO1xuICAgIGlmKHBvaW50cy5sZW5ndGggPiBpbmRleCl7XG4gICAgICBjb25zb2xlLmxvZyhcIm9yaWdpbmFsIHBvaW50XCIsIHBvaW50c1tpbmRleF0pO1xuICAgICAgdmFyIG9mZiA9IHt0aGV0YTogb2Zmc2V0LnRoZXRhIC0gcG9pbnRzW2luZGV4XS50aGV0YSwgcjogb2Zmc2V0LnIgLSBwb2ludHNbaW5kZXhdLnJ9O1xuICAgICAgY29uc29sZS5sb2coXCJkaWZmZXJlbmNlXCIsIG9mZik7XG4gICAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbihwdCl7XG4gICAgICAgIHZhciBuZXdQdCA9IHRoaXMuYWRkUmVjdENvb3Jkcyh7cjogcHQuciArIG9mZi5yLCB0aGV0YTogcHQudGhldGEgKyBvZmYudGhldGEsIHNpemU6IHB0LnNpemV9KTtcbiAgICAgICAvLyB2YXIgbmV3UHQgPSB0aGlzLmFkZFJlY3RDb29yZHMoe3RoZXRhOiBwdC50aGV0YSArIG9mZi50aGV0YSwgcjogcHQucn0pO1xuICAgICAgICByZXR1cm4gbmV3UHQ7XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcG9pbnRzO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhZGRSZWN0Q29vcmRzKHB0KXtcbiAgICB2YXIgcmVjdCA9IHRoaXMudG9SZWN0KHB0KTtcbiAgICBwdC54ID0gcmVjdC54O1xuICAgIHB0LnkgPSByZWN0Lnk7XG4gICAgcmV0dXJuIHB0O1xuICB9XG5cbiAgc3RhdGljIHRvUmVjdChwdCl7XG4gICAgdmFyIHggPSBwdC5yKk1hdGguY29zKHB0LnRoZXRhKTtcbiAgICB2YXIgeSA9IHB0LnIqTWF0aC5zaW4ocHQudGhldGEpO1xuICAgIHJldHVybiAoe3g6IHgsIHk6IHl9KTtcbiAgfVxuXG4gIHN0YXRpYyBhZGRQb2xhckNvb3JkcyhwdCl7XG4gICAgLy9jb25zb2xlLmxvZyhcInBvaW50XCIsIHB0KTtcbiAgICB2YXIgcG9sYXIgPSB0aGlzLnRvUG9sYXIocHQpO1xuICAgLy8gY29uc29sZS5sb2coXCJwb2xhclwiLCBwb2xhcik7XG4gICAgcHQudGhldGEgPSBwb2xhci50aGV0YTtcbiAgICBwdC5yID0gcG9sYXIucjtcbiAgICByZXR1cm4gcHQ7XG4gIH1cblxuICBzdGF0aWMgdG9Qb2xhcihwdCl7XG4gICAgdmFyIHRoZXRhID0gTWF0aC5hdGFuMihwdC55ICwgcHQueCk7XG4gICAgdmFyIHIgPSBNYXRoLnNxcnQocHQueCpwdC54ICsgcHQueSpwdC55KTtcbiAgICByZXR1cm4gKHt0aGV0YTogdGhldGEsIHI6IHJ9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXRoO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcblxuY2xhc3MgU2VsZWN0Q29udHJvbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHVwZGF0ZShpbmQsIHQpe1xuICBcdHQucHJvcHMudXBkYXRlKGluZCwgdC5wcm9wcy5ncm91cEluZGV4LCB0LnByb3BzLmNvbnRyb2xJbmRleCwgXCJ2YWx1ZVwiKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcblxuICBcdCB2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMuaW5mby5vcHRpb25zLm1hcChmdW5jdGlvbihuYW1lLCBpbmQpe1xuICBcdCBcdHZhciBpbWdVcmw7XG4gIFx0IFxuICBcdCBcdGlmKHRoaXMucHJvcHMuaW5mby52YWx1ZT09PWluZCl7XG4gIFx0IFx0Ly9cdGltZ1VybCA9IHJlcXVpcmUoXCIuLy4uL2ltYWdlcy9cIituYW1lK1wiLXNlbGVjdGVkLTAxLnBuZ1wiKTtcbiAgICAgICAgaW1nVXJsID0gXCIuL2ltYWdlcy9cIituYW1lK1wiLXNlbGVjdGVkLTAxLnBuZ1wiO1xuICBcdCBcdH1lbHNle1xuICBcdCBcdC8vXHRpbWdVcmwgPSByZXF1aXJlKFwiLi8uLi9pbWFnZXMvXCIrbmFtZStcIi0wMS5wbmdcIik7XG4gICAgICBpbWdVcmwgPSBcIi4vaW1hZ2VzL1wiK25hbWUrXCItMDEucG5nXCI7XG4gIFx0IFx0fVxuICBcdCBcbiAgXHQgXHRyZXR1cm4gPGltZyBjbGFzc05hbWU9XCJjb250cm9sLWJ1dHRvblwiIHNyYz17aW1nVXJsfSBrZXk9e25hbWV9IGFsdD17bmFtZX0gb25DbGljaz17dGhpcy51cGRhdGUuYmluZChudWxsLCBpbmQsIHRoaXMpfSAvPjtcbiAgXHQgfS5iaW5kKHRoaXMpKTtcbiAgICAgdmFyIGxhYmVsID0gW107XG4gICAgIGlmKHRoaXMucHJvcHMuaW5mby5sYWJlbCkgbGFiZWwgPSAoPGg0Pnt0aGlzLnByb3BzLmluZm8ubGFiZWx9PC9oND4pO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17XCJjb250cm9sLWVsZW1lbnRcIn0+XG4gICAgICAgIHtsYWJlbH1cbiAgICAgICB7b3B0aW9uc31cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0Q29udHJvbDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5cblxuY2xhc3MgU2xpZGVyQ29udHJvbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHVwZGF0ZShlKXtcbiAgXHQvL2NvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgXHR0aGlzLnByb3BzLnVwZGF0ZShlLnRhcmdldC52YWx1ZSwgdGhpcy5wcm9wcy5ncm91cEluZGV4LCB0aGlzLnByb3BzLmNvbnRyb2xJbmRleCwgXCJ2YWx1ZVwiKTtcbiAgfVxuXG4gIHVwZGF0ZUZyb21NaWRpKHZhbCl7XG4gICAgY29uc29sZS5sb2coXCJNSURJIFVQREFURVwiLCB2YWwsIHRoaXMpO1xuICAgIHZhciBzY2FsZWRWYWwgPSB+figodmFsKyB0aGlzLnByb3BzLmluZm8ubWluKSAqICh0aGlzLnByb3BzLmluZm8ubWF4IC0gdGhpcy5wcm9wcy5pbmZvLm1pbikgLyAxMjcpLTE7XG4gICAgdGhpcy5wcm9wcy51cGRhdGUoc2NhbGVkVmFsLCB0aGlzLnByb3BzLmdyb3VwSW5kZXgsIHRoaXMucHJvcHMuY29udHJvbEluZGV4LCBcInZhbHVlXCIpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcblxuICB9XG5cbiAgcmVuZGVyKCkge1xuICBcdCBjb25zb2xlLmxvZyhcIm1pZGkgY2hhbm5lbFwiLCB0aGlzLnByb3BzLm1pZGkpO1xuICAgIGlmKFwibWlkaUNoYW5uZWxcIiBpbiB0aGlzLnByb3BzLmluZm8gJiYgdGhpcy5wcm9wcy5taWRpKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucHJvcHMubWlkaS5zZXRDaGFubmVsKHRoaXMucHJvcHMuaW5mby5taWRpQ2hhbm5lbCwgdGhpcywgdGhpcy51cGRhdGVGcm9tTWlkaSk7XG4gICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17XCJjb250cm9sLWVsZW1lbnRcIn0+XG4gICAgICAgPGg0Pnt0aGlzLnByb3BzLmluZm8ubGFiZWwrXCI6IFwiK3RoaXMucHJvcHMuaW5mby52YWx1ZX08L2g0PlxuICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBpZD1cIm15UmFuZ2VcIiBtaW49e3RoaXMucHJvcHMuaW5mby5taW59IG1heD17dGhpcy5wcm9wcy5pbmZvLm1heH1cbiAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy5pbmZvLnZhbHVlfSBvbkNoYW5nZT17dGhpcy51cGRhdGUuYmluZCh0aGlzKX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXJDb250cm9sO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IEFwcCBmcm9tICcuL0FwcCc7XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgPEFwcCAvPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKVxuKTtcbiIsIm1vZHVsZS5leHBvcnRzPVtcblx0e1xuXHRcdFwibGFiZWxcIjogXCJmb3JtYVwiLFxuXHRcdFwiY29udHJvbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcInR5cGVcIjogXCJzZWxlY3RcIiwgXG5cdFx0XHRcdFwibmFtZVwiOiBcInNoYXBlXCIsXG5cdFx0XHRcdFwib3B0aW9uc1wiOiBbXCJsaW5lXCIsIFwiY2lyY2xlXCIsIFwic3F1YXJlXCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcInNsaWRlclwiLFxuXHRcdFx0XHRcIm5hbWVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFwibGFiZWxcIjogXCJ0YW1hw7FvXCIsXG5cdFx0XHRcdFwidmFsdWVcIjogODksXG5cdFx0XHRcdFwibWluXCI6IDEsXG5cdFx0XHRcdFwibWF4XCI6IDMwMCxcblx0XHRcdFx0XCJtaWRpQ2hhbm5lbFwiOiAwXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcInR5cGVcIjogXCJzbGlkZXJcIixcblx0XHRcdFx0XCJuYW1lXCI6IFwibGVuZ3RoXCIsXG5cdFx0XHRcdFwibGFiZWxcIjogXCJsb25nLiBkZSBsaW5lYVwiLFxuXHRcdFx0XHRcInZhbHVlXCI6IDIwLFxuXHRcdFx0XHRcIm1pblwiOiAxLFxuXHRcdFx0XHRcIm1heFwiOiAzMDAsXG5cdFx0XHRcdFwibWlkaUNoYW5uZWxcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwiY29sb3JcIiwgXG5cdFx0XHRcdFwibmFtZVwiOiBcImNvbG9yXCIsXG5cdFx0XHRcdFwidmFsdWVcIjoge1xuXHRcdFx0XHRcdFwicmdiU3RyaW5nXCI6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XVxuXHR9LFxuXHR7XG5cdFx0XCJsYWJlbFwiOiBcImFuaW1hY2nDs25cIixcblx0XHRcImNvbnRyb2xzXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwic2VsZWN0XCIsIFxuXHRcdFx0XHRcImxhYmVsXCI6IFwiY2ljbG9cIixcblx0XHRcdFx0XCJuYW1lXCI6IFwicmVwZWF0XCIsXG5cdFx0XHRcdFwib3B0aW9uc1wiOiBbXCJyZXBlYXQtcmVwZWF0XCIsIFwicmVwZWF0LWNvbnRpbnVlXCIsIFwicmVwZWF0LXJldmVyc2VcIl0sXG5cdFx0XHRcdFwidmFsdWVcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwic2VsZWN0XCIsIFxuXHRcdFx0XHRcImxhYmVsXCI6IFwic2luY3Jvbml6YWNpw7NuXCIsXG5cdFx0XHRcdFwibmFtZVwiOiBcInN5bmNocm9cIixcblx0XHRcdFx0XCJvcHRpb25zXCI6IFtcInN5bmNocm8tc3luY2VkXCIsIFwic3luY2hyby1vZmZiZWF0XCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcInNlbGVjdFwiLCBcblx0XHRcdFx0XCJsYWJlbFwiOiBcImNvb3JkZW5hZGFzXCIsXG5cdFx0XHRcdFwibmFtZVwiOiBcImNvb3JkVHlwZVwiLFxuXHRcdFx0XHRcIm9wdGlvbnNcIjogW1wiY29vcmRlbmFkYXMtcmVjdFwiLCBcImNvb3JkZW5hZGFzLXBvbGFyXCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDBcblx0XHRcdH1cblx0XHRcdFxuXG5cdFx0XVxuXHR9LFxuXHR7XG5cdFx0XCJsYWJlbFwiOiBcInRyYWNrXCIsXG5cdFx0XCJjb250cm9sc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcIm11bHRpLXNlbGVjdFwiLFxuXHRcdFx0XHRcIm5hbWVcIjogXCJ0cmFja1wiLFxuXHRcdFx0XHRcImxhYmVsXCI6IFwiKGNsaWNrOiB2aXNpYmlsaWRhZCwgc2hpZnQgKyBjbGljazogZ3JhYmFyKVwiLFxuXHRcdFx0XHRcIm9wdGlvbnNcIjogWzEsIDIsIDMsIDRdLFxuXHRcdFx0XHRcInZhbHVlXCI6IFt0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSxcblx0XHRcdFx0XCJyZWNvcmRpbmdcIjogMFxuXHRcdFx0XHRcblx0XHRcdH1cblx0XHRdXG5cdH1cblxuXSIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJzaXplXCIgOiB7XCJ3XCI6IDEyODAsIFwiaFwiOiA3MjB9XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfU2xpZGVyID0gcmVxdWlyZSgnLi9TbGlkZXInKTtcblxudmFyIF9TbGlkZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU2xpZGVyKTtcblxudmFyIF9NYXAgPSByZXF1aXJlKCcuL01hcCcpO1xuXG52YXIgX01hcDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9NYXApO1xuXG52YXIgX3Rocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoL3Rocm90dGxlJyk7XG5cbnZhciBfdGhyb3R0bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXG52YXIgX3Rpbnljb2xvciA9IHJlcXVpcmUoJ3Rpbnljb2xvcjInKTtcblxudmFyIF90aW55Y29sb3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGlueWNvbG9yKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgQ29sb3JQaWNrZXIgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoQ29sb3JQaWNrZXIsIF9Db21wb25lbnQpO1xuXG4gIGZ1bmN0aW9uIENvbG9yUGlja2VyKHByb3BzKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvbG9yUGlja2VyKTtcblxuICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIE9iamVjdC5nZXRQcm90b3R5cGVPZihDb2xvclBpY2tlcikuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgdmFyIGMgPSAoMCwgX3Rpbnljb2xvcjIuZGVmYXVsdCkoX3RoaXMucHJvcHMuY29sb3IpLnRvSHN2KCk7XG4gICAgX3RoaXMuc3RhdGUgPSB7XG4gICAgICBjb2xvcjogX3RoaXMudG9QZXJjZW50YWdlKGMpXG4gICAgfTtcblxuICAgIF90aGlzLnRocm90dGxlID0gKDAsIF90aHJvdHRsZTIuZGVmYXVsdCkoZnVuY3Rpb24gKGZuLCBkYXRhKSB7XG4gICAgICBmbihkYXRhKTtcbiAgICB9LCAxMDApO1xuXG4gICAgX3RoaXMuaGFuZGxlU2F0dXJhdGlvblZhbHVlQ2hhbmdlID0gX3RoaXMuaGFuZGxlU2F0dXJhdGlvblZhbHVlQ2hhbmdlLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLmhhbmRsZUh1ZUNoYW5nZSA9IF90aGlzLmhhbmRsZUh1ZUNoYW5nZS5iaW5kKF90aGlzKTtcbiAgICBfdGhpcy5oYW5kbGVBbHBoYUNoYW5nZSA9IF90aGlzLmhhbmRsZUFscGhhQ2hhbmdlLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLnNob3dMYXN0VmFsdWUgPSBfdGhpcy5zaG93TGFzdFZhbHVlLmJpbmQoX3RoaXMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhDb2xvclBpY2tlciwgW3tcbiAgICBrZXk6ICdjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgIGlmICghX3Rpbnljb2xvcjIuZGVmYXVsdC5lcXVhbHMobmV4dFByb3BzLmNvbG9yLCB0aGlzLnN0YXRlLmNvbG9yKSkge1xuICAgICAgICB2YXIgYyA9ICgwLCBfdGlueWNvbG9yMi5kZWZhdWx0KShuZXh0UHJvcHMuY29sb3IpLnRvSHN2KCk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGNvbG9yOiB0aGlzLnRvUGVyY2VudGFnZShjKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd0b1BlcmNlbnRhZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1BlcmNlbnRhZ2UoaHN2KSB7XG4gICAgICB2YXIgaCA9IGhzdi5oO1xuICAgICAgdmFyIHMgPSBoc3YucztcbiAgICAgIHZhciB2ID0gaHN2LnY7XG4gICAgICB2YXIgYSA9IGhzdi5hO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBoOiBoLFxuICAgICAgICBzOiBzICogMTAwLFxuICAgICAgICB2OiB2ICogMTAwLFxuICAgICAgICBhOiBhXG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZUh1ZUNoYW5nZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUh1ZUNoYW5nZShoKSB7XG4gICAgICB2YXIgX3N0YXRlJGNvbG9yID0gdGhpcy5zdGF0ZS5jb2xvcjtcbiAgICAgIHZhciBzID0gX3N0YXRlJGNvbG9yLnM7XG4gICAgICB2YXIgdiA9IF9zdGF0ZSRjb2xvci52O1xuICAgICAgdmFyIGEgPSBfc3RhdGUkY29sb3IuYTtcblxuICAgICAgdGhpcy51cGRhdGUoeyBoOiBoLCBzOiBzLCB2OiB2LCBhOiBhIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2hhbmRsZVNhdHVyYXRpb25WYWx1ZUNoYW5nZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVNhdHVyYXRpb25WYWx1ZUNoYW5nZShzLCB2KSB7XG4gICAgICB2YXIgX3N0YXRlJGNvbG9yMiA9IHRoaXMuc3RhdGUuY29sb3I7XG4gICAgICB2YXIgaCA9IF9zdGF0ZSRjb2xvcjIuaDtcbiAgICAgIHZhciBhID0gX3N0YXRlJGNvbG9yMi5hO1xuXG4gICAgICB0aGlzLnVwZGF0ZSh7IGg6IGgsIHM6IHMsIHY6IHYsIGE6IGEgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlQWxwaGFDaGFuZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBoYW5kbGVBbHBoYUNoYW5nZShhKSB7XG4gICAgICB2YXIgX3N0YXRlJGNvbG9yMyA9IHRoaXMuc3RhdGUuY29sb3I7XG4gICAgICB2YXIgaCA9IF9zdGF0ZSRjb2xvcjMuaDtcbiAgICAgIHZhciBzID0gX3N0YXRlJGNvbG9yMy5zO1xuICAgICAgdmFyIHYgPSBfc3RhdGUkY29sb3IzLnY7XG5cbiAgICAgIHRoaXMudXBkYXRlKHsgaDogaCwgczogcywgdjogdiwgYTogYSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRBbHBoYScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEFscGhhKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuY29sb3IuYSA9PT0gdW5kZWZpbmVkID8gMSA6IHRoaXMuc3RhdGUuY29sb3IuYTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRCYWNrZ3JvdW5kSHVlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QmFja2dyb3VuZEh1ZSgpIHtcbiAgICAgIHJldHVybiAoMCwgX3Rpbnljb2xvcjIuZGVmYXVsdCkoe1xuICAgICAgICBoOiB0aGlzLnN0YXRlLmNvbG9yLmgsXG4gICAgICAgIHM6IDEwMCxcbiAgICAgICAgdjogMTAwIH0pLnRvUmdiU3RyaW5nKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0QmFja2dyb3VuZEdyYWRpZW50JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QmFja2dyb3VuZEdyYWRpZW50KCkge1xuICAgICAgdmFyIF9zdGF0ZSRjb2xvcjQgPSB0aGlzLnN0YXRlLmNvbG9yO1xuICAgICAgdmFyIGggPSBfc3RhdGUkY29sb3I0Lmg7XG4gICAgICB2YXIgcyA9IF9zdGF0ZSRjb2xvcjQucztcbiAgICAgIHZhciB2ID0gX3N0YXRlJGNvbG9yNC52O1xuXG4gICAgICB2YXIgb3BhcXVlID0gKDAsIF90aW55Y29sb3IyLmRlZmF1bHQpKHtcbiAgICAgICAgaDogaCxcbiAgICAgICAgczogcyxcbiAgICAgICAgdjogdixcbiAgICAgICAgYTogMSB9KS50b1JnYlN0cmluZygpO1xuICAgICAgcmV0dXJuICdsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoMCwwLDAsMCkgMCUsICcgKyBvcGFxdWUgKyAnIDEwMCUpJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoY29sb3IpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb2xvcjogY29sb3IgfSk7XG4gICAgICB0aGlzLnRocm90dGxlKHRoaXMucHJvcHMub25DaGFuZ2UsIHRoaXMub3V0cHV0KCkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ291dHB1dCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG91dHB1dCgpIHtcbiAgICAgIHZhciBjID0gKDAsIF90aW55Y29sb3IyLmRlZmF1bHQpKHRoaXMuc3RhdGUuY29sb3IpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaHNsOiBjLnRvSHNsKCksXG4gICAgICAgIGhleDogYy50b0hleCgpLFxuICAgICAgICBoZXhTdHJpbmc6IGMudG9IZXhTdHJpbmcoKSxcbiAgICAgICAgcmdiOiBjLnRvUmdiKCksXG4gICAgICAgIHJnYlN0cmluZzogYy50b1JnYlN0cmluZygpXG4gICAgICB9O1xuICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2hvd0xhc3RWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNob3dMYXN0VmFsdWUoKSB7XG4gICAgICB0aGlzLnByb3BzLm9uQ29tcGxldGUgJiYgdGhpcy5wcm9wcy5vbkNvbXBsZXRlKHRoaXMub3V0cHV0KCkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlbmRlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBfc3RhdGUkY29sb3I1ID0gdGhpcy5zdGF0ZS5jb2xvcjtcbiAgICAgIHZhciBoID0gX3N0YXRlJGNvbG9yNS5oO1xuICAgICAgdmFyIHMgPSBfc3RhdGUkY29sb3I1LnM7XG4gICAgICB2YXIgdiA9IF9zdGF0ZSRjb2xvcjUudjtcbiAgICAgIHZhciBhID0gX3N0YXRlJGNvbG9yNS5hO1xuXG4gICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnQ29sb3JQaWNrZXInLFxuICAgICAgICAgIHN0eWxlOiB0aGlzLnByb3BzLnN0eWxlIH0sXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9TbGlkZXIyLmRlZmF1bHQsIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdIdWVTbGlkZXInLFxuICAgICAgICAgIHZlcnRpY2FsOiB0cnVlLFxuICAgICAgICAgIHZhbHVlOiBoLFxuICAgICAgICAgIHR5cGU6ICdodWUnLFxuICAgICAgICAgIG1heDogMzYwLFxuICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUh1ZUNoYW5nZSxcbiAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLnNob3dMYXN0VmFsdWUsXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHJpZ2h0OiAnMS4zZW0nLFxuICAgICAgICAgICAgYm90dG9tOiB0aGlzLnByb3BzLm9wYWNpdHkgPyAnMi41ZW0nIDogJzEuM2VtJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdHJhY2tTdHlsZToge1xuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMWVtJyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLFxcbiAgICAgICAgICAgICAgI0ZGMDAwMCAwJSxcXG4gICAgICAgICAgICAgICNGRjAwOTkgMTAlLFxcbiAgICAgICAgICAgICAgI0NEMDBGRiAyMCUsXFxuICAgICAgICAgICAgICAjMzIwMEZGIDMwJSxcXG4gICAgICAgICAgICAgICMwMDY2RkYgNDAlLFxcbiAgICAgICAgICAgICAgIzAwRkZGRCA1MCUsXFxuICAgICAgICAgICAgICAjMDBGRjY2IDYwJSxcXG4gICAgICAgICAgICAgICMzNUZGMDAgNzAlLFxcbiAgICAgICAgICAgICAgI0NERkYwMCA4MCUsXFxuICAgICAgICAgICAgICAjRkY5OTAwIDkwJSxcXG4gICAgICAgICAgICAgICNGRjAwMDAgMTAwJVxcbiAgICAgICAgICAgICknXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb2ludGVyU3R5bGU6IHtcbiAgICAgICAgICAgIGJveFNoYWRvdzogJ2luc2V0IDAgMCAwIDFweCAjY2NjLDAgMXB4IDJweCAjY2NjJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnXG4gICAgICAgICAgfSB9KSxcbiAgICAgICAgdGhpcy5wcm9wcy5vcGFjaXR5ICYmIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KF9TbGlkZXIyLmRlZmF1bHQsIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdPcGFjaXR5U2xpZGVyJyxcbiAgICAgICAgICB0eXBlOiAnb3BhY2l0eScsXG4gICAgICAgICAgdmFsdWU6IGEsXG4gICAgICAgICAgbWF4OiAxLFxuICAgICAgICAgIGJhY2tncm91bmQ6IHRoaXMuZ2V0QmFja2dyb3VuZEdyYWRpZW50KCksXG4gICAgICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQWxwaGFDaGFuZ2UsXG4gICAgICAgICAgb25Db21wbGV0ZTogdGhpcy5zaG93TGFzdFZhbHVlLFxuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICBib3R0b206ICcxLjNlbScsXG4gICAgICAgICAgICByaWdodDogJzIuNWVtJyxcbiAgICAgICAgICAgIGhlaWdodDogOCxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmIHVybChcImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RkaEVBQVFBUEVBQU12THk4ek16UC8vL3dBQUFDd0FBQUFBRUFBUUFFQUNIWXh2b3NzdENBRU1ycTZKajgxMlk1OU5JRFFpcGRZNVhMV3FINHNWQURzPVwiKSByZXBlYXQnLFxuICAgICAgICAgICAgYmFja2dyb3VuZFNpemU6ICc4cHggOHB4J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdHJhY2tTdHlsZToge1xuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMWVtJyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsIHJnYmEoMjU1LDI1NSwyNTUsMCkgMCUsICNGRkYgMTAwJSknXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwb2ludGVyU3R5bGU6IHtcbiAgICAgICAgICAgIGJveFNoYWRvdzogJ2luc2V0IDAgMCAwIDFweCAjY2NjLDAgMXB4IDJweCAjY2NjJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwMCUnXG4gICAgICAgICAgfSB9KSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX01hcDIuZGVmYXVsdCwge1xuICAgICAgICAgIHg6IHMsXG4gICAgICAgICAgeTogdixcbiAgICAgICAgICBtYXg6IDEwMCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuZ2V0QmFja2dyb3VuZEh1ZSgpLFxuICAgICAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZVNhdHVyYXRpb25WYWx1ZUNoYW5nZSxcbiAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLnNob3dMYXN0VmFsdWUsXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICByaWdodDogJzIuNWVtJyxcbiAgICAgICAgICAgIGJvdHRvbTogdGhpcy5wcm9wcy5vcGFjaXR5ID8gJzIuNWVtJyA6ICcxLjNlbSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvaW50ZXJTdHlsZToge1xuICAgICAgICAgICAgYm9yZGVyQ29sb3I6ICgwLCBfdGlueWNvbG9yMi5kZWZhdWx0KSh0aGlzLnN0YXRlLmNvbG9yKS5pc0RhcmsoKSA/IFwiI2ZmZlwiIDogXCIjMDAwXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDb2xvclBpY2tlcjtcbn0oX3JlYWN0LkNvbXBvbmVudCk7XG5cbkNvbG9yUGlja2VyLnByb3BUeXBlcyA9IHtcbiAgY29sb3I6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIG9uQ2hhbmdlOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgb25Db21wbGV0ZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jXG59O1xuXG5Db2xvclBpY2tlci5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbG9yOiAncmdiYSgwLDAsMCwxKSdcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yUGlja2VyOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZHJhZ2dhYmxlO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfcmVhY3REb20gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcblxudmFyIF9yZWFjdERvbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdERvbSk7XG5cbnZhciBfaG9pc3ROb25SZWFjdFN0YXRpY3MgPSByZXF1aXJlKCdob2lzdC1ub24tcmVhY3Qtc3RhdGljcycpO1xuXG52YXIgX2hvaXN0Tm9uUmVhY3RTdGF0aWNzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2hvaXN0Tm9uUmVhY3RTdGF0aWNzKTtcblxudmFyIF90aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC90aHJvdHRsZScpO1xuXG52YXIgX3Rocm90dGxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3Rocm90dGxlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgbm9vcCA9IGZ1bmN0aW9uIG5vb3AoKSB7fTtcbnZhciBnZXREb2N1bWVudCA9IGZ1bmN0aW9uIGdldERvY3VtZW50KGVsZW1lbnQpIHtcbiAgcmV0dXJuIGVsZW1lbnQub3duZXJEb2N1bWVudDtcbn07XG52YXIgY2xhbXAgPSBmdW5jdGlvbiBjbGFtcCh2YWwsIG1pbiwgbWF4KSB7XG4gIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWwsIG1pbiksIG1heCk7XG59O1xudmFyIGdldERpc3BsYXlOYW1lID0gZnVuY3Rpb24gZ2V0RGlzcGxheU5hbWUoV3JhcHBlZENvbXBvbmVudCkge1xuICByZXR1cm4gV3JhcHBlZENvbXBvbmVudC5kaXNwbGF5TmFtZSB8fCBXcmFwcGVkQ29tcG9uZW50Lm5hbWUgfHwgJ0NvbXBvbmVudCc7XG59O1xuXG5mdW5jdGlvbiBkcmFnZ2FibGUoKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWRJbkRyYWdnYWJsZShXcmFwcGVkQ29tcG9uZW50KSB7XG4gICAgdmFyIERyYWdnYWJsZSA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gICAgICBfaW5oZXJpdHMoRHJhZ2dhYmxlLCBfQ29tcG9uZW50KTtcblxuICAgICAgZnVuY3Rpb24gRHJhZ2dhYmxlKHByb3BzKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBEcmFnZ2FibGUpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIE9iamVjdC5nZXRQcm90b3R5cGVPZihEcmFnZ2FibGUpLmNhbGwodGhpcywgcHJvcHMpKTtcblxuICAgICAgICBfdGhpcy5zdGF0ZSA9IHsgYWN0aXZlOiBmYWxzZSB9O1xuXG4gICAgICAgIF90aGlzLnRocm90dGxlID0gKDAsIF90aHJvdHRsZTIuZGVmYXVsdCkoZnVuY3Rpb24gKGZuLCBkYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGRhdGEpO1xuICAgICAgICB9LCAzMCk7XG4gICAgICAgIF90aGlzLmdldFBlcmNlbnRhZ2VWYWx1ZSA9IF90aGlzLmdldFBlcmNlbnRhZ2VWYWx1ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuc3RhcnRVcGRhdGVzID0gX3RoaXMuc3RhcnRVcGRhdGVzLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kbGVVcGRhdGUgPSBfdGhpcy5oYW5kbGVVcGRhdGUuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLnN0b3BVcGRhdGVzID0gX3RoaXMuc3RvcFVwZGF0ZXMuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmdldFBvc2l0aW9uID0gX3RoaXMuZ2V0UG9zaXRpb24uYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmdldFNjYWxlZFZhbHVlID0gX3RoaXMuZ2V0U2NhbGVkVmFsdWUuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCA9IF90aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdC5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMudXBkYXRlUG9zaXRpb24gPSBfdGhpcy51cGRhdGVQb3NpdGlvbi5iaW5kKF90aGlzKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgfVxuXG4gICAgICBfY3JlYXRlQ2xhc3MoRHJhZ2dhYmxlLCBbe1xuICAgICAgICBrZXk6ICdjb21wb25lbnREaWRNb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAgICAgICB0aGlzLmRvY3VtZW50ID0gZ2V0RG9jdW1lbnQoX3JlYWN0RG9tMi5kZWZhdWx0LmZpbmRET01Ob2RlKHRoaXMpKTtcbiAgICAgICAgICB2YXIgd2luZG93ID0gdGhpcy53aW5kb3cgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3O1xuXG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KTtcblxuICAgICAgICAgIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnY29tcG9uZW50V2lsbFVubW91bnQnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgICAgICAgdmFyIHdpbmRvdyA9IHRoaXMud2luZG93O1xuXG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMudXBkYXRlQm91bmRpbmdSZWN0KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdzdGFydFVwZGF0ZXMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc3RhcnRVcGRhdGVzKGUpIHtcbiAgICAgICAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLmRvY3VtZW50O1xuXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QoKTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIHRoaXMuaGFuZGxlVXBkYXRlKTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuaGFuZGxlVXBkYXRlKTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLnN0b3BVcGRhdGVzKTtcbiAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcy5zdG9wVXBkYXRlcyk7XG5cbiAgICAgICAgICB2YXIgX2dldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbihlKTtcblxuICAgICAgICAgIHZhciB4ID0gX2dldFBvc2l0aW9uLng7XG4gICAgICAgICAgdmFyIHkgPSBfZ2V0UG9zaXRpb24ueTtcblxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IHRydWUgfSk7XG4gICAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbih7IHg6IHgsIHk6IHkgfSk7XG4gICAgICAgICAgLy8gdGhpcy50aHJvdHRsZSh0aGlzLnVwZGF0ZVBvc2l0aW9uLCB7IHgsIHkgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnaGFuZGxlVXBkYXRlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZVVwZGF0ZShlKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBfZ2V0UG9zaXRpb24yID0gdGhpcy5nZXRQb3NpdGlvbihlKTtcblxuICAgICAgICAgICAgdmFyIHggPSBfZ2V0UG9zaXRpb24yLng7XG4gICAgICAgICAgICB2YXIgeSA9IF9nZXRQb3NpdGlvbjIueTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbih7IHg6IHgsIHk6IHkgfSk7XG4gICAgICAgICAgICAvLyB0aGlzLnRocm90dGxlKHRoaXMudXBkYXRlUG9zaXRpb24sIHsgeCwgeSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnc3RvcFVwZGF0ZXMnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcFVwZGF0ZXMoKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlKSB7XG4gICAgICAgICAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLmRvY3VtZW50O1xuXG5cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5oYW5kbGVVcGRhdGUpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmhhbmRsZVVwZGF0ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLnN0b3BVcGRhdGVzKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLnN0b3BVcGRhdGVzKTtcblxuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNvbXBsZXRlKCk7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlOiBmYWxzZSB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAndXBkYXRlUG9zaXRpb24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlUG9zaXRpb24oX3JlZikge1xuICAgICAgICAgIHZhciBjbGllbnRYID0gX3JlZi54O1xuICAgICAgICAgIHZhciBjbGllbnRZID0gX3JlZi55O1xuICAgICAgICAgIHZhciByZWN0ID0gdGhpcy5zdGF0ZS5yZWN0O1xuXG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5zaW5nbGUpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucHJvcHMudmVydGljYWwgPyAocmVjdC5ib3R0b20gLSBjbGllbnRZKSAvIHJlY3QuaGVpZ2h0IDogKGNsaWVudFggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuZ2V0U2NhbGVkVmFsdWUodmFsdWUpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgeCA9IChjbGllbnRYIC0gcmVjdC5sZWZ0KSAvIHJlY3Qud2lkdGg7XG4gICAgICAgICAgdmFyIHkgPSAocmVjdC5ib3R0b20gLSBjbGllbnRZKSAvIHJlY3QuaGVpZ2h0O1xuICAgICAgICAgIHJldHVybiB0aGlzLnByb3BzLm9uQ2hhbmdlKHRoaXMuZ2V0U2NhbGVkVmFsdWUoeCksIHRoaXMuZ2V0U2NhbGVkVmFsdWUoeSkpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldFBvc2l0aW9uJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvc2l0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS50b3VjaGVzKSB7XG4gICAgICAgICAgICBlID0gZS50b3VjaGVzWzBdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlLmNsaWVudFgsXG4gICAgICAgICAgICB5OiBlLmNsaWVudFlcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldFBlcmNlbnRhZ2VWYWx1ZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQZXJjZW50YWdlVmFsdWUodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUgLyB0aGlzLnByb3BzLm1heCAqIDEwMCArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldFNjYWxlZFZhbHVlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNjYWxlZFZhbHVlKHZhbHVlKSB7XG4gICAgICAgICAgcmV0dXJuIGNsYW1wKHZhbHVlLCAwLCAxKSAqIHRoaXMucHJvcHMubWF4O1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3VwZGF0ZUJvdW5kaW5nUmVjdCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVCb3VuZGluZ1JlY3QoKSB7XG4gICAgICAgICAgdmFyIHJlY3QgPSBfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUodGhpcykuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlY3Q6IHJlY3QgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAncmVuZGVyJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoV3JhcHBlZENvbXBvbmVudCwgX2V4dGVuZHMoe30sIHRoaXMucHJvcHMsIHRoaXMuc3RhdGUsIHtcbiAgICAgICAgICAgIHN0YXJ0VXBkYXRlczogdGhpcy5zdGFydFVwZGF0ZXMsXG4gICAgICAgICAgICBnZXRQZXJjZW50YWdlVmFsdWU6IHRoaXMuZ2V0UGVyY2VudGFnZVZhbHVlIH0pKTtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuXG4gICAgICByZXR1cm4gRHJhZ2dhYmxlO1xuICAgIH0oX3JlYWN0LkNvbXBvbmVudCk7XG5cbiAgICBEcmFnZ2FibGUuZGlzcGxheU5hbWUgPSAnZHJhZ2dhYmxlKCcgKyBnZXREaXNwbGF5TmFtZShXcmFwcGVkQ29tcG9uZW50KSArICcpJztcbiAgICBEcmFnZ2FibGUuV3JhcHBlZENvbXBvbmVudCA9IFdyYXBwZWRDb21wb25lbnQ7XG4gICAgRHJhZ2dhYmxlLnByb3BUeXBlcyA9IHtcbiAgICAgIG9uQ2hhbmdlOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICAgIG9uQ29tcGxldGU6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAgIG1heDogX3JlYWN0LlByb3BUeXBlcy5udW1iZXJcbiAgICB9O1xuICAgIERyYWdnYWJsZS5kZWZhdWx0UHJvcHMgPSB7XG4gICAgICBvbkNoYW5nZTogbm9vcCxcbiAgICAgIG9uQ29tcGxldGU6IG5vb3AsXG4gICAgICBtYXg6IDFcbiAgICB9O1xuXG4gICAgcmV0dXJuICgwLCBfaG9pc3ROb25SZWFjdFN0YXRpY3MyLmRlZmF1bHQpKERyYWdnYWJsZSwgV3JhcHBlZENvbXBvbmVudCk7XG4gIH07XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfRHJhZ2dhYmxlID0gcmVxdWlyZSgnLi9EcmFnZ2FibGUnKTtcblxudmFyIF9EcmFnZ2FibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRHJhZ2dhYmxlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgTWFwID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzKE1hcCwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gTWFwKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNYXApO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIE9iamVjdC5nZXRQcm90b3R5cGVPZihNYXApLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1hcCwgW3tcbiAgICBrZXk6ICdnZXRNYXBTdHlsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRNYXBTdHlsZXMoKSB7XG4gICAgICB2YXIgX01hcCRkZWZhdWx0U3R5bGVzID0gTWFwLmRlZmF1bHRTdHlsZXM7XG4gICAgICB2YXIgbWFwID0gX01hcCRkZWZhdWx0U3R5bGVzLm1hcDtcbiAgICAgIHZhciBtYXBBY3RpdmUgPSBfTWFwJGRlZmF1bHRTdHlsZXMubWFwQWN0aXZlO1xuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgbWFwLCB0aGlzLnByb3BzLnN0eWxlICYmIHRoaXMucHJvcHMuc3R5bGUsIHRoaXMucHJvcHMuYWN0aXZlICYmIG1hcEFjdGl2ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0UG9pbnRlclN0eWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvaW50ZXJTdHlsZXMoKSB7XG4gICAgICB2YXIgX01hcCRkZWZhdWx0U3R5bGVzMiA9IE1hcC5kZWZhdWx0U3R5bGVzO1xuICAgICAgdmFyIHBvaW50ZXIgPSBfTWFwJGRlZmF1bHRTdHlsZXMyLnBvaW50ZXI7XG4gICAgICB2YXIgcG9pbnRlckRhcmsgPSBfTWFwJGRlZmF1bHRTdHlsZXMyLnBvaW50ZXJEYXJrO1xuICAgICAgdmFyIHBvaW50ZXJMaWdodCA9IF9NYXAkZGVmYXVsdFN0eWxlczIucG9pbnRlckxpZ2h0O1xuXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcG9pbnRlciwgdGhpcy5wcm9wcy5wb2ludGVyU3R5bGUgJiYgdGhpcy5wcm9wcy5wb2ludGVyU3R5bGUsIHtcbiAgICAgICAgbGVmdDogdGhpcy5wcm9wcy5nZXRQZXJjZW50YWdlVmFsdWUodGhpcy5wcm9wcy54KSxcbiAgICAgICAgYm90dG9tOiB0aGlzLnByb3BzLmdldFBlcmNlbnRhZ2VWYWx1ZSh0aGlzLnByb3BzLnkpXG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRCZ1N0eWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldEJnU3R5bGVzKCkge1xuICAgICAgdmFyIGJnID0gTWFwLmRlZmF1bHRTdHlsZXMuYmc7XG4gICAgICB2YXIgYmFja2dyb3VuZENvbG9yID0gdGhpcy5wcm9wcy5iYWNrZ3JvdW5kQ29sb3I7XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBiZywgeyBiYWNrZ3JvdW5kQ29sb3I6IGJhY2tncm91bmRDb2xvciB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZW5kZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgYmdPdmVybGF5ID0gTWFwLmRlZmF1bHRTdHlsZXMuYmdPdmVybGF5O1xuXG4gICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSxcbiAgICAgICAgICBzdHlsZTogdGhpcy5nZXRNYXBTdHlsZXMoKSxcbiAgICAgICAgICBvbk1vdXNlRG93bjogdGhpcy5wcm9wcy5zdGFydFVwZGF0ZXMsXG4gICAgICAgICAgb25Ub3VjaFN0YXJ0OiB0aGlzLnByb3BzLnN0YXJ0VXBkYXRlcyB9LFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICAnZGl2JyxcbiAgICAgICAgICB7IGNsYXNzTmFtZTogJ01hcF9fQmFja2dyb3VuZCcsIHN0eWxlOiB0aGlzLmdldEJnU3R5bGVzKCkgfSxcbiAgICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnc3BhbicsIHsgY2xhc3NOYW1lOiAnTWFwX19CYWNrZ3JvdW5kX19vdmVybGF5Jywgc3R5bGU6IGJnT3ZlcmxheSB9KVxuICAgICAgICApLFxuICAgICAgICB0aGlzLnByb3BzLnJlY3QgJiYgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnTWFwX19Qb2ludGVyJywgc3R5bGU6IHRoaXMuZ2V0UG9pbnRlclN0eWxlcygpIH0pXG4gICAgICApO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNYXA7XG59KF9yZWFjdC5Db21wb25lbnQpO1xuXG5NYXAucHJvcFR5cGVzID0ge1xuICB4OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICB5OiBfcmVhY3QyLmRlZmF1bHQuUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICBiYWNrZ3JvdW5kQ29sb3I6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICBjbGFzc05hbWU6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5NYXAuZGVmYXVsdFByb3BzID0ge1xuICB4OiAwLFxuICB5OiAwLFxuICBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gIGNsYXNzTmFtZTogJ01hcCdcbn07XG5cbk1hcC5kZWZhdWx0U3R5bGVzID0ge1xuICAvLyBNYXBcbiAgbWFwOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAwLFxuICAgIGJvdHRvbTogMCxcbiAgICByaWdodDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICB1c2VyU2VsZWN0OiAnbm9uZSdcbiAgfSxcbiAgbWFwQWN0aXZlOiB7XG4gICAgY3Vyc29yOiAnbm9uZSdcbiAgfSxcblxuICAvLyBQb2ludGVyXG4gIHBvaW50ZXI6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogMTAsXG4gICAgaGVpZ2h0OiAxMCxcbiAgICBtYXJnaW5MZWZ0OiAtNSxcbiAgICBtYXJnaW5Cb3R0b206IC01LFxuICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCcsXG4gICAgd2lsbENoYW5nZTogJ2F1dG8nXG4gIH0sXG5cbiAgLy8gQmFja2dyb3VuZFxuICBiZzoge1xuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIHdpZHRoOiAnMTAwJSdcbiAgfSxcbiAgYmdPdmVybGF5OiB7XG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICBib3R0b206IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoMCwwLDAsMCkgMCUscmdiYSgwLDAsMCwxKSAxMDAlKSxcXG4gICAgICAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSgyNTUsMjU1LDI1NSwxKSAwJSxyZ2JhKDI1NSwyNTUsMjU1LDApIDEwMCUpJ1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX0RyYWdnYWJsZTIuZGVmYXVsdCkoKShNYXApOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9ob3Jpem9udGFsU2xpZGVyO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX3JlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcblxudmFyIF9yZWFjdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9yZWFjdCk7XG5cbnZhciBfRHJhZ2dhYmxlID0gcmVxdWlyZSgnLi9EcmFnZ2FibGUnKTtcblxudmFyIF9EcmFnZ2FibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRHJhZ2dhYmxlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4oc2VsZiwgY2FsbCkgeyBpZiAoIXNlbGYpIHsgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpOyB9IHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmOyB9XG5cbmZ1bmN0aW9uIF9pbmhlcml0cyhzdWJDbGFzcywgc3VwZXJDbGFzcykgeyBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxuXG52YXIgU2xpZGVyID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgX2luaGVyaXRzKFNsaWRlciwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gU2xpZGVyKCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTbGlkZXIpO1xuXG4gICAgcmV0dXJuIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIE9iamVjdC5nZXRQcm90b3R5cGVPZihTbGlkZXIpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNsaWRlciwgW3tcbiAgICBrZXk6ICdnZXRQb2ludGVyU3R5bGVzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UG9pbnRlclN0eWxlcygpIHtcbiAgICAgIHZhciBwb2ludGVyID0gU2xpZGVyLmRlZmF1bHRTdHlsZXMucG9pbnRlcjtcblxuICAgICAgdmFyIGF0dHIgPSB0aGlzLnByb3BzLnZlcnRpY2FsID8gJ2JvdHRvbScgOiAnbGVmdCc7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcG9pbnRlciwgdGhpcy5wcm9wcy5wb2ludGVyU3R5bGUgJiYgdGhpcy5wcm9wcy5wb2ludGVyU3R5bGUsIF9kZWZpbmVQcm9wZXJ0eSh7fSwgYXR0ciwgdGhpcy5wcm9wcy5nZXRQZXJjZW50YWdlVmFsdWUodGhpcy5wcm9wcy52YWx1ZSkpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRTbGlkZXJTdHlsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTbGlkZXJTdHlsZXMoKSB7XG4gICAgICB2YXIgX1NsaWRlciRkZWZhdWx0U3R5bGVzID0gU2xpZGVyLmRlZmF1bHRTdHlsZXM7XG4gICAgICB2YXIgc2xpZGVyID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzLnNsaWRlcjtcbiAgICAgIHZhciB2ZXJ0aWNhbFNsaWRlciA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlcy52ZXJ0aWNhbFNsaWRlcjtcbiAgICAgIHZhciBob3Jpem9udGFsU2xpZGVyID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzLmhvcml6b250YWxTbGlkZXI7XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzbGlkZXIsIHRoaXMucHJvcHMudmVydGljYWwgJiYgdmVydGljYWxTbGlkZXIsICF0aGlzLnByb3BzLnZlcnRpY2FsICYmIGhvcml6b250YWxTbGlkZXIsIHRoaXMucHJvcHMuc3R5bGUgJiYgdGhpcy5wcm9wcy5zdHlsZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0VHJhY2tTdHlsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRUcmFja1N0eWxlcygpIHtcbiAgICAgIHZhciBfU2xpZGVyJGRlZmF1bHRTdHlsZXMyID0gU2xpZGVyLmRlZmF1bHRTdHlsZXM7XG4gICAgICB2YXIgdHJhY2sgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMyLnRyYWNrO1xuICAgICAgdmFyIGhvcml6b250YWxUcmFjayA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczIuaG9yaXpvbnRhbFRyYWNrO1xuICAgICAgdmFyIHZlcnRpY2FsVHJhY2sgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMyLnZlcnRpY2FsVHJhY2s7XG4gICAgICB2YXIgb3BhY2l0eVRyYWNrID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMi5vcGFjaXR5VHJhY2s7XG4gICAgICB2YXIgaHVlVHJhY2sgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMyLmh1ZVRyYWNrO1xuXG4gICAgICB2YXIgYmFja2dyb3VuZCA9IHRoaXMucHJvcHMuYmFja2dyb3VuZDtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0cmFjaywgdGhpcy5wcm9wcy52ZXJ0aWNhbCAmJiB2ZXJ0aWNhbFRyYWNrLCAhdGhpcy5wcm9wcy52ZXJ0aWNhbCAmJiBob3Jpem9udGFsVHJhY2ssIHRoaXMucHJvcHMudHJhY2tTdHlsZSAmJiB0aGlzLnByb3BzLnRyYWNrU3R5bGUsIHRoaXMucHJvcHMuYmFja2dyb3VuZCAmJiB7IGJhY2tncm91bmQ6IHRoaXMucHJvcHMuYmFja2dyb3VuZCB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZW5kZXInLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICB2YXIgX1NsaWRlciRkZWZhdWx0U3R5bGVzMyA9IFNsaWRlci5kZWZhdWx0U3R5bGVzO1xuICAgICAgdmFyIG9wYWNpdHlTbGlkZXIgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMzLm9wYWNpdHlTbGlkZXI7XG4gICAgICB2YXIgb3BhY2l0eVNsaWRlcl9fdHJhY2sgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMzLm9wYWNpdHlTbGlkZXJfX3RyYWNrO1xuXG4gICAgICByZXR1cm4gX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLnByb3BzLmNsYXNzTmFtZSB8fCAnU2xpZGVyJyxcbiAgICAgICAgICBzdHlsZTogdGhpcy5nZXRTbGlkZXJTdHlsZXMoKSxcbiAgICAgICAgICBvbk1vdXNlRG93bjogdGhpcy5wcm9wcy5zdGFydFVwZGF0ZXMsXG4gICAgICAgICAgb25Ub3VjaFN0YXJ0OiB0aGlzLnByb3BzLnN0YXJ0VXBkYXRlcyB9LFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdTbGlkZXJfX1RyYWNrJywgc3R5bGU6IHRoaXMuZ2V0VHJhY2tTdHlsZXMoKSB9KSxcbiAgICAgICAgdGhpcy5wcm9wcy5yZWN0ICYmIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ1NsaWRlcl9fUG9pbnRlcicsIHN0eWxlOiB0aGlzLmdldFBvaW50ZXJTdHlsZXMoKSB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gU2xpZGVyO1xufShfcmVhY3QuQ29tcG9uZW50KTtcblxuU2xpZGVyLnByb3BUeXBlcyA9IHtcbiAgdmFsdWU6IF9yZWFjdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGJhY2tncm91bmQ6IF9yZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59O1xuXG5TbGlkZXIuZGVmYXVsdFByb3BzID0ge1xuICB2YWx1ZTogMCxcbiAgYmFja2dyb3VuZDogJydcbn07XG5cblNsaWRlci5kZWZhdWx0U3R5bGVzID0ge1xuICAvLyBTbGlkZXJcbiAgc2xpZGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdXNlclNlbGVjdDogJ25vbmUnXG4gIH0sXG4gIGhvcml6b250YWxTbGlkZXI6IChfaG9yaXpvbnRhbFNsaWRlciA9IHtcbiAgICBoZWlnaHQ6IDgsXG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMFxuICB9LCBfZGVmaW5lUHJvcGVydHkoX2hvcml6b250YWxTbGlkZXIsICdoZWlnaHQnLCAxMCksIF9kZWZpbmVQcm9wZXJ0eShfaG9yaXpvbnRhbFNsaWRlciwgJ2N1cnNvcicsICdldy1yZXNpemUnKSwgX2hvcml6b250YWxTbGlkZXIpLFxuICB2ZXJ0aWNhbFNsaWRlcjoge1xuICAgIHRvcDogMCxcbiAgICBib3R0b206IDAsXG4gICAgd2lkdGg6IDEwLFxuICAgIGN1cnNvcjogJ25zLXJlc2l6ZSdcbiAgfSxcblxuICAvLyBUcmFja1xuICB0cmFjazoge1xuICAgIGJhY2tncm91bmQ6ICcjZWZlZmVmJyxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICB9LFxuICBob3Jpem9udGFsVHJhY2s6IHtcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICBsZWZ0OiAwLFxuICAgIHJpZ2h0OiAwXG4gIH0sXG4gIHZlcnRpY2FsVHJhY2s6IHtcbiAgICBib3R0b206IDAsXG4gICAgdG9wOiAwLFxuICAgIHdpZHRoOiAnMTAwJSdcbiAgfSxcblxuICAvLyBQb2ludGVyXG4gIHBvaW50ZXI6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBib3R0b206ICc1MCUnLFxuICAgIGxlZnQ6ICc1MCUnLFxuICAgIHdpZHRoOiAxNixcbiAgICBoZWlnaHQ6IDE2LFxuICAgIG1hcmdpbkxlZnQ6IC04LFxuICAgIG1hcmdpbkJvdHRvbTogLTgsXG4gICAgYmFja2dyb3VuZDogJyNlZmVmZWYnLFxuICAgIHdpbGxDaGFuZ2U6ICdhdXRvJ1xuICB9XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSAoMCwgX0RyYWdnYWJsZTIuZGVmYXVsdCkoeyBzaW5nbGU6IHRydWUgfSkoU2xpZGVyKTsiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLk1hcCA9IGV4cG9ydHMuU2xpZGVyID0gdW5kZWZpbmVkO1xuXG52YXIgX0NvbG9yUGlja2VyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0NvbG9yUGlja2VyJyk7XG5cbnZhciBfQ29sb3JQaWNrZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ29sb3JQaWNrZXIpO1xuXG52YXIgX1NsaWRlcjIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvU2xpZGVyJyk7XG5cbnZhciBfU2xpZGVyMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1NsaWRlcjIpO1xuXG52YXIgX01hcDIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvTWFwJyk7XG5cbnZhciBfTWFwMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01hcDIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLlNsaWRlciA9IF9TbGlkZXIzLmRlZmF1bHQ7XG5leHBvcnRzLk1hcCA9IF9NYXAzLmRlZmF1bHQ7XG5leHBvcnRzLmRlZmF1bHQgPSBfQ29sb3JQaWNrZXIyLmRlZmF1bHQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28hIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE5ldyBCU0QgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUkVBQ1RfU1RBVElDUyA9IHtcbiAgICBjaGlsZENvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBjb250ZXh0VHlwZXM6IHRydWUsXG4gICAgZGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiB0cnVlLFxuICAgIGdldERlZmF1bHRQcm9wczogdHJ1ZSxcbiAgICBtaXhpbnM6IHRydWUsXG4gICAgcHJvcFR5cGVzOiB0cnVlLFxuICAgIHR5cGU6IHRydWVcbn07XG5cbnZhciBLTk9XTl9TVEFUSUNTID0ge1xuICAgIG5hbWU6IHRydWUsXG4gICAgbGVuZ3RoOiB0cnVlLFxuICAgIHByb3RvdHlwZTogdHJ1ZSxcbiAgICBjYWxsZXI6IHRydWUsXG4gICAgYXJndW1lbnRzOiB0cnVlLFxuICAgIGFyaXR5OiB0cnVlXG59O1xuXG52YXIgaXNHZXRPd25Qcm9wZXJ0eVN5bWJvbHNBdmFpbGFibGUgPSB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gJ2Z1bmN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBob2lzdE5vblJlYWN0U3RhdGljcyh0YXJnZXRDb21wb25lbnQsIHNvdXJjZUNvbXBvbmVudCwgY3VzdG9tU3RhdGljcykge1xuICAgIGlmICh0eXBlb2Ygc291cmNlQ29tcG9uZW50ICE9PSAnc3RyaW5nJykgeyAvLyBkb24ndCBob2lzdCBvdmVyIHN0cmluZyAoaHRtbCkgY29tcG9uZW50c1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNvdXJjZUNvbXBvbmVudCk7XG5cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgICAgaWYgKGlzR2V0T3duUHJvcGVydHlTeW1ib2xzQXZhaWxhYmxlKSB7XG4gICAgICAgICAgICBrZXlzID0ga2V5cy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzb3VyY2VDb21wb25lbnQpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgaWYgKCFSRUFDVF9TVEFUSUNTW2tleXNbaV1dICYmICFLTk9XTl9TVEFUSUNTW2tleXNbaV1dICYmICghY3VzdG9tU3RhdGljcyB8fCAhY3VzdG9tU3RhdGljc1trZXlzW2ldXSkpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXRDb21wb25lbnRba2V5c1tpXV0gPSBzb3VyY2VDb21wb25lbnRba2V5c1tpXV07XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRDb21wb25lbnQ7XG59O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIG5vdyA9IHJlcXVpcmUoJy4vbm93JyksXG4gICAgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcbiIsInZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4vZGVib3VuY2UnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsIi8vIFRpbnlDb2xvciB2MS40LjFcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iZ3JpbnMvVGlueUNvbG9yXG4vLyBCcmlhbiBHcmluc3RlYWQsIE1JVCBMaWNlbnNlXG5cbihmdW5jdGlvbihNYXRoKSB7XG5cbnZhciB0cmltTGVmdCA9IC9eXFxzKy8sXG4gICAgdHJpbVJpZ2h0ID0gL1xccyskLyxcbiAgICB0aW55Q291bnRlciA9IDAsXG4gICAgbWF0aFJvdW5kID0gTWF0aC5yb3VuZCxcbiAgICBtYXRoTWluID0gTWF0aC5taW4sXG4gICAgbWF0aE1heCA9IE1hdGgubWF4LFxuICAgIG1hdGhSYW5kb20gPSBNYXRoLnJhbmRvbTtcblxuZnVuY3Rpb24gdGlueWNvbG9yIChjb2xvciwgb3B0cykge1xuXG4gICAgY29sb3IgPSAoY29sb3IpID8gY29sb3IgOiAnJztcbiAgICBvcHRzID0gb3B0cyB8fCB7IH07XG5cbiAgICAvLyBJZiBpbnB1dCBpcyBhbHJlYWR5IGEgdGlueWNvbG9yLCByZXR1cm4gaXRzZWxmXG4gICAgaWYgKGNvbG9yIGluc3RhbmNlb2YgdGlueWNvbG9yKSB7XG4gICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBhcmUgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGNhbGwgdXNpbmcgbmV3IGluc3RlYWRcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgdGlueWNvbG9yKSkge1xuICAgICAgICByZXR1cm4gbmV3IHRpbnljb2xvcihjb2xvciwgb3B0cyk7XG4gICAgfVxuXG4gICAgdmFyIHJnYiA9IGlucHV0VG9SR0IoY29sb3IpO1xuICAgIHRoaXMuX29yaWdpbmFsSW5wdXQgPSBjb2xvcixcbiAgICB0aGlzLl9yID0gcmdiLnIsXG4gICAgdGhpcy5fZyA9IHJnYi5nLFxuICAgIHRoaXMuX2IgPSByZ2IuYixcbiAgICB0aGlzLl9hID0gcmdiLmEsXG4gICAgdGhpcy5fcm91bmRBID0gbWF0aFJvdW5kKDEwMCp0aGlzLl9hKSAvIDEwMCxcbiAgICB0aGlzLl9mb3JtYXQgPSBvcHRzLmZvcm1hdCB8fCByZ2IuZm9ybWF0O1xuICAgIHRoaXMuX2dyYWRpZW50VHlwZSA9IG9wdHMuZ3JhZGllbnRUeXBlO1xuXG4gICAgLy8gRG9uJ3QgbGV0IHRoZSByYW5nZSBvZiBbMCwyNTVdIGNvbWUgYmFjayBpbiBbMCwxXS5cbiAgICAvLyBQb3RlbnRpYWxseSBsb3NlIGEgbGl0dGxlIGJpdCBvZiBwcmVjaXNpb24gaGVyZSwgYnV0IHdpbGwgZml4IGlzc3VlcyB3aGVyZVxuICAgIC8vIC41IGdldHMgaW50ZXJwcmV0ZWQgYXMgaGFsZiBvZiB0aGUgdG90YWwsIGluc3RlYWQgb2YgaGFsZiBvZiAxXG4gICAgLy8gSWYgaXQgd2FzIHN1cHBvc2VkIHRvIGJlIDEyOCwgdGhpcyB3YXMgYWxyZWFkeSB0YWtlbiBjYXJlIG9mIGJ5IGBpbnB1dFRvUmdiYFxuICAgIGlmICh0aGlzLl9yIDwgMSkgeyB0aGlzLl9yID0gbWF0aFJvdW5kKHRoaXMuX3IpOyB9XG4gICAgaWYgKHRoaXMuX2cgPCAxKSB7IHRoaXMuX2cgPSBtYXRoUm91bmQodGhpcy5fZyk7IH1cbiAgICBpZiAodGhpcy5fYiA8IDEpIHsgdGhpcy5fYiA9IG1hdGhSb3VuZCh0aGlzLl9iKTsgfVxuXG4gICAgdGhpcy5fb2sgPSByZ2Iub2s7XG4gICAgdGhpcy5fdGNfaWQgPSB0aW55Q291bnRlcisrO1xufVxuXG50aW55Y29sb3IucHJvdG90eXBlID0ge1xuICAgIGlzRGFyazogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEJyaWdodG5lc3MoKSA8IDEyODtcbiAgICB9LFxuICAgIGlzTGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaXNEYXJrKCk7XG4gICAgfSxcbiAgICBpc1ZhbGlkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29rO1xuICAgIH0sXG4gICAgZ2V0T3JpZ2luYWxJbnB1dDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fb3JpZ2luYWxJbnB1dDtcbiAgICB9LFxuICAgIGdldEZvcm1hdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mb3JtYXQ7XG4gICAgfSxcbiAgICBnZXRBbHBoYTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hO1xuICAgIH0sXG4gICAgZ2V0QnJpZ2h0bmVzczogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vaHR0cDovL3d3dy53My5vcmcvVFIvQUVSVCNjb2xvci1jb250cmFzdFxuICAgICAgICB2YXIgcmdiID0gdGhpcy50b1JnYigpO1xuICAgICAgICByZXR1cm4gKHJnYi5yICogMjk5ICsgcmdiLmcgKiA1ODcgKyByZ2IuYiAqIDExNCkgLyAxMDAwO1xuICAgIH0sXG4gICAgZ2V0THVtaW5hbmNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9odHRwOi8vd3d3LnczLm9yZy9UUi8yMDA4L1JFQy1XQ0FHMjAtMjAwODEyMTEvI3JlbGF0aXZlbHVtaW5hbmNlZGVmXG4gICAgICAgIHZhciByZ2IgPSB0aGlzLnRvUmdiKCk7XG4gICAgICAgIHZhciBSc1JHQiwgR3NSR0IsIEJzUkdCLCBSLCBHLCBCO1xuICAgICAgICBSc1JHQiA9IHJnYi5yLzI1NTtcbiAgICAgICAgR3NSR0IgPSByZ2IuZy8yNTU7XG4gICAgICAgIEJzUkdCID0gcmdiLmIvMjU1O1xuXG4gICAgICAgIGlmIChSc1JHQiA8PSAwLjAzOTI4KSB7UiA9IFJzUkdCIC8gMTIuOTI7fSBlbHNlIHtSID0gTWF0aC5wb3coKChSc1JHQiArIDAuMDU1KSAvIDEuMDU1KSwgMi40KTt9XG4gICAgICAgIGlmIChHc1JHQiA8PSAwLjAzOTI4KSB7RyA9IEdzUkdCIC8gMTIuOTI7fSBlbHNlIHtHID0gTWF0aC5wb3coKChHc1JHQiArIDAuMDU1KSAvIDEuMDU1KSwgMi40KTt9XG4gICAgICAgIGlmIChCc1JHQiA8PSAwLjAzOTI4KSB7QiA9IEJzUkdCIC8gMTIuOTI7fSBlbHNlIHtCID0gTWF0aC5wb3coKChCc1JHQiArIDAuMDU1KSAvIDEuMDU1KSwgMi40KTt9XG4gICAgICAgIHJldHVybiAoMC4yMTI2ICogUikgKyAoMC43MTUyICogRykgKyAoMC4wNzIyICogQik7XG4gICAgfSxcbiAgICBzZXRBbHBoYTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdGhpcy5fYSA9IGJvdW5kQWxwaGEodmFsdWUpO1xuICAgICAgICB0aGlzLl9yb3VuZEEgPSBtYXRoUm91bmQoMTAwKnRoaXMuX2EpIC8gMTAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHRvSHN2OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzdiA9IHJnYlRvSHN2KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICByZXR1cm4geyBoOiBoc3YuaCAqIDM2MCwgczogaHN2LnMsIHY6IGhzdi52LCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b0hzdlN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc3YgPSByZ2JUb0hzdih0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgdmFyIGggPSBtYXRoUm91bmQoaHN2LmggKiAzNjApLCBzID0gbWF0aFJvdW5kKGhzdi5zICogMTAwKSwgdiA9IG1hdGhSb3VuZChoc3YudiAqIDEwMCk7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJoc3YoXCIgICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgdiArIFwiJSlcIiA6XG4gICAgICAgICAgXCJoc3ZhKFwiICsgaCArIFwiLCBcIiArIHMgKyBcIiUsIFwiICsgdiArIFwiJSwgXCIrIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9Ic2w6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHNsID0gcmdiVG9Ic2wodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHJldHVybiB7IGg6IGhzbC5oICogMzYwLCBzOiBoc2wucywgbDogaHNsLmwsIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvSHNsU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzbCA9IHJnYlRvSHNsKHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICB2YXIgaCA9IG1hdGhSb3VuZChoc2wuaCAqIDM2MCksIHMgPSBtYXRoUm91bmQoaHNsLnMgKiAxMDApLCBsID0gbWF0aFJvdW5kKGhzbC5sICogMTAwKTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcImhzbChcIiAgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyBsICsgXCIlKVwiIDpcbiAgICAgICAgICBcImhzbGEoXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyBsICsgXCIlLCBcIisgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b0hleDogZnVuY3Rpb24oYWxsb3czQ2hhcikge1xuICAgICAgICByZXR1cm4gcmdiVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgYWxsb3czQ2hhcik7XG4gICAgfSxcbiAgICB0b0hleFN0cmluZzogZnVuY3Rpb24oYWxsb3czQ2hhcikge1xuICAgICAgICByZXR1cm4gJyMnICsgdGhpcy50b0hleChhbGxvdzNDaGFyKTtcbiAgICB9LFxuICAgIHRvSGV4ODogZnVuY3Rpb24oYWxsb3c0Q2hhcikge1xuICAgICAgICByZXR1cm4gcmdiYVRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRoaXMuX2EsIGFsbG93NENoYXIpO1xuICAgIH0sXG4gICAgdG9IZXg4U3RyaW5nOiBmdW5jdGlvbihhbGxvdzRDaGFyKSB7XG4gICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSGV4OChhbGxvdzRDaGFyKTtcbiAgICB9LFxuICAgIHRvUmdiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0aFJvdW5kKHRoaXMuX3IpLCBnOiBtYXRoUm91bmQodGhpcy5fZyksIGI6IG1hdGhSb3VuZCh0aGlzLl9iKSwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9SZ2JTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwicmdiKFwiICArIG1hdGhSb3VuZCh0aGlzLl9yKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9nKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9iKSArIFwiKVwiIDpcbiAgICAgICAgICBcInJnYmEoXCIgKyBtYXRoUm91bmQodGhpcy5fcikgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fZykgKyBcIiwgXCIgKyBtYXRoUm91bmQodGhpcy5fYikgKyBcIiwgXCIgKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvUGVyY2VudGFnZVJnYjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX3IsIDI1NSkgKiAxMDApICsgXCIlXCIsIGc6IG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2csIDI1NSkgKiAxMDApICsgXCIlXCIsIGI6IG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2IsIDI1NSkgKiAxMDApICsgXCIlXCIsIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvUGVyY2VudGFnZVJnYlN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJyZ2IoXCIgICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fciwgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fZywgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fYiwgMjU1KSAqIDEwMCkgKyBcIiUpXCIgOlxuICAgICAgICAgIFwicmdiYShcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX3IsIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2csIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIG1hdGhSb3VuZChib3VuZDAxKHRoaXMuX2IsIDI1NSkgKiAxMDApICsgXCIlLCBcIiArIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9OYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2EgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBcInRyYW5zcGFyZW50XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZXhOYW1lc1tyZ2JUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCB0cnVlKV0gfHwgZmFsc2U7XG4gICAgfSxcbiAgICB0b0ZpbHRlcjogZnVuY3Rpb24oc2Vjb25kQ29sb3IpIHtcbiAgICAgICAgdmFyIGhleDhTdHJpbmcgPSAnIycgKyByZ2JhVG9BcmdiSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRoaXMuX2EpO1xuICAgICAgICB2YXIgc2Vjb25kSGV4OFN0cmluZyA9IGhleDhTdHJpbmc7XG4gICAgICAgIHZhciBncmFkaWVudFR5cGUgPSB0aGlzLl9ncmFkaWVudFR5cGUgPyBcIkdyYWRpZW50VHlwZSA9IDEsIFwiIDogXCJcIjtcblxuICAgICAgICBpZiAoc2Vjb25kQ29sb3IpIHtcbiAgICAgICAgICAgIHZhciBzID0gdGlueWNvbG9yKHNlY29uZENvbG9yKTtcbiAgICAgICAgICAgIHNlY29uZEhleDhTdHJpbmcgPSAnIycgKyByZ2JhVG9BcmdiSGV4KHMuX3IsIHMuX2csIHMuX2IsIHMuX2EpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwicHJvZ2lkOkRYSW1hZ2VUcmFuc2Zvcm0uTWljcm9zb2Z0LmdyYWRpZW50KFwiK2dyYWRpZW50VHlwZStcInN0YXJ0Q29sb3JzdHI9XCIraGV4OFN0cmluZytcIixlbmRDb2xvcnN0cj1cIitzZWNvbmRIZXg4U3RyaW5nK1wiKVwiO1xuICAgIH0sXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgZm9ybWF0U2V0ID0gISFmb3JtYXQ7XG4gICAgICAgIGZvcm1hdCA9IGZvcm1hdCB8fCB0aGlzLl9mb3JtYXQ7XG5cbiAgICAgICAgdmFyIGZvcm1hdHRlZFN0cmluZyA9IGZhbHNlO1xuICAgICAgICB2YXIgaGFzQWxwaGEgPSB0aGlzLl9hIDwgMSAmJiB0aGlzLl9hID49IDA7XG4gICAgICAgIHZhciBuZWVkc0FscGhhRm9ybWF0ID0gIWZvcm1hdFNldCAmJiBoYXNBbHBoYSAmJiAoZm9ybWF0ID09PSBcImhleFwiIHx8IGZvcm1hdCA9PT0gXCJoZXg2XCIgfHwgZm9ybWF0ID09PSBcImhleDNcIiB8fCBmb3JtYXQgPT09IFwiaGV4NFwiIHx8IGZvcm1hdCA9PT0gXCJoZXg4XCIgfHwgZm9ybWF0ID09PSBcIm5hbWVcIik7XG5cbiAgICAgICAgaWYgKG5lZWRzQWxwaGFGb3JtYXQpIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgXCJ0cmFuc3BhcmVudFwiLCBhbGwgb3RoZXIgbm9uLWFscGhhIGZvcm1hdHNcbiAgICAgICAgICAgIC8vIHdpbGwgcmV0dXJuIHJnYmEgd2hlbiB0aGVyZSBpcyB0cmFuc3BhcmVuY3kuXG4gICAgICAgICAgICBpZiAoZm9ybWF0ID09PSBcIm5hbWVcIiAmJiB0aGlzLl9hID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9OYW1lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b1JnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwicmdiXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9SZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcInByZ2JcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b1BlcmNlbnRhZ2VSZ2JTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleFwiIHx8IGZvcm1hdCA9PT0gXCJoZXg2XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleDNcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleFN0cmluZyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleDRcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleDhTdHJpbmcodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoZXg4XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9IZXg4U3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9OYW1lKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoc2xcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hzbFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaHN2XCIpIHtcbiAgICAgICAgICAgIGZvcm1hdHRlZFN0cmluZyA9IHRoaXMudG9Ic3ZTdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWRTdHJpbmcgfHwgdGhpcy50b0hleFN0cmluZygpO1xuICAgIH0sXG4gICAgY2xvbmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGlueWNvbG9yKHRoaXMudG9TdHJpbmcoKSk7XG4gICAgfSxcblxuICAgIF9hcHBseU1vZGlmaWNhdGlvbjogZnVuY3Rpb24oZm4sIGFyZ3MpIHtcbiAgICAgICAgdmFyIGNvbG9yID0gZm4uYXBwbHkobnVsbCwgW3RoaXNdLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3MpKSk7XG4gICAgICAgIHRoaXMuX3IgPSBjb2xvci5fcjtcbiAgICAgICAgdGhpcy5fZyA9IGNvbG9yLl9nO1xuICAgICAgICB0aGlzLl9iID0gY29sb3IuX2I7XG4gICAgICAgIHRoaXMuc2V0QWxwaGEoY29sb3IuX2EpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGxpZ2h0ZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24obGlnaHRlbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGJyaWdodGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGJyaWdodGVuLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZGFya2VuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGRhcmtlbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGRlc2F0dXJhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oZGVzYXR1cmF0ZSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNhdHVyYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKHNhdHVyYXRlLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZ3JleXNjYWxlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5TW9kaWZpY2F0aW9uKGdyZXlzY2FsZSwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNwaW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oc3BpbiwgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5Q29tYmluYXRpb246IGZ1bmN0aW9uKGZuLCBhcmdzKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBbdGhpc10uY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJncykpKTtcbiAgICB9LFxuICAgIGFuYWxvZ291czogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKGFuYWxvZ291cywgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIGNvbXBsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihjb21wbGVtZW50LCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgbW9ub2Nocm9tYXRpYzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKG1vbm9jaHJvbWF0aWMsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBzcGxpdGNvbXBsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbihzcGxpdGNvbXBsZW1lbnQsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICB0cmlhZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKHRyaWFkLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgdGV0cmFkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24odGV0cmFkLCBhcmd1bWVudHMpO1xuICAgIH1cbn07XG5cbi8vIElmIGlucHV0IGlzIGFuIG9iamVjdCwgZm9yY2UgMSBpbnRvIFwiMS4wXCIgdG8gaGFuZGxlIHJhdGlvcyBwcm9wZXJseVxuLy8gU3RyaW5nIGlucHV0IHJlcXVpcmVzIFwiMS4wXCIgYXMgaW5wdXQsIHNvIDEgd2lsbCBiZSB0cmVhdGVkIGFzIDFcbnRpbnljb2xvci5mcm9tUmF0aW8gPSBmdW5jdGlvbihjb2xvciwgb3B0cykge1xuICAgIGlmICh0eXBlb2YgY29sb3IgPT0gXCJvYmplY3RcIikge1xuICAgICAgICB2YXIgbmV3Q29sb3IgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBjb2xvcikge1xuICAgICAgICAgICAgaWYgKGNvbG9yLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IFwiYVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbG9yW2ldID0gY29sb3JbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdDb2xvcltpXSA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3JbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb2xvciA9IG5ld0NvbG9yO1xuICAgIH1cblxuICAgIHJldHVybiB0aW55Y29sb3IoY29sb3IsIG9wdHMpO1xufTtcblxuLy8gR2l2ZW4gYSBzdHJpbmcgb3Igb2JqZWN0LCBjb252ZXJ0IHRoYXQgaW5wdXQgdG8gUkdCXG4vLyBQb3NzaWJsZSBzdHJpbmcgaW5wdXRzOlxuLy9cbi8vICAgICBcInJlZFwiXG4vLyAgICAgXCIjZjAwXCIgb3IgXCJmMDBcIlxuLy8gICAgIFwiI2ZmMDAwMFwiIG9yIFwiZmYwMDAwXCJcbi8vICAgICBcIiNmZjAwMDAwMFwiIG9yIFwiZmYwMDAwMDBcIlxuLy8gICAgIFwicmdiIDI1NSAwIDBcIiBvciBcInJnYiAoMjU1LCAwLCAwKVwiXG4vLyAgICAgXCJyZ2IgMS4wIDAgMFwiIG9yIFwicmdiICgxLCAwLCAwKVwiXG4vLyAgICAgXCJyZ2JhICgyNTUsIDAsIDAsIDEpXCIgb3IgXCJyZ2JhIDI1NSwgMCwgMCwgMVwiXG4vLyAgICAgXCJyZ2JhICgxLjAsIDAsIDAsIDEpXCIgb3IgXCJyZ2JhIDEuMCwgMCwgMCwgMVwiXG4vLyAgICAgXCJoc2woMCwgMTAwJSwgNTAlKVwiIG9yIFwiaHNsIDAgMTAwJSA1MCVcIlxuLy8gICAgIFwiaHNsYSgwLCAxMDAlLCA1MCUsIDEpXCIgb3IgXCJoc2xhIDAgMTAwJSA1MCUsIDFcIlxuLy8gICAgIFwiaHN2KDAsIDEwMCUsIDEwMCUpXCIgb3IgXCJoc3YgMCAxMDAlIDEwMCVcIlxuLy9cbmZ1bmN0aW9uIGlucHV0VG9SR0IoY29sb3IpIHtcblxuICAgIHZhciByZ2IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbiAgICB2YXIgYSA9IDE7XG4gICAgdmFyIHMgPSBudWxsO1xuICAgIHZhciB2ID0gbnVsbDtcbiAgICB2YXIgbCA9IG51bGw7XG4gICAgdmFyIG9rID0gZmFsc2U7XG4gICAgdmFyIGZvcm1hdCA9IGZhbHNlO1xuXG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGNvbG9yID0gc3RyaW5nSW5wdXRUb09iamVjdChjb2xvcik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmIChpc1ZhbGlkQ1NTVW5pdChjb2xvci5yKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5nKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5iKSkge1xuICAgICAgICAgICAgcmdiID0gcmdiVG9SZ2IoY29sb3IuciwgY29sb3IuZywgY29sb3IuYik7XG4gICAgICAgICAgICBvayA9IHRydWU7XG4gICAgICAgICAgICBmb3JtYXQgPSBTdHJpbmcoY29sb3Iucikuc3Vic3RyKC0xKSA9PT0gXCIlXCIgPyBcInByZ2JcIiA6IFwicmdiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNWYWxpZENTU1VuaXQoY29sb3IuaCkgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IucykgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IudikpIHtcbiAgICAgICAgICAgIHMgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnMpO1xuICAgICAgICAgICAgdiA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iudik7XG4gICAgICAgICAgICByZ2IgPSBoc3ZUb1JnYihjb2xvci5oLCBzLCB2KTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9IFwiaHN2XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNWYWxpZENTU1VuaXQoY29sb3IuaCkgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IucykgJiYgaXNWYWxpZENTU1VuaXQoY29sb3IubCkpIHtcbiAgICAgICAgICAgIHMgPSBjb252ZXJ0VG9QZXJjZW50YWdlKGNvbG9yLnMpO1xuICAgICAgICAgICAgbCA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3IubCk7XG4gICAgICAgICAgICByZ2IgPSBoc2xUb1JnYihjb2xvci5oLCBzLCBsKTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9IFwiaHNsXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoXCJhXCIpKSB7XG4gICAgICAgICAgICBhID0gY29sb3IuYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGEgPSBib3VuZEFscGhhKGEpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IG9rLFxuICAgICAgICBmb3JtYXQ6IGNvbG9yLmZvcm1hdCB8fCBmb3JtYXQsXG4gICAgICAgIHI6IG1hdGhNaW4oMjU1LCBtYXRoTWF4KHJnYi5yLCAwKSksXG4gICAgICAgIGc6IG1hdGhNaW4oMjU1LCBtYXRoTWF4KHJnYi5nLCAwKSksXG4gICAgICAgIGI6IG1hdGhNaW4oMjU1LCBtYXRoTWF4KHJnYi5iLCAwKSksXG4gICAgICAgIGE6IGFcbiAgICB9O1xufVxuXG5cbi8vIENvbnZlcnNpb24gRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBgcmdiVG9Ic2xgLCBgcmdiVG9Ic3ZgLCBgaHNsVG9SZ2JgLCBgaHN2VG9SZ2JgIG1vZGlmaWVkIGZyb206XG4vLyA8aHR0cDovL21qaWphY2tzb24uY29tLzIwMDgvMDIvcmdiLXRvLWhzbC1hbmQtcmdiLXRvLWhzdi1jb2xvci1tb2RlbC1jb252ZXJzaW9uLWFsZ29yaXRobXMtaW4tamF2YXNjcmlwdD5cblxuLy8gYHJnYlRvUmdiYFxuLy8gSGFuZGxlIGJvdW5kcyAvIHBlcmNlbnRhZ2UgY2hlY2tpbmcgdG8gY29uZm9ybSB0byBDU1MgY29sb3Igc3BlY1xuLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtY29sb3IvPlxuLy8gKkFzc3VtZXM6KiByLCBnLCBiIGluIFswLCAyNTVdIG9yIFswLCAxXVxuLy8gKlJldHVybnM6KiB7IHIsIGcsIGIgfSBpbiBbMCwgMjU1XVxuZnVuY3Rpb24gcmdiVG9SZ2IociwgZywgYil7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcjogYm91bmQwMShyLCAyNTUpICogMjU1LFxuICAgICAgICBnOiBib3VuZDAxKGcsIDI1NSkgKiAyNTUsXG4gICAgICAgIGI6IGJvdW5kMDEoYiwgMjU1KSAqIDI1NVxuICAgIH07XG59XG5cbi8vIGByZ2JUb0hzbGBcbi8vIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU0wuXG4vLyAqQXNzdW1lczoqIHIsIGcsIGFuZCBiIGFyZSBjb250YWluZWQgaW4gWzAsIDI1NV0gb3IgWzAsIDFdXG4vLyAqUmV0dXJuczoqIHsgaCwgcywgbCB9IGluIFswLDFdXG5mdW5jdGlvbiByZ2JUb0hzbChyLCBnLCBiKSB7XG5cbiAgICByID0gYm91bmQwMShyLCAyNTUpO1xuICAgIGcgPSBib3VuZDAxKGcsIDI1NSk7XG4gICAgYiA9IGJvdW5kMDEoYiwgMjU1KTtcblxuICAgIHZhciBtYXggPSBtYXRoTWF4KHIsIGcsIGIpLCBtaW4gPSBtYXRoTWluKHIsIGcsIGIpO1xuICAgIHZhciBoLCBzLCBsID0gKG1heCArIG1pbikgLyAyO1xuXG4gICAgaWYobWF4ID09IG1pbikge1xuICAgICAgICBoID0gcyA9IDA7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBkID0gbWF4IC0gbWluO1xuICAgICAgICBzID0gbCA+IDAuNSA/IGQgLyAoMiAtIG1heCAtIG1pbikgOiBkIC8gKG1heCArIG1pbik7XG4gICAgICAgIHN3aXRjaChtYXgpIHtcbiAgICAgICAgICAgIGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZzogaCA9IChiIC0gcikgLyBkICsgMjsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6IGggPSAociAtIGcpIC8gZCArIDQ7IGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cblxuICAgIHJldHVybiB7IGg6IGgsIHM6IHMsIGw6IGwgfTtcbn1cblxuLy8gYGhzbFRvUmdiYFxuLy8gQ29udmVydHMgYW4gSFNMIGNvbG9yIHZhbHVlIHRvIFJHQi5cbi8vICpBc3N1bWVzOiogaCBpcyBjb250YWluZWQgaW4gWzAsIDFdIG9yIFswLCAzNjBdIGFuZCBzIGFuZCBsIGFyZSBjb250YWluZWQgWzAsIDFdIG9yIFswLCAxMDBdXG4vLyAqUmV0dXJuczoqIHsgciwgZywgYiB9IGluIHRoZSBzZXQgWzAsIDI1NV1cbmZ1bmN0aW9uIGhzbFRvUmdiKGgsIHMsIGwpIHtcbiAgICB2YXIgciwgZywgYjtcblxuICAgIGggPSBib3VuZDAxKGgsIDM2MCk7XG4gICAgcyA9IGJvdW5kMDEocywgMTAwKTtcbiAgICBsID0gYm91bmQwMShsLCAxMDApO1xuXG4gICAgZnVuY3Rpb24gaHVlMnJnYihwLCBxLCB0KSB7XG4gICAgICAgIGlmKHQgPCAwKSB0ICs9IDE7XG4gICAgICAgIGlmKHQgPiAxKSB0IC09IDE7XG4gICAgICAgIGlmKHQgPCAxLzYpIHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0O1xuICAgICAgICBpZih0IDwgMS8yKSByZXR1cm4gcTtcbiAgICAgICAgaWYodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgaWYocyA9PT0gMCkge1xuICAgICAgICByID0gZyA9IGIgPSBsOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcSA9IGwgPCAwLjUgPyBsICogKDEgKyBzKSA6IGwgKyBzIC0gbCAqIHM7XG4gICAgICAgIHZhciBwID0gMiAqIGwgLSBxO1xuICAgICAgICByID0gaHVlMnJnYihwLCBxLCBoICsgMS8zKTtcbiAgICAgICAgZyA9IGh1ZTJyZ2IocCwgcSwgaCk7XG4gICAgICAgIGIgPSBodWUycmdiKHAsIHEsIGggLSAxLzMpO1xuICAgIH1cblxuICAgIHJldHVybiB7IHI6IHIgKiAyNTUsIGc6IGcgKiAyNTUsIGI6IGIgKiAyNTUgfTtcbn1cblxuLy8gYHJnYlRvSHN2YFxuLy8gQ29udmVydHMgYW4gUkdCIGNvbG9yIHZhbHVlIHRvIEhTVlxuLy8gKkFzc3VtZXM6KiByLCBnLCBhbmQgYiBhcmUgY29udGFpbmVkIGluIHRoZSBzZXQgWzAsIDI1NV0gb3IgWzAsIDFdXG4vLyAqUmV0dXJuczoqIHsgaCwgcywgdiB9IGluIFswLDFdXG5mdW5jdGlvbiByZ2JUb0hzdihyLCBnLCBiKSB7XG5cbiAgICByID0gYm91bmQwMShyLCAyNTUpO1xuICAgIGcgPSBib3VuZDAxKGcsIDI1NSk7XG4gICAgYiA9IGJvdW5kMDEoYiwgMjU1KTtcblxuICAgIHZhciBtYXggPSBtYXRoTWF4KHIsIGcsIGIpLCBtaW4gPSBtYXRoTWluKHIsIGcsIGIpO1xuICAgIHZhciBoLCBzLCB2ID0gbWF4O1xuXG4gICAgdmFyIGQgPSBtYXggLSBtaW47XG4gICAgcyA9IG1heCA9PT0gMCA/IDAgOiBkIC8gbWF4O1xuXG4gICAgaWYobWF4ID09IG1pbikge1xuICAgICAgICBoID0gMDsgLy8gYWNocm9tYXRpY1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3dpdGNoKG1heCkge1xuICAgICAgICAgICAgY2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaCAvPSA2O1xuICAgIH1cbiAgICByZXR1cm4geyBoOiBoLCBzOiBzLCB2OiB2IH07XG59XG5cbi8vIGBoc3ZUb1JnYmBcbi8vIENvbnZlcnRzIGFuIEhTViBjb2xvciB2YWx1ZSB0byBSR0IuXG4vLyAqQXNzdW1lczoqIGggaXMgY29udGFpbmVkIGluIFswLCAxXSBvciBbMCwgMzYwXSBhbmQgcyBhbmQgdiBhcmUgY29udGFpbmVkIGluIFswLCAxXSBvciBbMCwgMTAwXVxuLy8gKlJldHVybnM6KiB7IHIsIGcsIGIgfSBpbiB0aGUgc2V0IFswLCAyNTVdXG4gZnVuY3Rpb24gaHN2VG9SZ2IoaCwgcywgdikge1xuXG4gICAgaCA9IGJvdW5kMDEoaCwgMzYwKSAqIDY7XG4gICAgcyA9IGJvdW5kMDEocywgMTAwKTtcbiAgICB2ID0gYm91bmQwMSh2LCAxMDApO1xuXG4gICAgdmFyIGkgPSBNYXRoLmZsb29yKGgpLFxuICAgICAgICBmID0gaCAtIGksXG4gICAgICAgIHAgPSB2ICogKDEgLSBzKSxcbiAgICAgICAgcSA9IHYgKiAoMSAtIGYgKiBzKSxcbiAgICAgICAgdCA9IHYgKiAoMSAtICgxIC0gZikgKiBzKSxcbiAgICAgICAgbW9kID0gaSAlIDYsXG4gICAgICAgIHIgPSBbdiwgcSwgcCwgcCwgdCwgdl1bbW9kXSxcbiAgICAgICAgZyA9IFt0LCB2LCB2LCBxLCBwLCBwXVttb2RdLFxuICAgICAgICBiID0gW3AsIHAsIHQsIHYsIHYsIHFdW21vZF07XG5cbiAgICByZXR1cm4geyByOiByICogMjU1LCBnOiBnICogMjU1LCBiOiBiICogMjU1IH07XG59XG5cbi8vIGByZ2JUb0hleGBcbi8vIENvbnZlcnRzIGFuIFJHQiBjb2xvciB0byBoZXhcbi8vIEFzc3VtZXMgciwgZywgYW5kIGIgYXJlIGNvbnRhaW5lZCBpbiB0aGUgc2V0IFswLCAyNTVdXG4vLyBSZXR1cm5zIGEgMyBvciA2IGNoYXJhY3RlciBoZXhcbmZ1bmN0aW9uIHJnYlRvSGV4KHIsIGcsIGIsIGFsbG93M0NoYXIpIHtcblxuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKHIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGIpLnRvU3RyaW5nKDE2KSlcbiAgICBdO1xuXG4gICAgLy8gUmV0dXJuIGEgMyBjaGFyYWN0ZXIgaGV4IGlmIHBvc3NpYmxlXG4gICAgaWYgKGFsbG93M0NoYXIgJiYgaGV4WzBdLmNoYXJBdCgwKSA9PSBoZXhbMF0uY2hhckF0KDEpICYmIGhleFsxXS5jaGFyQXQoMCkgPT0gaGV4WzFdLmNoYXJBdCgxKSAmJiBoZXhbMl0uY2hhckF0KDApID09IGhleFsyXS5jaGFyQXQoMSkpIHtcbiAgICAgICAgcmV0dXJuIGhleFswXS5jaGFyQXQoMCkgKyBoZXhbMV0uY2hhckF0KDApICsgaGV4WzJdLmNoYXJBdCgwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGV4LmpvaW4oXCJcIik7XG59XG5cbi8vIGByZ2JhVG9IZXhgXG4vLyBDb252ZXJ0cyBhbiBSR0JBIGNvbG9yIHBsdXMgYWxwaGEgdHJhbnNwYXJlbmN5IHRvIGhleFxuLy8gQXNzdW1lcyByLCBnLCBiIGFyZSBjb250YWluZWQgaW4gdGhlIHNldCBbMCwgMjU1XSBhbmRcbi8vIGEgaW4gWzAsIDFdLiBSZXR1cm5zIGEgNCBvciA4IGNoYXJhY3RlciByZ2JhIGhleFxuZnVuY3Rpb24gcmdiYVRvSGV4KHIsIGcsIGIsIGEsIGFsbG93NENoYXIpIHtcblxuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKHIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIoY29udmVydERlY2ltYWxUb0hleChhKSlcbiAgICBdO1xuXG4gICAgLy8gUmV0dXJuIGEgNCBjaGFyYWN0ZXIgaGV4IGlmIHBvc3NpYmxlXG4gICAgaWYgKGFsbG93NENoYXIgJiYgaGV4WzBdLmNoYXJBdCgwKSA9PSBoZXhbMF0uY2hhckF0KDEpICYmIGhleFsxXS5jaGFyQXQoMCkgPT0gaGV4WzFdLmNoYXJBdCgxKSAmJiBoZXhbMl0uY2hhckF0KDApID09IGhleFsyXS5jaGFyQXQoMSkgJiYgaGV4WzNdLmNoYXJBdCgwKSA9PSBoZXhbM10uY2hhckF0KDEpKSB7XG4gICAgICAgIHJldHVybiBoZXhbMF0uY2hhckF0KDApICsgaGV4WzFdLmNoYXJBdCgwKSArIGhleFsyXS5jaGFyQXQoMCkgKyBoZXhbM10uY2hhckF0KDApO1xuICAgIH1cblxuICAgIHJldHVybiBoZXguam9pbihcIlwiKTtcbn1cblxuLy8gYHJnYmFUb0FyZ2JIZXhgXG4vLyBDb252ZXJ0cyBhbiBSR0JBIGNvbG9yIHRvIGFuIEFSR0IgSGV4OCBzdHJpbmdcbi8vIFJhcmVseSB1c2VkLCBidXQgcmVxdWlyZWQgZm9yIFwidG9GaWx0ZXIoKVwiXG5mdW5jdGlvbiByZ2JhVG9BcmdiSGV4KHIsIGcsIGIsIGEpIHtcblxuICAgIHZhciBoZXggPSBbXG4gICAgICAgIHBhZDIoY29udmVydERlY2ltYWxUb0hleChhKSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKHIpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGcpLnRvU3RyaW5nKDE2KSksXG4gICAgICAgIHBhZDIobWF0aFJvdW5kKGIpLnRvU3RyaW5nKDE2KSlcbiAgICBdO1xuXG4gICAgcmV0dXJuIGhleC5qb2luKFwiXCIpO1xufVxuXG4vLyBgZXF1YWxzYFxuLy8gQ2FuIGJlIGNhbGxlZCB3aXRoIGFueSB0aW55Y29sb3IgaW5wdXRcbnRpbnljb2xvci5lcXVhbHMgPSBmdW5jdGlvbiAoY29sb3IxLCBjb2xvcjIpIHtcbiAgICBpZiAoIWNvbG9yMSB8fCAhY29sb3IyKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIHJldHVybiB0aW55Y29sb3IoY29sb3IxKS50b1JnYlN0cmluZygpID09IHRpbnljb2xvcihjb2xvcjIpLnRvUmdiU3RyaW5nKCk7XG59O1xuXG50aW55Y29sb3IucmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRpbnljb2xvci5mcm9tUmF0aW8oe1xuICAgICAgICByOiBtYXRoUmFuZG9tKCksXG4gICAgICAgIGc6IG1hdGhSYW5kb20oKSxcbiAgICAgICAgYjogbWF0aFJhbmRvbSgpXG4gICAgfSk7XG59O1xuXG5cbi8vIE1vZGlmaWNhdGlvbiBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRoYW5rcyB0byBsZXNzLmpzIGZvciBzb21lIG9mIHRoZSBiYXNpY3MgaGVyZVxuLy8gPGh0dHBzOi8vZ2l0aHViLmNvbS9jbG91ZGhlYWQvbGVzcy5qcy9ibG9iL21hc3Rlci9saWIvbGVzcy9mdW5jdGlvbnMuanM+XG5cbmZ1bmN0aW9uIGRlc2F0dXJhdGUoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLnMgLT0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5zID0gY2xhbXAwMShoc2wucyk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiBzYXR1cmF0ZShjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wucyArPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLnMgPSBjbGFtcDAxKGhzbC5zKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIGdyZXlzY2FsZShjb2xvcikge1xuICAgIHJldHVybiB0aW55Y29sb3IoY29sb3IpLmRlc2F0dXJhdGUoMTAwKTtcbn1cblxuZnVuY3Rpb24gbGlnaHRlbiAoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLmwgKz0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5sID0gY2xhbXAwMShoc2wubCk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG5mdW5jdGlvbiBicmlnaHRlbihjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIHJnYiA9IHRpbnljb2xvcihjb2xvcikudG9SZ2IoKTtcbiAgICByZ2IuciA9IG1hdGhNYXgoMCwgbWF0aE1pbigyNTUsIHJnYi5yIC0gbWF0aFJvdW5kKDI1NSAqIC0gKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgcmdiLmcgPSBtYXRoTWF4KDAsIG1hdGhNaW4oMjU1LCByZ2IuZyAtIG1hdGhSb3VuZCgyNTUgKiAtIChhbW91bnQgLyAxMDApKSkpO1xuICAgIHJnYi5iID0gbWF0aE1heCgwLCBtYXRoTWluKDI1NSwgcmdiLmIgLSBtYXRoUm91bmQoMjU1ICogLSAoYW1vdW50IC8gMTAwKSkpKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKHJnYik7XG59XG5cbmZ1bmN0aW9uIGRhcmtlbiAoY29sb3IsIGFtb3VudCkge1xuICAgIGFtb3VudCA9IChhbW91bnQgPT09IDApID8gMCA6IChhbW91bnQgfHwgMTApO1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLmwgLT0gYW1vdW50IC8gMTAwO1xuICAgIGhzbC5sID0gY2xhbXAwMShoc2wubCk7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG4vLyBTcGluIHRha2VzIGEgcG9zaXRpdmUgb3IgbmVnYXRpdmUgYW1vdW50IHdpdGhpbiBbLTM2MCwgMzYwXSBpbmRpY2F0aW5nIHRoZSBjaGFuZ2Ugb2YgaHVlLlxuLy8gVmFsdWVzIG91dHNpZGUgb2YgdGhpcyByYW5nZSB3aWxsIGJlIHdyYXBwZWQgaW50byB0aGlzIHJhbmdlLlxuZnVuY3Rpb24gc3Bpbihjb2xvciwgYW1vdW50KSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaHVlID0gKGhzbC5oICsgYW1vdW50KSAlIDM2MDtcbiAgICBoc2wuaCA9IGh1ZSA8IDAgPyAzNjAgKyBodWUgOiBodWU7XG4gICAgcmV0dXJuIHRpbnljb2xvcihoc2wpO1xufVxuXG4vLyBDb21iaW5hdGlvbiBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhhbmtzIHRvIGpRdWVyeSB4Q29sb3IgZm9yIHNvbWUgb2YgdGhlIGlkZWFzIGJlaGluZCB0aGVzZVxuLy8gPGh0dHBzOi8vZ2l0aHViLmNvbS9pbmZ1c2lvbi9qUXVlcnkteGNvbG9yL2Jsb2IvbWFzdGVyL2pxdWVyeS54Y29sb3IuanM+XG5cbmZ1bmN0aW9uIGNvbXBsZW1lbnQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5oID0gKGhzbC5oICsgMTgwKSAlIDM2MDtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIHRyaWFkKGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaCA9IGhzbC5oO1xuICAgIHJldHVybiBbXG4gICAgICAgIHRpbnljb2xvcihjb2xvciksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMTIwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDI0MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIHRldHJhZChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGggPSBoc2wuaDtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aW55Y29sb3IoY29sb3IpLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDkwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDE4MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAyNzApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSlcbiAgICBdO1xufVxuXG5mdW5jdGlvbiBzcGxpdGNvbXBsZW1lbnQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBoID0gaHNsLmg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGlueWNvbG9yKGNvbG9yKSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyA3MikgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDIxNikgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubH0pXG4gICAgXTtcbn1cblxuZnVuY3Rpb24gYW5hbG9nb3VzKGNvbG9yLCByZXN1bHRzLCBzbGljZXMpIHtcbiAgICByZXN1bHRzID0gcmVzdWx0cyB8fCA2O1xuICAgIHNsaWNlcyA9IHNsaWNlcyB8fCAzMDtcblxuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIHBhcnQgPSAzNjAgLyBzbGljZXM7XG4gICAgdmFyIHJldCA9IFt0aW55Y29sb3IoY29sb3IpXTtcblxuICAgIGZvciAoaHNsLmggPSAoKGhzbC5oIC0gKHBhcnQgKiByZXN1bHRzID4+IDEpKSArIDcyMCkgJSAzNjA7IC0tcmVzdWx0czsgKSB7XG4gICAgICAgIGhzbC5oID0gKGhzbC5oICsgcGFydCkgJSAzNjA7XG4gICAgICAgIHJldC5wdXNoKHRpbnljb2xvcihoc2wpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbW9ub2Nocm9tYXRpYyhjb2xvciwgcmVzdWx0cykge1xuICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IDY7XG4gICAgdmFyIGhzdiA9IHRpbnljb2xvcihjb2xvcikudG9Ic3YoKTtcbiAgICB2YXIgaCA9IGhzdi5oLCBzID0gaHN2LnMsIHYgPSBoc3YudjtcbiAgICB2YXIgcmV0ID0gW107XG4gICAgdmFyIG1vZGlmaWNhdGlvbiA9IDEgLyByZXN1bHRzO1xuXG4gICAgd2hpbGUgKHJlc3VsdHMtLSkge1xuICAgICAgICByZXQucHVzaCh0aW55Y29sb3IoeyBoOiBoLCBzOiBzLCB2OiB2fSkpO1xuICAgICAgICB2ID0gKHYgKyBtb2RpZmljYXRpb24pICUgMTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuXG4vLyBVdGlsaXR5IEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnRpbnljb2xvci5taXggPSBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCA1MCk7XG5cbiAgICB2YXIgcmdiMSA9IHRpbnljb2xvcihjb2xvcjEpLnRvUmdiKCk7XG4gICAgdmFyIHJnYjIgPSB0aW55Y29sb3IoY29sb3IyKS50b1JnYigpO1xuXG4gICAgdmFyIHAgPSBhbW91bnQgLyAxMDA7XG5cbiAgICB2YXIgcmdiYSA9IHtcbiAgICAgICAgcjogKChyZ2IyLnIgLSByZ2IxLnIpICogcCkgKyByZ2IxLnIsXG4gICAgICAgIGc6ICgocmdiMi5nIC0gcmdiMS5nKSAqIHApICsgcmdiMS5nLFxuICAgICAgICBiOiAoKHJnYjIuYiAtIHJnYjEuYikgKiBwKSArIHJnYjEuYixcbiAgICAgICAgYTogKChyZ2IyLmEgLSByZ2IxLmEpICogcCkgKyByZ2IxLmFcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRpbnljb2xvcihyZ2JhKTtcbn07XG5cblxuLy8gUmVhZGFiaWxpdHkgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi8yMDA4L1JFQy1XQ0FHMjAtMjAwODEyMTEvI2NvbnRyYXN0LXJhdGlvZGVmIChXQ0FHIFZlcnNpb24gMilcblxuLy8gYGNvbnRyYXN0YFxuLy8gQW5hbHl6ZSB0aGUgMiBjb2xvcnMgYW5kIHJldHVybnMgdGhlIGNvbG9yIGNvbnRyYXN0IGRlZmluZWQgYnkgKFdDQUcgVmVyc2lvbiAyKVxudGlueWNvbG9yLnJlYWRhYmlsaXR5ID0gZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcbiAgICB2YXIgYzEgPSB0aW55Y29sb3IoY29sb3IxKTtcbiAgICB2YXIgYzIgPSB0aW55Y29sb3IoY29sb3IyKTtcbiAgICByZXR1cm4gKE1hdGgubWF4KGMxLmdldEx1bWluYW5jZSgpLGMyLmdldEx1bWluYW5jZSgpKSswLjA1KSAvIChNYXRoLm1pbihjMS5nZXRMdW1pbmFuY2UoKSxjMi5nZXRMdW1pbmFuY2UoKSkrMC4wNSk7XG59O1xuXG4vLyBgaXNSZWFkYWJsZWBcbi8vIEVuc3VyZSB0aGF0IGZvcmVncm91bmQgYW5kIGJhY2tncm91bmQgY29sb3IgY29tYmluYXRpb25zIG1lZXQgV0NBRzIgZ3VpZGVsaW5lcy5cbi8vIFRoZSB0aGlyZCBhcmd1bWVudCBpcyBhbiBvcHRpb25hbCBPYmplY3QuXG4vLyAgICAgIHRoZSAnbGV2ZWwnIHByb3BlcnR5IHN0YXRlcyAnQUEnIG9yICdBQUEnIC0gaWYgbWlzc2luZyBvciBpbnZhbGlkLCBpdCBkZWZhdWx0cyB0byAnQUEnO1xuLy8gICAgICB0aGUgJ3NpemUnIHByb3BlcnR5IHN0YXRlcyAnbGFyZ2UnIG9yICdzbWFsbCcgLSBpZiBtaXNzaW5nIG9yIGludmFsaWQsIGl0IGRlZmF1bHRzIHRvICdzbWFsbCcuXG4vLyBJZiB0aGUgZW50aXJlIG9iamVjdCBpcyBhYnNlbnQsIGlzUmVhZGFibGUgZGVmYXVsdHMgdG8ge2xldmVsOlwiQUFcIixzaXplOlwic21hbGxcIn0uXG5cbi8vICpFeGFtcGxlKlxuLy8gICAgdGlueWNvbG9yLmlzUmVhZGFibGUoXCIjMDAwXCIsIFwiIzExMVwiKSA9PiBmYWxzZVxuLy8gICAgdGlueWNvbG9yLmlzUmVhZGFibGUoXCIjMDAwXCIsIFwiIzExMVwiLHtsZXZlbDpcIkFBXCIsc2l6ZTpcImxhcmdlXCJ9KSA9PiBmYWxzZVxudGlueWNvbG9yLmlzUmVhZGFibGUgPSBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgd2NhZzIpIHtcbiAgICB2YXIgcmVhZGFiaWxpdHkgPSB0aW55Y29sb3IucmVhZGFiaWxpdHkoY29sb3IxLCBjb2xvcjIpO1xuICAgIHZhciB3Y2FnMlBhcm1zLCBvdXQ7XG5cbiAgICBvdXQgPSBmYWxzZTtcblxuICAgIHdjYWcyUGFybXMgPSB2YWxpZGF0ZVdDQUcyUGFybXMod2NhZzIpO1xuICAgIHN3aXRjaCAod2NhZzJQYXJtcy5sZXZlbCArIHdjYWcyUGFybXMuc2l6ZSkge1xuICAgICAgICBjYXNlIFwiQUFzbWFsbFwiOlxuICAgICAgICBjYXNlIFwiQUFBbGFyZ2VcIjpcbiAgICAgICAgICAgIG91dCA9IHJlYWRhYmlsaXR5ID49IDQuNTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQUFsYXJnZVwiOlxuICAgICAgICAgICAgb3V0ID0gcmVhZGFiaWxpdHkgPj0gMztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiQUFBc21hbGxcIjpcbiAgICAgICAgICAgIG91dCA9IHJlYWRhYmlsaXR5ID49IDc7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcblxufTtcblxuLy8gYG1vc3RSZWFkYWJsZWBcbi8vIEdpdmVuIGEgYmFzZSBjb2xvciBhbmQgYSBsaXN0IG9mIHBvc3NpYmxlIGZvcmVncm91bmQgb3IgYmFja2dyb3VuZFxuLy8gY29sb3JzIGZvciB0aGF0IGJhc2UsIHJldHVybnMgdGhlIG1vc3QgcmVhZGFibGUgY29sb3IuXG4vLyBPcHRpb25hbGx5IHJldHVybnMgQmxhY2sgb3IgV2hpdGUgaWYgdGhlIG1vc3QgcmVhZGFibGUgY29sb3IgaXMgdW5yZWFkYWJsZS5cbi8vICpFeGFtcGxlKlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZSh0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiIzEyM1wiLCBbXCIjMTI0XCIsIFwiIzEyNVwiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOmZhbHNlfSkudG9IZXhTdHJpbmcoKTsgLy8gXCIjMTEyMjU1XCJcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUodGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiMxMjNcIiwgW1wiIzEyNFwiLCBcIiMxMjVcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczp0cnVlfSkudG9IZXhTdHJpbmcoKTsgIC8vIFwiI2ZmZmZmZlwiXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiI2E4MDE1YVwiLCBbXCIjZmFmM2YzXCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6dHJ1ZSxsZXZlbDpcIkFBQVwiLHNpemU6XCJsYXJnZVwifSkudG9IZXhTdHJpbmcoKTsgLy8gXCIjZmFmM2YzXCJcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjYTgwMTVhXCIsIFtcIiNmYWYzZjNcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczp0cnVlLGxldmVsOlwiQUFBXCIsc2l6ZTpcInNtYWxsXCJ9KS50b0hleFN0cmluZygpOyAvLyBcIiNmZmZmZmZcIlxudGlueWNvbG9yLm1vc3RSZWFkYWJsZSA9IGZ1bmN0aW9uKGJhc2VDb2xvciwgY29sb3JMaXN0LCBhcmdzKSB7XG4gICAgdmFyIGJlc3RDb2xvciA9IG51bGw7XG4gICAgdmFyIGJlc3RTY29yZSA9IDA7XG4gICAgdmFyIHJlYWRhYmlsaXR5O1xuICAgIHZhciBpbmNsdWRlRmFsbGJhY2tDb2xvcnMsIGxldmVsLCBzaXplIDtcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBpbmNsdWRlRmFsbGJhY2tDb2xvcnMgPSBhcmdzLmluY2x1ZGVGYWxsYmFja0NvbG9ycyA7XG4gICAgbGV2ZWwgPSBhcmdzLmxldmVsO1xuICAgIHNpemUgPSBhcmdzLnNpemU7XG5cbiAgICBmb3IgKHZhciBpPSAwOyBpIDwgY29sb3JMaXN0Lmxlbmd0aCA7IGkrKykge1xuICAgICAgICByZWFkYWJpbGl0eSA9IHRpbnljb2xvci5yZWFkYWJpbGl0eShiYXNlQ29sb3IsIGNvbG9yTGlzdFtpXSk7XG4gICAgICAgIGlmIChyZWFkYWJpbGl0eSA+IGJlc3RTY29yZSkge1xuICAgICAgICAgICAgYmVzdFNjb3JlID0gcmVhZGFiaWxpdHk7XG4gICAgICAgICAgICBiZXN0Q29sb3IgPSB0aW55Y29sb3IoY29sb3JMaXN0W2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aW55Y29sb3IuaXNSZWFkYWJsZShiYXNlQ29sb3IsIGJlc3RDb2xvciwge1wibGV2ZWxcIjpsZXZlbCxcInNpemVcIjpzaXplfSkgfHwgIWluY2x1ZGVGYWxsYmFja0NvbG9ycykge1xuICAgICAgICByZXR1cm4gYmVzdENvbG9yO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYXJncy5pbmNsdWRlRmFsbGJhY2tDb2xvcnM9ZmFsc2U7XG4gICAgICAgIHJldHVybiB0aW55Y29sb3IubW9zdFJlYWRhYmxlKGJhc2VDb2xvcixbXCIjZmZmXCIsIFwiIzAwMFwiXSxhcmdzKTtcbiAgICB9XG59O1xuXG5cbi8vIEJpZyBMaXN0IG9mIENvbG9yc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1jb2xvci8jc3ZnLWNvbG9yPlxudmFyIG5hbWVzID0gdGlueWNvbG9yLm5hbWVzID0ge1xuICAgIGFsaWNlYmx1ZTogXCJmMGY4ZmZcIixcbiAgICBhbnRpcXVld2hpdGU6IFwiZmFlYmQ3XCIsXG4gICAgYXF1YTogXCIwZmZcIixcbiAgICBhcXVhbWFyaW5lOiBcIjdmZmZkNFwiLFxuICAgIGF6dXJlOiBcImYwZmZmZlwiLFxuICAgIGJlaWdlOiBcImY1ZjVkY1wiLFxuICAgIGJpc3F1ZTogXCJmZmU0YzRcIixcbiAgICBibGFjazogXCIwMDBcIixcbiAgICBibGFuY2hlZGFsbW9uZDogXCJmZmViY2RcIixcbiAgICBibHVlOiBcIjAwZlwiLFxuICAgIGJsdWV2aW9sZXQ6IFwiOGEyYmUyXCIsXG4gICAgYnJvd246IFwiYTUyYTJhXCIsXG4gICAgYnVybHl3b29kOiBcImRlYjg4N1wiLFxuICAgIGJ1cm50c2llbm5hOiBcImVhN2U1ZFwiLFxuICAgIGNhZGV0Ymx1ZTogXCI1ZjllYTBcIixcbiAgICBjaGFydHJldXNlOiBcIjdmZmYwMFwiLFxuICAgIGNob2NvbGF0ZTogXCJkMjY5MWVcIixcbiAgICBjb3JhbDogXCJmZjdmNTBcIixcbiAgICBjb3JuZmxvd2VyYmx1ZTogXCI2NDk1ZWRcIixcbiAgICBjb3Juc2lsazogXCJmZmY4ZGNcIixcbiAgICBjcmltc29uOiBcImRjMTQzY1wiLFxuICAgIGN5YW46IFwiMGZmXCIsXG4gICAgZGFya2JsdWU6IFwiMDAwMDhiXCIsXG4gICAgZGFya2N5YW46IFwiMDA4YjhiXCIsXG4gICAgZGFya2dvbGRlbnJvZDogXCJiODg2MGJcIixcbiAgICBkYXJrZ3JheTogXCJhOWE5YTlcIixcbiAgICBkYXJrZ3JlZW46IFwiMDA2NDAwXCIsXG4gICAgZGFya2dyZXk6IFwiYTlhOWE5XCIsXG4gICAgZGFya2toYWtpOiBcImJkYjc2YlwiLFxuICAgIGRhcmttYWdlbnRhOiBcIjhiMDA4YlwiLFxuICAgIGRhcmtvbGl2ZWdyZWVuOiBcIjU1NmIyZlwiLFxuICAgIGRhcmtvcmFuZ2U6IFwiZmY4YzAwXCIsXG4gICAgZGFya29yY2hpZDogXCI5OTMyY2NcIixcbiAgICBkYXJrcmVkOiBcIjhiMDAwMFwiLFxuICAgIGRhcmtzYWxtb246IFwiZTk5NjdhXCIsXG4gICAgZGFya3NlYWdyZWVuOiBcIjhmYmM4ZlwiLFxuICAgIGRhcmtzbGF0ZWJsdWU6IFwiNDgzZDhiXCIsXG4gICAgZGFya3NsYXRlZ3JheTogXCIyZjRmNGZcIixcbiAgICBkYXJrc2xhdGVncmV5OiBcIjJmNGY0ZlwiLFxuICAgIGRhcmt0dXJxdW9pc2U6IFwiMDBjZWQxXCIsXG4gICAgZGFya3Zpb2xldDogXCI5NDAwZDNcIixcbiAgICBkZWVwcGluazogXCJmZjE0OTNcIixcbiAgICBkZWVwc2t5Ymx1ZTogXCIwMGJmZmZcIixcbiAgICBkaW1ncmF5OiBcIjY5Njk2OVwiLFxuICAgIGRpbWdyZXk6IFwiNjk2OTY5XCIsXG4gICAgZG9kZ2VyYmx1ZTogXCIxZTkwZmZcIixcbiAgICBmaXJlYnJpY2s6IFwiYjIyMjIyXCIsXG4gICAgZmxvcmFsd2hpdGU6IFwiZmZmYWYwXCIsXG4gICAgZm9yZXN0Z3JlZW46IFwiMjI4YjIyXCIsXG4gICAgZnVjaHNpYTogXCJmMGZcIixcbiAgICBnYWluc2Jvcm86IFwiZGNkY2RjXCIsXG4gICAgZ2hvc3R3aGl0ZTogXCJmOGY4ZmZcIixcbiAgICBnb2xkOiBcImZmZDcwMFwiLFxuICAgIGdvbGRlbnJvZDogXCJkYWE1MjBcIixcbiAgICBncmF5OiBcIjgwODA4MFwiLFxuICAgIGdyZWVuOiBcIjAwODAwMFwiLFxuICAgIGdyZWVueWVsbG93OiBcImFkZmYyZlwiLFxuICAgIGdyZXk6IFwiODA4MDgwXCIsXG4gICAgaG9uZXlkZXc6IFwiZjBmZmYwXCIsXG4gICAgaG90cGluazogXCJmZjY5YjRcIixcbiAgICBpbmRpYW5yZWQ6IFwiY2Q1YzVjXCIsXG4gICAgaW5kaWdvOiBcIjRiMDA4MlwiLFxuICAgIGl2b3J5OiBcImZmZmZmMFwiLFxuICAgIGtoYWtpOiBcImYwZTY4Y1wiLFxuICAgIGxhdmVuZGVyOiBcImU2ZTZmYVwiLFxuICAgIGxhdmVuZGVyYmx1c2g6IFwiZmZmMGY1XCIsXG4gICAgbGF3bmdyZWVuOiBcIjdjZmMwMFwiLFxuICAgIGxlbW9uY2hpZmZvbjogXCJmZmZhY2RcIixcbiAgICBsaWdodGJsdWU6IFwiYWRkOGU2XCIsXG4gICAgbGlnaHRjb3JhbDogXCJmMDgwODBcIixcbiAgICBsaWdodGN5YW46IFwiZTBmZmZmXCIsXG4gICAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6IFwiZmFmYWQyXCIsXG4gICAgbGlnaHRncmF5OiBcImQzZDNkM1wiLFxuICAgIGxpZ2h0Z3JlZW46IFwiOTBlZTkwXCIsXG4gICAgbGlnaHRncmV5OiBcImQzZDNkM1wiLFxuICAgIGxpZ2h0cGluazogXCJmZmI2YzFcIixcbiAgICBsaWdodHNhbG1vbjogXCJmZmEwN2FcIixcbiAgICBsaWdodHNlYWdyZWVuOiBcIjIwYjJhYVwiLFxuICAgIGxpZ2h0c2t5Ymx1ZTogXCI4N2NlZmFcIixcbiAgICBsaWdodHNsYXRlZ3JheTogXCI3ODlcIixcbiAgICBsaWdodHNsYXRlZ3JleTogXCI3ODlcIixcbiAgICBsaWdodHN0ZWVsYmx1ZTogXCJiMGM0ZGVcIixcbiAgICBsaWdodHllbGxvdzogXCJmZmZmZTBcIixcbiAgICBsaW1lOiBcIjBmMFwiLFxuICAgIGxpbWVncmVlbjogXCIzMmNkMzJcIixcbiAgICBsaW5lbjogXCJmYWYwZTZcIixcbiAgICBtYWdlbnRhOiBcImYwZlwiLFxuICAgIG1hcm9vbjogXCI4MDAwMDBcIixcbiAgICBtZWRpdW1hcXVhbWFyaW5lOiBcIjY2Y2RhYVwiLFxuICAgIG1lZGl1bWJsdWU6IFwiMDAwMGNkXCIsXG4gICAgbWVkaXVtb3JjaGlkOiBcImJhNTVkM1wiLFxuICAgIG1lZGl1bXB1cnBsZTogXCI5MzcwZGJcIixcbiAgICBtZWRpdW1zZWFncmVlbjogXCIzY2IzNzFcIixcbiAgICBtZWRpdW1zbGF0ZWJsdWU6IFwiN2I2OGVlXCIsXG4gICAgbWVkaXVtc3ByaW5nZ3JlZW46IFwiMDBmYTlhXCIsXG4gICAgbWVkaXVtdHVycXVvaXNlOiBcIjQ4ZDFjY1wiLFxuICAgIG1lZGl1bXZpb2xldHJlZDogXCJjNzE1ODVcIixcbiAgICBtaWRuaWdodGJsdWU6IFwiMTkxOTcwXCIsXG4gICAgbWludGNyZWFtOiBcImY1ZmZmYVwiLFxuICAgIG1pc3R5cm9zZTogXCJmZmU0ZTFcIixcbiAgICBtb2NjYXNpbjogXCJmZmU0YjVcIixcbiAgICBuYXZham93aGl0ZTogXCJmZmRlYWRcIixcbiAgICBuYXZ5OiBcIjAwMDA4MFwiLFxuICAgIG9sZGxhY2U6IFwiZmRmNWU2XCIsXG4gICAgb2xpdmU6IFwiODA4MDAwXCIsXG4gICAgb2xpdmVkcmFiOiBcIjZiOGUyM1wiLFxuICAgIG9yYW5nZTogXCJmZmE1MDBcIixcbiAgICBvcmFuZ2VyZWQ6IFwiZmY0NTAwXCIsXG4gICAgb3JjaGlkOiBcImRhNzBkNlwiLFxuICAgIHBhbGVnb2xkZW5yb2Q6IFwiZWVlOGFhXCIsXG4gICAgcGFsZWdyZWVuOiBcIjk4ZmI5OFwiLFxuICAgIHBhbGV0dXJxdW9pc2U6IFwiYWZlZWVlXCIsXG4gICAgcGFsZXZpb2xldHJlZDogXCJkYjcwOTNcIixcbiAgICBwYXBheWF3aGlwOiBcImZmZWZkNVwiLFxuICAgIHBlYWNocHVmZjogXCJmZmRhYjlcIixcbiAgICBwZXJ1OiBcImNkODUzZlwiLFxuICAgIHBpbms6IFwiZmZjMGNiXCIsXG4gICAgcGx1bTogXCJkZGEwZGRcIixcbiAgICBwb3dkZXJibHVlOiBcImIwZTBlNlwiLFxuICAgIHB1cnBsZTogXCI4MDAwODBcIixcbiAgICByZWJlY2NhcHVycGxlOiBcIjY2MzM5OVwiLFxuICAgIHJlZDogXCJmMDBcIixcbiAgICByb3N5YnJvd246IFwiYmM4ZjhmXCIsXG4gICAgcm95YWxibHVlOiBcIjQxNjllMVwiLFxuICAgIHNhZGRsZWJyb3duOiBcIjhiNDUxM1wiLFxuICAgIHNhbG1vbjogXCJmYTgwNzJcIixcbiAgICBzYW5keWJyb3duOiBcImY0YTQ2MFwiLFxuICAgIHNlYWdyZWVuOiBcIjJlOGI1N1wiLFxuICAgIHNlYXNoZWxsOiBcImZmZjVlZVwiLFxuICAgIHNpZW5uYTogXCJhMDUyMmRcIixcbiAgICBzaWx2ZXI6IFwiYzBjMGMwXCIsXG4gICAgc2t5Ymx1ZTogXCI4N2NlZWJcIixcbiAgICBzbGF0ZWJsdWU6IFwiNmE1YWNkXCIsXG4gICAgc2xhdGVncmF5OiBcIjcwODA5MFwiLFxuICAgIHNsYXRlZ3JleTogXCI3MDgwOTBcIixcbiAgICBzbm93OiBcImZmZmFmYVwiLFxuICAgIHNwcmluZ2dyZWVuOiBcIjAwZmY3ZlwiLFxuICAgIHN0ZWVsYmx1ZTogXCI0NjgyYjRcIixcbiAgICB0YW46IFwiZDJiNDhjXCIsXG4gICAgdGVhbDogXCIwMDgwODBcIixcbiAgICB0aGlzdGxlOiBcImQ4YmZkOFwiLFxuICAgIHRvbWF0bzogXCJmZjYzNDdcIixcbiAgICB0dXJxdW9pc2U6IFwiNDBlMGQwXCIsXG4gICAgdmlvbGV0OiBcImVlODJlZVwiLFxuICAgIHdoZWF0OiBcImY1ZGViM1wiLFxuICAgIHdoaXRlOiBcImZmZlwiLFxuICAgIHdoaXRlc21va2U6IFwiZjVmNWY1XCIsXG4gICAgeWVsbG93OiBcImZmMFwiLFxuICAgIHllbGxvd2dyZWVuOiBcIjlhY2QzMlwiXG59O1xuXG4vLyBNYWtlIGl0IGVhc3kgdG8gYWNjZXNzIGNvbG9ycyB2aWEgYGhleE5hbWVzW2hleF1gXG52YXIgaGV4TmFtZXMgPSB0aW55Y29sb3IuaGV4TmFtZXMgPSBmbGlwKG5hbWVzKTtcblxuXG4vLyBVdGlsaXRpZXNcbi8vIC0tLS0tLS0tLVxuXG4vLyBgeyAnbmFtZTEnOiAndmFsMScgfWAgYmVjb21lcyBgeyAndmFsMSc6ICduYW1lMScgfWBcbmZ1bmN0aW9uIGZsaXAobykge1xuICAgIHZhciBmbGlwcGVkID0geyB9O1xuICAgIGZvciAodmFyIGkgaW4gbykge1xuICAgICAgICBpZiAoby5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgICAgZmxpcHBlZFtvW2ldXSA9IGk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZsaXBwZWQ7XG59XG5cbi8vIFJldHVybiBhIHZhbGlkIGFscGhhIHZhbHVlIFswLDFdIHdpdGggYWxsIGludmFsaWQgdmFsdWVzIGJlaW5nIHNldCB0byAxXG5mdW5jdGlvbiBib3VuZEFscGhhKGEpIHtcbiAgICBhID0gcGFyc2VGbG9hdChhKTtcblxuICAgIGlmIChpc05hTihhKSB8fCBhIDwgMCB8fCBhID4gMSkge1xuICAgICAgICBhID0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbn1cblxuLy8gVGFrZSBpbnB1dCBmcm9tIFswLCBuXSBhbmQgcmV0dXJuIGl0IGFzIFswLCAxXVxuZnVuY3Rpb24gYm91bmQwMShuLCBtYXgpIHtcbiAgICBpZiAoaXNPbmVQb2ludFplcm8obikpIHsgbiA9IFwiMTAwJVwiOyB9XG5cbiAgICB2YXIgcHJvY2Vzc1BlcmNlbnQgPSBpc1BlcmNlbnRhZ2Uobik7XG4gICAgbiA9IG1hdGhNaW4obWF4LCBtYXRoTWF4KDAsIHBhcnNlRmxvYXQobikpKTtcblxuICAgIC8vIEF1dG9tYXRpY2FsbHkgY29udmVydCBwZXJjZW50YWdlIGludG8gbnVtYmVyXG4gICAgaWYgKHByb2Nlc3NQZXJjZW50KSB7XG4gICAgICAgIG4gPSBwYXJzZUludChuICogbWF4LCAxMCkgLyAxMDA7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIGZsb2F0aW5nIHBvaW50IHJvdW5kaW5nIGVycm9yc1xuICAgIGlmICgoTWF0aC5hYnMobiAtIG1heCkgPCAwLjAwMDAwMSkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgLy8gQ29udmVydCBpbnRvIFswLCAxXSByYW5nZSBpZiBpdCBpc24ndCBhbHJlYWR5XG4gICAgcmV0dXJuIChuICUgbWF4KSAvIHBhcnNlRmxvYXQobWF4KTtcbn1cblxuLy8gRm9yY2UgYSBudW1iZXIgYmV0d2VlbiAwIGFuZCAxXG5mdW5jdGlvbiBjbGFtcDAxKHZhbCkge1xuICAgIHJldHVybiBtYXRoTWluKDEsIG1hdGhNYXgoMCwgdmFsKSk7XG59XG5cbi8vIFBhcnNlIGEgYmFzZS0xNiBoZXggdmFsdWUgaW50byBhIGJhc2UtMTAgaW50ZWdlclxuZnVuY3Rpb24gcGFyc2VJbnRGcm9tSGV4KHZhbCkge1xuICAgIHJldHVybiBwYXJzZUludCh2YWwsIDE2KTtcbn1cblxuLy8gTmVlZCB0byBoYW5kbGUgMS4wIGFzIDEwMCUsIHNpbmNlIG9uY2UgaXQgaXMgYSBudW1iZXIsIHRoZXJlIGlzIG5vIGRpZmZlcmVuY2UgYmV0d2VlbiBpdCBhbmQgMVxuLy8gPGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzQyMjA3Mi9qYXZhc2NyaXB0LWhvdy10by1kZXRlY3QtbnVtYmVyLWFzLWEtZGVjaW1hbC1pbmNsdWRpbmctMS0wPlxuZnVuY3Rpb24gaXNPbmVQb2ludFplcm8obikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PSBcInN0cmluZ1wiICYmIG4uaW5kZXhPZignLicpICE9IC0xICYmIHBhcnNlRmxvYXQobikgPT09IDE7XG59XG5cbi8vIENoZWNrIHRvIHNlZSBpZiBzdHJpbmcgcGFzc2VkIGluIGlzIGEgcGVyY2VudGFnZVxuZnVuY3Rpb24gaXNQZXJjZW50YWdlKG4pIHtcbiAgICByZXR1cm4gdHlwZW9mIG4gPT09IFwic3RyaW5nXCIgJiYgbi5pbmRleE9mKCclJykgIT0gLTE7XG59XG5cbi8vIEZvcmNlIGEgaGV4IHZhbHVlIHRvIGhhdmUgMiBjaGFyYWN0ZXJzXG5mdW5jdGlvbiBwYWQyKGMpIHtcbiAgICByZXR1cm4gYy5sZW5ndGggPT0gMSA/ICcwJyArIGMgOiAnJyArIGM7XG59XG5cbi8vIFJlcGxhY2UgYSBkZWNpbWFsIHdpdGggaXQncyBwZXJjZW50YWdlIHZhbHVlXG5mdW5jdGlvbiBjb252ZXJ0VG9QZXJjZW50YWdlKG4pIHtcbiAgICBpZiAobiA8PSAxKSB7XG4gICAgICAgIG4gPSAobiAqIDEwMCkgKyBcIiVcIjtcbiAgICB9XG5cbiAgICByZXR1cm4gbjtcbn1cblxuLy8gQ29udmVydHMgYSBkZWNpbWFsIHRvIGEgaGV4IHZhbHVlXG5mdW5jdGlvbiBjb252ZXJ0RGVjaW1hbFRvSGV4KGQpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGQpICogMjU1KS50b1N0cmluZygxNik7XG59XG4vLyBDb252ZXJ0cyBhIGhleCB2YWx1ZSB0byBhIGRlY2ltYWxcbmZ1bmN0aW9uIGNvbnZlcnRIZXhUb0RlY2ltYWwoaCkge1xuICAgIHJldHVybiAocGFyc2VJbnRGcm9tSGV4KGgpIC8gMjU1KTtcbn1cblxudmFyIG1hdGNoZXJzID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSL2NzczMtdmFsdWVzLyNpbnRlZ2Vycz5cbiAgICB2YXIgQ1NTX0lOVEVHRVIgPSBcIlstXFxcXCtdP1xcXFxkKyU/XCI7XG5cbiAgICAvLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy12YWx1ZXMvI251bWJlci12YWx1ZT5cbiAgICB2YXIgQ1NTX05VTUJFUiA9IFwiWy1cXFxcK10/XFxcXGQqXFxcXC5cXFxcZCslP1wiO1xuXG4gICAgLy8gQWxsb3cgcG9zaXRpdmUvbmVnYXRpdmUgaW50ZWdlci9udW1iZXIuICBEb24ndCBjYXB0dXJlIHRoZSBlaXRoZXIvb3IsIGp1c3QgdGhlIGVudGlyZSBvdXRjb21lLlxuICAgIHZhciBDU1NfVU5JVCA9IFwiKD86XCIgKyBDU1NfTlVNQkVSICsgXCIpfCg/OlwiICsgQ1NTX0lOVEVHRVIgKyBcIilcIjtcblxuICAgIC8vIEFjdHVhbCBtYXRjaGluZy5cbiAgICAvLyBQYXJlbnRoZXNlcyBhbmQgY29tbWFzIGFyZSBvcHRpb25hbCwgYnV0IG5vdCByZXF1aXJlZC5cbiAgICAvLyBXaGl0ZXNwYWNlIGNhbiB0YWtlIHRoZSBwbGFjZSBvZiBjb21tYXMgb3Igb3BlbmluZyBwYXJlblxuICAgIHZhciBQRVJNSVNTSVZFX01BVENIMyA9IFwiW1xcXFxzfFxcXFwoXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVxcXFxzKlxcXFwpP1wiO1xuICAgIHZhciBQRVJNSVNTSVZFX01BVENINCA9IFwiW1xcXFxzfFxcXFwoXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVssfFxcXFxzXSsoXCIgKyBDU1NfVU5JVCArIFwiKVxcXFxzKlxcXFwpP1wiO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ1NTX1VOSVQ6IG5ldyBSZWdFeHAoQ1NTX1VOSVQpLFxuICAgICAgICByZ2I6IG5ldyBSZWdFeHAoXCJyZ2JcIiArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICAgICAgcmdiYTogbmV3IFJlZ0V4cChcInJnYmFcIiArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICAgICAgaHNsOiBuZXcgUmVnRXhwKFwiaHNsXCIgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgICAgIGhzbGE6IG5ldyBSZWdFeHAoXCJoc2xhXCIgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgICAgIGhzdjogbmV3IFJlZ0V4cChcImhzdlwiICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgICAgICBoc3ZhOiBuZXcgUmVnRXhwKFwiaHN2YVwiICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgICAgICBoZXgzOiAvXiM/KFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pJC8sXG4gICAgICAgIGhleDY6IC9eIz8oWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkkLyxcbiAgICAgICAgaGV4NDogL14jPyhbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkkLyxcbiAgICAgICAgaGV4ODogL14jPyhbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkkL1xuICAgIH07XG59KSgpO1xuXG4vLyBgaXNWYWxpZENTU1VuaXRgXG4vLyBUYWtlIGluIGEgc2luZ2xlIHN0cmluZyAvIG51bWJlciBhbmQgY2hlY2sgdG8gc2VlIGlmIGl0IGxvb2tzIGxpa2UgYSBDU1MgdW5pdFxuLy8gKHNlZSBgbWF0Y2hlcnNgIGFib3ZlIGZvciBkZWZpbml0aW9uKS5cbmZ1bmN0aW9uIGlzVmFsaWRDU1NVbml0KGNvbG9yKSB7XG4gICAgcmV0dXJuICEhbWF0Y2hlcnMuQ1NTX1VOSVQuZXhlYyhjb2xvcik7XG59XG5cbi8vIGBzdHJpbmdJbnB1dFRvT2JqZWN0YFxuLy8gUGVybWlzc2l2ZSBzdHJpbmcgcGFyc2luZy4gIFRha2UgaW4gYSBudW1iZXIgb2YgZm9ybWF0cywgYW5kIG91dHB1dCBhbiBvYmplY3Rcbi8vIGJhc2VkIG9uIGRldGVjdGVkIGZvcm1hdC4gIFJldHVybnMgYHsgciwgZywgYiB9YCBvciBgeyBoLCBzLCBsIH1gIG9yIGB7IGgsIHMsIHZ9YFxuZnVuY3Rpb24gc3RyaW5nSW5wdXRUb09iamVjdChjb2xvcikge1xuXG4gICAgY29sb3IgPSBjb2xvci5yZXBsYWNlKHRyaW1MZWZ0LCcnKS5yZXBsYWNlKHRyaW1SaWdodCwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFyIG5hbWVkID0gZmFsc2U7XG4gICAgaWYgKG5hbWVzW2NvbG9yXSkge1xuICAgICAgICBjb2xvciA9IG5hbWVzW2NvbG9yXTtcbiAgICAgICAgbmFtZWQgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChjb2xvciA9PSAndHJhbnNwYXJlbnQnKSB7XG4gICAgICAgIHJldHVybiB7IHI6IDAsIGc6IDAsIGI6IDAsIGE6IDAsIGZvcm1hdDogXCJuYW1lXCIgfTtcbiAgICB9XG5cbiAgICAvLyBUcnkgdG8gbWF0Y2ggc3RyaW5nIGlucHV0IHVzaW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXG4gICAgLy8gS2VlcCBtb3N0IG9mIHRoZSBudW1iZXIgYm91bmRpbmcgb3V0IG9mIHRoaXMgZnVuY3Rpb24gLSBkb24ndCB3b3JyeSBhYm91dCBbMCwxXSBvciBbMCwxMDBdIG9yIFswLDM2MF1cbiAgICAvLyBKdXN0IHJldHVybiBhbiBvYmplY3QgYW5kIGxldCB0aGUgY29udmVyc2lvbiBmdW5jdGlvbnMgaGFuZGxlIHRoYXQuXG4gICAgLy8gVGhpcyB3YXkgdGhlIHJlc3VsdCB3aWxsIGJlIHRoZSBzYW1lIHdoZXRoZXIgdGhlIHRpbnljb2xvciBpcyBpbml0aWFsaXplZCB3aXRoIHN0cmluZyBvciBvYmplY3QuXG4gICAgdmFyIG1hdGNoO1xuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5yZ2IuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGNoWzFdLCBnOiBtYXRjaFsyXSwgYjogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLnJnYmEuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IHI6IG1hdGNoWzFdLCBnOiBtYXRjaFsyXSwgYjogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc2wuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgbDogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzbGEuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgbDogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oc3YuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgdjogbWF0Y2hbM10gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzdmEuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7IGg6IG1hdGNoWzFdLCBzOiBtYXRjaFsyXSwgdjogbWF0Y2hbM10sIGE6IG1hdGNoWzRdIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXg4LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10pLFxuICAgICAgICAgICAgYTogY29udmVydEhleFRvRGVjaW1hbChtYXRjaFs0XSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleDhcIlxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4Ni5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4XCJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDQuZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0gKyAnJyArIG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSArICcnICsgbWF0Y2hbMl0pLFxuICAgICAgICAgICAgYjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzNdICsgJycgKyBtYXRjaFszXSksXG4gICAgICAgICAgICBhOiBjb252ZXJ0SGV4VG9EZWNpbWFsKG1hdGNoWzRdICsgJycgKyBtYXRjaFs0XSksXG4gICAgICAgICAgICBmb3JtYXQ6IG5hbWVkID8gXCJuYW1lXCIgOiBcImhleDhcIlxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4My5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSArICcnICsgbWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdICsgJycgKyBtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10gKyAnJyArIG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4XCJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlV0NBRzJQYXJtcyhwYXJtcykge1xuICAgIC8vIHJldHVybiB2YWxpZCBXQ0FHMiBwYXJtcyBmb3IgaXNSZWFkYWJsZS5cbiAgICAvLyBJZiBpbnB1dCBwYXJtcyBhcmUgaW52YWxpZCwgcmV0dXJuIHtcImxldmVsXCI6XCJBQVwiLCBcInNpemVcIjpcInNtYWxsXCJ9XG4gICAgdmFyIGxldmVsLCBzaXplO1xuICAgIHBhcm1zID0gcGFybXMgfHwge1wibGV2ZWxcIjpcIkFBXCIsIFwic2l6ZVwiOlwic21hbGxcIn07XG4gICAgbGV2ZWwgPSAocGFybXMubGV2ZWwgfHwgXCJBQVwiKS50b1VwcGVyQ2FzZSgpO1xuICAgIHNpemUgPSAocGFybXMuc2l6ZSB8fCBcInNtYWxsXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKGxldmVsICE9PSBcIkFBXCIgJiYgbGV2ZWwgIT09IFwiQUFBXCIpIHtcbiAgICAgICAgbGV2ZWwgPSBcIkFBXCI7XG4gICAgfVxuICAgIGlmIChzaXplICE9PSBcInNtYWxsXCIgJiYgc2l6ZSAhPT0gXCJsYXJnZVwiKSB7XG4gICAgICAgIHNpemUgPSBcInNtYWxsXCI7XG4gICAgfVxuICAgIHJldHVybiB7XCJsZXZlbFwiOmxldmVsLCBcInNpemVcIjpzaXplfTtcbn1cblxuLy8gTm9kZTogRXhwb3J0IGZ1bmN0aW9uXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gdGlueWNvbG9yO1xufVxuLy8gQU1EL3JlcXVpcmVqczogRGVmaW5lIHRoZSBtb2R1bGVcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7cmV0dXJuIHRpbnljb2xvcjt9KTtcbn1cbi8vIEJyb3dzZXI6IEV4cG9zZSB0byB3aW5kb3dcbmVsc2Uge1xuICAgIHdpbmRvdy50aW55Y29sb3IgPSB0aW55Y29sb3I7XG59XG5cbn0pKE1hdGgpO1xuIl19
