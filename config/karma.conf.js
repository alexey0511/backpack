// Karma configuration
// Generated on Sun Nov 09 2014 03:51:18 GMT+0700 (SE Asia Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    "./tests/home/*.js",
    "../public_html/js/*.js",
    "../public_html/*.js",
    "../public_html/js/external/angularjs/angular.min.js",    
    "./tests/angular-mocks.js"
],
  autowatch: true, 
  
  browsers: ['Chrome'],
  plugins: [
      'karma-junit-reporter',
      'karma-chrome-launcher',
      'karma-script-launcher',
      'karma-jasmine',
      'grunt-karma'
  ],

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
//    port: 9876,
port: 5000,
    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
 //   browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
