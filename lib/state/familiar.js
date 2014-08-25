var stock_ai = {
  simple: function()
  {
    var rng = new lprng(null);
    return function()
    {
      var self = this
      var align = this.alignment >  1 ?  1
                : this.alignment < -1 ? -1
                :                        0

      $.each(this.planet.links, function(i, planet)
      {
        var karma = 0
        if (align != 0)
        {
          $.each(planet.familiars, function(i, familiar)
          {
            if (align < 0 && familiar.alginment > align)
              karma += familiar.witch.karma()
            if (align > 0 && familiar.alginment < align)
              karma += familiar.witch.karma()
          })
        }

        karma = planet.familiars_karma()

        if (karma > 0)
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

var low_water_dmg = 4

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

    if (this.witch.karma() <= 0)
      return

    this.ai.apply(this)
  })

  this.has("karma_adj", {
    is: "ro",
    default: function() { return { helped: false, dmg: 0, hope: 0, fear: 0, } },
  });

  var actions = {
    move: function()
    {
    },
    attack: function()
    {
      var def_karma = 0
      var defenders = []
      var self = this

      $.each(this.action_target.familiars, function(i, target)
      {
        if (target.witch.karma() == 0)
          return

        var defender = {
          f: target,
          def_karma: target.witch.karma(),
          is_def: target.action == 'defend' && target.action_target == self.planet,
        }

        if (target.action == 'defend_for' && this.action_target.familiars.length > 1)
        {
          defender.is_def = true
          defender.f.karma_adj.helped = true
        }

        if (defender.is_def)
        {
          defender.def_karma *= 2
        }

        defenders.push(defender)
        def_karma += defender.def_karma
      })

      if (defenders.length == 0)
        return

      var def = def_karma
      var atk = this.witch.karma()

      var dmg = atk - def

      if (dmg < -low_water_dmg)
      {
        dmg = Math.log(abs(dmg))
      }
      else if (dmg > 1)
      {
        dmg = Math.log(dmg) * 10
      }

      dmg = floor(abs(dmg))

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

      console.log(atk, def, dmg, this.witch.karma(), $.map(defenders, function(d){return d.f.witch.karma() }))
    },
    defend: function()
    {
    },
    attack_for: function()
    {
      var self = this
      $.each(this.planet.familiars, function(i, familiar)
      {
        if (familiar.action == 'attack')
        {
          self.karma_adj.helped = true
          self.action_target = familiar.action_target
          actions.attack.apply(self)
          return false;
        }
      })
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
    if (this.witch.karma() <= 0)
      return

    if (this.action != null)
      actions[this.action].apply(this)
  })

  var action_clear = {
    attack: function()
    {
      if (this.karma_adj.dmg > low_water_dmg)
      {
        this.witch.hope_adj += 2
      }
      else
      {
        this.witch.fear_adj += 1
      }
    },
    defend: function()
    {
      var total_dmg = this.karma_adj.hope + this.karma_adj.fear
      if (total_dmg > low_water_dmg)
      {
        this.witch.hope_adj += 2
      }
      else
      {
        this.witch.fear_adj += 1
      }
    },
    attack_for: function()
    {
      action_clear.attack.apply(this)
      var self = this
      $.each(this.planet.familiars, function(i, familiar)
      {
        if (familiar == self)
        {
          return
        }
        familiar.alignment += 0.1
      })
    },
    defend_for: function()
    {
      action_clear.defend.apply(this)
      if (this.karma_adj.helped)
      {
        var self = this
        $.each(this.planet.familiars, function(i, familiar)
        {
          if (familiar == self)
          {
            return
          }
          familiar.alignment += 0.1
        })
      }
    },
    move: function()
    {
      this.planet = this.action_target
    },
  }

  this.method("clear", function()
  {
    if (this.action != null)
      action_clear[this.action].apply(this)

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

    this.witch.hope_karma = max(0, floor(this.witch.hope_karma))
    this.witch.fear_karma = max(0, floor(this.witch.fear_karma))

    this.karma_adj.dmg  = 0
    this.karma_adj.hope = 0
    this.karma_adj.fear = 0

    this.action = null
    this.action_target = null
  })
})

Familiar.AIs = stock_ai
Familiar.low_water_dmg = low_water_dmg

module.exports = Familiar
