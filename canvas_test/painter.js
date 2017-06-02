const PaintType = {
  BRUSH: 1,
  LINE: 2,
  CIRCLE: 3,
  CIRCLE_FILL: 4
};

class CanvasModel {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.drawing = false;
    this.beforeImg = null;
    this.beforeX = 0;
    this.beforeY = 0;
    this.x = 0;
    this.y = 0;
  }

  beginDraw(beforeX, beforeY, img) {
    this.drawing = true;
    this.beforeX = beforeX;
    this.beforeY = beforeY;
    this.beforeImg = img;
  }

  draw(x, y, img) {
    this.x = x;
    this.y = y;
    this.beforeImg = img;
  }
}

class CanvasView {
  constructor(el) {
    this.$el = document.getElementById(el);
    this.ctx = this.$el.getContext('2d');

    this.$el.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.$el.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.$el.addEventListener('mouseup', this.onMouseUp.bind(this));

    this.canvasModel = new CanvasModel(this.$el.width, this.$el.height);
  }

  onMouseMove(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.canvasModel.draw(x, y, this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height));
  }

  onMouseDown(e) {
    if (e.button === 0) {
      const rect = e.target.getBoundingClientRect();
      const beforeX = e.clientX - rect.left;
      const beforeY = e.clientY - rect.top;
      this.canvasModel.beginDraw(beforeX, beforeY, this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height));
    }
  }

  onMouseUp() {
  }
}

const canvasView = new CanvasView('canvas');

class PaintCanvas {
  constructor(ctx) {
    this.ctx = ctx;
    this.beforeX = 0;
    this.beforeY = 0;
    this.lineWidth = 1;
    this.drawing = false;
    this.color = '#000';
    this.globalAlpha = 1.0;
    this.paintType = PaintType.BRUSH

    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
    this.ctx.globalAlpha = this.globalAlpha;
    this.ctx.lineCap = 'round';
  }

  setPaintType(paintType) {
    this.paintType = paintType;
  }

  setColor(color) {
    this.color = color;
    this.ctx.strokeStyle = this.color;
    this.ctx.fillStyle = this.color;
  }

  setLineWidth(lineWidth) {
    this.lineWidth = lineWidth;
    this.ctx.lineWidth = this.lineWidth;
  }

  setGlobalAlpha(globalAlpha) {
    this.globalAlpha = globalAlpha;
    this.ctx.globalAlpha = this.globalAlpha;
  }

  draw(x, y) {
    switch (this.paintType) {
      case PaintType.BRUSH:
        this.ctx.beginPath();
        this.ctx.moveTo(this.beforeX, this.beforeY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.beforeX = x;
        this.beforeY = y;
        break;
      case PaintType.LINE:
        this.ctx.beginPath();
        this.ctx.putImageData(this.beforeImg, 0, 0);
        this.ctx.moveTo(this.beforeX, this.beforeY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        break;
      case PaintType.CIRCLE:
        this.drawCircle(x, y, false);
        break;
      case PaintType.CIRCLE_FILL:
        this.drawCircle(x, y, true);
        break;
    }
  }

  drawCircle(x, y, isFill) {
    this.ctx.beginPath();
    this.ctx.putImageData(this.beforeImg, 0, 0);
    var dx = this.beforeX - x;
    var dy = this.beforeY - y;
    var r = Math.sqrt(dx * dx + dy * dy);
    this.ctx.arc(this.beforeX, this.beforeY, r, 0, 2 * Math.PI, false);
    if (isFill) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  onMouseMove(e) {
    if (!this.drawing) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (this.paintType === PaintType.BRUSH) {
      if (x === this.beforeX && y === this.beforeY) return;
    }
    this.draw(x, y);
  }

  onMouseDown(e) {
    if (e.button === 0) {
      this.beforeImg = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.drawing = true;
      const rect = e.target.getBoundingClientRect();
      this.beforeX = e.clientX - rect.left;
      this.beforeY = e.clientY - rect.top;
    }
  }

  drawEnd(e) {
    if (!this.drawing) return;
    this.drawing = false;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.draw(x, y);
  }
}

function initPainter() {
  const paintToolEl = document.getElementById('paintTool');
  const canvasEl = document.getElementById('canvas');
  const ctx = canvasEl.getContext('2d');

  const drawToolEl = document.getElementById('drawTool');
  const colorEl = document.getElementById('color');
  const lineWidthEl = document.getElementById('lineWidth');
  const opacityEl = document.getElementById('opacity');

  const paintCanvas = new PaintCanvas(ctx);

  drawToolEl.addEventListener('change', function (e) {
    switch (this.value) {
      case 'brush':
        paintCanvas.setPaintType(PaintType.BRUSH);
        break;
      case 'line':
        paintCanvas.setPaintType(PaintType.LINE);
        break;
      case 'circle':
        paintCanvas.setPaintType(PaintType.CIRCLE);
        break;
      case 'circleFill':
        paintCanvas.setPaintType(PaintType.CIRCLE_FILL);
        break;
    }
  });

  colorEl.addEventListener('change', function (e) {
    paintCanvas.setColor(this.value);
  });

  lineWidthEl.addEventListener('change', function (e) {
    paintCanvas.setLineWidth(this.value);
  });

  opacityEl.addEventListener('change', function (e) {
    paintCanvas.setGlobalAlpha(this.value);
  });

  canvasEl.addEventListener('mousemove', paintCanvas.onMouseMove.bind(paintCanvas));
  canvasEl.addEventListener('mousedown', paintCanvas.onMouseDown.bind(paintCanvas));
  canvasEl.addEventListener('mouseup', paintCanvas.drawEnd.bind(paintCanvas));
//  canvasEl.addEventListener('mouseout', paintCanvas.drawEnd.bind(paintCanvas));
}
