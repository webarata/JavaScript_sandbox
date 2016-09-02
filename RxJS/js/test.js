'use strict';

const buttonClick = Rx.Observable.fromEvent($('#button'), "click");

buttonClick.filter(value => {
  return value.altKey;
}).subscribe(() => {
  console.log('Altキーを押しながらクリックしたね！');
});
