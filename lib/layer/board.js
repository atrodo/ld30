var board = require('state/board').board
var all_planets = require('state/board').planets
var Planet = require('state/planet')

board.add_animation(new Animation({
  frame_x: 0,
  frame_y: 0,
  xw: runtime.width - 300,
  yh: runtime.height - 80,
  get_gfx: function()
  {
    var self = this;
    var gfx = this.gfx

    gfx.reset()

    var c = gfx.context

    c.lineWidth = 3;

    var radius = 24
    var spacing = 50
    var xw = spacing
    var yh = spacing
    var lw = 3

    var planets = $.grep(all_planets, function(planet)
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
        return false;
      }
      return true;
    });

    var pos = function(i)
    {
      if (i instanceof Planet)
      {
        $.each(planets, function(j, planet)
        {
          if (planet.data.planet == i)
          {
            i = j
            return false;
          }
        })
      }

      return {
        x: spacing * floor((i % 5)) * 2 + spacing ,
        y: spacing * floor((i / 5)) * 2 + spacing ,
        i: i,
      }
    }

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

      var p = pos(i)
      if (planet.trigger.click == null)
      {
        var trigger_pos = {
          x: p.x - spacing /2,
          y: self.yh - p.y  - yh +100,
          xw: xw,
          yh: yh,
        }
        planet.set_trigger(new triggers.click(trigger_pos))

        /*
        var i = new Input({ layer: planet.layer })
        var a = new Action(function()
          {
            require('logic/main').logic.move_fc(planet.data.planet)
          })
        a.set_trigger(new triggers.dblclick(trigger_pos))
        i.add_action(a)
        */
      }
    });

    $.each(planets, function(i, planet)
    {
      if (planet.data.planet == null)
      {
        return;
      }

      planet = planet.data.planet
      var p = pos(i)
      $.each(planet.links, function(l, link)
      {
        var pl = pos(link)

        if (pl.i < i)
          return

        c.fillStyle = "hsl(" + ((planet.hue + link.hue) / 2) + ',100%,25%)'
        c.beginPath()
        c.moveTo(p.x, p.y);
        var d = abs(pl.x-p.x) > abs(pl.y-p.y)
        var xd = d ? 2 : 1
        var yd = d ? 1 : 2

        c.quadraticCurveTo(
          p.x+max((abs(pl.x-p.x) / xd), 50),
          p.y+max((abs(pl.y-p.y) / yd), 50),
          pl.x,
          pl.y
        )
        c.stroke();
      });

    });

    $.each(planets, function(i, planet)
    {
      if (planet.data.planet == null)
      {
        return;
      }

      planet = planet.data.planet
      var p = pos(i)

      c.fillStyle = "hsl(" + planet.hue + ',100%,25%)'
      c.beginPath()
      c.arc(p.x, p.y, radius, 0, 2 * Math.PI)
      c.closePath()
      c.fill();

      if (planet.witches.length > 0)
      {
        var arc = (2 * Math.PI) / planet.witches.length
        $.each(planet.witches, function(i, witch)
        {
          var lw = 1 + floor(Math.log2(witch.karma()))
          c.lineWidth = lw;
          c.strokeStyle = witch.color()
          c.beginPath()
          c.arc(p.x, p.y, radius - lw - 2, i * arc, (i+1) * arc)
          c.stroke();
        })
      }

      if (planet.familiars.length > 0)
      {
        var arc = (2 * Math.PI) / planet.familiars.length
        $.each(planet.familiars, function(i, familiar)
        {
          var lw = 1 + floor(Math.log2(familiar.witch.karma()))
          c.lineWidth = lw;
          c.strokeStyle = familiar.witch.color()
          c.beginPath()
          c.arc(p.x, p.y, radius, i * arc, (i+1) * arc)
          c.stroke();
        })
      }

      /*
      c.lineWidth = 1
      c.strokeStyle = 'black';
      c.beginPath()
      c.arc(p.x, p.y, radius - lw, 0, 2 * Math.PI)
      c.stroke();
      */
    });

    return gfx;
  },

}));
