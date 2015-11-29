var m = require('mithril');

var Tab = function(data) {
  this.tabKey = m.prop(data.tabKey);
  this.title = m.prop(data.title);
  this.content = m.prop(data.content);
};

var vm = {
  init: function() {
    vm.currentTabKey = m.prop('key1');
    vm.list = m.prop([
      new Tab({
        tabKey: 'key1',
        title: 'タイトル1',
        content: '内容1'
      }),
      new Tab({
        tabKey: 'key2',
        title: 'タイトル2',
        content: '内容2'
      }),
      new Tab({
        tabKey: 'key3',
        title: 'タイトル3',
        content: '内容3'
      })
    ]);
    vm.clickTab = function(tab) {
      vm.currentTabKey(tab.tabKey());
    };
  }
};

var controller = function() {
  vm.init();
};

var view = function() {
  return m('div', [
    m('ul', vm.list().map(function(tab) {
      return m('li', {
        onclick: vm.clickTab.bind(vm, tab),
        className: vm.currentTabKey() === tab.tabKey() ? 'selected' : ''
      }, tab.title());
    })),
    m('div.tabContent', vm.list().map(function(tab) {
      return m('div',{
        className: vm.currentTabKey() === tab.tabKey() ? 'selected' : ''
      }, tab.content());
    }))
  ]);
};

m.mount(document.getElementById('root'), {
  controller: controller,
  view: view
});
