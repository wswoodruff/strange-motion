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

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var React = require('react');
var T = require('prop-types');
var StrangeMotion = require('./index');

var _require = require('react-motion'),
    TransitionMotion = _require.TransitionMotion;

// Component

module.exports = (_temp = _class = function (_StrangeMotion) {
    (0, _inherits3.default)(ToggleMotion, _StrangeMotion);

    function ToggleMotion(props) {
        (0, _classCallCheck3.default)(this, ToggleMotion);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ToggleMotion.__proto__ || (0, _getPrototypeOf2.default)(ToggleMotion)).call(this, props));

        _this.setRef = _this._setRef.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(ToggleMotion, [{
        key: '_setRef',
        value: function _setRef(refName) {
            var _this2 = this;

            return function (ref) {
                _this2[refName] = ref;
            };
        }
    }, {
        key: 'filterChildrenForType',
        value: function filterChildrenForType(children) {
            var trigger = this.props.trigger;


            if (trigger === true) {
                return children.filter(function (child) {

                    return child.key === 'on';
                });
            } else if (trigger === false) {
                return children.filter(function (child) {

                    return child.key === 'off';
                });
            }

            throw new Error('ToggleMotion: Bad value for trigger: ' + trigger);
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
    return ToggleMotion;
}(StrangeMotion), _class.propTypes = {
    trigger: T.bool,
    animConfig: T.shape({
        start: T.object,
        enter: T.object,
        leave: T.object.isRequired
    })
}, _temp);