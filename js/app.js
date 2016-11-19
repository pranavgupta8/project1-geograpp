$(document).ready(function(){

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);

	info = new google.visualization.DataTable();
	info.addColumn('Year', 'Population');

	$('form').submit(function(e){
		e.preventDefault();
		countryName = $('input[name*="country-query"]').val();
		timePeriod = parseInt($('select[name*="period-query"]').val());
		showResults();
	});
});

var countryName, timePeriod;
var info = [];

var getRequest = function(){

	var currentYear = new Date().getFullYear();
	var effectiveYear = new Array();

	for(i=timePeriod; i>=0; i--)
	effectiveYear.push(currentYear - i);
	var yearsDone = effectiveYear.length;

	info.addRows(yearsDone);

	$.each(effectiveYear, function(i, val){
		url = 'http://api.population.io:80/1.0/population/' + val + '/' + countryName;
		var sum = 0;
		$.getJSON(url, function(data){
			var done = data.length;
			$.each(data, function(j, obj){
				var ageTotal = obj.total;
				if (ageTotal) {
					sum += +ageTotal;
				}
				done--;
				if (done === 0) {
					info.setCell(i, 0, val);
					info.setCell(i, 1, sum);
					yearsDone--;
					if (yearsDone === 0) {
						drawChart(); // this is now executed only when all the data
						// for all years has been accumulated into the info array, which
						// is what we want.
					}
				}
			});
		});
	});
};

var drawChart = function(){

	var options = {
		title: countryName + ' ' + 'Population Statistics',
		curveType: 'function',
		legend: {position: 'bottom'}
	};

	var chart = new google.visualization.LineChart(document.getElementById('results'));

	chart.draw(info, options);
};

var showResults = function(){
	$('#results').css('width', '90%', 'height', '50%', 'display', 'default');
	getRequest();
};
