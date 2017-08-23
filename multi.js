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
            delayedInfo,
            immediateAnimConfigs,
            immediateChildren
        } = Object.keys(props.animConfigs)
        .reduce((collector, animKey) => {

            const anim = props.animConfigs[animKey];
            const child = childrenByKeys[animKey];

            if (!!anim.delay) {
                delete anim.delay;
                collector.delayedInfo.push({
                    delayAnimConfig: { key: animKey, val: anim },
                    delayChild: child
                });
            }
            else {
                collector.immediateAnimConfigs[animKey] = anim;
                collector.immediateChildren.push(child);
            }

            return collector;
        }, {
            delayedInfo: [],
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

        // could be either animConfigs or
        delayedInfo.forEach((delayInfo, i) => {

            const { delayAnimConfig, delayChild } = delayInfo;

            // LEFT OFF HERE IMPLEMENTING THIS
            // const { delayAnimConfig, delayChild } = delayInfo;
            // I just put this here

            const delayedAnim = delayAnimConfig[delayedAnimKey];

            setTimeout(() => {

                const currentAnimConfigs = this.state.animConfigs;
                const currentModel = this.state.model;
                delete delayedAnim.delay;

                console.log('currentModel', currentModel)

                console.warn('delayedAnim', delayedAnim);

                const delayElem = currentModel.find((child) => {

                    console.log('child', child);
                    return child.key === delayedAnimKey;
                });

                console.log('delayedAnimKey', delayedAnimKey);

                console.log([...currentModel, delayElem]);
                console.warn('[...currentModel, delayElem]', [...currentModel, delayElem]);

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

                    return this.getChildren(interpolatedStyles);
                }}
            </TransitionMotion>
        );
    }
};
