
const { presets } = require('react-motion');

module.exports = {

    assignAnimConfig: (beginAnimConfig, incomingAnimConfig, assignOverride) => {

        if (!beginAnimConfig) {
            beginAnimConfig = incomingAnimConfig;
        }

        return Object.keys(beginAnimConfig)
        .reduce((newAnimConfig, animStyleName) => {

            const animStyle = incomingAnimConfig[animStyleName];

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

                        collector[cssPropName] = Object.assign({},
                            assignOverride || beginAnimConfig[animStyleName][cssPropName],
                            additional,
                            cssProp
                        );

                        // Faster than `delete collector[cssPropName].preset;`
                        collector[cssPropName].preset = undefined;
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

    debounce: (func, wait, immediate) => {

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
    };
};
