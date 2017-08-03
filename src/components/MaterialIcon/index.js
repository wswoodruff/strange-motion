const React = require('react');
const T = require('prop-types');

// Styles

const lStyles = require('./styles');
const { Icon } = lStyles;

// Component

exports.default = class MaterialIcon extends React.PureComponent {

    static propTypes = {
        name: T.string.isRequired,
        className: T.any
    }

    render() {

        const { name, ...rest } = this.props;

        return (
            <Icon {...rest}>
                {name}
            </Icon>
        );
    }
}
