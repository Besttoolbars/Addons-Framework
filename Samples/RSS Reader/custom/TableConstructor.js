function TableConstructor()
{
	this.createTable = function()
	{
		var $table = $("<table/>");
		$table.append($("<thead/>"));
		$table.append($("<tbody/>"));
		return $table;
	}
		
	this.addRow = function($table)
	{
		var $tr=$("<tr/>");
		$table.children("tbody").append($tr);
		return $tr;
	}
	
	this.addCell = function($tr)
	{
		var $td=$("<td/>");
		$tr.append($td);
		return $td;
	}	
	
	this.addHeaderRow = function($table)
	{
		var $tr=$("<tr/>");
		$table.children("thead").append($tr);
		return $tr;
	}	
	
	this.addHeaderCell = function($tr)
	{
		var $th=$("<th/>");
		$tr.append($th);
		return $th;
	}	
	
	
	this.header = function($table)
	{
		var $head= $table.children("thead");
		return $head;
	}
	
	this.body = function($table)
	{
		var $body = $table.children("tbody");
		return $body;
	}
		
	return this;
}