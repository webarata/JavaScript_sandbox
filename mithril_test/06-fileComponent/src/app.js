// 参考
// http://qiita.com/joe-re/items/483ddcbe3d04a0a1cebf
'use strict';

var m = require('mithril');

var FileView = {};

FileView.vm = {
  init: function() {
    FileView.vm.image = m.prop(null);
    FileView.vm.fileChange = function(e) {
      var file = e.target.files[0];
      if (!file) {
        FileView.vm.image(null);
        return;
      }
      var fr = new FileReader();
      fr.readAsDataURL(file);
      m.startComputation();
      fr.onload = function(event) {
        FileView.vm.image(event.target.result);
        m.endComputation();
      };
    }
  }
};

FileView.controller = function() {
  FileView.vm.init();
};


FileView.view = function() {
  return m('div', [
    m('input[type=file]', {
      onchange: FileView.vm.fileChange
    }),
    m('img', {
      src: FileView.vm.image(),
      style: {
        display: FileView.vm.image() ? 'inline-block' : 'none'
      }
    })
  ]);
};

var myApp = {
  controller: function() {},
  view: function() {
    return m('div', [
      m.component(FileView),
      m.component(FileView)
    ]);
  }
};

m.mount(document.getElementById('root'), myApp);
