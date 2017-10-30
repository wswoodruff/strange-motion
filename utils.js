'use strict';

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('react-motion'),
    presets = _require.presets;

var _merge = require('lodash/merge');
var React = require('react');

var defaultSpring = {
    stiffness: 170,
    damping: 26,
    precision: 0.01
};

module.exports = {

    defaultSpring: defaultSpring,

    assignDefaultsToAnimConfig: function assignDefaultsToAnimConfig(animConfig) {

        if (animConfig.leave) {

            var leaveAnimVals = _merge({}, animConfig.leave);

            if (!animConfig.start) {
                animConfig.start = leaveAnimVals;
            }
        } else if (animConfig.start) {
            animConfig.leave = animConfig.start;
            if (!animConfig.enter) {
                animConfig.enter = animConfig.start;
            }
        }

        if (!animConfig.beforeEnter) {
            animConfig.beforeEnter = _merge({}, animConfig.start);
        }

        return animConfig;
    },

    getElementsFromChildren: function getElementsFromChildren(children) {

        if (!Array.isArray(children)) {
            children = [].concat(children);
        }

        return children.reduce(function (collector, child) {

            if (React.isValidElement(child)) {
                collector.push(child);
            }

            return collector;
        }, []);
    },

    assignAnimConfig: function assignAnimConfig(_ref) {
        var beginAnimConfig = _ref.beginAnimConfig,
            newAnimConfig = _ref.newAnimConfig,
            reactMotion = _ref.reactMotion;


        if (!beginAnimConfig) {
            beginAnimConfig = newAnimConfig;
        }

        beginAnimConfig = JSON.parse((0, _stringify2.default)(beginAnimConfig));

        var delays = {};

        var assignedAnimConfig = (0, _keys2.default)(beginAnimConfig).reduce(function (collector, animStyleName) {

            var beginAnimStyle = beginAnimConfig[animStyleName];
            var newAnimStyle = newAnimConfig[animStyleName] || beginAnimStyle;

            if (animStyleName === 'start' || animStyleName === 'beforeEnter') {

                // These can't handle springs set on them

                collector[animStyleName] = newAnimConfig[animStyleName] || beginAnimConfig[animStyleName];
            } else {

                collector[animStyleName] = (0, _keys2.default)(newAnimStyle).reduce(function (newCSSProps, cssPropName) {

                    var cssProp = newAnimStyle[cssPropName];

                    var beginCssProp = typeof beginAnimConfig[animStyleName][cssPropName] !== 'undefined' ? beginAnimConfig[animStyleName][cssPropName] : {};

                    if ((typeof cssProp === 'undefined' ? 'undefined' : (0, _typeof3.default)(cssProp)) === 'object') {

                        var additional = {};

                        // Special config settings

                        if (typeof cssProp.preset === 'string') {

                            var reactPreset = presets[cssProp.preset];

                            if (reactPreset) {
                                additional = presets[cssProp.preset];
                            }

                            // TODO pass in user options

                            // const userPreset = internals.userPresets[cssProp.preset];

                            // if (userPreset) {
                            //     additional = internals.userPresets[userPreset];
                            // }

                            delete cssProp.preset;
                        }

                        // spring is an alias for val

                        if (typeof cssProp.spring !== 'undefined') {
                            if (typeof cssProp.val !== 'undefined') {
                                throw new Error('Can\'t have spring and val both set');
                            }
                            cssProp.val = cssProp.spring;
                            delete cssProp.spring;
                        }

                        if (typeof cssProp.$delay !== 'undefined') {

                            // TODO Use something similar for the repeat prop

                            var $delay = cssProp.$delay,
                                cssPropWithoutDelay = (0, _objectWithoutProperties3.default)(cssProp, ['$delay']);

                            // Set cssProp to the latest of reactMotion here
                            // cssProp = reactMotion.state.lastIdealStyle[cssPropName];

                            var delayedAnimConfig = {};
                            delayedAnimConfig[animStyleName] = {};
                            delayedAnimConfig[animStyleName][cssPropName] = cssPropWithoutDelay;

                            var animKeyDiff = (0, _keys2.default)(beginAnimConfig[animStyleName]).filter(function (item) {

                                return (0, _keys2.default)(delayedAnimConfig[animStyleName]).indexOf(item) === -1;
                            }).reduce(function (collector, diffKey) {

                                collector.enter[diffKey] = 'getLastIdealStyle';
                                return collector;
                            }, { enter: {} });

                            var delayObj = {};
                            delayObj[$delay] = _merge({}, animKeyDiff, delayedAnimConfig);

                            delays = _merge({}, delays, delayObj);
                        }

                        if (cssProp.$delay) {

                            var explicitStartCssProp = {};

                            if (newAnimConfig.start) {
                                explicitStartCssProp = {
                                    val: newAnimConfig.start[cssPropName]
                                };
                            }

                            delete cssProp.$delay;
                            newCSSProps[cssPropName] = _merge({}, defaultSpring, additional, beginCssProp, explicitStartCssProp);
                        } else {
                            newCSSProps[cssPropName] = _merge({}, defaultSpring, beginCssProp, additional, cssProp);
                        }
                    } else {

                        newCSSProps[cssPropName] = _merge({}, defaultSpring, beginCssProp, { val: cssProp });
                    }

                    return newCSSProps;
                }, {});
            }

            return collector;
        }, {});

        if ((0, _keys2.default)(delays).length === 0) {
            delays = undefined;
        }

        return {
            assignedAnimConfig: assignedAnimConfig,
            delays: delays
        };
    },

    flattenCssPropsToValIfNeeded: function flattenCssPropsToValIfNeeded(cssProps) {

        return (0, _keys2.default)(cssProps).reduce(function (collector, cssPropName) {

            var currentCssProp = cssProps[cssPropName];

            if ((typeof currentCssProp === 'undefined' ? 'undefined' : (0, _typeof3.default)(currentCssProp)) === 'object' && !Array.isArray(currentCssProp)) {

                var currentCssPropKeys = (0, _keys2.default)(currentCssProp);

                if (currentCssPropKeys.length === 1 && currentCssPropKeys[0] === 'val') {

                    collector[cssPropName] = currentCssProp.val;
                } else {
                    collector[cssPropName] = currentCssProp;
                }
            } else {
                collector[cssPropName] = currentCssProp;
            }

            return collector;
        }, {});
    },

    debounce: function debounce(func, wait, immediate) {
        var _this = this;

        var timeout = void 0;
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var self = _this;
            var later = function later() {

                timeout = null;
                if (!immediate) {
                    func.apply.apply(func, [self].concat(args));
                }
            };
            var callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply.apply(func, [self].concat(args));
            }
        };
    }
};