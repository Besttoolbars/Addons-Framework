$(function(){

var $WT = function(){};

	$WT.prototype._ = {};

	$WT.prototype.set = function(key, value)
	{
		this._[key] = value;
	};

	$WT.prototype.get = function(key, _default)
	{
		return this._[key] == undefined ? ( _default == undefined ? false : _default ) : this._[key];
	};

	$WT.prototype.injection = function()
	{
		var self = this;
		var logo = $('<logo />').css(this.get('style')['logo']).click(function(){
			framework.browser.navigate({url: self.get('LogoUrl'), tabId: null});
		});

		var toolbar = $('<toolbar />')
			.attr('id', 'toolbar-'+this.get('name'))
			.css(this.get('style')['toolbar'])
			.css({"width" : $('body').width()})
			.prepend(logo);

		window.onresize = function(event) {
			var w = parseInt($('body').width());
			if(w < 1000) { w = 1000}
			toolbar.css({"width" : w});
		};


		if($.browser.msie && parseInt($.browser.version) < 9)
			{toolbar.css(this.get('style')['toolbarIE'+parseInt($.browser.version)])}

		$('body').css({
			marginTop:38 + parseInt($('body').css('marginTop')),
			position:'relative'
		});

		var el = $('body>*');

		$.each(el, function(i, e){
			if(el.eq(i).css('position') == 'fixed')
			{
				el.eq(i).css({top: parseInt(el.eq(i).css('top')) +40})
			}
		});

		$('body')[this.get('injection')['method']](toolbar);

		this.set('toolbar', $('#toolbar-'+this.get('name')));
	};

	$WT.prototype.search = function(options)
	{
		var searchBox = $('<searchBox />').css(this.get('style')['searchBox']).attr('id', 'toolbar-'+this.get('name')+'searchBox');

		var self = this;

		this.goTo = function()
		{
			var val = $('#toolbar-'+self.get('name')+'searchInputBox').val();

			if(val.length)
				{ framework.browser.navigate({url: options["onChooseURL"][this.get('SearchBy')]['URL'] + val, tabId: null}); }
		};

		var timeout_list = null;
		var SearchList = $('<list />')
			.css({
				'position' : 'absolute',
				'left' : 34,
				'width': 176,
				'display':'none',
				'top': 29,
				'border': '1px solid #ccc',
				'-webkit-box-shadow': '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
				'-moz-box-shadow': '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
				'box-shadow': '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
				zIndex:999999,
				color:'#333',
				'background':'#fff'
			}).mouseover(function(){
				if (timeout_list) clearTimeout(timeout_list);
			})
			.mouseout(function(){
				if (timeout_list) clearTimeout(timeout_list);
				timeout_list = setTimeout(function(){
					SearchList.hide();
				}, 400)
			});

		var ico = $('<img />')
			.attr('src', options["onChooseURL"][this.get('SearchBy')]['ico'])
			.css({
				margin:'5px 6px',
				'float':'left',
				'border':0,
				'cursor':'pointer'
			})
			.click(function(){
				SearchList.show();
				if (timeout_list) clearTimeout(timeout_list);
				timeout_list = setTimeout(function(){
					SearchList.hide();
				}, 3000)
			});

		var inputBox = $('<input />')
			.attr('type', 'text')
			.attr('id', 'toolbar-'+this.get('name')+'searchInputBox')
			.attr('placeholder', options["onChooseURL"][this.get('SearchBy')]['Name'])
			.css(this.get('style')['searchInputBox'])
			.keypress(function(e){
				if (e.which == 13 || e.keyCode == 13)
				{ self.goTo(); }
			}).autocomplete(options["autocompletURL"],{
				delay:300,
				minChars:1,
				matchSubset:1,
				autoFill:true,
				width: 232,
				maxItemsToShow:10,
				onItemSelect:function(){self.goTo();}
			});

		SearchList.width(inputBox.width());


		$.each(options["onChooseURL"], function(key, el){

			var option = $('<sfli />')
				.text(el['Name'])
				.css({
					'display': 'block',
					'textAlign':'left',
					'padding': '6px 10px 6px 30px',
					backgroundImage: 'url("'+el['ico']+'")',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: '6px 6px',
					cursor:'pointer'
				})
				.hover(function(){
					$(this).css({
						backgroundColor:'#318cca',
						color:'#fff'
					})
				}, function(){
					$(this).css({
						backgroundColor:'#fff',
						color:'#333'
					})
				})
				.click(function(){
					framework.extension.setItem('SearchBy', key.toString());
					self.set('SearchBy', key);
					ico.attr('src', el['ico']);
					inputBox.attr('placeholder', el['Name']);
					SearchList.hide();
				});

			SearchList.append(option);
		});

		if($.browser.msie && parseInt($.browser.version) < 9)
			{ inputBox.css(this.get('style')['searchInputBoxIE'])}

		var send = $('<send />')
				.css(this.get('style')['searchSend'])
				.text('Search')
				.click(function(){self.goTo()});

		if($.browser.msie && parseInt($.browser.version) < 9)
			{ send.css(this.get('style')['searchSendIE']);}

		searchBox
			.append(SearchList)
			.append(ico)
			.append(inputBox)
			.append(send);

		this.get('toolbar')[options['method']](searchBox);
	};

	$WT.prototype.initialize = function()
	{
		var self = this;

		$.each(this.get('widjets'), function(fn, options){
			self[fn](options);
		});
	};

	$WT.prototype.weather = function(options)
	{
		var self = this;

		var weather = $('<weather />')
			.css(this.get('style')['weather']);
		this.get('toolbar')[options['method']](weather);

		this.CityList = function()
		{
			var li = '';
			$.each(options['city'], function(key, value){
				li+= '<li code="'+value+'">'+key+'</li>';
			});

			return '<ul>'+li+'</ul>';
		};


		this.set('weather', weather);
		weather.click(function(){
			var city = weather.find('ul');
			if(!city.length)
			{
				weather.css({'background':'none', paddingLeft: 26});
				var timeout = null;
				weather.append(self.CityList(options));
				weather.find('ul')
					.mouseover(function(){
						if (timeout) clearTimeout(timeout);
					})
					.mouseout(function(){
						if (timeout) clearTimeout(timeout);
						timeout = setTimeout(function(){
							framework.extension.getItem('city', function(city){
								framework.extension.getItem('cityId', function(cityId){
									framework.extension.fireEvent('getWeather', {options:options, city:city, cityId:cityId}, function(){});
								});
							});
						}, 400)
					})
					.css(self.get('style')['weather-city-ul'])
					.find('li')
					.css(self.get('style')['weather-city-li'])
					.hover(function(){
						$(this).css(self.get('style')['weather-city-li-hover'])
					}, function(){
						$(this).css(self.get('style')['weather-city-li'])
					})
					.click(function(){
						weather.find('ul').hide();
						framework.extension.fireEvent('getWeather', {options:options, city:$(this).text(), cityId:$(this).attr('code')}, function(){});
					});
			}
		});
		framework.extension.getItem('city', function(city){
			framework.extension.getItem('cityId', function(cityId){
				framework.extension.fireEvent('getWeather', {options:options, city:city, cityId:cityId}, function(){});
			});
		});
	};

	$WT.prototype.weatherRender = function(options)
	{
		var self = this;

		framework.extension.getItem('xml', function(data){

			if($.browser.opera)
			{
				var xmlDoc  = data.replace(/<\?.*\?>|\n/, '');
				var $xml    = $(xmlDoc);
				var ico     = xmlDoc.replace(/.*weather_type><image>(.*?)<\/image>.*/, '$1');
			}
			else
			{
				var xmlDoc = $.parseXML(data);
				var $xml    = $(xmlDoc);
				var ico = $xml.find('day_part image').text();
			}

			var temperature = $xml.find('day_part temperature').text();
			var width = $($xml).find('day_part weather_type').text().split(',');

			self.get('weather')
				.css({paddingLeft:(width.length * 26 ), background: 'url('+ico+') no-repeat 0 -1px '})
				.html('<span>'+options.city+', '+temperature+' &deg;C</span>');
		});
	};

	$WT.prototype.menu = function(options)
	{
		var self = this;

		this.buildList = function(items)
		{
			var list = '<ul style="margin:0; list-style-type: none; -webkit-margin-before: 0; -webkit-margin-after: 0; -webkit-margin-start: 0px; -webkit-margin-end: 0px; -webkit-padding-start: 0;">';

			$.each(items, function(key, el){

				list += '<li style="position:relative;background: none; padding: 0; margin: 0;">';
				list += '<a style="position: relative; display: block; padding: 0 20px" '+(el.attr != undefined ? el.attr : '')+' href="'+el.href+'" >'+el.text;

				if(el.items && el.items.length)
					{
						list += '<img style="border:0; background: none; padding: 0; position: absolute; right: 8px; top:8px" src="data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAADCAYAAABbNsX4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB1JREFUeNpiTEtL+8+ABpiAmBFNjJEJxkCmAQIMAIT5Ajt0j42QAAAAAElFTkSuQmCC"  alt="" /></a>'
						list += self.buildList(el.items);
					}
				else
				{
					list += '</a>';
				}

				list += '</li>';
			});

			return list + '</ul>';
		};

		var menu = $('<sfmenu />')
			.css(self.get('style')['menu'])
			.html(self.buildList(options['items']));

		if($.browser.msie && parseInt($.browser.version) < 9)
			{menu.css(self.get('style')['menuIE'])}

		this.get('toolbar')[options['method']](menu);

		menu.find('ul ul').hide()
			.find('img').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADJJREFUeNo8iMENAEAIwsBh1ZF0WpV7XJOGFLj7HJCGIyJG+0Jk5vyoKhpJdDd1rAADAKj2EDdVjnohAAAAAElFTkSuQmCC')
			.css({'top':6});
		menu.find('ul ul ul').addClass('sub');
		menu.find('ul:eq(0)').css({padding:0});
		menu.find('ul:eq(0)>li').css(self.get('style')['menu-ul-li']).last().css({borderRight:0});

		if($.browser.msie && parseInt($.browser.version) < 9)
			{menu.find('ul:eq(0)>li').css(self.get('style')['menuIE-ul-li'])}

		menu.find('ul a').css(self.get('style')['menu-ul-li-a'])
			.hover(function(){
				$(this).css(self.get('style')['menu-ul-li-a-hover'])
			}, function(){
				$(this).css(self.get('style')['menu-ul-li-a'])
			})
			.click(function(e){
				if($(this).is('[href*=javascript]'))
				{
					var timeout = null;
					e.preventDefault();

					var el = $(this).parent().find('> ul:eq(0)').css(self.get('style')['menu-ul-li-ul']);

					if(el.is('.sub'))
					{
						var left = el.parent().parent().width();

						left += $.browser.msie ? -20 : 0;

						var top = $.browser.msie ? -1 :0;

						el.css({
							top:top,
							left:left
						});
					}
					else
					{
						menu.find('ul ul').hide();
					}

					el.show()
						.mouseover(function(){
							if (timeout) clearTimeout(timeout);
						})
						.mouseout(function(){
							if (timeout) clearTimeout(timeout);
							timeout = setTimeout(function(){menu.find('ul ul').hide()}, 400);
						})
						.find('li').css(self.get('style')['menu-ul-li-ul-li'])
						.last().css({borderBottom:0});
				}
			});
	};

	$WT.prototype.init = function(options)
	{
		this._ = $.extend(this._, options);
		this.injection();
		this.initialize();
	};

	var WT = new $WT();
	framework.extension.getItem('SearchBy', function(SearchBy)
	{
		SearchBy = !SearchBy || SearchBy == 'null' ? 1 : SearchBy;

		framework.extension.fireEvent('getBaseUrl', {}, function(url){

			WT.init({
				SearchBy:SearchBy,
				name : 'sample',
				LogoUrl:'http://besttoolbars.net/products/addon_framework/',
				injection:
				{
					method : 'prepend'
				},
				widjets :
				{
					search:
					{
						"autocompletURL" : "http://suggest.yandex.ru/suggest-ya.cgi?ct=text/html&part=",
						"onChooseURL"    :[
						{
							'Name' : 'Google',
							'ico' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsJJREFUeNoUUUloU1EUvfe+/zM1HZImNaUO1UQalC5sRaGIBesEjqCICycQVHCl225cqHQjCCJC64CbKiKICGIVQXAWp2qt1QjW2sm0tknM9P+bfF3ct7nnnXPuOaC15kK/TY00Huy1tl4/e7tfauFkZ5+2t31BcIkkgAQqIswAGDBJAYzB6ZuDw+VaNW951/2pnxNFT2Vl68WecEWAKYXIABUAKLB+MSRmgRRi4I+CYLViLFeyb7weBmC+5DKnbY0w2DlOdDXTKLQCMmOhNa/GR64icAjZwE8DEIZXVga4kTcATQylq4EbfqQ5uU3NkedfJyxvSCmHyFLAyIH04NBYPc1WhmwX6jL5aI5zLa0fI5n4wvCRzYnep7+HJrNVfnWofT4CdvddPr2p/HvpCoYeKZW/yFf8KO18MYJNB66dObR6V3syU+B33421xavjC0JdfT2dby6wWDUoLZXJiZCjJhvzDKN7bnIn39IYWNca69y3FlA/Sb3vuLJHJerAHGW0XNt4NtmjsEEghZkb9PhepMrner8PpwtasyXhhkS8BZwyKdOCpQ1KaQQbzTdyiWem5/ud7Ssj+zcnMzlpNgtq65/v7d4YWauL+TmkZso8pgcz3MbeRx83tDbXhkhkB2f+poq58frEbl8wyqXYcevkg4nH2lMFkhFXSpqkjWWp89P9qZfHQvDJsovaoTxPNnTcqQrHh9Kjq64e/BdwmWBaohIIAshRhW+Pjy62Xi2KlmNVgUiNN4KD6WcnNFBTZFGsog4cLlGbqGxhowDLzaaDYtRn1/zLmxyYWQT8YVkeQ14oUUU5XwC0SXgUcmnMKE3+mkZvdH1hRuhyQEuPhUFZYt76bdoTvPehbzw7gZJQKiiRchUoD3LugpPL9J+3sp+JF5Xt88Y2subDQ+OTWy4dH6Upogpl6tACtO2eevhfgAEA2SdueodZSyUAAAAASUVORK5CYII=',
							'URL' : "http://www.google.com/search?q="
						},{
							'Name' : 'Bing',
							'ico' : 'data:image/x-icon;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAVpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8ysf97zf+24//F6f/F6f/F6f+K0/9QvP8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8krP+Z2P/////////w+f/F6f/F6f/i9P/////////T7v9Bt/8Vpv8Vpv8Vpv8Vpv/T7v/////w+f97zf8Vpv8Vpv8Vpv8Vpv9QvP/T7v/////w+f9Bt/8Vpv8Vpv97zf////////9QvP8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8krP/i9P/////i9P8Vpv8Vpv+24//////i9P8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv+K0/////////8Vpv8Vpv/F6f////////8krP8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv+n3v/////w+f8Vpv8Vpv/F6f////////+n3v8krP8Vpv8Vpv8Vpv8Vpv8Vpv9tx/////////+Z2P8Vpv8Vpv/F6f/////////////i9P+K0/9QvP9QvP9tx//F6f////////+n3v8Vpv8Vpv8Vpv/F6f/////T7v+Z2P/i9P////////////////////+24/9QvP8Vpv8Vpv8Vpv8Vpv/F6f/////F6f8Vpv8Vpv8krP9QvP9QvP9Bt/8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv/F6f/////F6f8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv9Bt/9QvP9Bt/8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8Vpv8AAHBsAABhdAAAbiAAAHJ0AABsaQAAdGkAACBDAABlbgAAUEEAAEVYAAAuQwAAOy4AAEU7AABBVAAAQ00AAC5W',
							'URL' : "http://www.bing.com/search?q="
						}],
						"method"         : "prepend"
					},

					weather:
					{
						'method' : 'append',
						'url' : "http://export.yandex.ru/bar/reginfo.xml?region=",
						'default':'London',
						'city':
						{
							'Moscow' : 213,
							'New york' : 202,
							'London' : 10393,
							Novosibirsk:65,
							'Las vegas':21121,
							Dzhekson:21473,
							Paris:10502,
							Milan:10448,
							Tokyo:10636
						}
					},

					menu:
					{
						method : 'append',
						items:[{
							text : 'News',
							attr : ' id="sf-news" ',
							href : 'javascript:void(0);',
							items :
								[{
									text : 'CNN International',
									href : 'http://cnn.com'
								},{
									text : 'BBC',
									href : 'http://bbc.com'
								},{
									text : 'Google News',
									href : 'http://news.google.com/'
								},{
									text : 'Worldpress',
									href : 'http://www.worldpress.org/'
								},{
									text : 'Yahoo! News',
									href : 'http://news.yahoo.com/world/'
								}]
						},{
							text : 'YouTube',
							attr : ' id="sf-video" ',
							href : 'http://youtube.com'
						},{
							text : 'Sport',
							attr : ' id="sf-sport" ',
							href : 'javascript:void(0);',
							items :
								[{
									text : 'Sky Sports',
									href : 'http://www.skysports.com/'
								},{
									text : 'Biathlon',
									href : 'javascript:void(0);',
									items :
										[{
											text : 'Biathlon federation',
											href : 'http://www.olympic.org/ibu'
										},{
											text : 'Biathlon in the United States',
											href : 'http://biathlon.teamusa.org/'
										},{
											text : 'New York Biathlon',
											href : 'http://nybiathlon.org/blog/'
										}]
								},{
									text : 'Bodybuilding',
									href : 'http://www.bodybuilders.com/'
								},{
									text : 'USA swimming',
									href : 'http://www.usaswimming.org'
								},{
									text : 'Bobsleighing',
									href : 'http://www.fibt.com/'
								}]
						}]
					}
				},
				style :
				{
					toolbar:
					{
						background:'#fff',
						display:'block',
						position:'fixed',
						zIndex:99999999999,
						top:0,
						height:36,
						"min-width" : 980,
						"max-width" : 3000,
						textAlign:'right',
						left:0,
						borderBottom: '1px solid #ccc',
						'-webkit-box-shadow': '1px 1px 0 2px rgba(140, 140, 140, 0.2)',
						'-moz-box-shadow': '1px 1px 0 2px rgba(140, 140, 140, 0.2)',
						'box-shadow': '1px 1px 0 2px rgba(140, 140, 140, 0.2)'
					},

					toolbarIE8:
					{
						position:'absolute',
						top:"-38px"
					},

					toolbarIE7:
					{
						position:'absolute',
						top:0
					},

					logo:
					{
						background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAAAcCAYAAADC3jvjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAK09JREFUeNrMvGmQXNl13/m79773cl9qX1ELCgUUqrAD3Q2wd7JFi2qKlEwPR6Jtchyyx2NbnnA4wqMJh2NiYqyxxh9mwuMlQhHyErZsypQsWTRFNtlsLr2Q3UQDBApAFVCofa/K2jIrK/f37p0P72VWAQ2SsmZ6ol8EIguZ+e67y1n+53/OSVEzrrFQGMDgIVE8chkAD4TCaBACEC4YCwSAC8jgH4AOXuXhEMZDCIFBIow/FgaM8J8pgmcKAG38h4j6cAak8Mc1EoTGHBlbBM80gEBi0I1ni/pcjKwP3vi/wX+OAAw1BHYwBsHr0XXoYO6HXzBCI4wEY0AaQPpTJ9gjXAxWYxlP3BdAeIAwGCEQov6kw/FkY5EuYDX2wWAQwsMYhag/JbhfIMAYBAYjjsz7sb06OhFPgKqfzZEzMMYghPDXrDVIEZylv2eNdWkJ8vBsHt1HGYzjr8tQA5R/XsZDCP/8vWB3/PnqJ0njR+Ky7s9fRwu3IUx1IUQKjBbYyiYdbSWdaidix/3FY7FzsMnK1n2EsEEajD4UD4RGoDDG4HplWuNd9LadQikARVUbMnuz7ORXKZeL1LwqSkqS0U46WnpJR9uxgu3aLW6yvDWHMRolAwEWoI3wD0ELpBB4xkVhE4slmJy/x9rWLE4oghH+wWntH66SNp7RCGFwazUGOk7x4rlPYQsbLaDmFni4OsnU0i2WtqYo1kpYKkx3yxCnj41yqvcCyUgaT/viYYRBev7hIw3lWpm5rVkmZ3/E6s4S2fIOIRmmq2WQ032jjPRfIWkn0fjCYpQgs7fBm3e/Sm5/j9aWLj59+Qs4yjdKnjEIA1Iq/29lKLoHfP/Of2FldZ5w1GkIrZECYUBrjeM4HGs+znDPObpaetAeCKEQQviKZXyFmFx5n/cfvol2DU7I4tnRT3O8YwjtGoTClwNPg1A82LjDD8a/hbQUEoGQwThIjBFICW3JTk50naan4yRhO4zS4EkN2lCrVVjYmODO8jhT67cQrkFZDv1tw4z0XWSke4ywE8UERtVXOBGo+f+/lxC+cXii0ixtPaDklkBopFZoU8OrW2GhUBKE59LVMszowLOkwikMcFA7YG5zAo30vYUWDY/iGo1CAZpiNcfJrqfo7jyJNIZiOc+95R+yvjuHq31DjfC9zcbeKg/XbjDUeYbRvqdQKky2kGVu4xZVz20swlEWAgcPF+1W8YxASF8Iu9OD/HDiW9x65z7ppjhagx2ysGxfKdyKxqtWkFJSLNW49uwGz45+Cstx2dpf54/f+bdcv36dUrGGMuBqDcrjDhN82/oao2eP8/mX/iaD3aMIDcaIQDEFm9lV/vAH/4Yb129QLlXRWiOFwAjNXSZ5Xb3G+fND/IWX/gaDXcO+KdaC7ME279z4DhtLWU5f6ONTlz+HRgA2UhqM8T0RxgNt8Go17tx/jxs/ukcyFaFcBqNdEDUsI3ERKOHgUaa7v52//Orf5sLgVcBFYBDGPxspBe9Pf59vf+t7WHbdEQmGWn8daVm+cmmJEQqBZiMzy7e//W2iEQdXa6oVfG8n/H2wlEF7kkjc5pMvf4o//7EvgRNFaEnRLfCVN/85333jO3he3cv7yniH+3zd+hofu3aVL7z8t0jFmxCANj72+UnC+2FeDQ/7JKWRlo0yHiElCFsJpNRo4VsOYzxKlQNcYTO/OYklFReHXsSSYaTW2CpEzWhsO0zMSYKn0QIwh1oarSWIRZIIbTASZjfvMb85iROKE7NiJCMxDAqtNblyhqrWzG1OEA3FON51iZgToyXRRdVzkUJh0JQrOTyjsZBEE+0IoZBGI5RDItJEb+dJKhcKxNJJPAwHWwcUCwWEtIi2pEg3h6gZl0pB09Hei2OHyeXX+e3X/ncm33mIFXVItUXp7GkmZMVwXZetrR2ymQNuvT/N+u4/4tc/+xuc7B1rwL6d3Da/863fYvLdh4iIRbI1Tkd3ioiToqbL7Gxk2N0qcOvWLGvbv8Xf/PO/wYmuEaQ0WNIQDgkitoW0LDDKhz7CQ2sQ0kNrhZQ+zFFYCNuglMIOWbR1JwnHHFzjorDwcMlv5cnvQ2Ztj3/zR/83v/FXeuhp6cNzPaQlMUazubfM3MokjqOxnAiedplcvsVmPkNbugdhBNIEZ6oNUlqEw2GkJWluipJqjgV6ppGeoFytsLOex626vPbt1+hu6uPFs69ihMsP73yDb3/jdexImHRHmLbOFsJ2lJJbZns5w/5+mbe+9x7JeJrPP/fXkU4ECxcTGN+PFDwTwmC8KslYN6ODzxN2wn4IIwxVXWF3b5Op9Rt4tmEzt0a2kKU10dmAAZ6pMpAc4XjPGGEVQmPwjI9cMQoPF0daWNKmUM2zvjuPbYeI21HO9l+jIz2AkFCulJnP3GVy+ccUaiXm1sfpah6kLdlJNPIKQoASgnKtzN3Zt9nObxKLJDk78DHSkWYfLgUutbv1JO41D0wVS4X5wx/8S777xpvEkvCJq5/i6sjH0dqHeSHbwVDhGzf/iMn3ZrHiNt1DHXz2uf+WM31XScbSVNwKs6v3ee39LzNx5z47s+v8wdv/ir/7y/+IcDiMqw2v3fpDJq4vYMdjdB1v4TNXP8/o8SukQs2UdIn51Qd888ZXeDD+gMzyJr//1u/wdz77vxGNxtFIXONQEwYtfSHxEb1ECA+048cL5ghMMZJarUYoZPO5j3+RE91n8TwPywg8CSvbM3zth7/H4swKO9tZ7s6/S2dzL1JZGONihGRi6TZrC7soFUFIwBOsL+xxb/EmL6d6/HkI7cdSUqPxY8qDXIVPPPcJfu6ZX0HqGi4KRyp2S1nevvcN3nv3LfZ2cvxo5k2eP/8pDgp7vD31OkLZJFuj/DevfJHLIy8TtWMUK1nennyN//iHX6ZYPOD1N77Fc2d/gZ7WIYxWSPlRUxmwMC4eHpZlkQinUEIiLT+Yi4g48XATW4VlDjan/SBR+KSBtBQIgTGglCAZaUIYH6oRuPNAdfzAThu8WoViZR8lFGErQVv6GFIGz3JCHO+4QDa/SaFaojnWiasFUtkkVBBwGoOlbJRl4VLDGEMs3ITtRHA4fKalwgjp+WSFkcRCCXArGGORiDbTkur0g100xig2sou8e+P7OBFFojnGX3rp1zg/9BxaSITRRGSIM/0X6Wnp41+U/j4PJ1eZmphj8unbXBr6GOs7C9y+9w7alIkm4nzhpV/jfP/TGFuBUUSIcLbvMr2tx/ln5b/PzL1lZh/M8f6ZH/LymU8G9IBv1ZWp4aERSmK0aQT4wvhKI5RECB86uK6LVoKOVD9NiXaMFkjhYYSkNdnN+t4q0xO/i1IhKtVisIcKg6Bmajxcvk0pXybdFafvWA8LU0vkC1UWNyapjb2CZTl+HORpjHQDpTVUai7RWIKmZBsWEqE1noSmRIrQ+V/i9viP0BkolbNo16PkVsln90EKQgmbU/0XidohjBLEwwleOfcXWMrMMbs4SW9nP5bxvarAwzXK54E+QpeUOnTIXgnjC7EgYKlcdnJr7BV2cI1LU7SdRDiBEJqq6yIFWFoipOXzHiYINn1QSD1+M8IPKB0VJRFtwgjJXnmLm1PfYikzTb6QBaEI2Q6Xh1/hudFf4PzgsyQjiYANC1gnoXw8jAQjUfheUuI/Uwc0hhAGoYM5CRfPuGh8ATBuDaE9fMxhIYRhduUOuWwRzxVcOneNs8PPoaVGCj/Q1RKMp0nHmrk08gmciEQLj1szbyMNzG9MsJMpoLA5c3aEk31PgWX7iml0wD4ZkrEk10Y/iRWyqFWqzKyOI4RACYEwXhBQSxQSghjRYPmxiPGxvfb8zyRgGQsRGC2pQQrhq5+Bnfw6Uyt3MdrFduBU/1NIBAgXKQxbu6vMLjxAG0MqneAzV79Ie18HblnzYPE+G7srKKP8eQgwxvHXoQ1SgpQ2lpEIXUULMFrgSYeVzDSFcgllCSJOCiEUcSfOsY4+QJLfOODfvv5/8Z3b/4XljfvUXBdlW3zxE/8j/9MX/k/+ys//z3Q19SG1b/Sk8D567JkWLpaE/YMsN6a/6ytOoETGGLLFDPlKnpZoC0PtZ3BsB43BEn4cIpVDZneJ98s5DBZGGqSuU6ZllIpzqvsMyVgzoVCUgdYRJpZ+SM1IlrMLZPIbRJwUkZBDMtxOb8sATYmugAl9hCs9Qt1qJH7spY9Qp7LxXekr6lH6WXoYY9ABZS2EwWDwPI+ZzQcY1yMUcRjqGAJtEEIiEGhhHnn2SO8oqeYUlbU9VncWMEAmu0Yhf0AkFuFU1wUidgjjeQilfObHSIzwBf9Y2wkSLREqyyXWduYpVopIofACw6KRYHQwdwspQBiFF/xfiSpCGjwjsCMS4xq+/L1/QSycwhU1lLZAVNnM7rK5mMEJRXj147/AYOcIRkik8bmo6bW7bGYOUEpxvPskJ7rPMnrsItPji2wsbfNwfYK+1hMNOttgUMLDKEEsFuHB4g08rxYkKgwKyU5pm4nJ27gFj3DY5vTxK0gJkUiMF869ytTUNKV8lXt3p7h/b4q2riStTW20N/fx1IlrjA4+6xu0gMI3QvNRvCzfEzgUdJ79nX3q7LhEY4wAKbGlpLN1mNbmY2Aksr4Y6TM6uVqW3M7OEQwsUSjKtSKOE6av5RSJmEQIzUDXWapelaWtBxQrB9TcMtVaiVzJZlOss7g9SVuqh5G+a6TCqUcE/8OiFguVMtqThMIWkXAygD8K19SQ2AijEdLgCot4KO5bWmHYL+QxSlCslqiVJMlmh2SiDW0qCMvBaIM0Ei1dnxIWkpgTwQlZGAEVt+KzgsaHsAKNhQYhg5wGgbcJKGft5110kBuSSlH1XO7eeoB2TWA2gryZNEhhce7SEFdPv0JY2oHjE1R1kYm596kVyzghxbMjr2DbIcYGL/JG22vkVnPcmbvuvx+KYRkd5FQERkuiiRATUzNM3HkAwsKyFVILPOHiVkDZkmeevsLLpz8VpAQUl06+wBc+XeBP3v4PZFZzeMawPr/H+sI+yp7lrXff4uTpIX7lhV+jv32scTYfXaUxHo6yScZTCCF8RQc8r0KxVqLq1ZhZvY3nVhgbeBZbWT5sMgKjDbZjkwi3gJ998KMLAXGvhmU5hOwg3jASS8Bo39N0tQyysTdPvpAlW8xQrZVxtUvVq7GyNYXnVjh/4hPEnPiHvglK+AfkavDQGCHB85BBUC4NaGkhTA0jFFr5MMXg5zC0BkTNx6G6hhIWWgswLlpIpJY+dBS+IdLCp5GVDGMRwJ8gkWj81FPAXvoJTyMkQvtJSz/X4vPDRrvYUtE21A6WBbqGMBJPKLI7+9SKVe6Nz/DPD/4h//0v/gP6W4+DlCxtLjE5PYWlFD1DHbS2HKNYKdLR1EVPbzv7G2XWNpZZz64y2H6ikSURws8DGc/FsWxCtkPNk1QrFYzQGCUZuXCcF89+givDnyRkh32a3IDSmhfO/TlO95/j3YffZX1rlpn1efLrB3g1D20M927O8Nu5/4Nf/+X/hWOtQwGE/uh5HMvXDk1TopPRgY8RtiINiOOJKgfFPFOrN9naX2Buc5x0qoOB1hGf/kSjjUdf6jTDvRdQCIz0oZ3WbiNBFLbsgBTwA1itIR1tpSnWQlUbypUDypUcm9klljKzVIRmM7fCdnaZWPupD93TpGJJlC2pFMt+fKUNQpoAHko8CZgKEsVmNkOlWEIoQXu6GWEgYlvYoRBupcpOPoOnQQg/B6GCPIYIYFG2tEd5v4xlWcRCDuFQ1M+L1S2rUMhgn46SZb4xM2ht8PCpaLeisSzJ5178awx0DuO5JlBMQ7a0x48evM47P3yHmYkVvtH+u/z1V/8BQmjmN+6Sy+xjh22EBV9959+hlKKmK+QLZeJNNqszmzxcvs1g+0mMMQ26WwjB/l6Zn/tzr/DSpVcpFAr84N5rXH//Bl7ZxXVdeppPEVKRIKy1AB/ulr0KrekufvGpL+G5VbZKm+R213mwNs4Pf/w9ttezrExv8/3br/OrL/01pLSCOPkj6Gk84aKUIurECNnRIwmeCPFUGu3WyOUz1HSN3b11+luGfYsjBB4etmURCyUPYdsjQl5n0TSZ/RU2c2vUqnm6mk/S1dyPI8GOpEiEU7Sl+7DsKPeXr+Nqj2wxwzF9Gik/3E041nYG1DfxyoLp5Rt88tJnEDrkV4aIuvKEkBhmVscp7JbRWtOa7Aap6GwaIJy2Ke9rJuev88r5zxCyYniA1jUQNp7QKANz6/cp7JYxRtPedAwpHd+LBBDNw0MZC611o7ykHl8esjd+MO4ZvwqgOdVGc7wdbSRCaoSBznQvbcl2Jh6Ok8/lmV54SKl8gDQWtx6+g7IlypLM313nQWkZr1pDWQIrHCKWiCKsGhNzP+KF858hrEK+AggBwsOrajqaOxlsHUW2w3D3aaT6p3z/u2/z4NYMv139Lf7OL/9DupK9IA1Ta5PcnnuXzew6Fwau8PzYq0hl0RXrpSvRxamBKzSluvm9P/4dSpl9VnemqboVwmHllw8Z+ZFSGnlYPhNCqZBfY2S8ILvvF1N5eBjh81gGiTauTwIYhRRWEAM8pixBmYa/YL8iai+3zsOl95hZf8Dc+h1cqg3OS+AhgLATAUTgpRQNrPgheppTvWdoak0hJdybmObN8W9QVTVfYYIyFozH/OYU701+N4BGkgvHn8UTmqGeMZrb4mhTZerhIj968H1q0gXhBswiSCNZ2rzPD8a/iWskthNipOdCUPOngzI7ga0kynKC9ft7KhFBVUCQHdfaLy4JaGjpsx5I4aKMn2nX+BSxFzBvxtO4WrOWW2J2ftE/c8vQPdTC8LkuTl45xomLxxg41UYo6hAKhbg/Oc3y1myDNasrrieqlKolvxpAu4SdGJ9/7tcYudiHULB4f4M33v9PVADXQGZvjd/7ypd58xtv8Nr7f8DOQQYtNUb5nlxqaI40o5SNq6FqzCETqA0ftcvymSVDuZpnK7eMJe1GAGYE5Aq7LG09QEuBMIZkPI2UNkIqEB4Gj0Jpn0xuJci5+LkN//6gJgtJS6KD7uaTzG/co2w8csUMd6ffpq/rDHE7Ss1z2TpYZ3btFtrUcFSIZLi5nun5UDehJdHBx5/+ef7TV79CuVjm99/4Mlv5Tcb6n6I12U3VzTO/ep9v3vwjNhZ2MJ7h8jMXODNwBctoupr6eOnSL/DV9T+gXCjxlTd+l9XsEhcHn6U50UqhtM/82iTfufM1Npf3UFIycu4U54au+myW8OMaKSWVUoXb8+9hW1Y9Ogzgna9UPa19hK2IHxMpgecZZtYfUCzl0cqgtcbGYb92wM373yW/VcJyFK1tzURDMe7M36CYL6Jdi5effpGfv/QrKKX82jTLj1e+f/vrfPVbf4QlwoxPv81w54hf4Cl98yaFhQkofSEFaEE60c4vf+yv8tvL/5j83gHfv/4mo8ef4eKJjzHcc5r+U51k1/fZWNjm33/nn/DJS5+hKdHjU/6Zh7z+/u9T3C8QjjuM9JzBtuNILfzaN2M+ekpjYZOv7jK+8DYaiTQ+C2OMoepW8HQVraE10UJX84mASfHLlC1hsZXfIFvcDYop60rj076uWyYeSnFh6OOk480c6xxjavUWZa1Z3p5hK79B2IpRM1UKpSyu8VBG0548RkdL/4cazxzCnRovnv8lFrbnePft93Azeb7+ja/yg643SafD1KqazdUdKkUPrQ29pzr4/Av/AyHbQQuJUvDyhV9iPjPNrfdvc7CR5Zvf/GOud75DIh2ldFBmezNLpexiKUHXYCu/+sLfIuqE0AJE4M2UUmTWM/yrP/knOFr5cfAR9tC4Hp/7uS9yefQlEArbUXiu4T9/598hg7yQEAahLGrFMge5KihNKBLiMx/7EsVKgYn5d6kcaNLdYZ4afpnO5m4/xw0IUUWguDD8LG/eeIPcVoFbMz/i1af/op8gDqy+MAZl+UQFeBjpn/nYwGWev/YCf/L11yjtl3j9+n/kePtJWtM9vPrc5/jdP/jXaA9u3rzFwsoMiVQCVxuya1ny+2UQHj3H2rg29gm/LAqFh+GjxqFZ2q2iTY1qtUbFlD5QrCalxLIc0qF2Tg88QzwUaXzHc11cVUPXXMqV/KGHMvVA1s+DgESLGhh8SOIZVvZmOSjl8Mp77LPrwwUhCCmb9tRxRvqvELZij3YoBGO7rktFlwl7LvwpmJVatUShUMOyPYxXQ0uDdBXIKsY4SBTJSBNf/Lm/TVuik3dvvUV2O09mYZctBaLmISJh4q0hxk6c5Zde/O/oTvcjhIdn/FKXZKiJv/rq3+Nrqf/AjXs/YCeTY2NhhzUyWBi05ZBocTh78jyffeFL9DYNgnAxRvrFj8UK+6U8cTeOt5fF1RZS+myYru+n1hRrJb/Oq1alUqhRihTJ73qPFRj6XiEStUimYnz6pb/I2f6rXH/wHaZvz+Ea6Ohppivd5bcvGD/uQtho49HffpzjA728MzfOytwmd+evc3X0FbRxqexXKJQqVKsllNR4xgrgtz/Os2OfZXzqBg8ml7n97hSvdf0+v/rC3+C5c7/IfrHA29e/zs7WARuLWTbEDpgQQhjCMcnIqdN8+oUv0ds8hNTVn6kuR+WsTlQc/ftPW4D508Z90j3i/vJNc/RLdUVplNIrRSyUpiXdQUhFGn0mB6UsK1vTaITPcgTxQX2M+qvWLmE7Sk/rcUJ2NChN99jN77Kzv0KpmguyzhrHjpKMddDZ3ItV70Uxh40zxnh4nsfa3hy54h4hO8JA20lsK/LI4jzPe2Tjbs29y/Tyj1HK5uLwixzvOPVYvtQvTwGB8TxWd+YYX3yfnfw6tUoVlKQl3s7osUsMdp7CspzDpKnwwJhGH4nRLuu7S0ysjLO5t0y1UkJaimS4iZFjlznVdwYLH9rooCdm+2CL6w++R7FSxAp6VYxwkAEFbSSooPXi3NAzHGsb4K3732J7Zx07FAHPBLFyvYtFI7WgKdbGqcGzdKX60EYwvX6XH8+8iUWYoZ7TXBx81t83Kf16NKNQQmBwublwnfnFSVAuo/1PMdJ7ifnMA25Ov0nV9bhw/BpjvefBkkhXoOVh1cKdpevcXxpHSI94OMWLY58mGo5hjGF1d55bD98jV96lUqmgJETCKY619HFu8BqJaAJtBJ6WKMuv3HiSMT4qb0KIxpkf/fyoEvxZFEk+xkA1nquDv0zQvFR/fUSzntRI9EhT0dH4/9H7zZGmqgabVmdDBIeNX8YLNkJhTEDZGtNoWOMIVDFBs5TBQ+o61n50Ux/dIA1SYbQ/M2F0wP37EFIi/B4b/DonrT209EtVlAYtJcZU/BhDqEacZoxAKhftWUHTlm4E7Z6QSDRKa7wAvvj3+k11WmuUkGA835sEuRqJ/5lQsgGHDqsawHiBVwiyYhYKLyhbqtek+ev3+41MvT9NGL+PTSm/tCdoAvSkRmkraKrTjaY7T1goYdAejXo2qf3KBn9shREaqf2GPB+WS9BBK5n0Dr+HT6RIlJ93wvXPzxgQLlrbCFyEsA+b0kzQ7PgEeP4k4/y48P8k5TmqgEdpdJ+tFD9VaRpjaG3M48r2JE3+YDyuP0DCPX5prZ/44A9gLqEfpRXFo18RH5h48J54sms9uqH+xggwtUYe5Oi8/GpnjSUC7xrQvPXqmXoDVH2ceuGklL6nMEHlr/DMIwSK8fyaMC1qCO34QlnfzyM1efUcTr0OTgfdkcaYRlnQUUVAen5dXaD0mFqj4Q9p0MZFyZCfHK3vLSB18Lewgg5THfSzCLRxkcJpMGRC+crsGYWSGo1AINHG8wtLg8Yw31MahJFIAx4GLYNaOq/O+OmAtpcNY9FodQxaSPyGD3HYDUvQ+Rp8XpfBJynCUUE/KviPK8XR+x73MI/DvKPy8UR4ZoxnGoHmTxjsqIV/xBP8BGV5XKPrbcX1ceotuX8ahFlvX/6g4vgW7Se51w/i0qOtz74gSB43BoeV2XXL/YFW6SDnZJ54/2PrfaR1+0hAH9Dsxkg42nb9BLjw6HvBGNo0Gt+M0EFF7KHCN9BBwyPLhmcR9bZpc2TEelszh0p/+P3gS8Iv7zlEBn47df09/1n1glGvUQ0vOPRe/j3qMcNYb/A2j2EWDqvkHzPCj8vXk2X2v77J7EnO4knxjXRdjec9GkhqrRta68c20sfWQWAvjpR8HF1n3co/ojA81m9/pM6qvmWu9j5QkNmYQ72fv+GZNPl8nqpb+8B8GwRFsB6AWq1GPl8Iqq4P4U4dBpn6PIMuyvp5+mv3D814Gtc93IdANIKEnx+3aa3xvKDLUgc5EgPZ3H5jD4OkDOVShXy+dPiDAsb4HqM+RePLoOd5Qb9/8F4Ai400h0Fy0DmqdaDoDSGTFIpViuVKo+e+Tphq4yddPV3zka3x4Vs2n6Ncq/gnU1+Hp9EBK9pQgsBr67rQmaB4ykjQ7mMQQD5iTBof1Uu1DOCBDMqGtKk3QJojdeuHSpPL5Rpy9risHRVw13Ub92Sz2YCQelQ+6nJzVH4e91wHBweBzB++bz148JDNzXWklHR3dzM8PMzExAS2bXPy5EkmJiYIhx26unq4desmtZrHyMgIQgiWlpa4cuUKSinK5TL37t1jf38fKS0GBwfp6zsWJOj8DXBdzfj4XbR2uXLlCkLA/OwMS0tLgKSpqYmxsTE8z2NiYoL9bA4hDYPHT9DX14fnGcbHb7K3lwOgr2+Ak8MnWFpaYn5+vnHv8vIyly9fZnFxkaWlJTwhScXiXLxwHi/4MQ8LweL8EnNLczx1+QrJZJzVtXUmJx8wOjpKIhbl/v37nLtwkfXNNWZn5lHSn+Pp06cJhxwEUC6WGL97h3w+j22H8DyP06dPYduKyYkJtBFIKRk9M0ZLcwtT92dYX1sCIJ1Oc+HCBdY3Mywvz3P+/EVCoRCe63Hn3l12s3tYUjHQN0jfQA8CxdSDKTa3Mly6dIl4LMTiwiazc/dRKkQkEmF0dATHsZi6/5C9vRyeV+PkyCl6e3sRQLVc4e7EPfK5fWqey+joCO1tbdz88W0KhTyWtOkf7GNgYID7UzOsrW2gjCaV8s/GCTkIIRux6927E+wf5HjmqatIJZmYfIilFKdPDyOAnZ09ZufnODN6mmg0HkBGX/jWVpeZmZ5GG0E8GuPs2bNUKhXG797D0/5vQgwNDdLT08Pa2hoPHz70G+0si8uXL1OpVJienubixYssLCywv7/PhQsXuHfvHq2trUSjUaampqhUKjiOw+XLl5mfn2d9fR1jDG1tbQ0Z39vbQylFV1cXIyMj7O7uMjU1RbVaJRKJcObMGWIxn8yQmcwGkUiEZDLJysoKnuexs7PD7u4uWmu2trbYyx4QjsSw7Qi1Wo3m5mby+Tzr6+t4QSKzVquxsbFBT08PAwN93Lt3h4WF+SPWRlIoFJiZecjS0gLZbBaArc1thLAZGxsjm91lfHyccqXGZmabzu4uTg6PMDlxl9XVVWZm59na2uLq1aucOnWKyclJNjPrFAoFFhcXefDgAdlslp2dHSqVCjMzMwghODsyTEdbq1846EcPaA3Lq0usrKywurwCSMrlMisrS0xO3mMvt8vq5iq1WoXs7g4Cl4sXz5PP57h9+wauVwUBTjTMmTNnSCaTFEoHjI6OkEqluDV+h0S6iWeeeYZw2OHB5ATzczPML0xzcvQk5y9eYGtnm5m5WcrFEpnMLpVaFYSgWiuTyWzQ0tKC4zgsLi9QCZzx7Ow8y8vLZLZ2QCjWNlbxPMPly+fZ2lpnYWGOQqHEg4dTtHW1MXruDKlEErT/ay81r8rm5iahSJSLFy/S0tLG7Vv3KJZLXL32PJ3dHUzeu08um+UgmyPuOJw9f46NtVUW5+eQoh7JCarlIrOzU6wsLrC9vYEUmkwmw97eVlB1KikWy2Q2tqjVaoeozBgEmny+QDZXoHegn53cDnu5LPsHefb3s5w5O4ptC2ZnZykWi9y+fZt0Os21a9cIhULcuXMHrTW7u7tsbGywurrK6uoq29vbZDIZwuEw8/PzbG5ucubMGU6cOIFt22xsbABw9uxZ+vr6qNVqZDIZent7GRwcZGZmhmw223g9e/Ysg4ODKKUOawBt22Z3d5ft7W0ikQhKqSA3YyGlRCk/K60kRCIhotEolmUhhMCyLJ8BCgZTShGLxRgYGCCVSgUe5PBaXV2lvb2d5uZWlpeX/fuUJBx2aG9v5+TJEZaXfZo25Pj96N29PUSicdbW1tjbzZBIpIjH4/T09JBIxNjdzWKMoaOjg2q1ysLCAqFQCNu26ezsJJPJcOv2HYrlEpo6hBPs7u5SLpcZ6OtnI7PZoKq7urqQUrK4eFgdIYQiFIrQ1NREf38/u7tZSqVKo4cnFosRjUYJ2Q5NTU1UKhUqpTKD/QNEIhF6eo6Ry+WZnZ0nlUrR1dFNc3Mz6XSa9fV1NB5KCSypGoyhUjbbmS1yuRyRSARHCtbX17EcxcDAACvLi4AkEnaCdS8RicRob+8kEvHn+mDyPrPTM74ySt9gSGlhWRa7u9vMz89TqVTY3t2io62dWDRMb28flmOzs5vFsizyhQOWF5eIJeK0tLU2oC3Ayuo6qVQTXd29LC2tBF2zQQpC+lBMCL9y4WgdnQhiH6UUnldjfXkFtMC27UYAvrK0TLlcpauri4ODA4wx9Pb2Eo1G6ezsZGtri3g8TktLC4uLiyilcByH5eVlhBA0NzfT1dWF1pp3332Xra0tH1pZFgcHB8zPz5PL5Rpyvr29zebmZsNDdXd3U6vVeO+999je3n4EnkmtNc3NzYyNjbG7u8vW1haWZVGr+e3EtVqtEd+4rtvAfnUhOxo/aO0He8VikWKxSCwWe+S7y8vLVKtVKpUKW1tbj8RNlUqFbDZLKBTCsqwgRvCoVquUSiWi0SiRSIRCoYDruuzv71MsFolGo2iticVinDhxgs3NTVzXr7Y9fvw4zz33HNFolNu3bx9aOyHY2NigWCwCkMvl2NvbwxhDJBJhcHCQTCbzCBtTn08ul0Mp1bA8R/Fv/Z/jOBhj2N7eRms/BnMch5aWFg4ODigWi1QqFUqlEvF4vPEM13Ub++F5Hu3t7QwNDbG2tsb+/j7r6+sUi0Wq1Sq5XI5KpeJbPilZXV2lXC7T1NSEZVlcuXKFp59+mrW1Nebm5hpnU0cFdWgSj8cJhULk83lqtRr7+/tUq9UGFNFaNxBIOp1+hJlcWVmhUChQrVbZ3d2lVqs15v94jFnfo8f3zLIszpw5E3jR2UZcsre3x+7uLi0tLYTD4cY+1uMa27aJRCLE43FWVlawbZv29nYWFhaIx+MopWhqauL555/n2LFj3L17l93dXaSUJJNJhoeH6erqasylVCqxurpKLBbDsixaW1t5/vnn6enpYXx8nJ2dnUfLaAqFAhsbG4RCIRzHoauri5mZmYYL7OnpaWxMsVgkn88jpQ9nxsfHSafTJBIJlFIsLCywsrJCJBLh1KnDJOLe3h6lUonh4WGMMUxPT7O1tUUoFCKTyXDv3j329vY4f/68/2MVrsvKygp7e3vE43GOHz9OuVxmZ2eHGzduUKlUSKfTdHR0kM363qanp4fOzk5KpRLGGObn56lWqwD09vZiWVZDaNbW1hqe4+DggOXlZSKRiF/aHmDoTCbToCGz2Sx37txhZ2eHEydOEIlEnkh9GmOIRqMMDQ01rNnOzg6Dg4P09/fz3nvvcfPmTRzHwXVdTpw4wc7ODuVymYcPH5JIJGhqamooc6lUagjr9vY23d3dpNNppqenmZ+fx3VdUqkUly9f5q233uLu3bsMDAwwOzuLbdskk0laW1s/QNnG43FSqRQAp0+f5u7du4yPj5PP52ltbaW1tZW5uTk6OjoYHBzknXfe4fbt21y6dMlv3CsUyOfzdHd3E4vFmJqaYnV1lUgkwsbGRkMupJS4rsvk5CSxWIy+vr7Gc+uGYmNjAyEE6XQaz/OwbZurV69y9+5dbt26xbVr1xgaGmJmZobt7W2y2SwjIyMAJJNJXNelubmZRCLBxMQEbW1tGGNYXFwkm80SDodpb28nFAphjKFSqbC+vt7YayEEp0+fxhjDj3/8Y5qamsjn8xSLRYwxdHV1NRyAMQb1m7/5m/9rPQ9x8uRJWlpaSKfTOI5DsVhkeHiY7u7uhiC2tLQQj8dJJBJEo9EGs1CHG3WrPzo6+oinqQv58PAwHR0djQNNJpMNSHjixAk6OzsbFh8gEokwNjbW8DStra0ND3Pu3DnC4TBKKZLJJE1NTTQ1NZFIJGhvb0cIQT6fJx6Pc+bMmUeUxrIshoaG6OjoIJFIEA6HaWpqIhaL0dTU1Jhba2trw/sJIQKCo+8DdKVSinQ6TVNTE1JK2traGgTJsWPHOH78OFJKOjs7qVarKKU4efJkwzOEw+GGZW9rayORSKC1JhwO+8RDOIxt2439C4fDRKNR0uk0yWSyITQALS0tGGMoFAoMDQ3R39/fmK8QglAoREtLC9Go3waSSCT8mKxQoLW1lbGxMR96K0UikaCtrY14PN4Yu36esViM4eFh2tvbcRyHeDxOc3NzALs8QqEQzc3NxOPxhtdOpVKEQqEGnI9EIpTLZXp6ehgaGsKyLKLRKC0tLbS3t1Or1RpwXEpJtVrl+PHj9PX1ARAOh0mlUvT29pJKpQI43EMoFCIUClEqlRBCMDY2RjKZRAiB4zgNcqC5uZlQKEQqlaK9vR0pJaFQiNbWVgqFwiP3HsnTGPPTeO+flYP5SXmFn1W/87NzEj99Lj9t3J/WKvtn5fU/jOsn7eV/zZ79rDX9f7m+/7fz+rPs/5PW8rPG/UljPinP82eRtf9nAHrwgoSlIbHEAAAAAElFTkSuQmCC") no-repeat',
						'float': 'left',
						width: '196px',
						height: '30px',
						cursor:'pointer',
						margin: '4px 6px 6px'
					},

					searchBox:
					{
						'float': 'right',
						'padding': '4px 6px',
						position:'relative'
					},

					searchInputBox:
					{
						font: '13px Arial, sans-serif',
						padding: '4px 4px',
						border: '1px solid #cacaca',
						'border-right': '0',
						width: '170px',
						margin:0
					},

					searchInputBoxIE:
					{
						height:25,
						margin:'0px 56px 0px 0px'
					},

					'searchSend' :
					{
						border: '1px solid #a9d03e',
						background: 'url("data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAElJREFUeNo8iDEOgCAQBDf3/ycZDfIDnqDQURwFJbeeAS0mszuoPaG06JzILSDrgVt3XLoJaUKYYHn+8XdyiDnw/fprXNvbI8AASHA8CsJpYA8AAAAASUVORK5CYII=") repeat-x',
						padding: '4px 6px',
						cursor: 'pointer',
						marginLeft: '-1px',
						color: '#333',
						font: '14px Arial, sans-serif'
					},

					searchSendIE:
					{
						padding: '4px 6px 3px',
						position:'absolute',
						top:5,
						right:10
					},

					weather:
					{
						float:'right',
						padding:'2px 10px 8px',
						margin:'7px 0 0',
						textAlign:'left',
						width:160,
						color:'#333',
						font: '13px Arial, sans-serif',
						overflow:'heddin',
						cursor:'pointer',
						position:'relative'
					},
					'weather-city':
					{
						border: '1px solid #cacaca',
						padding: '4px 6px',
						color: '#333',
						width:150,
						font: '13px Arial, sans-serif',
						margin:'-5px 0 0 -10px',
						outline:'none'
					},
					'weather-city-ul':
					{
						background:'#fff',
						listStyle:'none',
						top:0,
						margin:0,
						left:16,
						font: '13px Arial, sans-serif',
						border : '1px solid #c9c9c9',
						padding:0,
						borderTop : '0',
						width:180,
						position:'absolute',
						'-webkit-box-shadow': '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
						'-moz-box-shadow': '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
						'box-shadow': '2px 2px 10px 2px rgba(0, 0, 0, 0.2)',
						zIndex:99999999999,
						textAlign:'left'
					},
					'weather-city-li':
					{
						padding: '6px 10px',
						font: '13px Arial, sans-serif',
						background:'none',
						color:'#333'
					},
					'weather-city-li-hover':
					{
						color:'#fff',
						font: '13px Arial, sans-serif',
						background:'#318cca'
					},
					menu:
					{
						'display' : 'inline-block',
						border:'1px solid #d8d8d8',
						font: '13px Arial, sans-serif',
						backgroundImage:'url(data:;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAcCAIAAAAvP0KbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADVJREFUeNpkw7kJADAMBDBM9t/V/4ObQIprItDZXZqZt7u/VYWZiRGB7o5mhqpKIoLMfAUYAMHlUJ6Y9bZyAAAAAElFTkSuQmCC)',
						backgroundRepeat:'repeat-x',
						margin:'3px 40px 0 0',
						padding:0
					},
					menuIE:
					{
						'float' : 'right'
					},
					'menuIE-ul-li':
					{
						'float':'left'
					},
					'menu-ul-li':
					{
						display:'inline-block',
						font: '13px Arial, sans-serif',
						padding:'6px 0',
						borderRight:'1px solid #d8d8d8',
						position:'relative'
					},
					'menu-ul-li-a':
					{
						color:'#333',
						font: '13px Arial, sans-serif',
						textDecoration:'none'
					},
					'menu-ul-li-a-hover':
					{
						font: '13px Arial, sans-serif',
						color:'#f6788c'
					},
					'menu-ul-li-ul':
					{
						position:'absolute',
						padding:0,
						background:'#f1f1f1',
						listStyle:'none',
						top:27,
						font: '13px Arial, sans-serif',
						left:'-1px',
						textAlign:'left',
						border:'1px solid #d8d8d8',
						whiteSpace:'nowrap'
					},
					'menu-ul-li-ul-li':
					{
						padding:'6px 0',
						font: '13px Arial, sans-serif',
						whiteSpace:'nowrap',
						borderBottom:'1px solid #d8d8d8'
					}
				}
			});
		});
	});
	framework.extension.attachEvent("setWeather", function(data){
		WT.weatherRender(data);
	});

});