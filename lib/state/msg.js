exports.msg_panel = runtime.add_layer('game.msgs', { });

exports.msg1 = ''
exports.msg2 = ''
exports.msg3 = ''

var cooler = new Cooldown("4s", function()
{
  exports.msg1 = ''
  exports.msg2 = ''
})

//exports.msg_panel.events.on("frame_logic", cooler);

exports.set_msg = function(msg1, msg2, msg3)
{
  if (msg1 != null)
    exports.msg1 = msg1 || ''
  if (msg2 != null)
    exports.msg2 = msg2 || ''
  if (msg3 != null)
    exports.msg3 = msg3 || ''
}
