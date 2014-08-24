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
