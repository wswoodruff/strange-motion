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
                        left: {
                            val: ev.clientX - bounds.left
                        },
                        top: {
                            val: ev.clientY - bounds.top
                        }
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

            // TODO PROBLEM: I think React is batching these delayed things
            // since it's using the setState api.. But we wait til after the setState
            // callback so this is weird

            this.setState({
                animConfig: {
                    enter: {
                        left: {
                            val: Math.random() * bounds.width,
                            delay: 300
                        },
                        top: {
                            val: Math.random() * bounds.height,
                            // delay: 2000
                        }
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
