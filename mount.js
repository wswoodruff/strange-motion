const React = require('react');
const StrangeMotion = require('./index');
const { TransitionMotion } = require('react-motion');

// Component

module.exports = class MountMotion extends StrangeMotion {

    constructor(props) {

        super(props);
        this.setRef = this._setRef.bind(this);
    }

    _setRef(refName) {

        return (ref) => {
            this[refName] = ref;
        }
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
