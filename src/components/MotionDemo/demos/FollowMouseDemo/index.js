
const React = require('react');
const T = require('prop-types');
const Motion = require('../../../../../motion');
const MaterialColors = require('material-ui/colors');
const Throttle = require('lodash/throttle');

const Material500s = Object.keys(MaterialColors)
    .filter((colorName) => colorName !== 'common')
    .map((colorName) => {

        return MaterialColors[colorName][500];
    });

const internals = {};

internals.randomMaterialColor = () => {

    return Material500s[Math.floor(Math.random() * Material500s.length)];
};

internals.debouncedRandomMaterialColor = Throttle(internals.randomMaterialColor, 600);

// Styles

const lStyles = require('./styles');

const {
    MaterialColorBall,
    Wrapper } = lStyles;

// Anims

const lAnims = require('./anims');

const { MaterialColorBallAnim } = lAnims;

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
            ballAnim: MaterialColorBallAnim
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
                            $delay: 500
                        },
                        backgroundColor: {
                            val: internals.debouncedRandomMaterialColor()
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

            if (!this.mouseWatcher) {
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
                            $delay: 800
                        },
                        backgroundColor: {
                            val: internals.randomMaterialColor()
                        }
                    }
                }
            });
        }, 1500);
    };

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        };
    }

    render() {

        const { animPlugins } = this.props;
        const { ballAnim } = this.state;

        return (
            <Wrapper
                innerRef={this.setRef('mouseWatcher')}
            >
                <Motion
                    animConfig={ballAnim}
                    animPlugins={animPlugins}
                >
                    <MaterialColorBall />
                </Motion>
            </Wrapper>
        );
    }
};
