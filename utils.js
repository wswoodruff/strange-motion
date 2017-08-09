
const { presets } = require('react-motion');
const { default: Rx } = require('rxjs');

const internals = {
    observables = {}
}

module.exports = {

    getConfigAssignObservable: function() {

        // Code grabbed from https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observer.md#rxobservercreateonnext-onerror-oncompleted

        var source = Rx.Observable.create(function (observer) {

            observer.onNext(42);

            // Note that this is optional, you do not have to return this if you require no cleanup
            return function () {
                console.log('disposed');
            };
        });

        var source = Rx.Observable.return(42);
        var observer = Rx.Observer.create();
        return source.subscribe(observer);
    },

    pushToObserver: function(observerId, value) {

        if (internals.observables[observerId]) {
            return internals.observables[observerId].onNext(value);
        }

        throw new Error(`observerId ${observerId} doesn't exist`);
    },

    assignAnimConfig: function({
        beginAnimConfig,
        incomingAnimConfig,
        assignOverride
    }) {

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

                        if (typeof cssProp.delay === 'number') {
                            // internals.observables
                        }

                        /// TODO work with observeAnimConfigAssigns here
                        // Make it so a setTimeout happens for the delay
                        // and then push to the observable

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
