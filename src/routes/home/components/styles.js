const { default: styled } = require('styled-components');
const IconToggle = require('components/IconToggle');
const { red } = require('material-ui/colors');

module.exports = {

    MainContainer: styled.div`
        width: 100%;
        height: 100%;
    `,
    AlarmButton: styled(IconToggle)`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -65%);
        width: 150px !important;
        height: 150px !important;

        .alarm-icon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: inherit;
            line-height: 130px;
            width: 130px;
            height: 130px;
        }

        .alarm-icon-on {
            color: ${red[600]};
        }
    `
};
