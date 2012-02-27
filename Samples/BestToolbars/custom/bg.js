
framework.extension.attachEvent("getBaseUrl",function(data, callback){
	var i = document.location.href.lastIndexOf("/");
	var result = document.location.href.substring(0, i+1);
	callback(result);
});

framework.extension.attachEvent("getWeather", function(data){

	if($.browser.msie)
		{ data = data.data; }
	var options = data['options'];
	var city   = data['city'] == undefined || data['city'] == 'null' || !data['city'].length ? options['default'] : data['city'];
	var cityID = data['cityId'] == undefined || data['cityId'].length <2 || data['cityId'] == 'null' ? options['city'][options['default']] : data['cityId'];

	var currentDate = new Date().getTime();

	framework.extension.getItem('date', function(date){
		framework.extension.getItem('cityId', function(cityId)
		{
			if((currentDate - date) / (1000*60*60) > 1 || cityId != cityID || true)
			{

				var request = framework.extension.getRequest();
				request.open("GET", options['url'] + cityID, true);
				request.onreadystatechange = function()
				{
					if (request.readyState == 4)
					{
						if (request.status == 200)
						{
							framework.extension.setItem('city'  , city);
							framework.extension.setItem('cityId', cityID.toString());
							framework.extension.setItem('date'  , currentDate.toString());
							framework.extension.setItem('xml'   , request.responseText);
							framework.extension.fireEvent("setWeather", {city:city, cityId:cityID});
						}
					}
				};
				request.send(null);
			}
			else
			{
				framework.extension.fireEvent("setWeather", {city:city, cityId:cityID}, function(){});
			}
		});
	});
});

framework.extension.attachEvent("autocomplite",function(data){

	if($.browser.msie)
		{ data = data.data; }

	var request = framework.extension.getRequest();
	request.open("GET", data.url, true);
	request.onreadystatechange = function()
	{
		if (request.readyState == 4)
		{
			if (request.status == 200)
			{
				framework.extension.fireEvent('_autocomplite', {text:request.responseText});
			}
		}
	};
	request.send(null);
});

