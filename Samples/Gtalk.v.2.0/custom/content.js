(function(window){

var $GTALK = function(){};

	$GTALK.prototype._ = {};

	$GTALK.prototype.idToName = {};

	$GTALK.prototype.set = function(key, value)
	{
		this._[key] = value;
	};

	$GTALK.prototype.get = function(key, _default)
	{
		return this._[key] == undefined ? ( _default == undefined ? false : _default ) : this._[key];
	};

	$GTALK.prototype.FriendList = function()
	{
		var injection = this.get("injection");
		var body = injection.get("sf-container");
		var footer = injection.get("sf-footer");
		var self = this;

		this.set("TetId", false);

		framework.extension.fireEvent('setSesConfig', {
			tabId: self.get("session")["tabId"],
			tetId: false
		}, function(status){});

		injection.get("sf-header").text("Friend list");

		body.text("");
		footer.text("");

		this.renderList = function(json)
		{

			self.set("friendList", json["friends"]);

			if(json["_length"] > 0)
			{
				var ul = injection.create({"tag" : "ul", "to" : body});

				jQuery.each(json["friends"], function(key, el){

					var li = injection.create({"tag" : "li", "to" : ul});

					self.idToName[el["jid"]] = el["name"];

					li.text(el["name"] == undefined ? el["jid"] : el["name"])
						.attr("jid", el["jid"])
						.hover(function(){
							jQuery(this).addClass("sfhover")
						}, function(){
							jQuery(this).removeClass("sfhover")
						})
						.click(function(){
							self.openTet($(this).attr("jid"));
						});
				});
			}
			else
			{
				var mesage = injection.create({"tag" : "div", "to" : body, "className" : "sfmessage"});
				mesage.text("Friend list is empty");
			}

			injection.create({"tag" : "button", "to" : footer, "className" : "SFButtonText"})
				.text("Logout")
				.click(function(){ self.logout() });

			injection.create({"tag" : "button", "to" : footer, "className" : "SFButtonText"})
				.text("Invite")
				.css({"float" : "left"})
				.click(function(){ self.invite() });
		};

		framework.extension.fireEvent('getFriendList', {}, function(data){
			data = JSON.parse(data);
			self.renderList(data)
		});
	};

	$GTALK.prototype.invite = function()
	{
		var injection = this.get("injection");
		var body = injection.get("sf-container");
		var footer = injection.get("sf-footer");
		var self = this;

		injection.get("sf-header").text("Invite to chat");

		body.text("");
		footer.text("");

		var inputBox = injection.create({"tag" : "div", "to" : body, "className" : "SFinputBox", "id" : "SFEmailWrapper"});
		injection.create({"tag" : "label", "to" : inputBox }).text("E-mail: ");

		var login = injection.create({"tag" : "input", "to" : inputBox, "type" : "text" });

		injection.create({"tag" : "button", "to" : footer, "className" : "SFButtonText"})
			.text("Friend list")
			.css({"float":"left"})
			.click(function(){ self.FriendList() });

		var send = function()
		{
			var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

			if(!reg.test(login.text()))
			{
				login.addClass("sf-error");
			}
			else
			{
				login.removeClass("sf-error");
				framework.extension.fireEvent('invite', { "email" : login.text() }, function(){ self.FriendList() });
			}
		};

		login.keypress(function(e){ if (e.which == 13 || e.keyCode == 13) { e.preventDefault(); send(); } });

		injection.create({"tag" : "button", "to" : footer, "className" : "SFButtonText"})
			.text("Send")
			.click(function(){ send() });
	};

	$GTALK.prototype.logout = function()
	{
		this.set("friendList", false);
		framework.extension.fireEvent('logout', {}, function(){ });
	};

	$GTALK.prototype.renderMessages = function(messages)
	{
		var SFChat = jQuery("#SFChat").text("");
		var self = this;
		var injection = this.get("injection");

		var lastSay = null;

		jQuery.each(messages, function(i, message)
		{

			var opt = message["from"] == "friend" ?
				{"className" : "SFfriendSay", "say" : self.idToName[self.get("TetId")] }
					:
				{"className" : "SFmeSay", "say" : "Me" }
				;

			if(lastSay == message["from"])
			{
				SFChat.find('sfspan:last').append("<sfdiv>" + message["text"] + "</sfdiv")
			}
			else
			{
				var p = injection.create({"tag" : "p", "to" : SFChat, "className" : "wrapper-"+opt["className"] });

				injection.create({"tag" : "span", "to" : p, "className" : opt["className"] })
					.text(opt["say"] + ': ');
				injection.create({"tag" : "span", "to" : p, "className" : "SFSayText" })
					.text(message["text"]);
			}

			lastSay = message["from"];

		});

		SFChat.animate({ scrollTop: SFChat.prop("scrollHeight") },  1400)

	};

	$GTALK.prototype.newMessage = function(json, callback)
	{
		if(!this.get("TetId"))
		{
			jQuery('sfli[jid="'+json["from"]+'"]').addClass("newMessage");
		}
		else
		{
			this.renderMessages(json["messages"]);
		}

		callback && callback();
	};

	$GTALK.prototype.openTet = function(key)
	{

		var self = this;

		var tetF = function(key)
		{

			key = key == undefined ? self.get('session')["tetId"] : key;

			var tet = self.get("friendList")[key];

			var injection = self.get("injection");
			var body = injection.get("sf-container");
			var footer = injection.get("sf-footer");

			self.set("TetId", tet["jid"]);

			framework.extension.fireEvent('setSesConfig', {
				tabId: self.get("session")["tabId"],
				tetId: tet["jid"]
			}, function(status){});

			injection.get("sf-header").text(tet["name"] == undefined ? tet["jid"] : tet["name"] );

			body.text("");
			footer.text("");

			injection.create({"tag" : "chat", "to" : body, "id" : "SFChat"});
			injection.create({"tag" : "chatTextarea", "type" : "text", "to" : body, "id" : "chatTextarea" })
				.keypress(function(e){
					if((e.ctrlKey) && ((e.keyCode == 0xA)||(e.keyCode == 0xD)))
					{
						e.preventDefault();
						framework.extension.fireEvent('sendMessage', {"message":jQuery(this).text(), "id" : self.get("TetId")}, function(){});
						jQuery(this).text("");
					}
				});

			injection.create({"tag" : "button", "to" : footer, "className" : "SFButtonText"})
				.text("Friend list")
				.css({"float":"left"})
				.click(function(){ self.FriendList() });

			injection.create({"tag" : "button", "to" : footer, "className" : "SFButtonText"})
				.text("Send")
				.click(function(){
					framework.extension.fireEvent('sendMessage', {"message":jQuery("#chatTextarea").text(), "id" : self.get("TetId")}, function(){});
					jQuery("#chatTextarea").text("");
				});

			framework.extension.fireEvent('loadHistory', { "id" : self.get("TetId")}, function(data){
				self.renderMessages(data);
			});
		};

		if(key == undefined)
		{
			framework.extension.fireEvent('getFriendList', {}, function(json){
				json = JSON.parse(json);
				self.set("friendList", json["friends"]);
				tetF();
			});
		}
		else
		{
			tetF(key);
		}
	};

	$GTALK.prototype.Auth = function()
	{
		var injection = this.get("injection");

		injection.get("sf-header").text("Authorization");

		var body = injection.get("sf-container").text("");

		var inputBox = injection.create({"tag" : "div", "to" : body, "className" : "SFinputBox", "id" : "SFloginWrapper"});
			injection.create({"tag" : "label", "to" : inputBox }).text("Login: ");

		var login    = injection.create({"tag" : "input", "to" : inputBox, "type" : "text" });
		var inputPaswordBox = injection.create({"tag" : "div", "to" : body, "className" : "SFinputBox", "id" : "SFpasswordWrapper"});
			injection.create({"tag" : "label", "to" : inputPaswordBox }).text("Password: ");

		var password = injection.create({"tag" : "input", "to" : inputPaswordBox, "type" : "password", "id" : "LoginPassword" });

		var remember = injection.create({"tag" : "checkbox", "to" : body });
			remember.text("Remember me");

		remember.addClass(!this.get("configurations")["remember"] ? "sfactive" : "sfempty");

		remember.click(function(){jQuery(this).toggleClass("sfempty"); });

		var self = this;

		var footer = injection.get("sf-footer").text("");
		var button = injection.create({"tag" : "button", "to" : footer, "id" : "SFButtonLogin"});
		var loader = injection.create({"tag" : "img", "to" : footer, "id" : "SFAjaxLoader"});

		this.login = function()
		{
			var loginValue = login.text();
			var passwordValue = injection.get("#LoginPassword-value");

			var error = function(){ login.addClass("sf-error"); password.addClass("sf-error"); };

			if(!loginValue.length || passwordValue == undefined || !passwordValue.length)
				{ error(); }
			else
			{
				loader.css({ "display" : "block" });

				login.removeClass("sf-error");
				password.removeClass("sf-error");

				framework.extension.fireEvent('connect', {"login" : loginValue, "password" : passwordValue, "remember" : remember.is(".sfempty")}, function(status){

					if(status){ self.FriendList()}
						else { error(); }

					loader.hide();
				});
			}

		};

		inputBox.click(function(){ login.focus();} ).keypress(function(e){ if (e.which == 13 || e.keyCode == 13) { e.preventDefault(); self.login(); } });
		inputPaswordBox.click(function(){ password.focus()} ).keypress(function(e){ if (e.which == 13 || e.keyCode == 13) {e.preventDefault(); self.login(); } });
		button.click(function(){ self.login() });

	};

	$GTALK.prototype.init = function(options)
	{

		var self = this;
		var injection = new window.ext();

		injection.initialize({
			"style" : window.projectStyle,
			"configurations" : {},
			"widgets" :
			{
				"header" : {},
				"container" : {},
				"footer" : {}
			}
		});

		this.set("injection", injection);
		this.set("session", options);

		injection.init();

		injection.getBody().css({
			"top" : self.get("session")["top"] == undefined ? 20 : self.get("session")["top"],
			"left" : self.get("session")["left"] == undefined ? 20 : self.get("session")["left"]
			})
			.draggable({
			start: function(event, ui) {
				$(this).css({"cursor" : "move"})
					.stop()
					.fadeTo("fast", 0.6)
			},
			stop: function(event, ui) {
				$(this).css({"cursor" : "default"})
					.stop()
					.fadeTo("slow", 1);

					framework.extension.fireEvent('setSesConfig', {
						tabId: self.get("session")["tabId"],
						left: $(this).css("left"),
						top: $(this).css("top")
					}, function(status){});
			}
		});

		framework.extension.getItem("configurations", function(data){

			if(data && data != "null")
				{ self.set("configurations", JSON.parse(data)); }

			framework.extension.fireEvent('getStatus', {}, function(status){
				self[status ? (self.get('session')["tetId"] ? "openTet" :"FriendList") : "Auth"]();
				injection.getBody().css({"display" : "block"});
			});

		});

	};

	$GTALK.prototype.remove = function()
	{
		$("#sf-Gtalk").remove();
	};

	$GTALK.prototype.run = function()
	{
		var self = this;
		framework.extension.attachEvent('onPresence', function(presenceList){
			self.set("presenceList", presenceList);
		});

		framework.extension.attachEvent('friendList', function(status){
			if($("#sf-Gtalk").length)
			{
				if(status){ self.FriendList(); }
			}
		});

		framework.extension.attachEvent('newMessage', function(json, callback){
			if($("#sf-Gtalk").length)
			{
				self.newMessage(json,  callback);
			}
		});

		framework.extension.attachEvent('disconnect', function(data){
			if($("#sf-Gtalk").length)
			{
				self.Auth();
			}
		});
	};

	framework.browser.attachEvent("DocumentComplete",function(DocumentComplete){
		
		var GTALK = new $GTALK();

		framework.extension.fireEvent('getSesConfig', DocumentComplete, function(data){
			if(data.show)
			{
				GTALK.init(data);
				GTALK.run();
			}
		});

		framework.extension.attachEvent('showBubble', function(){
			framework.extension.fireEvent('getSesConfig', DocumentComplete, function(data){

				if(data.show)
				{
					GTALK.init(data);
					GTALK.run();
				}
				else
				{
					GTALK.remove();
				}
			});
		});
	})
})(window);