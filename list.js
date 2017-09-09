const React = require('react');
const T = require('prop-types');
const StrangeMotion = require('./index');
const { Motion: ReactMotion } = require('react-motion');
const { assignAnimConfig } = require('./utils');

// Component

module.exports = class Motion extends StrangeMotion {

    static propTypes = {
        getAnimController: T.func,
        animConfig: T.object,
        children: T.any.isRequired
    }

    constructor(props) {

        super(props);

        this.setRef = this._setRef.bind(this);
        this.setAnimController = this._setAnimController.bind(this);
    }

    componentWillMount() {

        this.setAnimController(this.props.animConfig);
        this.setState({
            playProp: 'enter'
        });
    }

    _setAnimController(newAnimConfig) {

        const { animConfig } = this.state;

        const mergedAnimConfig = Object.assign({},
            animConfig,
            newAnimConfig
        );

        const animControllerApi = {
            enter: (animName) => {

                this.setState({
                    playProp: animName
                });
            },
            enterFromStart: () => {

                console.warn('enterFromStart not implemented yet, sorry!');
            }
        };

        // Set some aliases for code readability's sake

        animControllerApi.play = animControllerApi.enter;

        this.animController = Object.keys(mergedAnimConfig)
        .reduce((collector, animName) => {

            collector[animName] = (plugins) => {

                this.setState({
                    playProp: animName
                });
            }
            return collector;
        }, animControllerApi);

        if (this.props.getAnimController) {
            return this.props.getAnimController(this.animController);
        }
    }

    _setRef(refName) {

        return (ref) => {
            this[refName] = ref;
        }
    }

    render() {

        const { children } = this.props;
        const { playProp } = this.state;

        // ReactMotion is only built for a single child, so that's what
        // the '[0]' in 'this.getDefaultStyles()[0]' is about

         // 'ref={this.setRef('reactMotion')}' sets the this.reactMotion ref
         // used in strange-motion/index.js

         const newPlayProp = playProp || 'enter';

        return (
            <ReactMotion
                defaultStyle={this.getDefaultStyles()[0].style}
                style={this.getStyles(newPlayProp)[0].style}
                ref={this.setRef('reactMotion')}
            >
                {(interpolatedStyles) => {

                    return this.getChildren(interpolatedStyles);
                }}
            </ReactMotion>
        );
    }
};
