const { default: styled } = require('styled-components');

module.exports = {

    DemosContainer: styled.div`
        width: 100%;
    `,
    HomeContainer: styled.div`
        width: 100%;
        height: 100%;
        margin: auto;
        padding: 100px 0;
        max-width: 852px;
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
