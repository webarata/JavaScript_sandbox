var MyComponent = Vue.extend({
  template: '#aa'
});

Vue.component('child', {
  // props を宣言します
  props: ['msg'],
  template: '<span>{{ msg }}</span>'
});

new Vue({
  el: '#example',
  data: function() {
    return {
      msg: ''
    };
  },
  events: {
    'child-msg': function (msg) {
      // イベントのコールバックでの `this` は
      // それが登録されたとき、自動的にインスタンスに結びつけます
      this.messages.push(msg)
    }
  }
});

