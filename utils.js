
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

    /*

        Make util here that fills out animConfigs
        with sensible defaults based on the animConfig
        provided. So if leave isn't set, it'll set leave
        equal to start

        Also, for doggo-dish -- for each user that has access to an
        organization, make an encrypted copy of the key to unencrypt
        a single secure item. Each user gets a copy of the key to
        unencrypt each secure.

    */

    /*
        Returns:
        {
            assignedAnimConfig,
            delays
        }
    */

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

            const newAnimStyle = newAnimConfig[animStyleName];
            const beginAnimStyle = beginAnimConfig[animStyleName];

            if (animStyleName === 'start' ||
                animStyleName === 'beforeEnter') {

                collector[animStyleName] = beginAnimStyle;
            }
            else if(animStyleName === 'enter' ||
                    animStyleName === 'leave') {

                collector[animStyleName] = Object.keys(newAnimStyle)
                .reduce((newCSSProps, cssPropName) => {

                    let cssProp = newAnimStyle[cssPropName];

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
                            if (cssProp.val) {
                                throw new Error('Can\'t have spring and val both set');
                            }
                            cssProp.val = cssProp.spring;
                            delete cssProp.spring;
                        }

                        if (typeof cssProp.delay !== 'undefined') {

                            // TODO Use something similar for the repeat prop

                            const { delay, ...cssPropWithoutDelay } = cssProp;

                            // Set cssProp to the latest of reactMotion here
                            // cssProp = reactMotion.state.lastIdealStyle[cssPropName];

                            const delayedAnimConfig = {};
                            delayedAnimConfig[animStyleName] = {};
                            delayedAnimConfig[animStyleName][cssPropName] = cssPropWithoutDelay;

                            const animKeyDiff = Object.keys(beginAnimConfig[animStyleName])
                            .filter(function(item) {

                                return Object.keys(delayedAnimConfig[animStyleName])
                                .indexOf(item) < 0;
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

                            delays = _merge({},
                                delays,
                                delayObj
                            );
                        }

                        const beginStyleMerge = typeof beginAnimConfig[animStyleName][cssPropName] !== 'undefined' ?
                            beginAnimConfig[animStyleName][cssPropName] :
                            {};

                        if (cssProp.delay) {

                            delete cssProp.delay;
                            newCSSProps[cssPropName] = _merge(
                                {},
                                defaultSpring,
                                cssProp,
                                beginStyleMerge,
                                additional
                            );
                        }
                        else {
                            newCSSProps[cssPropName] = _merge(
                                {},
                                defaultSpring,
                                beginStyleMerge,
                                additional,
                                cssProp
                            );
                        }
                    }
                    else {

                        const beginStyleMerge = typeof beginAnimConfig[animStyleName][cssPropName] !== 'undefined' ?
                            beginAnimConfig[animStyleName][cssPropName] :
                            {};

                        newCSSProps[cssPropName] = _merge({},
                            defaultSpring,
                            beginStyleMerge,
                            { val: cssProp }
                        );
                    }

                    return newCSSProps;
                }, {});
            }
            else {
                throw new Error(`animConfig can only have
                    start,
                    beforeEnter,
                    enter, or
                    leave`);
            }

            return collector;
        }, {});

        if (Object.keys(delays).length === 0) {
            delays = undefined;
        }

        // Left off where I need to make sure to omit the
        // css prop that has `delay` in it, from going through
        // in this animConfig

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
