$(document).ready(function(){

	$('form').submit(function(e){
		e.preventDefault();

		countryName = $('input[name*="country-query"]').val();

		timePeriod = $('input[name*="period-query"]').val();

		showResults();
	});

});

var countryName, timePeriod, sum, data;

var getRequest = function(){

	var currentYear = new Date().getFullYear();
	var effectiveYear = new Array();
	
	for(int i=timePeriod; i>=0; i--){
	effectiveYear.push(currentYear - i);
	}

	$.each(effectiveYear, function(i, val){
		url = 'http://api.population.io:80/1.0/population/' + val + '/' + countryName;
		
		$.getJSON(url, function(data){
		
			$.each(data, function(i, obj){

				$.each(obj, function(j, val){
					if(j == 'total') sum += val;
					console.log(sum);
				});
			});
			console.log(sum);
		});

		data.push([val, sum]);
	});
};

var showResults = function(){

	getRequest();

	$('#results').css('width', '90%', 'height', '50%');

	drawChart();
};

var drawChart = function(){

	data = google.visualization.arrayToDataTable([
		['Year', 'Population']
	]);

	var options = {
		title: countryName + ' ' + 'Population Statistics',
		curveType: 'function',
		legend: {position: 'bottom'}
	};

	var chart = new google.visualization.LineChart($('#results'));

	chart.draw(data, options);
}