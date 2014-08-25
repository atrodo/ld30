var panel = require('state/panel').panel;
var tabs = require('state/panel').tabs;

panel.add_animation(new Animation({
  frame_x: runtime.width - 300,
  frame_y: 0,
  xw: 300,
  yh: runtime.height,
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

    c.font = "bold 20px Georgia"
    c.fillStyle = "rgb(0, 0, 0)"
    c.fillText("Level:", 10, 30)
    c.fillText(require('logic/main').level, 130, 30)

    c.fillText("Turn:", 10, 54)
    c.fillText(require('logic/main').turn, 130, 54)

    c.fillText("Planet:", 10, 78)

    if (require('state/board').current() != null)
    {
      var planet = require('state/board').current();
      c.fillText(planet.name, 130, 78)

      var y = 78 + 24
      c.fillText("Witches:", 10, y)
      $.each(planet.witches, function(i, witch)
      {
        c.fillStyle = witch.color()
        c.fillText(witch.name, 130, y)
        y += 24
      })

      if (planet.witches == 0)
        y += 24

      c.fillStyle = "rgb(0, 0, 0)"
      c.fillText("Familiars:", 10, y)
      $.each(planet.familiars, function(i, familiar)
      {
        c.fillStyle = familiar.witch.color()
        c.fillText(familiar.witch.name, 130, y)
        y += 24
      })

      var x = 20;
      var xw = this.xw - x * 2
      var yh = 40
      var self = this

      y = this.yh - 10

      $.each(require('state/panel').commands, function(i, command)
      {

        if (command.triggers.click == null)
        {
          command.set_trigger(new triggers.click({
            x: x   + self.frame_x,
            y: y   + self.frame_y - yh,
            xw: xw,
            yh: yh,
          }))
          warn(self, command)
        }

        if (command.active)
        {
          c.fillStyle = "rgba(64, 64, 192, 0.8)"
          c.strokeStyle = "rgba(64, 64, 192, 1)"
        } else {
          c.fillStyle = "rgba(64, 64, 64, 0.8)"
          c.strokeStyle = "rgba(64, 64, 64, 1)"
        }
        c.lineJoin = 'round'
        c.miterLimit = 30
        c.beginPath()
        c.rect(x, y - yh, xw, yh)
        c.closePath()
        c.fill()
        c.stroke()

        c.fillStyle = "rgba(0, 0, 0, 0.8)"
        c.fillText(command.action_name, 30, y - 10)

        y -= yh + 10
      })
    }

    return gfx;
  },
}));
