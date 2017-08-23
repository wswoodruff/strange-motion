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
                const delay = anim.delay;
                delete anim.delay;
                collector.delayedInfo.push({
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
        delayedInfo.forEach((delayInfo) => {

            const { delayAnimConfig, delayChild, delay } = delayInfo;

            console.log(delayAnimConfig);

            setTimeout(() => {

                const currentAnimConfigs = this.state.animConfigs;
                const currentModel = this.state.model;
                delete delayAnimConfig.delay;

                console.log('currentModel', currentModel)

                console.log([...currentModel, delayChild]);
                console.warn('[...currentModel, delayElem]', [...currentModel, delayChild]);

                this.setState({
                    model: [...currentModel, delayChild],
                    animConfigs: {
                        ...currentAnimConfigs,
                        [delayAnimConfig.key]: delayAnimConfig.val
                    }
                })
            }, delay);
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
