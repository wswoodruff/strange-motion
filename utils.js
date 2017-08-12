
const { presets } = require('react-motion');
const _merge = require('lodash/merge');

const defaultSpring = {
    stiffness: 170,
    damping: 26,
    precision: 0.01
}

module.exports = {

    assignAnimConfig: function({
        beginAnimConfig,
        newAnimConfig,
        reactMotion
    }) {

        if (!beginAnimConfig) {
            beginAnimConfig = newAnimConfig;
        }

        let delays = {};

        const assignedAnimConfig = Object.keys(beginAnimConfig)
        .reduce((collector, animStyleName) => {

            const animStyle = newAnimConfig[animStyleName];

            if (typeof animStyle === 'undefined') {
                return collector;
            }

            if (animStyleName === 'beforeEnter' ||
                animStyleName === 'start') {

                collector[animStyleName] = animStyle;
            }
            else {

                collector[animStyleName] = Object.keys(animStyle)
                .reduce((newCSSProps, cssPropName) => {

                    let cssProp = animStyle[cssPropName];

                    if (typeof cssProp === 'object') {

                        let additional = {};

                        // Special config settings

                        if (typeof cssProp.preset === 'string') {

                            const reactPreset = presets[cssProp.preset];

                            if (reactPreset) {
                                additional = presets[cssProp.preset];
                            }

                            // Gotta find a way to pass in options now
                            // const userPreset = internals.userPresets[cssProp.preset];

                            // if (reactPreset) {
                            //     additional = internals.userPresets[cssProp.preset];
                            // }

                            delete cssProp.preset;
                        }

                        // spring is an alias for val
                        if (typeof cssProp.spring !== 'undefined') {
                            cssProp.val = cssProp.spring;
                            delete cssProp.spring;
                        }

                        if (typeof cssProp.delay !== 'undefined') {

                            // Use something similar for the repeat prop

                            const { delay, ...cssPropWithoutDelay } = cssProp;

                            // Set cssProp to the latest of reactMotion here
                            cssProp = reactMotion.state.lastIdealStyle[cssPropName];

                            const delayedAnimConfig = {};
                            delayedAnimConfig[animStyleName] = {};
                            delayedAnimConfig[animStyleName][cssPropName] = cssPropWithoutDelay;

                            const animKeyDiff = Object.keys(beginAnimConfig[animStyleName]).filter(function(item) {

                                return Object.keys(delayedAnimConfig[animStyleName]).indexOf(item) < 0;
                            })
                            .reduce((collector, diffKey) => {

                                collector.enter[diffKey] = 'getLastIdealStyle';
                                return collector;
                            }, { enter: {} });

                            const delayObj = {};
                            delayObj[delay] = _merge({},
                                animKeyDiff,
                                delayedAnimConfig
                            );

                            // const stylesNotDelayed = sharedAnimStyles
                            // top scope
                            delays = _merge({},
                                delays,
                                delayObj
                            );
                        }

                        newCSSProps[cssPropName] = _merge({},
                            beginAnimConfig[animStyleName][cssPropName] ||
                            defaultSpring,
                            additional,
                            cssProp
                        );
                    }
                    else {
                        newCSSProps[cssPropName] = _merge({},
                            beginAnimConfig[animStyleName][cssPropName] || defaultSpring,
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
