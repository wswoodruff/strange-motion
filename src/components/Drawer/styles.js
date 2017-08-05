const { styledImportant: styled } = require('styles');
const { default: List, ListItem } = require('material-ui/List');
const { default: Typography } = require('material-ui/Typography');

module.exports = {
    List: styled(List)`
        padding-top: 0;
        min-width: 250px;
    `,
    Title: styled(Typography)`
        margin: 0;
    `,
    TitleListItem: styled(ListItem)`
        min-height: 64px;
    `
};
