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
        trigger: T.func
        // animOnMount: T.bool
    }

    constructor(props) {

        super(props);

        const self = this;

        if (props.trigger) {
            props.trigger = (newEntryAnim) => {

                this.setState({
                    animConfig: assignAnimConfig(
                        self.state.animConfig,
                        newEntryAnim
                    )
                });
            };
        }

        // We don't want springEasing in state because updating it
        // in componentWillReceiveProps will cause a rerender
        // which we don't want

        this.springEasing = props.springEasing || internals.defaultSpring;
    }

    static defaultProps = {
        animOnMount: false
    }

    componentWillReceiveProps(nextProps) {

        const springEasing = nextProps.springEasing;

        if (springEasing) {
            this.springEasing = springEasing;
        }
    }

    render() {

        return (
            <ReactMotion
                style={this.getStyles()}
            >
                {(interpolatedStyles) =>

                    this.getChildren(interpolatedStyles)
                }
            </ReactMotion>
        );
    }
};
