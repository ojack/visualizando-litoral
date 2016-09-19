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
    this.repeat = settings.repeat.value;
    this.coordType = settings.coordType.value;
    this.color = settings.color.value.rgbString;
    this.shape = settings.shape.value;
    console.log("REPEAT", this.repeat);
  }

  _createClass(Agent, [{
    key: "addPoint",
    value: function addPoint(x, y) {
      var pt = { x: x, y: y };
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
        this.points = _Path2.default.calculateOffset(this.points, point, this.stepIndex);
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
        this.stepIndex++;
        if (this.stepIndex >= this.points.length) {
          this.restartAnimation();
        }
      }
    }
  }, {
    key: "draw",
    value: function draw() {
      if (this.points.length > 0) {
        this.ctx.fillStyle = this.color;
        var currPt = this.points[this.stepIndex];
        this.ctx.fillRect(currPt.x - this.size / 2, currPt.y - this.size / 2, this.size, this.size);
      }
    }
  }]);

  return Agent;
}();

exports.default = Agent;

},{"./Path.js":7}],2:[function(require,module,exports){
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
    this.agents = [];
    this.currAgent = new _Agent2.default(this.ctx, this.settings);
    this.addEventListeners();
    this.mousePos = { x: 0, y: 0 };
    this.render();
    this.isRecording = false;

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
        this.currAgent.addPoint(e.clientX - this.canvas.width / 2, e.clientY - this.canvas.height / 2);
        this.agents.push(this.currAgent);
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

      window.onkeypress = function (e) {
        var keyCode = e.keyCode || e.which;
        console.log(keyCode);
        switch (keyCode) {
          case 97:
            // add
            this.addAgent(this.mousePos);
            break;
          case 99:
            // clear
            this.agents = [];
            break;
          case 102:
            // f, remove first
            if (this.agents.length > 0) this.agents.splice(0, 1);
            break;
          case 100:
            // d, remove last
            if (this.agents.length > 0) this.agents.splice(this.agents.length - 1, 1);
            break;
          case 114:
            if (this.isRecording) {

              this.stopRecording();
            } else {

              this.startRecording();
            }
          default:
            break;
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
      this.agents.push(agent);
    }
  }, {
    key: 'render',
    value: function render() {
      //console.log("rendering");
      if (this.isDrawing) {
        this.currAgent.addPoint(this.mousePos.x, this.mousePos.y);
      }
      this.ctx.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
      for (var i = 0; i < this.agents.length; i++) {
        this.agents[i].update();
        this.agents[i].draw();
      }
      window.requestAnimationFrame(this.render.bind(this));
    }
  }]);

  return AnimationCanvas;
}();

exports.default = AnimationCanvas;

},{"./Agent.js":1,"./settings.json":12}],3:[function(require,module,exports){
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

    _this.state = { options: _options2.default, showControls: true };

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
    }
  }, {
    key: 'update',
    value: function update(newValue, groupIndex, controlIndex) {
      var newOptions = this.state.options;
      newOptions[groupIndex].controls[controlIndex].value = newValue;
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
        controls = _react2.default.createElement(_Controls2.default, { update: this.update.bind(this), options: this.state.options });
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

},{"./AnimationCanvas.js":2,"./Controls.js":6,"./options.json":11,"react":"react"}],4:[function(require,module,exports){
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
      this.props.update(color, this.props.groupIndex, this.props.controlIndex);
      // this.setState({color: color});
    }
  }]);

  return ColorPalette;
}(_react.Component);

