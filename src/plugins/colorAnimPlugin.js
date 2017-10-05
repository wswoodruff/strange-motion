
const { isAnimConfig } = require('utils');
const Color = require('color');
const { spring } = require('react-motion');
const StrangeMotion = require('../../index');

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
    getStyles: (interpolatedStyles, reactMotion) => {

        const transformedAnimConfig = internals.getStyles(interpolatedStyles, reactMotion);
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

    return Object.keys(newAnimConfig)
    .reduce((collector, animCssName) => {

        collector[animCssName] = internals.addColorSpringProps(newAnimConfig[animCssName]);

        return collector;
    }, {});
};

internals.getStyles = (interpolatedStyles, reactMotion) => {

    return internals.addColorSpringPropsWithDefaults(interpolatedStyles, reactMotion);
};

internals.parseColors = (interpolatedStyles) => {

    return internals.addColorSpringProps(interpolatedStyles);
};

internals.addColorSpringPropsWithDefaults = (cssProps, reactMotion) => {

    let lastIdealStyle = {};

    if (reactMotion) {
        lastIdealStyle = reactMotion.state.lastIdealStyle;
    }

    const isSpringLoaded = Object.keys(cssProps).some((propName) => { return typeof cssProps[propName].val !== 'undefined' });

    let propsWithDefaults;

    if (isSpringLoaded) {
        propsWithDefaults = {
            ...lastIdealStyle,
            ...cssProps
        };
    }
    else {
        propsWithDefaults = {
            ...lastIdealStyle,
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

        const colorsArr = color.rgb().color;

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
                { val: colorsArr[0] }
            );

            const colorSpringSWithVal = Object.assign(
                {},
                propSpring,
                { val: colorsArr[1] }
            );

            const colorSpringLWithVal = Object.assign(
                {},
                propSpring,
                { val: colorsArr[2] }
            );

            animCollector[`${currentCssPropName}ColorSpring1`] = colorSpringHWithVal;
            animCollector[`${currentCssPropName}ColorSpring2`] = colorSpringSWithVal;
            animCollector[`${currentCssPropName}ColorSpring3`] = colorSpringLWithVal;
        }
        else {

            animCollector[`${currentCssPropName}ColorSpring1`] = colorsArr[0];
            animCollector[`${currentCssPropName}ColorSpring2`] = colorsArr[1];
            animCollector[`${currentCssPropName}ColorSpring3`] = colorsArr[2];
        }

        return animCollector;
    }, {});
};

// ////////

internals.toCss = (style) => {

    const cssPropKeys = Object.keys(style);

    const parsedColorSprings = [];

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

        const colorsArr = [
            style[`${originalName}ColorSpring1`],
            style[`${originalName}ColorSpring2`],
            style[`${originalName}ColorSpring3`]
        ];

        const color = Color(colorsArr).rgb();
        animCollector[originalName] = color.string();

        return animCollector;
    }, {});
};
