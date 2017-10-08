'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require('async');

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _htmlToImage = require('./htmlToImage');

var _htmlToImage2 = _interopRequireDefault(_htmlToImage);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (items, imagesDir, callback) {
  console.log('writing images');
  var bar = new _progress2.default(':bar :percent  :current/:total', { total: items.length });
  (0, _async.mapSeries)(items, function (item, cb) {
    bar.tick();
    var path = (0, _path.resolve)(imagesDir + '/' + item.id + '.jpg');
    (0, _htmlToImage2.default)(item.html, path, cb);
  }, callback);
};