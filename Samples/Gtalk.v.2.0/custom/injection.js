(function(window){

var $ext = function(){};

	$ext.prototype._ =
	{
		"ProjectName": "Gtalk",
		"ObjectTag"  : "gtalk"
	};

	$ext.prototype.objectToStyle = function(_object)
	{
		var css = '';
		var self = this;

		jQuery.each(_object, function(selector, data){

			css += "sf" + self.get("ObjectTag")+ ' ' + selector.replace(',', ', ' + "sf" + self.get("ObjectTag")) + "{";

			jQuery.each(data, function(key, value){
				css += key + ":" + value + ";";
			});

			css += "}";
		});

		var head = document.getElementsByTagName('head')[0];

		var sheet = document.createElement( 'style' );

		sheet.type = 'text/css';

		head.appendChild( sheet );

		sheet.setAttribute( "id" , "styleFor" + this.get("ProjectName") );

		if( sheet.styleSheet )
		{
			sheet.styleSheet.cssText = css;
		}
		else
		{
			sheet.appendChild( document.createTextNode(css) );
		}
	};

	$ext.prototype.set = function(key, value)
	{
		return this._[key] = value;
	};

	$ext.prototype.get = function(key, _default)
	{
		return this._[key] == undefined ? (_default == undefined ? false : _default) : this._[key];
	};

	$ext.prototype.initialize = function(options)
	{
		if(options != undefined)
		{ this._ = jQuery.extend(this._, options); }

		return this;
	};

	$ext.prototype.create = function(options)
	{
		options = jQuery.extend({"tag" : null, "to" : null, "method" : "append", "id" : null, "className" : null, "type" : null}, options);

		if(options["tag"] == null) { return null; }

		var tag = jQuery("<sf" + options["tag"] + "/>");

		jQuery(options["to"])[options["method"]](tag);

		if(options["id"] != null)
		{
			tag.attr("id", options["id"]);
			this.set(options["id"], tag);
		}

		if(options["className"] != null)
			{ tag.addClass(options["className"]); }

		if(options["type"] == "text" || options["type"] == "password")
		{
			tag.attr("contenteditable", "true");

			if(options["type"] == "password")
			{
				var self = this;

				var toEnd = function(contentEditableElement)
				{
					var range, selection;
					if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
					{
						range = document.createRange();//Create a range (a range is a like the selection but invisible)
						range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
						range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
						selection = window.getSelection();//get the selection object (allows you to change selection)
						selection.removeAllRanges();//remove any selections already made
						selection.addRange(range);//make the range you have just created the visible selection
					}
					else if(document.selection)//IE 8 and lower
					{
						range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
						range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
						range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
						range.select();//Select the range (make it the visible selection
					}

				};

				self.set('#'+options["id"]+"-value", '');
				tag.keyup(function(){

					var value = jQuery(this).text();
					var val = value.replace(/×|\*/ig, '');
					var p = self.get('#'+options["id"]+"-value");

						p = p.substring(0, value.length)
						p += val;

					jQuery(this).text(p.replace(/[^*]/ig,($.browser.msie) ? '*' : '×'));
					self.set('#'+options["id"]+"-value", p);

					toEnd(this);
				});
			}
		}

		return tag;
	};

	$ext.prototype.__createBody = function()
	{
		this.create({"tag" : this.get("ObjectTag"), "to" : $("body"), "method" : "prepend", "id" : "sf-" + this.get("ProjectName")});
	};

	$ext.prototype.getBody = function()
	{
		return this.get("sf-" + this.get("ProjectName"));
	};

	$ext.prototype["widget-header"] = function(options)
	{
		return this.create({"tag" : "header", "to" : this.getBody(), "method" : "prepend", "id" : "sf-header"});
	};

	$ext.prototype["widget-container"] = function(options)
	{
		return this.create({"tag" : "container", "to" : this.getBody(), "id" : "sf-container"});
	};

	$ext.prototype["widget-footer"] = function(options)
	{
		return this.create({"tag" : "footer", "to" : this.getBody(), "id" : "sf-footer"});
	};

	$ext.prototype.init = function()
	{
		this.objectToStyle(this.get('style'));
		this.__createBody();

		var self = this;

		jQuery.each(this.get('widgets'), function(widget, options){

			if(self['widget-' + widget] != undefined)
			{
				self['widget-' + widget](options);
			}
		});
	};

	window.ext = $ext;

})(window);