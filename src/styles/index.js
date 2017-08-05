const { default: styled } = require('styled-components');
const { important } = require('utils/styles');

const styledImportant = (component) => {

    return (tag) => {

        return styled(component)(important(tag));
    };
};

exports.styledImportant = styledImportant;
