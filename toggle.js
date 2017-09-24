const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { TransitionMotion } = require('react-motion');

// Component

module.exports = class ToggleMotion extends StrangeMotion {

    static propTypes = {
        trigger: T.bool,
        animConfig: T.shape({
            start: T.object,
            enter: T.object,
            leave: T.object.isRequired
        })
    }

    constructor(props) {

        super(props);
        this.setRef = this._setRef.bind(this);
    }

    _setRef(refName) {

        return (ref) => {
            this[refName] = ref;
        }
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
                ref={this.setRef('reactMotion')}
            >
                {(interpolatedStyles) => {

                    return this.getChildren(interpolatedStyles);
                }}
            </TransitionMotion>
        );
    }
};
