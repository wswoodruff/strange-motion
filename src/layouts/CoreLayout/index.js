const React = require('react');
const Header = require('components/Header');
const { default: MuiThemeProvider } = require('material-ui/styles');

// Styles
require('styles/core.scss');
const lStyles = require('./styles');

const {
    RootContainer,
    MainContainer } = lStyles;

// Component

const CoreLayout = ({ children }) => (

    <RootContainer>
        <Header />
        <MainContainer>
            {children}
        </MainContainer>
    </RootContainer>

);

CoreLayout.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = CoreLayout;
