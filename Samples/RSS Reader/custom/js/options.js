
	
			function ConfigTable(element)
			{
				var self= this;
				var data;
				var widgetElement=element;
				var tableConstructor;
				var $table;
				var $buttonTable;
				var $channelDialog;
				var saveDataCallback;
				
				this.initTable = function(_data,_saveDataCallback)
				{
					data=_data;
					saveDataCallback=_saveDataCallback;
					tableConstructor = new TableConstructor();
					drawTable();
				}
				
				function makeDialogButtons(saveButtonText,saveCallback)
				{
					$channelDialog.dialog({	
						buttons: [
							{
								text: saveButtonText,
								click: function() {
                                    var name = $("#name").val();
                                    
                                    if (name.length > 50) {
                                        name = name.substring(0, 50) + '...';
                                    }
                                    
									var contentItem={
										"name":	name,
										"url":	$("#url").val()
									};
									saveCallback(contentItem);
									$( this ).dialog( "close" );
								}
							},
							{
								text: "Cancel",
								click: function() {
									$( this ).dialog( "close" );
								}
							}
						]
					});
				}
				
				function drawChannelDialog()
				{
					$channelDialog=$("<div/>").attr({
						id:"dialog-form"
					});	
					$form=$("<form/>");
					$fieldset=$("<fieldset/>");
					
					$labelName=$("<label/>").attr({
						"for":"name"
					}).text("Name");
					
					$inputName=$("<input/>").attr({
						type: "text",
						name: "name",
						id : "name"
					}).addClass("text ui-widget-content ui-corner-all");
					
					$labelUrl=$("<label/>").attr({
						"for":"name"
					}).text("Url");
					
					$inputUrl=$("<input/>").attr({
						type: "text",
						name: "url",
						id : "url"
					}).addClass("text ui-widget-content ui-corner-all");

					$(document.body).append($channelDialog);
					$channelDialog.append($form);
					$form.append($fieldset);
					$fieldset.append($labelName);
					$fieldset.append($inputName);
					$fieldset.append($labelUrl);
					$fieldset.append($inputUrl);
					
					var name = $( "#name" );
					var url = $( "#url" );
					
			
					$( "#dialog:ui-dialog" ).dialog( "destroy" );
					$( "#dialog-form" ).dialog({
						autoOpen: false,
						height: 300,
						width: 350,
						modal: true,
						close: function() {
						}
					});
				}
				
				function drawButtonTable()
				{
					if ($buttonTable) $buttonTable.remove();
					$buttonTable = tableConstructor.createTable();
					$buttonTable.addClass("configButtonTable");
					var $buttonTr = tableConstructor.addRow($buttonTable);
					var $saveButtonTd = tableConstructor.addCell($buttonTr);
					var $actionButtonTd = tableConstructor.addCell($buttonTr);
					$saveButtonTd.addClass("configButtonTdSave");
					$actionButtonTd.addClass("configButtonTdAction");
					
					var $addButton = $("<a/>");
					$addButton.text("Add");
					$addButton.addClass("addChannelButton");
					$addButton.button();
					
					var $deleteButton = $("<a/>");
					$deleteButton.text("Delete");
					$deleteButton.addClass("deleteChannelButton");
					$deleteButton.button();
					
					var $saveButton = $("<a/>");
					$saveButton.text("Save configurations");
					$saveButton.addClass("saveConfigButton");
					$saveButton.button();

					var $closeButton = $("<a/>");
					$closeButton.text("Cancel");
					$closeButton.addClass("saveConfigButton");
					$closeButton.click(function(){
						window.close();
					});
					$closeButton.button();
					
					$(widgetElement).append($buttonTable);
					$actionButtonTd.append($deleteButton);
					$actionButtonTd.append($addButton);
                    
                    //////////////////////////////////////////////////////////////////////////////////////
                    $('#saveButtonDiv').append($closeButton).append($saveButton) ;

                    $('.slider').slider({
                    	min: 200,
                    	max:600
                    });
                    
                    framework.extension.getItem('popUpWidth', function (val) {
                        var widthValue = 500;
                        
                        if (!val) {
                            framework.extension.setItem('popUpWidth', widthValue);
                        } else {
                            widthValue = parseInt(val);
                        }
                        
                        $('#widthSlider').slider('option', 'value', widthValue);
                        $('#widthValue').text(widthValue);
                    });
                    
                    $('#widthSlider').bind('slide', function(event, ui) { $('#widthValue').text(ui.value); });
                    
                    framework.extension.getItem('popUpHeight', function (val) {
                        var heightValue = 300;
                        
                        if (!val) {
                            framework.extension.setItem('popUpHeight', heightValue);
                        } else {
                            heightValue = parseInt(val);
                        }
                        
                        $('#heightSlider').slider('option', 'value', heightValue);
                        $('#heightValue').text(heightValue);
                    });
                    
                    $('#heightSlider').bind('slide', function(event, ui) { $('#heightValue').text(ui.value); });
                    
                    //debugger;
				}
				
				function drawTable()
				{
					drawChannelDialog();
					
					function addRow(data)
					{
						var $itemTr = tableConstructor.addRow($table);
						var $nameTd = tableConstructor.addCell($itemTr);
						$nameTd.addClass("nameTd");
						var $urlTd = tableConstructor.addCell($itemTr);
						$urlTd.addClass("urlTd");
						var $actionTd = tableConstructor.addCell($itemTr);
						$actionTd.addClass("actionsTd");
						var $trashButton=$("<button/>");
						$trashButton.text("Delete channel");
						$trashButton.addClass("actionTrashButton");
						$trashButton.button({
							icons: {
								primary: "ui-icon-trash"
							},
							text: false
						});
						
						var $editButton=$("<button/>");
						$editButton.text("Edit channel");
						$editButton.addClass("actionEditButton");
						$editButton.button({
							icons: {
								primary: "ui-icon-pencil"
							},
							text: false
						});
						
						$actionTd.append($editButton);
						$actionTd.append($trashButton);
						
						$nameTd.text(data.name);
						$urlTd.text(data.url);	
						return 	$itemTr;				
					}
					
					
					function addChannel(_data)
					{
						data.push(_data);	
						var $tr = addRow(_data);
						applyTableStyles($tr);
						bindTableEvents($tr);
					}
					
					function saveChannel(_data,$tr)
					{
						var $body = tableConstructor.body($table);
						$trs= $body.find("tr");
						var index = $trs.index($tr);
						data[index]=_data;
						console.log(data[index]);
						console.log($tr);
						$tr.find(".nameTd").text(data[index].name);
						$tr.find(".urlTd").text(data[index].url);
					}
					
					function remove($tr)
					{
						var $body = tableConstructor.body($table);
						$trs= $body.find("tr");
						var index = $trs.index($tr);
						data.splice(index,1);
						$tr.remove();
					}
					
					function removeSelected()
					{
						var $body = tableConstructor.body($table);
						$trs= $body.find("tr");
						$activeTrs=$trs.filter(".ui-state-active");
		
						
						$.each($activeTrs, function(i, tr) { 
							var index= $trs.index($(tr)); 
							console.log(index);
							data[index]=null;
						});
						
						var i=0;
						while(i<data.length)
						{
							if (data[i])
							{							
								i++;
							}
							else
							{
								data.splice(i,1);
							}
						}					
						$activeTrs.remove();
					}
					
					
					function bindTableEvents(tr)
					{
						var $body = tableConstructor.body($table);
						var $trs;
						if (tr)
						{
							$trs = $(tr);
						}
						else
						{
							$trs = $body.find("tr");
						}
						
						$trs.click(function()
						{
							if ($(this).hasClass("ui-state-active"))
							{
								$(this).removeClass("ui-state-active");								
							}
							else
							{
								var borderColor=$(this).css("border-left-color");
								$(this).addClass("ui-state-active");
								$(this).css("border-color",borderColor);
							}					
						});
							
						$trs.bind("mouseover",function()
						{
							var borderColor=$(this).css("border-left-color");
							$(this).addClass("ui-state-hover");
							$(this).css("border-color",borderColor);
						});
						
						$trs.bind("mouseout",function()
						{
							$(this).removeClass("ui-state-hover");				
						});
						
						$.each($trs, function(i, currentTr) { 
							var $trashButtons=$(currentTr).find(".actionTrashButton");
							var $editButtons=$(currentTr).find(".actionEditButton");
							var $name=$(currentTr).find(".nameTd");
							var $url=$(currentTr).find(".urlTd");

							$trashButtons.click(function()
							{
								remove($(currentTr));	
							});
							
							$editButtons.click(function()
							{
								$channelDialog.dialog({
									title:"Edit channel"
								});	
								
								makeDialogButtons("Save",function(data){
									saveChannel(data,$(currentTr));
								});
							
								
								$( "#name" ).val($name.text());
								$( "#url" ).val($url.text());
						
								$channelDialog.dialog("open");		
							
								return false;
							});
						});
						
					}
					
					function bindButtonTableEvents()
					{
						$(".addChannelButton").click(function(){
							$channelDialog.dialog({
								title:"Add new channel"
							});	
							
							makeDialogButtons("Add",function(data){
								addChannel(data);
							});
							
							$( "#name" ).val("");
							$( "#url" ).val("");
					
							$channelDialog.dialog("open");
						});
						
						$(".deleteChannelButton").click(function(){
							removeSelected();
						});
						
						$(".saveConfigButton").click(function(){
							saveDataCallback(data);
                            
                        savePopUpSize();
						});
							
					}
					
					function applyTableStyles(tr)
					{
						if (tr)
						{
							$(tr).addClass("ui-state-default").addClass("configTableTr");
							$(tr).find("td").addClass("configTableTd");
						}
						else
						{
							var $body = tableConstructor.body($table);
							//$body.addClass("configTableBody");
							$body.find("td").addClass("configTableTd");
							$body.find("tr").addClass("ui-state-default").addClass("configTableTr");
							var $header = tableConstructor.header($table);
							//$header.addClass("configTableHeader");
							$header.find("tr").addClass("configTableHeaderTr").addClass("ui-widget-header");
							$header.find("th").addClass("configTableTh").addClass("ui-widget-header");
						}
					}
					
					
					$(widgetElement).empty();
						
					if ($table)
					{
						$table.remove();
					}
					
					
					$table = tableConstructor.createTable();
					$table.addClass("configTable");
					
					var $headerTr = tableConstructor.addHeaderRow($table);
					var $nameTh = tableConstructor.addHeaderCell($headerTr);
					var $urlTh = tableConstructor.addHeaderCell($headerTr);
					var $actionsTh = tableConstructor.addHeaderCell($headerTr);
					$actionsTh.addClass("actionsTh");
					$nameTh.text("Name");
					$urlTh.text("Url");
					$actionsTh.text("Actions");
				
					for (i=0; i < data.length; i++)
					{
						addRow(data[i]);
					}
					bindTableEvents();
					
					applyTableStyles();
					
					$(widgetElement).append($table);
					drawButtonTable();
					bindButtonTableEvents();
				}
				
				
				return this;
			}
			
            function savePopUpSize() {
            	var w = $('#widthSlider').slider('option', 'value'),
            		h = $('#heightSlider').slider('option', 'value')
                framework.extension.setItem('popUpHeight', h);
                framework.extension.setItem('popUpWidth', w);
                framework.extension.fireEvent('setPopup', {data:{
                	"width": w,
                	"height": h,
                	"url": "popup.html"
                }});
            }
            
			window.setTimeout(function(){
				configTable = new ConfigTable($("#configTableDiv"));
				framework.extension.getItem("rssChannels",function(_channels)
				{
					var channels=JSON.parse(_channels);
					configTable.initTable(channels,function(data){
						framework.extension.setItem("rssChannels",JSON.stringify(data));
						framework.extension.fireEvent("updateList",{data: data});
					});
					
				});
				
			}, 1000);