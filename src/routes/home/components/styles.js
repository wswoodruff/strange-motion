const { default: styled } = require('styled-components');
const IconToggle = require('components/IconToggle');
const { red } = require('material-ui/colors');

module.exports = {

    DemosContainer: styled.div`
        width: 100%;
        height: 100%;
    `,
    HomeContainer: styled.div`
        width: 100%;
        height: 100%;
        margin: auto;
        padding: 100px 0;
        max-width: 852px;
    `,
    ToggleButton: styled(IconToggle)`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -65%);
        width: 150px !important;
        height: 150px !important;

        .toggle-icon {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: inherit;
            line-height: 130px;
            width: 130px;
            height: 130px;
        }

        .toggle-icon-on {
            color: ${red[600]};
        }
    `
};
