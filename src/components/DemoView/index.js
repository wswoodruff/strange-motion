const React = require('react');
const T = require('prop-types');
const { default: Card, CardActions, CardContent } = require('material-ui/Card');

// Styles

const lStyles = require('./styles');

const {
    Bg,
    Title } = lStyles;

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
                <Card>
                    <CardContent>
                        <Title type='headline' component='h2'>
                            {title}
                        </Title>
                        {[].concat(children).map((child) => {

                            return child;
                        })}
                    </CardContent>
                </Card>
            </Bg>
        );
    }
};
