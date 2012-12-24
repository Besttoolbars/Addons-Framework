framework.extension.attachEvent('setPopup', function (obj) {
    framework.ui.button.setPopup(obj.data);
});

framework.extension.attachEvent('setBadgeText', function (obj) {
    framework.ui.button.setBadgeText(obj.data);
});


var $RSS = function(){};

$RSS.prototype.init = function(options)
{
    this.list = [];
    this.countNews = 0;
    this.requestTimeout = options.requestTimeout;

    this.timeOut = null;

    var self = this;

    framework.extension.getItem("rssChannels", function(data) {
        if(data && data != '[]') {
            self.list = JSON.parse(data)
        } else {
            var obj = {name:"CNN", url:"http://rss.cnn.com/rss/edition_world.rss"};

            self.list.push(obj);
            framework.extension.setItem("rssChannels", JSON.stringify(self.list))
        }
    });

    this.getChannelsData();
};

$RSS.prototype.markNews = function(oldData, newData)
{
    var newItems = newData.items,
        oldItems = oldData && oldData.items != undefined ? oldData.items : [],
        numberOfUnreadItems = 0;

        $.each(newItems, function(new_i, new_item){
            newItems[new_i].read = false;
            $.each(oldItems, function(old_i, old_item){


                if(newItems[new_i].link == old_item.link){
                    newItems[new_i].read = old_item.read ? true : false;
                }
            });

            if (!newItems[new_i].read)
                { numberOfUnreadItems++; }
        });

    return numberOfUnreadItems;
};

$RSS.prototype.parseChannelData = function (data){
    var xmlDoc = $.parseXML(data);
    var $xml = $(xmlDoc);
    var $channelElement = $xml.find("channel");
    var $itemsElements = $xml.find("item");

    var channelData = {};

    channelData.link = $channelElement.find("link").eq(0).text();
    channelData.title = $channelElement.find("title").eq(0).text();

    channelData.items = [];

    $.each($itemsElements, function(i, xmlItem) {
        var item = {};

        item.link = $(xmlItem).find("link").eq(0).text();
        item.title = $(xmlItem).find("title").eq(0).text();
        item.description = $(xmlItem).find("description").eq(0).text();

        channelData.items.push(item);
    });

    return channelData;
};

$RSS.prototype._request = function(channel, callback)
{
    var request = framework.extension.getRequest();

    request.open("GET", channel.url, true);

    request.onreadystatechange = function(){
        if (request.readyState == 4){
            var status = request.status;
            if (status == 200){
                callback(request.responseText);
            }
        }
    };

    request.send(null);
};

$RSS.prototype.getChannelsData = function()
{
    clearTimeout(this.timeOut);

    var self = this;
    var oldList = [];

    self.countNews = 0;

    framework.extension.getItem("rssChannels", function(data) {
        if(data && data != '[]') {
            oldList = JSON.parse(data)
        } else {
            var obj = {name:"CNN", url:"http://rss.cnn.com/rss/edition_world.rss"};

            oldList.push(obj);
            framework.extension.setItem("rssChannels", JSON.stringify(self.list))
        }
    });

   $.each(self.list, function(i, channel){
      self._request(channel, function(data){

           self.list[i].data = self.parseChannelData(data);

           for (var oldChannel in oldList) {
              if (oldList.hasOwnProperty(oldChannel)) {
                  if (oldList[oldChannel].url == channel.url) {
                      var oldChanelData = oldList[oldChannel].data;
                  }
              }
           }

           self.countNews += self.markNews(oldChanelData, self.list[i].data);
           framework.extension.setItem("rssChannels", JSON.stringify(self.list));
           framework.extension.setItem("bageText", self.countNews);
           framework.ui.button.setBadgeText(self.countNews);
      });
   });

    framework.extension.getItem("bageText", function (d) {
        d && framework.ui.button.setBadgeText(d);
    });

    framework.extension.getItem("popUpHeight", function (h) {
        framework.extension.getItem("popUpWidth", function (w) {
            framework.ui.button.setPopup({
                "url": "popup.html",
                "width": w || 500,
                "height": h || 400
            })
        });
    });

    self.timeOut = setTimeout(function(){
       self.getChannelsData();
   }, self.requestTimeout * 1000);

};


var RSS = new $RSS();
    RSS.init({requestTimeout : 10});

    framework.ui.button.attachEvent('ButtonClick', function () {
        framework.extension.fireEvent("updateContent",{});
    });

    framework.extension.attachEvent("updateList",function(e)
    {
        RSS.list = e.data;
        RSS.getChannelsData();
    });