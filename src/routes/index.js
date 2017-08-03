// Just the modules necessary for initial render!
const CoreLayout = require('../layouts/CoreLayout');
const Home = require('./home');

let rootPath;

if (__DEV__) {
    rootPath = '/';
}
else {
    rootPath = '/strange-motion';
}

// Create routes
module.exports = (store) => ({
    path: rootPath,
    component: CoreLayout,
    indexRoute: Home
});

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./counter')(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/
