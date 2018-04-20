const moment = require("moment");

(function() {
  "use strict";

  moment.locale("ja");

  const app = new Vue({
    el: "#app",
    data: {
      date: new Date()
    },
    computed: {
      hoge: function() {
        return moment(this.date).format("YYYYMMDDHHmmss");
      }
    }
  });

  setInterval(() => {
    app.date = new Date();
  }, 1000);
})();
