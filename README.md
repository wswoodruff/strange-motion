# strange-motion
#### Configurable and controllable `react-motion` animations
[![NSP Status](https://nodesecurity.io/orgs/wswoodruff/projects/a12ea501-4b8c-4868-bf4b-e8603004f971/badge)](https://nodesecurity.io/orgs/wswoodruff/projects/a12ea501-4b8c-4868-bf4b-e8603004f971)

### What it does
strange-motion manages react-motion elements internally and manages an `animConfig` for you to easily specify css prop animations used with `react-motion`. You're also able to request an `animController` object from strange-motion components (similar to how you get a `ref={}`) to make animations happen on command :rocket:

### Example
```js
// A minimal React component that animates a ball to random x & y coordinates

const React = require('react');
const Motion = require('strange-motion/motion');

// Anims

const ballAnim = {
    start: {
        left: 0,
        top: 0
    },
    enter: {
        left: {
            val: 200,
            preset: 'wobbly',
        },
        top: {
            val: 200,
            preset: 'wobbly'
        }
    }
};

// Component

module.exports = class MinimalDemo extends React.PureComponent {

    constructor(props) {

        super();

        this.setRef = this._setRef.bind(this);
    };

    componentDidMount() {

        // Have ball animate to random spots

        setInterval(() => {

            if (!this.ballAnimController ||
                !this.wrapper) {
                return;
            }

            const bounds = this.wrapper.getBoundingClientRect();

            this.ballAnimController.play({
                left: {
                    val: Math.random() * bounds.width
                },
                top: {
                    val: Math.random() * bounds.height,
                    $delay: 150
                }
            });
        }, 1100);
    };

    _setRef(refName) {

        return (ref) => {

            this[refName] = ref;
        };
    };

    render() {

        return (
            <div
                ref={this.setRef('wrapper')}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Motion
                    animConfig={ballAnim}
                    getAnimController={this.setRef('ballAnimController')}
                >
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '95px',
                        height: '95px',
                        borderRadius: '50%',
                        border: '2px solid #90CAF9',
                        backgroundColor: '#1E88E5',
                        transform: 'translate(-50%, -50%)'
                    }} />
                </Motion>
            </div>
        );
    };
};
```