exports.default = ColorPalette;

},{"coloreact":17,"react":"react"}],5:[function(require,module,exports){
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
          return _react2.default.createElement(_SelectControl2.default, _extends({}, this.props, { controlIndex: ind, info: obj }));
        } else if (obj.type == "slider") {
          return _react2.default.createElement(_SliderControl2.default, _extends({}, this.props, { controlIndex: ind, info: obj }));
        } else if (obj.type == "color") {
          return _react2.default.createElement(_ColorPalette2.default, _extends({}, this.props, { controlIndex: ind, info: obj }));
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

},{"./ColorPalette.js":4,"./SelectControl.js":8,"./SliderControl.js":9,"react":"react"}],6:[function(require,module,exports){
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
        return _react2.default.createElement(_ControlGroup2.default, { info: obj, update: this.props.update, groupIndex: ind, key: "groups " + ind });
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
    value: function calculateOffset(points, offset, index) {
      /*translate by difference between old starting point and new*/
      // if(offset.x > window.innerWidth) offset.x -= window.innerWidth;
      //  if(offset.x < 0) offset.x += window.innerWidth;
      //  if(offset.y > window.innerHeight) offset.y -= window.innerHeight;
      //  if(offset.y < 0) offset.y += window.innerHeight;
      if (points.length > index) {
        var off = { x: offset.x - points[index].x, y: offset.y - points[index].y };

        return points.map(function (pt) {
          var newPt = this.addPolarCoords({ x: pt.x + off.x, y: pt.y + off.y });
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
          var newPt = this.addRectCoords({ r: pt.r + off.r, theta: pt.theta + off.theta });
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

var SelectControl = function (_Component) {
  _inherits(SelectControl, _Component);

  function SelectControl() {
    _classCallCheck(this, SelectControl);

    return _possibleConstructorReturn(this, (SelectControl.__proto__ || Object.getPrototypeOf(SelectControl)).apply(this, arguments));
  }

  _createClass(SelectControl, [{
    key: "update",
    value: function update(ind, t) {
      t.props.update(ind, t.props.groupIndex, t.props.controlIndex);
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

},{"react":"react"}],9:[function(require,module,exports){
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
      this.props.update(e.target.value, this.props.groupIndex, this.props.controlIndex);
    }
  }, {
    key: "render",
    value: function render() {

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

},{"react":"react"}],10:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.getElementById('root'));

},{"./App":3,"react":"react","react-dom":"react-dom"}],11:[function(require,module,exports){
module.exports=[
	{
		"label": "forma",
		"controls": [
			{
				"type": "select", 
				"name": "shape",
				"options": ["line", "circle", "square"],
				"value": 0
			},
			{
				"type": "slider",
				"name": "size",
				"label": "tamaño",
				"value": 89,
				"min": 1,
				"max": 300
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
			},
			{
				"type": "color", 
				"name": "color",
				"value": {
					"rgbString": "rgb(255, 255, 255)"
				}
			}

		]
	}

]
},{}],12:[function(require,module,exports){
module.exports={
	"size" : {"w": 1280, "h": 720}
}
},{}],13:[function(require,module,exports){
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
},{"./Map":15,"./Slider":16,"lodash/throttle":26,"react":"react","tinycolor2":28}],14:[function(require,module,exports){
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
},{"hoist-non-react-statics":18,"lodash/throttle":26,"react":"react","react-dom":"react-dom"}],15:[function(require,module,exports){
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
},{"./Draggable":14,"react":"react"}],16:[function(require,module,exports){
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
},{"./Draggable":14,"react":"react"}],17:[function(require,module,exports){
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
},{"./components/ColorPicker":13,"./components/Map":15,"./components/Slider":16}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],20:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":19}],21:[function(require,module,exports){
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

},{"./isObject":22,"./now":25,"./toNumber":27}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./isObjectLike":23}],25:[function(require,module,exports){
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

},{"./_root":20}],26:[function(require,module,exports){
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

},{"./debounce":21,"./isObject":22}],27:[function(require,module,exports){
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

},{"./isObject":22,"./isSymbol":24}],28:[function(require,module,exports){
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

},{}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvQWdlbnQuanMiLCJhcHAvQW5pbWF0aW9uQ2FudmFzLmpzIiwiYXBwL0FwcC5qcyIsImFwcC9Db2xvclBhbGV0dGUuanMiLCJhcHAvQ29udHJvbEdyb3VwLmpzIiwiYXBwL0NvbnRyb2xzLmpzIiwiYXBwL1BhdGguanMiLCJhcHAvU2VsZWN0Q29udHJvbC5qcyIsImFwcC9TbGlkZXJDb250cm9sLmpzIiwiYXBwL2luZGV4LmpzIiwiYXBwL29wdGlvbnMuanNvbiIsImFwcC9zZXR0aW5ncy5qc29uIiwibm9kZV9tb2R1bGVzL2NvbG9yZWFjdC9saWIvY29tcG9uZW50cy9Db2xvclBpY2tlci5qcyIsIm5vZGVfbW9kdWxlcy9jb2xvcmVhY3QvbGliL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yZWFjdC9saWIvY29tcG9uZW50cy9NYXAuanMiLCJub2RlX21vZHVsZXMvY29sb3JlYWN0L2xpYi9jb21wb25lbnRzL1NsaWRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb2xvcmVhY3QvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJub2RlX21vZHVs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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGF0aCBmcm9tICcuL1BhdGguanMnO1xuXG5jbGFzcyBBZ2VudCB7XG4gIGNvbnN0cnVjdG9yKGN0eCwgc2V0dGluZ3MpIHtcbiAgICB0aGlzLnBvaW50cyA9IFtdO1xuICAgIHRoaXMuc3RlcEluZGV4ID0gMDtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zaXplID0gc2V0dGluZ3Muc2l6ZS52YWx1ZTtcbiAgICB0aGlzLnJlcGVhdCA9IHNldHRpbmdzLnJlcGVhdC52YWx1ZTtcbiAgICB0aGlzLmNvb3JkVHlwZSA9IHNldHRpbmdzLmNvb3JkVHlwZS52YWx1ZTtcbiAgICB0aGlzLmNvbG9yID0gc2V0dGluZ3MuY29sb3IudmFsdWUucmdiU3RyaW5nO1xuICAgIHRoaXMuc2hhcGUgPSBzZXR0aW5ncy5zaGFwZS52YWx1ZTtcbiAgICBjb25zb2xlLmxvZyhcIlJFUEVBVFwiLCB0aGlzLnJlcGVhdCk7XG4gIH1cblxuICBhZGRQb2ludCh4LCB5KXtcbiAgICB2YXIgcHQgPSB7eDogeCwgeTogeX07XG4gICAgdmFyIHBvbGFyID0gUGF0aC50b1BvbGFyKHB0KTtcbiAgICBwdC50aGV0YSA9IHBvbGFyLnRoZXRhO1xuICAgIHB0LnIgPSBwb2xhci5yO1xuICAgdGhpcy5wb2ludHMucHVzaChwdCk7XG4gIH1cblxuICBzZXRQYXRoKHBvaW50cywgaW5kZXgpe1xuICAgIHRoaXMucG9pbnRzID0gcG9pbnRzO1xuICAgIHRoaXMuc3RlcEluZGV4ID0gaW5kZXg7XG4gIH1cbiAgXG4gIHNldE9mZnNldChwb2ludCl7XG4gICAgaWYodGhpcy5jb29yZFR5cGU9PTApe1xuICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZU9mZnNldCh0aGlzLnBvaW50cywgcG9pbnQsIHRoaXMuc3RlcEluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHRoaXMucG9pbnRzLCBwb2ludCwgdGhpcy5zdGVwSW5kZXgpO1xuICAgIH1cbiAgICBcbiAgIFxuICAgLy8gdGhpcy5wb2ludHMgPSBQYXRoLmNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHRoaXMucG9pbnRzLCBwb2ludCwgdGhpcy5zdGVwSW5kZXgpO1xuICAgIFxuICB9XG5cbiAgcmVzdGFydEFuaW1hdGlvbigpe1xuICAgIHRoaXMuc3RlcEluZGV4ID0gMDtcbiAgICBzd2l0Y2godGhpcy5yZXBlYXQpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiIHBvaW50IG9mZnNldFwiLCB0aGlzLnBvaW50c1t0aGlzLnBvaW50cy5sZW5ndGgtMV0pO1xuICAgICAgICAgIHRoaXMuc2V0T2Zmc2V0KHRoaXMucG9pbnRzW3RoaXMucG9pbnRzLmxlbmd0aC0xXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgICAgdGhpcy5wb2ludHMgPSBQYXRoLnJldmVyc2UodGhpcy5wb2ludHMpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICB9IFxuICB9XG5cbiAgdXBkYXRlKCl7XG4gICAgaWYodGhpcy5pc1JlY29yZGluZyl7XG4gICAgICB0aGlzLnN0ZXBJbmRleCA9IHRoaXMucG9pbnRzLmxlbmd0aCAtIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RlcEluZGV4Kys7XG4gICAgICBpZih0aGlzLnN0ZXBJbmRleCA+PSB0aGlzLnBvaW50cy5sZW5ndGgpe1xuICAgICAgICB0aGlzLnJlc3RhcnRBbmltYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gICBcbiAgIFxuICB9XG5cbiAgZHJhdygpe1xuICAgIGlmKHRoaXMucG9pbnRzLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcbiAgICAgIHZhciBjdXJyUHQgPSB0aGlzLnBvaW50c1t0aGlzLnN0ZXBJbmRleF07XG4gICAgICB0aGlzLmN0eC5maWxsUmVjdChjdXJyUHQueC10aGlzLnNpemUvMixjdXJyUHQueS10aGlzLnNpemUvMix0aGlzLnNpemUsIHRoaXMuc2l6ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFnZW50O1xuIiwiaW1wb3J0IEFnZW50IGZyb20gJy4vQWdlbnQuanMnO1xuaW1wb3J0IFNldHRpbmdzIGZyb20gJy4vc2V0dGluZ3MuanNvbic7XG5cbmNsYXNzIEFuaW1hdGlvbkNhbnZhcyB7XG4gIGNvbnN0cnVjdG9yKGNhbnZJZCwgc2V0dGluZ3MsIHBhcmVudCkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZJZCk7XG4gICAvLyB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgdGhpcy5jYW52YXMud2lkdGggPSBTZXR0aW5ncy5zaXplLnc7XG4gICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBTZXR0aW5ncy5zaXplLmg7XG4gICAvLyB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHRoaXMuaXNEcmF3aW5nID0gZmFsc2U7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gXCIjZmZmXCI7XG4gICAgdGhpcy5hZ2VudHMgPSBbXTtcbiAgICB0aGlzLmN1cnJBZ2VudCA9IG5ldyBBZ2VudCh0aGlzLmN0eCwgdGhpcy5zZXR0aW5ncyk7XG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xuICAgIHRoaXMubW91c2VQb3MgPSB7eDogMCwgeTogMH07XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgICB0aGlzLmlzUmVjb3JkaW5nID0gZmFsc2U7XG5cbiAgICB0aGlzLmN0eC50cmFuc2xhdGUodGhpcy5jYW52YXMud2lkdGgvMiwgdGhpcy5jYW52YXMuaGVpZ2h0LzIpO1xuICAgIC8vdmFyIHN0cmVhbSA9IHRoaXMuY2FudmFzLmNhcHR1cmVTdHJlYW0oNjApOyBcbiAgICAvLyB2YXIgbWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSk7XG4gICAgLy8gbWVkaWFSZWNvcmRlci5zdGFydCgpO1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcnMoKXtcbiAgICB0aGlzLmNhbnZhcy5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpe1xuICAgICAgdGhpcy5jdXJyQWdlbnQgPSBuZXcgQWdlbnQodGhpcy5jdHgsIHRoaXMuc2V0dGluZ3MpO1xuICAgICAgdGhpcy5jdXJyQWdlbnQuaXNSZWNvcmRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5jdXJyQWdlbnQuYWRkUG9pbnQoZS5jbGllbnRYLXRoaXMuY2FudmFzLndpZHRoLzIsIGUuY2xpZW50WS10aGlzLmNhbnZhcy5oZWlnaHQvMik7XG4gICAgICB0aGlzLmFnZW50cy5wdXNoKHRoaXMuY3VyckFnZW50KTtcbiAgICAgIHRoaXMuaXNEcmF3aW5nID0gdHJ1ZTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmNhbnZhcy5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpe1xuICAgICAgdGhpcy5tb3VzZVBvcyA9IHt4OiBlLmNsaWVudFgtdGhpcy5jYW52YXMud2lkdGgvMiwgeTogZS5jbGllbnRZLXRoaXMuY2FudmFzLmhlaWdodC8yfTtcbiAgICAgXG4gICAgfS5iaW5kKHRoaXMpO1xuXG5cbiAgICB0aGlzLmNhbnZhcy5vbm1vdXNldXAgPSBmdW5jdGlvbihlKXtcbiAgICAgIHRoaXMuaXNEcmF3aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmN1cnJBZ2VudC5pc1JlY29yZGluZyA9IGZhbHNlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKCl7XG4gICAgLy8gICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIC8vICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIC8vIH0uYmluZCh0aGlzKTtcblxuICAgIHdpbmRvdy5vbmtleXByZXNzID0gZnVuY3Rpb24oZSl7XG4gICAgICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xuICAgICAgY29uc29sZS5sb2coa2V5Q29kZSk7XG4gICAgICBzd2l0Y2goa2V5Q29kZSkge1xuICAgICAgICBjYXNlIDk3OiAvLyBhZGRcbiAgICAgICAgICB0aGlzLmFkZEFnZW50KHRoaXMubW91c2VQb3MpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDk5OiAvLyBjbGVhclxuICAgICAgICAgIHRoaXMuYWdlbnRzID0gW107XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTAyOiAvLyBmLCByZW1vdmUgZmlyc3RcbiAgICAgICAgICBpZih0aGlzLmFnZW50cy5sZW5ndGggPiAwKSB0aGlzLmFnZW50cy5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTAwOiAvLyBkLCByZW1vdmUgbGFzdFxuICAgICAgICAgIGlmKHRoaXMuYWdlbnRzLmxlbmd0aCA+IDApIHRoaXMuYWdlbnRzLnNwbGljZSh0aGlzLmFnZW50cy5sZW5ndGgtMSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTE0OlxuICAgICAgICAgIGlmKHRoaXMuaXNSZWNvcmRpbmcgKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdGFydFJlY29yZGluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbiAgfVxuXG4gIHN0YXJ0UmVjb3JkaW5nKCl7XG4gICAgY29uc29sZS5sb2coXCJzdGFydGluZyB0byByZWNvcmRcIik7XG4gICAgdGhpcy5pc1JlY29yZGluZyA9IHRydWU7XG4gICAgdGhpcy5yZWNvcmRlZEJsb2JzID0gW107XG4gICAgdmFyIHN0cmVhbSA9IHRoaXMuY2FudmFzLmNhcHR1cmVTdHJlYW0oNjApOyBcbiAgICB0aGlzLm1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0pO1xuICAvLyAgdGhpcy5tZWRpYVJlY29yZGVyLm9uc3RvcCA9IHRoaXMuaGFuZGxlU3RvcDtcbiAgICB0aGlzLm1lZGlhUmVjb3JkZXIub25kYXRhYXZhaWxhYmxlID0gdGhpcy5oYW5kbGVEYXRhQXZhaWxhYmxlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5tZWRpYVJlY29yZGVyLnN0YXJ0KDEwKTtcbiAgICB0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSBcInJlY29yZGluZ1wiO1xuICB9XG5cbiAgaGFuZGxlRGF0YUF2YWlsYWJsZShldmVudCkge1xuICAgIGlmIChldmVudC5kYXRhICYmIGV2ZW50LmRhdGEuc2l6ZSA+IDApIHtcbiAgICAgIHRoaXMucmVjb3JkZWRCbG9icy5wdXNoKGV2ZW50LmRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3BSZWNvcmRpbmcoKXtcbiAgICBjb25zb2xlLmxvZyhcInN0b3BwaW5nIHJlY29yZFwiKTtcbiAgICB0aGlzLm1lZGlhUmVjb3JkZXIuc3RvcCgpO1xuICAgIHRoaXMuaXNSZWNvcmRpbmcgPSBmYWxzZTtcbiAgICAvL2NvbnNvbGUubG9nKCdSZWNvcmRlZCBCbG9iczogJywgdGhpcy5yZWNvcmRlZEJsb2JzKTtcbiAgICB0aGlzLmRvd25sb2FkKCk7XG4gICAgdGhpcy5jYW52YXMuY2xhc3NOYW1lID0gXCJcIjtcbiAgfVxuXG4gIGRvd25sb2FkKCkge1xuICAgIHZhciBibG9iID0gbmV3IEJsb2IodGhpcy5yZWNvcmRlZEJsb2JzLCB7dHlwZTogJ3ZpZGVvL3dlYm0nfSk7XG4gICAgdmFyIHVybCA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICBhLmhyZWYgPSB1cmw7XG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgYS5kb3dubG9hZCA9IFwibGl0b3JhbC1cIitkYXRlLmdldERhdGUoKStcIi1cIitkYXRlLmdldERhdGUoKStcIi1cIitkYXRlLmdldEhvdXJzKCkrXCItXCIrZGF0ZS5nZXRNaW51dGVzKCkrJy53ZWJtJztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgIGEuY2xpY2soKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcbiAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgfSwgMTAwKTtcbiAgICB0aGlzLnJlY29yZGVkQmxvYnMgPSBbXTtcbiAgICB0aGlzLm1lZGlhUmVjb3JkZXIgPSBudWxsO1xuICB9XG5cbiAgYWRkQWdlbnQocG9zKXtcbiAgICB2YXIgYWdlbnQgPSBuZXcgQWdlbnQodGhpcy5jdHgsIHRoaXMuc2V0dGluZ3MpO1xuICAgIGlmKHRoaXMuc2V0dGluZ3Muc3luY2hyby52YWx1ZT09MCl7XG4gICAgICBhZ2VudC5zZXRQYXRoKHRoaXMuY3VyckFnZW50LnBvaW50cywgdGhpcy5jdXJyQWdlbnQuc3RlcEluZGV4KTtcbiAgICB9ZWxzZXtcbiAgICAgIGFnZW50LnNldFBhdGgodGhpcy5jdXJyQWdlbnQucG9pbnRzLCAwKTtcbiAgICB9XG4gICAgYWdlbnQuc2V0T2Zmc2V0KHBvcyk7XG4gICAgdGhpcy5hZ2VudHMucHVzaChhZ2VudCk7XG4gIH1cblxuICByZW5kZXIoKXtcbiAgICAvL2NvbnNvbGUubG9nKFwicmVuZGVyaW5nXCIpO1xuICAgICBpZih0aGlzLmlzRHJhd2luZyl7XG4gICAgICAgIHRoaXMuY3VyckFnZW50LmFkZFBvaW50KHRoaXMubW91c2VQb3MueCwgdGhpcy5tb3VzZVBvcy55KTtcbiAgICAgIH1cbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoLXRoaXMuY2FudmFzLndpZHRoLzIsIC10aGlzLmNhbnZhcy5oZWlnaHQvMiwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuYWdlbnRzLmxlbmd0aDsgaSsrKXtcbiAgICAgIHRoaXMuYWdlbnRzW2ldLnVwZGF0ZSgpO1xuICAgICAgdGhpcy5hZ2VudHNbaV0uZHJhdygpO1xuICAgIH1cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGlvbkNhbnZhcztcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgQ29udHJvbHMgZnJvbSAnLi9Db250cm9scy5qcyc7XG5pbXBvcnQgQW5pbWF0aW9uQ2FudmFzIGZyb20gJy4vQW5pbWF0aW9uQ2FudmFzLmpzJztcbmltcG9ydCBvcHRpb25zIGZyb20gJy4vb3B0aW9ucy5qc29uJztcblxuLy9pbXBvcnQgJy4vQXBwLmNzcyc7XG5cbmNsYXNzIEFwcCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKXtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtvcHRpb25zOiBvcHRpb25zLCBzaG93Q29udHJvbHM6IHRydWV9O1xuXG4gICAgdmFyIHNldHRpbmdzID0ge307XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuc3RhdGUub3B0aW9ucy5sZW5ndGg7IGkrKyl7XG4gICAgICB2YXIgZ3JvdXAgPSB0aGlzLnN0YXRlLm9wdGlvbnNbaV0uY29udHJvbHM7XG4gICAgICBmb3IodmFyIGogPSAwOyBqIDwgZ3JvdXAubGVuZ3RoOyBqKyspe1xuICAgICAgICBzZXR0aW5nc1tncm91cFtqXS5uYW1lXSA9IGdyb3VwW2pdO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpe1xuICAgIHRoaXMuYW5pbSA9IG5ldyBBbmltYXRpb25DYW52YXMoXCJkcmF3XCIsIHRoaXMuc2V0dGluZ3MsIHRoaXMpO1xuICB9XG4gIFxuICB1cGRhdGUobmV3VmFsdWUsIGdyb3VwSW5kZXgsIGNvbnRyb2xJbmRleCl7XG4gICAgdmFyIG5ld09wdGlvbnMgPSB0aGlzLnN0YXRlLm9wdGlvbnM7XG4gICAgbmV3T3B0aW9uc1tncm91cEluZGV4XS5jb250cm9sc1tjb250cm9sSW5kZXhdLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b3B0aW9uczogbmV3T3B0aW9uc30pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBzdHlsZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICB0b3A6IFwiMHB4XCIsXG4gICAgICBsZWZ0OiBcIjBweFwiLFxuICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgaGVpZ2h0OiBcIjEwMCVcIlxuICAgIH07XG4gICAgdmFyIGNvbnRyb2xzID0gW107XG4gICAgaWYodGhpcy5zdGF0ZS5zaG93Q29udHJvbHMpe1xuICAgICAgY29udHJvbHMgPSA8Q29udHJvbHMgdXBkYXRlPXt0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpfSBvcHRpb25zPXt0aGlzLnN0YXRlLm9wdGlvbnN9Lz5cbiAgICB9XG4gICAgcmV0dXJuIDxkaXYgc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxjYW52YXMgaWQ9XCJkcmF3XCI+PC9jYW52YXM+XG4gICAgICB7Y29udHJvbHN9XG4gICAgPC9kaXY+O1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbG9yUGlja2VyIGZyb20gJ2NvbG9yZWFjdCc7XG5cblxuY2xhc3MgQ29sb3JQYWxldHRlIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgXG4gIHJlbmRlcigpe1xuICAgIHZhciBzdHlsZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICB3aWR0aDogXCIxNTBweFwiLFxuICAgICAgaGVpZ2h0OiBcIjE1MHB4XCJcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGUgPSB7c3R5bGV9PlxuICAgICAgICAgPENvbG9yUGlja2VyXG4gICAgICBvcGFjaXR5PXt0cnVlfVxuICAgICAgY29sb3I9e3RoaXMucHJvcHMuaW5mby52YWx1ZS5yZ2JTdHJpbmd9XG4gICAgICBvbkNoYW5nZT17dGhpcy5zaG93Q29sb3IuYmluZCh0aGlzKX1cbiAgICAgICAvPiBcbiAgICAgICA8L2Rpdj4pO1xuICAgXG4gIH1cblxuICBzaG93Q29sb3IoY29sb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGNvbG9yKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgdGhpcy5wcm9wcy51cGRhdGUoY29sb3IsIHRoaXMucHJvcHMuZ3JvdXBJbmRleCwgdGhpcy5wcm9wcy5jb250cm9sSW5kZXgpO1xuICAgICAvLyB0aGlzLnNldFN0YXRlKHtjb2xvcjogY29sb3J9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb2xvclBhbGV0dGU7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFNlbGVjdENvbnRyb2wgZnJvbSAnLi9TZWxlY3RDb250cm9sLmpzJztcbmltcG9ydCBTbGlkZXJDb250cm9sIGZyb20gJy4vU2xpZGVyQ29udHJvbC5qcyc7XG5pbXBvcnQgQ29sb3JQYWxldHRlIGZyb20gJy4vQ29sb3JQYWxldHRlLmpzJztcblxuY2xhc3MgQ29udHJvbEdyb3VwIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICBcdCB2YXIgY29udHJvbHMgPSB0aGlzLnByb3BzLmluZm8uY29udHJvbHMubWFwKGZ1bmN0aW9uKG9iaiwgaW5kKXtcbiAgXHQgXHRpZihvYmoudHlwZT09XCJzZWxlY3RcIil7XG4gIFx0IFx0XHRyZXR1cm4gPFNlbGVjdENvbnRyb2wgey4uLnRoaXMucHJvcHN9IGNvbnRyb2xJbmRleD17aW5kfSBpbmZvPXtvYmp9IC8+XG4gIFx0IFx0fSBlbHNlIGlmKG9iai50eXBlPT1cInNsaWRlclwiKXtcbiAgXHQgXHRcdHJldHVybiA8U2xpZGVyQ29udHJvbCB7Li4udGhpcy5wcm9wc30gY29udHJvbEluZGV4PXtpbmR9IGluZm89e29ian0gLz5cbiAgXHQgXHR9IGVsc2UgaWYob2JqLnR5cGU9PVwiY29sb3JcIil7XG4gICAgICAgIHJldHVybiA8Q29sb3JQYWxldHRlIHsuLi50aGlzLnByb3BzfSBjb250cm9sSW5kZXg9e2luZH0gaW5mbz17b2JqfSAvPlxuICAgICAgfVxuICBcdCB9LmJpbmQodGhpcykpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbC1ncm91cFwiPlxuICAgICAgIDxoMz57dGhpcy5wcm9wcy5pbmZvLmxhYmVsfTwvaDM+XG4gICAgICAge2NvbnRyb2xzfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sR3JvdXA7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IENvbnRyb2xHcm91cCBmcm9tICcuL0NvbnRyb2xHcm91cC5qcyc7XG5cbmNsYXNzIENvbnRyb2xzIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIHZhciBncm91cHMgPSB0aGlzLnByb3BzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9iaiwgaW5kKXtcbiAgICAgIHJldHVybiA8Q29udHJvbEdyb3VwIGluZm89e29ian0gdXBkYXRlPXt0aGlzLnByb3BzLnVwZGF0ZX0gZ3JvdXBJbmRleD17aW5kfSBrZXk9e1wiZ3JvdXBzIFwiK2luZH0vPlxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udHJvbHNcIj5cbiAgICAgICB7Z3JvdXBzfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9scztcbiIsIi8qdXRpbGl0eSBmdW5jdGlvbnMgZm9yIGNhbGN1bGF0aW5nIHBhdGgqL1xuXG5jbGFzcyBQYXRoIHtcbiAgc3RhdGljIHJldmVyc2UocG9pbnRzKXtcbiAgICByZXR1cm4gcG9pbnRzLnJldmVyc2UoKTtcbiAgfVxuXG4gIHN0YXRpYyBjYWxjdWxhdGVPZmZzZXQocG9pbnRzLCBvZmZzZXQsIGluZGV4KXtcbiAgICAvKnRyYW5zbGF0ZSBieSBkaWZmZXJlbmNlIGJldHdlZW4gb2xkIHN0YXJ0aW5nIHBvaW50IGFuZCBuZXcqL1xuICAgICAvLyBpZihvZmZzZXQueCA+IHdpbmRvdy5pbm5lcldpZHRoKSBvZmZzZXQueCAtPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgLy8gIGlmKG9mZnNldC54IDwgMCkgb2Zmc2V0LnggKz0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgIC8vICBpZihvZmZzZXQueSA+IHdpbmRvdy5pbm5lckhlaWdodCkgb2Zmc2V0LnkgLT0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAvLyAgaWYob2Zmc2V0LnkgPCAwKSBvZmZzZXQueSArPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICBpZihwb2ludHMubGVuZ3RoID4gaW5kZXgpe1xuICAgIHZhciBvZmYgPSB7eDogb2Zmc2V0LngtcG9pbnRzW2luZGV4XS54LCB5OiBvZmZzZXQueS1wb2ludHNbaW5kZXhdLnl9XG5cbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbihwdCl7XG4gICAgICB2YXIgbmV3UHQgPSB0aGlzLmFkZFBvbGFyQ29vcmRzKHt4OiBwdC54ICsgb2ZmLngsIHk6IHB0LnkgKyBvZmYueX0pO1xuICAgICAgLy8gaWYobmV3UHQueCA+IHdpbmRvdy5pbm5lcldpZHRoKSBuZXdQdC54IC09IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgLy8gaWYobmV3UHQueCA8IDApIG5ld1B0LnggKz0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAvLyBpZihuZXdQdC55ID4gd2luZG93LmlubmVySGVpZ2h0KSBuZXdQdC55IC09IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIC8vIGlmKG5ld1B0LnkgPCAwKSBuZXdQdC55ICs9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIHJldHVybiBuZXdQdDtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgfSBlbHNlIHtcbiAgICByZXR1cm4gcG9pbnRzO1xuICAgfVxuICAgIFxuICB9XG5cbiAgc3RhdGljIGNhbGN1bGF0ZVBvbGFyT2Zmc2V0KHBvaW50cywgbywgaW5kZXgpe1xuICAgIC8vY29uc29sZS5sb2coXCJjYWxjIG9mZnNldFwiLCBvKTtcbiAgICB2YXIgcCA9IHRoaXMudG9Qb2xhcihvKTtcbiAgICAgY29uc29sZS5sb2coXCJyZWN0XCIsIG8pO1xuICAgIGNvbnNvbGUubG9nKFwicG9sYXJcIiwgcCk7XG4gICAgIGNvbnNvbGUubG9nKFwicmUtcmVjdFwiLCB0aGlzLnRvUmVjdChwKSk7XG5cbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5hZGRQb2xhckNvb3JkcyhvKTtcbiAgICBpZihwb2ludHMubGVuZ3RoID4gaW5kZXgpe1xuICAgICAgY29uc29sZS5sb2coXCJvcmlnaW5hbCBwb2ludFwiLCBwb2ludHNbaW5kZXhdKTtcbiAgICAgIHZhciBvZmYgPSB7dGhldGE6IG9mZnNldC50aGV0YSAtIHBvaW50c1tpbmRleF0udGhldGEsIHI6IG9mZnNldC5yIC0gcG9pbnRzW2luZGV4XS5yfTtcbiAgICAgIGNvbnNvbGUubG9nKFwiZGlmZmVyZW5jZVwiLCBvZmYpO1xuICAgICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24ocHQpe1xuICAgICAgICB2YXIgbmV3UHQgPSB0aGlzLmFkZFJlY3RDb29yZHMoe3I6IHB0LnIgKyBvZmYuciwgdGhldGE6IHB0LnRoZXRhICsgb2ZmLnRoZXRhfSk7XG4gICAgICAgLy8gdmFyIG5ld1B0ID0gdGhpcy5hZGRSZWN0Q29vcmRzKHt0aGV0YTogcHQudGhldGEgKyBvZmYudGhldGEsIHI6IHB0LnJ9KTtcbiAgICAgICAgcmV0dXJuIG5ld1B0O1xuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYWRkUmVjdENvb3JkcyhwdCl7XG4gICAgdmFyIHJlY3QgPSB0aGlzLnRvUmVjdChwdCk7XG4gICAgcHQueCA9IHJlY3QueDtcbiAgICBwdC55ID0gcmVjdC55O1xuICAgIHJldHVybiBwdDtcbiAgfVxuXG4gIHN0YXRpYyB0b1JlY3QocHQpe1xuICAgIHZhciB4ID0gcHQucipNYXRoLmNvcyhwdC50aGV0YSk7XG4gICAgdmFyIHkgPSBwdC5yKk1hdGguc2luKHB0LnRoZXRhKTtcbiAgICByZXR1cm4gKHt4OiB4LCB5OiB5fSk7XG4gIH1cblxuICBzdGF0aWMgYWRkUG9sYXJDb29yZHMocHQpe1xuICAgIC8vY29uc29sZS5sb2coXCJwb2ludFwiLCBwdCk7XG4gICAgdmFyIHBvbGFyID0gdGhpcy50b1BvbGFyKHB0KTtcbiAgIC8vIGNvbnNvbGUubG9nKFwicG9sYXJcIiwgcG9sYXIpO1xuICAgIHB0LnRoZXRhID0gcG9sYXIudGhldGE7XG4gICAgcHQuciA9IHBvbGFyLnI7XG4gICAgcmV0dXJuIHB0O1xuICB9XG5cbiAgc3RhdGljIHRvUG9sYXIocHQpe1xuICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIocHQueSAsIHB0LngpO1xuICAgIHZhciByID0gTWF0aC5zcXJ0KHB0LngqcHQueCArIHB0LnkqcHQueSk7XG4gICAgcmV0dXJuICh7dGhldGE6IHRoZXRhLCByOiByfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGF0aDtcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5cbmNsYXNzIFNlbGVjdENvbnRyb2wgZXh0ZW5kcyBDb21wb25lbnQge1xuICB1cGRhdGUoaW5kLCB0KXtcbiAgXHR0LnByb3BzLnVwZGF0ZShpbmQsIHQucHJvcHMuZ3JvdXBJbmRleCwgdC5wcm9wcy5jb250cm9sSW5kZXgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuXG4gIFx0IHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5pbmZvLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG5hbWUsIGluZCl7XG4gIFx0IFx0dmFyIGltZ1VybDtcbiAgXHQgXG4gIFx0IFx0aWYodGhpcy5wcm9wcy5pbmZvLnZhbHVlPT09aW5kKXtcbiAgXHQgXHQvL1x0aW1nVXJsID0gcmVxdWlyZShcIi4vLi4vaW1hZ2VzL1wiK25hbWUrXCItc2VsZWN0ZWQtMDEucG5nXCIpO1xuICAgICAgICBpbWdVcmwgPSBcIi4vaW1hZ2VzL1wiK25hbWUrXCItc2VsZWN0ZWQtMDEucG5nXCI7XG4gIFx0IFx0fWVsc2V7XG4gIFx0IFx0Ly9cdGltZ1VybCA9IHJlcXVpcmUoXCIuLy4uL2ltYWdlcy9cIituYW1lK1wiLTAxLnBuZ1wiKTtcbiAgICAgIGltZ1VybCA9IFwiLi9pbWFnZXMvXCIrbmFtZStcIi0wMS5wbmdcIjtcbiAgXHQgXHR9XG4gIFx0IFxuICBcdCBcdHJldHVybiA8aW1nIGNsYXNzTmFtZT1cImNvbnRyb2wtYnV0dG9uXCIgc3JjPXtpbWdVcmx9IGtleT17bmFtZX0gYWx0PXtuYW1lfSBvbkNsaWNrPXt0aGlzLnVwZGF0ZS5iaW5kKG51bGwsIGluZCwgdGhpcyl9IC8+O1xuICBcdCB9LmJpbmQodGhpcykpO1xuICAgICB2YXIgbGFiZWwgPSBbXTtcbiAgICAgaWYodGhpcy5wcm9wcy5pbmZvLmxhYmVsKSBsYWJlbCA9ICg8aDQ+e3RoaXMucHJvcHMuaW5mby5sYWJlbH08L2g0Pik7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtcImNvbnRyb2wtZWxlbWVudFwifT5cbiAgICAgICAge2xhYmVsfVxuICAgICAgIHtvcHRpb25zfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWxlY3RDb250cm9sO1xuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcblxuY2xhc3MgU2xpZGVyQ29udHJvbCBleHRlbmRzIENvbXBvbmVudCB7XG4gIHVwZGF0ZShlKXtcbiAgXHQvL2NvbnNvbGUubG9nKGUudGFyZ2V0LnZhbHVlKTtcbiAgXHR0aGlzLnByb3BzLnVwZGF0ZShlLnRhcmdldC52YWx1ZSwgdGhpcy5wcm9wcy5ncm91cEluZGV4LCB0aGlzLnByb3BzLmNvbnRyb2xJbmRleCk7XG4gIH1cbiAgcmVuZGVyKCkge1xuICBcdCBcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17XCJjb250cm9sLWVsZW1lbnRcIn0+XG4gICAgICAgPGg0Pnt0aGlzLnByb3BzLmluZm8ubGFiZWwrXCI6IFwiK3RoaXMucHJvcHMuaW5mby52YWx1ZX08L2g0PlxuICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBpZD1cIm15UmFuZ2VcIiBtaW49e3RoaXMucHJvcHMuaW5mby5taW59IG1heD17dGhpcy5wcm9wcy5pbmZvLm1heH1cbiAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy5pbmZvLnZhbHVlfSBvbkNoYW5nZT17dGhpcy51cGRhdGUuYmluZCh0aGlzKX0vPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXJDb250cm9sO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IEFwcCBmcm9tICcuL0FwcCc7XG5cblJlYWN0RE9NLnJlbmRlcihcbiAgPEFwcCAvPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKVxuKTtcbiIsIm1vZHVsZS5leHBvcnRzPVtcblx0e1xuXHRcdFwibGFiZWxcIjogXCJmb3JtYVwiLFxuXHRcdFwiY29udHJvbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcInR5cGVcIjogXCJzZWxlY3RcIiwgXG5cdFx0XHRcdFwibmFtZVwiOiBcInNoYXBlXCIsXG5cdFx0XHRcdFwib3B0aW9uc1wiOiBbXCJsaW5lXCIsIFwiY2lyY2xlXCIsIFwic3F1YXJlXCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDBcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcInNsaWRlclwiLFxuXHRcdFx0XHRcIm5hbWVcIjogXCJzaXplXCIsXG5cdFx0XHRcdFwibGFiZWxcIjogXCJ0YW1hw7FvXCIsXG5cdFx0XHRcdFwidmFsdWVcIjogODksXG5cdFx0XHRcdFwibWluXCI6IDEsXG5cdFx0XHRcdFwibWF4XCI6IDMwMFxuXHRcdFx0fVxuXG5cdFx0XVxuXHR9LFxuXHR7XG5cdFx0XCJsYWJlbFwiOiBcImFuaW1hY2nDs25cIixcblx0XHRcImNvbnRyb2xzXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwic2VsZWN0XCIsIFxuXHRcdFx0XHRcImxhYmVsXCI6IFwiY2ljbG9cIixcblx0XHRcdFx0XCJuYW1lXCI6IFwicmVwZWF0XCIsXG5cdFx0XHRcdFwib3B0aW9uc1wiOiBbXCJyZXBlYXQtcmVwZWF0XCIsIFwicmVwZWF0LWNvbnRpbnVlXCIsIFwicmVwZWF0LXJldmVyc2VcIl0sXG5cdFx0XHRcdFwidmFsdWVcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJ0eXBlXCI6IFwic2VsZWN0XCIsIFxuXHRcdFx0XHRcImxhYmVsXCI6IFwic2luY3Jvbml6YWNpw7NuXCIsXG5cdFx0XHRcdFwibmFtZVwiOiBcInN5bmNocm9cIixcblx0XHRcdFx0XCJvcHRpb25zXCI6IFtcInN5bmNocm8tc3luY2VkXCIsIFwic3luY2hyby1vZmZiZWF0XCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcInNlbGVjdFwiLCBcblx0XHRcdFx0XCJsYWJlbFwiOiBcImNvb3JkZW5hZGFzXCIsXG5cdFx0XHRcdFwibmFtZVwiOiBcImNvb3JkVHlwZVwiLFxuXHRcdFx0XHRcIm9wdGlvbnNcIjogW1wiY29vcmRlbmFkYXMtcmVjdFwiLCBcImNvb3JkZW5hZGFzLXBvbGFyXCJdLFxuXHRcdFx0XHRcInZhbHVlXCI6IDBcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwidHlwZVwiOiBcImNvbG9yXCIsIFxuXHRcdFx0XHRcIm5hbWVcIjogXCJjb2xvclwiLFxuXHRcdFx0XHRcInZhbHVlXCI6IHtcblx0XHRcdFx0XHRcInJnYlN0cmluZ1wiOiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdF1cblx0fVxuXG5dIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInNpemVcIiA6IHtcIndcIjogMTI4MCwgXCJoXCI6IDcyMH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9TbGlkZXIgPSByZXF1aXJlKCcuL1NsaWRlcicpO1xuXG52YXIgX1NsaWRlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TbGlkZXIpO1xuXG52YXIgX01hcCA9IHJlcXVpcmUoJy4vTWFwJyk7XG5cbnZhciBfTWFwMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX01hcCk7XG5cbnZhciBfdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gvdGhyb3R0bGUnKTtcblxudmFyIF90aHJvdHRsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aHJvdHRsZSk7XG5cbnZhciBfdGlueWNvbG9yID0gcmVxdWlyZSgndGlueWNvbG9yMicpO1xuXG52YXIgX3Rpbnljb2xvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90aW55Y29sb3IpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBDb2xvclBpY2tlciA9IGZ1bmN0aW9uIChfQ29tcG9uZW50KSB7XG4gIF9pbmhlcml0cyhDb2xvclBpY2tlciwgX0NvbXBvbmVudCk7XG5cbiAgZnVuY3Rpb24gQ29sb3JQaWNrZXIocHJvcHMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29sb3JQaWNrZXIpO1xuXG4gICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgT2JqZWN0LmdldFByb3RvdHlwZU9mKENvbG9yUGlja2VyKS5jYWxsKHRoaXMsIHByb3BzKSk7XG5cbiAgICB2YXIgYyA9ICgwLCBfdGlueWNvbG9yMi5kZWZhdWx0KShfdGhpcy5wcm9wcy5jb2xvcikudG9Ic3YoKTtcbiAgICBfdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGNvbG9yOiBfdGhpcy50b1BlcmNlbnRhZ2UoYylcbiAgICB9O1xuXG4gICAgX3RoaXMudGhyb3R0bGUgPSAoMCwgX3Rocm90dGxlMi5kZWZhdWx0KShmdW5jdGlvbiAoZm4sIGRhdGEpIHtcbiAgICAgIGZuKGRhdGEpO1xuICAgIH0sIDEwMCk7XG5cbiAgICBfdGhpcy5oYW5kbGVTYXR1cmF0aW9uVmFsdWVDaGFuZ2UgPSBfdGhpcy5oYW5kbGVTYXR1cmF0aW9uVmFsdWVDaGFuZ2UuYmluZChfdGhpcyk7XG4gICAgX3RoaXMuaGFuZGxlSHVlQ2hhbmdlID0gX3RoaXMuaGFuZGxlSHVlQ2hhbmdlLmJpbmQoX3RoaXMpO1xuICAgIF90aGlzLmhhbmRsZUFscGhhQ2hhbmdlID0gX3RoaXMuaGFuZGxlQWxwaGFDaGFuZ2UuYmluZChfdGhpcyk7XG4gICAgX3RoaXMuc2hvd0xhc3RWYWx1ZSA9IF90aGlzLnNob3dMYXN0VmFsdWUuYmluZChfdGhpcyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENvbG9yUGlja2VyLCBbe1xuICAgIGtleTogJ2NvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgICAgaWYgKCFfdGlueWNvbG9yMi5kZWZhdWx0LmVxdWFscyhuZXh0UHJvcHMuY29sb3IsIHRoaXMuc3RhdGUuY29sb3IpKSB7XG4gICAgICAgIHZhciBjID0gKDAsIF90aW55Y29sb3IyLmRlZmF1bHQpKG5leHRQcm9wcy5jb2xvcikudG9Ic3YoKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgY29sb3I6IHRoaXMudG9QZXJjZW50YWdlKGMpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3RvUGVyY2VudGFnZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvUGVyY2VudGFnZShoc3YpIHtcbiAgICAgIHZhciBoID0gaHN2Lmg7XG4gICAgICB2YXIgcyA9IGhzdi5zO1xuICAgICAgdmFyIHYgPSBoc3YudjtcbiAgICAgIHZhciBhID0gaHN2LmE7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGg6IGgsXG4gICAgICAgIHM6IHMgKiAxMDAsXG4gICAgICAgIHY6IHYgKiAxMDAsXG4gICAgICAgIGE6IGFcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlSHVlQ2hhbmdlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlSHVlQ2hhbmdlKGgpIHtcbiAgICAgIHZhciBfc3RhdGUkY29sb3IgPSB0aGlzLnN0YXRlLmNvbG9yO1xuICAgICAgdmFyIHMgPSBfc3RhdGUkY29sb3IucztcbiAgICAgIHZhciB2ID0gX3N0YXRlJGNvbG9yLnY7XG4gICAgICB2YXIgYSA9IF9zdGF0ZSRjb2xvci5hO1xuXG4gICAgICB0aGlzLnVwZGF0ZSh7IGg6IGgsIHM6IHMsIHY6IHYsIGE6IGEgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGFuZGxlU2F0dXJhdGlvblZhbHVlQ2hhbmdlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlU2F0dXJhdGlvblZhbHVlQ2hhbmdlKHMsIHYpIHtcbiAgICAgIHZhciBfc3RhdGUkY29sb3IyID0gdGhpcy5zdGF0ZS5jb2xvcjtcbiAgICAgIHZhciBoID0gX3N0YXRlJGNvbG9yMi5oO1xuICAgICAgdmFyIGEgPSBfc3RhdGUkY29sb3IyLmE7XG5cbiAgICAgIHRoaXMudXBkYXRlKHsgaDogaCwgczogcywgdjogdiwgYTogYSB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoYW5kbGVBbHBoYUNoYW5nZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhbmRsZUFscGhhQ2hhbmdlKGEpIHtcbiAgICAgIHZhciBfc3RhdGUkY29sb3IzID0gdGhpcy5zdGF0ZS5jb2xvcjtcbiAgICAgIHZhciBoID0gX3N0YXRlJGNvbG9yMy5oO1xuICAgICAgdmFyIHMgPSBfc3RhdGUkY29sb3IzLnM7XG4gICAgICB2YXIgdiA9IF9zdGF0ZSRjb2xvcjMudjtcblxuICAgICAgdGhpcy51cGRhdGUoeyBoOiBoLCBzOiBzLCB2OiB2LCBhOiBhIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldEFscGhhJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QWxwaGEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZS5jb2xvci5hID09PSB1bmRlZmluZWQgPyAxIDogdGhpcy5zdGF0ZS5jb2xvci5hO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldEJhY2tncm91bmRIdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCYWNrZ3JvdW5kSHVlKCkge1xuICAgICAgcmV0dXJuICgwLCBfdGlueWNvbG9yMi5kZWZhdWx0KSh7XG4gICAgICAgIGg6IHRoaXMuc3RhdGUuY29sb3IuaCxcbiAgICAgICAgczogMTAwLFxuICAgICAgICB2OiAxMDAgfSkudG9SZ2JTdHJpbmcoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRCYWNrZ3JvdW5kR3JhZGllbnQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRCYWNrZ3JvdW5kR3JhZGllbnQoKSB7XG4gICAgICB2YXIgX3N0YXRlJGNvbG9yNCA9IHRoaXMuc3RhdGUuY29sb3I7XG4gICAgICB2YXIgaCA9IF9zdGF0ZSRjb2xvcjQuaDtcbiAgICAgIHZhciBzID0gX3N0YXRlJGNvbG9yNC5zO1xuICAgICAgdmFyIHYgPSBfc3RhdGUkY29sb3I0LnY7XG5cbiAgICAgIHZhciBvcGFxdWUgPSAoMCwgX3Rpbnljb2xvcjIuZGVmYXVsdCkoe1xuICAgICAgICBoOiBoLFxuICAgICAgICBzOiBzLFxuICAgICAgICB2OiB2LFxuICAgICAgICBhOiAxIH0pLnRvUmdiU3RyaW5nKCk7XG4gICAgICByZXR1cm4gJ2xpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSgwLDAsMCwwKSAwJSwgJyArIG9wYXF1ZSArICcgMTAwJSknO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VwZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZShjb2xvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbG9yOiBjb2xvciB9KTtcbiAgICAgIHRoaXMudGhyb3R0bGUodGhpcy5wcm9wcy5vbkNoYW5nZSwgdGhpcy5vdXRwdXQoKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb3V0cHV0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3V0cHV0KCkge1xuICAgICAgdmFyIGMgPSAoMCwgX3Rpbnljb2xvcjIuZGVmYXVsdCkodGhpcy5zdGF0ZS5jb2xvcik7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoc2w6IGMudG9Ic2woKSxcbiAgICAgICAgaGV4OiBjLnRvSGV4KCksXG4gICAgICAgIGhleFN0cmluZzogYy50b0hleFN0cmluZygpLFxuICAgICAgICByZ2I6IGMudG9SZ2IoKSxcbiAgICAgICAgcmdiU3RyaW5nOiBjLnRvUmdiU3RyaW5nKClcbiAgICAgIH07XG4gICAgICByZXR1cm4gYztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzaG93TGFzdFZhbHVlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hvd0xhc3RWYWx1ZSgpIHtcbiAgICAgIHRoaXMucHJvcHMub25Db21wbGV0ZSAmJiB0aGlzLnByb3BzLm9uQ29tcGxldGUodGhpcy5vdXRwdXQoKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVuZGVyJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgdmFyIF9zdGF0ZSRjb2xvcjUgPSB0aGlzLnN0YXRlLmNvbG9yO1xuICAgICAgdmFyIGggPSBfc3RhdGUkY29sb3I1Lmg7XG4gICAgICB2YXIgcyA9IF9zdGF0ZSRjb2xvcjUucztcbiAgICAgIHZhciB2ID0gX3N0YXRlJGNvbG9yNS52O1xuICAgICAgdmFyIGEgPSBfc3RhdGUkY29sb3I1LmE7XG5cbiAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8ICdDb2xvclBpY2tlcicsXG4gICAgICAgICAgc3R5bGU6IHRoaXMucHJvcHMuc3R5bGUgfSxcbiAgICAgICAgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX1NsaWRlcjIuZGVmYXVsdCwge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ0h1ZVNsaWRlcicsXG4gICAgICAgICAgdmVydGljYWw6IHRydWUsXG4gICAgICAgICAgdmFsdWU6IGgsXG4gICAgICAgICAgdHlwZTogJ2h1ZScsXG4gICAgICAgICAgbWF4OiAzNjAsXG4gICAgICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlSHVlQ2hhbmdlLFxuICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMuc2hvd0xhc3RWYWx1ZSxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgcmlnaHQ6ICcxLjNlbScsXG4gICAgICAgICAgICBib3R0b206IHRoaXMucHJvcHMub3BhY2l0eSA/ICcyLjVlbScgOiAnMS4zZW0nXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0cmFja1N0eWxlOiB7XG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCh0byBib3R0b20sXFxuICAgICAgICAgICAgICAjRkYwMDAwIDAlLFxcbiAgICAgICAgICAgICAgI0ZGMDA5OSAxMCUsXFxuICAgICAgICAgICAgICAjQ0QwMEZGIDIwJSxcXG4gICAgICAgICAgICAgICMzMjAwRkYgMzAlLFxcbiAgICAgICAgICAgICAgIzAwNjZGRiA0MCUsXFxuICAgICAgICAgICAgICAjMDBGRkZEIDUwJSxcXG4gICAgICAgICAgICAgICMwMEZGNjYgNjAlLFxcbiAgICAgICAgICAgICAgIzM1RkYwMCA3MCUsXFxuICAgICAgICAgICAgICAjQ0RGRjAwIDgwJSxcXG4gICAgICAgICAgICAgICNGRjk5MDAgOTAlLFxcbiAgICAgICAgICAgICAgI0ZGMDAwMCAxMDAlXFxuICAgICAgICAgICAgKSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvaW50ZXJTdHlsZToge1xuICAgICAgICAgICAgYm94U2hhZG93OiAnaW5zZXQgMCAwIDAgMXB4ICNjY2MsMCAxcHggMnB4ICNjY2MnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJSdcbiAgICAgICAgICB9IH0pLFxuICAgICAgICB0aGlzLnByb3BzLm9wYWNpdHkgJiYgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoX1NsaWRlcjIuZGVmYXVsdCwge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ09wYWNpdHlTbGlkZXInLFxuICAgICAgICAgIHR5cGU6ICdvcGFjaXR5JyxcbiAgICAgICAgICB2YWx1ZTogYSxcbiAgICAgICAgICBtYXg6IDEsXG4gICAgICAgICAgYmFja2dyb3VuZDogdGhpcy5nZXRCYWNrZ3JvdW5kR3JhZGllbnQoKSxcbiAgICAgICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVBbHBoYUNoYW5nZSxcbiAgICAgICAgICBvbkNvbXBsZXRlOiB0aGlzLnNob3dMYXN0VmFsdWUsXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIGJvdHRvbTogJzEuM2VtJyxcbiAgICAgICAgICAgIHJpZ2h0OiAnMi41ZW0nLFxuICAgICAgICAgICAgaGVpZ2h0OiA4LFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYgdXJsKFwiZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGRoRUFBUUFQRUFBTXZMeTh6TXpQLy8vd0FBQUN3QUFBQUFFQUFRQUVBQ0hZeHZvc3N0Q0FFTXJxNkpqODEyWTU5TklEUWlwZFk1WExXcUg0c1ZBRHM9XCIpIHJlcGVhdCcsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kU2l6ZTogJzhweCA4cHgnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0cmFja1N0eWxlOiB7XG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxZW0nLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCh0byByaWdodCwgcmdiYSgyNTUsMjU1LDI1NSwwKSAwJSwgI0ZGRiAxMDAlKSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvaW50ZXJTdHlsZToge1xuICAgICAgICAgICAgYm94U2hhZG93OiAnaW5zZXQgMCAwIDAgMXB4ICNjY2MsMCAxcHggMnB4ICNjY2MnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTAwJSdcbiAgICAgICAgICB9IH0pLFxuICAgICAgICBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChfTWFwMi5kZWZhdWx0LCB7XG4gICAgICAgICAgeDogcyxcbiAgICAgICAgICB5OiB2LFxuICAgICAgICAgIG1heDogMTAwLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRCYWNrZ3JvdW5kSHVlKCksXG4gICAgICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlU2F0dXJhdGlvblZhbHVlQ2hhbmdlLFxuICAgICAgICAgIG9uQ29tcGxldGU6IHRoaXMuc2hvd0xhc3RWYWx1ZSxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHJpZ2h0OiAnMi41ZW0nLFxuICAgICAgICAgICAgYm90dG9tOiB0aGlzLnByb3BzLm9wYWNpdHkgPyAnMi41ZW0nIDogJzEuM2VtJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcG9pbnRlclN0eWxlOiB7XG4gICAgICAgICAgICBib3JkZXJDb2xvcjogKDAsIF90aW55Y29sb3IyLmRlZmF1bHQpKHRoaXMuc3RhdGUuY29sb3IpLmlzRGFyaygpID8gXCIjZmZmXCIgOiBcIiMwMDBcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENvbG9yUGlja2VyO1xufShfcmVhY3QuQ29tcG9uZW50KTtcblxuQ29sb3JQaWNrZXIucHJvcFR5cGVzID0ge1xuICBjb2xvcjogX3JlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgb25DaGFuZ2U6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICBvbkNvbXBsZXRlOiBfcmVhY3QuUHJvcFR5cGVzLmZ1bmNcbn07XG5cbkNvbG9yUGlja2VyLmRlZmF1bHRQcm9wcyA9IHtcbiAgY29sb3I6ICdyZ2JhKDAsMCwwLDEpJ1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gQ29sb3JQaWNrZXI7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBkcmFnZ2FibGU7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9yZWFjdERvbSA9IHJlcXVpcmUoJ3JlYWN0LWRvbScpO1xuXG52YXIgX3JlYWN0RG9tMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0RG9tKTtcblxudmFyIF9ob2lzdE5vblJlYWN0U3RhdGljcyA9IHJlcXVpcmUoJ2hvaXN0LW5vbi1yZWFjdC1zdGF0aWNzJyk7XG5cbnZhciBfaG9pc3ROb25SZWFjdFN0YXRpY3MyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaG9pc3ROb25SZWFjdFN0YXRpY3MpO1xuXG52YXIgX3Rocm90dGxlID0gcmVxdWlyZSgnbG9kYXNoL3Rocm90dGxlJyk7XG5cbnZhciBfdGhyb3R0bGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdGhyb3R0bGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xudmFyIGdldERvY3VtZW50ID0gZnVuY3Rpb24gZ2V0RG9jdW1lbnQoZWxlbWVudCkge1xuICByZXR1cm4gZWxlbWVudC5vd25lckRvY3VtZW50O1xufTtcbnZhciBjbGFtcCA9IGZ1bmN0aW9uIGNsYW1wKHZhbCwgbWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbCwgbWluKSwgbWF4KTtcbn07XG52YXIgZ2V0RGlzcGxheU5hbWUgPSBmdW5jdGlvbiBnZXREaXNwbGF5TmFtZShXcmFwcGVkQ29tcG9uZW50KSB7XG4gIHJldHVybiBXcmFwcGVkQ29tcG9uZW50LmRpc3BsYXlOYW1lIHx8IFdyYXBwZWRDb21wb25lbnQubmFtZSB8fCAnQ29tcG9uZW50Jztcbn07XG5cbmZ1bmN0aW9uIGRyYWdnYWJsZSgpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcblxuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZEluRHJhZ2dhYmxlKFdyYXBwZWRDb21wb25lbnQpIHtcbiAgICB2YXIgRHJhZ2dhYmxlID0gZnVuY3Rpb24gKF9Db21wb25lbnQpIHtcbiAgICAgIF9pbmhlcml0cyhEcmFnZ2FibGUsIF9Db21wb25lbnQpO1xuXG4gICAgICBmdW5jdGlvbiBEcmFnZ2FibGUocHJvcHMpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIERyYWdnYWJsZSk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgT2JqZWN0LmdldFByb3RvdHlwZU9mKERyYWdnYWJsZSkuY2FsbCh0aGlzLCBwcm9wcykpO1xuXG4gICAgICAgIF90aGlzLnN0YXRlID0geyBhY3RpdmU6IGZhbHNlIH07XG5cbiAgICAgICAgX3RoaXMudGhyb3R0bGUgPSAoMCwgX3Rocm90dGxlMi5kZWZhdWx0KShmdW5jdGlvbiAoZm4sIGRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gZm4oZGF0YSk7XG4gICAgICAgIH0sIDMwKTtcbiAgICAgICAgX3RoaXMuZ2V0UGVyY2VudGFnZVZhbHVlID0gX3RoaXMuZ2V0UGVyY2VudGFnZVZhbHVlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5zdGFydFVwZGF0ZXMgPSBfdGhpcy5zdGFydFVwZGF0ZXMuYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmhhbmRsZVVwZGF0ZSA9IF90aGlzLmhhbmRsZVVwZGF0ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuc3RvcFVwZGF0ZXMgPSBfdGhpcy5zdG9wVXBkYXRlcy5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuZ2V0UG9zaXRpb24gPSBfdGhpcy5nZXRQb3NpdGlvbi5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuZ2V0U2NhbGVkVmFsdWUgPSBfdGhpcy5nZXRTY2FsZWRWYWx1ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMudXBkYXRlQm91bmRpbmdSZWN0ID0gX3RoaXMudXBkYXRlQm91bmRpbmdSZWN0LmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy51cGRhdGVQb3NpdGlvbiA9IF90aGlzLnVwZGF0ZVBvc2l0aW9uLmJpbmQoX3RoaXMpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICB9XG5cbiAgICAgIF9jcmVhdGVDbGFzcyhEcmFnZ2FibGUsIFt7XG4gICAgICAgIGtleTogJ2NvbXBvbmVudERpZE1vdW50JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgICAgICAgIHRoaXMuZG9jdW1lbnQgPSBnZXREb2N1bWVudChfcmVhY3REb20yLmRlZmF1bHQuZmluZERPTU5vZGUodGhpcykpO1xuICAgICAgICAgIHZhciB3aW5kb3cgPSB0aGlzLndpbmRvdyA9IHRoaXMuZG9jdW1lbnQuZGVmYXVsdFZpZXc7XG5cbiAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCk7XG4gICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QpO1xuXG4gICAgICAgICAgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QoKTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdjb21wb25lbnRXaWxsVW5tb3VudCcsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAgICAgICB2YXIgd2luZG93ID0gdGhpcy53aW5kb3c7XG5cbiAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCk7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy51cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGtleTogJ3N0YXJ0VXBkYXRlcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdGFydFVwZGF0ZXMoZSkge1xuICAgICAgICAgIHZhciBkb2N1bWVudCA9IHRoaXMuZG9jdW1lbnQ7XG5cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICB0aGlzLnVwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5oYW5kbGVVcGRhdGUpO1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5oYW5kbGVVcGRhdGUpO1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuc3RvcFVwZGF0ZXMpO1xuICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCB0aGlzLnN0b3BVcGRhdGVzKTtcblxuICAgICAgICAgIHZhciBfZ2V0UG9zaXRpb24gPSB0aGlzLmdldFBvc2l0aW9uKGUpO1xuXG4gICAgICAgICAgdmFyIHggPSBfZ2V0UG9zaXRpb24ueDtcbiAgICAgICAgICB2YXIgeSA9IF9nZXRQb3NpdGlvbi55O1xuXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKHsgeDogeCwgeTogeSB9KTtcbiAgICAgICAgICAvLyB0aGlzLnRocm90dGxlKHRoaXMudXBkYXRlUG9zaXRpb24sIHsgeCwgeSB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdoYW5kbGVVcGRhdGUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gaGFuZGxlVXBkYXRlKGUpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIF9nZXRQb3NpdGlvbjIgPSB0aGlzLmdldFBvc2l0aW9uKGUpO1xuXG4gICAgICAgICAgICB2YXIgeCA9IF9nZXRQb3NpdGlvbjIueDtcbiAgICAgICAgICAgIHZhciB5ID0gX2dldFBvc2l0aW9uMi55O1xuXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKHsgeDogeCwgeTogeSB9KTtcbiAgICAgICAgICAgIC8vIHRoaXMudGhyb3R0bGUodGhpcy51cGRhdGVQb3NpdGlvbiwgeyB4LCB5IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdzdG9wVXBkYXRlcycsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9wVXBkYXRlcygpIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmUpIHtcbiAgICAgICAgICAgIHZhciBkb2N1bWVudCA9IHRoaXMuZG9jdW1lbnQ7XG5cblxuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLmhhbmRsZVVwZGF0ZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIHRoaXMuaGFuZGxlVXBkYXRlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMuc3RvcFVwZGF0ZXMpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuc3RvcFVwZGF0ZXMpO1xuXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IGZhbHNlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICd1cGRhdGVQb3NpdGlvbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVQb3NpdGlvbihfcmVmKSB7XG4gICAgICAgICAgdmFyIGNsaWVudFggPSBfcmVmLng7XG4gICAgICAgICAgdmFyIGNsaWVudFkgPSBfcmVmLnk7XG4gICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLnN0YXRlLnJlY3Q7XG5cblxuICAgICAgICAgIGlmIChvcHRpb25zLnNpbmdsZSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5wcm9wcy52ZXJ0aWNhbCA/IChyZWN0LmJvdHRvbSAtIGNsaWVudFkpIC8gcmVjdC5oZWlnaHQgOiAoY2xpZW50WCAtIHJlY3QubGVmdCkgLyByZWN0LndpZHRoO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5nZXRTY2FsZWRWYWx1ZSh2YWx1ZSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciB4ID0gKGNsaWVudFggLSByZWN0LmxlZnQpIC8gcmVjdC53aWR0aDtcbiAgICAgICAgICB2YXIgeSA9IChyZWN0LmJvdHRvbSAtIGNsaWVudFkpIC8gcmVjdC5oZWlnaHQ7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5nZXRTY2FsZWRWYWx1ZSh4KSwgdGhpcy5nZXRTY2FsZWRWYWx1ZSh5KSk7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZ2V0UG9zaXRpb24nLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UG9zaXRpb24oZSkge1xuICAgICAgICAgIGlmIChlLnRvdWNoZXMpIHtcbiAgICAgICAgICAgIGUgPSBlLnRvdWNoZXNbMF07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGUuY2xpZW50WCxcbiAgICAgICAgICAgIHk6IGUuY2xpZW50WVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZ2V0UGVyY2VudGFnZVZhbHVlJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBlcmNlbnRhZ2VWYWx1ZSh2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZSAvIHRoaXMucHJvcHMubWF4ICogMTAwICsgXCIlXCI7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAnZ2V0U2NhbGVkVmFsdWUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2NhbGVkVmFsdWUodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gY2xhbXAodmFsdWUsIDAsIDEpICogdGhpcy5wcm9wcy5tYXg7XG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiAndXBkYXRlQm91bmRpbmdSZWN0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICAgICAgICB2YXIgcmVjdCA9IF9yZWFjdERvbTIuZGVmYXVsdC5maW5kRE9NTm9kZSh0aGlzKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVjdDogcmVjdCB9KTtcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBrZXk6ICdyZW5kZXInLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChXcmFwcGVkQ29tcG9uZW50LCBfZXh0ZW5kcyh7fSwgdGhpcy5wcm9wcywgdGhpcy5zdGF0ZSwge1xuICAgICAgICAgICAgc3RhcnRVcGRhdGVzOiB0aGlzLnN0YXJ0VXBkYXRlcyxcbiAgICAgICAgICAgIGdldFBlcmNlbnRhZ2VWYWx1ZTogdGhpcy5nZXRQZXJjZW50YWdlVmFsdWUgfSkpO1xuICAgICAgICB9XG4gICAgICB9XSk7XG5cbiAgICAgIHJldHVybiBEcmFnZ2FibGU7XG4gICAgfShfcmVhY3QuQ29tcG9uZW50KTtcblxuICAgIERyYWdnYWJsZS5kaXNwbGF5TmFtZSA9ICdkcmFnZ2FibGUoJyArIGdldERpc3BsYXlOYW1lKFdyYXBwZWRDb21wb25lbnQpICsgJyknO1xuICAgIERyYWdnYWJsZS5XcmFwcGVkQ29tcG9uZW50ID0gV3JhcHBlZENvbXBvbmVudDtcbiAgICBEcmFnZ2FibGUucHJvcFR5cGVzID0ge1xuICAgICAgb25DaGFuZ2U6IF9yZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgICAgb25Db21wbGV0ZTogX3JlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgICAgbWF4OiBfcmVhY3QuUHJvcFR5cGVzLm51bWJlclxuICAgIH07XG4gICAgRHJhZ2dhYmxlLmRlZmF1bHRQcm9wcyA9IHtcbiAgICAgIG9uQ2hhbmdlOiBub29wLFxuICAgICAgb25Db21wbGV0ZTogbm9vcCxcbiAgICAgIG1heDogMVxuICAgIH07XG5cbiAgICByZXR1cm4gKDAsIF9ob2lzdE5vblJlYWN0U3RhdGljczIuZGVmYXVsdCkoRHJhZ2dhYmxlLCBXcmFwcGVkQ29tcG9uZW50KTtcbiAgfTtcbn0iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9EcmFnZ2FibGUgPSByZXF1aXJlKCcuL0RyYWdnYWJsZScpO1xuXG52YXIgX0RyYWdnYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9EcmFnZ2FibGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBNYXAgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoTWFwLCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBNYXAoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1hcCk7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgT2JqZWN0LmdldFByb3RvdHlwZU9mKE1hcCkuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoTWFwLCBbe1xuICAgIGtleTogJ2dldE1hcFN0eWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldE1hcFN0eWxlcygpIHtcbiAgICAgIHZhciBfTWFwJGRlZmF1bHRTdHlsZXMgPSBNYXAuZGVmYXVsdFN0eWxlcztcbiAgICAgIHZhciBtYXAgPSBfTWFwJGRlZmF1bHRTdHlsZXMubWFwO1xuICAgICAgdmFyIG1hcEFjdGl2ZSA9IF9NYXAkZGVmYXVsdFN0eWxlcy5tYXBBY3RpdmU7XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBtYXAsIHRoaXMucHJvcHMuc3R5bGUgJiYgdGhpcy5wcm9wcy5zdHlsZSwgdGhpcy5wcm9wcy5hY3RpdmUgJiYgbWFwQWN0aXZlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRQb2ludGVyU3R5bGVzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0UG9pbnRlclN0eWxlcygpIHtcbiAgICAgIHZhciBfTWFwJGRlZmF1bHRTdHlsZXMyID0gTWFwLmRlZmF1bHRTdHlsZXM7XG4gICAgICB2YXIgcG9pbnRlciA9IF9NYXAkZGVmYXVsdFN0eWxlczIucG9pbnRlcjtcbiAgICAgIHZhciBwb2ludGVyRGFyayA9IF9NYXAkZGVmYXVsdFN0eWxlczIucG9pbnRlckRhcms7XG4gICAgICB2YXIgcG9pbnRlckxpZ2h0ID0gX01hcCRkZWZhdWx0U3R5bGVzMi5wb2ludGVyTGlnaHQ7XG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwb2ludGVyLCB0aGlzLnByb3BzLnBvaW50ZXJTdHlsZSAmJiB0aGlzLnByb3BzLnBvaW50ZXJTdHlsZSwge1xuICAgICAgICBsZWZ0OiB0aGlzLnByb3BzLmdldFBlcmNlbnRhZ2VWYWx1ZSh0aGlzLnByb3BzLngpLFxuICAgICAgICBib3R0b206IHRoaXMucHJvcHMuZ2V0UGVyY2VudGFnZVZhbHVlKHRoaXMucHJvcHMueSlcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldEJnU3R5bGVzJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QmdTdHlsZXMoKSB7XG4gICAgICB2YXIgYmcgPSBNYXAuZGVmYXVsdFN0eWxlcy5iZztcbiAgICAgIHZhciBiYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnByb3BzLmJhY2tncm91bmRDb2xvcjtcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIGJnLCB7IGJhY2tncm91bmRDb2xvcjogYmFja2dyb3VuZENvbG9yIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlbmRlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBiZ092ZXJsYXkgPSBNYXAuZGVmYXVsdFN0eWxlcy5iZ092ZXJsYXk7XG5cbiAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lLFxuICAgICAgICAgIHN0eWxlOiB0aGlzLmdldE1hcFN0eWxlcygpLFxuICAgICAgICAgIG9uTW91c2VEb3duOiB0aGlzLnByb3BzLnN0YXJ0VXBkYXRlcyxcbiAgICAgICAgICBvblRvdWNoU3RhcnQ6IHRoaXMucHJvcHMuc3RhcnRVcGRhdGVzIH0sXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgICdkaXYnLFxuICAgICAgICAgIHsgY2xhc3NOYW1lOiAnTWFwX19CYWNrZ3JvdW5kJywgc3R5bGU6IHRoaXMuZ2V0QmdTdHlsZXMoKSB9LFxuICAgICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdzcGFuJywgeyBjbGFzc05hbWU6ICdNYXBfX0JhY2tncm91bmRfX292ZXJsYXknLCBzdHlsZTogYmdPdmVybGF5IH0pXG4gICAgICAgICksXG4gICAgICAgIHRoaXMucHJvcHMucmVjdCAmJiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudCgnZGl2JywgeyBjbGFzc05hbWU6ICdNYXBfX1BvaW50ZXInLCBzdHlsZTogdGhpcy5nZXRQb2ludGVyU3R5bGVzKCkgfSlcbiAgICAgICk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1hcDtcbn0oX3JlYWN0LkNvbXBvbmVudCk7XG5cbk1hcC5wcm9wVHlwZXMgPSB7XG4gIHg6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIHk6IF9yZWFjdDIuZGVmYXVsdC5Qcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gIGJhY2tncm91bmRDb2xvcjogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5zdHJpbmcsXG4gIGNsYXNzTmFtZTogX3JlYWN0Mi5kZWZhdWx0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cbk1hcC5kZWZhdWx0UHJvcHMgPSB7XG4gIHg6IDAsXG4gIHk6IDAsXG4gIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgY2xhc3NOYW1lOiAnTWFwJ1xufTtcblxuTWFwLmRlZmF1bHRTdHlsZXMgPSB7XG4gIC8vIE1hcFxuICBtYXA6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIHJpZ2h0OiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgIHVzZXJTZWxlY3Q6ICdub25lJ1xuICB9LFxuICBtYXBBY3RpdmU6IHtcbiAgICBjdXJzb3I6ICdub25lJ1xuICB9LFxuXG4gIC8vIFBvaW50ZXJcbiAgcG9pbnRlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiAxMCxcbiAgICBoZWlnaHQ6IDEwLFxuICAgIG1hcmdpbkxlZnQ6IC01LFxuICAgIG1hcmdpbkJvdHRvbTogLTUsXG4gICAgYm9yZGVyUmFkaXVzOiAnMTAwJScsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkJyxcbiAgICB3aWxsQ2hhbmdlOiAnYXV0bydcbiAgfSxcblxuICAvLyBCYWNrZ3JvdW5kXG4gIGJnOiB7XG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgd2lkdGg6ICcxMDAlJ1xuICB9LFxuICBiZ092ZXJsYXk6IHtcbiAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIGJvdHRvbTogMCxcbiAgICByaWdodDogMCxcbiAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgwLDAsMCwwKSAwJSxyZ2JhKDAsMCwwLDEpIDEwMCUpLFxcbiAgICAgICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKDI1NSwyNTUsMjU1LDEpIDAlLHJnYmEoMjU1LDI1NSwyNTUsMCkgMTAwJSknXG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfRHJhZ2dhYmxlMi5kZWZhdWx0KSgpKE1hcCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2hvcml6b250YWxTbGlkZXI7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbnZhciBfcmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgX3JlYWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3JlYWN0KTtcblxudmFyIF9EcmFnZ2FibGUgPSByZXF1aXJlKCcuL0RyYWdnYWJsZScpO1xuXG52YXIgX0RyYWdnYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9EcmFnZ2FibGUpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihzZWxmLCBjYWxsKSB7IGlmICghc2VsZikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7IH0gcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7IH1cblxuZnVuY3Rpb24gX2luaGVyaXRzKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7IH0gc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7IGNvbnN0cnVjdG9yOiB7IHZhbHVlOiBzdWJDbGFzcywgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUgfSB9KTsgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzOyB9XG5cbnZhciBTbGlkZXIgPSBmdW5jdGlvbiAoX0NvbXBvbmVudCkge1xuICBfaW5oZXJpdHMoU2xpZGVyLCBfQ29tcG9uZW50KTtcblxuICBmdW5jdGlvbiBTbGlkZXIoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNsaWRlcik7XG5cbiAgICByZXR1cm4gX3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgT2JqZWN0LmdldFByb3RvdHlwZU9mKFNsaWRlcikuYXBwbHkodGhpcywgYXJndW1lbnRzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoU2xpZGVyLCBbe1xuICAgIGtleTogJ2dldFBvaW50ZXJTdHlsZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQb2ludGVyU3R5bGVzKCkge1xuICAgICAgdmFyIHBvaW50ZXIgPSBTbGlkZXIuZGVmYXVsdFN0eWxlcy5wb2ludGVyO1xuXG4gICAgICB2YXIgYXR0ciA9IHRoaXMucHJvcHMudmVydGljYWwgPyAnYm90dG9tJyA6ICdsZWZ0JztcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwb2ludGVyLCB0aGlzLnByb3BzLnBvaW50ZXJTdHlsZSAmJiB0aGlzLnByb3BzLnBvaW50ZXJTdHlsZSwgX2RlZmluZVByb3BlcnR5KHt9LCBhdHRyLCB0aGlzLnByb3BzLmdldFBlcmNlbnRhZ2VWYWx1ZSh0aGlzLnByb3BzLnZhbHVlKSkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2dldFNsaWRlclN0eWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFNsaWRlclN0eWxlcygpIHtcbiAgICAgIHZhciBfU2xpZGVyJGRlZmF1bHRTdHlsZXMgPSBTbGlkZXIuZGVmYXVsdFN0eWxlcztcbiAgICAgIHZhciBzbGlkZXIgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMuc2xpZGVyO1xuICAgICAgdmFyIHZlcnRpY2FsU2xpZGVyID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzLnZlcnRpY2FsU2xpZGVyO1xuICAgICAgdmFyIGhvcml6b250YWxTbGlkZXIgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMuaG9yaXpvbnRhbFNsaWRlcjtcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHNsaWRlciwgdGhpcy5wcm9wcy52ZXJ0aWNhbCAmJiB2ZXJ0aWNhbFNsaWRlciwgIXRoaXMucHJvcHMudmVydGljYWwgJiYgaG9yaXpvbnRhbFNsaWRlciwgdGhpcy5wcm9wcy5zdHlsZSAmJiB0aGlzLnByb3BzLnN0eWxlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRUcmFja1N0eWxlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFRyYWNrU3R5bGVzKCkge1xuICAgICAgdmFyIF9TbGlkZXIkZGVmYXVsdFN0eWxlczIgPSBTbGlkZXIuZGVmYXVsdFN0eWxlcztcbiAgICAgIHZhciB0cmFjayA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczIudHJhY2s7XG4gICAgICB2YXIgaG9yaXpvbnRhbFRyYWNrID0gX1NsaWRlciRkZWZhdWx0U3R5bGVzMi5ob3Jpem9udGFsVHJhY2s7XG4gICAgICB2YXIgdmVydGljYWxUcmFjayA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczIudmVydGljYWxUcmFjaztcbiAgICAgIHZhciBvcGFjaXR5VHJhY2sgPSBfU2xpZGVyJGRlZmF1bHRTdHlsZXMyLm9wYWNpdHlUcmFjaztcbiAgICAgIHZhciBodWVUcmFjayA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczIuaHVlVHJhY2s7XG5cbiAgICAgIHZhciBiYWNrZ3JvdW5kID0gdGhpcy5wcm9wcy5iYWNrZ3JvdW5kO1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRyYWNrLCB0aGlzLnByb3BzLnZlcnRpY2FsICYmIHZlcnRpY2FsVHJhY2ssICF0aGlzLnByb3BzLnZlcnRpY2FsICYmIGhvcml6b250YWxUcmFjaywgdGhpcy5wcm9wcy50cmFja1N0eWxlICYmIHRoaXMucHJvcHMudHJhY2tTdHlsZSwgdGhpcy5wcm9wcy5iYWNrZ3JvdW5kICYmIHsgYmFja2dyb3VuZDogdGhpcy5wcm9wcy5iYWNrZ3JvdW5kIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlbmRlcicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgIHZhciBfU2xpZGVyJGRlZmF1bHRTdHlsZXMzID0gU2xpZGVyLmRlZmF1bHRTdHlsZXM7XG4gICAgICB2YXIgb3BhY2l0eVNsaWRlciA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczMub3BhY2l0eVNsaWRlcjtcbiAgICAgIHZhciBvcGFjaXR5U2xpZGVyX190cmFjayA9IF9TbGlkZXIkZGVmYXVsdFN0eWxlczMub3BhY2l0eVNsaWRlcl9fdHJhY2s7XG5cbiAgICAgIHJldHVybiBfcmVhY3QyLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6IHRoaXMucHJvcHMuY2xhc3NOYW1lIHx8ICdTbGlkZXInLFxuICAgICAgICAgIHN0eWxlOiB0aGlzLmdldFNsaWRlclN0eWxlcygpLFxuICAgICAgICAgIG9uTW91c2VEb3duOiB0aGlzLnByb3BzLnN0YXJ0VXBkYXRlcyxcbiAgICAgICAgICBvblRvdWNoU3RhcnQ6IHRoaXMucHJvcHMuc3RhcnRVcGRhdGVzIH0sXG4gICAgICAgIF9yZWFjdDIuZGVmYXVsdC5jcmVhdGVFbGVtZW50KCdkaXYnLCB7IGNsYXNzTmFtZTogJ1NsaWRlcl9fVHJhY2snLCBzdHlsZTogdGhpcy5nZXRUcmFja1N0eWxlcygpIH0pLFxuICAgICAgICB0aGlzLnByb3BzLnJlY3QgJiYgX3JlYWN0Mi5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoJ2RpdicsIHsgY2xhc3NOYW1lOiAnU2xpZGVyX19Qb2ludGVyJywgc3R5bGU6IHRoaXMuZ2V0UG9pbnRlclN0eWxlcygpIH0pXG4gICAgICApO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBTbGlkZXI7XG59KF9yZWFjdC5Db21wb25lbnQpO1xuXG5TbGlkZXIucHJvcFR5cGVzID0ge1xuICB2YWx1ZTogX3JlYWN0LlByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgYmFja2dyb3VuZDogX3JlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn07XG5cblNsaWRlci5kZWZhdWx0UHJvcHMgPSB7XG4gIHZhbHVlOiAwLFxuICBiYWNrZ3JvdW5kOiAnJ1xufTtcblxuU2xpZGVyLmRlZmF1bHRTdHlsZXMgPSB7XG4gIC8vIFNsaWRlclxuICBzbGlkZXI6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB1c2VyU2VsZWN0OiAnbm9uZSdcbiAgfSxcbiAgaG9yaXpvbnRhbFNsaWRlcjogKF9ob3Jpem9udGFsU2xpZGVyID0ge1xuICAgIGhlaWdodDogOCxcbiAgICBsZWZ0OiAwLFxuICAgIHJpZ2h0OiAwXG4gIH0sIF9kZWZpbmVQcm9wZXJ0eShfaG9yaXpvbnRhbFNsaWRlciwgJ2hlaWdodCcsIDEwKSwgX2RlZmluZVByb3BlcnR5KF9ob3Jpem9udGFsU2xpZGVyLCAnY3Vyc29yJywgJ2V3LXJlc2l6ZScpLCBfaG9yaXpvbnRhbFNsaWRlciksXG4gIHZlcnRpY2FsU2xpZGVyOiB7XG4gICAgdG9wOiAwLFxuICAgIGJvdHRvbTogMCxcbiAgICB3aWR0aDogMTAsXG4gICAgY3Vyc29yOiAnbnMtcmVzaXplJ1xuICB9LFxuXG4gIC8vIFRyYWNrXG4gIHRyYWNrOiB7XG4gICAgYmFja2dyb3VuZDogJyNlZmVmZWYnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gIH0sXG4gIGhvcml6b250YWxUcmFjazoge1xuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDBcbiAgfSxcbiAgdmVydGljYWxUcmFjazoge1xuICAgIGJvdHRvbTogMCxcbiAgICB0b3A6IDAsXG4gICAgd2lkdGg6ICcxMDAlJ1xuICB9LFxuXG4gIC8vIFBvaW50ZXJcbiAgcG9pbnRlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGJvdHRvbTogJzUwJScsXG4gICAgbGVmdDogJzUwJScsXG4gICAgd2lkdGg6IDE2LFxuICAgIGhlaWdodDogMTYsXG4gICAgbWFyZ2luTGVmdDogLTgsXG4gICAgbWFyZ2luQm90dG9tOiAtOCxcbiAgICBiYWNrZ3JvdW5kOiAnI2VmZWZlZicsXG4gICAgd2lsbENoYW5nZTogJ2F1dG8nXG4gIH1cbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9ICgwLCBfRHJhZ2dhYmxlMi5kZWZhdWx0KSh7IHNpbmdsZTogdHJ1ZSB9KShTbGlkZXIpOyIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuTWFwID0gZXhwb3J0cy5TbGlkZXIgPSB1bmRlZmluZWQ7XG5cbnZhciBfQ29sb3JQaWNrZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ29sb3JQaWNrZXInKTtcblxudmFyIF9Db2xvclBpY2tlcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Db2xvclBpY2tlcik7XG5cbnZhciBfU2xpZGVyMiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9TbGlkZXInKTtcblxudmFyIF9TbGlkZXIzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU2xpZGVyMik7XG5cbnZhciBfTWFwMiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9NYXAnKTtcblxudmFyIF9NYXAzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfTWFwMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuU2xpZGVyID0gX1NsaWRlcjMuZGVmYXVsdDtcbmV4cG9ydHMuTWFwID0gX01hcDMuZGVmYXVsdDtcbmV4cG9ydHMuZGVmYXVsdCA9IF9Db2xvclBpY2tlcjIuZGVmYXVsdDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBZYWhvbyEgSW5jLlxuICogQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTmV3IEJTRCBMaWNlbnNlLiBTZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSRUFDVF9TVEFUSUNTID0ge1xuICAgIGNoaWxkQ29udGV4dFR5cGVzOiB0cnVlLFxuICAgIGNvbnRleHRUeXBlczogdHJ1ZSxcbiAgICBkZWZhdWx0UHJvcHM6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IHRydWUsXG4gICAgZ2V0RGVmYXVsdFByb3BzOiB0cnVlLFxuICAgIG1peGluczogdHJ1ZSxcbiAgICBwcm9wVHlwZXM6IHRydWUsXG4gICAgdHlwZTogdHJ1ZVxufTtcblxudmFyIEtOT1dOX1NUQVRJQ1MgPSB7XG4gICAgbmFtZTogdHJ1ZSxcbiAgICBsZW5ndGg6IHRydWUsXG4gICAgcHJvdG90eXBlOiB0cnVlLFxuICAgIGNhbGxlcjogdHJ1ZSxcbiAgICBhcmd1bWVudHM6IHRydWUsXG4gICAgYXJpdHk6IHRydWVcbn07XG5cbnZhciBpc0dldE93blByb3BlcnR5U3ltYm9sc0F2YWlsYWJsZSA9IHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSAnZnVuY3Rpb24nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhvaXN0Tm9uUmVhY3RTdGF0aWNzKHRhcmdldENvbXBvbmVudCwgc291cmNlQ29tcG9uZW50LCBjdXN0b21TdGF0aWNzKSB7XG4gICAgaWYgKHR5cGVvZiBzb3VyY2VDb21wb25lbnQgIT09ICdzdHJpbmcnKSB7IC8vIGRvbid0IGhvaXN0IG92ZXIgc3RyaW5nIChodG1sKSBjb21wb25lbnRzXG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlQ29tcG9uZW50KTtcblxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgICBpZiAoaXNHZXRPd25Qcm9wZXJ0eVN5bWJvbHNBdmFpbGFibGUpIHtcbiAgICAgICAgICAgIGtleXMgPSBrZXlzLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNvdXJjZUNvbXBvbmVudCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAoIVJFQUNUX1NUQVRJQ1Nba2V5c1tpXV0gJiYgIUtOT1dOX1NUQVRJQ1Nba2V5c1tpXV0gJiYgKCFjdXN0b21TdGF0aWNzIHx8ICFjdXN0b21TdGF0aWNzW2tleXNbaV1dKSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldENvbXBvbmVudFtrZXlzW2ldXSA9IHNvdXJjZUNvbXBvbmVudFtrZXlzW2ldXTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldENvbXBvbmVudDtcbn07XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi9ub3cnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuIiwidmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9kZWJvdW5jZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgb25seSBpbnZva2VzIGBmdW5jYCBhdCBtb3N0IG9uY2UgcGVyXG4gKiBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBUaGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYFxuICogbWV0aG9kIHRvIGNhbmNlbCBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0b1xuICogaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgXG4gKiBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgXG4gKiB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWQgd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlXG4gKiB0aHJvdHRsZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiByZXR1cm4gdGhlXG4gKiByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8udGhyb3R0bGVgIGFuZCBgXy5kZWJvdW5jZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB0aHJvdHRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBpbnZvY2F0aW9ucyB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmcuXG4gKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKSk7XG4gKlxuICogLy8gSW52b2tlIGByZW5ld1Rva2VuYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgYnV0IG5vdCBtb3JlIHRoYW4gb25jZSBldmVyeSA1IG1pbnV0ZXMuXG4gKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHsgJ3RyYWlsaW5nJzogZmFsc2UgfSk7XG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgdGhyb3R0bGVkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIHRocm90dGxlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgdGhyb3R0bGVkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAnbGVhZGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIHJldHVybiBkZWJvdW5jZShmdW5jLCB3YWl0LCB7XG4gICAgJ2xlYWRpbmcnOiBsZWFkaW5nLFxuICAgICdtYXhXYWl0Jzogd2FpdCxcbiAgICAndHJhaWxpbmcnOiB0cmFpbGluZ1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwiLy8gVGlueUNvbG9yIHYxLjQuMVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jncmlucy9UaW55Q29sb3Jcbi8vIEJyaWFuIEdyaW5zdGVhZCwgTUlUIExpY2Vuc2VcblxuKGZ1bmN0aW9uKE1hdGgpIHtcblxudmFyIHRyaW1MZWZ0ID0gL15cXHMrLyxcbiAgICB0cmltUmlnaHQgPSAvXFxzKyQvLFxuICAgIHRpbnlDb3VudGVyID0gMCxcbiAgICBtYXRoUm91bmQgPSBNYXRoLnJvdW5kLFxuICAgIG1hdGhNaW4gPSBNYXRoLm1pbixcbiAgICBtYXRoTWF4ID0gTWF0aC5tYXgsXG4gICAgbWF0aFJhbmRvbSA9IE1hdGgucmFuZG9tO1xuXG5mdW5jdGlvbiB0aW55Y29sb3IgKGNvbG9yLCBvcHRzKSB7XG5cbiAgICBjb2xvciA9IChjb2xvcikgPyBjb2xvciA6ICcnO1xuICAgIG9wdHMgPSBvcHRzIHx8IHsgfTtcblxuICAgIC8vIElmIGlucHV0IGlzIGFscmVhZHkgYSB0aW55Y29sb3IsIHJldHVybiBpdHNlbGZcbiAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiB0aW55Y29sb3IpIHtcbiAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuICAgIC8vIElmIHdlIGFyZSBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgY2FsbCB1c2luZyBuZXcgaW5zdGVhZFxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiB0aW55Y29sb3IpKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGlueWNvbG9yKGNvbG9yLCBvcHRzKTtcbiAgICB9XG5cbiAgICB2YXIgcmdiID0gaW5wdXRUb1JHQihjb2xvcik7XG4gICAgdGhpcy5fb3JpZ2luYWxJbnB1dCA9IGNvbG9yLFxuICAgIHRoaXMuX3IgPSByZ2IucixcbiAgICB0aGlzLl9nID0gcmdiLmcsXG4gICAgdGhpcy5fYiA9IHJnYi5iLFxuICAgIHRoaXMuX2EgPSByZ2IuYSxcbiAgICB0aGlzLl9yb3VuZEEgPSBtYXRoUm91bmQoMTAwKnRoaXMuX2EpIC8gMTAwLFxuICAgIHRoaXMuX2Zvcm1hdCA9IG9wdHMuZm9ybWF0IHx8IHJnYi5mb3JtYXQ7XG4gICAgdGhpcy5fZ3JhZGllbnRUeXBlID0gb3B0cy5ncmFkaWVudFR5cGU7XG5cbiAgICAvLyBEb24ndCBsZXQgdGhlIHJhbmdlIG9mIFswLDI1NV0gY29tZSBiYWNrIGluIFswLDFdLlxuICAgIC8vIFBvdGVudGlhbGx5IGxvc2UgYSBsaXR0bGUgYml0IG9mIHByZWNpc2lvbiBoZXJlLCBidXQgd2lsbCBmaXggaXNzdWVzIHdoZXJlXG4gICAgLy8gLjUgZ2V0cyBpbnRlcnByZXRlZCBhcyBoYWxmIG9mIHRoZSB0b3RhbCwgaW5zdGVhZCBvZiBoYWxmIG9mIDFcbiAgICAvLyBJZiBpdCB3YXMgc3VwcG9zZWQgdG8gYmUgMTI4LCB0aGlzIHdhcyBhbHJlYWR5IHRha2VuIGNhcmUgb2YgYnkgYGlucHV0VG9SZ2JgXG4gICAgaWYgKHRoaXMuX3IgPCAxKSB7IHRoaXMuX3IgPSBtYXRoUm91bmQodGhpcy5fcik7IH1cbiAgICBpZiAodGhpcy5fZyA8IDEpIHsgdGhpcy5fZyA9IG1hdGhSb3VuZCh0aGlzLl9nKTsgfVxuICAgIGlmICh0aGlzLl9iIDwgMSkgeyB0aGlzLl9iID0gbWF0aFJvdW5kKHRoaXMuX2IpOyB9XG5cbiAgICB0aGlzLl9vayA9IHJnYi5vaztcbiAgICB0aGlzLl90Y19pZCA9IHRpbnlDb3VudGVyKys7XG59XG5cbnRpbnljb2xvci5wcm90b3R5cGUgPSB7XG4gICAgaXNEYXJrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QnJpZ2h0bmVzcygpIDwgMTI4O1xuICAgIH0sXG4gICAgaXNMaWdodDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc0RhcmsoKTtcbiAgICB9LFxuICAgIGlzVmFsaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2s7XG4gICAgfSxcbiAgICBnZXRPcmlnaW5hbElucHV0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcmlnaW5hbElucHV0O1xuICAgIH0sXG4gICAgZ2V0Rm9ybWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zvcm1hdDtcbiAgICB9LFxuICAgIGdldEFscGhhOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2E7XG4gICAgfSxcbiAgICBnZXRCcmlnaHRuZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy9odHRwOi8vd3d3LnczLm9yZy9UUi9BRVJUI2NvbG9yLWNvbnRyYXN0XG4gICAgICAgIHZhciByZ2IgPSB0aGlzLnRvUmdiKCk7XG4gICAgICAgIHJldHVybiAocmdiLnIgKiAyOTkgKyByZ2IuZyAqIDU4NyArIHJnYi5iICogMTE0KSAvIDEwMDA7XG4gICAgfSxcbiAgICBnZXRMdW1pbmFuY2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL2h0dHA6Ly93d3cudzMub3JnL1RSLzIwMDgvUkVDLVdDQUcyMC0yMDA4MTIxMS8jcmVsYXRpdmVsdW1pbmFuY2VkZWZcbiAgICAgICAgdmFyIHJnYiA9IHRoaXMudG9SZ2IoKTtcbiAgICAgICAgdmFyIFJzUkdCLCBHc1JHQiwgQnNSR0IsIFIsIEcsIEI7XG4gICAgICAgIFJzUkdCID0gcmdiLnIvMjU1O1xuICAgICAgICBHc1JHQiA9IHJnYi5nLzI1NTtcbiAgICAgICAgQnNSR0IgPSByZ2IuYi8yNTU7XG5cbiAgICAgICAgaWYgKFJzUkdCIDw9IDAuMDM5MjgpIHtSID0gUnNSR0IgLyAxMi45Mjt9IGVsc2Uge1IgPSBNYXRoLnBvdygoKFJzUkdCICsgMC4wNTUpIC8gMS4wNTUpLCAyLjQpO31cbiAgICAgICAgaWYgKEdzUkdCIDw9IDAuMDM5MjgpIHtHID0gR3NSR0IgLyAxMi45Mjt9IGVsc2Uge0cgPSBNYXRoLnBvdygoKEdzUkdCICsgMC4wNTUpIC8gMS4wNTUpLCAyLjQpO31cbiAgICAgICAgaWYgKEJzUkdCIDw9IDAuMDM5MjgpIHtCID0gQnNSR0IgLyAxMi45Mjt9IGVsc2Uge0IgPSBNYXRoLnBvdygoKEJzUkdCICsgMC4wNTUpIC8gMS4wNTUpLCAyLjQpO31cbiAgICAgICAgcmV0dXJuICgwLjIxMjYgKiBSKSArICgwLjcxNTIgKiBHKSArICgwLjA3MjIgKiBCKTtcbiAgICB9LFxuICAgIHNldEFscGhhOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB0aGlzLl9hID0gYm91bmRBbHBoYSh2YWx1ZSk7XG4gICAgICAgIHRoaXMuX3JvdW5kQSA9IG1hdGhSb3VuZCgxMDAqdGhpcy5fYSkgLyAxMDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdG9Ic3Y6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHN2ID0gcmdiVG9Ic3YodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHJldHVybiB7IGg6IGhzdi5oICogMzYwLCBzOiBoc3YucywgdjogaHN2LnYsIGE6IHRoaXMuX2EgfTtcbiAgICB9LFxuICAgIHRvSHN2U3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhzdiA9IHJnYlRvSHN2KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IpO1xuICAgICAgICB2YXIgaCA9IG1hdGhSb3VuZChoc3YuaCAqIDM2MCksIHMgPSBtYXRoUm91bmQoaHN2LnMgKiAxMDApLCB2ID0gbWF0aFJvdW5kKGhzdi52ICogMTAwKTtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcImhzdihcIiAgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyB2ICsgXCIlKVwiIDpcbiAgICAgICAgICBcImhzdmEoXCIgKyBoICsgXCIsIFwiICsgcyArIFwiJSwgXCIgKyB2ICsgXCIlLCBcIisgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b0hzbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBoc2wgPSByZ2JUb0hzbCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iKTtcbiAgICAgICAgcmV0dXJuIHsgaDogaHNsLmggKiAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9Ic2xTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHNsID0gcmdiVG9Ic2wodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYik7XG4gICAgICAgIHZhciBoID0gbWF0aFJvdW5kKGhzbC5oICogMzYwKSwgcyA9IG1hdGhSb3VuZChoc2wucyAqIDEwMCksIGwgPSBtYXRoUm91bmQoaHNsLmwgKiAxMDApO1xuICAgICAgICByZXR1cm4gKHRoaXMuX2EgPT0gMSkgP1xuICAgICAgICAgIFwiaHNsKFwiICArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIGwgKyBcIiUpXCIgOlxuICAgICAgICAgIFwiaHNsYShcIiArIGggKyBcIiwgXCIgKyBzICsgXCIlLCBcIiArIGwgKyBcIiUsIFwiKyB0aGlzLl9yb3VuZEEgKyBcIilcIjtcbiAgICB9LFxuICAgIHRvSGV4OiBmdW5jdGlvbihhbGxvdzNDaGFyKSB7XG4gICAgICAgIHJldHVybiByZ2JUb0hleCh0aGlzLl9yLCB0aGlzLl9nLCB0aGlzLl9iLCBhbGxvdzNDaGFyKTtcbiAgICB9LFxuICAgIHRvSGV4U3RyaW5nOiBmdW5jdGlvbihhbGxvdzNDaGFyKSB7XG4gICAgICAgIHJldHVybiAnIycgKyB0aGlzLnRvSGV4KGFsbG93M0NoYXIpO1xuICAgIH0sXG4gICAgdG9IZXg4OiBmdW5jdGlvbihhbGxvdzRDaGFyKSB7XG4gICAgICAgIHJldHVybiByZ2JhVG9IZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgdGhpcy5fYSwgYWxsb3c0Q2hhcik7XG4gICAgfSxcbiAgICB0b0hleDhTdHJpbmc6IGZ1bmN0aW9uKGFsbG93NENoYXIpIHtcbiAgICAgICAgcmV0dXJuICcjJyArIHRoaXMudG9IZXg4KGFsbG93NENoYXIpO1xuICAgIH0sXG4gICAgdG9SZ2I6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4geyByOiBtYXRoUm91bmQodGhpcy5fciksIGc6IG1hdGhSb3VuZCh0aGlzLl9nKSwgYjogbWF0aFJvdW5kKHRoaXMuX2IpLCBhOiB0aGlzLl9hIH07XG4gICAgfSxcbiAgICB0b1JnYlN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fYSA9PSAxKSA/XG4gICAgICAgICAgXCJyZ2IoXCIgICsgbWF0aFJvdW5kKHRoaXMuX3IpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2cpICsgXCIsIFwiICsgbWF0aFJvdW5kKHRoaXMuX2IpICsgXCIpXCIgOlxuICAgICAgICAgIFwicmdiYShcIiArIG1hdGhSb3VuZCh0aGlzLl9yKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9nKSArIFwiLCBcIiArIG1hdGhSb3VuZCh0aGlzLl9iKSArIFwiLCBcIiArIHRoaXMuX3JvdW5kQSArIFwiKVwiO1xuICAgIH0sXG4gICAgdG9QZXJjZW50YWdlUmdiOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fciwgMjU1KSAqIDEwMCkgKyBcIiVcIiwgZzogbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fZywgMjU1KSAqIDEwMCkgKyBcIiVcIiwgYjogbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fYiwgMjU1KSAqIDEwMCkgKyBcIiVcIiwgYTogdGhpcy5fYSB9O1xuICAgIH0sXG4gICAgdG9QZXJjZW50YWdlUmdiU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl9hID09IDEpID9cbiAgICAgICAgICBcInJnYihcIiAgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9yLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9nLCAyNTUpICogMTAwKSArIFwiJSwgXCIgKyBtYXRoUm91bmQoYm91bmQwMSh0aGlzLl9iLCAyNTUpICogMTAwKSArIFwiJSlcIiA6XG4gICAgICAgICAgXCJyZ2JhKFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fciwgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fZywgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgbWF0aFJvdW5kKGJvdW5kMDEodGhpcy5fYiwgMjU1KSAqIDEwMCkgKyBcIiUsIFwiICsgdGhpcy5fcm91bmRBICsgXCIpXCI7XG4gICAgfSxcbiAgICB0b05hbWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNwYXJlbnRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9hIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhleE5hbWVzW3JnYlRvSGV4KHRoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRydWUpXSB8fCBmYWxzZTtcbiAgICB9LFxuICAgIHRvRmlsdGVyOiBmdW5jdGlvbihzZWNvbmRDb2xvcikge1xuICAgICAgICB2YXIgaGV4OFN0cmluZyA9ICcjJyArIHJnYmFUb0FyZ2JIZXgodGhpcy5fciwgdGhpcy5fZywgdGhpcy5fYiwgdGhpcy5fYSk7XG4gICAgICAgIHZhciBzZWNvbmRIZXg4U3RyaW5nID0gaGV4OFN0cmluZztcbiAgICAgICAgdmFyIGdyYWRpZW50VHlwZSA9IHRoaXMuX2dyYWRpZW50VHlwZSA/IFwiR3JhZGllbnRUeXBlID0gMSwgXCIgOiBcIlwiO1xuXG4gICAgICAgIGlmIChzZWNvbmRDb2xvcikge1xuICAgICAgICAgICAgdmFyIHMgPSB0aW55Y29sb3Ioc2Vjb25kQ29sb3IpO1xuICAgICAgICAgICAgc2Vjb25kSGV4OFN0cmluZyA9ICcjJyArIHJnYmFUb0FyZ2JIZXgocy5fciwgcy5fZywgcy5fYiwgcy5fYSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXCJwcm9naWQ6RFhJbWFnZVRyYW5zZm9ybS5NaWNyb3NvZnQuZ3JhZGllbnQoXCIrZ3JhZGllbnRUeXBlK1wic3RhcnRDb2xvcnN0cj1cIitoZXg4U3RyaW5nK1wiLGVuZENvbG9yc3RyPVwiK3NlY29uZEhleDhTdHJpbmcrXCIpXCI7XG4gICAgfSxcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBmb3JtYXRTZXQgPSAhIWZvcm1hdDtcbiAgICAgICAgZm9ybWF0ID0gZm9ybWF0IHx8IHRoaXMuX2Zvcm1hdDtcblxuICAgICAgICB2YXIgZm9ybWF0dGVkU3RyaW5nID0gZmFsc2U7XG4gICAgICAgIHZhciBoYXNBbHBoYSA9IHRoaXMuX2EgPCAxICYmIHRoaXMuX2EgPj0gMDtcbiAgICAgICAgdmFyIG5lZWRzQWxwaGFGb3JtYXQgPSAhZm9ybWF0U2V0ICYmIGhhc0FscGhhICYmIChmb3JtYXQgPT09IFwiaGV4XCIgfHwgZm9ybWF0ID09PSBcImhleDZcIiB8fCBmb3JtYXQgPT09IFwiaGV4M1wiIHx8IGZvcm1hdCA9PT0gXCJoZXg0XCIgfHwgZm9ybWF0ID09PSBcImhleDhcIiB8fCBmb3JtYXQgPT09IFwibmFtZVwiKTtcblxuICAgICAgICBpZiAobmVlZHNBbHBoYUZvcm1hdCkge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBjYXNlIGZvciBcInRyYW5zcGFyZW50XCIsIGFsbCBvdGhlciBub24tYWxwaGEgZm9ybWF0c1xuICAgICAgICAgICAgLy8gd2lsbCByZXR1cm4gcmdiYSB3aGVuIHRoZXJlIGlzIHRyYW5zcGFyZW5jeS5cbiAgICAgICAgICAgIGlmIChmb3JtYXQgPT09IFwibmFtZVwiICYmIHRoaXMuX2EgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b05hbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvUmdiU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJyZ2JcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b1JnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwicHJnYlwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvUGVyY2VudGFnZVJnYlN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4XCIgfHwgZm9ybWF0ID09PSBcImhleDZcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleFN0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4M1wiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4U3RyaW5nKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JtYXQgPT09IFwiaGV4NFwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSGV4OFN0cmluZyh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhleDhcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hleDhTdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcIm5hbWVcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b05hbWUoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9ybWF0ID09PSBcImhzbFwiKSB7XG4gICAgICAgICAgICBmb3JtYXR0ZWRTdHJpbmcgPSB0aGlzLnRvSHNsU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gXCJoc3ZcIikge1xuICAgICAgICAgICAgZm9ybWF0dGVkU3RyaW5nID0gdGhpcy50b0hzdlN0cmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFN0cmluZyB8fCB0aGlzLnRvSGV4U3RyaW5nKCk7XG4gICAgfSxcbiAgICBjbG9uZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aW55Y29sb3IodGhpcy50b1N0cmluZygpKTtcbiAgICB9LFxuXG4gICAgX2FwcGx5TW9kaWZpY2F0aW9uOiBmdW5jdGlvbihmbiwgYXJncykge1xuICAgICAgICB2YXIgY29sb3IgPSBmbi5hcHBseShudWxsLCBbdGhpc10uY29uY2F0KFtdLnNsaWNlLmNhbGwoYXJncykpKTtcbiAgICAgICAgdGhpcy5fciA9IGNvbG9yLl9yO1xuICAgICAgICB0aGlzLl9nID0gY29sb3IuX2c7XG4gICAgICAgIHRoaXMuX2IgPSBjb2xvci5fYjtcbiAgICAgICAgdGhpcy5zZXRBbHBoYShjb2xvci5fYSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgbGlnaHRlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihsaWdodGVuLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgYnJpZ2h0ZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oYnJpZ2h0ZW4sIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBkYXJrZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oZGFya2VuLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgZGVzYXR1cmF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihkZXNhdHVyYXRlLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc2F0dXJhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oc2F0dXJhdGUsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBncmV5c2NhbGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlNb2RpZmljYXRpb24oZ3JleXNjYWxlLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgc3BpbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseU1vZGlmaWNhdGlvbihzcGluLCBhcmd1bWVudHMpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlDb21iaW5hdGlvbjogZnVuY3Rpb24oZm4sIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIFt0aGlzXS5jb25jYXQoW10uc2xpY2UuY2FsbChhcmdzKSkpO1xuICAgIH0sXG4gICAgYW5hbG9nb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24oYW5hbG9nb3VzLCBhcmd1bWVudHMpO1xuICAgIH0sXG4gICAgY29tcGxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKGNvbXBsZW1lbnQsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICBtb25vY2hyb21hdGljOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24obW9ub2Nocm9tYXRpYywgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHNwbGl0Y29tcGxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBseUNvbWJpbmF0aW9uKHNwbGl0Y29tcGxlbWVudCwgYXJndW1lbnRzKTtcbiAgICB9LFxuICAgIHRyaWFkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGx5Q29tYmluYXRpb24odHJpYWQsIGFyZ3VtZW50cyk7XG4gICAgfSxcbiAgICB0ZXRyYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbHlDb21iaW5hdGlvbih0ZXRyYWQsIGFyZ3VtZW50cyk7XG4gICAgfVxufTtcblxuLy8gSWYgaW5wdXQgaXMgYW4gb2JqZWN0LCBmb3JjZSAxIGludG8gXCIxLjBcIiB0byBoYW5kbGUgcmF0aW9zIHByb3Blcmx5XG4vLyBTdHJpbmcgaW5wdXQgcmVxdWlyZXMgXCIxLjBcIiBhcyBpbnB1dCwgc28gMSB3aWxsIGJlIHRyZWF0ZWQgYXMgMVxudGlueWNvbG9yLmZyb21SYXRpbyA9IGZ1bmN0aW9uKGNvbG9yLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHZhciBuZXdDb2xvciA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpIGluIGNvbG9yKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gXCJhXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3Q29sb3JbaV0gPSBjb2xvcltpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0NvbG9yW2ldID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvcltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbG9yID0gbmV3Q29sb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRpbnljb2xvcihjb2xvciwgb3B0cyk7XG59O1xuXG4vLyBHaXZlbiBhIHN0cmluZyBvciBvYmplY3QsIGNvbnZlcnQgdGhhdCBpbnB1dCB0byBSR0Jcbi8vIFBvc3NpYmxlIHN0cmluZyBpbnB1dHM6XG4vL1xuLy8gICAgIFwicmVkXCJcbi8vICAgICBcIiNmMDBcIiBvciBcImYwMFwiXG4vLyAgICAgXCIjZmYwMDAwXCIgb3IgXCJmZjAwMDBcIlxuLy8gICAgIFwiI2ZmMDAwMDAwXCIgb3IgXCJmZjAwMDAwMFwiXG4vLyAgICAgXCJyZ2IgMjU1IDAgMFwiIG9yIFwicmdiICgyNTUsIDAsIDApXCJcbi8vICAgICBcInJnYiAxLjAgMCAwXCIgb3IgXCJyZ2IgKDEsIDAsIDApXCJcbi8vICAgICBcInJnYmEgKDI1NSwgMCwgMCwgMSlcIiBvciBcInJnYmEgMjU1LCAwLCAwLCAxXCJcbi8vICAgICBcInJnYmEgKDEuMCwgMCwgMCwgMSlcIiBvciBcInJnYmEgMS4wLCAwLCAwLCAxXCJcbi8vICAgICBcImhzbCgwLCAxMDAlLCA1MCUpXCIgb3IgXCJoc2wgMCAxMDAlIDUwJVwiXG4vLyAgICAgXCJoc2xhKDAsIDEwMCUsIDUwJSwgMSlcIiBvciBcImhzbGEgMCAxMDAlIDUwJSwgMVwiXG4vLyAgICAgXCJoc3YoMCwgMTAwJSwgMTAwJSlcIiBvciBcImhzdiAwIDEwMCUgMTAwJVwiXG4vL1xuZnVuY3Rpb24gaW5wdXRUb1JHQihjb2xvcikge1xuXG4gICAgdmFyIHJnYiA9IHsgcjogMCwgZzogMCwgYjogMCB9O1xuICAgIHZhciBhID0gMTtcbiAgICB2YXIgcyA9IG51bGw7XG4gICAgdmFyIHYgPSBudWxsO1xuICAgIHZhciBsID0gbnVsbDtcbiAgICB2YXIgb2sgPSBmYWxzZTtcbiAgICB2YXIgZm9ybWF0ID0gZmFsc2U7XG5cbiAgICBpZiAodHlwZW9mIGNvbG9yID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgY29sb3IgPSBzdHJpbmdJbnB1dFRvT2JqZWN0KGNvbG9yKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbG9yID09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKGlzVmFsaWRDU1NVbml0KGNvbG9yLnIpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLmcpICYmIGlzVmFsaWRDU1NVbml0KGNvbG9yLmIpKSB7XG4gICAgICAgICAgICByZ2IgPSByZ2JUb1JnYihjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKTtcbiAgICAgICAgICAgIG9rID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcm1hdCA9IFN0cmluZyhjb2xvci5yKS5zdWJzdHIoLTEpID09PSBcIiVcIiA/IFwicHJnYlwiIDogXCJyZ2JcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1ZhbGlkQ1NTVW5pdChjb2xvci5oKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5zKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci52KSkge1xuICAgICAgICAgICAgcyA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iucyk7XG4gICAgICAgICAgICB2ID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci52KTtcbiAgICAgICAgICAgIHJnYiA9IGhzdlRvUmdiKGNvbG9yLmgsIHMsIHYpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gXCJoc3ZcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1ZhbGlkQ1NTVW5pdChjb2xvci5oKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5zKSAmJiBpc1ZhbGlkQ1NTVW5pdChjb2xvci5sKSkge1xuICAgICAgICAgICAgcyA9IGNvbnZlcnRUb1BlcmNlbnRhZ2UoY29sb3Iucyk7XG4gICAgICAgICAgICBsID0gY29udmVydFRvUGVyY2VudGFnZShjb2xvci5sKTtcbiAgICAgICAgICAgIHJnYiA9IGhzbFRvUmdiKGNvbG9yLmgsIHMsIGwpO1xuICAgICAgICAgICAgb2sgPSB0cnVlO1xuICAgICAgICAgICAgZm9ybWF0ID0gXCJoc2xcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb2xvci5oYXNPd25Qcm9wZXJ0eShcImFcIikpIHtcbiAgICAgICAgICAgIGEgPSBjb2xvci5hO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYSA9IGJvdW5kQWxwaGEoYSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBvazogb2ssXG4gICAgICAgIGZvcm1hdDogY29sb3IuZm9ybWF0IHx8IGZvcm1hdCxcbiAgICAgICAgcjogbWF0aE1pbigyNTUsIG1hdGhNYXgocmdiLnIsIDApKSxcbiAgICAgICAgZzogbWF0aE1pbigyNTUsIG1hdGhNYXgocmdiLmcsIDApKSxcbiAgICAgICAgYjogbWF0aE1pbigyNTUsIG1hdGhNYXgocmdiLmIsIDApKSxcbiAgICAgICAgYTogYVxuICAgIH07XG59XG5cblxuLy8gQ29udmVyc2lvbiBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIGByZ2JUb0hzbGAsIGByZ2JUb0hzdmAsIGBoc2xUb1JnYmAsIGBoc3ZUb1JnYmAgbW9kaWZpZWQgZnJvbTpcbi8vIDxodHRwOi8vbWppamFja3Nvbi5jb20vMjAwOC8wMi9yZ2ItdG8taHNsLWFuZC1yZ2ItdG8taHN2LWNvbG9yLW1vZGVsLWNvbnZlcnNpb24tYWxnb3JpdGhtcy1pbi1qYXZhc2NyaXB0PlxuXG4vLyBgcmdiVG9SZ2JgXG4vLyBIYW5kbGUgYm91bmRzIC8gcGVyY2VudGFnZSBjaGVja2luZyB0byBjb25mb3JtIHRvIENTUyBjb2xvciBzcGVjXG4vLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy1jb2xvci8+XG4vLyAqQXNzdW1lczoqIHIsIGcsIGIgaW4gWzAsIDI1NV0gb3IgWzAsIDFdXG4vLyAqUmV0dXJuczoqIHsgciwgZywgYiB9IGluIFswLCAyNTVdXG5mdW5jdGlvbiByZ2JUb1JnYihyLCBnLCBiKXtcbiAgICByZXR1cm4ge1xuICAgICAgICByOiBib3VuZDAxKHIsIDI1NSkgKiAyNTUsXG4gICAgICAgIGc6IGJvdW5kMDEoZywgMjU1KSAqIDI1NSxcbiAgICAgICAgYjogYm91bmQwMShiLCAyNTUpICogMjU1XG4gICAgfTtcbn1cblxuLy8gYHJnYlRvSHNsYFxuLy8gQ29udmVydHMgYW4gUkdCIGNvbG9yIHZhbHVlIHRvIEhTTC5cbi8vICpBc3N1bWVzOiogciwgZywgYW5kIGIgYXJlIGNvbnRhaW5lZCBpbiBbMCwgMjU1XSBvciBbMCwgMV1cbi8vICpSZXR1cm5zOiogeyBoLCBzLCBsIH0gaW4gWzAsMV1cbmZ1bmN0aW9uIHJnYlRvSHNsKHIsIGcsIGIpIHtcblxuICAgIHIgPSBib3VuZDAxKHIsIDI1NSk7XG4gICAgZyA9IGJvdW5kMDEoZywgMjU1KTtcbiAgICBiID0gYm91bmQwMShiLCAyNTUpO1xuXG4gICAgdmFyIG1heCA9IG1hdGhNYXgociwgZywgYiksIG1pbiA9IG1hdGhNaW4ociwgZywgYik7XG4gICAgdmFyIGgsIHMsIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cbiAgICBpZihtYXggPT0gbWluKSB7XG4gICAgICAgIGggPSBzID0gMDsgLy8gYWNocm9tYXRpY1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGQgPSBtYXggLSBtaW47XG4gICAgICAgIHMgPSBsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKTtcbiAgICAgICAgc3dpdGNoKG1heCkge1xuICAgICAgICAgICAgY2FzZSByOiBoID0gKGcgLSBiKSAvIGQgKyAoZyA8IGIgPyA2IDogMCk7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgYjogaCA9IChyIC0gZykgLyBkICsgNDsgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBoIC89IDY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgaDogaCwgczogcywgbDogbCB9O1xufVxuXG4vLyBgaHNsVG9SZ2JgXG4vLyBDb252ZXJ0cyBhbiBIU0wgY29sb3IgdmFsdWUgdG8gUkdCLlxuLy8gKkFzc3VtZXM6KiBoIGlzIGNvbnRhaW5lZCBpbiBbMCwgMV0gb3IgWzAsIDM2MF0gYW5kIHMgYW5kIGwgYXJlIGNvbnRhaW5lZCBbMCwgMV0gb3IgWzAsIDEwMF1cbi8vICpSZXR1cm5zOiogeyByLCBnLCBiIH0gaW4gdGhlIHNldCBbMCwgMjU1XVxuZnVuY3Rpb24gaHNsVG9SZ2IoaCwgcywgbCkge1xuICAgIHZhciByLCBnLCBiO1xuXG4gICAgaCA9IGJvdW5kMDEoaCwgMzYwKTtcbiAgICBzID0gYm91bmQwMShzLCAxMDApO1xuICAgIGwgPSBib3VuZDAxKGwsIDEwMCk7XG5cbiAgICBmdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpIHtcbiAgICAgICAgaWYodCA8IDApIHQgKz0gMTtcbiAgICAgICAgaWYodCA+IDEpIHQgLT0gMTtcbiAgICAgICAgaWYodCA8IDEvNikgcmV0dXJuIHAgKyAocSAtIHApICogNiAqIHQ7XG4gICAgICAgIGlmKHQgPCAxLzIpIHJldHVybiBxO1xuICAgICAgICBpZih0IDwgMi8zKSByZXR1cm4gcCArIChxIC0gcCkgKiAoMi8zIC0gdCkgKiA2O1xuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBpZihzID09PSAwKSB7XG4gICAgICAgIHIgPSBnID0gYiA9IGw7IC8vIGFjaHJvbWF0aWNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBxID0gbCA8IDAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcztcbiAgICAgICAgdmFyIHAgPSAyICogbCAtIHE7XG4gICAgICAgIHIgPSBodWUycmdiKHAsIHEsIGggKyAxLzMpO1xuICAgICAgICBnID0gaHVlMnJnYihwLCBxLCBoKTtcbiAgICAgICAgYiA9IGh1ZTJyZ2IocCwgcSwgaCAtIDEvMyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcjogciAqIDI1NSwgZzogZyAqIDI1NSwgYjogYiAqIDI1NSB9O1xufVxuXG4vLyBgcmdiVG9Ic3ZgXG4vLyBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNWXG4vLyAqQXNzdW1lczoqIHIsIGcsIGFuZCBiIGFyZSBjb250YWluZWQgaW4gdGhlIHNldCBbMCwgMjU1XSBvciBbMCwgMV1cbi8vICpSZXR1cm5zOiogeyBoLCBzLCB2IH0gaW4gWzAsMV1cbmZ1bmN0aW9uIHJnYlRvSHN2KHIsIGcsIGIpIHtcblxuICAgIHIgPSBib3VuZDAxKHIsIDI1NSk7XG4gICAgZyA9IGJvdW5kMDEoZywgMjU1KTtcbiAgICBiID0gYm91bmQwMShiLCAyNTUpO1xuXG4gICAgdmFyIG1heCA9IG1hdGhNYXgociwgZywgYiksIG1pbiA9IG1hdGhNaW4ociwgZywgYik7XG4gICAgdmFyIGgsIHMsIHYgPSBtYXg7XG5cbiAgICB2YXIgZCA9IG1heCAtIG1pbjtcbiAgICBzID0gbWF4ID09PSAwID8gMCA6IGQgLyBtYXg7XG5cbiAgICBpZihtYXggPT0gbWluKSB7XG4gICAgICAgIGggPSAwOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzd2l0Y2gobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6IGggPSAoZyAtIGIpIC8gZCArIChnIDwgYiA/IDYgOiAwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGc6IGggPSAoYiAtIHIpIC8gZCArIDI7IGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBoIC89IDY7XG4gICAgfVxuICAgIHJldHVybiB7IGg6IGgsIHM6IHMsIHY6IHYgfTtcbn1cblxuLy8gYGhzdlRvUmdiYFxuLy8gQ29udmVydHMgYW4gSFNWIGNvbG9yIHZhbHVlIHRvIFJHQi5cbi8vICpBc3N1bWVzOiogaCBpcyBjb250YWluZWQgaW4gWzAsIDFdIG9yIFswLCAzNjBdIGFuZCBzIGFuZCB2IGFyZSBjb250YWluZWQgaW4gWzAsIDFdIG9yIFswLCAxMDBdXG4vLyAqUmV0dXJuczoqIHsgciwgZywgYiB9IGluIHRoZSBzZXQgWzAsIDI1NV1cbiBmdW5jdGlvbiBoc3ZUb1JnYihoLCBzLCB2KSB7XG5cbiAgICBoID0gYm91bmQwMShoLCAzNjApICogNjtcbiAgICBzID0gYm91bmQwMShzLCAxMDApO1xuICAgIHYgPSBib3VuZDAxKHYsIDEwMCk7XG5cbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoaCksXG4gICAgICAgIGYgPSBoIC0gaSxcbiAgICAgICAgcCA9IHYgKiAoMSAtIHMpLFxuICAgICAgICBxID0gdiAqICgxIC0gZiAqIHMpLFxuICAgICAgICB0ID0gdiAqICgxIC0gKDEgLSBmKSAqIHMpLFxuICAgICAgICBtb2QgPSBpICUgNixcbiAgICAgICAgciA9IFt2LCBxLCBwLCBwLCB0LCB2XVttb2RdLFxuICAgICAgICBnID0gW3QsIHYsIHYsIHEsIHAsIHBdW21vZF0sXG4gICAgICAgIGIgPSBbcCwgcCwgdCwgdiwgdiwgcV1bbW9kXTtcblxuICAgIHJldHVybiB7IHI6IHIgKiAyNTUsIGc6IGcgKiAyNTUsIGI6IGIgKiAyNTUgfTtcbn1cblxuLy8gYHJnYlRvSGV4YFxuLy8gQ29udmVydHMgYW4gUkdCIGNvbG9yIHRvIGhleFxuLy8gQXNzdW1lcyByLCBnLCBhbmQgYiBhcmUgY29udGFpbmVkIGluIHRoZSBzZXQgWzAsIDI1NV1cbi8vIFJldHVybnMgYSAzIG9yIDYgY2hhcmFjdGVyIGhleFxuZnVuY3Rpb24gcmdiVG9IZXgociwgZywgYiwgYWxsb3czQ2hhcikge1xuXG4gICAgdmFyIGhleCA9IFtcbiAgICAgICAgcGFkMihtYXRoUm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoYikudG9TdHJpbmcoMTYpKVxuICAgIF07XG5cbiAgICAvLyBSZXR1cm4gYSAzIGNoYXJhY3RlciBoZXggaWYgcG9zc2libGVcbiAgICBpZiAoYWxsb3czQ2hhciAmJiBoZXhbMF0uY2hhckF0KDApID09IGhleFswXS5jaGFyQXQoMSkgJiYgaGV4WzFdLmNoYXJBdCgwKSA9PSBoZXhbMV0uY2hhckF0KDEpICYmIGhleFsyXS5jaGFyQXQoMCkgPT0gaGV4WzJdLmNoYXJBdCgxKSkge1xuICAgICAgICByZXR1cm4gaGV4WzBdLmNoYXJBdCgwKSArIGhleFsxXS5jaGFyQXQoMCkgKyBoZXhbMl0uY2hhckF0KDApO1xuICAgIH1cblxuICAgIHJldHVybiBoZXguam9pbihcIlwiKTtcbn1cblxuLy8gYHJnYmFUb0hleGBcbi8vIENvbnZlcnRzIGFuIFJHQkEgY29sb3IgcGx1cyBhbHBoYSB0cmFuc3BhcmVuY3kgdG8gaGV4XG4vLyBBc3N1bWVzIHIsIGcsIGIgYXJlIGNvbnRhaW5lZCBpbiB0aGUgc2V0IFswLCAyNTVdIGFuZFxuLy8gYSBpbiBbMCwgMV0uIFJldHVybnMgYSA0IG9yIDggY2hhcmFjdGVyIHJnYmEgaGV4XG5mdW5jdGlvbiByZ2JhVG9IZXgociwgZywgYiwgYSwgYWxsb3c0Q2hhcikge1xuXG4gICAgdmFyIGhleCA9IFtcbiAgICAgICAgcGFkMihtYXRoUm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoYikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihjb252ZXJ0RGVjaW1hbFRvSGV4KGEpKVxuICAgIF07XG5cbiAgICAvLyBSZXR1cm4gYSA0IGNoYXJhY3RlciBoZXggaWYgcG9zc2libGVcbiAgICBpZiAoYWxsb3c0Q2hhciAmJiBoZXhbMF0uY2hhckF0KDApID09IGhleFswXS5jaGFyQXQoMSkgJiYgaGV4WzFdLmNoYXJBdCgwKSA9PSBoZXhbMV0uY2hhckF0KDEpICYmIGhleFsyXS5jaGFyQXQoMCkgPT0gaGV4WzJdLmNoYXJBdCgxKSAmJiBoZXhbM10uY2hhckF0KDApID09IGhleFszXS5jaGFyQXQoMSkpIHtcbiAgICAgICAgcmV0dXJuIGhleFswXS5jaGFyQXQoMCkgKyBoZXhbMV0uY2hhckF0KDApICsgaGV4WzJdLmNoYXJBdCgwKSArIGhleFszXS5jaGFyQXQoMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhleC5qb2luKFwiXCIpO1xufVxuXG4vLyBgcmdiYVRvQXJnYkhleGBcbi8vIENvbnZlcnRzIGFuIFJHQkEgY29sb3IgdG8gYW4gQVJHQiBIZXg4IHN0cmluZ1xuLy8gUmFyZWx5IHVzZWQsIGJ1dCByZXF1aXJlZCBmb3IgXCJ0b0ZpbHRlcigpXCJcbmZ1bmN0aW9uIHJnYmFUb0FyZ2JIZXgociwgZywgYiwgYSkge1xuXG4gICAgdmFyIGhleCA9IFtcbiAgICAgICAgcGFkMihjb252ZXJ0RGVjaW1hbFRvSGV4KGEpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQocikudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoZykudG9TdHJpbmcoMTYpKSxcbiAgICAgICAgcGFkMihtYXRoUm91bmQoYikudG9TdHJpbmcoMTYpKVxuICAgIF07XG5cbiAgICByZXR1cm4gaGV4LmpvaW4oXCJcIik7XG59XG5cbi8vIGBlcXVhbHNgXG4vLyBDYW4gYmUgY2FsbGVkIHdpdGggYW55IHRpbnljb2xvciBpbnB1dFxudGlueWNvbG9yLmVxdWFscyA9IGZ1bmN0aW9uIChjb2xvcjEsIGNvbG9yMikge1xuICAgIGlmICghY29sb3IxIHx8ICFjb2xvcjIpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgcmV0dXJuIHRpbnljb2xvcihjb2xvcjEpLnRvUmdiU3RyaW5nKCkgPT0gdGlueWNvbG9yKGNvbG9yMikudG9SZ2JTdHJpbmcoKTtcbn07XG5cbnRpbnljb2xvci5yYW5kb20gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGlueWNvbG9yLmZyb21SYXRpbyh7XG4gICAgICAgIHI6IG1hdGhSYW5kb20oKSxcbiAgICAgICAgZzogbWF0aFJhbmRvbSgpLFxuICAgICAgICBiOiBtYXRoUmFuZG9tKClcbiAgICB9KTtcbn07XG5cblxuLy8gTW9kaWZpY2F0aW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhhbmtzIHRvIGxlc3MuanMgZm9yIHNvbWUgb2YgdGhlIGJhc2ljcyBoZXJlXG4vLyA8aHR0cHM6Ly9naXRodWIuY29tL2Nsb3VkaGVhZC9sZXNzLmpzL2Jsb2IvbWFzdGVyL2xpYi9sZXNzL2Z1bmN0aW9ucy5qcz5cblxuZnVuY3Rpb24gZGVzYXR1cmF0ZShjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wucyAtPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLnMgPSBjbGFtcDAxKGhzbC5zKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIHNhdHVyYXRlKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIGhzbC5zICs9IGFtb3VudCAvIDEwMDtcbiAgICBoc2wucyA9IGNsYW1wMDEoaHNsLnMpO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gZ3JleXNjYWxlKGNvbG9yKSB7XG4gICAgcmV0dXJuIHRpbnljb2xvcihjb2xvcikuZGVzYXR1cmF0ZSgxMDApO1xufVxuXG5mdW5jdGlvbiBsaWdodGVuIChjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wubCArPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLmwgPSBjbGFtcDAxKGhzbC5sKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbmZ1bmN0aW9uIGJyaWdodGVuKGNvbG9yLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDEwKTtcbiAgICB2YXIgcmdiID0gdGlueWNvbG9yKGNvbG9yKS50b1JnYigpO1xuICAgIHJnYi5yID0gbWF0aE1heCgwLCBtYXRoTWluKDI1NSwgcmdiLnIgLSBtYXRoUm91bmQoMjU1ICogLSAoYW1vdW50IC8gMTAwKSkpKTtcbiAgICByZ2IuZyA9IG1hdGhNYXgoMCwgbWF0aE1pbigyNTUsIHJnYi5nIC0gbWF0aFJvdW5kKDI1NSAqIC0gKGFtb3VudCAvIDEwMCkpKSk7XG4gICAgcmdiLmIgPSBtYXRoTWF4KDAsIG1hdGhNaW4oMjU1LCByZ2IuYiAtIG1hdGhSb3VuZCgyNTUgKiAtIChhbW91bnQgLyAxMDApKSkpO1xuICAgIHJldHVybiB0aW55Y29sb3IocmdiKTtcbn1cblxuZnVuY3Rpb24gZGFya2VuIChjb2xvciwgYW1vdW50KSB7XG4gICAgYW1vdW50ID0gKGFtb3VudCA9PT0gMCkgPyAwIDogKGFtb3VudCB8fCAxMCk7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICBoc2wubCAtPSBhbW91bnQgLyAxMDA7XG4gICAgaHNsLmwgPSBjbGFtcDAxKGhzbC5sKTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbi8vIFNwaW4gdGFrZXMgYSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSBhbW91bnQgd2l0aGluIFstMzYwLCAzNjBdIGluZGljYXRpbmcgdGhlIGNoYW5nZSBvZiBodWUuXG4vLyBWYWx1ZXMgb3V0c2lkZSBvZiB0aGlzIHJhbmdlIHdpbGwgYmUgd3JhcHBlZCBpbnRvIHRoaXMgcmFuZ2UuXG5mdW5jdGlvbiBzcGluKGNvbG9yLCBhbW91bnQpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBodWUgPSAoaHNsLmggKyBhbW91bnQpICUgMzYwO1xuICAgIGhzbC5oID0gaHVlIDwgMCA/IDM2MCArIGh1ZSA6IGh1ZTtcbiAgICByZXR1cm4gdGlueWNvbG9yKGhzbCk7XG59XG5cbi8vIENvbWJpbmF0aW9uIEZ1bmN0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGFua3MgdG8galF1ZXJ5IHhDb2xvciBmb3Igc29tZSBvZiB0aGUgaWRlYXMgYmVoaW5kIHRoZXNlXG4vLyA8aHR0cHM6Ly9naXRodWIuY29tL2luZnVzaW9uL2pRdWVyeS14Y29sb3IvYmxvYi9tYXN0ZXIvanF1ZXJ5Lnhjb2xvci5qcz5cblxuZnVuY3Rpb24gY29tcGxlbWVudChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgaHNsLmggPSAoaHNsLmggKyAxODApICUgMzYwO1xuICAgIHJldHVybiB0aW55Y29sb3IoaHNsKTtcbn1cblxuZnVuY3Rpb24gdHJpYWQoY29sb3IpIHtcbiAgICB2YXIgaHNsID0gdGlueWNvbG9yKGNvbG9yKS50b0hzbCgpO1xuICAgIHZhciBoID0gaHNsLmg7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGlueWNvbG9yKGNvbG9yKSxcbiAgICAgICAgdGlueWNvbG9yKHsgaDogKGggKyAxMjApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMjQwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pXG4gICAgXTtcbn1cblxuZnVuY3Rpb24gdGV0cmFkKGNvbG9yKSB7XG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgaCA9IGhzbC5oO1xuICAgIHJldHVybiBbXG4gICAgICAgIHRpbnljb2xvcihjb2xvciksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgOTApICUgMzYwLCBzOiBoc2wucywgbDogaHNsLmwgfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMTgwKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sIH0pLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDI3MCkgJSAzNjAsIHM6IGhzbC5zLCBsOiBoc2wubCB9KVxuICAgIF07XG59XG5cbmZ1bmN0aW9uIHNwbGl0Y29tcGxlbWVudChjb2xvcikge1xuICAgIHZhciBoc2wgPSB0aW55Y29sb3IoY29sb3IpLnRvSHNsKCk7XG4gICAgdmFyIGggPSBoc2wuaDtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aW55Y29sb3IoY29sb3IpLFxuICAgICAgICB0aW55Y29sb3IoeyBoOiAoaCArIDcyKSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sfSksXG4gICAgICAgIHRpbnljb2xvcih7IGg6IChoICsgMjE2KSAlIDM2MCwgczogaHNsLnMsIGw6IGhzbC5sfSlcbiAgICBdO1xufVxuXG5mdW5jdGlvbiBhbmFsb2dvdXMoY29sb3IsIHJlc3VsdHMsIHNsaWNlcykge1xuICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IDY7XG4gICAgc2xpY2VzID0gc2xpY2VzIHx8IDMwO1xuXG4gICAgdmFyIGhzbCA9IHRpbnljb2xvcihjb2xvcikudG9Ic2woKTtcbiAgICB2YXIgcGFydCA9IDM2MCAvIHNsaWNlcztcbiAgICB2YXIgcmV0ID0gW3Rpbnljb2xvcihjb2xvcildO1xuXG4gICAgZm9yIChoc2wuaCA9ICgoaHNsLmggLSAocGFydCAqIHJlc3VsdHMgPj4gMSkpICsgNzIwKSAlIDM2MDsgLS1yZXN1bHRzOyApIHtcbiAgICAgICAgaHNsLmggPSAoaHNsLmggKyBwYXJ0KSAlIDM2MDtcbiAgICAgICAgcmV0LnB1c2godGlueWNvbG9yKGhzbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBtb25vY2hyb21hdGljKGNvbG9yLCByZXN1bHRzKSB7XG4gICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgNjtcbiAgICB2YXIgaHN2ID0gdGlueWNvbG9yKGNvbG9yKS50b0hzdigpO1xuICAgIHZhciBoID0gaHN2LmgsIHMgPSBoc3YucywgdiA9IGhzdi52O1xuICAgIHZhciByZXQgPSBbXTtcbiAgICB2YXIgbW9kaWZpY2F0aW9uID0gMSAvIHJlc3VsdHM7XG5cbiAgICB3aGlsZSAocmVzdWx0cy0tKSB7XG4gICAgICAgIHJldC5wdXNoKHRpbnljb2xvcih7IGg6IGgsIHM6IHMsIHY6IHZ9KSk7XG4gICAgICAgIHYgPSAodiArIG1vZGlmaWNhdGlvbikgJSAxO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbi8vIFV0aWxpdHkgRnVuY3Rpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudGlueWNvbG9yLm1peCA9IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBhbW91bnQpIHtcbiAgICBhbW91bnQgPSAoYW1vdW50ID09PSAwKSA/IDAgOiAoYW1vdW50IHx8IDUwKTtcblxuICAgIHZhciByZ2IxID0gdGlueWNvbG9yKGNvbG9yMSkudG9SZ2IoKTtcbiAgICB2YXIgcmdiMiA9IHRpbnljb2xvcihjb2xvcjIpLnRvUmdiKCk7XG5cbiAgICB2YXIgcCA9IGFtb3VudCAvIDEwMDtcblxuICAgIHZhciByZ2JhID0ge1xuICAgICAgICByOiAoKHJnYjIuciAtIHJnYjEucikgKiBwKSArIHJnYjEucixcbiAgICAgICAgZzogKChyZ2IyLmcgLSByZ2IxLmcpICogcCkgKyByZ2IxLmcsXG4gICAgICAgIGI6ICgocmdiMi5iIC0gcmdiMS5iKSAqIHApICsgcmdiMS5iLFxuICAgICAgICBhOiAoKHJnYjIuYSAtIHJnYjEuYSkgKiBwKSArIHJnYjEuYVxuICAgIH07XG5cbiAgICByZXR1cm4gdGlueWNvbG9yKHJnYmEpO1xufTtcblxuXG4vLyBSZWFkYWJpbGl0eSBGdW5jdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gPGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDgvUkVDLVdDQUcyMC0yMDA4MTIxMS8jY29udHJhc3QtcmF0aW9kZWYgKFdDQUcgVmVyc2lvbiAyKVxuXG4vLyBgY29udHJhc3RgXG4vLyBBbmFseXplIHRoZSAyIGNvbG9ycyBhbmQgcmV0dXJucyB0aGUgY29sb3IgY29udHJhc3QgZGVmaW5lZCBieSAoV0NBRyBWZXJzaW9uIDIpXG50aW55Y29sb3IucmVhZGFiaWxpdHkgPSBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xuICAgIHZhciBjMSA9IHRpbnljb2xvcihjb2xvcjEpO1xuICAgIHZhciBjMiA9IHRpbnljb2xvcihjb2xvcjIpO1xuICAgIHJldHVybiAoTWF0aC5tYXgoYzEuZ2V0THVtaW5hbmNlKCksYzIuZ2V0THVtaW5hbmNlKCkpKzAuMDUpIC8gKE1hdGgubWluKGMxLmdldEx1bWluYW5jZSgpLGMyLmdldEx1bWluYW5jZSgpKSswLjA1KTtcbn07XG5cbi8vIGBpc1JlYWRhYmxlYFxuLy8gRW5zdXJlIHRoYXQgZm9yZWdyb3VuZCBhbmQgYmFja2dyb3VuZCBjb2xvciBjb21iaW5hdGlvbnMgbWVldCBXQ0FHMiBndWlkZWxpbmVzLlxuLy8gVGhlIHRoaXJkIGFyZ3VtZW50IGlzIGFuIG9wdGlvbmFsIE9iamVjdC5cbi8vICAgICAgdGhlICdsZXZlbCcgcHJvcGVydHkgc3RhdGVzICdBQScgb3IgJ0FBQScgLSBpZiBtaXNzaW5nIG9yIGludmFsaWQsIGl0IGRlZmF1bHRzIHRvICdBQSc7XG4vLyAgICAgIHRoZSAnc2l6ZScgcHJvcGVydHkgc3RhdGVzICdsYXJnZScgb3IgJ3NtYWxsJyAtIGlmIG1pc3Npbmcgb3IgaW52YWxpZCwgaXQgZGVmYXVsdHMgdG8gJ3NtYWxsJy5cbi8vIElmIHRoZSBlbnRpcmUgb2JqZWN0IGlzIGFic2VudCwgaXNSZWFkYWJsZSBkZWZhdWx0cyB0byB7bGV2ZWw6XCJBQVwiLHNpemU6XCJzbWFsbFwifS5cblxuLy8gKkV4YW1wbGUqXG4vLyAgICB0aW55Y29sb3IuaXNSZWFkYWJsZShcIiMwMDBcIiwgXCIjMTExXCIpID0+IGZhbHNlXG4vLyAgICB0aW55Y29sb3IuaXNSZWFkYWJsZShcIiMwMDBcIiwgXCIjMTExXCIse2xldmVsOlwiQUFcIixzaXplOlwibGFyZ2VcIn0pID0+IGZhbHNlXG50aW55Y29sb3IuaXNSZWFkYWJsZSA9IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCB3Y2FnMikge1xuICAgIHZhciByZWFkYWJpbGl0eSA9IHRpbnljb2xvci5yZWFkYWJpbGl0eShjb2xvcjEsIGNvbG9yMik7XG4gICAgdmFyIHdjYWcyUGFybXMsIG91dDtcblxuICAgIG91dCA9IGZhbHNlO1xuXG4gICAgd2NhZzJQYXJtcyA9IHZhbGlkYXRlV0NBRzJQYXJtcyh3Y2FnMik7XG4gICAgc3dpdGNoICh3Y2FnMlBhcm1zLmxldmVsICsgd2NhZzJQYXJtcy5zaXplKSB7XG4gICAgICAgIGNhc2UgXCJBQXNtYWxsXCI6XG4gICAgICAgIGNhc2UgXCJBQUFsYXJnZVwiOlxuICAgICAgICAgICAgb3V0ID0gcmVhZGFiaWxpdHkgPj0gNC41O1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBQWxhcmdlXCI6XG4gICAgICAgICAgICBvdXQgPSByZWFkYWJpbGl0eSA+PSAzO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJBQUFzbWFsbFwiOlxuICAgICAgICAgICAgb3V0ID0gcmVhZGFiaWxpdHkgPj0gNztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xuXG59O1xuXG4vLyBgbW9zdFJlYWRhYmxlYFxuLy8gR2l2ZW4gYSBiYXNlIGNvbG9yIGFuZCBhIGxpc3Qgb2YgcG9zc2libGUgZm9yZWdyb3VuZCBvciBiYWNrZ3JvdW5kXG4vLyBjb2xvcnMgZm9yIHRoYXQgYmFzZSwgcmV0dXJucyB0aGUgbW9zdCByZWFkYWJsZSBjb2xvci5cbi8vIE9wdGlvbmFsbHkgcmV0dXJucyBCbGFjayBvciBXaGl0ZSBpZiB0aGUgbW9zdCByZWFkYWJsZSBjb2xvciBpcyB1bnJlYWRhYmxlLlxuLy8gKkV4YW1wbGUqXG4vLyAgICB0aW55Y29sb3IubW9zdFJlYWRhYmxlKHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjMTIzXCIsIFtcIiMxMjRcIiwgXCIjMTI1XCJdLHtpbmNsdWRlRmFsbGJhY2tDb2xvcnM6ZmFsc2V9KS50b0hleFN0cmluZygpOyAvLyBcIiMxMTIyNTVcIlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZSh0aW55Y29sb3IubW9zdFJlYWRhYmxlKFwiIzEyM1wiLCBbXCIjMTI0XCIsIFwiIzEyNVwiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOnRydWV9KS50b0hleFN0cmluZygpOyAgLy8gXCIjZmZmZmZmXCJcbi8vICAgIHRpbnljb2xvci5tb3N0UmVhZGFibGUoXCIjYTgwMTVhXCIsIFtcIiNmYWYzZjNcIl0se2luY2x1ZGVGYWxsYmFja0NvbG9yczp0cnVlLGxldmVsOlwiQUFBXCIsc2l6ZTpcImxhcmdlXCJ9KS50b0hleFN0cmluZygpOyAvLyBcIiNmYWYzZjNcIlxuLy8gICAgdGlueWNvbG9yLm1vc3RSZWFkYWJsZShcIiNhODAxNWFcIiwgW1wiI2ZhZjNmM1wiXSx7aW5jbHVkZUZhbGxiYWNrQ29sb3JzOnRydWUsbGV2ZWw6XCJBQUFcIixzaXplOlwic21hbGxcIn0pLnRvSGV4U3RyaW5nKCk7IC8vIFwiI2ZmZmZmZlwiXG50aW55Y29sb3IubW9zdFJlYWRhYmxlID0gZnVuY3Rpb24oYmFzZUNvbG9yLCBjb2xvckxpc3QsIGFyZ3MpIHtcbiAgICB2YXIgYmVzdENvbG9yID0gbnVsbDtcbiAgICB2YXIgYmVzdFNjb3JlID0gMDtcbiAgICB2YXIgcmVhZGFiaWxpdHk7XG4gICAgdmFyIGluY2x1ZGVGYWxsYmFja0NvbG9ycywgbGV2ZWwsIHNpemUgO1xuICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgIGluY2x1ZGVGYWxsYmFja0NvbG9ycyA9IGFyZ3MuaW5jbHVkZUZhbGxiYWNrQ29sb3JzIDtcbiAgICBsZXZlbCA9IGFyZ3MubGV2ZWw7XG4gICAgc2l6ZSA9IGFyZ3Muc2l6ZTtcblxuICAgIGZvciAodmFyIGk9IDA7IGkgPCBjb2xvckxpc3QubGVuZ3RoIDsgaSsrKSB7XG4gICAgICAgIHJlYWRhYmlsaXR5ID0gdGlueWNvbG9yLnJlYWRhYmlsaXR5KGJhc2VDb2xvciwgY29sb3JMaXN0W2ldKTtcbiAgICAgICAgaWYgKHJlYWRhYmlsaXR5ID4gYmVzdFNjb3JlKSB7XG4gICAgICAgICAgICBiZXN0U2NvcmUgPSByZWFkYWJpbGl0eTtcbiAgICAgICAgICAgIGJlc3RDb2xvciA9IHRpbnljb2xvcihjb2xvckxpc3RbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRpbnljb2xvci5pc1JlYWRhYmxlKGJhc2VDb2xvciwgYmVzdENvbG9yLCB7XCJsZXZlbFwiOmxldmVsLFwic2l6ZVwiOnNpemV9KSB8fCAhaW5jbHVkZUZhbGxiYWNrQ29sb3JzKSB7XG4gICAgICAgIHJldHVybiBiZXN0Q29sb3I7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhcmdzLmluY2x1ZGVGYWxsYmFja0NvbG9ycz1mYWxzZTtcbiAgICAgICAgcmV0dXJuIHRpbnljb2xvci5tb3N0UmVhZGFibGUoYmFzZUNvbG9yLFtcIiNmZmZcIiwgXCIjMDAwXCJdLGFyZ3MpO1xuICAgIH1cbn07XG5cblxuLy8gQmlnIExpc3Qgb2YgQ29sb3JzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS1cbi8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLWNvbG9yLyNzdmctY29sb3I+XG52YXIgbmFtZXMgPSB0aW55Y29sb3IubmFtZXMgPSB7XG4gICAgYWxpY2VibHVlOiBcImYwZjhmZlwiLFxuICAgIGFudGlxdWV3aGl0ZTogXCJmYWViZDdcIixcbiAgICBhcXVhOiBcIjBmZlwiLFxuICAgIGFxdWFtYXJpbmU6IFwiN2ZmZmQ0XCIsXG4gICAgYXp1cmU6IFwiZjBmZmZmXCIsXG4gICAgYmVpZ2U6IFwiZjVmNWRjXCIsXG4gICAgYmlzcXVlOiBcImZmZTRjNFwiLFxuICAgIGJsYWNrOiBcIjAwMFwiLFxuICAgIGJsYW5jaGVkYWxtb25kOiBcImZmZWJjZFwiLFxuICAgIGJsdWU6IFwiMDBmXCIsXG4gICAgYmx1ZXZpb2xldDogXCI4YTJiZTJcIixcbiAgICBicm93bjogXCJhNTJhMmFcIixcbiAgICBidXJseXdvb2Q6IFwiZGViODg3XCIsXG4gICAgYnVybnRzaWVubmE6IFwiZWE3ZTVkXCIsXG4gICAgY2FkZXRibHVlOiBcIjVmOWVhMFwiLFxuICAgIGNoYXJ0cmV1c2U6IFwiN2ZmZjAwXCIsXG4gICAgY2hvY29sYXRlOiBcImQyNjkxZVwiLFxuICAgIGNvcmFsOiBcImZmN2Y1MFwiLFxuICAgIGNvcm5mbG93ZXJibHVlOiBcIjY0OTVlZFwiLFxuICAgIGNvcm5zaWxrOiBcImZmZjhkY1wiLFxuICAgIGNyaW1zb246IFwiZGMxNDNjXCIsXG4gICAgY3lhbjogXCIwZmZcIixcbiAgICBkYXJrYmx1ZTogXCIwMDAwOGJcIixcbiAgICBkYXJrY3lhbjogXCIwMDhiOGJcIixcbiAgICBkYXJrZ29sZGVucm9kOiBcImI4ODYwYlwiLFxuICAgIGRhcmtncmF5OiBcImE5YTlhOVwiLFxuICAgIGRhcmtncmVlbjogXCIwMDY0MDBcIixcbiAgICBkYXJrZ3JleTogXCJhOWE5YTlcIixcbiAgICBkYXJra2hha2k6IFwiYmRiNzZiXCIsXG4gICAgZGFya21hZ2VudGE6IFwiOGIwMDhiXCIsXG4gICAgZGFya29saXZlZ3JlZW46IFwiNTU2YjJmXCIsXG4gICAgZGFya29yYW5nZTogXCJmZjhjMDBcIixcbiAgICBkYXJrb3JjaGlkOiBcIjk5MzJjY1wiLFxuICAgIGRhcmtyZWQ6IFwiOGIwMDAwXCIsXG4gICAgZGFya3NhbG1vbjogXCJlOTk2N2FcIixcbiAgICBkYXJrc2VhZ3JlZW46IFwiOGZiYzhmXCIsXG4gICAgZGFya3NsYXRlYmx1ZTogXCI0ODNkOGJcIixcbiAgICBkYXJrc2xhdGVncmF5OiBcIjJmNGY0ZlwiLFxuICAgIGRhcmtzbGF0ZWdyZXk6IFwiMmY0ZjRmXCIsXG4gICAgZGFya3R1cnF1b2lzZTogXCIwMGNlZDFcIixcbiAgICBkYXJrdmlvbGV0OiBcIjk0MDBkM1wiLFxuICAgIGRlZXBwaW5rOiBcImZmMTQ5M1wiLFxuICAgIGRlZXBza3libHVlOiBcIjAwYmZmZlwiLFxuICAgIGRpbWdyYXk6IFwiNjk2OTY5XCIsXG4gICAgZGltZ3JleTogXCI2OTY5NjlcIixcbiAgICBkb2RnZXJibHVlOiBcIjFlOTBmZlwiLFxuICAgIGZpcmVicmljazogXCJiMjIyMjJcIixcbiAgICBmbG9yYWx3aGl0ZTogXCJmZmZhZjBcIixcbiAgICBmb3Jlc3RncmVlbjogXCIyMjhiMjJcIixcbiAgICBmdWNoc2lhOiBcImYwZlwiLFxuICAgIGdhaW5zYm9ybzogXCJkY2RjZGNcIixcbiAgICBnaG9zdHdoaXRlOiBcImY4ZjhmZlwiLFxuICAgIGdvbGQ6IFwiZmZkNzAwXCIsXG4gICAgZ29sZGVucm9kOiBcImRhYTUyMFwiLFxuICAgIGdyYXk6IFwiODA4MDgwXCIsXG4gICAgZ3JlZW46IFwiMDA4MDAwXCIsXG4gICAgZ3JlZW55ZWxsb3c6IFwiYWRmZjJmXCIsXG4gICAgZ3JleTogXCI4MDgwODBcIixcbiAgICBob25leWRldzogXCJmMGZmZjBcIixcbiAgICBob3RwaW5rOiBcImZmNjliNFwiLFxuICAgIGluZGlhbnJlZDogXCJjZDVjNWNcIixcbiAgICBpbmRpZ286IFwiNGIwMDgyXCIsXG4gICAgaXZvcnk6IFwiZmZmZmYwXCIsXG4gICAga2hha2k6IFwiZjBlNjhjXCIsXG4gICAgbGF2ZW5kZXI6IFwiZTZlNmZhXCIsXG4gICAgbGF2ZW5kZXJibHVzaDogXCJmZmYwZjVcIixcbiAgICBsYXduZ3JlZW46IFwiN2NmYzAwXCIsXG4gICAgbGVtb25jaGlmZm9uOiBcImZmZmFjZFwiLFxuICAgIGxpZ2h0Ymx1ZTogXCJhZGQ4ZTZcIixcbiAgICBsaWdodGNvcmFsOiBcImYwODA4MFwiLFxuICAgIGxpZ2h0Y3lhbjogXCJlMGZmZmZcIixcbiAgICBsaWdodGdvbGRlbnJvZHllbGxvdzogXCJmYWZhZDJcIixcbiAgICBsaWdodGdyYXk6IFwiZDNkM2QzXCIsXG4gICAgbGlnaHRncmVlbjogXCI5MGVlOTBcIixcbiAgICBsaWdodGdyZXk6IFwiZDNkM2QzXCIsXG4gICAgbGlnaHRwaW5rOiBcImZmYjZjMVwiLFxuICAgIGxpZ2h0c2FsbW9uOiBcImZmYTA3YVwiLFxuICAgIGxpZ2h0c2VhZ3JlZW46IFwiMjBiMmFhXCIsXG4gICAgbGlnaHRza3libHVlOiBcIjg3Y2VmYVwiLFxuICAgIGxpZ2h0c2xhdGVncmF5OiBcIjc4OVwiLFxuICAgIGxpZ2h0c2xhdGVncmV5OiBcIjc4OVwiLFxuICAgIGxpZ2h0c3RlZWxibHVlOiBcImIwYzRkZVwiLFxuICAgIGxpZ2h0eWVsbG93OiBcImZmZmZlMFwiLFxuICAgIGxpbWU6IFwiMGYwXCIsXG4gICAgbGltZWdyZWVuOiBcIjMyY2QzMlwiLFxuICAgIGxpbmVuOiBcImZhZjBlNlwiLFxuICAgIG1hZ2VudGE6IFwiZjBmXCIsXG4gICAgbWFyb29uOiBcIjgwMDAwMFwiLFxuICAgIG1lZGl1bWFxdWFtYXJpbmU6IFwiNjZjZGFhXCIsXG4gICAgbWVkaXVtYmx1ZTogXCIwMDAwY2RcIixcbiAgICBtZWRpdW1vcmNoaWQ6IFwiYmE1NWQzXCIsXG4gICAgbWVkaXVtcHVycGxlOiBcIjkzNzBkYlwiLFxuICAgIG1lZGl1bXNlYWdyZWVuOiBcIjNjYjM3MVwiLFxuICAgIG1lZGl1bXNsYXRlYmx1ZTogXCI3YjY4ZWVcIixcbiAgICBtZWRpdW1zcHJpbmdncmVlbjogXCIwMGZhOWFcIixcbiAgICBtZWRpdW10dXJxdW9pc2U6IFwiNDhkMWNjXCIsXG4gICAgbWVkaXVtdmlvbGV0cmVkOiBcImM3MTU4NVwiLFxuICAgIG1pZG5pZ2h0Ymx1ZTogXCIxOTE5NzBcIixcbiAgICBtaW50Y3JlYW06IFwiZjVmZmZhXCIsXG4gICAgbWlzdHlyb3NlOiBcImZmZTRlMVwiLFxuICAgIG1vY2Nhc2luOiBcImZmZTRiNVwiLFxuICAgIG5hdmFqb3doaXRlOiBcImZmZGVhZFwiLFxuICAgIG5hdnk6IFwiMDAwMDgwXCIsXG4gICAgb2xkbGFjZTogXCJmZGY1ZTZcIixcbiAgICBvbGl2ZTogXCI4MDgwMDBcIixcbiAgICBvbGl2ZWRyYWI6IFwiNmI4ZTIzXCIsXG4gICAgb3JhbmdlOiBcImZmYTUwMFwiLFxuICAgIG9yYW5nZXJlZDogXCJmZjQ1MDBcIixcbiAgICBvcmNoaWQ6IFwiZGE3MGQ2XCIsXG4gICAgcGFsZWdvbGRlbnJvZDogXCJlZWU4YWFcIixcbiAgICBwYWxlZ3JlZW46IFwiOThmYjk4XCIsXG4gICAgcGFsZXR1cnF1b2lzZTogXCJhZmVlZWVcIixcbiAgICBwYWxldmlvbGV0cmVkOiBcImRiNzA5M1wiLFxuICAgIHBhcGF5YXdoaXA6IFwiZmZlZmQ1XCIsXG4gICAgcGVhY2hwdWZmOiBcImZmZGFiOVwiLFxuICAgIHBlcnU6IFwiY2Q4NTNmXCIsXG4gICAgcGluazogXCJmZmMwY2JcIixcbiAgICBwbHVtOiBcImRkYTBkZFwiLFxuICAgIHBvd2RlcmJsdWU6IFwiYjBlMGU2XCIsXG4gICAgcHVycGxlOiBcIjgwMDA4MFwiLFxuICAgIHJlYmVjY2FwdXJwbGU6IFwiNjYzMzk5XCIsXG4gICAgcmVkOiBcImYwMFwiLFxuICAgIHJvc3licm93bjogXCJiYzhmOGZcIixcbiAgICByb3lhbGJsdWU6IFwiNDE2OWUxXCIsXG4gICAgc2FkZGxlYnJvd246IFwiOGI0NTEzXCIsXG4gICAgc2FsbW9uOiBcImZhODA3MlwiLFxuICAgIHNhbmR5YnJvd246IFwiZjRhNDYwXCIsXG4gICAgc2VhZ3JlZW46IFwiMmU4YjU3XCIsXG4gICAgc2Vhc2hlbGw6IFwiZmZmNWVlXCIsXG4gICAgc2llbm5hOiBcImEwNTIyZFwiLFxuICAgIHNpbHZlcjogXCJjMGMwYzBcIixcbiAgICBza3libHVlOiBcIjg3Y2VlYlwiLFxuICAgIHNsYXRlYmx1ZTogXCI2YTVhY2RcIixcbiAgICBzbGF0ZWdyYXk6IFwiNzA4MDkwXCIsXG4gICAgc2xhdGVncmV5OiBcIjcwODA5MFwiLFxuICAgIHNub3c6IFwiZmZmYWZhXCIsXG4gICAgc3ByaW5nZ3JlZW46IFwiMDBmZjdmXCIsXG4gICAgc3RlZWxibHVlOiBcIjQ2ODJiNFwiLFxuICAgIHRhbjogXCJkMmI0OGNcIixcbiAgICB0ZWFsOiBcIjAwODA4MFwiLFxuICAgIHRoaXN0bGU6IFwiZDhiZmQ4XCIsXG4gICAgdG9tYXRvOiBcImZmNjM0N1wiLFxuICAgIHR1cnF1b2lzZTogXCI0MGUwZDBcIixcbiAgICB2aW9sZXQ6IFwiZWU4MmVlXCIsXG4gICAgd2hlYXQ6IFwiZjVkZWIzXCIsXG4gICAgd2hpdGU6IFwiZmZmXCIsXG4gICAgd2hpdGVzbW9rZTogXCJmNWY1ZjVcIixcbiAgICB5ZWxsb3c6IFwiZmYwXCIsXG4gICAgeWVsbG93Z3JlZW46IFwiOWFjZDMyXCJcbn07XG5cbi8vIE1ha2UgaXQgZWFzeSB0byBhY2Nlc3MgY29sb3JzIHZpYSBgaGV4TmFtZXNbaGV4XWBcbnZhciBoZXhOYW1lcyA9IHRpbnljb2xvci5oZXhOYW1lcyA9IGZsaXAobmFtZXMpO1xuXG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG5cbi8vIGB7ICduYW1lMSc6ICd2YWwxJyB9YCBiZWNvbWVzIGB7ICd2YWwxJzogJ25hbWUxJyB9YFxuZnVuY3Rpb24gZmxpcChvKSB7XG4gICAgdmFyIGZsaXBwZWQgPSB7IH07XG4gICAgZm9yICh2YXIgaSBpbiBvKSB7XG4gICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBmbGlwcGVkW29baV1dID0gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmxpcHBlZDtcbn1cblxuLy8gUmV0dXJuIGEgdmFsaWQgYWxwaGEgdmFsdWUgWzAsMV0gd2l0aCBhbGwgaW52YWxpZCB2YWx1ZXMgYmVpbmcgc2V0IHRvIDFcbmZ1bmN0aW9uIGJvdW5kQWxwaGEoYSkge1xuICAgIGEgPSBwYXJzZUZsb2F0KGEpO1xuXG4gICAgaWYgKGlzTmFOKGEpIHx8IGEgPCAwIHx8IGEgPiAxKSB7XG4gICAgICAgIGEgPSAxO1xuICAgIH1cblxuICAgIHJldHVybiBhO1xufVxuXG4vLyBUYWtlIGlucHV0IGZyb20gWzAsIG5dIGFuZCByZXR1cm4gaXQgYXMgWzAsIDFdXG5mdW5jdGlvbiBib3VuZDAxKG4sIG1heCkge1xuICAgIGlmIChpc09uZVBvaW50WmVybyhuKSkgeyBuID0gXCIxMDAlXCI7IH1cblxuICAgIHZhciBwcm9jZXNzUGVyY2VudCA9IGlzUGVyY2VudGFnZShuKTtcbiAgICBuID0gbWF0aE1pbihtYXgsIG1hdGhNYXgoMCwgcGFyc2VGbG9hdChuKSkpO1xuXG4gICAgLy8gQXV0b21hdGljYWxseSBjb252ZXJ0IHBlcmNlbnRhZ2UgaW50byBudW1iZXJcbiAgICBpZiAocHJvY2Vzc1BlcmNlbnQpIHtcbiAgICAgICAgbiA9IHBhcnNlSW50KG4gKiBtYXgsIDEwKSAvIDEwMDtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgZmxvYXRpbmcgcG9pbnQgcm91bmRpbmcgZXJyb3JzXG4gICAgaWYgKChNYXRoLmFicyhuIC0gbWF4KSA8IDAuMDAwMDAxKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGludG8gWzAsIDFdIHJhbmdlIGlmIGl0IGlzbid0IGFscmVhZHlcbiAgICByZXR1cm4gKG4gJSBtYXgpIC8gcGFyc2VGbG9hdChtYXgpO1xufVxuXG4vLyBGb3JjZSBhIG51bWJlciBiZXR3ZWVuIDAgYW5kIDFcbmZ1bmN0aW9uIGNsYW1wMDEodmFsKSB7XG4gICAgcmV0dXJuIG1hdGhNaW4oMSwgbWF0aE1heCgwLCB2YWwpKTtcbn1cblxuLy8gUGFyc2UgYSBiYXNlLTE2IGhleCB2YWx1ZSBpbnRvIGEgYmFzZS0xMCBpbnRlZ2VyXG5mdW5jdGlvbiBwYXJzZUludEZyb21IZXgodmFsKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KHZhbCwgMTYpO1xufVxuXG4vLyBOZWVkIHRvIGhhbmRsZSAxLjAgYXMgMTAwJSwgc2luY2Ugb25jZSBpdCBpcyBhIG51bWJlciwgdGhlcmUgaXMgbm8gZGlmZmVyZW5jZSBiZXR3ZWVuIGl0IGFuZCAxXG4vLyA8aHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83NDIyMDcyL2phdmFzY3JpcHQtaG93LXRvLWRldGVjdC1udW1iZXItYXMtYS1kZWNpbWFsLWluY2x1ZGluZy0xLTA+XG5mdW5jdGlvbiBpc09uZVBvaW50WmVybyhuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBuID09IFwic3RyaW5nXCIgJiYgbi5pbmRleE9mKCcuJykgIT0gLTEgJiYgcGFyc2VGbG9hdChuKSA9PT0gMTtcbn1cblxuLy8gQ2hlY2sgdG8gc2VlIGlmIHN0cmluZyBwYXNzZWQgaW4gaXMgYSBwZXJjZW50YWdlXG5mdW5jdGlvbiBpc1BlcmNlbnRhZ2Uobikge1xuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gXCJzdHJpbmdcIiAmJiBuLmluZGV4T2YoJyUnKSAhPSAtMTtcbn1cblxuLy8gRm9yY2UgYSBoZXggdmFsdWUgdG8gaGF2ZSAyIGNoYXJhY3RlcnNcbmZ1bmN0aW9uIHBhZDIoYykge1xuICAgIHJldHVybiBjLmxlbmd0aCA9PSAxID8gJzAnICsgYyA6ICcnICsgYztcbn1cblxuLy8gUmVwbGFjZSBhIGRlY2ltYWwgd2l0aCBpdCdzIHBlcmNlbnRhZ2UgdmFsdWVcbmZ1bmN0aW9uIGNvbnZlcnRUb1BlcmNlbnRhZ2Uobikge1xuICAgIGlmIChuIDw9IDEpIHtcbiAgICAgICAgbiA9IChuICogMTAwKSArIFwiJVwiO1xuICAgIH1cblxuICAgIHJldHVybiBuO1xufVxuXG4vLyBDb252ZXJ0cyBhIGRlY2ltYWwgdG8gYSBoZXggdmFsdWVcbmZ1bmN0aW9uIGNvbnZlcnREZWNpbWFsVG9IZXgoZCkge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZCkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbn1cbi8vIENvbnZlcnRzIGEgaGV4IHZhbHVlIHRvIGEgZGVjaW1hbFxuZnVuY3Rpb24gY29udmVydEhleFRvRGVjaW1hbChoKSB7XG4gICAgcmV0dXJuIChwYXJzZUludEZyb21IZXgoaCkgLyAyNTUpO1xufVxuXG52YXIgbWF0Y2hlcnMgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICAvLyA8aHR0cDovL3d3dy53My5vcmcvVFIvY3NzMy12YWx1ZXMvI2ludGVnZXJzPlxuICAgIHZhciBDU1NfSU5URUdFUiA9IFwiWy1cXFxcK10/XFxcXGQrJT9cIjtcblxuICAgIC8vIDxodHRwOi8vd3d3LnczLm9yZy9UUi9jc3MzLXZhbHVlcy8jbnVtYmVyLXZhbHVlPlxuICAgIHZhciBDU1NfTlVNQkVSID0gXCJbLVxcXFwrXT9cXFxcZCpcXFxcLlxcXFxkKyU/XCI7XG5cbiAgICAvLyBBbGxvdyBwb3NpdGl2ZS9uZWdhdGl2ZSBpbnRlZ2VyL251bWJlci4gIERvbid0IGNhcHR1cmUgdGhlIGVpdGhlci9vciwganVzdCB0aGUgZW50aXJlIG91dGNvbWUuXG4gICAgdmFyIENTU19VTklUID0gXCIoPzpcIiArIENTU19OVU1CRVIgKyBcIil8KD86XCIgKyBDU1NfSU5URUdFUiArIFwiKVwiO1xuXG4gICAgLy8gQWN0dWFsIG1hdGNoaW5nLlxuICAgIC8vIFBhcmVudGhlc2VzIGFuZCBjb21tYXMgYXJlIG9wdGlvbmFsLCBidXQgbm90IHJlcXVpcmVkLlxuICAgIC8vIFdoaXRlc3BhY2UgY2FuIHRha2UgdGhlIHBsYWNlIG9mIGNvbW1hcyBvciBvcGVuaW5nIHBhcmVuXG4gICAgdmFyIFBFUk1JU1NJVkVfTUFUQ0gzID0gXCJbXFxcXHN8XFxcXChdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpXFxcXHMqXFxcXCk/XCI7XG4gICAgdmFyIFBFUk1JU1NJVkVfTUFUQ0g0ID0gXCJbXFxcXHN8XFxcXChdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpWyx8XFxcXHNdKyhcIiArIENTU19VTklUICsgXCIpXFxcXHMqXFxcXCk/XCI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBDU1NfVU5JVDogbmV3IFJlZ0V4cChDU1NfVU5JVCksXG4gICAgICAgIHJnYjogbmV3IFJlZ0V4cChcInJnYlwiICsgUEVSTUlTU0lWRV9NQVRDSDMpLFxuICAgICAgICByZ2JhOiBuZXcgUmVnRXhwKFwicmdiYVwiICsgUEVSTUlTU0lWRV9NQVRDSDQpLFxuICAgICAgICBoc2w6IG5ldyBSZWdFeHAoXCJoc2xcIiArIFBFUk1JU1NJVkVfTUFUQ0gzKSxcbiAgICAgICAgaHNsYTogbmV3IFJlZ0V4cChcImhzbGFcIiArIFBFUk1JU1NJVkVfTUFUQ0g0KSxcbiAgICAgICAgaHN2OiBuZXcgUmVnRXhwKFwiaHN2XCIgKyBQRVJNSVNTSVZFX01BVENIMyksXG4gICAgICAgIGhzdmE6IG5ldyBSZWdFeHAoXCJoc3ZhXCIgKyBQRVJNSVNTSVZFX01BVENINCksXG4gICAgICAgIGhleDM6IC9eIz8oWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkkLyxcbiAgICAgICAgaGV4NjogL14jPyhbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KSQvLFxuICAgICAgICBoZXg0OiAvXiM/KFswLTlhLWZBLUZdezF9KShbMC05YS1mQS1GXXsxfSkoWzAtOWEtZkEtRl17MX0pKFswLTlhLWZBLUZdezF9KSQvLFxuICAgICAgICBoZXg4OiAvXiM/KFswLTlhLWZBLUZdezJ9KShbMC05YS1mQS1GXXsyfSkoWzAtOWEtZkEtRl17Mn0pKFswLTlhLWZBLUZdezJ9KSQvXG4gICAgfTtcbn0pKCk7XG5cbi8vIGBpc1ZhbGlkQ1NTVW5pdGBcbi8vIFRha2UgaW4gYSBzaW5nbGUgc3RyaW5nIC8gbnVtYmVyIGFuZCBjaGVjayB0byBzZWUgaWYgaXQgbG9va3MgbGlrZSBhIENTUyB1bml0XG4vLyAoc2VlIGBtYXRjaGVyc2AgYWJvdmUgZm9yIGRlZmluaXRpb24pLlxuZnVuY3Rpb24gaXNWYWxpZENTU1VuaXQoY29sb3IpIHtcbiAgICByZXR1cm4gISFtYXRjaGVycy5DU1NfVU5JVC5leGVjKGNvbG9yKTtcbn1cblxuLy8gYHN0cmluZ0lucHV0VG9PYmplY3RgXG4vLyBQZXJtaXNzaXZlIHN0cmluZyBwYXJzaW5nLiAgVGFrZSBpbiBhIG51bWJlciBvZiBmb3JtYXRzLCBhbmQgb3V0cHV0IGFuIG9iamVjdFxuLy8gYmFzZWQgb24gZGV0ZWN0ZWQgZm9ybWF0LiAgUmV0dXJucyBgeyByLCBnLCBiIH1gIG9yIGB7IGgsIHMsIGwgfWAgb3IgYHsgaCwgcywgdn1gXG5mdW5jdGlvbiBzdHJpbmdJbnB1dFRvT2JqZWN0KGNvbG9yKSB7XG5cbiAgICBjb2xvciA9IGNvbG9yLnJlcGxhY2UodHJpbUxlZnQsJycpLnJlcGxhY2UodHJpbVJpZ2h0LCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICB2YXIgbmFtZWQgPSBmYWxzZTtcbiAgICBpZiAobmFtZXNbY29sb3JdKSB7XG4gICAgICAgIGNvbG9yID0gbmFtZXNbY29sb3JdO1xuICAgICAgICBuYW1lZCA9IHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNvbG9yID09ICd0cmFuc3BhcmVudCcpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogMCwgZzogMCwgYjogMCwgYTogMCwgZm9ybWF0OiBcIm5hbWVcIiB9O1xuICAgIH1cblxuICAgIC8vIFRyeSB0byBtYXRjaCBzdHJpbmcgaW5wdXQgdXNpbmcgcmVndWxhciBleHByZXNzaW9ucy5cbiAgICAvLyBLZWVwIG1vc3Qgb2YgdGhlIG51bWJlciBib3VuZGluZyBvdXQgb2YgdGhpcyBmdW5jdGlvbiAtIGRvbid0IHdvcnJ5IGFib3V0IFswLDFdIG9yIFswLDEwMF0gb3IgWzAsMzYwXVxuICAgIC8vIEp1c3QgcmV0dXJuIGFuIG9iamVjdCBhbmQgbGV0IHRoZSBjb252ZXJzaW9uIGZ1bmN0aW9ucyBoYW5kbGUgdGhhdC5cbiAgICAvLyBUaGlzIHdheSB0aGUgcmVzdWx0IHdpbGwgYmUgdGhlIHNhbWUgd2hldGhlciB0aGUgdGlueWNvbG9yIGlzIGluaXRpYWxpemVkIHdpdGggc3RyaW5nIG9yIG9iamVjdC5cbiAgICB2YXIgbWF0Y2g7XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLnJnYi5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0Y2hbMV0sIGc6IG1hdGNoWzJdLCBiOiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMucmdiYS5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgcjogbWF0Y2hbMV0sIGc6IG1hdGNoWzJdLCBiOiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzbC5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCBsOiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHNsYS5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCBsOiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhzdi5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCB2OiBtYXRjaFszXSB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaHN2YS5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHsgaDogbWF0Y2hbMV0sIHM6IG1hdGNoWzJdLCB2OiBtYXRjaFszXSwgYTogbWF0Y2hbNF0gfTtcbiAgICB9XG4gICAgaWYgKChtYXRjaCA9IG1hdGNoZXJzLmhleDguZXhlYyhjb2xvcikpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSksXG4gICAgICAgICAgICBhOiBjb252ZXJ0SGV4VG9EZWNpbWFsKG1hdGNoWzRdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4OFwiXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXg2LmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdKSxcbiAgICAgICAgICAgIGc6IHBhcnNlSW50RnJvbUhleChtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXhcIlxuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoKG1hdGNoID0gbWF0Y2hlcnMuaGV4NC5leGVjKGNvbG9yKSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50RnJvbUhleChtYXRjaFsxXSArICcnICsgbWF0Y2hbMV0pLFxuICAgICAgICAgICAgZzogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzJdICsgJycgKyBtYXRjaFsyXSksXG4gICAgICAgICAgICBiOiBwYXJzZUludEZyb21IZXgobWF0Y2hbM10gKyAnJyArIG1hdGNoWzNdKSxcbiAgICAgICAgICAgIGE6IGNvbnZlcnRIZXhUb0RlY2ltYWwobWF0Y2hbNF0gKyAnJyArIG1hdGNoWzRdKSxcbiAgICAgICAgICAgIGZvcm1hdDogbmFtZWQgPyBcIm5hbWVcIiA6IFwiaGV4OFwiXG4gICAgICAgIH07XG4gICAgfVxuICAgIGlmICgobWF0Y2ggPSBtYXRjaGVycy5oZXgzLmV4ZWMoY29sb3IpKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnRGcm9tSGV4KG1hdGNoWzFdICsgJycgKyBtYXRjaFsxXSksXG4gICAgICAgICAgICBnOiBwYXJzZUludEZyb21IZXgobWF0Y2hbMl0gKyAnJyArIG1hdGNoWzJdKSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50RnJvbUhleChtYXRjaFszXSArICcnICsgbWF0Y2hbM10pLFxuICAgICAgICAgICAgZm9ybWF0OiBuYW1lZCA/IFwibmFtZVwiIDogXCJoZXhcIlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVXQ0FHMlBhcm1zKHBhcm1zKSB7XG4gICAgLy8gcmV0dXJuIHZhbGlkIFdDQUcyIHBhcm1zIGZvciBpc1JlYWRhYmxlLlxuICAgIC8vIElmIGlucHV0IHBhcm1zIGFyZSBpbnZhbGlkLCByZXR1cm4ge1wibGV2ZWxcIjpcIkFBXCIsIFwic2l6ZVwiOlwic21hbGxcIn1cbiAgICB2YXIgbGV2ZWwsIHNpemU7XG4gICAgcGFybXMgPSBwYXJtcyB8fCB7XCJsZXZlbFwiOlwiQUFcIiwgXCJzaXplXCI6XCJzbWFsbFwifTtcbiAgICBsZXZlbCA9IChwYXJtcy5sZXZlbCB8fCBcIkFBXCIpLnRvVXBwZXJDYXNlKCk7XG4gICAgc2l6ZSA9IChwYXJtcy5zaXplIHx8IFwic21hbGxcIikudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAobGV2ZWwgIT09IFwiQUFcIiAmJiBsZXZlbCAhPT0gXCJBQUFcIikge1xuICAgICAgICBsZXZlbCA9IFwiQUFcIjtcbiAgICB9XG4gICAgaWYgKHNpemUgIT09IFwic21hbGxcIiAmJiBzaXplICE9PSBcImxhcmdlXCIpIHtcbiAgICAgICAgc2l6ZSA9IFwic21hbGxcIjtcbiAgICB9XG4gICAgcmV0dXJuIHtcImxldmVsXCI6bGV2ZWwsIFwic2l6ZVwiOnNpemV9O1xufVxuXG4vLyBOb2RlOiBFeHBvcnQgZnVuY3Rpb25cbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0aW55Y29sb3I7XG59XG4vLyBBTUQvcmVxdWlyZWpzOiBEZWZpbmUgdGhlIG1vZHVsZVxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtyZXR1cm4gdGlueWNvbG9yO30pO1xufVxuLy8gQnJvd3NlcjogRXhwb3NlIHRvIHdpbmRvd1xuZWxzZSB7XG4gICAgd2luZG93LnRpbnljb2xvciA9IHRpbnljb2xvcjtcbn1cblxufSkoTWF0aCk7XG4iXX0=
