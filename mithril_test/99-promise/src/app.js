var m = require('mithril');

'use strict';

var waitAndMessage = function(duration, message) {
  var deferred = m.deferred();
  setTimeout(function()  {
    console.log(message);
    deferred.resolve(duration);
  }, duration);
  return deferred.promise;
};

m.sync([
  waitAndMessage(2000, '2秒経過'),
  waitAndMessage(1000, '1秒経過')
]).then(function(args) {
  console.log('両方終了');
  console.log(args);
});
