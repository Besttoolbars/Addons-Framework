$.fn.center=function(a){var b=$(window),c=b.scrollTop();return this.each(function(){var f=$(this),e=$.extend({against:"window",top:false,topPercentage:0.5},a),d=function(){var h,g,i;if(e.against==="window"){h=b;}else{if(e.against==="parent"){h=f.parent();c=0;}else{h=f.parents(against);c=0;}}g=((h.width())-(f.outerWidth()))*0.5;i=((h.height())-(f.outerHeight()))*e.topPercentage+c;if(e.top){i=e.top+c;}f.css({left:g,top:i});};d();b.resize(d);});};
var mainWindowHeight=360;
var mainWindowWidth=370;

var friendList=[];
var presenceList={};
var tabId;
var closeBubble=true;

var baseUrl;

var fontStyle="font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 50!important; margin-bottom: 0 !important; font-size: 11pt !important;"
var fontMessageChatStyle="font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 50!important; margin-bottom: 0 !important; font-size: 10pt !important;"
var fontJidChatStyle="font-family:Georgia,serif !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 100!important; margin-bottom: 0 !important; font-size: 10pt !important;"


framework.browser.attachEvent("DocumentComplete",function(data){
	framework.extension.fireEvent('onDocumentComplete', data, function(res){});
});

framework.extension.attachEvent('refreshBubble',function(data) {  
	if (window.top!=window)return;
	
	var checkGtalkElement=document.getElementById("ci_ext_gtalkDiv");
	if (!checkGtalkElement) openBubble(data);
	
	
 });


framework.extension.attachEvent('showBubble',function(data) {  
	if (window.top!=window)return;
	openBubble(data);
	
	
 });
 
 framework.extension.attachEvent('closeBubble',function(data) {  
	if (window.top!=window)return;
	
	var checkGtalkElement=document.getElementById("ci_ext_gtalkDiv");
	if (checkGtalkElement) 
	{
		$(checkGtalkElement).hide("explode", 500);
		framework.extension.detachEvent('onConnectRequest',onConnectRequest);
		framework.extension.detachEvent('onConnect',onConnect);
		framework.extension.detachEvent('onConnectStarted',onConnectStarted);
		framework.extension.detachEvent('onConnect',onConnect);
		framework.extension.detachEvent('onConnectStarted',onConnectStarted);
		framework.extension.detachEvent('onOpenChatWindow',onOpenChatWindow);
		framework.extension.detachEvent('onSendChatMessage',onSendChatMessage);
		framework.extension.detachEvent('onChatMessage',onChatMessage);
		framework.extension.detachEvent('onCloseChatWindow',onCloseChatWindow);
		framework.extension.detachEvent('onPresence',onPresence);
		document.documentElement.removeChild(checkGtalkElement);
	}
	
 });
 
 
 
