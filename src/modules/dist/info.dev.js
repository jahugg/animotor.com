"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _contentInfo = _interopRequireDefault(require("./../media/content-info.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function render() {
  var main = document.getElementById("main");
  main.innerHTML = "<article class=\"info\">" + _contentInfo["default"] + "</article>";
}