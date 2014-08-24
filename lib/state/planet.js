var Familiar = require('state/familiar')

var Planet = Moo.class(function()
{
  var rng = new lprng(null);
  this.has("name", {
    is: "rw",
    required: true,
  })
  this.has("links", {
    is: "ro",
    default: function() { return [] },
  })

  this.has("witches", {
    is: "ro",
    default: function() { return [] },
  })

  this.has("familiars", {
    is: "ro",
    default: function() { return [] },
  })

  this.method("familiars_karma", function()
  {
    var result = 0;
    $.each(this.familiars, function(i, familiar)
    {
      result += familiar.witch.karma()
    })

    return result
  })

  this.method("addLink", function(other_planet)
  {
    if (!(other_planet instanceof Planet))
      throw("Cannot add links to anything but a planet")

    if (other_planet == this)
      return

    if ($.inArray(other_planet, this.links) == -1)
    {
      this.links.push(other_planet)
    }

    if ($.inArray(this, other_planet.links) == -1)
    {
      other_planet.links.push(this)
    }
  });

  this.method("add_familiar", function(familiar)
  {
    if (!(familiar instanceof Familiar))
      throw("Can only add Familiars")

    if ($.inArray(familiar, this.familiars) == -1)
    {
      this.familiars.push(familiar)
    }
  });

  this.method("rm_familiar", function(familiar)
  {
    if (!(familiar instanceof Familiar))
      throw("Can only remove Familiars")

    var i = $.inArray(familiar, this.familiars)
    if (i >= 0)
    {
      this.familiars[i] = null;
      condense_array(this.familiars)
    }
  });
})

module.exports = Planet
