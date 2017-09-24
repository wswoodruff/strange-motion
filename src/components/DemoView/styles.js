const { default: styled } = require('styled-components');
const { default: Typography } = require('material-ui/Typography');
const { default: Card, CardContent } = require('material-ui/Card');

module.exports = {

    Bg: styled.div`

        display: flex;
        justify-content: center;
        padding: 20px 35px;
        background-color: #eeeeee;

        margin-bottom: 20px;

        @media (min-width: 600px) {
            padding-left: 60px;
            padding-right: 60px;
        }
    `,
    StyledCard: styled(Card)`
        width: 100%;
        height: 350px;
        display: flex;
        flex-flow: column nowrap;
    `,
    StyledCardContent: styled(CardContent)`
        flex-grow: 1;
        display: flex;
        position: relative;
        flex-flow: column nowrap;
    `,
    DemoContent: styled.div`
        flex-grow: 1;
        position: relative;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
    `,
    Title: styled(Typography)`
        margin-bottom: 16px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.54);
    `
};
