var iDelay = 60, //-- delay in seconds
    iUnreadedCount = 0,
    iRequestTimeout = 500,
    iRequestFailureCount = 0;
    
var REQUEST_TIMEOUT_MS_ = 30 * 1000; // 30 seconds
//var REQUEST_URL_ = 'http://habrahabr.ru/rss/';
//var REQUEST_URL_ = 'http://lenta.ru/rss/';

//var lastCountText = 'start';
var requestTimeout=30000;
var isSignedIn = false;
var list=[];
var requestsArray=[];
var requestInterval;



framework.extension.attachEvent("updateList",function(_list) {
	list=_list;
	abortAllRequests();
	if (requestInterval) clearInterval(requestInterval);
	
	getChannelsData();
	requestInterval=setInterval(getChannelsData,requestTimeout);

});
    
function init() {
	framework.extension.getItem("rssChannels", function(data) {
		if (data) {
			list = JSON.parse(data);
		}
		else {
			var obj={name:"",url:""};
			list.push(obj);
			framework.extension.setItem("rssChannels", JSON.stringify(list))
		}
		getChannelsData();
		requestInterval = setInterval(getChannelsData,requestTimeout);
	});
}

function getChannelsData(){
	$.each($(list), function(i, channel) {
		
		if (channel) {
			sendChannelRequest(channel, function(data){
				console.log(parseChannelData(data));
				channel.data = parseChannelData(data);
				
				framework.extension.setItem("rssChannels", JSON.stringify(list));
			});
		}		
	});
}

function parseChannelData(data) {
	var xmlDoc = $.parseXML(data);
	$xml = $(xmlDoc);
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


function removeRequestFromArray(xmlhttp) {
	for(var i=0; i<requestsArray.length;i++ ) { 
		if(requestsArray[i]==xmlhttp)
		{
			requestsArray.splice(i,1);
			delete xmlhttp;
		}
	} 
}

function abortAllRequests() {
	for(var i=0; i<requestsArray.length;i++ ) { 
		if (requestsArray[i]) {
			requestsArray[i].abort();
			delete requestsArray[i];
		}
	} 
	requestsArray=[];
}


function sendChannelRequest(channel,callback) {
	var xmlhttp = framework.extension.getRequest();
	xmlhttp.open("GET", channel.url, true);
	xmlhttp.onreadystatechange = function(data) {
		if (xmlhttp.readyState == 4) {
			var status=xmlhttp.status;
			var response=xmlhttp.responseText;
			removeRequestFromArray(xmlhttp);
			if (status == 200) {
				callback(response);
			}
		}
	}   
	requestsArray.push(xmlhttp);
	xmlhttp.send(null);
}

init();
framework.ui.button.setPopup({
    url:"popup.html",
    width:400,
    height:300
});

framework.ui.button.attachEvent('ButtonClick', function () {
    framework.extension.fireEvent("updateContent",{});
});

