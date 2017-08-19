const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { StaggeredMotion } = require('react-motion');
const Motion = require('./motion');

// Component

module.exports = class MultiMotion extends React.PureComponent {

    static propTypes = {
        animConfigs: T.object.isRequired,
        children: T.any.isRequired
    }

    constructor(props) {

        // TODO Check to make sure each keyed child has an animConfig

        // TODO left off testing this stuff out

        const delays = props.animConfigs.filter((animConfig) => !!animConfig.delay);
        const currentAnims = props.animConfigs.filter((animConfig) => !animConfig.delay);
        const animConfigsWithoutDelay = props.animConfigs.map((animConfig) => {

            delete animConfig.delay;
            return animConfig;
        }

        this.state = {
            children: currentAnims,
            animConfigs: animConfigsWithoutDelay
        }

        delays.forEach((delayedAnimConfig) => {

            setTimeout(() => {

                const currentAnimConfigs = this.state.children;

                this.setState({
                    children: [...currentAnimConfigs, delayedAnimConfig]
                })
            }, delayedAnimConfig.delay);
        });

        this.getRef = this._getRef.bind(this);
        this.getDefaultStyles = this._getDefaultStyles.bind(this);
        this.getStyles = this._getStyles.bind(this);
    }

    _getRef(refName) {

        return (ref) => {
            this[refName] = ref;
        }
    }

    _getDefaultStyles() {

        const { animConfigs } = this.props;
        const { children } = this.state;

        return () => {

            return children.map((child) => {

                return animConfigs[child.key] || {};
            });
        };
    }

    _getStyles() {

        const { animConfigs } = this.props;
        const { children } = this.state;

        return (prevStyles) => {

            return children.map((child) => {

                return animConfigs[child.key] || {};
            });
        }
    }

    render() {

        const { animConfigs } = this.props;
        const { children } = this.state;

        return (
            <StaggeredMotion
                defaultStyles={this.getDefaultStyles()}
                styles={this.getStyles()}
            >
                {children.map((child) => (
                    return <Motion
                        animConfig={animConfigs[child.key]}
                    >
                        {child}
                    </Motion>
                ))}
            </StaggeredMotion>
        );
    }
};
