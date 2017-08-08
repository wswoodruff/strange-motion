const React = require('react');
const T = require('prop-types');
const Motion = require('../../../../../motion');
const DemoView = require('components/DemoView');

// Styles

const lStyles = require('./styles');

const {
    BlueBall,
    Wrapper } = lStyles;

// Anims

const lAnims = require('./anims');

const { BlueBallAnim } = lAnims;

// Component

module.exports = class FollowMouseDemo extends React.PureComponent {

    constructor(props) {

        super();

        this.state = {
            animConfig: BlueBallAnim
        };

        this.setRef = this._setRef.bind(this);
    }

    componentDidMount() {

        // Have the ball follow the mouse with anim

        this.mouseWatcher.addEventListener('mousemove', (ev) => {

            const bounds = this.mouseWatcher.getBoundingClientRect();

            this.setState({
                animConfig: {
                    enterAnim: {
                        left: ev.clientX - bounds.left,
                        top: ev.clientY - bounds.top
                    }
                }
            });
        });

        this.mouseWatcher.addEventListener('mouseover', (ev) => {

            this.mouseOver = true;
        });

        this.mouseWatcher.addEventListener('mouseout', (ev) => {

            this.mouseOver = false;
        });


        // Have ball animate to random spots until the mouse takes over

        setInterval(() => {

            if (this.mouseOver) {
                return;
            }

            const bounds = this.mouseWatcher.getBoundingClientRect();

            this.setState({
                animConfig: {
                    enterAnim: {
                        left: Math.random() * bounds.width,
                        top: Math.random() * bounds.height
                    }
                }
            });
        }, 2000);
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    render() {

        const { animConfig } = this.state;

        return (
            <Wrapper
                innerRef={this.setRef('mouseWatcher')}
            >
                <Motion
                    animConfig={animConfig}
                >
                    <BlueBall />
                </Motion>
            </Wrapper>
        );
    }
};