var JSON;if(!JSON){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());

function getTextNodesIn(node) {
	var textNodes = [];
	if (node.nodeType == 3) {
		textNodes.push(node);
	} else {
		var children = node.childNodes;
		for (var i = 0, len = children.length; i < len; ++i) {
			if((children[i].nodeName != 'SCRIPT') && (children[i].nodeName != 'STYLE'))
				textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
		}
	}
	return textNodes;
}
function setSelectionRange(words) {
	if (!document.body)
		return;
	el = document.body;
	if (document.createRange && window.getSelection) {
		var range = document.createRange();
		range.selectNodeContents(el);
		for (var x in words) {
			var word = words[x];		
			var textNodes = getTextNodesIn(document.body);
			for (var i = 0, textNode; i < textNodes.length; i++) {
				var textNode = textNodes[i];
				var start = textNode.nodeValue.length - 1;
				word = word.toLowerCase();
				while (textNode.nodeValue.toLowerCase().lastIndexOf(word, start) >= 0 ) {
					range.setStart(textNode, textNode.nodeValue.lastIndexOf(word, start));
					range.setEnd(textNode, textNode.nodeValue.lastIndexOf(word, start) + word.length);
					var highlightDiv = document.createElement('span');
					highlightDiv.style.backgroundColor = 'yellow';
					range.surroundContents( highlightDiv );
					start = textNode.nodeValue.toLowerCase().lastIndexOf(word, start);
				}
			}
		}

	}
}
function setSelectionRangeIE(words) {
	for (var x in words) {
		var word = words[x];
		getNext(word);
	}
}
function getNext(word) {
	var range = document.body.createTextRange();
	while ((result = range.findText(word, 10000, 0))) {
		var html = range.htmlText;
		var node = range.parentElement();
		while (node != document.body) {
			if (node.nodeName == 'A' || node.nodeName == 'STYLE' || node.nodeName == 'SCRIPT'
				|| node.nodeName == 'NOSCRIPT' || node.className == 'GetItFreeNotififer')
			{
				range.collapse(false);
				return;
			}
			node = node.parentNode;
		}
		var tmpRange = range.duplicate();
		tmpRange.collapse(true);
		tmpRange.moveStart("character", -1);
		var leftContext = tmpRange.text;
		tmpRange = range.duplicate();
		tmpRange.collapse(false);
		tmpRange.moveEnd("character", 1);
		var rightContext = tmpRange.text;
		range.pasteHTML('<span style="background-color: #FFFF00;" class="HighlightMakr">' + html + '</span>');
	}
}
framework.browser.attachEvent('DocumentComplete', function(e){
	var isIE = '\v' == 'v';
	if (document.body)
		framework.extension.getItem('words', function(words) {
			words = (words && words != 'undefined') ? JSON.parse(words) : [];
			framework.extension.fireEvent('updateBadge', words.length);
			if (!isIE) {
				setSelectionRange(words);
			}
			else {
				setSelectionRangeIE(words);
			}
		});
});
framework.extension.attachEvent('AddWord', function(e) {
	var isIE = '\v' == 'v';
	framework.extension.getItem('words', function(words) {
		words = words ? JSON.parse(words) : [];
		var word = getSelectedText();
		if (word.length == 0)
			return;
		for(x in words) {
			if (words[x] == word)
				return;
		}
		words.push(word);
		if (words.length > 100)
			words.shift();
		framework.extension.setItem('words', JSON.stringify(words));
        if (!isIE) {
			setSelectionRange(words);
		}
        else {
            setSelectionRangeIE(words);
        }
		framework.extension.fireEvent('updateBadge', words.length);
	});
});
function getSelectedText() {
  if (window.getSelection) {  // all browsers, except IE before version 9
		var selRange = window.getSelection ();
		return selRange.toString();
	}
	else {
		if (document.selection) {        // Internet Explorer
			var range = document.selection.createRange ();
			return range.text;
		}
	}
}