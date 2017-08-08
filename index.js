const React = require('react');
const T = require('prop-types');
const { spring } = require('react-motion');
const { assignAnimConfig } = require('./utils');

module.exports = class StrangeMotion extends React.PureComponent {

    static propTypes = {
        model: T.array,
        animConfig: T.shape({
            startStyle: T.object,
            beforeEnterStyle: T.object,
            enterAnim: T.object.isRequired,
            leaveAnim: T.object
        }),
        children: T.any.isRequired,
        wrapperComponent: T.any,
        wrapperProps: T.object
    }

    constructor(props) {

        super();

        this.defaultSpring = {
            stiffness: 170,
            damping: 26,
            precision: 0.01
        }

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
            childIsFunc
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

        const { wrapperComponent, wrapperProps } = this.props;
        const interpolatedChildren = [];

        [].concat(interpolatedStyles).forEach(({ style, data, key,  }) => {

            interpolatedChildren.push(this.applyInterpolatedStyles({ style, child: data, key }));
        });

        return React.createElement(
            wrapperComponent || 'div',
            wrapperProps || {},
            interpolatedChildren
        );
    };

    _applyInterpolatedStyles({ style, child, key }) {

        const { childIsFunc } = this.state;

        if (!key) {
            key = this.genId();
        }

        if (childIsFunc) {
            const { children } = this.props;
            return children({ style, child, key });
        }

        const childStyle = child.props && child.props.style;

        if (childStyle) {
            style = { ...childStyle, ...styles };
        }

        const childProps = Object.assign({},
            { key, style },
            this.props.wrapperProps || {}
        );

        return React.cloneElement(child, {
            ...childProps
        });
    }

    _getDefaultAnimConfig() {

        return {
            startStyle: {
                opacity: 0,
                fontSize: 10
            },
            beforeEnterStyle: {
                opacity: 0,
                fontSize: 10
            },
            enterAnim: {
                opacity: spring(1, {
                    stiffness: 210,
                    damping: 25
                }),
                fontSize: spring(100, {
                    stiffness: 180,
                    damping: 16
                })
            },
            leaveAnim: {
                opacity: spring(0),
                fontSize: spring(60)
            }
        };
    }

    processAnimConfig(animConfig) {

        if (animConfig.leaveAnim) {

            const leaveAnimVals = Object.keys(animConfig.leaveAnim)
            .reduce((collector, key) => {

                const item = animConfig.leaveAnim[key];

                if (typeof item === 'object') {
                    collector[key] = item.val;
                }
                else {
                    collector[key] = item;
                }

                return collector;
            }, {});

            if (!animConfig.startStyle) {
                animConfig.startStyle = leaveAnimVals;
            }

            if (!animConfig.beforeEnterStyle) {
                animConfig.beforeEnterStyle = leaveAnimVals;
            }
        }

        return assignAnimConfig(null, animConfig, this.defaultSpring);
    }

    componentWillReceiveProps(nextProps) {

        const { children, model } = nextProps;

        if (children && typeof children !== 'function') {

            this.setState({
                model: this.getElementsFromChildren(children)
            });
        }

        if (model) {
            this.setState({ model });
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
        return animConfig.beforeEnterStyle;
    }

    _willLeave() {

        const { animConfig } = this.state;
        return animConfig.leaveAnim;
    }

    _getDefaultStyles() {

        const { model, animConfig } = this.state;

        let filteredModel;
        if (this.props.model) {
            filteredModel = model;
        }
        else {
            filteredModel = this.filterChildrenForType(model);
        }

        return filteredModel.map((item, i) => {

            let key = item.key;

            if (!key) {
                if (item.id) {
                    key = item.id;
                }
                else {
                    key = this._genId();
                }
            }

            return {
                data: item,
                style: animConfig.startStyle || {},
                key: String(key)
            };
        });
    }

    _getStyles() {

        const { model, animConfig } = this.state;

        let filteredModel;
        if (this.props.model) {
            filteredModel = model;
        }
        else {
            filteredModel = this.filterChildrenForType(model);
        }

        return filteredModel.map((item, i) => {

            let key = item.key;

            if (!key) {
                if (item.id) {
                    key = item.id;
                }
                else {
                    key = this._genId();
                }
            }

            const enterAnim = animConfig.enterAnim;

            return {
                data: item,
                style: enterAnim,
                key: String(key)
            };
        });
    }
};
