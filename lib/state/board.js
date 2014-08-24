var Planet = require('state/planet');
var board = runtime.add_layer('game.board', { });

var planets = []
var current = null

var set_curent = function(new_current)
{
  current = new_current
  if (current instanceof Planet)
  {
    var command_actions = require('state/panel').command_actions
    var fc = require('logic/main').fc;

    var on_planet = ['attack_for','defend_for']

    for (var action in command_actions)
    {
      command_actions[action].deactivate()

      if ($.inArray(action, on_planet) == -1)
      {
        $.each(current.links, function(i, link_planet)
        {
          if ($.inArray(fc, link_planet.familiars) != -1)
          {
            command_actions[action].activate()
            return false;
          }
        })
      }
      else
      {
        var found = false
        $.each(current.familiars, function(i, familiar)
        {
          if (familiar == fc)
          {
            found = true
            return false
          }
        })
        if (found)
        {
          command_actions[action].activate()
        }
      }
    }
  }
}

var ag = new ActionGroup({
  layer: board,
  next: 'tab',
  prev: 'shift+tab',
})

ag.push(new Action('', function()
  {
    set_curent(null)
  })
);

exports.board = board
exports.planets = ag
exports.current = function() { return current };

exports.add_planet = function(new_planet)
{
  if (!(new_planet instanceof Planet))
    die("Can only add a Planet");
  
  ag.push(new Action({
      name: new_planet.name,
      handler: function()
      {
        set_curent(new_planet)
      },
      data: { planet: new_planet },
    })
  );

  planets.push(new_planet);
  
  return new_planet;
}


