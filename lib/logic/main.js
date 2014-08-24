var Planet = require('state/planet')
var Witch = require('state/witch')

var p0 = require('state/board').add_planet(new Planet({ name: '0' }));

var pcount = 20

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

var mc = new Witch({ name: 'mc', planet: p0 });
var Z = new Witch({ name: 'Z', planet: pZ });

Z.familiar.ai = require('state/familiar').AIs.simple()

mc.hope_karma = 30
Z.fear_karma = 100

var fc = mc.familiar

var turns = []

exports.mc = mc
exports.fc = fc
exports.turns = turns
exports.turn = 1

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
  var planets = require('state/board').planets

  // Figure out the actions (AI)
  $.each(planets, function(i, planet)
  {
    planet = planet.data.planet
    if (planet == null)
      return
    $.each(planet.familiars, function(i, familiar)
    {
      if (familiar.ai != null)
        familiar.run_ai()
    })
  });


  // Do the actions
  $.each(planets, function(i, planet)
  {
    planet = planet.data.planet
    if (planet == null)
      return
    $.each(planet.familiars, function(i, familiar)
    {
      familiar.do_action()
    })
  });

  // Clear the actions
  $.each(planets, function(i, planet)
  {
    planet = planet.data.planet
    if (planet == null)
      return
    $.each(planet.familiars, function(i, familiar)
    {
      if (familiar != null)
        familiar.clear()
    })
  });
  exports.turn++
}
