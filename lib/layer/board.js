var board = require('state/board').board
var planets = require('state/board').planets

board.add_animation(new Animation({
  frame_x: 0,
  frame_y: 20,
  xw: runtime.width - 200,
  yh: runtime.height,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    c.lineWidth = 5;
    c.fillStyle = 'green';
    c.strokeStyle = '#003300';

    $.each(planets, function(i, planet)
    {

      if (planet.data.planet == null)
      {
        if (planet.trigger.click == null)
        {
          planet.set_trigger(new triggers.click({
            x: 0,
            y: 0,
            xw: self.xw,
            yh: self.yh,
          }))
        }
        return;
      }

      var rad = 20
      var x = 30 * (i + 1) * 2 - rad
      var y = 30 *           2 - rad
      var xw = rad * 2
      var yh = rad * 2

      c.beginPath()
      c.arc(30 * (i + 1) * 2, 30, 20, 0, 2 * Math.PI)
      c.closePath()
      c.fill();
      c.stroke();

      planet.set_trigger(new triggers.click({
        x: x,
        y: self.yh - y,
        xw: xw,
        yh: yh,
      }))
    });

    return gfx;
  },

}));
