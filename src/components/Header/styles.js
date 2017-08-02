const { styledWrap: styled } = require('styles');
const { default: AppBar } = require('material-ui/AppBar');
const { default: Typography } = require('material-ui/Typography');
const { default: MenuIcon } = require('material-ui-icons/Menu');

module.exports = {
    AppBar: styled(AppBar)`
        background-color: green;
    `,
    Typography: styled(Typography)`
        margin-left: 10px;
    `,
    MenuIcon: styled(MenuIcon)`
        color: white;
    `
};
