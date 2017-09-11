'use strict';

module.exports = {

    getRelativePosition: (elem1, elem2) => {

        const elem1BoundingRect = elem1.getBoundingClientRect();
        const elem2BoundingRect = elem2.getBoundingClientRect();

        return {
            top: elem2BoundingRect.top - elem1BoundingRect.top,
            left: elem2BoundingRect.left - elem1BoundingRect.left
        }
    }
}
