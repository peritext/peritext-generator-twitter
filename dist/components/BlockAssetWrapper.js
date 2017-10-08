'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This module exports a stateless reusable block asset wrapper component
 * It handles the connection to context's data and builds proper data to render the asset
 * ============
 */
var BlockAssetWrapper = function BlockAssetWrapper(_ref, context) {
  var data = _ref.data;

  var assetId = data.asset.id;
  var contextualization = context.story && context.story.contextualizations && context.story.contextualizations[assetId];
  if (!contextualization) {
    return null;
  }
  var story = context.story;
  var contextualizer = story.contextualizers[contextualization.contextualizerId];
  var resource = story.resources[contextualization.resourceId];
  var dimensions = context.dimensions || {};
  var fixedPresentationId = context.fixedPresentationId;
  var onPresentationExit = context.onPresentationExit;
  var inNote = context.inNote;
  var contextualizers = context.contextualizers;
  var contextualizerModule = contextualizers[contextualizer.type];

  var Component = contextualizerModule && contextualizerModule.BlockStatic;

  if (contextualization && Component) {
    var hideInCodexMode = contextualizer.visibility !== undefined ? !contextualizer.visibility.codex : false;
    return hideInCodexMode ? null : _react2.default.createElement(
      'figure',
      {
        className: 'block-contextualization-container ' + contextualizer.type,
        style: {
          position: 'relative',
          minHeight: contextualizer.type === 'data-presentation' ? dimensions.height : '20px'
        },
        id: assetId },
      _react2.default.createElement(Component, {
        resource: resource,
        contextualizer: contextualizer,
        contextualization: contextualization,

        fixed: fixedPresentationId === assetId,
        allowInteractions: inNote || fixedPresentationId === assetId
      }),
      _react2.default.createElement(
        'figcaption',
        null,
        _react2.default.createElement(
          'h4',
          null,
          contextualization.title || resource.metadata.title
        ),
        _react2.default.createElement(
          'p',
          null,
          contextualization.legend || resource.metadata.description
        ),
        resource.metadata.source && _react2.default.createElement(
          'p',
          null,
          'Source: ',
          _react2.default.createElement(
            'i',
            null,
            resource.metadata.source
          )
        )
      )
    );
  } else {
    return null;
  }
};
/**
 * Component's properties types
 */
BlockAssetWrapper.propTypes = {
  /**
   * Corresponds to the data initially embedded in a draft-js entity
   */
  data: _propTypes2.default.shape({
    asset: _propTypes2.default.shape({
      id: _propTypes2.default.string
    })
  })
};
/**
 * Component's context used properties
 */
BlockAssetWrapper.contextTypes = {
  /**
   * The active story data
   */
  story: _propTypes2.default.object,
  /**
   * Dimensions of the wrapping element
   */
  dimensions: _propTypes2.default.object,
  /**
   * Id of the presentation being displayed full screen if any
   */
  fixedPresentationId: _propTypes2.default.string,
  /**
   * Whether the block asset is displayed in a note (and not in main content)
   */
  inNote: _propTypes2.default.bool,

  contextualizers: _propTypes2.default.object
};

exports.default = BlockAssetWrapper;