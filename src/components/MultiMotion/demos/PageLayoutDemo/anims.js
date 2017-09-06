
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

        start: {
            bottom: -80
        },
        enter: {
            bottom: 0
        }
    },
    Sidebar: {

        delay: 500,

        start: {
            right: -110
        },
        enter: {
            right: 0
        }
    }
}
