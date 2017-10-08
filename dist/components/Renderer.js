'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _redraft = require('redraft');

var _redraft2 = _interopRequireDefault(_redraft);

var _reactCiteproc = require('react-citeproc');

var _BlockAssetWrapper = require('./BlockAssetWrapper');

var _BlockAssetWrapper2 = _interopRequireDefault(_BlockAssetWrapper);

var _InlineAssetWrapper = require('./InlineAssetWrapper');

var _InlineAssetWrapper2 = _interopRequireDefault(_InlineAssetWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import NotePointer from './NotePointer';
// import Footnote from './Footnote';

// just a helper to add a <br /> after each block


// import Link from './Link';
/**
 * This module exports a statefull reusable draft-js raw-to-react renderer component
 * It wrapps around the redraft engine that converts draft-s raw to a react representation,
 * providing it specific settings and callbacks.
 */
var addBreaklines = function addBreaklines(children) {
  return children.map(function (child) {
    return [child, _react2.default.createElement('br', null)];
  });
};

/**
 * Define the renderers
 */
var renderers = {
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: function BOLD(children, _ref) {
      var key = _ref.key;
      return _react2.default.createElement(
        'strong',
        { key: key },
        children
      );
    },
    ITALIC: function ITALIC(children, _ref2) {
      var key = _ref2.key;
      return _react2.default.createElement(
        'em',
        { key: key },
        children
      );
    },
    UNDERLINE: function UNDERLINE(children, _ref3) {
      var key = _ref3.key;
      return _react2.default.createElement(
        'u',
        { key: key },
        children
      );
    },
    CODE: function CODE(children, _ref4) {
      var key = _ref4.key;
      return _react2.default.createElement(
        'span',
        { key: key },
        children
      );
    }
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    'unstyled': function unstyled(children) {
      return children.map(function (child) {
        return _react2.default.createElement(
          'p',
          null,
          child
        );
      });
    },
    'blockquote': function blockquote(children) {
      return _react2.default.createElement(
        'blockquote',
        null,
        addBreaklines(children)
      );
    },
    'header-one': function headerOne(children, _ref5) {
      var keys = _ref5.keys;
      return children.map(function (child, index) {
        return _react2.default.createElement(
          'h1',
          { key: index, id: keys[index] },
          child
        );
      });
    },
    'header-two': function headerTwo(children, _ref6) {
      var keys = _ref6.keys;
      return children.map(function (child, index) {
        return _react2.default.createElement(
          'h2',
          { key: index, id: keys[index] },
          child
        );
      });
    },
    'header-three': function headerThree(children, _ref7) {
      var keys = _ref7.keys;
      return children.map(function (child, index) {
        return _react2.default.createElement(
          'h3',
          { key: index, id: keys[index] },
          child
        );
      });
    },
    'header-four': function headerFour(children, _ref8) {
      var keys = _ref8.keys;
      return children.map(function (child, index) {
        return _react2.default.createElement(
          'h4',
          { key: index, id: keys[index] },
          child
        );
      });
    },
    'header-five': function headerFive(children, _ref9) {
      var keys = _ref9.keys;
      return children.map(function (child, index) {
        return _react2.default.createElement(
          'h5',
          { key: index, id: keys[index] },
          child
        );
      });
    },
    'header-six': function headerSix(children, _ref10) {
      var keys = _ref10.keys;
      return children.map(function (child, index) {
        return _react2.default.createElement(
          'h6',
          { key: index, id: keys[index] },
          child
        );
      });
    },

    // You can also access the original keys of the blocks
    'code-block': function codeBlock(children, _ref11) {
      var keys = _ref11.keys;
      return _react2.default.createElement(
        'pre',
        { key: keys[0] },
        addBreaklines(children)
      );
    },
    // or depth for nested lists
    'unordered-list-item': function unorderedListItem(children, _ref12) {
      var depth = _ref12.depth,
          keys = _ref12.keys;
      return _react2.default.createElement(
        'ul',
        { key: keys[keys.length - 1], className: 'ul-level-' + depth },
        children.map(function (child, index) {
          return _react2.default.createElement(
            'li',
            { key: index },
            child
          );
        })
      );
    },
    'ordered-list-item': function orderedListItem(children, _ref13) {
      var depth = _ref13.depth,
          keys = _ref13.keys;
      return _react2.default.createElement(
        'ol',
        { key: keys.join('|'), className: 'ol-level-' + depth },
        children.map(function (child, index) {
          return _react2.default.createElement(
            'li',
            { key: keys[index] },
            child
          );
        })
      );
    }
    // If your blocks use meta data it can also be accessed like keys
    // atomic: (children, { keys, data }) => children.map((child, i) => <Atomic key={keys[i]} {...data[i]}>{child}</Atomic>),
  },
  /**
   * Entities receive children and the entity data
   */
  entities: {
    //   // key is the entity key value from raw
    LINK: function LINK(children, data, _ref14) {
      var key = _ref14.key;
      return (
        // <Link key={key} to={data.url}>{children}</Link>,
        _react2.default.createElement(
          'span',
          { className: 'link' },
          children
        )
      );
    },
    BLOCK_ASSET: function BLOCK_ASSET(children, data, _ref15) {
      var key = _ref15.key;

      return _react2.default.createElement(_BlockAssetWrapper2.default, { key: key, data: data });
    },
    INLINE_ASSET: function INLINE_ASSET(children, data, _ref16) {
      var key = _ref16.key;

      return _react2.default.createElement(_InlineAssetWrapper2.default, { data: data, key: key });
    },
    NOTE_POINTER: function NOTE_POINTER(children, data, _ref17) {
      var key = _ref17.key;

      return _react2.default.createElement('span', null);
      // return <NotePointer key={key} children={children} noteId={data.noteId} />;
    }
  }
};

