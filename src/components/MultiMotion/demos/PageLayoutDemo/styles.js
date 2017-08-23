const { default: styled } = require('styled-components');
const { blue, grey } = require('material-ui/colors');

module.exports = {
    Wrapper: styled.div`
        width: 100%;
        height: 100%;
        position: absolute;
        overflow: hidden;
    `,
    Header: styled.div`
        width: 100%;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: ${grey[700]};
    `,
    Footer: styled.div`
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: ${grey[600]};
    `,
    Sidebar: styled.div`
        height: 800px;
        width: 200px;
        position: absolute;
        top: 0;
        right: 0;
        background-color: ${grey[500]};
    `
};
