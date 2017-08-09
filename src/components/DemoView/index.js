const React = require('react');
const T = require('prop-types');
const { CardActions } = require('material-ui/Card');
const { default: Button } = require('material-ui/Button');

// Styles

const lStyles = require('./styles');

const {
    Bg,
    Title,
    StyledCard,
    StyledCardContent,
    DemoContent,
    StyledActionsInnerContainer } = lStyles;

// Component

module.exports = class CoreLayout extends React.PureComponent {

    static propTypes = {
        children: T.any,
        title: T.string,
        cardActions: T.any,
        CardActionsInnerContainer: T.any
    }

    constructor() {

        super();

        this.state = {};
    }

    render() {

        const {
            children,
            title,
            cardActions,
            CardActionsInnerContainer } = this.props;

            const ActionsInnerContainer = CardActionsInnerContainer ||
                StyledActionsInnerContainer;

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
                    <CardActions>
                        {cardActions ? (
                            <ActionsInnerContainer>
                                {cardActions}
                            </ActionsInnerContainer>
                        ) : (
                            <ActionsInnerContainer>
                                <Button dense color="primary">
                                    Share
                                </Button>
                                <Button dense color="primary">
                                    See Codepen
                                </Button>
                            </ActionsInnerContainer>
                        )}
                    </CardActions>
                </StyledCard>
            </Bg>
        );
    }
};
