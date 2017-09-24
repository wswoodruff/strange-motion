const React = require('react');
const ToggleMotion = require('../../../../../toggle');
const T = require('prop-types');

// Styles

const lStyles = require('./styles');

const {
    ToggleIcon,
    IconButton } = lStyles;

// Anims

const lAnims = require('./anims');

const { ToggleAnim } = lAnims;

// Component

module.exports = class ToggleIconDemo extends React.PureComponent {

    static propTypes = {
        trigger: T.bool
    }

    static defaultProps = {
        trigger: false
    }

    constructor(props) {

        super();

        this.state = {
            trigger: props.trigger === true ? true : false
        };

        this.toggle = this._toggle.bind(this);
    }

    _toggle() {

        const { trigger } = this.state;
        this.setState({ trigger: !trigger });
    }

    componentWillReceiveProps(nextProps) {

        if (typeof nextProps.trigger !== 'undefined') {
            this.setState({ trigger: nextProps.trigger });
        }
    }

    render() {

        const { trigger } = this.state;

        return (
            <IconButton
                onClick={this.toggle}
            >
                <ToggleMotion
                    trigger={trigger}
                    animConfig={ToggleAnim}
                >
                    <ToggleIcon
                        key='on'
                        className='toggle-icon-on'
                        name='alarm_on'
                    />
                    <ToggleIcon
                        key='off'
                        name='alarm_off'
                    />
                </ToggleMotion>
            </IconButton>
        );
    }
};
