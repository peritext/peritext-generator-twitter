'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var stops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var stripped = str.replace(/[.,'\/#!$%\^&\*;:{}=\"_`~()]/g, " ");
  var splitted = stripped.split(' ');
  return splitted.filter(function (obj) {
    return obj.length > 1;
  }).map(function (word) {
    return word.toLowerCase();
  }).filter(function (word) {
    var bro = stops.find(function (stop) {
      return stop === word;
    });
    return bro === undefined;
  })
  // uniques
  .filter(function (w1, i1) {
    var other = splitted.find(function (w2, i2) {
      return w1.toLowerCase() === w2.toLowerCase() && i1 !== i2;
    });
    return other === undefined;
  });
};