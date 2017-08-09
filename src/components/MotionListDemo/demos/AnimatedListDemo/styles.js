const { default: styled } = require('styled-components');
const { red, green, blue } = require('material-ui/colors');
const { default: MaterialIcon } = require('components/MaterialIcon');

const Row = styled.div`
    height: 40px;
    width: 100%;
    color: white;
    background-color: green;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    font-weight: bold;
    transition: background 1s;
`;

module.exports = {
    Wrapper: styled.div`
        position: absolute;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    `,
    RedRow: Row.extend`
        border: 1px solid ${red[600]};
        background-color: ${red[300]};
    `,
    GreenRow: Row.extend`
        border-top: 1px solid ${green[600]};
        border-bottom: 1px solid ${green[600]};
        background-color: ${green[300]};
    `,
    BlueRow: Row.extend`
        border-top: 1px solid ${blue[600]};
        border-bottom: 1px solid ${blue[600]};
        background-color: ${blue[300]};
    `,
    XButton: styled(MaterialIcon)
    .attrs({
        name: 'close'
    })`
        background: rgba(255, 255, 255, 0.4);
        color: ${red[500]};
        padding: 4px;
        cursor: pointer;
    `
};
