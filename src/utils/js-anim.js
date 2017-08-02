
const internals = {};
const jsAnim = {};
module.exports = jsAnim;

jsAnim.animScroll = (targetHeight, config) => {

    if (targetHeight.tagName) {
        const targetElement = targetHeight;
        const bodyScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 1;
        targetHeight = targetElement.getBoundingClientRect().top + bodyScrollTop - 15;
    }

    const maxScrollTop = document.body.scrollHeight - window.innerHeight;

    if (targetHeight > maxScrollTop) {
        targetHeight = maxScrollTop;
    }

    let documentBody = document.body;
    // firefox doesn't respect document.body
    // let's do some feature detection!
    if (document.documentElement.scrollTop === 0){
        // if it's 0, we could just be at the top questions
        // we need to test to see if we can affect change on the property
        // if we can, we need to use a different body element
        document.documentElement.scrollTop = 5;
        if (document.documentElement.scrollTop === 5){
            documentBody = document.documentElement;
        }
    }
    else if (document.documentElement.scrollTop > document.body.scrollTop){
        // if the firebox body dom element is larger then the normal on
        // then we need to use it for making changes
        documentBody = document.documentElement;
    }

    const defaultConfig = {
        obj: documentBody,
        props: {
            scrollTop: targetHeight
        },
        duration: 800,
        easing: 'easeInOutQuart'
    };

    const animConfig = Object.assign(defaultConfig, config || {});

    jsAnim.runJSAnim(animConfig);
};


// Config can have: obj, props, duration, easing, delay, onTick, callback

jsAnim.runJSAnim = (config) => {

    Object.keys(config.props).forEach((key) => {

        config.props[key] = {
            from: config.obj[key],
            to: config.props[key]
        };
    });

    if (!config.delay) {
        config.delay = 0;
    }

    if (!config.easing) {
        config.easing = 'linearEase';
    }

    setTimeout(() => {

        const start = new Date().getTime();

        const timer = setInterval(() => {

            const time = new Date().getTime() - start;

            Object.keys(config.props).forEach((key) => {

                const from = config.props[key].from;
                const to = config.props[key].to;

                config.obj[key] = internals.easingEquations[config.easing](time, from, to - from, config.duration);

            });

            if (config.onTick) {
                config.onTick(config.obj);
            }

            if (time >= config.duration) {
                clearInterval(timer);
                if (config.callback) {
                    callback();
                }
            }
        }, 1);

    }, config.delay);
};



// Rober Penner's easing equations, adapted from (https://github.com/danro/jquery-easing/blob/master/jquery.easing.js)

internals.easingEquations = {

    linearEase: (t, s, c, d) => {

        return c * t / d + s;
    },

    easeInQuad: (t, b, c, d) => {

        return c * (t /= d) * t + b;
    },

    easeOutQuad: (t, b, c, d) => {

        return -c * (t /= d) * (t - 2) + b;
    },

    easeInOutQuad: (t, b, c, d) => {

        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },

    easeInCubic: (t, b, c, d) => {

        return c * (t /= d) * t * t + b;
    },

    easeOutCubic: (t, b, c, d) => {

        return c * ((t = t / d - 1) * t * t + 1) + b;
    },

    easeInOutCubic: (t, b, c, d) => {

        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },

    easeInQuart: (t, b, c, d) => {

        return c * (t /= d) * t * t * t + b;
    },

    easeOutQuart: (t, b, c, d) => {

        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },

    easeInOutQuart: (t, b, c, d) => {

        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },

    easeInQuint: (t, b, c, d) => {

        return c * (t /= d) * t * t * t * t + b;
    },

    easeOutQuint: (t, b, c, d) => {

        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },

    easeInOutQuint: (t, b, c, d) => {

        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },

    easeInSine: (t, b, c, d) => {

        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    easeOutSine: (t, b, c, d) => {

        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    easeInOutSine: (t, b, c, d) => {

        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },

    easeInExpo: (t, b, c, d) => {

        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },

    easeOutExpo: (t, b, c, d) => {

        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },

    easeInOutExpo: (t, b, c, d) => {

        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },

    easeInCirc: (t, b, c, d) => {

        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },

    easeOutCirc: (t, b, c, d) => {

        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },

    easeInOutCirc: (t, b, c, d) => {

        if ((t /= d / 2) < 1) {
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },

    easeInElastic: (t, b, c, d) => {

        let s = 1.70158;
        let p = 0;
        let a = c;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c; s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }

        return -(a * Math.pow(2,10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p )) + b;
    },

    easeOutElastic: (t, b, c, d) => {

        let s = 1.70158;
        let p = 0;
        let a = c;

        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * .3;
        }
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2,-10 * t) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) + c + b;
    },

    easeInOutElastic: (t, b, c, d) => {

        let s = 1.70158;
        let p = 0;
        let a = c;

        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * (.3 * 1.5);
        }
        if (a < Math.abs(c)) {
            a = c; s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }

        if (t < 1) {
            return -.5 * (a * Math.pow(2,10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p )) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin( (t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
    },

    easeInBack: (t, b, c, d, s) => {

        if (s === undefined) {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },

    easeOutBack: (t, b, c, d, s) => {

        if (s === undefined) {
            s = 1.70158;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },

    easeInOutBack: (t, b, c, d, s) => {

        if (s === undefined) {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },

    easeInBounce: (t, b, c, d) => {

        return c - this.easeOutBounce(d - t, 0, c, d) + b;
    },

    easeOutBounce: (t, b, c, d) => {

        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        }
        else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        }

        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    },

    easeInOutBounce: (t, b, c, d) => {

        if (t < d / 2) {
            return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
        }
        return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    }
};
