
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
  this.has("hope_karma", {
    is: "rw",
    default: 0,
  })
  this.has("fear_karma", {
    is: "rw",
    default: 0,
  })

  this.method("karma", function()
  {
    return this.hope_karma + this.fear_karma;
  });

})

module.exports = Planet
