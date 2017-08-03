const React = require('react');

// Styles

const lStyles = require('./styles');

const {
    Bg } = lStyles;

// Component

module.exports = class CoreLayout extends React.PureComponent {

    constructor() {

        super();

        this.state = {};
    }

    render() {

        const { children } = this.props;

        return (
            <Bg>
                {[].concat(children).map((child) => {

                    return child;
                })}
            </Bg>
        );
    }
};
