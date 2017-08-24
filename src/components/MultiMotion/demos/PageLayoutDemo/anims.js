
const { spring } = require('react-motion');

module.exports = {

    Header: {

        start: {
            top: -80
        },
        enter: {
            top: 0
        },
        leave: {
            top: -80
        }
    },
    Footer: {

        start: {
            bottom: -80
        },
        enter: {
            bottom: 0
        },
        leave: {
            bottom: -80
        }
    },
    Sidebar: {

        delay: 500,

        start: {
            right: -80
        },
        enter: {
            right: 0
        },
        leave: {
            right: -80
        }
    }
}
