var iDelay = 60, //-- delay in seconds
    iUnreadedCount = 0,
    iRequestTimeout = 500,
    iRequestFailureCount = 0;
    
var REQUEST_TIMEOUT_MS_ = 30 * 1000; // 30 seconds
//var REQUEST_URL_ = 'http://habrahabr.ru/rss/';
var REQUEST_URL_ = 'http://lenta.ru/rss/';

//var lastCountText = 'start';
var requestTimeout;
var isSignedIn = false;
    
function init() {
    startRequest();
    //softomate.ui.button.setBadgeBackgroundColor('#cc3c29');
}
softomate.extension.setItem('rssChannel', 'http://lenta.ru/rss/');

function startRequest(opt_noSchedule) {
    if (requestTimeout) {
        window.clearTimeout(requestTimeout);
    }
    requestTimeout = null;
    getUnreadCount(
        function(count, isMax) {
            updateUnreadCount(count, isMax);
            if (!opt_noSchedule) {
                scheduleRequest();
            }
        },
        function(opt_isSignedOut) {
            showSignedOut();
            if (!opt_noSchedule) {
                scheduleRequest(!opt_isSignedOut);
            }
        }
    );
}

function getUnreadCount(onSuccess, onError) {
    var xhr = new softomate.extension.getRequest();
    
    var abortTimerId = window.setTimeout(function() {
        xhr.onreadystatechange = null; // hack for Opera
        xhr.abort();
        onError();
    }, REQUEST_TIMEOUT_MS_);

    function handleSuccess(jsonText) {
        window.clearTimeout(abortTimerId);
        /*var json;
        try {
            json = JSON.parse(xhr.responseText)
        } catch (e) {
            console.log('JSON parse exception: ' + e);
            handleError();
            return;
        }*/
        
        // Find the reading list unread count
        /*for (var i = 0, stream; stream = json.unreadcounts[i]; i++) {
            if (READING_LIST_RE_.test(stream.id)) {
                onSuccess(stream.count, stream.count >= json.max);
                return;
            }
        }*/
        xmlDoc = $.parseXML(xhr.responseText);
        
        onSuccess(storeStream(xmlDoc), false);
        
        // Fallthrough: we couldn't find the reading list unread count, assume it's
        // 0 (items with a 0 unread count are not output)
        //onSuccess(0, false);
    }
    function handleError(opt_isSignedOut) {
        window.clearTimeout(abortTimerId);
        onError(opt_isSignedOut);
    }

    try{
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4)
                return

            if (xhr.status >= 400) {
                softomate.extension.log('Error response code: ' + xhr.status + '/' + xhr.statusText);
                handleError(xhr.status == 401);
            } else if (xhr.responseText) {
                softomate.extension.log('responseText: ' + xhr.responseText.substring(0, 200) + '...');
                handleSuccess(xhr.responseText);
            } else {
                softomate.extension.log('No responseText!');
                handleError();
            }
        }
        xhr.onerror = function(error) {
            softomate.extension.log('XHR error\n' + error);
            handleError();
        }
        xhr.open("GET", REQUEST_URL_, true)
        xhr.send(null)
    } catch(e) {
        softomate.extension.log('XHR exception: ' + e);
        handleError();
    }
}
function updateUnreadCount(count, isMax) {
    //setIcon(getSignInIcon());
    //setBadgeBackgroundColor(getSignInBadgeColor());
    isSignedIn = true;

    // show '999+' instead of '1000+' as it doesn't fit the badge
    if(count > 999) {
        count = 999;
        isMax = true;
    }
    
    // add '+' if # unread items exceeds max
    var countText = '';
    if (count > 0) {
        countText = count + (isMax ? '+' : '');
    }

    // do nothing if same
    //if (countText == lastCountText) {
    //  return;
    //}

    //lastCountText = countText;

    softomate.ui.button.setBadgeText(countText);
}
function showSignedOut(opt_noError) {
    isSignedIn = false;
    //setIcon(getSignOutIcon());
    //setBadgeBackgroundColor(getSignOutBadgeColor());

    lastCountText = (opt_noError) ? '' : '?';
    softomate.ui.button.setBadgeText(lastCountText);
}
function scheduleRequest(opt_rapidRequest) {
    if (requestTimeout) {
        window.clearInterval(requestTimeout);
    }

    var interval = 10000;
    // Refresh more often if the previous request ended with error,
    // so that we can pick up the unread count faster
    if (opt_rapidRequest) {
        interval *= .1;
    }
    softomate.extension.log('scheduling request in ' + interval + 'ms');
    requestTimeout = window.setTimeout(startRequest, interval);
}
function storeStream(xmlDoc) {
    var count = 0;
    softomate.extension.getItem('db', function(val) {
        //softomate.extension.log("val = " + val);
        if (!val) {
            db = {};
            db.channel = {};
            db.unreadCount = 0;
        }
        else {
            try {
                db = JSON.parse(val);
            } catch(e) {
                softomate.extension.setItem('db', '');
                return;
            }
        }
		
        $xml = $(xmlDoc);
        $channel = $xml.find("channel");
        $items = $xml.find("item");
        var channelLink = $channel.find("link").eq(0).text();
		
        
        var newDb = {};
        newDb.channel = {};
        newDb.channel[channelLink] = {};
		newDb.channel[channelLink].title = $channel.find("title").eq(0).text();
		newDb.channel[channelLink].items = [];
		newDb.unreadCount = 0;
        $.each($items, function(i, xmlItem) {
            var link = $(xmlItem).find("link").eq(0).text();
			var item = {};
			item.link = link;
			item.title = $(xmlItem).find("title").eq(0).text();
			item.description = $(xmlItem).find("description").eq(0).text();
            newDb.channel[channelLink].items.push(item);
        });
		
        softomate.extension.log(newDb);
		softomate.extension.log("db.channel[channelLink] =  " + db.channel[channelLink]);
		if (db.channel[channelLink]) {
			
			for(var i in newDb.channel[channelLink].items) {
				newDb.channel[channelLink].items[i].read = '0';
				for(var x in db.channel[channelLink].items) {
					if (newDb.channel[channelLink].items[i].link == db.channel[channelLink].items[x].link) {
						newDb.channel[channelLink].items[i].read = db.channel[channelLink].items[x].read;
					}
				}
			}       
		}
		for(var channelLink in newDb.channel) {
            for(var i in newDb.channel[channelLink].items) {
                if (newDb.channel[channelLink].items[i].read =='0')
                    newDb.unreadCount ++;
            }
        }
        count = newDb.unreadCount;
        softomate.extension.setItem('db', JSON.stringify(newDb));	

    });
    softomate.extension.log(count);
    return count;
}
init();
softomate.ui.button.setPopup({
    url:"popup.html",
    width:400,
    height:300
});