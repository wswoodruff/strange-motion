const React = require('react');
const T = require('prop-types');
const { CardActions } = require('material-ui/Card');

// Styles

const lStyles = require('./styles');

const {
    Bg,
    Title,
    StyledCard,
    StyledCardContent,
    DemoContent } = lStyles;

// Component

module.exports = class CoreLayout extends React.PureComponent {

    static propTypes = {
        children: T.any,
        title: T.string
    }

    constructor() {

        super();

        this.state = {};
    }

    render() {

        const { children, title } = this.props;

        return (
            <Bg>
                <StyledCard>
                    <StyledCardContent>
                        <Title type='headline' component='h2'>
                            {title}
                        </Title>
                        <DemoContent>
                            {[].concat(children).map((child) => {

                                return child;
                            })}
                        </DemoContent>
                    </StyledCardContent>
                </StyledCard>
            </Bg>
        );
    }
};
