const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { TransitionMotion, spring } = require('react-motion');
const AccordianListItem = require('./components/AccordianListItem');

// Component

module.exports = class MotionList extends StrangeMotion {

    static propTypes = {};

    constructor(props) {

        super(props);

        this.state.heightObject = {};
        this.setElementHeight = this._setElementHeight.bind(this);
        this.setRef = this._setRef.bind(this);
    }

    _setElementHeight(key, height) {

        const heightByKey = {};
        heightByKey[key] = height;

        const newHeightObject = Object.assign(this.state.heightObject, heightByKey);

        this.setState({
            heightObject: newHeightObject
        });
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

                    return <div>
                        {interpolatedStyles.map(({ style, data, key }) => {

                            return (
                                <AccordianListItem
                                    key={key}
                                    motionKey={key}
                                    motionStyles={style}
                                    heightObject={this.state.heightObject}
                                    setElementHeight={this.setElementHeight}
                                >
                                    {this.applyInterpolatedStyles({
                                        style,
                                        child: data,
                                        key
                                    })}
                                </AccordianListItem>
                            );
                        })}
                    </div>
                }}
            </TransitionMotion>
        );
    }
};
