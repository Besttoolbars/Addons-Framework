framework.ui.button.attachEvent('ButtonClick', function(e){
	framework.extension.fireEvent('AddWord', e);
});

framework.extension.attachEvent('updateBadge', function(e){
	framework.ui.button.setBadgeText(e);
});