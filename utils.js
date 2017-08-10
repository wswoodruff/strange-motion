
const { presets } = require('react-motion');

const defaultSpring = {
    stiffness: 170,
    damping: 26,
    precision: 0.01
}

module.exports = {

    assignAnimConfig: function({
        beginAnimConfig,
        newAnimConfig
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

                    const cssProp = animStyle[cssPropName];

                    if (typeof cssProp === 'object') {

                        let additional = {};

                        // Special config settings

                        if (typeof cssProp.preset === 'string') {
                            additional = presets[cssProp.preset];
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

                            console.log(beginAnimConfig[animStyleName]);
                            console.log(cssPropWithoutDelay);

                            // TODO BUG: This assigns the original value
                            // to the delayed one. There's some weird deep
                            // merging issue happening here.

                            const updatedAnimStyle = {};
                            updatedAnimStyle[animStyleName] = {};
                            updatedAnimStyle[animStyleName][cssPropName] = cssPropWithoutDelay;

                            const delayedAnimStyle = {};
                            delayedAnimStyle[animStyleName] = Object.assign({},
                                // beginAnimConfig[animStyleName],
                                beginAnimConfig[animStyleName],
                                updatedAnimStyle[animStyleName]
                            );

                            console.log(delayedAnimStyle);

                            const delayObj = {};
                            delayObj[delay] = Object.assign({},
                                delayedAnimStyle
                            );

                            console.log('delayObj', delayObj);

                            // const stylesNotDelayed = sharedAnimStyles
                            // top scope
                            delays = Object.assign({},
                                delays,
                                delayObj
                            );

                            console.log('delays', delays);
                        }

                        newCSSProps[cssPropName] = Object.assign({},
                            beginAnimConfig[animStyleName][cssPropName] ||
                            defaultSpring,
                            additional,
                            cssProp
                        );
                    }
                    else {
                        newCSSProps[cssPropName] = Object.assign({},
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
