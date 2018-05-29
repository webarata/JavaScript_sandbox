const Vue = require('vue');
const moment = require('moment');

(function() {
  'use strict';

  moment.locale('ja');

  const app = new Vue({
    el: '#app',
    data: {
      date: null,
      time: null
    }
  });

  const updateTime = function() {
    const dateTime = moment(new Date()).format('YYYYMMDD HHmmss').split(' ');
    app.date = dateTime[0];
    app.time = dateTime[1];
  };

  updateTime();

  setInterval(() => {
    updateTime();
  }, 1000);
})();
