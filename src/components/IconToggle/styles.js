
const { default: styled } = require('styled-components');
const { default: MaterialIcon } = require('components/MaterialIcon');

module.exports = {

    ToggleIcon: styled(MaterialIcon)`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `
};
