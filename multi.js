const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { TransitionMotion } = require('react-motion');
const Motion = require('./motion');

// Component

module.exports = class MultiMotion extends StrangeMotion {

    static propTypes = {
        animConfigs: T.object.isRequired,
        children: T.any.isRequired
    }

    constructor(props) {

        // TODO Check to make sure each keyed child has an animConfig

        super(props);

        const children = this._getElementsFromChildren(props.children);
        const configKeys = Object.keys(props.animConfigs);
        const childrenByKeys = this._getModelByKeys(props.children);

        const {
            delayedAnimConfigs,
            delayedChildren,
            immediateAnimConfigs,
            immediateChildren
        } = Object.keys(props.animConfigs)
        .reduce((collector, animKey) => {

            const anim = props.animConfigs[animKey];
            const child = childrenByKeys[animKey];

            if (!!anim.delay) {
                collector.delayedAnimConfigs[animKey] = anim;
                collector.delayedChildren.push(child);
            }
            else {
                collector.immediateAnimConfigs[animKey] = anim;
                collector.immediateChildren.push(child);
            }

            return collector;
        }, {
            delayedAnimConfigs: {},
            delayedChildren: [],
            immediateAnimConfigs: {},
            immediateChildren: []
        });

        const self = this;
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

        Object.keys(delayedAnimConfigs).forEach((delayedAnimKey) => {

            const delayedAnim = delayedAnimConfigs[delayedAnimKey];

            setTimeout(() => {

                const currentAnimConfigs = this.state.animConfigs;
                const currentModel = this.state.model;
                delete delayedAnim.delay;

                const delayElem = model.find((child) => {

                    return child.key === delayedAnimKey;
                });

                this.setState({
                    model: [...currentModel, delayElem],
                    animConfigs: {
                        ...currentAnimConfigs,
                        [delayedAnimKey]: delayedAnim
                    }
                })
            }, delayedAnim.delay);
        });

        this.getRef = this._getRef.bind(this);
        this.getModelByKeys = this._getModelByKeys.bind(this);
    }

    _getModelByKeys(model) {

        return model.reduce((collector, child) => {

            collector[child.key] = child;
            return collector;
        }, {});
    }

    _getRef(refName) {

        return (ref) => {
            this[refName] = ref;
        }
    }

    getChildWrapperProps({ child, key }) {

        const { animConfigs } = this.state;

        return {
            animConfig: animConfigs[key]
        }
    }

    render() {

        const { model, animConfigs } = this.state;

        return (
            <TransitionMotion
                defaultStyles={this.getDefaultStyles()}
                styles={this.getStyles()}
                willEnter={this.willEnter}
                willLeave={this.willLeave}
            >
                {(interpolatedStyles) => {

                    console.log('multi interpolatedStyles', interpolatedStyles);
                    return this.getChildren(interpolatedStyles);
                }}
            </TransitionMotion>
        );
    }
};
