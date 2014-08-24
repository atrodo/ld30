var stock_ai = {
  simple: function()
  {
    var rng = new lprng(null);
    return function()
    {
      var self = this
      $.each(this.planet.links, function(i, planet)
      {
        if (planet.familiars_karma() > 0)
        {
          self.action = 'attack';
          self.action_target = planet;
          return false;
        }
      })
      if (this.action == null)
      {
        this.action = 'move'
        this.action_target = rng.choose(this.planet.links)
      }
    }
  },
}

var Familiar = Moo.class(function()
{
  this.has("witch", {
    is: "ro",
    required: true,
  })

  this.has("planet", {
    is: "rw",
    default: null,
    coerce: function(new_planet)
    {
      if (this.planet != null)
        this.planet.rm_familiar(this)
      new_planet.add_familiar(this)
      return new_planet
    },
  })

  this.has("ai", {
    is: "rw",
    default: null,
  });
  this.method("run_ai", function()
  {
    if (this.ai == null)
      return

    this.ai.apply(this)
  })

  this.has("karma_adj", {
    is: "ro",
    default: function() { return { hope: 0, fear: 0, } },
  });

  var actions = {
    move: function()
    {
    },
    attack: function()
    {
      var def_karma = 0
      var defenders = []

      $.each(this.action_target.familiars, function(i, target)
      {
        var defender = {
          f: target,
          def_karma: target.witch.karma(),
          is_def: target.action == 'defend',
        }

        if (defender.is_def)
        {
          defender.def_karma *= 2
        }

        defenders.push(defender)
        def_karma += defender.def_karma
      })

      var def = Math.log2(def_karma) * 10
      var atk = Math.log(this.witch.karma()) * 10

      var dmg = atk - def

      if (dmg < -4)
      {
        dmg = Math.log(abs(dmg))
      }
      else if (dmg > 1)
      {
        dmg = Math.log(dmg)
      }

      dmg = abs(dmg)

      console.log(atk, def, dmg)

      $.each(defenders, function(i, defender)
      {
        var amt = dmg * ( defender.def_karma / def_karma)
        if (defender.is_def)
        {
          defender.f.karma_adj.fear -= amt
        }
        else
        {
          defender.f.karma_adj.hope -= amt
        }
      })

      console.log(require('state/board'))
    },
    defend: function()
    {
    },
    attack_for: function()
    {
    },
    defend_for: function()
    {
    },
  }

  this.has("action", {
    is: "rw",
    default: null,
    coerce: function(action)
    {
      if (action == null)
        return action;
      if (!(action in actions))
        die("No such action")
      return action
    },
  })
  this.has("action_target", {
    is: "rw",
    default: null,
  })

  this.method("do_action", function()
  {
    if (this.action != null)
      actions[this.action].apply(this)
  })

  this.method("clear", function()
  {
    if (this.action == 'move')
    {
      this.planet = this.action_target
    }

    this.witch.hope_karma += this.karma_adj.hope
    this.witch.fear_karma += this.karma_adj.fear

    if (this.witch.hope_karma < 0)
    {
      this.witch.fear_karma += this.witch.hope_karma
      this.witch.hope_karma = 0
    }

    if (this.witch.fear_karma < 0)
    {
      this.witch.hope_karma += this.witch.fear_karma
      this.witch.fear_karma = 0
    }

    this.witch.hope_karma = max(0, this.witch.hope_karma)
    this.witch.fear_karma = max(0, this.witch.fear_karma)

    this.karma_adj.hope = 0
    this.karma_adj.fear = 0

    this.action = null
    this.action_target = null
  })
})

Familiar.AIs = stock_ai

module.exports = Familiar
