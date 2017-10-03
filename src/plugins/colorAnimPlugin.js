
const { isAnimConfig } = require('utils');
const Color = require('color');
const { spring } = require('react-motion');
const StrangeMotion = require('../../index');

const Loggy = require('utils/loggy');

const defaultSpring = StrangeMotion.defaultSpring;

const internals = {
    lastSpringVals: {},
    lastVals: {}
};

module.exports = {

    assignAnimConfig: (newAnimConfig) => {

        const transformedAnimConfig = internals.assignNewAnimConfig(newAnimConfig);
        return transformedAnimConfig;
    },
    getDefaultStyles: (styles) => {

        const transformedAnimConfig = internals.parseColors(styles);
        return transformedAnimConfig;
    },
    getStyles: (interpolatedStyles) => {

        const transformedAnimConfig = internals.getStyles(interpolatedStyles);
        return transformedAnimConfig;
    },
    transform: (interpolatedStyles) => {

        const transformedAnimConfig = internals.parseColors(interpolatedStyles);
        return transformedAnimConfig;
    },
    toCss: (style) => {

        const transformedAnimConfig = internals.toCss(style);
        return transformedAnimConfig;
    }
};

internals.assignNewAnimConfig = (newAnimConfig) => {

    if (isAnimConfig(newAnimConfig)) {

        return Object.keys(newAnimConfig)
        .reduce((collector, animCssName) => {

            collector[animCssName] = internals.addColorSpringProps(newAnimConfig[animCssName]);

            return collector;
        }, {});
    }
    else {
        return internals.addColorSpringProps(newAnimConfig);
    }
};

internals.getStyles = (interpolatedStyles) => {

    return internals.addColorSpringPropsWithDefaults(interpolatedStyles);
};

internals.parseColors = (interpolatedStyles) => {

    return internals.addColorSpringProps(interpolatedStyles);
};

internals.addColorSpringPropsWithDefaults = (cssProps) => {

    const isSpringLoaded = Object.keys(cssProps).some((propName) => { return typeof cssProps[propName].val !== 'undefined' });

    let propsWithDefaults;

    if (isSpringLoaded) {
        propsWithDefaults = {
            ...internals.lastSpringVals,
            ...cssProps
        };
    }
    else {
        propsWithDefaults = {
            ...internals.lastVals,
            ...cssProps
        };
    }

    return internals.addColorSpringProps(propsWithDefaults);
};

internals.addColorSpringProps = (cssProps) => {

    const cssPropKeys = Object.keys(cssProps);

    return cssPropKeys.reduce((animCollector, currentCssPropName) => {

        let color;

        const currentCssPropVal = cssProps[currentCssPropName];

        Loggy.log('currentCssPropName', currentCssPropName);

        if (currentCssPropName.includes('ColorSpring')) {

            animCollector[currentCssPropName] = cssProps[currentCssPropName];
            return animCollector;
        }

        if(!currentCssPropName.includes('backgroundColor') &&
           !currentCssPropName.includes('color') &&
           !currentCssPropName.includes('fontColor')) {

            animCollector[currentCssPropName] = cssProps[currentCssPropName];
            return animCollector;
        }

        let theVal = (typeof currentCssPropVal.val !== 'undefined') ? currentCssPropVal.val : currentCssPropVal;

        try {
            color = Color(theVal);
        }
        catch (err) {
            throw new Error(err, 'err setting color from currentCssPropVal');
        };

        const hslArr = color.hsl().color;

        if (currentCssPropVal.val) {

            const propSpring = Object.keys(defaultSpring)
            .reduce((collector, springProp) => {

                if (currentCssPropVal[springProp]) {
                    collector[springProp] = currentCssPropVal[springProp];
                }
                return collector;
            }, defaultSpring);

            const colorSpringHWithVal = Object.assign(
                {},
                propSpring,
                { val: hslArr[0] }
            );

            const colorSpringSWithVal = Object.assign(
                {},
                propSpring,
                { val: hslArr[1] }
            );

            const colorSpringLWithVal = Object.assign(
                {},
                propSpring,
                { val: hslArr[2] }
            );

            internals.lastSpringVals[`${currentCssPropName}ColorSpringH`] = colorSpringHWithVal;
            internals.lastSpringVals[`${currentCssPropName}ColorSpringS`] = colorSpringSWithVal;
            internals.lastSpringVals[`${currentCssPropName}ColorSpringL`] = colorSpringLWithVal;

            animCollector[`${currentCssPropName}ColorSpringH`] = colorSpringHWithVal;
            animCollector[`${currentCssPropName}ColorSpringS`] = colorSpringSWithVal;
            animCollector[`${currentCssPropName}ColorSpringL`] = colorSpringLWithVal;
        }
        else {

            internals.lastVals[`${currentCssPropName}ColorSpringH`] = hslArr[0];
            internals.lastVals[`${currentCssPropName}ColorSpringS`] = hslArr[1];
            internals.lastVals[`${currentCssPropName}ColorSpringL`] = hslArr[2];

            animCollector[`${currentCssPropName}ColorSpringH`] = hslArr[0];
            animCollector[`${currentCssPropName}ColorSpringS`] = hslArr[1];
            animCollector[`${currentCssPropName}ColorSpringL`] = hslArr[2];
        }

        // delete animCollector[currentCssPropName];
        // This destroys all the styles -- animCollector[currentCssPropName] = 0;

        return animCollector;
    }, {});
};

// ////////

internals.toCss = (style) => {

    const cssPropKeys = Object.keys(style);

    const parsedColorSprings = [];

    Loggy.warn('style', style);
    Loggy.warn('cssPropKeys', cssPropKeys);

    return cssPropKeys.reduce((animCollector, currentCssPropName) => {

        let originalName;

        if (currentCssPropName.includes('ColorSpring')) {

            originalName = currentCssPropName.slice(0, -12);

            if (parsedColorSprings[originalName]) {
                return animCollector;
            }

            parsedColorSprings[originalName] = true;
        }

        if(!currentCssPropName.includes('backgroundColor') &&
           !currentCssPropName.includes('color') &&
           !currentCssPropName.includes('fontColor')) {

            animCollector[currentCssPropName] = style[currentCssPropName];
            return animCollector;
        }

        // The currentCssPropName is backgroundColor, contains 'color', or fontColor

        const hslArr = [
            style[`${originalName}ColorSpringH`],
            style[`${originalName}ColorSpringS`],
            style[`${originalName}ColorSpringL`]
        ];

        const color = Color(hslArr).hsl();

        animCollector[originalName] = color.string();

        return animCollector;
    }, {});
};
