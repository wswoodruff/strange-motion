const React = require('react');
const T = require('prop-types');
const MotionList = require('../../../../../motionList');
const DemoView = require('components/DemoView');

// Styles

const lStyles = require('./styles');

const {
    BlueBall,
    Wrapper } = lStyles;

// Anims

const lAnims = require('./anims');

const { SlideDownAnim } = lAnims;

// Component

module.exports = class AnimatedListDemo extends React.PureComponent {

    constructor(props) {

        super();

        this.state = {
            animConfig: SlideDownAnim,
            listItemData: [1, 2, 3, 4, 5]
        };

        this.setRef = this._setRef.bind(this);
    }

    componentDidMount() {

        // Have the ball follow the mouse with anim

        this.setState({
            listItemData: [1, 2, 3, 4, 5]
        })

        this.mouseWatcher.addEventListener('mousemove', (ev) => {

            // const bounds = this.mouseWatcher.getBoundingClientRect();
            //
            // this.setState({
            //     animConfig: {
            //         enterAnim: {
            //             left: ev.clientX - bounds.left,
            //             top: ev.clientY - bounds.top
            //         }
            //     }
            // });
        });

        this.mouseWatcher.addEventListener('mouseover', (ev) => {

            // this.mouseOver = true;
        });

        this.mouseWatcher.addEventListener('mouseout', (ev) => {

            // this.mouseOver = false;
        });


        // Have ball animate to random spots until the mouse takes over

        setInterval(() => {

            // if (this.mouseOver) {
            //     return;
            // }
            //
            // const bounds = this.mouseWatcher.getBoundingClientRect();
            //
            // this.setState({
            //     animConfig: {
            //         enterAnim: {
            //             left: Math.random() * bounds.width,
            //             top: Math.random() * bounds.height
            //         }
            //     }
            // });
        }, 2000);
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    render() {

        const {
            animConfig,
            listItemData } = this.state;

        return (
            <Wrapper
                innerRef={this.setRef('mouseWatcher')}
            >
                <MotionList
                    animConfig={animConfig}
                    collapse
                    model={listItemData}
                >
                    {(style, data, key) => {

                        return (
                            <div
                                style={style}
                            >
                                Hi loL
                            </div>
                        );
                    }}
                </MotionList>
            </Wrapper>
        );
    }
};
