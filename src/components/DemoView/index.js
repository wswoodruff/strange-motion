const React = require('react');
const T = require('prop-types');

// Styles

const lStyles = require('./styles');

const {
    Bg } = lStyles;

// Component

module.exports = class CoreLayout extends React.PureComponent {

    static propTypes = {
        children: T.any
    }

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
