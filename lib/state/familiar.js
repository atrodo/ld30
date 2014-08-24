
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
})

module.exports = Familiar

