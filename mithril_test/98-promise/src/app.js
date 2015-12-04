'use strict';

var m = require('mithril');
var fs = require('fs');

var readFileAsync = function(name) {
  var deferred = m.deferred();
  fs.readFile(name, {
    encoding: 'utf8'
  }, function(error, content) {
    if (error) {
      return deferred.reject(error);
    }
    return deferred.resolve(contetn);
  });
  return deferred.promise;
};

readFileAsync("存在しないファイル.txt").then(function(result) {
  console.log(result);
}, function(error) {
  console.error(error);
});
