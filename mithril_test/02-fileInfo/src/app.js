var m = require('mithril');

var fi = {};

fi.FileInfo = function(data) {
  this.fileName = m.prop(data.fileName || '');
  this.fileSize = m.prop(data.fileSize || '');
  this.contentType = m.prop(data.contentType || '');
};

fi.vm = {
  init: function() {
    fi.vm.fileInfo = new fi.FileInfo({})
  }
};

fi.controller = function() {
  fi.vm.init();
  return {
    selectFile: function(e) {
      var file = e.target.files[0];
      console.log(file);
      fi.vm.fileInfo.fileName(file.name);
      fi.vm.fileInfo.fileSize(file.size);
      fi.vm.fileInfo.contentType(file.type);
    }
  };
};

fi.view = function(ctrl) {
  return m('div', [
    m('input[type=file]', {
      onchange: ctrl.selectFile
    }),
    m('div', [
      m('span', 'ファイル名:'),
      m('span', fi.vm.fileInfo.fileName())
    ]),
    m('div', [
      m('span', 'ファイルサイズ:'),
      m('span', fi.vm.fileInfo.fileSize())
    ]),
    m('div', [
      m('span', 'コンテンツタイプ:'),
      m('span', fi.vm.fileInfo.contentType())
    ])
  ]);
};

m.mount(document.getElementById('root'), {
  controller: fi.controller,
  view: fi.view
});
