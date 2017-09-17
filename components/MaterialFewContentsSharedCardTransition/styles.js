'use strict';

const { default: styled } = require('styled-components');
const { blue, grey } = require('material-ui/colors');

const { default: Paper } = require('material-ui/Paper');
const { default: Card } = require('material-ui/Card');

module.exports = {
    Card: styled(Card)``,
    Viewport: styled(Paper)`
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 1;
    `,
    Placeholder: styled.div`
        width: 100%;
        height: 100%;
    `
};
