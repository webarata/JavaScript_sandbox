const BASIC_DATE_FORMAT = 'YYYYMMDD';
const VIEW_DATE_FORMAT = 'YYYY年MM月DD日';
const VIEW_UNTIL_DAY = ['今日', '明日', '明後日'];
function getCurrentDate() {
  return moment().format(BASIC_DATE_FORMAT);
}

function getViewDate(date) {
  return moment(date, BASIC_DATE_FORMAT).format(VIEW_DATE_FORMAT);
}

const nowDate = getCurrentDate();

const vm = new Vue({
  el: '#app',
  data: {
    nowDate: nowDate,
    region: 'ichiki',
    burnDateList: ['20180530', '20180602'],
    bulkyDateList: ['20180405', '20180503', '20180607', '20180705', '20180802', '20180906', '20181004', '20181101', '20181206', '20180110', '20180207', '20180307'],
    nonflammableDateList: ['20180419', '20180517', '20180621', '20180719', '20180816', '20180920', '20181018', '20181115', '20181220', '20180124', '20180221', '20180321']
  },
  computed: {
    viewDate: function() {
      return getViewDate(this.nowDate);
    },
    nextBurnDate: function() {
      return this.getImmediateDate(this.burnDateList);
    },
    viewNextBurnDate: function() {
      return getViewDate(this.nextBurnDate);
    },
    viewUntilBurnDay: function() {
      return this.getViewUntilDay(this.nextBurnDate, this.nowDate);
    },
    nextBulkyDate: function() {
      return this.getImmediateDate(this.bulkyDateList);
    },
    viewNextBulkyDate: function() {
      return getViewDate(this.nextBulkyDate);
    },
    viewUntilBulkyDay: function() {
      return this.getViewUntilDay(this.nextBulkyDate, this.nowDate);
    },
    nextNonflammableDate: function() {
      return this.getImmediateDate(this.nonflammableDateList);
    },
    viewNextNonflammableDate: function() {
      return getViewDate(this.nextNonflammableDate);
    },
    viewUntilNonflammableDay: function() {
      return this.getViewUntilDay(this.nextNonflammableDate, this.nowDate);
    }
  },
  methods: {
    getImmediateDate: function(dateList) {
      for (let date of dateList) {
        if (date >= this.nowDate) return date;
      }
      return  null;
    },
    getViewUntilDay: function(nextDate, nowDate) {
      const untilDay =  moment(nextDate, BASIC_DATE_FORMAT).diff(moment(nowDate, BASIC_DATE_FORMAT), 'days');
      return untilDay > 2 ? untilDay + '日後' : VIEW_UNTIL_DAY[untilDay];
    }
  }
});

setInterval(() => {
  vm.nowDate = getCurrentDate();
}, 1000);
