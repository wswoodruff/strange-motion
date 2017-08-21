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
        children: T.any.isRequired,
        animWrapperComponent: T.any,
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
            animConfig = this.processAnimConfig(props.animConfig);
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
            model = this._getElementsFromChildren(props.children);
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
        this.getElementsFromChildren = this._getElementsFromChildren.bind(this);
        this.applyInterpolatedStyles = this._applyInterpolatedStyles.bind(this);
        this.genId = this._genId.bind(this);
    }

    getChildren(interpolatedStyles) {

        const {
            animWrapperComponent,
            animWrapperProps,
            childWrapperComponent,
            childWrapperProps,
            childProps
        } = this.state;

        // Apply new styles to children
        const interpolatedChildren = [].concat(interpolatedStyles)
        .map(({ style, data, key,  }) => {

            let newChildPropsVal = {};
            if (childProps) {
                newChildPropsVal = childProps(data);
            }

            // TODO Need to set default styles here from animConfigs

            return this.applyInterpolatedStyles({
                style,
                child: data,
                key,
                childWrapperComponent,
                childWrapperProps,
                newChildPropsVal,
            });
        });

        // if (animWrapperComponent) {
            return React.createElement(
                animWrapperComponent || 'div',
                animWrapperProps && animWrapperProps(interpolatedStyles) || {},
                interpolatedChildren
            );
        // }
        // else {
        //     return interpolatedChildren.map((interpolatedChild) => {
        //
        //         return React.cloneElement(
        //             interpolatedChild,
        //             animWrapperProps && animWrapperProps(interpolatedStyles) || {}
        //         );
        //     })
        //
        // }

    };

    _applyInterpolatedStyles({
        style,
        child,
        key,
        childWrapperComponent,
        childWrapperProps,
        newChildPropsVal
    }) {

        if (!key) {
            key = this.genId();
        }

        const { children } = this.props;
        const childStyle = child.props && child.props.style;

        const newChildProps = newChildPropsVal;

        let newStyle = style;

        newStyle = _merge(
            {},
            childStyle || {},
            style
        );

        let newChild;

        // TODO Left off with these just copies of each other
        // need to edit the 2nd 2, and make sure these first
        // 2 work

        if (this.state.childIsFunc && !childWrapperComponent) {
            newChild = React.cloneElement(
                children({ style: newStyle, child, key }),
                newChildProps
            );
        }
        else if (this.state.childIsFunc && childWrapperComponent) {
            newChild = React.cloneElement(
                children({ style: childStyle, child, key }),
                newChildProps
            );
        }

        if (!this.state.childIsFunc && !childWrapperComponent) {
            newChild = React.cloneElement(
                child,
                newChildProps
            );
        }
        else if (!this.state.childIsFunc && childWrapperComponent) {
            newChild = React.cloneElement(
                children({ style: childStyle, child, key }),
                newChildProps
            );
        }

        // if (!childWrapperComponent) {


        // }

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
            )
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

    processAnimConfig(animConfig) {

        console.log('animConfig', animConfig);

        if (animConfig.leave) {

            const leaveAnimVals = Object.keys(animConfig.leave)
            .reduce((collector, key) => {

                const cssItem = animConfig.leave[key];

                if (typeof cssItem === 'object') {
                    collector[key] = cssItem;
                }
                else {
                    collector[key] = { val: cssItem };
                }

                return collector;
            }, {});

            if (!animConfig.start) {
                animConfig.start = leaveAnimVals;
            }
        }

        if (!animConfig.beforeEnter) {
            animConfig.beforeEnter = _merge(
                {},
                animConfig.start
            );
        }

        const self = this;

        const {
            assignedAnimConfig,
            delays
        } = Utils.assignAnimConfig({
            beginAnimConfig: self.state && self.state.animConfig, //////////// laksjdflkjasdklfjasf WTF IS GOING ON?!?!??!!?
            newAnimConfig: animConfig
        });

        if (delays) {
            this.waitingDelays = delays;
        }

        return assignedAnimConfig;
    }

    // Why do I have newAnimConfig here if nobody is using it?
    // it's to make sure you know what you're passing in. So when
    // you look at code you'll know what it is in the function that
    // calls 'assignAnimConfig'

    assignAnimConfig({ newAnimConfig: passedInAnimConfig }) {

        // TODO Need to be able to set this in props if possible

        let reactMotion;

        if (this.reactMotion) {
            reactMotion = this.reactMotion;
        }

        if (this.reactTransitionMotion) {
            reactMotion = this.reactTransitionMotion;
        }

        const newAnimConfig = Object.keys(passedInAnimConfig)
        .reduce((collector, animType) => {

            const currentAnimType = passedInAnimConfig[animType];

            const newAnimType = Object.keys(currentAnimType)
            .reduce((collector, cssProp) => {

                const cssPropVal = currentAnimType[cssProp];

                if (cssPropVal === 'getLastIdealStyle') {
                    collector[cssProp] = { val: reactMotion.state.lastIdealStyle[cssProp] };
                }
                else {
                    collector[cssProp] = cssPropVal;
                }

                return collector;
            }, {});

            collector[animType] = newAnimType;

            return collector;
        }, {});

        //

        const self = this;

        const { assignedAnimConfig, delays } = Utils.assignAnimConfig({
            beginAnimConfig: self.state && self.state.animConfig,
            newAnimConfig,
            reactMotion
        });

        this.setState({
            animConfig: assignedAnimConfig
        },
        () => {

            // if there weren't any delays, 'delay' will be set to undefined
            // from Utils.assignAnimConfig
            if (delays) {

                console.warn('delays', delays);

                /*
                    // TODO Actually lookup what goes in this delays object
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
            }
        });
    }

    componentDidMount() {

        const { waitingDelays } = this;

        if (waitingDelays) {

            Object.keys(waitingDelays).forEach((delay) => {

                setTimeout(() => {

                    this.assignAnimConfig({ newAnimConfig: waitingDelays[delay] });
                }, delay);
            });
        }
    }

    componentWillReceiveProps(nextProps) {

        const {
            children,
            model,
            animConfig
        } = nextProps;

        if (children && typeof children !== 'function') {

            this.setState({
                model: this.getElementsFromChildren(children)
            });
        }

        if (model) {
            this.setState({ model });
        }

        if (animConfig) {
            this.assignAnimConfig({ newAnimConfig: animConfig });
        }
    }

    filterChildrenForType(children) {

        return children;
    }

    _getElementsFromChildren(children) {

        if (!Array.isArray(children)) {
            children = [].concat(children);
        }

        return children.reduce((collector, child) => {

            if (React.isValidElement(child)) {
                collector.push(child);
            }

            return collector;
        }, []);
    }

    _genId() {

        return Math.random().toString(16).slice(2);
    }

    _willEnter() {

        const { animConfig } = this.state;
        return animConfig.beforeEnter;
    }

    _willLeave() {

        const { animConfig } = this.state;
        return animConfig.leave;
    }

    _getDefaultStyles() {

        return this.getStyles();
    }

    _getStyles() {

        const { model, animConfig } = this.state;

        let filteredModel;
        if (this.props.model) {
            filteredModel = model;
        }
        else {
            // TODO This doesn't make any sense, it's only here for the toggle-motion
            filteredModel = this.filterChildrenForType(model);
        }

        console.log(filteredModel);

        return filteredModel.map((child, i) => {

            const { key, id: itemId } = child;

            let newKey = key;

            if (!newKey) {
                if (itemId) {
                    newKey = itemId;
                }
                else {
                    newKey = this._genId();
                }
            }

            console.log(animConfig);

            return {
                data: child,
                style: animConfig.start,
                key: String(newKey)
            };
        });
    }
};
