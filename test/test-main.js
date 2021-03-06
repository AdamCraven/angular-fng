var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/',

    paths: {
        'angular': 'node_modules/angular/angular',
        'angular-mocks': 'node_modules/angular-mocks/angular-mocks',
        'jquery': 'node_modules/jquery/dist/jquery.min',
    },

    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-mocks': {
            deps: ['angular']
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});