var m = require('mithril');

var PlaySoundButton = {
  controller: function() {
    this.id = Date.now() + '-' + Math.random();
    this.onclick = function() {
      document.getElementById(this.id).play();
    };
  },
  view: function(ctrl, args) {
    return m('div', [
      m('audio', {
        id: ctrl.id
      }, [
        m('source', {
          src: args.source
        })
      ]),
      m('button', {
        onclick: ctrl.onclick.bind(ctrl)
      }, args.label)
    ]);
  }
};

var myApp = {
  controller: function() {},
  view: function() {
    return m('div', [
      m.component(PlaySoundButton,
        {
          source: '1.mp3',
          label: 'play'
        })
    ]);
  }
};

m.mount(document.getElementById('root'), myApp);
