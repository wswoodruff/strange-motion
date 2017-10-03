const { default: styled } = require('styled-components');
const { blue } = require('material-ui/colors');

module.exports = {
    BlueBall: styled.div`
        position: absolute;
        left: 0;
        top: 0;
        width: 95px;
        height: 95px;
        border-radius: 50%;
        border: 2px solid ${blue[200]};
        transform: translate(-50%, -50%);
        background-color:${blue[500]};
    `,
    Wrapper: styled.div`
        position: absolute;
        width: 100%;
        height: 100%;
    `
};
