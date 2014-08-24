var board = require('state/board').board
var planets = require('state/board').planets
var Planet = require('state/planet')

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

    c.lineWidth = 3;
    c.fillStyle = 'green';

    var radius = 12
    var spacing = radius * 2
    var xw = spacing
    var yh = spacing
    var lw = 3

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
        x: 30 * (((i + 1) % 2) | 0) * 2 + spacing ,
        y: 30 * (((i + 1) / 2) | 0) * 2 + spacing ,
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
      planet.set_trigger(new triggers.click({
        x: p.x - spacing /2,
        y: self.yh - p.y  - yh,
        xw: xw,
        yh: yh,
      }))
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

        c.beginPath()
        c.moveTo(p.x, p.y);
        c.lineTo(pl.x, pl.y)
        c.closePath()
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

      c.beginPath()
      c.arc(p.x, p.y, radius, 0, 2 * Math.PI)
      c.closePath()
      c.fill();

      if (planet.witches.length > 0)
      {
        var arc = (2 * Math.PI) / planet.witches.length
        $.each(planet.witches, function(i, witch)
        {
          c.strokeStyle = witch.color()
          c.beginPath()
          c.arc(p.x, p.y, radius - lw, i * arc, (i+1) * arc)
          c.stroke();
        })
      }

      if (planet.familiars.length > 0)
      {
        var arc = (2 * Math.PI) / planet.familiars.length
        $.each(planet.familiars, function(i, familiar)
        {
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
