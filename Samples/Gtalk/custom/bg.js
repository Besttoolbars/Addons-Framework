(function(window){

framework.extension.attachEvent("getBaseUrl",function(data, callback){
	var i = document.location.href.lastIndexOf("/");
	callback(document.location.href.substring(0, i+1));
});

var $GTALK = function(){};

	$GTALK.prototype._ = {};
	$GTALK.prototype.messages = {};
	$GTALK.prototype.session = {show : false};

	$GTALK.prototype.set = function(key, value)
	{
		this._[key] = value;
	};

	$GTALK.prototype.get = function(key, _default)
	{
		return this._[key] == undefined ? ( _default == undefined ? false : _default ) : this._[key];
	};

	$GTALK.prototype.initialize = function(options)
	{
		this._ = jQuery.extend(this._, options);
	};

	$GTALK.prototype.invite = function(data, callback)
	{
		var query = $pres({type: 'subscribe', to:data.email}).c('query', {xmlns: Strophe.NS.ROSTER});

		this.get("connection").sendIQ(query, function(e){}, function(e){}, this.get("timeOut"));

		//"<presence to='$address' type='subscribe' /></presence>"
		//this.get("connection").send($msg({to: data.email}).c('body').t("hi"));
		callback && callback();
	};

	$GTALK.prototype.messages = function(messages)
	{
		var self = this;

		$.each(messages, function(i, message) {

			var from = jQuery(message).attr('from');
			var text = jQuery(message).find("body").text();

			var regxp = /^(.*?)\//;

			if(regxp.test(from))
				{ from = from.match(regxp)[1]; }

			self.addMessage(from, text, "friend");

		});
	};

	$GTALK.prototype.addMessage = function(from, text, to)
	{
		if(this.messages[from] == undefined) { this.messages[from] = []; }

		this.messages[from].push({text : text, from : to});

		framework.extension.fireEvent('newMessage', { "from" : from, "messages" : this.messages[from] }, function(){ });
	};

	$GTALK.prototype.rawInput = function(data)
	{
		//alert("rawInput: " + data)
		var xmlDoc= jQuery.parseXML(data);
		var $xml = jQuery( xmlDoc );

		this.messages($xml.find( "message" ));
		this.presences($xml.find( "presence" ));
	};

	$GTALK.prototype.presences = function(presences)
	{
		var presenceList = presences;

		$.each(presences, function(i, presense) {

		});

		if(presenceList.length)
			{ framework.extension.fireEvent('onPresence', presenceList, function(){}); }
	};

	$GTALK.prototype.rawOutput = function(data)
	{
		debugger;
		//alert("rawOutput:" + data)
	};

	$GTALK.prototype.connect = function(options, callback)
	{
		var self = this;

		if(this.get("status")) { callback(); }
		else
		{
			this.get("connection").connect(options['login'], options["password"], function(e)
			{debugger;
				switch(e)
				{
					case Strophe.Status.DISCONNECTED:
						if(!self.get("logout"))
						{
							self.initConnect();
							GTALK.connect({"login" : options['login'], "password" : options["password"], "remember" : options["remember"]}, function(){ });
						}
						break;
					case Strophe.Status.CONNECTING:
						break;
					case Strophe.Status.DISCONNECTING:
						break;
					case Strophe.Status.CONNFAIL:
					case Strophe.Status.AUTHFAIL:
						callback(false);
						break;
					case Strophe.Status.CONNECTED:

						self.set("status", true);

						if(!options["remember"])
						{
							framework.extension.setItem("login"     , options['login']);
							framework.extension.setItem("passowrd"  , options['password']);
						} else {
							framework.extension.setItem("login"    , "");
							framework.extension.setItem("passowrd" , "");
						}

						self.sendPresence();

						callback(true);

						break;
				}
			});
		}
	};

	$GTALK.prototype.logout = function()
	{
		this.set("logout", true);
		this.get("connection").disconnect();
		this.set("status", false);

		framework.extension.setItem("login"    , "");
		framework.extension.setItem("passowrd" , "");

		framework.extension.fireEvent('disconnect', {}, function(){});
	};

	$GTALK.prototype.send = function(data)
	{
		this.addMessage(data.id, data.message, "me");

		this.get("connection").send($msg({to: data.id}).c('body').t(data.message));
	};

	$GTALK.prototype.sendPresence = function()
	{
		var show = "default";
		var message = "";
		var $statusMessage = $pres({}).c('show',{}).t(show).up().c('status',{}).t(message).up().c('c',{xmlns: 'http://jabber.org/protocol/caps', node: 'http://www.google.com/xmpp/client/caps', ver: '0.92'});
		this.get("connection").sendIQ($statusMessage, function(e){}, function(e){}, this.get("timeOut"));
	};

	$GTALK.prototype.getFriendList = function(callback)
	{
		var query = $iq({type: 'get'}).c('query', {xmlns: Strophe.NS.ROSTER});
		var self = this;

		var friendList = self.get("friendList");

		if(friendList)
			{ callback(JSON.stringify(friendList)); return; }

		this.get("connection").sendIQ(query, function(response){

			var results = jQuery(response);
			var items = results.find('item');

			var friendList = {"_length" : 0, "friends": {}};

			$.each(items, function(i, item) {
				friendList["_length"]++;
				friendList["friends"][$(item).attr("jid")] = {
					"jid" : $(item).attr("jid"),
					"name" :($(item).attr("name") == undefined ? $(item).attr("jid").split("@")[0]: $(item).attr("name")),
					"subscription" : $(item).attr("subscription")
				};
			});

			self.set("friendList", friendList);

			callback(JSON.stringify(friendList))

		},function(e){
			//alert(e)
		},this.get("timeOut"));
	};

	$GTALK.prototype.initConnect = function()
	{
		var server = this.get("server");
		var self = this;
		var connection = new Strophe.Connection(server);

		connection.rawInput  = function(data){ self.rawInput(data); };
		connection.rawOutput = function(data){ self.rawOutput(data); };

		this.set("connection", connection);
	};

	$GTALK.prototype.getSesConfig = function(data, callback)
	{
		callback(this.session[data.tabId.toString()] == undefined ? {} : this.session[data.tabId.toString()])
	};

	$GTALK.prototype.setSesConfig = function(data)
	{
		this.session[data.tabId.toString()] = $.extend(this.session[data.tabId.toString()], data);
	};

	$GTALK.prototype.init = function()
	{
		var self = this;

		this.initConnect();

		framework.extension.attachEvent("connect", function(data, callback){
			data = $.browser.msie ? data.data : data;
			self.set("logout", false);
			self.connect(data, callback);
		});

		framework.extension.attachEvent("getFriendList", function(data, callback){
			self.getFriendList(callback);
		});

		framework.extension.attachEvent("getStatus", function(data, callback){
			callback && callback(self.get("status"));
		});

		framework.extension.attachEvent("logout", function(data, callback){
			self.logout();
		});

		framework.extension.attachEvent("sendMessage", function(data, callback){
			self.send(data, callback);
		});

		framework.extension.attachEvent("loadHistory", function(data, callback){
			callback(self.messages[data.id] == undefined ? [] : self.messages[data.id]);
		});

		framework.extension.attachEvent("invite", function(data, callback){
			self.invite(data, callback);
		});

		framework.extension.attachEvent("getSesConfig", function(data, callback){
			self.getSesConfig(data, callback);
		});
		framework.extension.attachEvent("setSesConfig", function(data, callback){
			self.setSesConfig(data);
		});

	};

var GTALK = new $GTALK();
	GTALK.initialize({
		"server" : "http://bosh.metajack.im:5280/xmpp-httpbind",
		"timeOut" : 1000
	});

	GTALK.init();

	framework.extension.getItem("login"    , function(login){
		framework.extension.getItem("passowrd" , function(password){
			if(login && login.length > 1 && password && password.length > 1)
			{
				GTALK.connect({"login" : login, "password" : password, "remember" : false}, function(){
					framework.extension.fireEvent('friendList', true, function(){});
				});
			}
		});
	});

	framework.ui.button.attachEvent("ButtonClick",function(data){

		var tabId = $.browser.msie ? data : data.tabId;

		GTALK.getSesConfig({tabId : tabId}, function(options){

			GTALK.setSesConfig({tabId : tabId, show:!options["show"]});
		});

		framework.extension.fireEvent('showBubble', {}, function(){});
	});

})(window);



