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

    c.font = "32px Georgia Bold"
    c.fillStyle = "rgb(0, 0, 0)"
    c.fillText("Name:", 10, 30)

    if (require('state/board').current() != null)
    {
      var planet = require('state/board').current();
      c.fillText(planet.name, 110, 30)

      c.fillText("Witches:", 10, 68)
      var y = 68
      $.each(planet.witches, function(i, witch)
      {
        c.fillStyle = witch.color()
        c.fillText(witch.name, 110, y)
        y += 38
      })

      c.fillStyle = "rgb(0, 0, 0)"
      c.fillText("Familiars:", 10, y)
      $.each(planet.familiars, function(i, familiar)
      {
        c.fillStyle = familiar.witch.color()
        c.fillText(familiar.witch.name, 110, y)
        y += 38
      })

    }


    return gfx;
  },
}));
