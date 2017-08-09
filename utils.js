
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

        return Object.keys(beginAnimConfig)
        .reduce((newAnimConfig, animStyleName) => {

            const animStyle = newAnimConfig[animStyleName];

            if (animStyleName === 'beforeEnterStyle' ||
                animStyleName === 'startStyle') {

                newAnimConfig[animStyleName] = animStyle;
            }
            else {

                newAnimConfig[animStyleName] = Object.keys(animStyle)
                .reduce((collector, cssPropName) => {

                    const cssProp = animStyle[cssPropName];

                    if (typeof cssProp === 'object') {

                        let additional = {};

                        if (typeof cssProp.preset === 'string') {
                            additional = presets[cssProp.preset];
                        }

                        if (typeof cssProp.delay === 'number') {

                            // Use something similar for the repeat prop

                            const cssPropWithoutDelay = cssProp;
                            delete cssPropWithoutDelay.delay;

                            const delay = cssProp.delay;
                            const delayedCssProp = {};
                            delayedCssProp[animStyle] = {};
                            delayedCssProp[animStyle][cssPropName] = cssPropWithoutDelay;

                            setTimeout(() => {

                                delayCallback(delayedCssProp);
                            }, delay);

                            return collector;
                        }

                        collector[cssPropName] = Object.assign({},
                            assignOverride || beginAnimConfig[animStyleName][cssPropName],
                            additional,
                            cssProp
                        );

                        // Faster than `delete collector[cssPropName].preset;`
                        delete collector[cssPropName].preset;
                    }
                    else {
                        collector[cssPropName] = Object.assign({},
                            assignOverride || beginAnimConfig[animStyleName][cssPropName],
                            { val: cssProp }
                        );
                    }

                    return collector;
                }, {});
            }

            return newAnimConfig;
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
