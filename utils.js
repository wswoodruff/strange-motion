
const { presets } = require('react-motion');

module.exports = {

    assignAnimConfig: function({
        beginAnimConfig,
        newAnimConfig,
        assignOverride,
        delayCallback
    }) {

        if (!beginAnimConfig) {
            beginAnimConfig = newAnimConfig;
        }

        let delays = {};

        const assignedAnimConfig = Object.keys(beginAnimConfig)
        .reduce((collector, animStyleName) => {

            const animStyle = collector[animStyleName];

            if (animStyleName === 'beforeEnterStyle' ||
                animStyleName === 'startStyle') {

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
                        }

                        if (typeof cssProp.spring !== 'undefined') {
                            additional = presets[cssProp.preset];
                        }

                        if (typeof cssProp.delay !== 'undefined') {

                            if (typeof cssProp.delay !== 'number') {
                                console.warn(`When assigning this config: ${collector}`)
                                throw new Error('delay must be a number');
                            }
                            // Use something similar for the repeat prop

                            const cssPropWithoutDelay = cssProp;
                            delete cssPropWithoutDelay.delay;

                            const delayedCssProp = {};
                            delayedCssProp[animStyle] = {};
                            delayedCssProp[animStyle][cssPropName] = cssPropWithoutDelay;

                            const delayObj = {};
                            delayObj[cssProp.delay] = delayedCssProp;

                            // top scope
                            delays = Object.assign({}, delays, delayObj);

                            return newCSSProps;
                        }

                        newCSSProps[cssPropName] = Object.assign({},
                            assignOverride || beginAnimConfig[animStyleName][cssPropName],
                            additional,
                            cssProp
                        );

                        delete newCSSProps[cssPropName].preset;
                    }
                    else {
                        newCSSProps[cssPropName] = Object.assign({},
                            assignOverride || beginAnimConfig[animStyleName][cssPropName],
                            { val: cssProp }
                        );
                    }

                    return newCSSProps;
                }, {});
            }

            return collector;
        }, {});

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
