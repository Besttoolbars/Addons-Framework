(function(){

	var $GTALK = function()
	{};

	$GTALK.prototype._configrations = {};
	$GTALK.prototype.__container = undefined;
	$GTALK.prototype.__wrapper   = undefined;
	$GTALK.prototype.__header    = undefined;
	$GTALK.prototype.__body      = undefined;
	$GTALK.prototype.__footer    = undefined;
	$GTALK.prototype.style =
	{
		input:
		{
			fontSize : '14px',
			background: '#fff',
			border: '1px solid #989898',
			borderBottom:0,
			borderRight:0,
			display:'block',
			padding:'8px 6px',
			margin:'6px 20px',
			width:'200px'
		},
		inputWrapper :
		{
			fontSize: '14px',
			margin: '20px auto',
			width:'250px'
		}
	};

	/**
	 * set configurations parameters by key
	 * @param key
	 * @param value
	 */
	$GTALK.prototype.set = function(key, value)
	{
		this._configrations[key] = value;
	};

	/**
	 * return configuration parameters by key
	 * @param key
	 */
	$GTALK.prototype.get = function(key)
	{
		return this._configrations[key] ? this._configrations[key] : false;
	};

	$GTALK.prototype.getBody = function()
	{
		return this.__body;
	};

	/**
	 * return jQuery object
	 */
	$GTALK.prototype.getHeader = function()
	{
		return this.__header;
	};

	$GTALK.prototype.setHeaderContent = function(text)
	{
		this.getHeader().html(text);
	};

	/**
	 * return jQuery object
	 */
	$GTALK.prototype.getFooter = function()
	{
		return this.__footer;
	};

	$GTALK.prototype.getWrapper = function()
	{
		return this.__wrapper;
	};

	/**
	 * return jQuery object
	 */
	$GTALK.prototype.getContainer = function()
	{
		return this.__container;
	};

	$GTALK.prototype.setContent = function(text)
	{
		this.getBody().html(text)
	};

	$GTALK.prototype.Auth = function()
	{

		this.setHeaderContent('Authorization');

		this.setContent('<div class="softomate-gtalk-input-wrapper">' +
			'<img src="" alt="">' +
			'<label for="softomate-gtalk-login">Login:</label>' +
			'<input type="text" id="softomate-gtalk-login" />' +
			'</div>' +
			'<div class="softomate-gtalk-input-wrapper">' +
			'<label for="softomate-gtalk-password">Password:</label>' +
			'<input type="password" id="softomate-gtalk-password" />' +
			'</div>');

		this.getBody().find('#softomate-gtalk-login, #softomate-gtalk-password').css(this.style.input);
		this.getBody().find('div.softomate-gtalk-input-wrapper').css(this.style.inputWrapper);
		this.getBody().find('label[for="softomate-gtalk-login"],label[for="softomate-gtalk-password"]').css(this.style.inputWrapper);
	};

	$GTALK.prototype.renderWindow = function()
	{
		var self = this;

		this.buildIFrame = function(width, height)
		{
			var content = $('<div />')
				.attr("id", "softomate-gtalk-wrapper")
				.css({
					"background" : '#e3e2e2',
					width   : width,
					height  : height,
					position : 'relative',
					overflow : 'hidden',
					font     : '13px/14px Arial, sans-serif'
				});


			var body = $('<iframe />')
				.attr('src', 'about:blank')
				.attr('id', 'softomate-gtalk')
				.attr('frameborder', 0)
				.css({
					position: 'absolute',
					width   : width +8,
					height  : height+8,
					top     : '10px',
					left    : '10px',
					zIndex  : 999999,
					'-webkit-box-shadow': '3px 3px 10px 1px rgba(0, 0, 0, 0.2)',
					'-moz-box-shadow': '3px 3px 10px 1px rgba(0, 0, 0, 0.2)',
					'box-shadow': '3px 3px 10px 1px rgba(0, 0, 0, 0.2)',
					border  : '1px solid #e3e3e3'
				});

			self.__wrapper = body;

			$('body').append(body);

			self.__container = body.contents();

			self.__container.find('body')
				.append(content)
				.css({
					background:'#ffffff',
					margin  : '0 0',
					padding : '4px'
				});

			var header = $('<div />')
				.attr('id', 'softomate-gtalk-header')
				.css({
					overflow : 'hidden',
					padding   : '14px 0 18px 20px',
					background : '#333333',
					color      : '#ffffff',
					'text-shadow': '1px 2px 2px #756e75',
					filter: 'dropshadow(color=#e6e6e6, offx=2, offy=2)',
					fontSize   : '20px'
				});

			body = $('<div />')
				.attr('id', 'softomate-gtalk-body')
				.css({
					height   : '100%'
				});

			var footer = $('<div />')
				.attr('id', 'softomate-gtalk-footer')
				.css({
					overflow : 'hidden',
					position:'absolute',
					bottom:0,
					height   : '40px',
					width : '100%',
					background : '#ffefbb',
					display:'none'
				});

			self.__container.find("#softomate-gtalk-wrapper")
				.append(header)
				.append(body)
				.append(footer);

			self.__header = self.__container.find('#softomate-gtalk-header');
			self.__body   = self.__container.find('#softomate-gtalk-body');
			self.__footer = self.__container.find('#softomate-gtalk-footer');

		};

		if(this.getWrapper() == undefined)
		{
			this.buildIFrame(350, 280);
		}
		else
		{
			this.getWrapper().show();
		}

		this.Auth();

	};

	$GTALK.prototype.hidden = function()
	{
		//this.getWrapper().hide();
	};

	$GTALK.prototype.init = function()
	{
			this.renderWindow();
	};

	var GTALK = new $GTALK();

	framework.extension.attachEvent('showBubble',function(data) {
		GTALK.init();
	});

	framework.extension.attachEvent('closeBubble',function(data) {

	});

	framework.extension.attachEvent('DocumentComplete', function(data){

	});

})();