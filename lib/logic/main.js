var Planet = require('state/planet')
var Witch = require('state/witch')
var Familiar = require('state/familiar')

var p0 = require('state/board').add_planet(new Planet({ name: '0' }));

var pcount = 25

for (var i = 1; i < pcount-1; i++)
{
  require('state/board').add_planet(new Planet({ name: i }));
}

var pZ = require('state/board').add_planet(new Planet({ name: 'Z' }));

var rng = new lprng(null);
var planets = $.map(require('state/board').planets, function(planet)
  {
    return planet.data.planet
  });


$.each(planets, function(i, planet)
{
  if (planet.links.length > 1)
    return
  var count = 1 + rng.random() % 2;

  for (var j = 1; j <= count; j++)
  {
    var pos = 0;
    if (rng.random() % 2)
      pos += 4 - rng.random() % 2
    pos += (rng.random() % 3)
    if (pos == 0)
      pos++

    if (i + pos < pcount)
    {
      planet.addLink(planets[i + pos])
    }
    else
    {
      planet.addLink(planets[i - pos])
    }
  }
});

[% WRAPPER scope %]

// Make sure the graph is strongly connected
var search = []
var stack = []

for (var i in planets)
{
  if (search[i] != null)
    continue

  stack.push(i)
  if (i > 0)
  {
    planets[i].addLink(planets[i-1])
  }

  while (stack.length > 0)
  {
    var pos = stack.shift()
    if (search[pos] != null)
      continue

    search[pos] = true
    var planet = planets[pos]
    for (var link in planet.links)
    {
      link = planet.links[link]
      var pos = $.inArray(link, planets)
      if (pos != -1)
        stack.push($.inArray(link, planets))
    }
  }
}

[% END %]

require('state/msg').set_msg(
  'The powerful witch Z has sent her familiar to destroy your witch Mao',
  'You are cornered and outpowered. If only there was more you could to save',
  'your best friend'
);

var mc = new Witch({ name: 'Mao', planet: p0 });
var Z = new Witch({ name: 'Z', planet: pZ });

Z.familiar.ai = require('state/familiar').AIs.simple()

mc.base_hope_karma = 30
mc.base_fear_karma = 10

Z.base_hope_karma = 30
Z.base_fear_karma = 120

Z.familiar.planet = mc.planet.links[0]

var fc = mc.familiar

var turns = []

exports.mc = mc
exports.fc = fc
exports.turns = turns
exports.turn = 30
exports.level = 1

exports.logic = {
  move_fc: function(planet)
  {
    fc.action = 'move'
    fc.action_target = planet
    end_turn()
  },
  attack: function(planet)
  {
    fc.action = 'attack'
    fc.action_target = planet
    end_turn()
  },
  defend: function(planet)
  {
    fc.action = 'defend'
    fc.action_target = planet
    end_turn()
  },
  attack_for: function(planet)
  {
    fc.action = 'attack_for'
    fc.action_target = planet
    end_turn()
  },
  defend_for: function(planet)
  {
    fc.action = 'defend_for'
    fc.action_target = planet
    end_turn()
  },
}

