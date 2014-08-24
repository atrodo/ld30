exports.panel = runtime.add_layer('game.panel', { });

exports.commands = new ActionGroup({
  layer: exports.panel,
  next: 'down',
  prev: 'up',
})

var command_actions = {
  goto_planet: new Action('Go To Planet', function()
  {
    var planet = require('state/board').current()
    if (planet == null)
      return
    require('logic/main').logic.move_fc(planet)
  }),
  attack: new Action('Attack Familiars', function()
  {
    var planet = require('state/board').current()
    if (planet == null)
      return
    require('logic/main').logic.attack(planet)
  }),
  defend: new Action('Defend from Familiars', function()
  {
    var planet = require('state/board').current()
    if (planet == null)
      return
    require('logic/main').logic.defend(planet)
  }),
  attack_for: new Action('Attack for Familiars', function()
  {
    var planet = require('state/board').current()
    if (planet == null)
      return
    require('logic/main').logic.attack_for(planet)
  }),
  defend_for: new Action('Defend for Familiars', function()
  {
    var planet = require('state/board').current()
    if (planet == null)
      return
    require('logic/main').logic.defend_for(planet)
  }),
}

exports.command_actions = command_actions

exports.commands.push(command_actions.goto_planet)
exports.commands.push(command_actions.attack)
exports.commands.push(command_actions.defend)
exports.commands.push(command_actions.attack_for)
exports.commands.push(command_actions.defend_for)
