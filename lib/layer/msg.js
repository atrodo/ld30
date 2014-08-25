var msg = require('state/msg')
var msg_panel = msg.msg_panel;

msg_panel.add_animation(new Animation({
  frame_x: 0,
  frame_y: runtime.height - 80,
  xw: runtime.width - 300,
  yh: 80,
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()
    gfx.reset_transform()

    var c = gfx.context

    c.translate(0, this.yh)
    c.scale(1, -1);

    c.fillStyle = "rgba(192, 192, 192, 0.5)"
    c.strokeStyle = "rgba(192, 192, 192, 1)"
    c.lineWidth = 5;
    c.beginPath()
    c.rect(0, 0, this.xw, this.yh)
    c.fill()
    c.stroke()

    c.font = "bold 12px Georgia"
    c.fillStyle = "rgb(0, 0, 0)"
    c.textAlign = 'center'

    var max = runtime.width - 300 - 20
    c.fillText(msg.msg1, max/2 + 10, 30, max)
    c.fillText(msg.msg2, max/2 + 10, 50, max)
    c.fillText(msg.msg3, max/2 + 10, 70, max)

    return gfx;
  },
}));

