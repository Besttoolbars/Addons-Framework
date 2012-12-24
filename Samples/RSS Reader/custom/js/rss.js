
var $channelTabs;

var widthValue = 500,
    heightValue = 300;

function DataManager(data) {
    var self = this;
    //var rssChannels=data;
    var rssChannels = JSON.parse(data);

    this.getContentByIndex = function (index) {
        return rssChannels[index].data;
    }

    this.getRssChannels = function () {
        return rssChannels;
    }

}


function ChannelTabs() {

    var self = this;
    var tableConstructor = new TableConstructor();
    var channelTabsCounter = 0;
    var rssChannels;
    var dataManager;

    this.initChannelTabs = function (_dataManager) {

        dataManager = _dataManager;
        if ($channelTabs) $channelTabs.tabs('destroy');


        rssChannels = dataManager.getRssChannels();

        if (!rssChannels) return;

        $channelTabs = $("#channelTabs").tabs({
            add:function (event, ui) {

                var tab_content = getTabContentByIndex(ui.index);

                ///////////////////////////////////////////////////////////////////////////////////////
                //$( ui.panel ).height(heightValue);

                //console.log($(document).height()-$(".ui-tabs-nav").height());

                //$( ui.panel ).height($(document).height()-$(".ui-tabs-nav").height()-parseInt($( ui.panel ).css("padding-bottom")) - parseInt($( ui.panel ).css("padding-top"))-9);
                $(ui.panel).append(tab_content);


            }
        });

        $.each($(rssChannels), function (i, rssChannel) {
            if (rssChannel) {
                var name = rssChannel.name == "" ? "Empty Name" : rssChannel.name;
                $channelTabs.tabs("add", "#tabs-" + channelTabsCounter, name);
                channelTabsCounter++;
            }
        });
        //		$channelTabs.tabs( 'destroy' );
    }

    function drawNewsTable() {
        var $table = tableConstructor.createTable();
        $table.attr({
            "cellspacing":0,
            "cellpadding":0
        }).css({
                    //width : "100%",
                    //height: "100%"
                });
        var $tr = tableConstructor.addRow($table);
        var $td = tableConstructor.addCell($tr);
        var $mainDiv = $("<div/>");
        $mainDiv.addClass("mainNewsDiv");

        var $contentDiv = $("<div>");
        $contentDiv.addClass("contentNewsDiv");

        var $contentTable = tableConstructor.createTable();
        $contentTable.addClass("contentNewsTable");

        var $titleRow = tableConstructor.addRow($contentTable);
        $titleRow.addClass("titleNewsRow");

        var $titleCell = tableConstructor.addCell($titleRow);
        $titleCell.addClass("titleNewsCell");

        var $contentRow = tableConstructor.addRow($contentTable);
        $contentRow.addClass("contentNewsRow");

        var $contentCell = tableConstructor.addCell($contentRow);
        $contentCell.addClass("contentNewsCell");

        $contentDiv.append($contentTable);

        $innerContentDiv = $("<div>");
        $innerContentDiv.addClass("innerContentNewsDiv");
        $innerContentDiv.width(widthValue - 36);

        $contentCell.append($innerContentDiv);

        var $buttonTable = tableConstructor.createTable();
        $buttonTable.addClass("buttonNewsTable");

        var $buttonRow = tableConstructor.addRow($buttonTable);
        var $prevButtonCell = tableConstructor.addCell($buttonRow);
        var $nextButtonCell = tableConstructor.addCell($buttonRow);

        $nextButtonCell.addClass("nextButtonNewsCell");

        var $prevButtonImg = $("<div />").addClass("next");
        var $nextButtonImg = $("<div />").addClass("prev");

        $prevButtonCell.append($prevButtonImg);
        $nextButtonCell.append($nextButtonImg);

        $mainDiv.append($contentDiv);
        $mainDiv.append($buttonTable);
        $td.append($mainDiv);
        //$td.append($buttonTable);

        //console.log($table);
        var result = {
            "mainContainer":$table,
            "contentTable":$contentTable,
            "prevButtonImg":$prevButtonImg,
            "nextButtonImg":$nextButtonImg,
            "titleContainer":$titleCell,
            "contentContainer":$innerContentDiv
        };


        return result;
    }

    // fill content of current News
    // titleContainer - html element that contains title of News
    // contentContainer -  html element that contains content of News
    function fillContent(newsContainer, contentItem) {
        var title = contentItem.title;

        //debugger;
        $(newsContainer.contentContainer).html(contentItem.description);

        if (contentItem.read == false) {
            title += ' *';
        }

        $(newsContainer.titleContainer).html(title);
    }

    // bind redirect event to news page
    // object - item that catch click event
    // url - url to redirect
    function bindNewsRedirect(object, url) {
        $(object).unbind();
        $(object).bind("click", function () {
            framework.browser.navigate({url:url, tabId:null});
        });
    }


    // switch news
    // directionHide - direction where hide News
    // directionShow - direction where Show News
    function switchNews(newsContainer, contentItem, directionHide, directionShow, speed) {
        $(newsContainer.contentTable).hide("slide", { direction:directionHide }, speed);
        fillContent(newsContainer, contentItem);
        bindNewsRedirect(newsContainer.titleContainer, contentItem.link);
        $(newsContainer.contentTable).show("slide", { direction:directionShow }, speed);
    }

    function generateLayout(index) {
        var newsContainer = drawNewsTable();
        var i = 0;
        $(newsContainer.prevButtonImg).bind("click", function () {
            var content = dataManager.getContentByIndex(index);
            if (content) {
                if (i > 0) i--; else return;
                switchNews(newsContainer, content.items[i], "right", "left", 100);
            }
        });

        $(newsContainer.nextButtonImg).bind("click", function () {
            var content = dataManager.getContentByIndex(index);

            if (content) {
                if (i != content.items.length - 1) i++; else return;

                switchNews(newsContainer, content.items[i], "left", "right", 100);

                content.items[i - 1].read = true;
                framework.extension.getItem("bageText", function (d) {
                    var newValue = parseInt(d) - 1;

                    framework.extension.fireEvent('setBadgeText', {data: newValue});
                    framework.extension.setItem("bageText", newValue);

                    framework.extension.getItem("rssChannels", function (chanels) {
                        var chanel;

                        try {
                            chanels = JSON.parse(chanels);
                        } catch (e) {

                        }

                        for (chanel in chanels) {
                            if (chanels.hasOwnProperty(chanel)) {
                                //debugger;
                                if (chanels[chanel].data &&
                                        chanels[chanel].data.link == content.link &&
                                        chanels[chanel].data.title == content.title) {

                                    //debugger;
                                    for (var item in chanels[chanel].data.items) {
                                        if (chanels[chanel].data.items.hasOwnProperty(item)) {
                                            //debugger;
                                            chanels[chanel].data.items[item].read = content.items[item].read;
                                        }
                                    }
                                    //chanels[chanel].data = content;

                                    //debugger;
                                }
                            }
                        }

                        framework.extension.setItem("rssChannels", JSON.stringify(chanels));
                        //     console.log(chanels);
                        //debugger;
                    });

                });
            }
        });

        var content = dataManager.getContentByIndex(index);
        if (content) {
            if (content.items.length > 0) {
                fillContent(newsContainer, content.items[0]);
                bindNewsRedirect(newsContainer.titleContainer, content.items[0].link);
            }
        }

        return newsContainer.mainContainer;
    }

    function getTabContentByIndex(index) {
        return generateLayout(index);
    }

}


