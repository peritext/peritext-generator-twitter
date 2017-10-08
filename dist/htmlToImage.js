'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webshot = require('webshot');

var _webshot2 = _interopRequireDefault(_webshot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (html, path, callback) {
  (0, _webshot2.default)(html, path, {
    siteType: 'html',
    windowSize: {
      width: 900,
      // height: 450
      height: 10 // setting a mini height to have well formed images
    },
    shotSize: {
      width: 'all',
      height: 'all'
    }
  }, function (err) {
    callback(err);
  });
};