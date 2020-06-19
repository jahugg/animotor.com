"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _article = _interopRequireDefault(require("./../media/info/article.md"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function render() {
  var main = document.getElementById("main");
  main.innerHTML = "<article class=\"info\">" + _article["default"] + "</article>";
}