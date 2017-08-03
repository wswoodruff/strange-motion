const React = require('react');
const T = require('prop-types');
const { default: IconButton } = require('material-ui/IconButton');
const ToggleMotion = require('../../../toggle');

// Styles

const lStyles = require('./styles');

const { ToggleIcon } = lStyles;

// Component

module.exports = class IconToggle extends React.PureComponent {

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

    _getAnimConfig() {

        return {
            enterAnim: {
                opacity: {
                    val: 1,
                    stiffness: 210,
                    damping: 25
                },
                fontSize: {
                    val: 100,
                    stiffness: 210,
                    damping: 25
                }
            },
            leaveAnim: {
                opacity: 0,
                fontSize: 60
            }
        };
    }

    constructor(props) {

        super();

        this.animConfig = this._getAnimConfig();

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
                    animConfig={this.animConfig}
                >
                    <ToggleIcon
                        key='on'
                        className={`${iconClass} ${onIconClass}`}
                    >
                        {onIcon}
                    </ToggleIcon>
                    <ToggleIcon
                        key='off'
                        className={`${iconClass} ${offIconClass}`}
                    >
                        {offIcon}
                    </ToggleIcon>

                </ToggleMotion>
            </IconButton>
        );
    }
};
