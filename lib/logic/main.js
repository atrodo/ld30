var Planet = require('state/planet')
var Witch = require('state/witch')

var p1 = require('state/board').add_planet(new Planet({ name: '1' }));
var p2 = require('state/board').add_planet(new Planet({ name: '2' }));
var p3 = require('state/board').add_planet(new Planet({ name: '3' }));
var p4 = require('state/board').add_planet(new Planet({ name: '4' }));

var mc = new Witch({ name: 'mc', planet: p1 });

new Witch({ name: '1', planet: p1 });
new Witch({ name: '2', planet: p3 });

var Z = new Witch({ name: 'Z', planet: p4 });

mc.hope_karma = 30
Z.fear_karma = 100

p1.addLink(p2)
p3.addLink(p1)
p2.addLink(p4)

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
