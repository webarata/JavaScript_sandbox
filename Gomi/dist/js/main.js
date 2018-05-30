//(function() {
  'use strict';

  const BASIC_DATE_FORMAT = 'YYYYMMDD';
  const VIEW_DATE_FORMAT = 'YYYY年MM月DD日';
  const VIEW_GARBAGE_DATE_FORMAT = 'M月D日(ddd)';
  const VIEW_UNTIL_DAY = ['今日', '明日', '明後日'];

  function getCurrentDate() {
    return moment().format(BASIC_DATE_FORMAT);
  }

  function getViewDate(date) {
    return moment(date, BASIC_DATE_FORMAT).format(VIEW_DATE_FORMAT);
  }

  function getViewGarbageDate(date) {
    return moment(date, BASIC_DATE_FORMAT).format(VIEW_GARBAGE_DATE_FORMAT);
  }

  const nowDate = getCurrentDate();

  Vue.component('garbage-item', {
    template: `
      <div class="garbage-item">
       <div class="garbage-title">
        <div v-for="garbageTitle in garbage.garbageTitleList">{{ garbageTitle }}</div>
       </div>
       <div class="garbage-schedule">
        <div class="garbage-until-day"><span>{{ viewUntilDay }}</span></div>
        <div class="garbage-next-date">{{ viewNextDate }}</div>
       </div>
      </div>`,
    data: function() {
      return {
      }
    },
    props: {
      nowDate: '',
      garbage: {}
    },
    computed: {
      nextDate: function() {
        return this.getImmediateDate(this.garbage.garbageDateList);
      },
      viewNextDate: function() {
        return getViewGarbageDate(this.nextDate);
      },
      untilDay: function() {
        return this.getUntilDay(this.nextDate, this.nowDate);
      },
      viewUntilDay: function() {
        return this.getViewUntilDay(this.untilDay);
      }
    },
    methods: {
      getImmediateDate: function(dateList) {
        for (let date of dateList) {
          if (date >= this.nowDate) return date;
        }
        return null;
      },
      getUntilDay: function(nextDate, nowDate) {
        return moment(nextDate, BASIC_DATE_FORMAT).diff(moment(nowDate, BASIC_DATE_FORMAT), 'days');
      },
      getViewUntilDay: function(untilDay) {
        return untilDay > 2 ? untilDay + '日後' : VIEW_UNTIL_DAY[untilDay];
      }
    }
  });

  Vue.component('garbage-list', {
    template: `
      <div class="garbage-list">
       <garbage-item :now-date="nowDate" :garbage="garbage" v-for="garbage in garbageList" :key="garbage.key"></garbage-item>
      </div>`,
    data: function() {
      return {
      }
    },
    props: {
      nowDate: '',
      garbageList: Array
    }
  });

  const vm = new Vue({
    el: '#app',
    created: function() {
      axios.get('http://localhost:8887/json/ichiki.json')
        .then(response => {
          const data = response.data;
          this.garbageList = data.garbageList;
        });
    },
    data: {
      nowDate: nowDate,
      region: 'ichiki',
      garbageList: [{
        key: 0,
        garbageTitleList: [],
        garbageDateList: []
      }]
    },
    computed: {
      viewDate: function() {
        return getViewDate(this.nowDate);
      }
    }
  });

  setInterval(() => {
    vm.nowDate = getCurrentDate();
  }, 1000);
//})();
