var m = require('mithril');

var myComponent = {
  controller: function(args, extra) {},
  view: function(ctrl, args, extra) {
    return m('h1', args.message + ' ' + extra);
  }
};

var myComponent2 = m.component(myCOmponent({
  message: 'hello'
}, 'world'));