function openBubble(data) 
{

framework.extension.fireEvent('getBaseUrl', {}, function(url){
	if (window.top!=window) return;
	baseUrl=url;
	var checkGtalkElement=document.getElementById("ci_ext_gtalkDiv");
	if (checkGtalkElement) return;
	friendList=[];
	$gtalkDiv=$('<div/>');
	$gtalkDiv.attr("id","ci_ext_gtalkDiv");
	$gtalkDiv.attr("class","ci_ext_gtalkDiv");
	$gtalkDiv.attr("style","visibility:hidden; position:absolute; top:0px; background-color:#357ae8; border:1px solid #2f5bb7; cursor:move; z-index:99999 !important;");
	$gtalkDiv.css("width","400px");
	$gtalkDiv.css("height","400px");
	
	$topInnerGtalkDiv=$('<div/>');
	$topInnerGtalkDiv.attr({
		"id":"ci_ext_topInnerGtalkDiv",
		"class":"ci_ext_topInnerGtalkDiv"});
	////	$innerGtalkDiv.css("width","386px");
	$topInnerGtalkDiv.css({
		"height":"27px",
		"background":"url('"+baseUrl+"window_bg.gif')",
		"position":"relative"});
	
	$innerGtalkDiv=$('<div/>');
	$innerGtalkDiv.attr("id","ci_ext_innerGtalkDiv");
	$innerGtalkDiv.attr("class","ci_ext_innerGtalkDiv");
	$innerGtalkDiv.attr("style","border:1px solid #2f5bb7; cursor:default; border-top:0px;");
////	$innerGtalkDiv.css("width","386px");
	$innerGtalkDiv.css("height","366px");
	//$innerGtalkDiv.css("margin-top","27px");
	$innerGtalkDiv.css("margin-bottom","10px");
	$innerGtalkDiv.css("margin-left","1px");
	$innerGtalkDiv.css("margin-right","1px");
	$innerGtalkDiv.css("backgroundColor","white");
	$innerGtalkDiv.css("position","relative");

	$loginDiv=$('<div/>');
	$loginDiv.attr("id","ci_ext_loginDiv");
	$loginDiv.css("width",mainWindowWidth+"px");
	$loginDiv.css("height",mainWindowHeight+"px");
	$loginDiv.css("position","relative");
	$loginDiv.css("backgroundColor","white");
	
	$waitLoginDiv=$('<div/>');
	$waitLoginDiv.attr("id","ci_ext_waitLoginDiv");
	$waitLoginDiv.css("width",mainWindowWidth+"px");
	$waitLoginDiv.css("height",mainWindowHeight+"px");
	$waitLoginDiv.css("position","relative");
	$waitLoginDiv.css("backgroundColor","white");
		
	$waitLoginImageDiv=$('<div/>');
	$waitLoginImageDiv.attr("id","ci_ext_waitLoginImageDiv");
	$waitLoginImageDiv.css("width","32px");
	$waitLoginImageDiv.css("height","32px");
	$waitLoginImageDiv.css("position","relative");
	
	$waitLoginImage=$('<img/>');
	$waitLoginImage.attr("id","ci_ext_waitLoginImage");
	$waitLoginImage.attr("src",baseUrl+"loader.gif");
	$waitLoginImage.css("position","relative");
	
	$loginImageDiv=$('<div align="center"/>');
	$loginImageDiv.attr("id","ci_ext_loginImageDiv");
	$loginImageDiv.attr("style","width:250px; height:100px; background-color:white; position:relative;");
	
	$loginImage=$('<img/>');
	$loginImage.attr("id","ci_ext_loginImage");
	$loginImage.attr("src",baseUrl+"gtalk_logo.png");
	$loginImage.css("position","relative");
	
	
	$loginCommonDiv=$('<div align="center"/>');
	$loginCommonDiv.attr("id","ci_ext_loginCommonDiv");
	$loginCommonDiv.attr("style","width:250px; height:100px; background-color:white; position:relative;");
	
	$loginCenterDiv=$('<div/>');
	$loginCenterDiv.attr("id","ci_ext_loginCenterDiv");
	$loginCenterDiv.attr("style","width:250px; height:200px; background-color:white; position:relative;");
	
	$loginOuterDiv=$('<div/>');
	$loginOuterDiv.attr("id","ci_ext_loginOuterDiv");
	$loginOuterDiv.attr("style","padding-bottom:5px;");
	
	$passwordOuterDiv=$('<div/>');
	$passwordOuterDiv.attr("id","ci_ext_passwordOuterDiv");
	$passwordOuterDiv.attr("style","padding-bottom:5px;");
	
	$loginButtonOuterDiv=$('<div/>');
	$loginButtonOuterDiv.attr("id","ci_ext_loginButtonOuterDiv");
	
	$loginLabel=$("<div></div>");
	$loginLabel.attr("id","ci_ext_loginLabel");
	$loginLabel.css("top","0px");
	//$loginLabel.text("Login:");
	$loginFont=$("<font>Login:</font>");
	$loginFont.attr("style","font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 100!important; font-size: 11pt !important; margin-bottom: 0 !important;");
	$loginLabel.append($loginFont);
	
	$loginInput=$("<input/>");
	$loginInput.attr("id","ci_ext_loginInput");
	$loginInput.attr("style","font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 100!important; font-size: 11pt !important; margin-bottom: 0 !important; width: 200px !important; height:20px!important;");
	$loginInput.attr("value","");
	$loginInput.attr("type","text");
	$loginInput.css("top","0px");
	
	$passwordLabel=$("<div></div>");
	$passwordLabel.attr("id","ci_ext_passwordLabel");
	//$passwordLabel.text("Password:");
	$passwordFont=$("<font>Password:</font>");
	$passwordFont.attr("style","font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 100!important; font-size: 11pt !important; margin-bottom: 0 !important;");
	
	$passwordLabel.append($passwordFont);
	
	$passwordInput=$("<input/>");
	$passwordInput.attr("id","ci_ext_passwordInput");
	$passwordInput.attr("style","font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 100!important; font-size: 11pt !important; margin-bottom: 0 !important; width: 200px !important; height:20px!important;");
	$passwordInput.attr("value","");
	$passwordInput.attr("type","password");
	
	$loginButton=$("<input/>");
	$loginButton.attr("id","ci_ext_loginButton");
	$loginButton.attr("style","font-family:Georgia,serif !important; color:black !important; font-variant: small-caps !important; text-transform: none !important; font-weight: 100!important; font-size: 11pt !important; margin-bottom: 0 !important; width: 100px !important; height:30px!important;");
	$loginButton.attr("type","button");
	$loginButton.attr("value","Login");
	
	$saveAuthCheckBoxDiv=$("<div/>");
	$saveAuthCheckBoxDiv.attr({
		"id" : "ci_ext_saveAuthCheckBoxDiv"
		});
		
	$saveAuthCheckBox=$("<input/>");
	$saveAuthCheckBox.attr({
		"id" : "ci_ext_saveAuthCheckBox",
		"type" : "checkbox"
		});
	
	$saveAuthLabel=$("<label/>");
	$saveAuthLabel.attr({
		"id" : "ci_ext_saveAuthLabel",
		"style" : fontStyle
		});
	$saveAuthLabel.css({
		"margin-left" : "5px"
		});
	$saveAuthLabel.text("Save Authorization");
		
	
	$(document.documentElement).append($gtalkDiv);
	//$gtalkDiv.hide();
		$gtalkDiv.append($topInnerGtalkDiv);
		$gtalkDiv.append($innerGtalkDiv);

		$innerGtalkDiv.append($loginDiv);
		$innerGtalkDiv.append($waitLoginDiv);
	
		$waitLoginDiv.append($waitLoginImageDiv);
		$waitLoginImageDiv.append($waitLoginImage);
	
		$waitLoginDiv.center({against : 'parent'});
		$waitLoginImageDiv.center({against : 'parent'});
	
		$loginDiv.append($loginCenterDiv);
	
		$loginCenterDiv.append($loginImageDiv);
		$loginImageDiv.append($loginImage);
		$loginCenterDiv.append($loginCommonDiv);
	
		$loginCommonDiv.append($loginOuterDiv);
		$loginCommonDiv.append($passwordOuterDiv);
		
		$loginCommonDiv.append($saveAuthCheckBoxDiv);
		$saveAuthCheckBoxDiv.append($saveAuthCheckBox);
		$saveAuthCheckBoxDiv.append($saveAuthLabel);
		
		$loginCommonDiv.append($loginButtonOuterDiv);
		
		$loginCenterDiv.center({against : 'parent'});
	
		$loginOuterDiv.append($loginLabel);
		$loginOuterDiv.append($loginInput);
	
		$passwordOuterDiv.append($passwordLabel);
		$passwordOuterDiv.append($passwordInput);
	
		$loginButtonOuterDiv.append($loginButton);
	
		$loginDiv.center({against : 'parent'});
		$gtalkDiv.draggable({ cancel: "div.ci_ext_innerGtalkDiv" });
	
	
	
	///////////////////////////////////////friend window/////////////////////////////
	$friendsTopDiv=$('<div/>');
	$friendsTopDiv.attr({
		"id":"ci_ext_friendsTopDiv",
		"class":"ci_ext_friendsTopDiv"});
	$friendsTopDiv.css({
		"position":"relative",
		"background-color":"white"});
		
	$friendListDiv=$('<div/>');
	$friendListDiv.attr("id","ci_ext_friendListDiv");
	$friendListDiv.attr("class","ci_ext_friendListDiv");
	$friendListDiv.css("width",(mainWindowWidth-8)+"px");
	$friendListDiv.css("height",(mainWindowHeight-68)+"px");
	$friendListDiv.css("position","relative");
	$friendListDiv.css("backgroundColor","white");
	
	$friendBigDiv=$('<div/>');
	$friendBigDiv.attr("id","ci_ext_friendBigDiv");
	$friendBigDiv.attr("class","ci_ext_friendBigDiv");
	$friendBigDiv.css("width",(mainWindowWidth-8)+"px");
	$friendBigDiv.css("height",(mainWindowHeight-8)+"px");
	$friendBigDiv.css("position","relative");
	$friendBigDiv.css("backgroundColor","white");
	
	
	$friendsImageDiv=$('<div align="left"/>');
	$friendsImageDiv.attr("id","ci_ext_friendsImageDiv");
	$friendsImageDiv.attr("style","width:250px; height:60px; background-color:white; display:inline !important; position:relative;");
	
	$friendsTopRightDiv=$('<div"/>');
	$friendsTopRightDiv.attr("id","ci_ext_friendsTopRightDiv");
	$friendsTopRightDiv.attr("style","background-color:white; float:right !important; display:inline !important; position:relative;");
	
	$logoutButton=$("<input/>");
	$logoutButton.attr({
		"id":"ci_ext_logoutButton",
		"style":fontStyle,
		"type":"button",
		"value":"Logout"});
	$logoutButton.css({
		"width":"100px",
		"height":"30px"});
	
	$friendsImage=$('<img/>');
	$friendsImage.attr("id","ci_ext_friendsImage");
	$friendsImage.attr("src",baseUrl+"gtalk_logo.png");
	$friendsImage.css("position","relative");
		
	$innerGtalkDiv.append($friendBigDiv);
	$friendsImageDiv.append($friendsImage);
	$friendBigDiv.append($friendsTopDiv);
	$friendsTopDiv.append($friendsImageDiv);
	$friendsTopDiv.append($friendsTopRightDiv);
	$friendsTopRightDiv.append($logoutButton);
	$friendBigDiv.append($friendListDiv);
	
	$friendBigDiv.center({against : 'parent'});
	$friendBigDiv.hide();
	///////////////////////////////////////////////////////////////////////////////////////////
	
	////////////////////////////////////////////chat window//////////////////////////////////
	$chatDiv=$('<div/>');
	$chatDiv.attr("id","ci_ext_chatDiv");
	$chatDiv.attr("style","position: relative; background-color:white;");
	$chatDiv.css("width",mainWindowWidth+"px");
	$chatDiv.css("height",mainWindowHeight+"px");
	
	$chatTitleDiv=$('<div/>');
	$chatTitleDiv.attr("id","ci_ext_chatTitleDiv");
	$chatTitleDiv.attr("style","position: relative; background-color:white;");
	$chatTitleDiv.css("width",mainWindowWidth+"px");
	
	$chatImageDiv=$('<div/>');
	$chatImageDiv.attr("id","ci_ext_chatImageDiv");
	$chatImageDiv.attr("style","width:250px; height:60px; background-color:white; position:relative; display:inline !important;");
	
	$chatImage=$('<img/>');
	$chatImage.attr("id","ci_ext_chatImage");
	$chatImage.attr("src",baseUrl+"gtalk_logo.png");
	$chatImage.css("position","relative");
	
	$chatImageDiv.append($chatImage);
	
	$chatTitleJidDiv=$('<div/>');
	$chatTitleJidDiv.attr("id","ci_ext_chatTitleJidDiv");
	$chatTitleJidDiv.attr("style","width:250px; height:60px; left:10px; background-color:white; position:relative; display:inline !important;");
	
	$chatTitleJidFont=$("<font/>");
	$chatTitleJidFont.attr("id","ci_ext_chatTitleJidFont");
	$chatTitleJidFont.attr("style",fontStyle);
	
	$chatTitleJidDiv.append($chatTitleJidFont);
		
	$chatMainMessageFieldDiv=$('<div/>');
	$chatMainMessageFieldDiv.attr("id","ci_ext_chatMainMessageFieldDiv");
	$chatMainMessageFieldDiv.attr("style","position: relative; background-color:white; border:1px solid black !important;  margin-top:10px; padding: 2px !important; overflow:auto;");
	$chatMainMessageFieldDiv.css("width",(mainWindowWidth-6)+"px");
	$chatMainMessageFieldDiv.css("height","180px");
	
	$chatMessageTextareaDiv=$('<div/>');
	$chatMessageTextareaDiv.attr("id","ci_ext_chatMessageTextareaDiv");
	$chatMessageTextareaDiv.attr("style","position: relative; margin-top:5px; background-color:white;");
	$chatMessageTextareaDiv.css("width",mainWindowWidth+"px");
	
	$chatBottomButtonsDiv=$('<div/>');
	$chatBottomButtonsDiv.attr("id","ci_ext_chatBottomButtonsDiv");
	$chatBottomButtonsDiv.attr("style","position: relative; background-color:white;");
	$chatBottomButtonsDiv.css("width",mainWindowWidth+"px");
	
	$chatSendButtonDiv=$('<div align="right"/>');
	$chatSendButtonDiv.attr("id","ci_ext_chatSendButtonDiv");
	$chatSendButtonDiv.attr("style","position: relative; background-color:white; display:inline !important; float: right !important;");
	
	$chatBackButtonDiv=$('<div align="left"/>');
	$chatBackButtonDiv.attr("id","ci_ext_chatBackButtonDiv");
	$chatBackButtonDiv.attr("style","position: relative; background-color:white; display:inline !important;");
	//$chatSendButtonDiv.css("width",mainWindowWidth+"px");

	$chatMessageTextarea=$("<textarea/>");
	$chatMessageTextarea.attr("id","ci_ext_chatMessageTextarea");
	$chatMessageTextarea.attr("style","position: relative; background-color:red; overflow:auto; resize: none !important; outline: 0 !important; background-color:white !important; margin:0px !important; border:1px solid black !important; padding:0px !important;");
	$chatMessageTextarea.css("width",(mainWindowWidth-2)+"px");
	$chatMessageTextarea.css("height","50px");

	$chatSendButton=$("<input/>");
	$chatSendButton.attr("id","ci_ext_chatSendButton");
	$chatSendButton.attr("style",fontStyle);
	$chatSendButton.css("width","100px");
	$chatSendButton.css("height","30px");
	$chatSendButton.attr("type","button");
	$chatSendButton.attr("value","Send");
	
	$chatBackButton=$("<input/>");
	$chatBackButton.attr("id","ci_ext_chatBackButton");
	$chatBackButton.attr("style",fontStyle);
	$chatBackButton.css("width","100px");
	$chatBackButton.css("height","30px");
	$chatBackButton.attr("type","button");
	$chatBackButton.attr("value","Go back");
	
	
	
	$innerGtalkDiv.append($chatDiv);
	$chatDiv.append($chatTitleDiv);
	$chatTitleDiv.append($chatImageDiv);
	$chatTitleDiv.append($chatTitleJidDiv);
	$chatDiv.append($chatMainMessageFieldDiv);
	$chatDiv.append($chatMessageTextareaDiv);
	$chatDiv.append($chatBottomButtonsDiv);
	$chatBottomButtonsDiv.append($chatBackButtonDiv);
	$chatBottomButtonsDiv.append($chatSendButtonDiv);
	
	$chatMessageTextareaDiv.append($chatMessageTextarea);
	$chatSendButtonDiv.append($chatSendButton);
	$chatBackButtonDiv.append($chatBackButton);
	
	$chatDiv.center({against : 'parent'});
	
	$chatDiv.hide();
	/////////////////////////////////////////////////////////////////////////////////////////////////////
	$loginDiv.hide();
	
	$gtalkDiv.hide();
	$gtalkDiv.css({"visibility":"visible"});
	$gtalkDiv.show(500);
	
	//TODO:
	framework.extension.detachEvent('onConnectRequest',onConnectRequest);
	framework.extension.attachEvent('onConnectRequest',onConnectRequest);
	
	framework.extension.detachEvent('onConnect',onConnect);
	framework.extension.attachEvent('onConnect',onConnect);
	
	framework.extension.detachEvent('onConnectStarted',onConnectStarted);
	framework.extension.attachEvent('onConnectStarted',onConnectStarted);
	
	framework.extension.detachEvent('onDisconnect',onDisconnect);
	framework.extension.attachEvent('onDisconnect',onDisconnect);
	
	framework.extension.detachEvent('onDisconnectStarted',onDisconnectStarted);
	framework.extension.attachEvent('onDisconnectStarted',onDisconnectStarted);
	
	framework.extension.detachEvent('onOpenChatWindow',onOpenChatWindow);
	framework.extension.attachEvent('onOpenChatWindow',onOpenChatWindow);
	
	framework.extension.detachEvent('onSendChatMessage',onSendChatMessage);
	framework.extension.attachEvent('onSendChatMessage',onSendChatMessage);
	
	framework.extension.detachEvent('onChatMessage',onChatMessage);
	framework.extension.attachEvent('onChatMessage',onChatMessage);
	
	framework.extension.detachEvent('onCloseChatWindow',onCloseChatWindow);
	framework.extension.attachEvent('onCloseChatWindow',onCloseChatWindow);
	
	
	framework.extension.fireEvent('connectRequest', {}, function(res){});
	
				
    $loginButton.bind('click', function () {
		framework.extension.fireEvent('connect', {userName: $loginInput.get(0).value, userPassword: $passwordInput.get(0).value, saveAuth : $saveAuthCheckBox.get(0).checked }, function(res){});
    });
	
	 $logoutButton.bind('click', function () {
		framework.extension.fireEvent('logout', {}, function(res){});
    });
});

}

