
// const _throttle = require('lodash/throttle');
//
// const ThrottleLog = _throttle(console.log, 2000);
// const ThrottleWarn = _throttle(console.warn, 2000);

// console.log('%c randomColor ', `background: #222; color: ${randomColor}`)

const internals = {};

internals.styledArgs = (args) => {

    const styledArgs = args.map((arg) => {

        return arg;
    });

    return styledArgs;
}

module.exports = {

    log: (...args) => {

        console.log(...internals.styledArgs(args));
    },
    warn: (...args) => {

        console.warn(...internals.styledArgs(args));
    }
};
