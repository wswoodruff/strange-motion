const React = require('react');
const MultiMotion = require('../../../../../multi');

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

        this.state = {
            mouseOver: false
        };

        this.setRef = this._setRef.bind(this);
        this.setAnimControllers = this._setAnimControllers.bind(this);
    }

    componentDidMount() {

        this.mouseWatcher.addEventListener('mouseover', (ev) => {

            Object.keys(this.animControllers)
            .forEach((animName) => {

                this.animControllers[animName].halfway();
            });
        });

        this.mouseWatcher.addEventListener('mouseout', (ev) => {

            Object.keys(this.animControllers)
            .forEach((animName) => {

                this.animControllers[animName].enter();
            });
        });
    }

    _setRef(refName) {

        const self = this;
        return (ref) => {

            self[refName] = ref;
        };
    }

    _setAnimControllers(animControllers) {

        this.animControllers = animControllers;
    }

    render() {

        const animConfigs = lAnims;

        return (
            <Wrapper
                innerRef={this.setRef('mouseWatcher')}
            >
                <MultiMotion
                    animConfigs={animConfigs}
                    getAnimControllers={this.setAnimControllers}
                >
                    <Header key='Header' />
                    <Footer key='Footer' />
                    <Sidebar key='Sidebar' />
                </MultiMotion>
            </Wrapper>
        );
    }
};
