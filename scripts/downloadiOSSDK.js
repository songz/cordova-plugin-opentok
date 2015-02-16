#!/usr/bin/env node

module.exports = function (context) {
  var downloadFile = require('./downloadFile.js'),
    exec = require('./exec/exec.js'),
    Q = context.requireCordovaModule('q'),
    deferral = new Q.defer();
  console.log('Downloading OpenTok iOS SDK');
  downloadFile('https://s3.amazonaws.com/artifact.tokbox.com/rel/ios-sdk/OpenTok-iOS-2.4.0.tar.bz2', './opentok-ios-sdk-2.4.0.tar.bz2', function (err) {
    if (!err) {
      console.log('downloaded');
      exec('tar -zxvf ./opentok-ios-sdk-2.4.0.tar.bz2', function (err, out, code) {
        console.log('expanded');
        var frameworkDir = context.opts.plugin.dir + '/src/ios/';
        exec('mv ./OpenTok-iOS-2.4.0/OpenTok.framework ' + frameworkDir, function (err, out, code) {
          console.log('moved OpenTok.framework into ' + frameworkDir);
          deferral.resolve();
        });
      });
    }
  });
  return deferral.promise;
};