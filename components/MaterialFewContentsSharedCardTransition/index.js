const React = require('react');
const T = require('prop-types');
const MultiMotion = require('../../multi');
const Motion = require('../../motion');
const DemoView = require('components/DemoView');
const _merge = require('lodash/merge');
const Utils = require('./utils');

const { default: Card, CardActions, CardContent, CardMedia } = require('material-ui/Card');
const { default: Paper } = require('material-ui/Paper');
const { default: Button } = require('material-ui/Button');
const { default: Typography } = require('material-ui/Typography');

// Styles

const lStyles = require('./styles');

const {
    Viewport,
    Placeholder } = lStyles;

// Component

module.exports = class PageLayoutDemo extends React.PureComponent {

    static propTypes = {
        sharedContents: T.any,
        onTransitionStateChange: T.func,
        bindSetTransitionContainer: T.func,
        details: T.any,
        media: T.any
    }

    constructor(props) {

        super();

        this.animControllers = {};

        this.state= {
            ViewportAnimConfig: null,
            CardContentAnimConfig: null,
            animState: 'start'
        };

        if (props.onTransitionStateChange) {
            props.onTransitionStateChange('start');
        }

        if (props.bindSetTransitionContainer) {
            props.bindSetTransitionContainer(this);
        }

        this.setRef = this._setRef.bind(this);
        this.setAnimController = this._setAnimController.bind(this);
        this.placeholderClick = this._placeholderClick.bind(this);
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    _placeholderClick() {
        this.gotoAnim('detail');
    }

    _setAnimController(animName) {

        return (animController) => {

            this.animControllers[animName] = animController;
        }
    }

    gotoAnim(animName) {

        const { onTransitionStateChange } = this.props;

        switch (animName) {

            case 'detail':
                console.warn(this.Placeholder.offsetTop);
                console.dir(this.Placeholder);
                // console.warn(this.transitionContainer);
                // console.log(Utils.getRelativePosition(this.Placeholder, this.transitionContainer));
                // get boundingClientRect of transitionContainer
                // console.warn(this.transitionContainer);
                // console.warn(this.transitionContainer && this.transitionContainer.getBoundingClientRect());
                break;
            case 'init':

                break;
        }

        if (onTransitionStateChange) {
            onTransitionStateChange(animName);
        }
    }

    render() {

        const { sharedContents } = this.props;
        const {
            ViewportAnimConfig,
            CardContentAnimConfig } = this.state;

        return (
            <Placeholder
                onClick={this.placeholderClick}
                innerRef={this.setRef('Placeholder')}
                >
                <Motion
                    animConfig={ViewportAnimConfig}
                    getAnimController={this.setAnimController('Viewport')}
                >
                    <Viewport
                        innerRef={this.setRef('Viewport')}>
                        <Motion
                            animConfig={CardContentAnimConfig}
                            getAnimController={this.setAnimController('Card')}
                        >
                            <Card
                                innerRef={this.setRef('Card')}>
                                <CardContent>
                                    {sharedContents}
                                </CardContent>
                            </Card>
                        </Motion>
                    </Viewport>
                </Motion>
            </Placeholder>
        );
    }
};
