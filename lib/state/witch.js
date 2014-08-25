var Familiar = require('state/familiar');

var Witch = Moo.class(function()
{
  var rng = new lprng(null);
  this.has("name", {
    is: "rw",
    required: true,
  })
  this.has("familiar", {
    is: "ro",
    default: function() { return new Familiar({witch: this}) },
  })
  this.has("planet", {
    is: "rw",
    required: true,
  })
  this.has("hope_karma", {
    is: "rw",
    default: 1,
  })
  this.has("fear_karma", {
    is: "rw",
    default: 1,
  })

  this.has("base_hope_karma", {
    is: "rw",
    default: 1,
    coerce: function(v) { this.hope_adj = 0; this.hope_karma = v; return v },
  })
  this.has("base_fear_karma", {
    is: "rw",
    default: 1,
    coerce: function(v) { this.fear_adj = 0; this.fear_karma = v; return v },
  })

  this.has("hope_adj", {
    is: "rw",
    default: 0,
  })
  this.has("fear_adj", {
    is: "rw",
    default: 0,
  })

  this.has("alignment", {
    is: "rw",
    default: 0,
  })

  this.has("hue", {
    is: "ro",
    default: function() { return floor(rng.random() % 360) },
  });

  this.method("color", function() {
    if (this.karma() <= 0)
      return 'hsl(0, 0%, 0%)'

    var s = make_between(Math.log2(this.karma()) * 10 + 15, 0, 100)
    var l = make_between((this.hope_karma / this.karma()) * 100, 20, 90)
    return "hsl("
      + this.hue + ','
      + floor(s) + '%,'
      + floor(l) + '%'
      + ")"
  })

  this.method("karma", function()
  {
    return this.hope_karma + this.fear_karma;
  });

  this.method("BUILD", function()
  {
    this.planet.witches.push(this)
    this.planet.witches.sort(function(a, b)
      {
        if (a.name > b.name)
          return 1;
        if (a.name < b.name)
          return 1;
        return 0;
      }
    )
    this.familiar.planet = this.planet
  });
})

module.exports = Witch
