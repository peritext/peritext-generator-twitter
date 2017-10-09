'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _lodash = require('lodash');

var _arrayShuffle = require('array-shuffle');

var _arrayShuffle2 = _interopRequireDefault(_arrayShuffle);

var _peritextRenderingUtils = require('peritext-rendering-utils');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _uuid = require('uuid');

var _fs = require('fs');

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _html2plaintext = require('html2plaintext');

var _html2plaintext2 = _interopRequireDefault(_html2plaintext);

var _Renderer = require('./components/Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _writeImages = require('./writeImages');

var _writeImages2 = _interopRequireDefault(_writeImages);

var _makeTags = require('./makeTags');

var _makeTags2 = _interopRequireDefault(_makeTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var story = _ref.story,
      _ref$imagesFolder = _ref.imagesFolder,
      imagesFolder = _ref$imagesFolder === undefined ? './temp' : _ref$imagesFolder,
      _ref$dataPath = _ref.dataPath,
      dataPath = _ref$dataPath === undefined ? './temp' : _ref$dataPath,
      contextualizers = _ref.contextualizers,
      _ref$cssStyle = _ref.cssStyle,
      cssStyle = _ref$cssStyle === undefined ? '' : _ref$cssStyle,
      fontUrl = _ref.fontUrl,
      _ref$locale = _ref.locale,
      locale = _ref$locale === undefined ? 'fr' : _ref$locale,
      _ref$displayText = _ref.displayText,
      displayText = _ref$displayText === undefined ? true : _ref$displayText,
      _ref$minBlockCharLeng = _ref.minBlockCharLength,
      minBlockCharLength = _ref$minBlockCharLeng === undefined ? 100 : _ref$minBlockCharLeng,
      _ref$includeHeaders = _ref.includeHeaders,
      includeHeaders = _ref$includeHeaders === undefined ? false : _ref$includeHeaders,
      _ref$includeBlockCont = _ref.includeBlockContextualizations,
      includeBlockContextualizations = _ref$includeBlockCont === undefined ? true : _ref$includeBlockCont,
      _ref$excludeBlockCont = _ref.excludeBlockContextualizationTypes,
      excludeBlockContextualizationTypes = _ref$excludeBlockCont === undefined ? [] : _ref$excludeBlockCont,
      _ref$ordering = _ref.ordering,
      ordering = _ref$ordering === undefined ? 'shuffle' : _ref$ordering,
      makeLink = _ref.makeLink,
      _ref$prefix = _ref.prefix,
      prefix = _ref$prefix === undefined ? '' : _ref$prefix,
      _ref$suffix = _ref.suffix,
      suffix = _ref$suffix === undefined ? '#peritext-twitter' : _ref$suffix,
      _ref$displayTags = _ref.displayTags,
      displayTags = _ref$displayTags === undefined ? true : _ref$displayTags,
      _ref$weightedTags = _ref.weightedTags,
      weightedTags = _ref$weightedTags === undefined ? true : _ref$weightedTags,
      _ref$tagsStopWords = _ref.tagsStopWords,
      tagsStopWords = _ref$tagsStopWords === undefined ? [] : _ref$tagsStopWords,
      callback = _ref.callback;

  // typograph
  // 1. select all the blocks
  var blocks = (0, _keys2.default)(story.sections).reduce(function (blocks, sectionId) {
    return blocks.concat(story.sections[sectionId].contents.blocks
    // don't use li and ul list items
    .filter(function (block) {
      return block.type !== 'unordered-list-item' && block.type !== 'ordered-list-item';
    }).filter(function (block) {
      return includeHeaders ? true : block.type.indexOf('header-') !== 0;
    }).filter(function (block) {
      return includeBlockContextualizations ? true : block.type !== 'atomic';
    })
    // filter out malformed attomic
    .filter(function (block) {
      // filter blocks to short
      if (block.type !== 'atomic') {
        return block.text.length >= minBlockCharLength;
      }
      // filter empty contextualizations
      else if (block.entityRanges && block.entityRanges[0]) {
          var entityId = '' + block.entityRanges[0].key;
          var entity = story.sections[sectionId].contents.entityMap[entityId];
          var contextualizationId = entity.data.asset.id;
          var contextualization = story.contextualizations[contextualizationId];
          var contextualizerId = story.contextualizations[contextualizationId].contextualizerId;
          var contextualizer = story.contextualizers[contextualizerId];
          // do not display contextualizations hidden in fragments
          if (contextualizer.visibility && contextualizer.visibility.fragment !== undefined) {
            return !contextualizer.visibility.fragment;
          }
          return true;
        } else return false;
    })
    // @todo: reput typography improvement
    // but with a way that does not mess up with entities indexes
    // .map(block => ({
    //   ...block,
    //   text: typographicBase(block.text, {locale})// tp.execute(block.text)
    // }))
    .map(function (block) {
      return {
        blocks: [block],
        entityMap: story.sections[sectionId].contents.entityMap,
        sectionId: sectionId,
        id: (0, _uuid.v4)()
      };
    }));
  }, []);

  if (ordering === 'shuffle') {
    blocks = (0, _arrayShuffle2.default)(blocks);
  } else if (ordering === 'reverse') {
    blocks = reverse(blocks);
  }
  var bar = new _progress2.default('rendering :bar :percent  :current/:total', { total: blocks.length });

  var citations = (0, _peritextRenderingUtils.buildCitations)(story);

  var citationStyle = story.settings.citationStyle.data;
  var citationLocale = story.settings.citationLocale.data;

  // render each block as plain html
  blocks = blocks.map(function (block, index) {
    bar.tick();
    console.log('rendering excerpt to html', index + 1 + '/' + blocks.length);
    var storyTitle = story.metadata.title;
    var sectionTitle = story.sections[block.sectionId].metadata.title;
    var Comp = _react2.default.createElement(
      'html',
      null,
      _react2.default.createElement(
        'head',
        null,
        fontUrl && _react2.default.createElement('link', { href: fontUrl, rel: 'stylesheet' }),
        _react2.default.createElement(
          'style',
          null,
          cssStyle
        )
      ),
      _react2.default.createElement(
        'body',
        null,
        _react2.default.createElement(
          'div',
          { className: 'excerpt' },
          _react2.default.createElement(_Renderer2.default, {
            raw: block,
            citations: citations,
            citationStyle: citationStyle,
            citationLocale: citationLocale,
            story: story,
            contextualizers: contextualizers
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'footer' },
          _react2.default.createElement(
            'i',
            null,
            _react2.default.createElement(
              'b',
              null,
              storyTitle
            )
          ),
          ' \u2013 ',
          _react2.default.createElement(
            'i',
            null,
            sectionTitle
          )
        )
      )
    );

    var html = _server2.default.renderToStaticMarkup(Comp);
    // plain text
    var text = (0, _html2plaintext2.default)(_server2.default.renderToStaticMarkup(_react2.default.createElement(_Renderer2.default, {
      raw: block,
      citations: citations,
      citationStyle: citationStyle,
      citationLocale: citationLocale,
      story: story,
      contextualizers: contextualizers
    })));
    var tags = (0, _makeTags2.default)(text, tagsStopWords);
    return (0, _extends3.default)({}, block, {
      html: html,
      text: text,
      tags: tags
    });
  });

  // build tweets tags map (to have weighted tags)
  console.log('preparing hashtags');
  var tagsMap = {};
  blocks.forEach(function (block) {
    block.tags.forEach(function (tag) {
      tagsMap[tag] = tagsMap[tag] ? tagsMap[tag] + 1 : 1;
    });
  });

  // build tweets messages
  console.log('preparing tweets messages');
  blocks = blocks.map(function (block) {
    var type = block.blocks[0].type;
    var message = prefix;

    if (makeLink && typeof makeLink === 'function') {
      message += makeLink(block);
    }
    var tags = block.tags.sort(function (a, b) {
      if (tagsMap[a] > tagsMap[b]) {
        return -1;
      } else return 1;
    });
    message += ' #' + tags.join(' #');
    message = message.trim();
    if (message.length >= 140) {
      while (message.length > 140 - suffix.length) {
        var parts = message.split(' ');
        parts.pop();
        message = parts.join(' ');
      }
    }
    message += ' ' + suffix;

    message = message.length <= 140 ? message : message.substr(0, 137) + '...';
    return (0, _extends3.default)({}, block, {
      message: message
    });
  });

  // write data
  (0, _fs.writeFileSync)(dataPath, (0, _stringify2.default)({ tweets: blocks, tagsMap: tagsMap }, null, 2), 'utf8');
  // write images
  (0, _writeImages2.default)(blocks, imagesFolder, function (err) {
    return callback(err, blocks);
  });
};
// import typographicBase from 'peritext-typography';