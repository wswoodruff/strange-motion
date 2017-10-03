
const utils = {};
module.exports = utils;

utils.debounce = (func, wait, immediate) => {

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

utils.isAnimConfig = (maybeAnimConfig) => {

    if (typeof maybeAnimConfig !== 'object' ||
        Array.isArray(maybeAnimConfig)) {
        return false;
    }

    if (maybeAnimConfig.enter ||
        maybeAnimConfig.start ||
        maybeAnimConfig.beforeEnter ||
        maybeAnimConfig.leave) {
            return true;
    }

    return false;
}