/**
 * Renderer class for building raw-to-react rendering react component instances
 */

var Renderer = function (_Component) {
  (0, _inherits3.default)(Renderer, _Component);

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  function Renderer(props) {
    (0, _classCallCheck3.default)(this, Renderer);
    return (0, _possibleConstructorReturn3.default)(this, (Renderer.__proto__ || (0, _getPrototypeOf2.default)(Renderer)).call(this, props));
  }

  (0, _createClass3.default)(Renderer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        story: this.props.story,
        contextualizers: this.props.contextualizers
      };
    }

    /**
     * Determines whether to update the component or not
     * @param {object} nextProps - the future properties of the component
     * @return {boolean} shouldUpdate - yes or no
     */

  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return true;
      // return this.props.raw !== nextProps.raw;
    }

    /**
     * Displays something when no suitable content state is provided to the renderer
     * @return {ReactElement} default message
     */

  }, {
    key: 'renderWarning',
    value: function renderWarning() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'p',
          null,
          'Intentionnellement vide.'
        )
      );
    }

    /**
     * Renders the component
     * @return {ReactElement} component - the component
     */

  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          raw = _props.raw,
          citationStyle = _props.citationStyle,
          citationLocale = _props.citationLocale,
          citations = _props.citations;

      if (!raw) {
        return this.renderWarning();
      }
      var rendered = (0, _redraft2.default)(raw, renderers);
      // redraft can return a null if there's nothing to render
      if (!rendered) {
        return this.renderWarning();
      }
      return _react2.default.createElement(
        _reactCiteproc.ReferencesManager,
        {
          style: citationStyle,
          locale: citationLocale,
          items: citations.citationItems,
          citations: citations.citationData,
          componentClass: 'references-manager'
        },
        rendered
      );
    }
  }]);
  return Renderer;
}(_react.Component);

Renderer.childContextTypes = {
  story: _propTypes2.default.object,
  contextualizers: _propTypes2.default.object

  /**
   * Component's properties types
   */
};Renderer.propTypes = {
  /**
   * Draft-js raw representation of some contents
   * see https://draftjs.org/docs/api-reference-data-conversion.html
   */
  raw: _propTypes2.default.object
};

exports.default = Renderer;