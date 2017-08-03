const { default: styled } = require('styled-components');
const { default: Typography } = require('material-ui/Typography');

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
    `,
    Title: styled(Typography)`
        margin-bottom: 16px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.54);
    `
};
