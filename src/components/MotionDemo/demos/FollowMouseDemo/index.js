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

    static propTypes = {
        animPlugins: T.array
    }

    static defaultProps = {
        animPlugins: []
    }

    constructor(props) {

        super();

        this.state = {
            ballAnim: BlueBallAnim
        };

        this.setRef = this._setRef.bind(this);
    }

    componentDidMount() {

        // Have the ball follow the mouse with anim

        this.mouseWatcher.addEventListener('mousemove', (ev) => {

            const bounds = this.mouseWatcher.getBoundingClientRect();

            this.setState({
                ballAnim: {
                    enter: {
                        left: {
                            val: ev.clientX - bounds.left
                        },
                        top: {
                            val: ev.clientY - bounds.top,
                            delay: 500
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

            this.setState({
                ballAnim: {
                    enter: {
                        left: {
                            val: Math.random() * bounds.width
                        },
                        top: {
                            val: Math.random() * bounds.height,
                            delay: 1000
                        }
                    }
                }
            });
        }, 1500);
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    render() {

        const { animPlugins } = this.props;
        const { ballAnim } = this.state;

        console.log(animPlugins);

        return (
            <Wrapper
                innerRef={this.setRef('mouseWatcher')}
            >
                <Motion
                    animConfig={ballAnim}
                    animPlugins={animPlugins}
                >
                    <BlueBall />
                </Motion>
            </Wrapper>
        );
    }
};