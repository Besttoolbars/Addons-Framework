var iDelay = 60, //-- delay in seconds
	iUnreadedCount = 0,
	iRequestTimeout = 500,
	iRequestFailureCount = 0;

function init() {
	startRequest();
	framework.ui.button.setBadgeBackgroundColor('#cc3c29');
	framework.ui.button.attachEvent('ButtonClick', function() {
		setTimeout(function() {
			goToInbox();
		}, 1);
	});
}

function scheduleRequest() {
	delay = iDelay*1000;
	window.setTimeout(startRequest, delay);
}

function startRequest() {
	getInboxCount( function(count) {
			updateUnreadCount(count);
			scheduleRequest();
		},function() {
			showLoggedOut();
			scheduleRequest();
		}
	);
}

function getInboxCount(onSuccess, onError) {
	var xhr = framework.extension.getRequest(),
	abortTimerId = window.setTimeout(function() {
		xhr.abort();  // synchronously calls onreadystatechange
	}, iRequestTimeout);

	function handleSuccess(count) {
		iRequestFailureCount = 0;
		window.clearTimeout(abortTimerId);
		if (onSuccess)
			onSuccess(count);
	}
	function handleError() {
		++iRequestFailureCount;
		window.clearTimeout(abortTimerId);
		if (onError)
			onError();
	}

	xhr.onreadystatechange = function(){
		if (xhr.readyState != 4)
			return;
		if (xhr.status == 404){
			handleError();
			return;
		}
		if (xhr.responseText) {
			//var match = /['"]a-za-Tf['"],['"]300['"], ([0-9]+).0/i.exec(xhr.responseText);
			var match = /['"],['"]300['"], ([0-9]+).0/i.exec(xhr.responseText);
			if(null != match){
				handleSuccess(match[1]);
			}
			return;
		}
		handleError();
	}

	if ('undefined' !== typeof (xhr.onerror)) {
		xhr.onerror = function(error) {
			handleError();
		}
	}
	xhr.open('GET', 'https://plus.google.com/u/0/_/notifications/frame', true);
	xhr.send(null);
}

function updateUnreadCount(count) {
	framework.ui.button.setIcon('gplus_16.png');
	framework.ui.button.setBadgeText(count);
}

function showLoggedOut() {
	iUnreadedCount = 0;
	framework.ui.button.setBadgeText('');
	framework.ui.button.setIcon('gplus_16_off.png');
}

function goToInbox() {
	framework.browser.navigate({
		'url': 'https://plus.google.com/',
		tabId: null
	});
}


init();
