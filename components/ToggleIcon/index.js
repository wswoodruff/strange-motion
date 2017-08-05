const React = require('react');
const T = require('prop-types');
const { default: IconButton } = require('material-ui/IconButton');
const ToggleMotion = require('../../toggle');

// Styles

const lStyles = require('./styles');

const { ToggleIcon } = lStyles;


// Anims

const lAnims = require('./anims');

const { ToggleAnim } = lAnims;

// Component

module.exports = class ToggleIconClass extends React.PureComponent {

    static propTypes = {
        onIcon: T.string.isRequired,
        offIcon: T.string.isRequired,
        trigger: T.bool.isRequired,
        className: T.string,
        onIconClass: T.string,
        offIconClass: T.string,
        iconClass: T.string,
        onClick: T.func
    }

    static defaultProps = {
        trigger: false,
        className: ''
    }

    constructor(props) {

        super();

        this.state = {
            trigger: props.trigger === true ? true : false
        };
    }

    componentWillReceiveProps(nextProps) {

        if (typeof nextProps.trigger !== 'undefined') {
            this.setState({ trigger: nextProps.trigger });
        }
    }

    render() {

        const { trigger } = this.state;

        const {
            onIcon,
            offIcon,
            onIconClass,
            offIconClass,
            iconClass,
            className,
            onClick } = this.props;

        return (
            <IconButton
                onClick={onClick}
                className={className}
            >
                <ToggleMotion
                    trigger={trigger}
                    animConfig={ToggleAnim}
                >
                    <ToggleIcon
                        key='on'
                        className={`${iconClass} ${onIconClass}`}
                        name={onIcon}
                    />
                    <ToggleIcon
                        key='off'
                        className={`${iconClass} ${offIconClass}`}
                        name={offIcon}
                    />
                </ToggleMotion>
            </IconButton>
        );
    }
};