function onChatMessage(res,callback){
		if (window.top!=window)return;
		appendMessageToChat(res.jid,res.message);
	}


function onSendChatMessage(res,callback){
		if (window.top!=window)return;
		appendMessageToChat("me",res.message);
		$('#ci_ext_chatMessageTextarea').get(0).value="";
	}


function onOpenChatWindow(res,callback){
		if (window.top!=window)return;
		initChatWindow(res);
}

function onCloseChatWindow(res,callback){
	if (window.top!=window)return;
	$('#ci_ext_chatDiv').fadeOut(500,function(){
		$waitLoginDiv.fadeIn(500);
		framework.extension.fireEvent('connectRequest', {}, function(res){});	
	});		
}


function onConnectStarted(res,callback){
		if (window.top!=window) return;
		$loginDiv.fadeOut(500, function() {
			if ($('#ci_ext_friendBigDiv').is(":visible") || res.status.state=="connected") return;
			$waitLoginDiv.fadeIn(500);
		});
}

function onDisconnectStarted(res,callback){
		if (window.top!=window)return;
		$('#ci_ext_friendBigDiv').fadeOut(500, function() {
			framework.extension.fireEvent('getStatus', {}, function(status){
				if ($loginDiv.is(":visible") || status.state=="notConnected") return;
				$waitLoginDiv.fadeIn(500);
			});
			
		});
}


