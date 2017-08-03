const React = require('react');
const { default: IconButton } = require('material-ui/IconButton');
const Drawer = require('components/Drawer');
// Styles

const lStyles = require('./styles');

const {
    AppBar,
    Typography,
    MenuIcon,
    Toolbar } = lStyles;

// Component

module.exports = class Header extends React.PureComponent {

    constructor() {

        super();

        this.state = {
            drawerOpen: false
        };

        this.toggleDrawer = this._toggleDrawer.bind(this);
        this.onRequestClose = this._onRequestClose.bind(this);
    }

    _toggleDrawer() {

        this.setState({ drawerOpen: !this.state.drawerOpen });
    }

    _onRequestClose() {

        this.setState({ drawerOpen: false });
    }

    render() {

        const { drawerOpen } = this.state;

        return (
            <AppBar>
                <Toolbar>
                    <IconButton onClick={this.toggleDrawer}>
                        <MenuIcon
                            color='primary'
                        />
                    </IconButton>
                    <Typography
                        type='title'
                        color='inherit'
                    >
                        strange-motion
                    </Typography>
                </Toolbar>
                <Drawer
                    open={drawerOpen}
                    onRequestClose={this.onRequestClose}
                />
            </AppBar>
        );
    }
};
