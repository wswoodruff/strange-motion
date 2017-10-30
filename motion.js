'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var T = require('prop-types');
var StrangeMotion = require('./index');

var _require = require('react-motion'),
    ReactMotion = _require.Motion;

var _require2 = require('./utils'),
    assignAnimConfig = _require2.assignAnimConfig;

// Component

module.exports = (_temp = _class = function (_StrangeMotion) {
    (0, _inherits3.default)(Motion, _StrangeMotion);

    function Motion(props) {
        (0, _classCallCheck3.default)(this, Motion);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Motion.__proto__ || (0, _getPrototypeOf2.default)(Motion)).call(this, props));

        _this.setRef = _this._setRef.bind(_this);
        _this.setAnimController = _this._setAnimController.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Motion, [{
        key: 'componentWillMount',
        value: function componentWillMount() {

            this.setAnimController(this.props.animConfig);
            this.playProp = 'enter';
        }
    }, {
        key: '_setAnimController',
        value: function _setAnimController(userAnimConfig) {
            var _this2 = this;

            var animConfig = this.state.animConfig;


            var mergedAnimConfig = (0, _assign2.default)({}, animConfig, userAnimConfig);

            var animControllerApi = {
                play: function play(animNameOrConfig) {

                    if (typeof animNameOrConfig === 'string') {
                        _this2.playProp = animNameOrConfig;
                        _this2.forceUpdate();
                    }

                    if ((typeof animNameOrConfig === 'undefined' ? 'undefined' : (0, _typeof3.default)(animNameOrConfig)) === 'object') {

                        _this2.playProp = 'enter';

                        _this2.assignAnimConfig({
                            newAnimConfig: {
                                enter: animNameOrConfig
                            }
                        });
                    }
                },
                mergeAnimConfig: function mergeAnimConfig(animConfig) {

                    _this2.assignAnimConfig({
                        newAnimConfig: animConfig
                    });
                },
                replay: function replay() {

                    console.warn('replay not implemented yet, sorry!');
                }
            };

            this.animController = (0, _keys2.default)(mergedAnimConfig).reduce(function (collector, animName) {

                collector[animName] = function (plugins) {

                    animControllerApi.play(animName);
                };
                return collector;
            }, animControllerApi);

            if (this.props.getAnimController) {
                return this.props.getAnimController(this.animController);
            }
        }
    }, {
        key: '_setRef',
        value: function _setRef(refName) {
            var _this3 = this;

            return function (ref) {
                _this3[refName] = ref;
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var children = this.props.children;

            // ReactMotion is only built for a single child, so that's what
            // the '[0]' in 'this.getDefaultStyles()[0]' is about

            // 'ref={this.setRef('reactMotion')}' sets the this.reactMotion ref
            // used in strange-motion/index.js

            var newPlayProp = this.playProp || 'enter';

            return React.createElement(
                ReactMotion,
                {
                    defaultStyle: this.getDefaultStyles()[0].style,
                    style: this.getStyles(newPlayProp)[0].style,
                    ref: this.setRef('reactMotion')
                },
                function (interpolatedStyles) {

                    return _this4.getChildren(interpolatedStyles);
                }
            );
        }
    }]);
    return Motion;
}(StrangeMotion), _class.propTypes = {
    getAnimController: T.func,
    animConfig: T.object,
    children: T.any.isRequired
}, _temp);