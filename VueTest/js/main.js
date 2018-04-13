(function() {
  'use strict';

  const app = new Vue({
    el: '#app',
    data: {
      date: new Date()
    },
    watch: {
      date: function(val) {
      }
    }
  });

  setInterval(() => {
    app.date = new Date();
  }, 1000)
})();
