const React = require('react');
const T = require('prop-types');
const DemoView = require('components/DemoView');
const PageLayoutDemo = require('./demos/PageLayoutDemo');

// Component

module.exports = class MultiMotionDemo extends React.PureComponent {

    constructor(props) {

        super();
    }

    render() {

        return (
            <DemoView title='Layout Demo'>
                <PageLayoutDemo />
            </DemoView>
        );
    }
};
