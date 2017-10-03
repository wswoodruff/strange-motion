const React = require('react');
const DemoView = require('components/DemoView');
const FollowMouseDemo = require('./demos/FollowMouseDemo');
const colorAnimPlugin = require('plugins/colorAnimPlugin');

// Component

module.exports = class MotionDemo extends React.PureComponent {

    constructor(props) {

        super();

        this.animPlugins = [colorAnimPlugin];
    }

    render() {

        const { animPlugins } = this;

        return (
            <DemoView title='Motion'>
                <FollowMouseDemo
                    animPlugins={animPlugins}/>
            </DemoView>
        );
    }
};
