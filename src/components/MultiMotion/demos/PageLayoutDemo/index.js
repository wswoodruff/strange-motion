const React = require('react');
const T = require('prop-types');
const MultiMotion = require('../../../../../multi');
const DemoView = require('components/DemoView');

// Styles

const lStyles = require('./styles');

const {
    Wrapper,
    Header,
    Footer,
    Sidebar } = lStyles;

// Anims

const lAnims = require('./anims');

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

        return (
            <Wrapper>
                <MultiMotion
                    animConfigs={lAnims}
                >
                    <Header key='Header' />
                    <Footer key='Footer' />
                    <Sidebar key='Sidebar' />
                </MultiMotion>
            </Wrapper>
        );
    }
};
