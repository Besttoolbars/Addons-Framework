var count = 0;
framework.ui.button.attachEvent('ButtonClick', function (e) {
	count++;
	if( (count%2) == 0) {
		framework.extension.fireEvent('ReloadPage', e);	
		return;
	}
	framework.extension.fireEvent('ButtonClicked', e);				
});
