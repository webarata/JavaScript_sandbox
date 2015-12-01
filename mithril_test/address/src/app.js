var m = require('mithril');

var Address = function(data) {
  this.name = m.prop(data.name);
  this.tel = m.prop(data.tel);
};

var vm = {
  init: function() {
    vm.name = m.prop('');
    vm.tel = m.prop('');
    vm.list = m.prop([]);
    vm.addAddress = function() {
      if (vm.name() === '') return;
      if (vm.tel() === '') return;
      vm.list().push(new Address({
        name: vm.name(),
        tel: vm.tel()
      }));
      vm.name('');
      vm.tel('');
    };
    vm.deleteAddress = function(index) {
      vm.list().splice(index, 1);
    }
  }
};

var controller = function() {
  vm.init();
};

var view = function() {
  return m('div', [
    m('div', [
      m('input[type=text]', {
        onchange: m.withAttr("value", vm.name),
        placeholder: '名前',
        value: vm.name()
      }),
      m('input[type=text]', {
        onchange: m.withAttr("value", vm.tel),
        placeholder: '電話番号',
        value: vm.tel()
      }),
      m('input[type=button]', {
        onclick: vm.addAddress.bind(vm),
        value: '追加'
      })
    ]),
    m('table', [
      m('thead', [
        m('tr', [
          m('th', '名前'),
          m('th', '電話番号'),
          m('th')
        ])
      ]),
      m('tbody', [
        vm.list().map(function(address, index) {
          return m('tr', [
            m('td', address.name()),
            m('td', address.tel()),
            m('td', [
              m('input[type=button]', {
                onclick: function() {
                  vm.deleteAddress(index)
                },
                value: '削除'
              })
            ])
          ])
        })
      ])
    ])
  ]);
};

m.mount(document.getElementById('root'), {
  controller: controller,
  view: view
});
