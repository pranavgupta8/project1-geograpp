$(document).ready(function(){

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	$('form').submit(function(e){
		e.preventDefault();

		countryName = $('input[name*="country-query"]').val();

		timePeriod = parseInt($('select[name*="period-query"]').val());

		showResults();
	});

});

var countryName, timePeriod, sum;
var data = new Array();

var getRequest = function(){

	var currentYear = new Date().getFullYear();
	var effectiveYear = new Array();
	
	for(i=timePeriod; i>=0; i--)
	effectiveYear.push(currentYear - i);
	

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

		data.push('['+ val + ',' + sum + ']');
	});
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

	var chart = new google.visualization.LineChart(document.getElementById('results'));

	chart.draw(data, options);
};

var showResults = function(){

	getRequest();

	$('#results').css('width', '90%', 'height', '50%', 'display', 'default');

	drawChart();
};