function onConnect(res,callback){
		if (window.top!=window)return;
		friendList=res.friendList;
		var hiddableElement;
	
		if ($('#ci_ext_waitLoginDiv').is(":visible"))
		{	
			hiddableElement=$('#ci_ext_waitLoginDiv');
		}
		else
		{
			hiddableElement=$loginDiv;
		}

		
		$(hiddableElement).fadeOut(500,function(){
			if (res.status.state=="notConnected")
			{
				$loginDiv.fadeIn(500);
			}
			else
			{
				$('#ci_ext_friendBigDiv').fadeIn(500);
				initFriendWindow();
				framework.extension.detachEvent('onPresence',onPresence);
				framework.extension.attachEvent('onPresence',onPresence);
				framework.extension.fireEvent('sendPresence', {}, function(res){});
			}
		});
}

function onPresence(res,callback)
{
	presenceList=res;
	initPresence(presenceList);
}

function onDisconnect(res,callback){
	if (window.top!=window)return;
	
	var hiddableElement;
	
	if ($('#ci_ext_waitLoginDiv').is(":visible"))
	{
		hiddableElement=$('#ci_ext_waitLoginDiv');
	}
	else 
	{
		hiddableElement=$('#ci_ext_friendBigDiv');
	}
	
	$(hiddableElement).fadeOut(500,function(){
		$loginDiv.fadeIn(500);
	});
}


