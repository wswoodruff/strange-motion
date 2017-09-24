
module.exports = {

    ToggleAnim: {
        enter: {
            opacity: {
                val: 1,
                stiffness: 210,
                damping: 25
            },
            fontSize: {
                val: 100,
                stiffness: 210,
                damping: 25
            }
        },
        leave: {
            opacity: 0,
            fontSize: 60
        }
    }
};
