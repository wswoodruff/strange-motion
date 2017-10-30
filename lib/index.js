const React = require('react');
const T = require('prop-types');
const { spring } = require('react-motion');
const Utils = require('./utils');
const _merge = require('lodash/merge');

module.exports = class StrangeMotion extends React.PureComponent {

    static propTypes = {
        model: T.array,
        animConfig: T.shape({
            start: T.object,
            beforeEnter: T.object,
            enter: T.object.isRequired,
            leave: T.object
        }),
        animPlugins: T.array,
        children: T.any.isRequired,
        animWrapperComponent: T.any,
        animWrapperComponentRef: T.func,
        animWrapperProps: T.func,
        childWrapperComponent: T.any,
        childWrapperProps: T.func,
        childProps: T.func
    }

    static defaultSpring = {
        stiffness: 170,
        damping: 26,
        precision: 0.01
    }

    constructor(props) {

        super();

        let animConfig;
        if (!props.animConfig) {
            animConfig = this._getDefaultAnimConfig();
        }
        else {
            animConfig = this.processInitAnimConfig(props.animConfig);
        }

        let model;
        let childIsFunc;

        if (props.model) {
            model = props.model;
        }

        if (typeof props.children === 'function') {

            childIsFunc = true;
            if (!props.model) {
                throw new Error('StrangeMotion: Must pass in model if children is a function');
            }
            model = props.model;
        }
        else {
            childIsFunc = false;
            if (props.model) {
                throw new Error('StrangeMotion: Must pass function as child if model is provided in props');
            }
            model = Utils.getElementsFromChildren(props.children);
        }

        this.state = {
            animConfig,
            model,
            childIsFunc,
            childWrapperComponent: props.childWrapperComponent,
            childWrapperProps: props.childWrapperProps
        };

        this.willEnter = this._willEnter.bind(this);
        this.willLeave = this._willLeave.bind(this);
        this.getStyles = this._getStyles.bind(this);
        this.getDefaultStyles = this._getDefaultStyles.bind(this);
        this.applyInterpolatedStyles = this._applyInterpolatedStyles.bind(this);
        this.genId = this._genId.bind(this);
        this.applyPlugins = this._applyPlugins.bind(this);
    }

    getChildren(interpolatedStyles) {

        const {
            animWrapperComponent,
            animWrapperProps,
            childWrapperComponent,
            childWrapperProps,
            childProps,
            model
        } = this.state;

        const interpolatedAsArray = [].concat(interpolatedStyles);

        if (typeof interpolatedStyles === 'object' &&
            !Array.isArray(interpolatedStyles)) {

            // it's a Motion object

            const interpolatedChild = interpolatedAsArray
            .map((style) => {

                let newChildPropsVal = {};
                if (childProps) {
                    newChildPropsVal = childProps(style);
                }

                // Use model right here
                const newChild = Array.isArray(model) ? model[0] : model;

                return this.applyInterpolatedStyles({
                    style,
                    child: newChild,
                    childWrapperComponent,
                    childWrapperProps,
                    newChildPropsVal
                });
            })[0]; // Grab the first and only item here

            if (!animWrapperComponent && !animWrapperProps) {
                return interpolatedChild;
            }

            if (animWrapperComponent) {
                return React.createElement(
                    animWrapperComponent,
                    animWrapperProps && animWrapperProps(interpolatedStyles) || {},
                    interpolatedChild
                );
            }
            else {
                return React.cloneElement(
                    interpolatedChild,
                    animWrapperProps && animWrapperProps(interpolatedStyles) || {}
                );
            }
        }

        // Apply new styles to children

        const interpolatedChildren = interpolatedAsArray
        .map(({ style, data, key }) => {

            let newChildPropsVal = {};
            if (childProps) {
                newChildPropsVal = childProps({ style, data, key });
            }

            return this.applyInterpolatedStyles({
                style,
                child: data,
                key,
                childWrapperComponent,
                childWrapperProps,
                newChildPropsVal,
            });
        });

        return React.createElement(
            animWrapperComponent || 'div',
            animWrapperProps && animWrapperProps(interpolatedStyles) || {},
            interpolatedChildren
        );
    };

    _applyInterpolatedStyles({
        style,
        child,
        key,
        childWrapperComponent,
        childWrapperProps,
        newChildPropsVal
    }) {

        const stylePluginsApplied = this.applyPlugins({
           pluginFunc: 'toCss',
           applyTo: style
        });

        if (!key) {
            key = this.genId();
        }

        const { children } = this.props;
        const childStyle = child.props && child.props.style;

        let newStyle = stylePluginsApplied;

        newStyle = Object.assign(
            {},
            childStyle || {},
            stylePluginsApplied
        );

        let newChild;

        const newChildProps = newChildPropsVal;

        if (this.state.childIsFunc && !childWrapperComponent) {

            newChild = React.cloneElement(
                children({ style: newStyle, child, key }),
                { ...newChildProps, style }
            );
        }
        else if (this.state.childIsFunc && childWrapperComponent) {

            newChild = React.cloneElement(
                children({ style: newStyle, child, key }),
                newChildProps
            );
        }

        if (!this.state.childIsFunc && !childWrapperComponent) {

            newChild = React.cloneElement(
                child,
                { ...newChildProps, style: newStyle }
            );
        }
        else if (!this.state.childIsFunc && childWrapperComponent) {

            newChild = React.cloneElement(
                child,
                newChildProps
            );
        }

        if (childWrapperComponent) {

            let childWrapperPropsVal = {};

            if (typeof childWrapperProps === 'function') {
                childWrapperPropsVal = childWrapperProps(
                    { child, key }
                );
            }
            else if (childWrapperProps) {
                childWrapperPropsVal = childWrapperProps;
            }

            newChild = React.createElement(
                childWrapperComponent,
                { key, ...childWrapperPropsVal },
                newChild
            );
        }

        return newChild;
    }

    _getDefaultAnimConfig() {

        return {
            start: {},
            beforeEnter: {},
            enter: {},
            leave: {}
        };
    }

    processInitAnimConfig(animConfig) {

        const animConfigWithDefaults = Utils.assignDefaultsToAnimConfig(animConfig);

        const self = this;

        const animConfigPluginsApplied = this._applyPlugins({
            pluginFunc: 'assignAnimConfig',
            applyTo: animConfigWithDefaults
        });

        const {
            assignedAnimConfig,
            delays
        } = Utils.assignAnimConfig({
            beginAnimConfig: self.state && self.state.animConfig,
            newAnimConfig: animConfigPluginsApplied
        });

        if (delays) {
            this.waitingDelays = delays;
        }

        return assignedAnimConfig;
    }

    _applyPlugins({ pluginFunc, applyTo }) {

        if (!this.props) {
            return applyTo;
        }

        const { animPlugins } = this.props;

        // Plugin validation
        const filteredAnimPlugins = [].concat(animPlugins).filter((plugin) => plugin ? true : false);

        let pluginsApplied = applyTo;

        // TODO implement Topo sorting for plugins

        filteredAnimPlugins.forEach((plugin) => {

            if (plugin[pluginFunc]) {

                if (pluginFunc === 'getStyles') {
                    pluginsApplied = plugin[pluginFunc](applyTo, this.reactMotion);
                }
                else {
                    pluginsApplied = plugin[pluginFunc](applyTo);
                }
            }

            if (plugin['getReactMotion']) {
                plugin['getReactMotion'](this.reactMotion);
            }
        });

        return pluginsApplied;
    }

    // Why do I have newAnimConfig here if nobody is using it?
    // it's for documentation to make sure you know what you're passing in.

    assignAnimConfig({ newAnimConfig: passedInAnimConfig }, setStateCb) {

        let newAnimConfig = JSON.parse(JSON.stringify(passedInAnimConfig));

        if (passedInAnimConfig.enter &&
            passedInAnimConfig.enter.$delay) {

            const { $delay: $enterDelay, ...enterWithoutDelay } = passedInAnimConfig.enter;

            // setup the $delay

            setTimeout(() => {

                const newAnimConfigClone = JSON.parse(JSON.stringify(newAnimConfig));

                this.assignAnimConfig({
                    newAnimConfig: { enter: enterWithoutDelay }
                }, this._setNewAnimConfig(passedInAnimConfig, newAnimConfigClone));
            }, $enterDelay);

            const { enter, ...rest } = passedInAnimConfig;
            if (Object.keys(rest).length !== 0) {
                newAnimConfig = rest;
            }
        }

        this._setNewAnimConfig(passedInAnimConfig, newAnimConfig, setStateCb)();
    }

    _setNewAnimConfig(passedInAnimConfig, newAnimConfig, setStateCb) {

        const reactMotion = this.reactMotion;

        let beginAnimConfig = this.state.animConfig;

        return () => {

            newAnimConfig = Object.keys(newAnimConfig)
            .reduce((collector, animType) => {

                const currentAnimType = passedInAnimConfig[animType];

                const newAnimType = Object.keys(currentAnimType)
                .reduce((collector, cssPropName) => {

                    const cssPropVal = currentAnimType[cssPropName];

                    if (cssPropVal === 'getLastIdealStyle') {

                        const lastIdealStyle = reactMotion.state.lastIdealStyle[cssPropName];

                        if (typeof lastIdealStyle !== 'undefined') {

                            collector[cssPropName] = lastIdealStyle;
                        }
                    }
                    else {
                        collector[cssPropName] = cssPropVal;
                    }

                    return collector;
                }, {});

                collector[animType] = newAnimType;

                return collector;
            }, {});

            //

            const animConfigPluginsApplied = this.applyPlugins({
                pluginFunc: 'assignAnimConfig',
                applyTo: newAnimConfig
            });

            const {
                assignedAnimConfig,
                delays
            } = Utils.assignAnimConfig({
                beginAnimConfig,
                newAnimConfig: animConfigPluginsApplied,
                reactMotion
            });

            if (newAnimConfig.start) {

                return this.setState({
                    animConfig: {
                        ...assignedAnimConfig,
                        enter: newAnimConfig.start
                    }
                }, () => {

                    this.setState({
                        animConfig: assignedAnimConfig
                    }, () => {

                        if (typeof setStateCb === 'function') {
                            setStateCb();
                        }

                        this.handleDelays(delays);
                    });
                });
            }

            this.setState({
                animConfig: assignedAnimConfig
            }, () => {

                if (typeof setStateCb === 'function') {
                    setStateCb();
                }

                this.handleDelays(delays);
            });
        }
    };

    handleDelays(delays) {

        // if there weren't any delays, '$delay' will be set to undefined
        // from Utils.assignAnimConfig
        if (delays) {
            /*
                Delays object is organized by its delay times. ex:
                {
                    400: [{ enter: { top: 100, left: 100 } }],
                    10000: [{ enter: { top: 500, left: 300 }] }
                }
            }
            */

            Object.keys(delays).forEach((delay) => {

                setTimeout(() => {

                    [].concat(delays[delay]).forEach((currentDelay) => {

                        this.assignAnimConfig({
                            newAnimConfig: currentDelay
                        });
                    })

                }, delay);
            });
        };
    };

    componentDidMount() {

        const { waitingDelays } = this;

        if (waitingDelays) {

            Object.keys(waitingDelays).forEach(($delay) => {

                setTimeout(() => {

                    this.assignAnimConfig({ newAnimConfig: waitingDelays[$delay] });
                }, $delay);
            });
        }
    };

    componentWillReceiveProps(nextProps) {

        const {
            children,
            model,
            animConfig
        } = nextProps;

        if (children && typeof children !== 'function') {

            this.setState({
                model: Utils.getElementsFromChildren(children)
            });
        }

        if (model) {
            this.setState({ model });
        }

        // Thanks to React, we won't have to worry
        // about the same animConfig being passed in twice,
        // so we can safely assume that whatever animConfig
        // props the user assigns via the `animController` will
        // take precedence in `getStyles()`, and won't be
        // immediately overwritten with styles here.

        // NOTE: This does mean that any animations defined with
        // the animController will be overwritten with this one.
        // Of course they can be changed again via the animController
        // which will take over. This is basically now an alias of
        // animController.mergeAnimConfig()

        if (animConfig) {
            this.assignAnimConfig({ newAnimConfig: animConfig });
        }
    };

    filterChildrenForType(children) {

        return children;
    };

    _genId() {

        return Math.random().toString(16).slice(2);
    };

    // Only used with TransitionMotion
    _willEnter() {

        const { animConfig } = this.state;
        return animConfig.beforeEnter;
    };

    // Only used with TransitionMotion
    _willLeave() {

        const { animConfig } = this.state;
        return animConfig.leave;
    };

    _getDefaultStyles() {

        const defaultStyles = this.getStyles('start')
        .map((interpolatedStyle) => {

            const newCssVals = this.applyPlugins({
                pluginFunc: 'getDefaultStyles',
                applyTo: interpolatedStyle.style
            });

            // Do NOT deep merge this. applyPlugins is allowed to do
            // transformations on the styles, and we want the `style`
            // prop to be preserved in `{ style: newCssVals }`
            const newInterpolatedStyle = Object.assign(
                {},
                interpolatedStyle,
                { style: newCssVals }
            );

            return newInterpolatedStyle;
        });

        return defaultStyles;
    };

    _getStyles(animConfigKey) {

        const { model, animConfig } = this.state;

        let mergedAnimConfig = animConfig;

        if (this.animController && this.animControllerAnimConfig) {
            mergedAnimConfig = Object.assign({},
                animConfig,
                this.animControllerAnimConfig
            );
        };

        let filteredModel;
        if (this.props.model) {
            filteredModel = model;
        }
        else {
            // TODO This doesn't make any sense, it's only here for the toggle-motion
            filteredModel = this.filterChildrenForType(model);
        }

        const newStyles = filteredModel.map((child, i) => {

            const { key, id: itemId, name } = child;

            let newKey = key || '';

            if (!key) {
                if (itemId) {
                    newKey += itemId;
                }

                if (name) {
                    newKey += name + i;
                }
            }

            if (newKey === '') {
                newKey = this._genId();
            }

            const newCssVals = this.applyPlugins({
                pluginFunc: 'getStyles',
                applyTo: animConfigKey ? mergedAnimConfig[animConfigKey] : mergedAnimConfig.enter
            });

            return {
                data: child,
                style: newCssVals,
                key: String(newKey)
            };
        });

        return newStyles;
    };
};
