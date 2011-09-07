framework.ui.button.attachEvent('ButtonClick', function(){
	framework.extension.getItem('show', function(show) {
		show = (show == '1' ? '0' : '1');
		framework.extension.setItem('show', show);
		framework.extension.fireEvent('switchImage', show);
	});	
});