const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { TransitionMotion } = require('react-motion');

// Component

module.exports = class ToggleMotion extends StrangeMotion {

    static propTypes = {
        noWrapper: T.bool,
        trigger: T.bool
    }

    constructor(props) {

        super(props);
    }

    processAnimConfig(animConfig) {

        if (!animConfig.leaveAnim) {
            throw new Error('Must provide leaveAnim to animConfig for mount type');
        }

        return super.processAnimConfig(animConfig);
    }

    render() {

        return (
            <TransitionMotion
                defaultStyles={this.getDefaultStyles()}
                styles={this.getStyles()}
                willEnter={this.willEnter}
                willLeave={this.willLeave}
            >
                {(interpolatedStyles) =>

                    this.getChildren(interpolatedStyles)
                }
            </TransitionMotion>
        );
    }
};
