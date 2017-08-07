const React = require('react');
const T = require('prop-types');
const DemoView = require('components/DemoView');
const AnimatedListDemo = require('./demos/AnimatedListDemo');

// Component

module.exports = class ToggleMotionDemo extends React.PureComponent {

    constructor(props) {

        super();
    }

    render() {

        return (
            <DemoView title='Motion List'>
                <AnimatedListDemo />
            </DemoView>
        );
    }
};
