// http://qiita.com/joe-re/items/483ddcbe3d04a0a1cebf
// のJavaScript版

var m = require('mithril');

'use strict';

var vm = {
  init: function() {
    vm.image = m.prop(null);
    vm.fileChange = function(e) {
      var file = e.target.files[0];
      if (!file) {
        vm.image(null);
        return;
      }
      var fr = new FileReader();
      fr.readAsDataURL(file);
      m.startComputation();
      fr.onload = function(event) {
        vm.image(event.target.result);
        m.endComputation();
      };
    }
  }
};

var controller = function() {
  vm.init();
};


var view = function() {
  return m('div', [
    m('input[type=file]', {
      onchange: vm.fileChange
    }),
    m('img', {
      src: vm.image(),
      style: {
        display: vm.image() ? 'inline-block' : 'none'
      }
    })
  ]);
};

m.mount(document.getElementById('root'), {
  controller: controller,
  view: view
});
