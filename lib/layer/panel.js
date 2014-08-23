var panel = require('state/panel').panel;
var tabs = require('state/panel').tabs;

panel.add_animation(new Animation({
  frame_x: runtime.width - 200,
  frame_y: 0,
  xw: 200,
  yh: runtime.height,
  get_gfx: function()
  {
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    c.fillStyle = "rgba(192, 192, 192, 0.5)"
    c.strokeStyle = "rgba(192, 192, 192, 1)"
    c.lineWidth = 5;
    c.beginPath()
    c.rect(0, 0, this.xw, this.yh)
    c.fill()
    c.stroke()

    if (require('state/board').current() != null)
    {
      var planet = require('state/board').current();
      c.font = "12px Georgia"
      c.fillStyle = "rgb(0, 0, 0)"
      c.fillText("Name: " + planet.name, 10, 20)
      c.fillText("Karma: "  + planet.karma(), 10, 34)
    }

    return gfx;
  },
}));
