const { default: styled } = require('styled-components');
const { important } = require('utils/styles');

const styledWrap = (component) => {

    return (tag) => {

        return styled(component)(important(tag));
    };
};


exports.styledWrap = styledWrap;
