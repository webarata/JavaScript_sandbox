'use strict';

const PaintType = {
  BRUSH: 0,
  LINE: 1,
  CIRCLE: 2,
  CIRCLE_FILL: 3
};

class Model {
  constructor() {
    this._attributeList = {};
    this._handlerList = {};
  }

  get(key) {
    return this._attributeList[key];
  }

  set(key, value) {
    this._attributeList[key] = value;
  }

  on(event, handler) {
    (this._handlerList[event] || (this._handlerList[event] = [])).push(handler);
  }

  _trigger(event, argList) {
    const list = this._handlerList[event];
    if (list) {
      list.forEach(handler => {
        handler(argList);
      });
    }
  }
}

class View {
  constructor() {
  }

  _setEl(elList) {
    for (let key in elList) {
      if (elList.hasOwnProperty(key)) {
        this[elList[key]] = document.getElementById(key);
      }
    }
  }

  _setEvent(eventList) {
    for (let key in eventList) {
      if (eventList.hasOwnProperty(key)) {
        const callback = eventList[key];
        const keys = key.split(' ');
        document.getElementById(keys[1]).addEventListener(keys[0], (e) => {
          callback.call(this, e);
        });
      }
    }
  }

  _setAppEvent(model, eventList) {
    for (let key in eventList) {
      if (eventList.hasOwnProperty(key)) {
        const callback = eventList[key];
        model.on(key, argList => {
          callback.call(this, argList);
        });
      }
    }
  }
}

class CanvasModel extends Model {
  constructor(width, height) {
    super();
    this._width = width;
    this._height = height;

    this._drawing = false;
    this._beforeImg = null;
    this._beforeX = 0;
    this._beforeY = 0;
    this._x = 0;
    this._y = 0;

    this._paintType = PaintType.BRUSH;
    this._lineWidth = 1;
    this._color = '#000';
    this._opacity = 1.0;
  }

  get beforeImg() {
    return this._beforeImg;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get beforeX() {
    return this._beforeX;
  }

  get beforeY() {
    return this._beforeY;
  }

  get paintType() {
    return this._paintType;
  }

  get lineWidth() {
    return this._lineWidth;
  }

  get color() {
    return this._color;
  }

  get opacity() {
    return this._opacity;
  }

  isTool (){
    return !(this._paintType === PaintType.BRUSH);
  }

  beginDraw(beforeX, beforeY, img) {
    this._drawing = true;
    this._beforeX = beforeX;
    this._beforeY = beforeY;
    this._beforeImg = img;
  }

  moveDraw(x, y, img) {
    if (!this._drawing) return;
    this._x = x;
    this._y = y;
    if (!this.isTool()) {
      this._beforeImg = img;
    }

    this._trigger('beginDraw');
  }

  moveTo() {
    if (this._paintType !== PaintType.BRUSH) return;
    this._beforeX = this.x;
    this._beforeY = this.y;
  }

  endDraw(x, y, img) {
    this._drawing = false;

    this._trigger('endDraw');
  }

  setColor(color) {
    this._color = color;
    this._trigger('changeColor');
  }

  setLineWidth(lineWidth) {
    this._lineWidth = lineWidth;
    this._trigger('changeLineWidth');
  }

  setOpacity(opacity) {
    this._opacity = opacity;
    this._trigger('changeOpacity');
  }

  setPaintType(paintType) {
    this._paintType = paintType;
  }
}

class CanvasView extends View {
  constructor(el, canvasModel) {
    super();
    this.$el = document.getElementById(el);
    this._ctx = this.$el.getContext('2d');

    this._ctx.strokeStyle = canvasModel.color;
    this._ctx.fillStyle = canvasModel.color;
    this._ctx.lineWidth = canvasModel.lineWidth;

    this._setEvent({
      'mousemove canvas': this._onMouseMove,
      'mousedown canvas': this._onMouseDown,
      'mouseup canvas': this._onMouseUp
    });

    this.canvasModel = canvasModel;

    this._setAppEvent(this.canvasModel, {
      'beginDraw': this._beginDraw,
      'movePath': this._movePath,

      'changeColor': this._onChangeColor,
      'changeLineWidth': this._onChangeLineWidth,
      'changeOpacity': this._onChangeOpacity
    });
  }

