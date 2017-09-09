
const { spring } = require('react-motion');

module.exports = {

    Header: {

        start: {
            top: -80
        },
        enter: {
            top: 0
        },
        halfway: {
            top: -20
        }
    },
    Footer: {

        start: {
            bottom: -80
        },
        enter: {
            bottom: 0
        },
        halfway: {
            bottom: -20
        }
    },
    Sidebar: {

        $delay: 500,

        start: {
            right: -110
        },
        enter: {
            right: 0
        },
        halfway: {
            right: -30
        }
    }
}
