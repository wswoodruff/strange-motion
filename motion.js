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
        this.playProp = 'enter';
    }

    _setAnimController(newAnimConfig) {

        const { animConfig } = this.state;

        const mergedAnimConfig = Object.assign({},
            animConfig,
            newAnimConfig
        );

        const animControllerApi = {
            enter: (animNameOrConfig) => {

                if (typeof animNameOrConfig === 'string') {
                    this.playProp = animNameOrConfig;
                    this.forceUpdate();
                }

                if (typeof animNameOrConfig === 'object') {

                    this.playProp = 'enter';

                    this.assignAnimConfig({ newAnimConfig: {
                        enter: animNameOrConfig
                    }});
                }
            },
            mergeAnimConfig: (animConfig) => {

                this.assignAnimConfig({
                    newAnimConfig: animConfig
                })
            },
            replay: () => {

                console.warn('replay not implemented yet, sorry!');
            }
        };

        // Set some aliases for code readability's sake

        animControllerApi.play = animControllerApi.enter;

        this.animController = Object.keys(mergedAnimConfig)
        .reduce((collector, animName) => {

            collector[animName] = (plugins) => {

                animControllerApi.play(animName);
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

        // ReactMotion is only built for a single child, so that's what
        // the '[0]' in 'this.getDefaultStyles()[0]' is about

         // 'ref={this.setRef('reactMotion')}' sets the this.reactMotion ref
         // used in strange-motion/index.js

         const newPlayProp = this.playProp || 'enter';

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
