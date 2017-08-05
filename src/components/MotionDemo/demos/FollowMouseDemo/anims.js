
const { spring } = require('react-motion');

module.exports = {

    BlueBallAnim: {
        startStyle: {
            left: 0,
            top: 0
        },
        enterAnim: {
            left: {
                val: 200,
                preset: 'wobbly'
            },
            top: {
                val: 200,
                preset: 'wobbly'
            }
        }
    }
}
