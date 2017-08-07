const React = require('react');
const T = require('prop-types');
const DemoView = require('components/DemoView');
const ToggleIconDemo = require('./demos/ToggleIconDemo');

// Component

module.exports = class MotionToggleDemo extends React.PureComponent {

    constructor(props) {

        super();
    }

    render() {

        return (
            <DemoView title='Motion Toggle'>
                <ToggleIconDemo />
            </DemoView>
        );
    }
};
