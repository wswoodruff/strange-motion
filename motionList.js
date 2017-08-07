const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { TransitionMotion, spring } = require('react-motion');
const AccordianListItem = require('./components/AccordianListItem');

// Component

module.exports = class MotionList extends StrangeMotion {

    render() {

        const { children } = this.props;

        return (
            <TransitionMotion
                defaultStyles={this.getDefaultStyles()}
                styles={this.getStyles()}
                willEnter={this.willEnter}
                willLeave={this.willLeave}
            >
                {/* {(interpolatedStyles) => {

                    // console.log('interpolatedStyles', interpolatedStyles);

                    return <div>
                        {interpolatedStyles.map(({ data, key, style }) => {

                    return (
                    // <AccordianListItem
                    //     key={key}
                    //     motionKey={key}
                    //     motionStyles={style}
                    // >

                    <div key={key}>
                    {this.applyInterpolatedStyles(style, data, key)}
                    </div>
                    // </AccordianListItem>
                    );
                        })}
                    </div>
                }} */}
                {(interpolatedStyles) => {

                    return this.getChildren(interpolatedStyles);
                }}
            </TransitionMotion>
        );
    }
};
