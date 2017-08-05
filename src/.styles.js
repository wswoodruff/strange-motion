const { styledImportant: styled } = require('styles');
const { default: List } = require('material-ui/List');

module.exports = {
    List: styled(List)`
        min-width: 250px;
    `
};