function end_turn()
{
  // Figure out the actions (AI)
  $.each(planets, function(i, planet)
  {
    $.each(planet.familiars, function(i, familiar)
    {
      if (familiar.ai != null)
        familiar.run_ai()
    })
  });


  // Do the actions
  $.each(planets, function(i, planet)
  {
    $.each(planet.familiars, function(i, familiar)
    {
      familiar.do_action()
    })
  });

  require('state/msg').set_msg("", "", "");

  if (fc.action == 'attack')
  {
    if (fc.karma_adj.dmg <= 0)
    {
      require('state/msg').set_msg(
        "",
        "Your attack was unsuccessful",
        ""
      );
    }
    else if (fc.karma_adj.dmg < familiar.low_water_dmg)
    {
      require('state/msg').set_msg(
        "",
        "your attack was successful, but the damage done was minimal",
        ""
      );
    } else {
      require('state/msg').set_msg(
        "",
        "Your attack was successful",
        ""
      );
    }
  }
  else if (fc.action == 'defend')
  {
    if (fc.karma_adj.hope > 0 || fc.karma_adj.fear > 0)
    {
      require('state/msg').set_msg(
        "",
        "Your successfully defended your position",
        ""
      );
    } else {
      require('state/msg').set_msg(
        "",
        "Your successfully defended against no one",
        ""
      );
    }
  }
  else if (fc.action == 'attack_for')
  {
    if (fc.karma_adj.helped)
    {
      require('state/msg').set_msg(
        "",
        "Your helped your fellow witch attack",
        ""
      );
    } else {
      require('state/msg').set_msg(
        "",
        "You didn't find anyone to help attack",
        ""
      );
    }
  }
  else if (fc.action == 'defend_for')
  {
    if (fc.karma_adj.helped)
    {
      require('state/msg').set_msg(
        "",
        "Your were able to help defend your fellow witch's position",
        ""
      );
    } else {
      require('state/msg').set_msg(
        "",
        "No one else was here to help you defend your position",
        ""
      );
    }
  }

  // Clear the actions
  $.each(planets, function(i, planet)
  {
    $.each(planet.familiars, function(i, familiar)
    {
      if (familiar != null)
        familiar.clear()
    })
  });

  // Take care of possible end-of-life
  [% WRAPPER scope %]
  if (mc.karma() == 0)
  {
    $.each(planets, function(i, planet)
    {
      $.each(planet.familiars, function(i, familiar)
      {
        var witch = familiar.witch
        familiar.planet = witch.planet;

        witch.base_hope_karma = witch.base_hope_karma + witch.hope_adj
        witch.base_fear_karma = witch.base_fear_karma + witch.fear_adj

        witch.hope_adj = 0
        witch.fear_adj = 0
      })
    });

    if (mc.karma() > 40)
    {
      var hope = floor(rng.random(7) + 3)
      var fear = 10 - hope

      if (rng.random(10) < 7 && mc.hope_karma > hope && mc.fear_karma > fear)
      {
        var r = floor(rng.random(8))
        var planet = planets[r]

        var w = new Witch({ name: require('state/names')(), planet: planet, })
        w.alignment = rng.random(1) + 0.75
        w.base_hope_karma = hope
        w.base_fear_karma = fear
        w.familiar.ai = require('state/familiar').AIs.simple()

        mc.base_hope_karma -= hope
        mc.base_fear_karma -= fear
      }
    }

    if (Z.karma() > 40)
    {
      var hope = floor(rng.random(6))
      var fear = 10 - hope

      if (rng.random(10) < 4 && mc.hope_karma > hope && mc.fear_karma > fear)
      {
        var planet = planets[pcount - floor(rng.random(8)) - 1]

        var w = new Witch({ name: require('state/names')(), planet: planet, })
        w.alignment = rng.random(1) - 1.75
        w.base_hope_karma = hope
        w.base_fear_karma = fear
        w.familiar.ai = require('state/familiar').AIs.simple()

        Z.base_hope_karma -= hope
        Z.base_fear_karma -= fear
      }
    }

    if (exports.level == 1)
    {
      require('state/msg').set_msg(
        "In the moments before Z's familiar defeats you, killing Mao, a mysterious cat",
        "comes to fulfill your wish. It offers to give the ablity to save your best friend.",
        "After agreeing, you find Mao and yourself 30 days earlier."
      );
    }
    else
    {
      require('state/msg').set_msg(
        "",
        "Time has reset itself again, going back " + exports.turn + " days",
        ""
      );
    }

    exports.level++
    exports.turn = 0

  }

  // Win
  if (Z.karma() == 0)
  {
  }
  [% END %]

  exports.turn++
}
