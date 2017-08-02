const React = require('react');
const T = require('prop-types');
const { spring } = require('react-motion');
const { assignAnimConfig } = require('./utils');

const internals = {
    defaultSpring: {
        stiffness: 170,
        damping: 26,
        precision: 0.01
    }
};

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

        let animConfig;
        if (!props.animConfig) {
            animConfig = this._getDefaultAnimConfig();
        }
        else {
            animConfig = this.processAnimConfig(props.animConfig);
        }

        let model;

        if (typeof props.children === 'function') {

            if (!props.model) {
                throw new Error('Must pass in model if children is a function');
            }
            this.getChildren = props.children;
            model = props.model;
        }
        else {

            model = this._getElementsFromChildren(props.children);

            this.getChildren = (interpolatedStyles) => {

                const interpolatedChildren = [];

                interpolatedStyles.forEach(({ data, key, style }) => {

                    const child = data;
                    const childStyle = child.props.style;

                    if (childStyle) {
                        style = { ...childStyle, ...style };
                    }

                    const childProps = Object.assign({},
                        { key, style },
                        props.wrapperProps || {}
                    );

                    const clonedChild = React.cloneElement(child, {
                        style,
                        ...childProps
                    });

                    interpolatedChildren.push(clonedChild);
                });

                return React.createElement(
                    props.wrapperComponent || 'div',
                    props.wrapperProps || {},
                    interpolatedChildren
                );
            };
        }

        this.state = {
            animConfig,
            model
        };

        this.willEnter = this._willEnter.bind(this);
        this.willLeave = this._willLeave.bind(this);
        this.getStyles = this._getStyles.bind(this);
        this.getDefaultStyles = this._getDefaultStyles.bind(this);
        this.getElementsFromChildren = this._getElementsFromChildren.bind(this);
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

        return assignAnimConfig(null, animConfig, internals.defaultSpring);
    }

    componentWillReceiveProps(nextProps) {

        const children = nextProps.children;

        if (children && typeof children !== 'function') {

            this.setState({
                model: this.getElementsFromChildren(children)
            });
        }
    }

    filterChildrenForType(children) {

        return children;
    }

    _getElementsFromChildren(children) {

        if (!Array.isArray(children)) {
            children = [].concat(children);
        }

        return children.filter((child) => {

            return React.isValidElement(child);
        });
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

        const filteredModel = this.filterChildrenForType(model);

        return filteredModel.map((item, i) => {

            const key = item.key;

            if (this.childIsFunc && !key) {
                if (item.id) {
                    item.key = item.id;
                }
                else {
                    item.key = this._genId();
                }
            }

            return { data: item, style: animConfig.startStyle, key: String(key) };
        });
    }

    mutateEnterAnimHook(enterAnim, key) {

        return enterAnim;
    }

    _getStyles() {

        const {
            model,
            animConfig } = this.state;

        const filteredModel = this.filterChildrenForType(model);

        return filteredModel.map((item, i) => {

            let key = item.key;

            if (this.childIsFunc && !key) {
                if (item.id) {
                    key = item.key = item.id;
                }
                else {
                    key = item.key = this._genId();
                }
            }

            let enterAnim = JSON.parse(JSON.stringify(animConfig.enterAnim));

            enterAnim = this.mutateEnterAnimHook(enterAnim, key);

            return {
                data: item,
                style: enterAnim,
                key: String(key)
            };
        });
    }
};
