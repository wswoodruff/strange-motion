
const { styledWrap: styled } = require('styles');
const { default: Icon } = require('material-ui/Icon');

module.exports = {

    ToggleIcon: styled(Icon)`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    `
};
