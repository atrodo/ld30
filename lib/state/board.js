var Planet = require('state/planet');
var board = runtime.add_layer('game.board', { });

var planets = []
var current = null

var ag = new ActionGroup({
  layer: board,
  next: 'tab',
  prev: 'shift+tab',
})

ag.push(new Action('', function()
  {
    current = null
        warn(ag, arguments)
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
        current = new_planet
        warn(current)
      },
      data: { planet: new_planet },
    })
  );

  planets.push(new_planet);
  return new_planet;
}


