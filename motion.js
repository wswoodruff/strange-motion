const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { Motion: ReactMotion } = require('react-motion');
const { assignAnimConfig } = require('./utils');

// Component

module.exports = class Motion extends StrangeMotion {

    static propTypes = {
        springEasing: T.object,
        noWrapper: T.bool,
        animConfig: T.shape({
            startStyle: T.object,
            enterAnim: T.object
        })
    }

    constructor(props) {

        super(props);

        // We don't want springEasing in state because updating it
        // in componentWillReceiveProps will cause a rerender
        // which we don't want

        this.springEasing = props.springEasing || this.defaultSpring;
    }

    static defaultProps = {
        animOnMount: false
    }

    componentWillReceiveProps(nextProps) {

        const { springEasing, animConfig } = nextProps;

        if (springEasing) {
            this.springEasing = springEasing;
        }

        const self = this;
        if (animConfig) {
            this.setState({
                animConfig: assignAnimConfig(
                    self.state.animConfig,
                    animConfig
                )
            });
        }
    }

    render() {

        const { children } = this.props;

        return (
            <ReactMotion
                // Only built for a single child
                defaultStyle={this.getDefaultStyles()[0].style}
                style={this.getStyles()[0].style}
            >
                {(interpolatedStyles) => {

                    return this.applyInterpolatedStyles({
                        style: interpolatedStyles,
                        child: children
                    });
                }}
            </ReactMotion>
        );
    }
};
