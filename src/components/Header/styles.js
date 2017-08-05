const { styledImportant: styled } = require('styles');
const { default: AppBar } = require('material-ui/AppBar');
const { default: Toolbar } = require('material-ui/Toolbar');
const { default: Typography } = require('material-ui/Typography');
const { default: MenuIcon } = require('material-ui-icons/Menu');

module.exports = {
    AppBar: styled(AppBar)`
        background-color: green;
    `,
    Toolbar: styled(Toolbar)`
        min-height: 56px;
    `,
    Typography: styled(Typography)`
        margin-left: 10px;
    `,
    MenuIcon: styled(MenuIcon)`
        color: white;
    `
};
