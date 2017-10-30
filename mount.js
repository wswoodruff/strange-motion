'use strict';

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var StrangeMotion = require('./index');

var _require = require('react-motion'),
    TransitionMotion = _require.TransitionMotion;

// Component

module.exports = function (_StrangeMotion) {
    (0, _inherits3.default)(MountMotion, _StrangeMotion);

    function MountMotion(props) {
        (0, _classCallCheck3.default)(this, MountMotion);

        var _this = (0, _possibleConstructorReturn3.default)(this, (MountMotion.__proto__ || (0, _getPrototypeOf2.default)(MountMotion)).call(this, props));

        _this.setRef = _this._setRef.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(MountMotion, [{
        key: '_setRef',
        value: function _setRef(refName) {
            var _this2 = this;

            return function (ref) {
                _this2[refName] = ref;
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return React.createElement(
                TransitionMotion,
                {
                    defaultStyles: this.getDefaultStyles(),
                    styles: this.getStyles(),
                    willEnter: this.willEnter,
                    willLeave: this.willLeave,
                    ref: this.setRef('reactMotion')
                },
                function (interpolatedStyles) {

                    return _this3.getChildren(interpolatedStyles);
                }
            );
        }
    }]);
    return MountMotion;
}(StrangeMotion);