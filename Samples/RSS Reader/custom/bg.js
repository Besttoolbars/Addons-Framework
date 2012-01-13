var iDelay = 60, //-- delay in seconds
    iUnreadedCount = 0,
    iRequestTimeout = 500,
    iRequestFailureCount = 0;
    
var REQUEST_TIMEOUT_MS_ = 30 * 1000; // 30 seconds
//var REQUEST_URL_ = 'http://habrahabr.ru/rss/';
//var REQUEST_URL_ = 'http://lenta.ru/rss/';

//var lastCountText = 'start';
var requestTimeout=10000;
var isSignedIn = false;
var list=[];
var requestsArray=[];
var requestInterval;

var bageText = 0;


softomate.extension.attachEvent("updateList",function(_list)
{
	list=_list;
	abortAllRequests();
	if (requestInterval) clearInterval(requestInterval);
	
	getChannelsData();
	requestInterval=setInterval(getChannelsData,requestTimeout);

});

    
function init() {
	softomate.extension.getItem("rssChannels", function(data) {
		//debugger;
		if (data != 'null' && data)
		{
			list = JSON.parse(data);
		}
		else
		{
			var obj={name:"",url:""};
			list.push(obj);
			softomate.extension.setItem("rssChannels", JSON.stringify(list))
		}
		getChannelsData();
		requestInterval=setInterval(getChannelsData,requestTimeout);
	});
	
}

// Marks news as read or unred
function markNews(oldData, newData) {
    var newItems = newData.items,
        oldItems = oldData.items,
        newItem,
        oldItem,
        numberOfUnreadItems = 0;
        
    //debugger;
    
    for (newItem in newItems) {
        if (newItems.hasOwnProperty(newItem)) {
            for (oldItem in oldItems) {
                if (oldItems.hasOwnProperty(oldItem)) {
                    newItems[newItem].read = false;
                    
                    if (newItems[newItem].link == oldItems[oldItem].link) {
                        newItems[newItem].read = oldItems[oldItem].read;
                    }
                }
            }
            
            if (newItems[newItem].read == false) {
                numberOfUnreadItems++;
            }
        }
    }
    
    return numberOfUnreadItems;
}

function getChannelsData()
{
    debugger;
    var oldList;
    
	softomate.extension.getItem("rssChannels", function(data) {
		if (data != 'null' && data)
		{
			oldList = JSON.parse(data);
		}
		else
		{
			var obj={name:"",url:""};
			oldList.push(obj);
			softomate.extension.setItem("rssChannels", JSON.stringify(oldList))
		}
	});

    bageText = 0;

    //var i = 0;
    for (var channel in list) {
        if (list.hasOwnProperty(channel)) {
            var oldChanelData;
            
            if (list[channel])
            {
                //debugger;
                
                for (var oldChannel in oldList) {
                    if (oldList.hasOwnProperty(oldChannel)) {
                        if (oldList[oldChannel].url == list[channel].url) {
                            oldChanelData = oldList[oldChannel].data;
                        }
                    }
                }
                
                //oldChanelData = JSON.parse(JSON.stringify(channel.data));
                
                sendChannelRequest(channel, function(data)
                {
                    //console.log(parseChannelData(data));
                    //debugger;
                    channel.data = parseChannelData(data);
                    
                    debugger;
                    bageText += markNews(oldChanelData, channel.data);
                    
                    softomate.extension.setItem("bageText", bageText);
                    
                    softomate.extension.setItem("rssChannels", JSON.stringify(list));
                });
            }	
        }
    }
    
	// $.each($(list), function(i, channel) {
        // var oldChanelData;
        
		// if (channel)
		// {
            //debugger;
            // oldChanelData = JSON.parse(JSON.stringify(channel.data));
            
			// sendChannelRequest(channel, function(data)
			// {
                //console.log(parseChannelData(data));
                //debugger;
				// channel.data = parseChannelData(data);
                
                // debugger;
                // bageText += markNews(oldChanelData, channel.data);
                
                // softomate.extension.setItem("bageText", bageText);
				
				// softomate.extension.setItem("rssChannels", JSON.stringify(list));
			// });
		// }		
	// });

    softomate.extension.getItem("bageText", function (d) {
        softomate.ui.button.setBadgeText(d);
        //window.alert(d);
    });
}

function parseChannelData(data)
{
	var xmlDoc = $.parseXML(data);
	$xml = $(xmlDoc);
	//console.log(xmlDoc);
    $channelElement = $xml.find("channel");
    $itemsElements = $xml.find("item");
	
	var channelData = {};
	channelData.link=$channelElement.find("link").eq(0).text();
	channelData.title=$channelElement.find("title").eq(0).text();
	
	channelData.items=[];
     
	$.each($itemsElements, function(i, xmlItem) {
		var item = {};
		
		item.link = $(xmlItem).find("link").eq(0).text();
		item.title = $(xmlItem).find("title").eq(0).text();
		item.description = $(xmlItem).find("description").eq(0).text();
		
		channelData.items.push(item);
    });
		
	return channelData;
}


function removeRequestFromArray(xmlhttp)
{
	for(var i=0; i<requestsArray.length;i++ )
	{ 
		if(requestsArray[i]==xmlhttp)
		{
			requestsArray.splice(i,1);
			delete xmlhttp;
		}
	} 
}

function abortAllRequests()
{
	for(var i=0; i<requestsArray.length;i++ )
	{ 
		if (requestsArray[i]) 
		{
			requestsArray[i].abort();
			delete requestsArray[i];
		}
	} 
	requestsArray=[];
}


function sendChannelRequest(channel,callback)
{
	var xmlhttp=softomate.extension.getRequest();
	  xmlhttp.open("GET", channel.url, true);
	  xmlhttp.onreadystatechange = function(data)
	  {
		if (xmlhttp.readyState == 4)
		{
			var status=xmlhttp.status;
			var response=xmlhttp.responseText;
			removeRequestFromArray(xmlhttp);
			if (status == 200)
			{
				callback(response);
			}
		}
	}   
	requestsArray.push(xmlhttp);
	xmlhttp.send(null);
}

init();
softomate.ui.button.setPopup({
    url:"popup.html",
    width:400,
    height:300
});

softomate.ui.button.attachEvent('ButtonClick', function () {
    softomate.extension.fireEvent("updateContent",{});
});

