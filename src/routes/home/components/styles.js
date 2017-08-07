const { default: styled } = require('styled-components');

module.exports = {

    DemosContainer: styled.div`

        width: 100%;
        display: flex;
        flex-flow: row wrap;

        & > div {
            width: calc(50% - 20px);

            &:nth-child(odd) {
                margin-right: 10px;
            }

            &:nth-child(even) {
                margin-left: 10px;
            }

            @media (max-width: 900px) {
                width: 100%;
            }
        }
    `,
    HomeContainer: styled.div`
        width: 100%;
        height: 100%;
        margin: auto;
        padding: 100px 0;
        max-width: 1100px;
    `,
    SectionTitle: styled.h2`
        color: rgba(0, 0, 0, 0.54);
        margin: 1em 0 0.7em;
        font-size: 34px;
        font-weight: 400;
        font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        line-height: 40px;
    `
};
