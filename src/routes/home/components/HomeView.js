const React = require('react');

// Styles

const lStyles = require('./styles');

const {
    MainContainer,
    AlarmButton } = lStyles;

// Component

module.exports = class HomePage extends React.PureComponent {

    constructor() {

        super();

        this.state = {
            alarmOn: false
        };

        this.onAlarmClick = this._onAlarmClick.bind(this);
    }

    _onAlarmClick() {

        this.setState({ alarmOn: !this.state.alarmOn });
    }

    render() {

        const { alarmOn } = this.state;

        return <MainContainer>

            <AlarmButton
                trigger={alarmOn}
                onIcon='alarm_on'
                offIcon='alarm_off'
                onClick={this.onAlarmClick}
                iconClass='alarm-icon'
                onIconClass='alarm-icon-on'
                offIconClass='alarm-icon-off'
            />
        </MainContainer>;
    }
};
