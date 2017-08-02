const React = require('react');
const { default: Drawer } = require('material-ui/Drawer');
const { ListItem, ListItemIcon, ListItemText } = require('material-ui/List');
const T = require('prop-types');
const { default: StarIcon } = require('material-ui-icons/Star');
const { default: Divider } = require('material-ui/Divider');

// Styles

const lStyles = require('./styles');

const {
    List,
    Title,
    TitleListItem } = lStyles;

// Component

module.exports = class DrawerComponent extends React.PureComponent {

    static propTypes = {
        open: T.bool.isRequired,
        onRequestClose: T.func.isRequired
    }

    render() {

        const { open, onRequestClose } = this.props;

        return (
            <Drawer
                open={open}
                onRequestClose={onRequestClose}
                onClick={onRequestClose}
            >
                <List>
                    <TitleListItem>
                        <Title
                            type='title'
                            color='inherit'
                        >
                            strange-motion
                        </Title>
                    </TitleListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText primary='Bork! =P' />
                    </ListItem>
                </List>
            </Drawer>
        );
    }
};
