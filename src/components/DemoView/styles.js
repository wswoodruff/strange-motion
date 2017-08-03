const { default: styled } = require('styled-components');

module.exports = {

    Bg: styled.div`

        display: flex;
        justify-content: center;
        padding-top: 20px;
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 20px;
        background-color: #eeeeee;

        @media (min-width: 600px) {
            padding-left: 24px;
            padding-right: 24px;
        }
    `
};
