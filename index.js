'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _require = require('react-motion'),
    spring = _require.spring;

var Utils = require('./utils');
var _merge = require('lodash/merge');

module.exports = (_temp = _class = function (_React$PureComponent) {
    (0, _inherits3.default)(StrangeMotion, _React$PureComponent);

    function StrangeMotion(props) {
        (0, _classCallCheck3.default)(this, StrangeMotion);

        var _this = (0, _possibleConstructorReturn3.default)(this, (StrangeMotion.__proto__ || (0, _getPrototypeOf2.default)(StrangeMotion)).call(this));

        var animConfig = void 0;
        if (!props.animConfig) {
            animConfig = _this._getDefaultAnimConfig();
        } else {
            animConfig = _this.processInitAnimConfig(props.animConfig);
        }

        var model = void 0;
        var childIsFunc = void 0;

        if (props.model) {
            model = props.model;
        }

        if (typeof props.children === 'function') {

            childIsFunc = true;
            if (!props.model) {
                throw new Error('StrangeMotion: Must pass in model if children is a function');
            }
            model = props.model;
        } else {
            childIsFunc = false;
            if (props.model) {
                throw new Error('StrangeMotion: Must pass function as child if model is provided in props');
            }
            model = Utils.getElementsFromChildren(props.children);
        }

        _this.state = {
            animConfig: animConfig,
            model: model,
            childIsFunc: childIsFunc,
            childWrapperComponent: props.childWrapperComponent,
            childWrapperProps: props.childWrapperProps
        };

        _this.willEnter = _this._willEnter.bind(_this);
        _this.willLeave = _this._willLeave.bind(_this);
        _this.getStyles = _this._getStyles.bind(_this);
        _this.getDefaultStyles = _this._getDefaultStyles.bind(_this);
        _this.applyInterpolatedStyles = _this._applyInterpolatedStyles.bind(_this);
        _this.genId = _this._genId.bind(_this);
        _this.applyPlugins = _this._applyPlugins.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(StrangeMotion, [{
        key: 'getChildren',
        value: function getChildren(interpolatedStyles) {
            var _this2 = this;

            var _state = this.state,
                animWrapperComponent = _state.animWrapperComponent,
                animWrapperProps = _state.animWrapperProps,
                childWrapperComponent = _state.childWrapperComponent,
                childWrapperProps = _state.childWrapperProps,
                childProps = _state.childProps,
                model = _state.model;


            var interpolatedAsArray = [].concat(interpolatedStyles);

            if ((typeof interpolatedStyles === 'undefined' ? 'undefined' : (0, _typeof3.default)(interpolatedStyles)) === 'object' && !Array.isArray(interpolatedStyles)) {

                // it's a Motion object

                var interpolatedChild = interpolatedAsArray.map(function (style) {

                    var newChildPropsVal = {};
                    if (childProps) {
                        newChildPropsVal = childProps(style);
                    }

                    // Use model right here
                    var newChild = Array.isArray(model) ? model[0] : model;

                    return _this2.applyInterpolatedStyles({
                        style: style,
                        child: newChild,
                        childWrapperComponent: childWrapperComponent,
                        childWrapperProps: childWrapperProps,
                        newChildPropsVal: newChildPropsVal
                    });
                })[0]; // Grab the first and only item here

                if (!animWrapperComponent && !animWrapperProps) {
                    return interpolatedChild;
                }

                if (animWrapperComponent) {
                    return React.createElement(animWrapperComponent, animWrapperProps && animWrapperProps(interpolatedStyles) || {}, interpolatedChild);
                } else {
                    return React.cloneElement(interpolatedChild, animWrapperProps && animWrapperProps(interpolatedStyles) || {});
                }
            }

            // Apply new styles to children

            var interpolatedChildren = interpolatedAsArray.map(function (_ref) {
                var style = _ref.style,
                    data = _ref.data,
                    key = _ref.key;


                var newChildPropsVal = {};
                if (childProps) {
                    newChildPropsVal = childProps({ style: style, data: data, key: key });
                }

                return _this2.applyInterpolatedStyles({
                    style: style,
                    child: data,
                    key: key,
                    childWrapperComponent: childWrapperComponent,
                    childWrapperProps: childWrapperProps,
                    newChildPropsVal: newChildPropsVal
                });
            });

            return React.createElement(animWrapperComponent || 'div', animWrapperProps && animWrapperProps(interpolatedStyles) || {}, interpolatedChildren);
        }
    }, {
        key: '_applyInterpolatedStyles',
        value: function _applyInterpolatedStyles(_ref2) {
            var style = _ref2.style,
                child = _ref2.child,
                key = _ref2.key,
                childWrapperComponent = _ref2.childWrapperComponent,
                childWrapperProps = _ref2.childWrapperProps,
                newChildPropsVal = _ref2.newChildPropsVal;


            var stylePluginsApplied = this.applyPlugins({
                pluginFunc: 'toCss',
                applyTo: style
            });

            if (!key) {
                key = this.genId();
            }

            var children = this.props.children;

            var childStyle = child.props && child.props.style;

            var newStyle = stylePluginsApplied;

            newStyle = (0, _assign2.default)({}, childStyle || {}, stylePluginsApplied);

            var newChild = void 0;

            var newChildProps = newChildPropsVal;

            if (this.state.childIsFunc && !childWrapperComponent) {

                newChild = React.cloneElement(children({ style: newStyle, child: child, key: key }), (0, _extends3.default)({}, newChildProps, { style: style }));
            } else if (this.state.childIsFunc && childWrapperComponent) {

                newChild = React.cloneElement(children({ style: newStyle, child: child, key: key }), newChildProps);
            }

            if (!this.state.childIsFunc && !childWrapperComponent) {

                newChild = React.cloneElement(child, (0, _extends3.default)({}, newChildProps, { style: newStyle }));
            } else if (!this.state.childIsFunc && childWrapperComponent) {

                newChild = React.cloneElement(child, newChildProps);
            }

            if (childWrapperComponent) {

                var childWrapperPropsVal = {};

                if (typeof childWrapperProps === 'function') {
                    childWrapperPropsVal = childWrapperProps({ child: child, key: key });
                } else if (childWrapperProps) {
                    childWrapperPropsVal = childWrapperProps;
                }

                newChild = React.createElement(childWrapperComponent, (0, _extends3.default)({ key: key }, childWrapperPropsVal), newChild);
            }

            return newChild;
        }
    }, {
        key: '_getDefaultAnimConfig',
        value: function _getDefaultAnimConfig() {

            return {
                start: {},
                beforeEnter: {},
                enter: {},
                leave: {}
            };
        }
    }, {
        key: 'processInitAnimConfig',
        value: function processInitAnimConfig(animConfig) {

            var animConfigWithDefaults = Utils.assignDefaultsToAnimConfig(animConfig);

            var self = this;

            var animConfigPluginsApplied = this._applyPlugins({
                pluginFunc: 'assignAnimConfig',
                applyTo: animConfigWithDefaults
            });

            var _Utils$assignAnimConf = Utils.assignAnimConfig({
                beginAnimConfig: self.state && self.state.animConfig,
                newAnimConfig: animConfigPluginsApplied
            }),
                assignedAnimConfig = _Utils$assignAnimConf.assignedAnimConfig,
                delays = _Utils$assignAnimConf.delays;

            if (delays) {
                this.waitingDelays = delays;
            }

            return assignedAnimConfig;
        }
    }, {
        key: '_applyPlugins',
        value: function _applyPlugins(_ref3) {
            var _this3 = this;

            var pluginFunc = _ref3.pluginFunc,
                applyTo = _ref3.applyTo;


            if (!this.props) {
                return applyTo;
            }

            var animPlugins = this.props.animPlugins;

            // Plugin validation

            var filteredAnimPlugins = [].concat(animPlugins).filter(function (plugin) {
                return plugin ? true : false;
            });

            var pluginsApplied = applyTo;

            // TODO implement Topo sorting for plugins

            filteredAnimPlugins.forEach(function (plugin) {

                if (plugin[pluginFunc]) {

                    if (pluginFunc === 'getStyles') {
                        pluginsApplied = plugin[pluginFunc](applyTo, _this3.reactMotion);
                    } else {
                        pluginsApplied = plugin[pluginFunc](applyTo);
                    }
                }

                if (plugin['getReactMotion']) {
                    plugin['getReactMotion'](_this3.reactMotion);
                }
            });

            return pluginsApplied;
        }

        // Why do I have newAnimConfig here if nobody is using it?
        // it's for documentation to make sure you know what you're passing in.

    }, {
        key: 'assignAnimConfig',
        value: function assignAnimConfig(_ref4, setStateCb) {
            var _this4 = this;

            var passedInAnimConfig = _ref4.newAnimConfig;


            var newAnimConfig = JSON.parse((0, _stringify2.default)(passedInAnimConfig));

            if (passedInAnimConfig.enter && passedInAnimConfig.enter.$delay) {
                var _passedInAnimConfig$e = passedInAnimConfig.enter,
                    $enterDelay = _passedInAnimConfig$e.$delay,
                    enterWithoutDelay = (0, _objectWithoutProperties3.default)(_passedInAnimConfig$e, ['$delay']);

                // setup the $delay

                setTimeout(function () {

                    var newAnimConfigClone = JSON.parse((0, _stringify2.default)(newAnimConfig));

                    _this4.assignAnimConfig({
                        newAnimConfig: { enter: enterWithoutDelay }
                    }, _this4._setNewAnimConfig(passedInAnimConfig, newAnimConfigClone));
                }, $enterDelay);

                var enter = passedInAnimConfig.enter,
                    rest = (0, _objectWithoutProperties3.default)(passedInAnimConfig, ['enter']);

                if ((0, _keys2.default)(rest).length !== 0) {
                    newAnimConfig = rest;
                }
            }

            this._setNewAnimConfig(passedInAnimConfig, newAnimConfig, setStateCb)();
        }
    }, {
        key: '_setNewAnimConfig',
        value: function _setNewAnimConfig(passedInAnimConfig, newAnimConfig, setStateCb) {
            var _this5 = this;

            var reactMotion = this.reactMotion;

            var beginAnimConfig = this.state.animConfig;

            return function () {

                newAnimConfig = (0, _keys2.default)(newAnimConfig).reduce(function (collector, animType) {

                    var currentAnimType = passedInAnimConfig[animType];

                    var newAnimType = (0, _keys2.default)(currentAnimType).reduce(function (collector, cssPropName) {

                        var cssPropVal = currentAnimType[cssPropName];

                        if (cssPropVal === 'getLastIdealStyle') {

                            var lastIdealStyle = reactMotion.state.lastIdealStyle[cssPropName];

                            if (typeof lastIdealStyle !== 'undefined') {

                                collector[cssPropName] = lastIdealStyle;
                            }
                        } else {
                            collector[cssPropName] = cssPropVal;
                        }

                        return collector;
                    }, {});

                    collector[animType] = newAnimType;

                    return collector;
                }, {});

                //

                var animConfigPluginsApplied = _this5.applyPlugins({
                    pluginFunc: 'assignAnimConfig',
                    applyTo: newAnimConfig
                });

                var _Utils$assignAnimConf2 = Utils.assignAnimConfig({
                    beginAnimConfig: beginAnimConfig,
                    newAnimConfig: animConfigPluginsApplied,
                    reactMotion: reactMotion
                }),
                    assignedAnimConfig = _Utils$assignAnimConf2.assignedAnimConfig,
                    delays = _Utils$assignAnimConf2.delays;

                if (newAnimConfig.start) {

                    return _this5.setState({
                        animConfig: (0, _extends3.default)({}, assignedAnimConfig, {
                            enter: newAnimConfig.start
                        })
                    }, function () {

                        _this5.setState({
                            animConfig: assignedAnimConfig
                        }, function () {

                            if (typeof setStateCb === 'function') {
                                setStateCb();
                            }

                            _this5.handleDelays(delays);
                        });
                    });
                }

                _this5.setState({
                    animConfig: assignedAnimConfig
                }, function () {

                    if (typeof setStateCb === 'function') {
                        setStateCb();
                    }

                    _this5.handleDelays(delays);
                });
            };
        }
    }, {
        key: 'handleDelays',
        value: function handleDelays(delays) {
            var _this6 = this;

            // if there weren't any delays, '$delay' will be set to undefined
            // from Utils.assignAnimConfig
            if (delays) {
                /*
                    Delays object is organized by its delay times. ex:
                    {
                        400: [{ enter: { top: 100, left: 100 } }],
                        10000: [{ enter: { top: 500, left: 300 }] }
                    }
                }
                */

                (0, _keys2.default)(delays).forEach(function (delay) {

                    setTimeout(function () {

                        [].concat(delays[delay]).forEach(function (currentDelay) {

                            _this6.assignAnimConfig({
                                newAnimConfig: currentDelay
                            });
                        });
                    }, delay);
                });
            };
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this7 = this;

            var waitingDelays = this.waitingDelays;


            if (waitingDelays) {

                (0, _keys2.default)(waitingDelays).forEach(function ($delay) {

                    setTimeout(function () {

                        _this7.assignAnimConfig({ newAnimConfig: waitingDelays[$delay] });
                    }, $delay);
                });
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var children = nextProps.children,
                model = nextProps.model,
                animConfig = nextProps.animConfig;


            if (children && typeof children !== 'function') {

                this.setState({
                    model: Utils.getElementsFromChildren(children)
                });
            }

            if (model) {
                this.setState({ model: model });
            }

            // Thanks to React, we won't have to worry
            // about the same animConfig being passed in twice,
            // so we can safely assume that whatever animConfig
            // props the user assigns via the `animController` will
            // take precedence in `getStyles()`, and won't be
            // immediately overwritten with styles here.

            // NOTE: This does mean that any animations defined with
            // the animController will be overwritten with this one.
            // Of course they can be changed again via the animController
            // which will take over. This is basically now an alias of
            // animController.mergeAnimConfig()

            if (animConfig) {
                this.assignAnimConfig({ newAnimConfig: animConfig });
            }
        }
    }, {
        key: 'filterChildrenForType',
        value: function filterChildrenForType(children) {

            return children;
        }
    }, {
        key: '_genId',
        value: function _genId() {

            return Math.random().toString(16).slice(2);
        }
    }, {
        key: '_willEnter',


        // Only used with TransitionMotion
        value: function _willEnter() {
            var animConfig = this.state.animConfig;

            return animConfig.beforeEnter;
        }
    }, {
        key: '_willLeave',


        // Only used with TransitionMotion
        value: function _willLeave() {
            var animConfig = this.state.animConfig;

            return animConfig.leave;
        }
    }, {
        key: '_getDefaultStyles',
        value: function _getDefaultStyles() {
            var _this8 = this;

            var defaultStyles = this.getStyles('start').map(function (interpolatedStyle) {

                var newCssVals = _this8.applyPlugins({
                    pluginFunc: 'getDefaultStyles',
                    applyTo: interpolatedStyle.style
                });

                // Do NOT deep merge this. applyPlugins is allowed to do
                // transformations on the styles, and we want the `style`
                // prop to be preserved in `{ style: newCssVals }`
                var newInterpolatedStyle = (0, _assign2.default)({}, interpolatedStyle, { style: newCssVals });

                return newInterpolatedStyle;
            });

            return defaultStyles;
        }
    }, {
        key: '_getStyles',
        value: function _getStyles(animConfigKey) {
            var _this9 = this;

            var _state2 = this.state,
                model = _state2.model,
                animConfig = _state2.animConfig;


            var mergedAnimConfig = animConfig;

            if (this.animController && this.animControllerAnimConfig) {
                mergedAnimConfig = (0, _assign2.default)({}, animConfig, this.animControllerAnimConfig);
            };

            var filteredModel = void 0;
            if (this.props.model) {
                filteredModel = model;
            } else {
                // TODO This doesn't make any sense, it's only here for the toggle-motion
                filteredModel = this.filterChildrenForType(model);
            }

            var newStyles = filteredModel.map(function (child, i) {
                var key = child.key,
                    itemId = child.id,
                    name = child.name;


                var newKey = key || '';

                if (!key) {
                    if (itemId) {
                        newKey += itemId;
                    }

                    if (name) {
                        newKey += name + i;
                    }
                }

                if (newKey === '') {
                    newKey = _this9._genId();
                }

                var newCssVals = _this9.applyPlugins({
                    pluginFunc: 'getStyles',
                    applyTo: animConfigKey ? mergedAnimConfig[animConfigKey] : mergedAnimConfig.enter
                });

                return {
                    data: child,
                    style: newCssVals,
                    key: String(newKey)
                };
            });

            return newStyles;
        }
    }]);
    return StrangeMotion;
}(React.PureComponent), _class.propTypes = {
    model: T.array,
    animConfig: T.shape({
        start: T.object,
        beforeEnter: T.object,
        enter: T.object.isRequired,
        leave: T.object
    }),
    animPlugins: T.array,
    children: T.any.isRequired,
    animWrapperComponent: T.any,
    animWrapperComponentRef: T.func,
    animWrapperProps: T.func,
    childWrapperComponent: T.any,
    childWrapperProps: T.func,
    childProps: T.func
}, _class.defaultSpring = {
    stiffness: 170,
    damping: 26,
    precision: 0.01
}, _temp);