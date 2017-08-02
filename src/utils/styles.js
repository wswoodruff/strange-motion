
const replaceAll = (str, search, replacement) => {

    return str.split(search).join(replacement);
};

module.exports = {

    important: (tag) => {

        tag = [].concat(tag);

        return tag.map((css) => {

            return replaceAll(css, ';', ' !important;');
        });
    }
};
