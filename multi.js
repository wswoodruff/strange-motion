const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { TransitionMotion } = require('react-motion');
const Motion = require('./motion');
const Utils = require('./utils');

// Component

module.exports = class MultiMotion extends React.PureComponent {

    static propTypes = {
        animConfigs: T.object.isRequired,
        children: T.any.isRequired,
        getAnimController: T.func
    }

    constructor(props) {

        // TODO Check to make sure each keyed child has an animConfig

        super(props);

        const children = Utils.getElementsFromChildren(props.children);
        const configKeys = Object.keys(props.animConfigs);
        const childrenByKeys = this._getModelByKeys(props.children);

        const {
            delayConfigs,
            immediateAnimConfigs,
            immediateChildren
        } = Object.keys(props.animConfigs)
        .reduce((collector, animKey) => {

            const anim = props.animConfigs[animKey];
            const child = childrenByKeys[animKey];

            if (!!anim.delay) {
                const delay = anim.delay;
                delete anim.delay;
                collector.delayConfigs.push({
                    delayAnimConfig: { key: animKey, val: anim },
                    delayChild: child,
                    delay
                });
            }
            else {
                collector.immediateAnimConfigs[animKey] = anim;
                collector.immediateChildren.push(child);
            }

            return collector;
        }, {
            delayConfigs: [],
            immediateAnimConfigs: {},
            immediateChildren: []
        });

        const self = this;

        // Where we set childWrapperComponent
        // and childWrapperProps

        this.state = Object.assign(
            {},
            this.state,
            {
                model: immediateChildren,
                animConfigs: immediateAnimConfigs,
                childWrapperComponent: Motion,
                childWrapperProps: this.getChildWrapperProps.bind(self)
            }
        );

        /*
            delayConfig's schema
            [{
                delayAnimConfig,
                delayChild,
                delay
            }]
        */

        delayConfigs.forEach((delayConfig) => {

            const { delayAnimConfig, delayChild, delay } = delayConfig;

            setTimeout(() => {

                const currentAnimConfigs = this.state.animConfigs;
                const currentModel = this.state.model;
                delete delayAnimConfig.delay;

                const newAnimConfigs = {
                    ...currentAnimConfigs,
                    [delayAnimConfig.key]: delayAnimConfig.val
                }

                const newModel = [...currentModel, delayChild];

                this.setState({
                    model: newModel,
                    animConfigs: newAnimConfigs
                })
            }, delay);
        });

        this.animController = Object.keys(immediateAnimConfigs)
        .reduce((collector, childKey) => {

            collector[childKey] = 'enter';
        }, {});

        if (props.getAnimController) {
            prop.getAnimController(this.animController);
        }

        this.getModelByKeys = this._getModelByKeys.bind(this);
        this.willLeave = this._willLeave.bind(this);
    }

    _getModelByKeys(model) {

        return model.reduce((collector, child) => {

            collector[child.key] = child;
            return collector;
        }, {});
    }

    render() {

        const { animConfigs } = this.props;

        return (
            <div>
                {Object.keys(animConfigs).map((animName) => {
                    return (
                        <div>Ayoo</div>
                    );
                })}
            </div>
        );
    }
};