function onConnectRequest(res,callback)
{
	if (window.top!=window)return;
	if (res.status.state=="connected")
	{	
		friendList=res.friendList;
		presenceList=res.presenceList;
		$('#ci_ext_waitLoginDiv').fadeOut(500,function(){
			$('#ci_ext_friendBigDiv').fadeIn(500);
			initFriendWindow();
			framework.extension.detachEvent('onPresence',onPresence);
			framework.extension.attachEvent('onPresence',onPresence);
		});
	}
	else if (res.status.state=="chatting")
	{
		initChatWindow(res.status);
	}
	else if (res.status.state=="notConnected")
	{
		$waitLoginDiv.fadeOut(500, function() {
			$loginDiv.fadeIn(500);
		});			
	}
}

 
function clearFriendTable()
{
	$('#ci_ext_friendListDiv').empty();
}

function clearChatWindow()
{
	$('#ci_ext_chatMainMessageFieldDiv').empty();
}
 
function appendFriendInTable(friend)
{
	$friendDiv=$('<div/>');
	$friendDiv.attr("id","ci_ext_friendDiv_"+friend.jid);
	$friendDiv.attr("jid",friend.jid);
	$friendDiv.attr("class","ci_ext_friendDiv");
	$friendDiv.attr("style","margin: 5px; border:0px solid #E3E4FA; cursor:pointer;");
	$friendDiv.css("width",(mainWindowWidth-18)+"px");
	$friendDiv.css("height","22px");
	$friendDiv.css("position","relative");
	$friendDiv.css("backgroundColor","white");
	
	$friendJidDiv=$('<div align="left"/>');
	$friendJidDiv.attr("id","ci_ext_friendJidDiv_"+friend.jid);
	$friendJidDiv.attr("style","padding-left:5px !important; display:inline !important");
	$friendJidDiv.attr("class","ci_ext_friendJidDiv");
	$friendJidDiv.css("width",(mainWindowWidth-50)+"px");
	$friendJidDiv.css("position","relative");
	$friendJidDiv.css("backgroundColor","inherit");
	
	$friendStatusIconDiv=$('<div/>');
	$friendStatusIconDiv.attr({
		"id":"ci_ext_friendStatusIconDiv_"+friend.jid,
		"class":"ci_ext_friendStatusIconDiv"
		});
	$friendStatusIconDiv.css({
		"position":"relative",
		"background-color":"inherit",
		"float" : "right !important",
		"display" : "inline !important",
		"width" : "16px",
		"height" : "22px"
		});
		
	$friendStatusIconInnerDiv=$('<div/>');
	$friendStatusIconInnerDiv.attr({
		"id":"ci_ext_friendStatusIconInnerDiv_"+friend.jid,
		"class":"ci_ext_friendStatusIconInnerDiv"
		});
	$friendStatusIconInnerDiv.css({
		"position":"relative",
		"background-color":"inherit",
		"width" : "16px",
		"height" : "16px"
		});
		
	$friendStatusIcon=$('<img/>');
	$friendStatusIcon.attr("id","ci_ext_friendStatusIcon_"+friend.jid);
	$friendStatusIcon.attr("src",baseUrl+"offline.png");
	$friendStatusIcon.css("position","relative");
	
	$friendStatusIconDiv.append($friendStatusIconInnerDiv);
	$friendStatusIconInnerDiv.append($friendStatusIcon);
	$friendStatusIconInnerDiv.center({against : 'parent'});
	
	$friendJidDivFont=$('<font/>');
	$friendJidDivFont.attr("id","ci_ext_friendJidDivFont_"+friend.jid);
	$friendJidDivFont.attr("class","ci_ext_friendJidDivFont");
	$friendJidDivFont.attr("style",fontStyle);
	
	$friendJidDivFont.text(friend.jid);
	
	$friendJidDiv.append($friendJidDivFont);
		
	$('#ci_ext_friendListDiv').append($friendDiv);	
	$friendDiv.append($friendJidDiv);
	$friendDiv.append($friendStatusIconDiv);
	//$friendStatusIcon.center({against : 'parent'});
	
	$friendDiv.bind('click', function () {
		framework.extension.fireEvent('openChatWindow', {friend: friend}, function(res){});
	});
	
	$friendDiv.bind('mouseover', function () {
		$(this).css("backgroundColor","#E3E4FA");
		$(this).children().css("backgroundColor","#E3E4FA");
		$(this).children().children().css("backgroundColor","#E3E4FA");
	});
	
	$friendDiv.bind('mouseout', function () {
		$(this).css("backgroundColor","white");
		$(this).children().css("backgroundColor","white");
		$(this).children().children().css("backgroundColor","white");
	});
	
	$friendDiv.bind('mousedown', function () {
		$(this).css("backgroundColor","#C6DEFF");
		$(this).children().css("backgroundColor","#C6DEFF");
		$(this).children().children().css("backgroundColor","#C6DEFF");
	});
	
	$friendDiv.bind('mouseup', function () {
		$(this).css("backgroundColor","#E3E4FA");
		$(this).children().css("backgroundColor","#E3E4FA");
		$(this).children().children().css("backgroundColor","#E3E4FA");
	});
}
 
 
function appendMessageToChat(name,message)
{	
	$chatMessageDiv=$('<div/>');
	$chatMessageDiv.attr({"class" :"ci_ext_chatMessageDiv"});
	$chatMessageJidSpan=$('<span/>');
	$chatMessageSpan=$('<span/>');
	$chatMessageJidSpanFont=$('<font/>');
	$chatMessageJidSpanFont.attr({"style" :	fontJidChatStyle});	
	if (name=="me")
	{
		$chatMessageJidSpanFont.css({"color":"red !important"});
	}
	else
	{
		$chatMessageJidSpanFont.css({"color":"blue !important"});
	}
	$chatMessageJidSpanFont.text(name+": ");
			
	$chatMessageSpanFont=$('<font>');
	$chatMessageSpanFont.attr({"style" : fontMessageChatStyle});
	$chatMessageSpanFont.text(message);
	
	$chatMessageDiv.append($chatMessageJidSpan);
	$chatMessageJidSpan.append($chatMessageJidSpanFont);
	$chatMessageDiv.append($chatMessageSpan);
	$chatMessageSpan.append($chatMessageSpanFont);
	
	$('#ci_ext_chatMainMessageFieldDiv').append($chatMessageDiv);

}

