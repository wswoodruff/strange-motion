const React = require('react');

// Motion demos
const MotionDemo = require('components/MotionDemo');
const MotionToggleDemo = require('components/MotionToggleDemo');
const MotionListDemo = require('components/MotionListDemo');

// Component demos
const ToggleIconDemo = require('components/ToggleIconDemo');

// Styles

const lStyles = require('./styles');

const {
    HomeContainer,
    DemosContainer,
    SectionTitle } = lStyles;

// Component

module.exports = class HomePage extends React.PureComponent {

    constructor() {

        super();
    };

    render() {

        return (
            <HomeContainer> {/* MainContainer is in src/layouts/CoreLayout */}

                <SectionTitle type='headline' component='h1'>
                    Motions
                </SectionTitle>

                <DemosContainer>
                    <MotionDemo />
                    <MotionListDemo />
                    <MotionToggleDemo />
                </DemosContainer>

                <SectionTitle type='headline' component='h1'>
                    Components
                </SectionTitle>

                <DemosContainer>
                    <ToggleIconDemo />

                    {/*
                        Note to self:
                        use the shelf space on the left / right
                        of these demos to have the code icon, and
                        also a FAB that shoots out child FABS like you
                        see in Material design. These are different versions
                        or demos (with code) of what you can do with any
                        particular strange-motion component
                    */}

                    {/*
                        Make @media queries work in ascss, which
                        re-apply the animConfig when that media query matches!
                        This way you can animate responsive stuff with spring
                        anims, like shrinking the size of these cards at mobile
                        width and turning them more into app tiles like LawHub
                    */}

                    {/*
                        Or have a wrapper component use CSS width: 100%
                        on every render get the client width, and set the
                        width of an animated component to whatever that is

                        That way you can spring anim as the page resizes.
                    */}

                    {/*
                        Add motion blur setting
                    */}

                    {/*
                        Detect if multiple children were passed to a Motion element,
                        and wrap each child in an identical motion element. This way
                        it isn't a requirement for only one child to be passed in.
                        The exact same animation will apply to all the children
                    */}
                </DemosContainer>
            </HomeContainer>
        );
    };
};
