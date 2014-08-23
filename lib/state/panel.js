exports.panel = runtime.add_layer('game.panel', { });

exports.tabs = new ActionGroup({
  layer: exports.panel,
  next: 'down',
  prev: 'up',
})

exports.tabs.push(new Action("Goto"));

exports.clear_tabs = function()
{
  runtime.deactivate_group('tabs');
  $.each(exports.tabs, function(i, tab)
  {
    if ('layer' in tab.data)
      tab.data.layer.deactivate();
  })

  exports.tabs.length = 0
  return exports.tabs
}
