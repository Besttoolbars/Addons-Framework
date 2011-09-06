var iDelay = 60, //-- delay in seconds
	iUnreadedCount = 0,
	iRequestTimeout = 1000,
	iRequestFailureCount = 0,
	unreadCountUrl = "https://plus.google.com/u/0/_/notifications/getunreadcount?inWidget=true&rt=j";
var DEBUG = false;

function log(str) {
	if (DEBUG)
		framework.extension.log(str);
}
function init() {
	startRequest();
	framework.ui.button.setBadgeBackgroundColor('#cc3c29');
	framework.ui.button.attachEvent('ButtonClick', function () {
		goToInbox();
	});
}

function scheduleRequest() {
	delay = iDelay * 1000;
	window.setTimeout(startRequest, delay);
}

function startRequest() {
	log('startRequest');
	getInboxCount( function(count) {
		log(count);
		updateUnreadCount(count);
		scheduleRequest();
	},function() {
		showLoggedOut();
		scheduleRequest();
	});
}

function getInboxCount(onSuccess, onError) {
	log('getInboxCount');
	var xhr = new XMLHttpRequest(),
	abortTimerId = window.setTimeout(function() {
		xhr.abort();  // synchronously calls onreadystatechange
	}, iRequestTimeout);

	function handleSuccess(count) {
		log('handleSuccess');
		iRequestFailureCount = 0;
		window.clearTimeout(abortTimerId);
		if (onSuccess)
			onSuccess(count);
	}
	function handleError() {
		log('handleError');
		++iRequestFailureCount;
		window.clearTimeout(abortTimerId);
		if (onError)
			onError();
	}

	xhr.onreadystatechange = function() {
		log('onreadystatechange');
		log(xhr);
		if (xhr.readyState != 4)
			return;
		if (xhr.status == 404) {
			handleError();
			return;
		}
		if (xhr.status == 200 && xhr.responseText) {
			var text = xhr.responseText;
			log(text);
			var firstComma = text.indexOf(',', 5);
			var secondComma = text.indexOf(',', firstComma + 1);
			var thridComma = text.indexOf(',', secondComma + 1);
			var countStr = text.substring(firstComma + 1, secondComma);
			var loginStatus = text.substring(secondComma + 1, thridComma);
			if (loginStatus == '"LOGIN REQUIRED"') {
				log(loginStatus);
				handleError();
			} else {
				handleSuccess(countStr);
			}
			return;
		}
		handleError();
	}

	xhr.onerror = function(error) {
		handleError();
	}
	xhr.open('GET', unreadCountUrl, true);
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
		'url': 'https://plus.google.com/'
	});
}

init();
