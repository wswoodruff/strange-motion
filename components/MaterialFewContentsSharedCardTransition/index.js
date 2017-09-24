const React = require('react');
const T = require('prop-types');
const MultiMotion = require('../../multi');
const Motion = require('../../motion');
const DemoView = require('components/DemoView');
const _merge = require('lodash/merge');

const { default: styled } = require('styled-components');
const { default: Card, CardActions, CardContent, CardMedia } = require('material-ui/Card');
const { default: Paper } = require('material-ui/Paper');
const { default: Button } = require('material-ui/Button');
const { default: Typography } = require('material-ui/Typography');

// Styles

const lStyles = require('./styles');

const {
    Viewport,
    Placeholder } = lStyles;

let { Card: StyledCard } = lStyles;

// Anims

const lAnims = require('./anims');

const {
    ViewportAnim,
    CardAnim } = lAnims;

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

    _placeholderClick(e) {

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

                // console.warn(this.Placeholder.offsetTop);
                // console.log(this.Placeholder.offsetParent);
                // console.log(this.animControllers);
                // console.log(Card);

                const top = this.Placeholder.offsetTop;
                const left = this.Placeholder.offsetLeft;
                const width = this.Placeholder.offsetWidth;
                const height = this.Placeholder.offsetHeight;

                this.Placeholder.style.height = `${height}px`;

                // this.Card.style.left = `${left}px`;
                // this.Card.style.top = `${top}px`;
                this.Card.style.width = `${width}px`;
                this.Card.style.height = `${height}px`;

                this.Card.style.position = 'absolute';

                this.animControllers.Card.mergeAnimConfig({
                    start: {
                        left,
                        top
                    },
                    enter: {
                        left: 0,
                        top: {
                            $delay: 150,
                            val: 60 // appbar height
                        }
                    }
                });

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

        return (
            <Placeholder
                onClick={this.placeholderClick}
                innerRef={this.setRef('Placeholder')}
            >
                <Motion
                    animConfig={ViewportAnim}
                    getAnimController={this.setAnimController('Viewport')}
                >
                    <Viewport
                        innerRef={this.setRef('Viewport')}>
                        <Motion
                            animConfig={CardAnim}
                            getAnimController={this.setAnimController('Card')}
                        >
                            <div ref={this.setRef('Card')}>
                                <StyledCard>
                                    <CardContent>
                                        {sharedContents}
                                    </CardContent>
                                </StyledCard>
                            </div>
                        </Motion>
                    </Viewport>
                </Motion>
            </Placeholder>
        );
    }
};
