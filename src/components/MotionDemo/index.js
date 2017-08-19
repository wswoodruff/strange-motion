const React = require('react');
const T = require('prop-types');
const DemoView = require('components/DemoView');
const FollowMouseDemo = require('./demos/FollowMouseDemo');

// Component

// TODO Add a mount demo

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