function onLoad() {
    //initChannelTabs();
    //framework.extension.detachEvent("updateContent",initChannelTabs);
    //framework.extension.attachEvent("updateContent",initChannelTabs);
}

setTimeout(function () {
    $(document).ready(function () {
        framework.extension.getItem('popUpWidth', function (val) {
            if (!val) {
                framework.extension.setItem('popUpWidth', widthValue);
            } else {
                widthValue = parseInt(val);
            }
            document.getElementById('channelTabs').style.width = widthValue + 'px';
        });

        framework.extension.getItem('popUpHeight', function (val) {
            if (!val) {
                framework.extension.setItem('popUpHeight', heightValue);
            } else {
                heightValue = parseInt(val);
            }
            $('.innerContentNewsDiv').css({height:(heightValue - 100) + 'px' });
        });

        var prH = 58;
        var prW = 4;

        if ($.browser.opera) {
            prH = 38;
            prW = -6;
        }
        else if ($.browser.mozilla) {
            prH = 60;
            prW = 4;
        }

        $('a.settings').click(function(){
            framework.browser.navigate({
                url: "options_page.html",
                tabId: framework.browser.NEWTAB
            });
        });
        
        var channelTabs = new ChannelTabs();
        var dataManager;

        function initRssWidget() {
            framework.extension.getItem("rssChannels", function (data) {
                var channelTabs = new ChannelTabs();
                dataManager = new DataManager(data);
                channelTabs.initChannelTabs(dataManager);
            });
        }


        framework.extension.detachEvent("updateContent", initRssWidget);
        framework.extension.attachEvent("updateContent", initRssWidget);
        window.setTimeout(initRssWidget, 100);
    });
}, 100);
