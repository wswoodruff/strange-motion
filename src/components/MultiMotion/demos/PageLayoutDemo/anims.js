
const { spring } = require('react-motion');

module.exports = {

    Header: {

        start: {
            top: -80
        },
        enter: {
            top: 0
        }
    },
    Footer: {

        // delay: 300,
        start: {
            bottom: -80
        },
        enter: {
            bottom: 0
        }
    },
    Sidebar: {

        delay: 300,

        start: {
            right: -80
        },
        enter: {
            right: 0
        }
    }
}
