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

        if (!animConfig.leave) {
            throw new Error('Must provide "leave" to animConfig for toggle type');
        }

        return super.processAnimConfig(animConfig);
    }

    filterChildrenForType(children) {

        const { trigger } = this.props;

        if (trigger === true) {
            return children.filter((child) => {

                return child.key === 'on';
            });
        }
        else if (trigger === false) {
            return children.filter((child) => {

                return child.key === 'off';
            });
        }

        throw new Error('ToggleMotion: Bad value for trigger: ' + trigger);
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
