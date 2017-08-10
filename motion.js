const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { Motion: ReactMotion } = require('react-motion');
const { assignAnimConfig } = require('./utils');

// Component

module.exports = class Motion extends StrangeMotion {

    static propTypes = {
        noWrapper: T.bool,
        animConfig: T.shape({
            startStyle: T.object,
            enterAnim: T.object
        })
    }

    constructor(props) {

        super(props);
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
