'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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
var Motion = require('./motion');
var Utils = require('./utils');

// Component

module.exports = (_temp = _class = function (_React$PureComponent) {
    (0, _inherits3.default)(MultiMotion, _React$PureComponent);

    function MultiMotion(props) {
        (0, _classCallCheck3.default)(this, MultiMotion);

        var _this = (0, _possibleConstructorReturn3.default)(this, (MultiMotion.__proto__ || (0, _getPrototypeOf2.default)(MultiMotion)).call(this, props));

        var children = Utils.getElementsFromChildren(props.children);
        var configKeys = (0, _keys2.default)(props.animConfigs);
        var childrenByKeys = _this._getModelByKeys(props.children);

        var _Object$keys$reduce = (0, _keys2.default)(props.animConfigs).reduce(function (collector, animKey) {

            var anim = props.animConfigs[animKey];
            var child = childrenByKeys[animKey];

            if (!!anim.$delay) {

                var $delay = anim.$delay;

                // delete the $delay for the future animConfig
                // or we'd be in an infinite loop right?

                delete anim.$delay;

                collector.delayConfigs.push({
                    delayAnimConfig: { key: animKey, val: anim },
                    delayChild: child,
                    $delay: $delay
                });
            } else {
                collector.immediateAnimConfigs[animKey] = anim;
                collector.immediateChildren.push(child);
            }

            return collector;
        }, {
            delayConfigs: [],
            immediateAnimConfigs: {},
            immediateChildren: []
        }),
            delayConfigs = _Object$keys$reduce.delayConfigs,
            immediateAnimConfigs = _Object$keys$reduce.immediateAnimConfigs,
            immediateChildren = _Object$keys$reduce.immediateChildren;

        var immediateAnimConfigsWithDefaults = (0, _keys2.default)(immediateAnimConfigs).reduce(function (collector, animKey) {

            // 'Utils.assignDefaultsToAnimConfig' handles
            // $delay set for individual css props

            collector[animKey] = Utils.assignDefaultsToAnimConfig(immediateAnimConfigs[animKey]);

            return collector;
        }, {});

        var self = _this;

        _this.animControllers = {};

        _this.state = (0, _assign2.default)({}, _this.state, {
            model: immediateChildren,
            animConfigs: immediateAnimConfigsWithDefaults
        });

        /*
            delayConfig's schema
            [{
                delayAnimConfig,
                delayChild,
                $delay
            }]
        */

        delayConfigs.forEach(function (delayConfig) {
            var delayAnimConfig = delayConfig.delayAnimConfig,
                delayChild = delayConfig.delayChild,
                $delay = delayConfig.$delay;


            setTimeout(function () {

                var currentAnimConfigs = _this.state.animConfigs;
                var currentModel = _this.state.model;
                delete delayAnimConfig.$delay;

                // Can process nested $delays set here
                var delayedAnimConfigWithDefaults = Utils.assignDefaultsToAnimConfig(delayAnimConfig);

                var newAnimConfigs = (0, _extends4.default)({}, currentAnimConfigs, (0, _defineProperty3.default)({}, delayedAnimConfigWithDefaults.key, delayedAnimConfigWithDefaults.val));

                var newModel = [].concat((0, _toConsumableArray3.default)(currentModel), [delayChild]);

                _this.setState({
                    model: newModel,
                    animConfigs: newAnimConfigs
                });
            }, $delay);
        });

        _this.getModelByKeys = _this._getModelByKeys.bind(_this);
        _this.setAnimController = _this._setAnimController.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(MultiMotion, [{
        key: '_getModelByKeys',
        value: function _getModelByKeys(model) {

            var newModel = model;

            if ((typeof model === 'undefined' ? 'undefined' : (0, _typeof3.default)(model)) === 'object' && !Array.isArray(model)) {

                newModel = [].concat(model);
            }

            return newModel.reduce(function (collector, child) {

                collector[child.key] = child;
                return collector;
            }, {});
        }
    }, {
        key: '_setAnimController',
        value: function _setAnimController(animName) {
            var _this2 = this;

            var animConfigs = this.state.animConfigs;
            var getAnimControllers = this.props.getAnimControllers;


            return function (animController) {
                var animConfigs = _this2.state.animConfigs;


                var newAnimControllers = (0, _assign2.default)({}, (0, _extends4.default)({}, _this2.animControllers), (0, _defineProperty3.default)({}, animName, animController));

                _this2.animControllers = newAnimControllers;

                if (typeof getAnimControllers === 'function') {
                    getAnimControllers(_this2.animControllers);
                }
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var _state = this.state,
                model = _state.model,
                animConfigs = _state.animConfigs;


            var modelByKeys = this.getModelByKeys(model);

            var controlledAnimConfigs = (0, _keys2.default)(animConfigs).reduce(function (collector, animName) {

                collector[animName] = animConfigs[animName];

                return collector;
            }, {});

            return React.createElement(
                'div',
                null,
                (0, _keys2.default)(controlledAnimConfigs).map(function (animName) {
                    return React.createElement(
                        Motion,
                        {
                            animConfig: controlledAnimConfigs[animName],
                            getAnimController: _this3.setAnimController(animName),
                            key: animName
                        },
                        modelByKeys[animName]
                    );
                })
            );
        }
    }]);
    return MultiMotion;
}(React.PureComponent), _class.propTypes = {
    animConfigs: T.object.isRequired,
    children: T.any.isRequired,
    getAnimControllers: T.func
}, _temp);