const React = require('react');
const DemoView = require('components/DemoView');

// Styles

const lStyles = require('./styles');

const { ToggleIcon } = lStyles;

// Component

module.exports = class HomePage extends React.PureComponent {

    constructor() {

        super();

        this.state = {
            alarmOn: false
        };

        this.onToggleClick = this._onToggleClick.bind(this);
    };

    _onToggleClick() {

        this.setState({ toggleOn: !this.state.toggleOn });
    };

    render() {

        const { toggleOn } = this.state;

        return (
            <DemoView title='Toggle Icon'>
                <ToggleIcon
                    trigger={toggleOn}
                    onIcon='alarm_on'
                    offIcon='alarm_off'
                    onClick={this.onToggleClick}
                    iconClass='toggle-icon'
                    onIconClass='toggle-icon-on'
                    offIconClass='toggle-icon-off'
                />
            </DemoView>
        );
    };
};
