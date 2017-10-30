
const { presets } = require('react-motion');
const _merge = require('lodash/merge');
const React = require('react');

const defaultSpring = {
    stiffness: 170,
    damping: 26,
    precision: 0.01
}

module.exports = {

    defaultSpring,

    assignDefaultsToAnimConfig: (animConfig) => {

        if (animConfig.leave) {

            const leaveAnimVals = _merge({}, animConfig.leave);

            if (!animConfig.start) {
                animConfig.start = leaveAnimVals;
            }
        }
        else if (animConfig.start) {
            animConfig.leave = animConfig.start;
            if (!animConfig.enter) {
                animConfig.enter = animConfig.start;
            }
        }

        if (!animConfig.beforeEnter) {
            animConfig.beforeEnter = _merge(
                {},
                animConfig.start
            );
        }

        return animConfig;
    },

    getElementsFromChildren: (children) => {

        if (!Array.isArray(children)) {
            children = [].concat(children);
        }

        return children.reduce((collector, child) => {

            if (React.isValidElement(child)) {
                collector.push(child);
            }

            return collector;
        }, []);
    },

    assignAnimConfig: function({
        beginAnimConfig,
        newAnimConfig,
        reactMotion
    }) {

        if (!beginAnimConfig) {
            beginAnimConfig = newAnimConfig;
        }

        beginAnimConfig = JSON.parse(JSON.stringify(beginAnimConfig));

        let delays = {};

        const assignedAnimConfig = Object.keys(beginAnimConfig)
        .reduce((collector, animStyleName) => {

            const beginAnimStyle = beginAnimConfig[animStyleName];
            const newAnimStyle = newAnimConfig[animStyleName] || beginAnimStyle;

            if (animStyleName === 'start' ||
               animStyleName === 'beforeEnter') {

               // These can't handle springs set on them

               collector[animStyleName] = newAnimConfig[animStyleName] || beginAnimConfig[animStyleName];
            }
            else {

                collector[animStyleName] = Object.keys(newAnimStyle)
                .reduce((newCSSProps, cssPropName) => {

                    let cssProp = newAnimStyle[cssPropName];

                    const beginCssProp = typeof beginAnimConfig[animStyleName][cssPropName] !== 'undefined' ?
                    beginAnimConfig[animStyleName][cssPropName] : {};

                    if (typeof cssProp === 'object') {

                        let additional = {};

                        // Special config settings

                        if (typeof cssProp.preset === 'string') {

                            const reactPreset = presets[cssProp.preset];

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

                            const { $delay, ...cssPropWithoutDelay } = cssProp;

                            // Set cssProp to the latest of reactMotion here
                            // cssProp = reactMotion.state.lastIdealStyle[cssPropName];

                            const delayedAnimConfig = {};
                            delayedAnimConfig[animStyleName] = {};
                            delayedAnimConfig[animStyleName][cssPropName] = cssPropWithoutDelay;

                            const animKeyDiff = Object.keys(beginAnimConfig[animStyleName])
                            .filter(function(item) {

                                return Object.keys(delayedAnimConfig[animStyleName])
                                .indexOf(item) === -1;
                            })
                            .reduce((collector, diffKey) => {

                                collector.enter[diffKey] = 'getLastIdealStyle';
                                return collector;
                            }, { enter: {} });

                            const delayObj = {};
                            delayObj[$delay] = _merge({},
                                animKeyDiff,
                                delayedAnimConfig
                            );

                            delays = _merge({},
                                delays,
                                delayObj
                            );
                        }

                        if (cssProp.$delay) {

                            let explicitStartCssProp = {};

                            if (newAnimConfig.start) {
                                explicitStartCssProp = {
                                    val: newAnimConfig.start[cssPropName]
                                };
                            }

                            delete cssProp.$delay;
                            newCSSProps[cssPropName] = _merge({},
                                defaultSpring,
                                additional,
                                beginCssProp,
                                explicitStartCssProp
                            );
                        }
                        else {
                            newCSSProps[cssPropName] = _merge({},
                                defaultSpring,
                                beginCssProp,
                                additional,
                                cssProp
                            );
                        }
                    }
                    else {

                        newCSSProps[cssPropName] = _merge({},
                            defaultSpring,
                            beginCssProp,
                            { val: cssProp }
                        );
                    }

                    return newCSSProps;
                }, {});
            }

            return collector;
        }, {});

        if (Object.keys(delays).length === 0) {
            delays = undefined;
        }

        return {
            assignedAnimConfig,
            delays
        }
    },

    flattenCssPropsToValIfNeeded: function(cssProps) {

        return Object.keys(cssProps)
        .reduce((collector, cssPropName) => {

            const currentCssProp = cssProps[cssPropName];

            if (typeof currentCssProp === 'object' &&
                !Array.isArray(currentCssProp)) {

                const currentCssPropKeys = Object.keys(currentCssProp);

                if (currentCssPropKeys.length === 1 &&
                    currentCssPropKeys[0] === 'val') {

                    collector[cssPropName] = currentCssProp.val;
                }
                else {
                    collector[cssPropName] = currentCssProp;
                }
            }
            else {
                collector[cssPropName] = currentCssProp;
            }

            return collector;
        }, {});
    },

    debounce: function(func, wait, immediate) {

        let timeout;
        return (...args) => {

            const self = this;
            const later = () => {

                timeout = null;
                if (!immediate) {
                    func.apply(self, ...args);
                }
            };
            const callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(self, ...args);
            }
        }
    }
};
