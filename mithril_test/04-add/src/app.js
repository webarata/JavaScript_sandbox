var m = require('mithril');

var leftSide = 0;
var rightSide = 0;

var vm = {
  init: function() {
    vm.answer = m.prop(0);
    vm.add = function() {
      vm.answer(parseInt(leftSide, 10) + parseInt(rightSide, 10));
    }
  }
};

vm.leftSide = function(value) {
  if (arguments.length > 0) {
    leftSide = value.replace(/[^0-9]/, '');
    vm.add();
  }
  return leftSide;
};

vm.rightSide = function(value) {
  if (arguments.length > 0) {
    rightSide = value.replace(/[^0-9]/, '');
    vm.add();
  }
  return rightSide;
};

var controller = function() {
  vm.init();
};

var view = function() {
  return m('div', [
    m('input', {
      oninput: m.withAttr('value', vm.leftSide),
      value: vm.leftSide()
    }),
    m('span', '+'),
    m('input', {
      oninput: m.withAttr('value', vm.rightSide),
      value: vm.rightSide()
    }),
    m('span', '='),
    m('span', vm.answer())
  ]);
};

m.mount(document.getElementById('root'), {
  controller: controller,
  view: view
});
