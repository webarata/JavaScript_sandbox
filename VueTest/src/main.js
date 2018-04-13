import {hello} from './test';

// sub.jsに定義されたJavaScriptを実行する。
hello();

(function() {
  'use strict';

  const app = new Vue({
    el: '#app',
    data: {
      date: new Date()
    },
    computed: {
      hoge: function() {
        return this.date + '!!!';
      }
    }
  });

  setInterval(() => {
    app.date = new Date();
  }, 1000)
})();