function initChatWindow(res)
{
	$visibleElement = $('#ci_ext_waitLoginDiv').is(':visible') ? $('#ci_ext_waitLoginDiv') : $('#ci_ext_friendBigDiv');
	console.log($visibleElement);
	clearChatWindow();
	framework.extension.fireEvent('getMessageList', {friend:res.friend}, function(messageList)
	{
		if (messageList)
		{
			$.each(messageList.messages, function(i, message) {
				if (message) 
				{
					appendMessageToChat(message.jid,message.message);
				}
			});
		}
		$visibleElement.fadeOut(500,function(){
			$('#ci_ext_chatDiv').fadeIn(500);
			$('#ci_ext_chatTitleJidFont').text(res.friend.jid);
		
			var sendFunc=function () {
			//alert("vdfvdfs")
				framework.extension.fireEvent('sendChatMessage', {message : $('#ci_ext_chatMessageTextarea').get(0).value, friend : res.friend}, function(res){});
			}
			var backFunc=function () {
				framework.extension.fireEvent('closeChatWindow', {friend : res.friend}, function(res){});
			}
			
			$('#ci_ext_chatSendButton').unbind();
			$('#ci_ext_chatSendButton').bind('click', sendFunc);
			
			$('#ci_ext_chatBackButton').unbind();
			$('#ci_ext_chatBackButton').bind('click', backFunc);
			
		});
	});
}

function initFriendWindow()
{
	clearFriendTable();
	$.each(friendList, function(i, friend) {
	if (friend) 
		{
			appendFriendInTable(friend);
		}
	});
	initPresence(presenceList);
}

function initPresence(presenceList)
{
	console.log(presenceList);
	$friendsDivs=$('#ci_ext_friendListDiv').children();
	$.each($friendsDivs, function(i, friendDiv) {
		if (friendDiv) 
		{	
			$presence=presenceList[$(friendDiv).attr("jid")];
			$presenceIcon=$(friendDiv).children()[1].firstChild.firstChild;
			if($presence)
			{
				if ($presence.show=="offline")
				{
					$presenceIcon.src=baseUrl+"offline.png"
				}
				else if($presence.show=="default")
				{
					$presenceIcon.src=baseUrl+"online.png"
				}
			}		
		}
	});
}
 
 
 