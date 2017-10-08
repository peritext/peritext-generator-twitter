'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _citationJs = require('citation-js');

var _citationJs2 = _interopRequireDefault(_citationJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (item, loc) {
    var cit = new _citationJs2.default(item, {
        format: 'string',
        type: 'bibtex'
    });
    return cit.get({
        format: 'string',
        type: 'html',
        style: 'citation-apa',
        append: ' ' + loc,
        lang: 'fr-FR'
    });
};