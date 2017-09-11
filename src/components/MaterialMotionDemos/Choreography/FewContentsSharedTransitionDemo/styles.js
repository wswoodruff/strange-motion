const { default: styled } = require('styled-components');
const { blue } = require('material-ui/colors');
const { default: AppBar } = require('material-ui/AppBar');
const { default: Avatar } = require('material-ui/Avatar');
const { default: Typography } = require('material-ui/Typography');

const { default: Layers } = require('styles/layers');

module.exports = {
    AppBar: styled(AppBar)`
        position: absolute !important;
        height: 56px !important;
        z-index: 1 !important;
        h2 {
            color: white !important;
            font-size: 19px !important;
        }
    `,
    Avatar: styled(Avatar)`
        width: 60px !important;
        height: 60px !important;
        margin: auto;
    `,
    GithubUsersContainer: styled.div`
        padding-top: 61px;
        position: absolute;
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        height: 100%;
        overflow: scroll;
    `,
    GithubUserContainer: styled.div`
        width: calc(33% - 10px);
        margin: 0 5px;
        height: auto;
        margin-bottom: 8px;
        cursor: pointer;
    `,
    SharedContentsContainer: styled.div`
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    `,
    DetailContentsContainer: styled.div`
        width: 100%;
        height: 100%;
    `,
    GithubUserName: styled(Typography)
    .attrs({
        type: 'caption'
    })`
        margin-top: 10px !important;
    `
};
