const React = require('react');
const T = require('prop-types');
const Motion = require('./motion');
const Utils = require('./utils');

// Component

module.exports = class MultiMotion extends React.PureComponent {

    static propTypes = {
        animConfigs: T.object.isRequired,
        children: T.any.isRequired,
        getAnimControllers: T.func
    }

    constructor(props) {

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

            if (!!anim.$delay) {

                const $delay = anim.$delay;

                // delete the $delay for the future animConfig
                // or we'd be in an infinite loop right?

                delete anim.$delay;

                collector.delayConfigs.push({
                    delayAnimConfig: { key: animKey, val: anim },
                    delayChild: child,
                    $delay
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

        const immediateAnimConfigsWithDefaults = Object.keys(immediateAnimConfigs)
        .reduce((collector, animKey) => {

            // 'Utils.assignDefaultsToAnimConfig' handles
            // $delay set for individual css props

            collector[animKey] = Utils.assignDefaultsToAnimConfig(immediateAnimConfigs[animKey]);

            return collector;
        }, {});

        const self = this;

        this.animControllers = {};

        this.state = Object.assign(
            {},
            this.state,
            {
                model: immediateChildren,
                animConfigs: immediateAnimConfigsWithDefaults
            }
        );

        /*
            delayConfig's schema
            [{
                delayAnimConfig,
                delayChild,
                $delay
            }]
        */

        delayConfigs.forEach((delayConfig) => {

            const { delayAnimConfig, delayChild, $delay } = delayConfig;

            setTimeout(() => {

                const currentAnimConfigs = this.state.animConfigs;
                const currentModel = this.state.model;
                delete delayAnimConfig.$delay;

                // Can process nested $delays set here
                const delayedAnimConfigWithDefaults = Utils.assignDefaultsToAnimConfig(delayAnimConfig);

                const newAnimConfigs = {
                    ...currentAnimConfigs,
                    [delayedAnimConfigWithDefaults.key]: delayedAnimConfigWithDefaults.val
                }

                const newModel = [...currentModel, delayChild];

                this.setState({
                    model: newModel,
                    animConfigs: newAnimConfigs
                })
            }, $delay);
        });

        this.getModelByKeys = this._getModelByKeys.bind(this);
        this.setAnimController = this._setAnimController.bind(this);
    }

    _getModelByKeys(model) {

        return model.reduce((collector, child) => {

            collector[child.key] = child;
            return collector;
        }, {});
    }

    _setAnimController(animName) {

        const { animConfigs } = this.state;
        const { getAnimControllers } = this.props;

        return (animController) => {

            const { animConfigs } = this.state;

            const newAnimControllers = Object.assign({},
                { ...this.animControllers },
                {
                    [animName]: animController
                }
            );

            this.animControllers = newAnimControllers;

            if (typeof getAnimControllers === 'function') {
                getAnimControllers(this.animControllers);
            }
        }
    }

    /*
        Make a strange-motion plugin called `quake` that accepts seismic number
        etc. and makes the thing shake perpendicularly or in a sine-wavelike fasion
        like an earthquake

        Make a strange-motion plugin called `blur` that accepts a blur multiplier number

        The `timeline` plugin can accept an array of plugins to apply to a partial of
        a timeline animation
    */

    render() {

        const { model, animConfigs } = this.state;

        const modelByKeys = this.getModelByKeys(model);

        const controlledAnimConfigs = Object.keys(animConfigs)
        .reduce((collector, animName) => {

            collector[animName] = animConfigs[animName];


            return collector;
        }, {});

        return (
            <div>
                {Object.keys(controlledAnimConfigs).map((animName) => {
                    return (
                        <Motion
                            animConfig={controlledAnimConfigs[animName]}
                            getAnimController={this.setAnimController(animName)}
                            key={animName}
                        >
                            {modelByKeys[animName]}
                        </Motion>
                    );
                })}
            </div>
        );
    }
};
