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

module.exports = class PageLayoutDemo extends React.PureComponent {

    constructor(props) {

        super();

        this.state = {};

        this.setRef = this._setRef.bind(this);
    }

    componentDidMount() {

    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        }
    }

    render() {

        const { ballAnim } = this.state;

        return (
            <Wrapper>
                <Motion
                    animConfig={ballAnim}
                >
                    <BlueBall />
                </Motion>
            </Wrapper>
        );
    }
};
