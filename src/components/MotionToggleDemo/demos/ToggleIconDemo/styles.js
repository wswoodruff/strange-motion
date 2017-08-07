
const { default: styled } = require('styled-components');
const { default: MaterialIcon } = require('components/MaterialIcon');
const { default: IconButton } = require('material-ui/IconButton');
const { red } = require('material-ui/colors');

const iconSize = '150px';

module.exports = {

    ToggleIcon: styled(MaterialIcon)`

        width: 130px;
        height: 130px;

        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: inherit;
        line-height: 130px;

        &.toggle-icon-on {
            color: ${red[600]};
        }
    `,
    IconButton: styled(IconButton)`
        width: ${iconSize} !important;
        height: ${iconSize} !important;
    `
};
