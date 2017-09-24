const React = require('react');
const DemoView = require('components/DemoView');
const FollowMouseDemo = require('./demos/FollowMouseDemo');

// Component

module.exports = class MotionDemo extends React.PureComponent {

    constructor(props) {

        super();
    }

    render() {

        return (
            <DemoView title='Motion'>
                <FollowMouseDemo />
            </DemoView>
        );
    }
};