  _onMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (this.canvasModel.isTool) {
      this.canvasModel.moveDraw(x, y, this._ctx.getImageData(0, 0, this._ctx.canvas.width, this._ctx.canvas.height));
    } else {
      this.canvasModel.moveDraw(x, y, null);
    }
  }

  _onMouseDown(e) {
    if (e.button === 0) {
      const rect = e.target.getBoundingClientRect();
      const beforeX = e.clientX - rect.left;
      const beforeY = e.clientY - rect.top;
      this.canvasModel.beginDraw(beforeX, beforeY, this._ctx.getImageData(0, 0, this._ctx.canvas.width, this._ctx.canvas.height));
    }
  }

  _onMouseUp(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.canvasModel.endDraw(x, y, this._ctx.getImageData(0, 0, this._ctx.canvas.width, this._ctx.canvas.height));
  }

  _beginDraw(e) {
    if (this.canvasModel.isTool()) {
      this._ctx.putImageData(this.canvasModel.beforeImg, 0, 0);
    }
    if (this.canvasModel.paintType === PaintType.BRUSH ||
      this.canvasModel.paintType === PaintType.LINE) {
      this._ctx.beginPath();
      this._ctx.moveTo(this.canvasModel.beforeX, this.canvasModel.beforeY);
      this._ctx.lineTo(this.canvasModel.x, this.canvasModel.y);
      this._ctx.stroke();
      this.canvasModel.moveTo();
    } else if (this.canvasModel.paintType === PaintType.CIRCLE ||
      this.canvasModel.paintType === PaintType.CIRCLE_FILL) {
      this._ctx.beginPath();
      const dx = this.canvasModel.beforeX - this.canvasModel.x;
      const dy = this.canvasModel.beforeY - this.canvasModel.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      this._ctx.arc(this.canvasModel.beforeX, this.canvasModel.beforeY, r, 0, 2 * Math.PI, false);
      if (this.canvasModel.paintType === PaintType.CIRCLE_FILL) {
        this._ctx.fill();
      } else {
        this._ctx.stroke();
      }
    }
  }

  _onChangeColor() {
    this._ctx.strokeStyle = this.canvasModel.color;
    this._ctx.fillStyle = this.canvasModel.color;
  }

  _onChangeLineWidth() {
    this._ctx.lineWidth = this.canvasModel.lineWidth;
  }

  _onChangeOpacity() {
    this._ctx.globalAlpha = this.canvasModel.opacity;
  }
}

class ToolbarView extends View {
  constructor(el, canvasModel) {
    super();
    this.$el = document.getElementById(el);

    this._canvasModel = canvasModel;

    this._setEvent({
      'change drawTool': this._onChangeDrawTool,
      'change color': this._onChangeColor,
      'change lineWidth': this._onChangeLineWidth,
      'change opacity': this._onChangeOpacity
    });
  }

  _onChangeDrawTool(e) {
    switch(e.target.value) {
      case 'brush':
        this._canvasModel.setPaintType(PaintType.BRUSH);
        break;
      case 'line':
        this._canvasModel.setPaintType(PaintType.LINE);
        break;
      case 'circle':
        this._canvasModel.setPaintType(PaintType.CIRCLE);
        break;
      case 'circleFill':
        this._canvasModel.setPaintType(PaintType.CIRCLE_FILL);
        break;
    }
  }

  _onChangeColor(e) {
    this._canvasModel.setColor(e.target.value);
  }

  _onChangeLineWidth(e) {
    this._canvasModel.setLineWidth(e.target.value);
  }

  _onChangeOpacity(e) {
    this._canvasModel.setOpacity(e.target.value);
  }
}

class AppController {
  constructor() {
    this.canvasModel = new CanvasModel(600, 400);

    new CanvasView('canvas', this.canvasModel);
    new ToolbarView('toolbar', this.canvasModel);
  }
}

new AppController();
