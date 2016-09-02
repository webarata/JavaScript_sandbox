var vm = new Vue({
  el: '#example',
  data: {
    name: 'Vue.js'
  },
  // `methods` オブジェクトの下にメソッドを定義します
  methods: {
    greet: function (event) {
      // 内部メソッドの `this` は vm インスタンスを指します
      alert('Hello ' + this.name + '!');
      // `event` はネイティブ DOM イベントです
      alert(event.target.tagName);
    }
  }
});
// JavaScript でもメソッドを起動できます
vm.greet() // -> 'Hello Vue.js!'
