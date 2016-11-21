var countryName, timePeriod;
var info;

$(document).ready(function(){

	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(createChart);

	var availableCountries = [
		"Afghanistan",
		"Albania",
		"Algeria",
		"Angola",
		"Antigua and Barbuda",
		"Azerbaijan",
		"Argentina",
		"Australia",
		"Austria",
		"The Bahamas",
		"Bahrain",
		"Bangladesh",
		"Armenia",
		"Barbados",
		"Belgium",
		"Bhutan",
		"Bolivia",
		"Bosnia and Herzegovina",
		"Botswana",
		"Brazil",
		"Belize",
		"Solomon Islands",
		"Brunei Darussalam",
		"Bulgaria",
		"Myanmar",
		"Burundi",
		"Belarus",
		"Cambodia",
		"Cameroon",
		"Canada",
		"Cabo Verde",
		"Central African Republic",
		"Sri Lanka",
		"Chad",
		"Chile",
		"China",
		"Colombia",
		"Comoros",
		"Mayotte",
		"Congo",
		"Dem Rep of Congo",
		"Costa Rica",
		"Croatia",
		"Cuba",
		"Cyprus",
		"Czech Republic",
		"Benin",
		"Denmark",
		"Dominican Republic",
		"Ecuador",
		"El Salvador",
		"Equatorial Guinea",
		"Ethiopia",
		"Eritrea",
		"Estonia",
		"Fiji",
		"Finland",
		"France",
		"French Guiana",
		"French Polynesia",
		"Djibouti",
		"Gabon",
		"Georgia",
		"The Gambia",
		"West Bank and Gaza",
		"Germany",
		"Ghana",
		"Kiribati",
		"Greece",
		"Grenada",
		"Guadeloupe",
		"Guam",
		"Guatemala",
		"Guinea",
		"Guyana",
		"Haiti",
		"Honduras",
		"Hong Kong SAR-China",
		"Hungary",
		"Iceland",
		"India",
		"Indonesia",
		"Islamic Republic of Iran",
		"Iraq",
		"Ireland",
		"Israel",
		"Italy",
		"Cote-d-Ivoire",
		"Jamaica",
		"Japan",
		"Kazakhstan",
		"Jordan",
		"Kenya",
		"Dem Peoples Rep of Korea",
		"Rep of Korea",
		"Kuwait",
		"Kyrgyz Republic",
		"Lao PDR",
		"Lebanon",
		"Lesotho",
		"Latvia",
		"Liberia",
		"Libya",
		"Lithuania",
		"Luxembourg",
		"Macao SAR China",
		"Madagascar",
		"Malawi",
		"Malaysia",
		"Maldives",
		"Mali",
		"Malta",
		"Martinique",
		"Mauritania",
		"Mauritius",
		"Mexico",
		"Mongolia",
		"Moldova",
		"Montenegro",
		"Morocco",
		"Mozambique",
		"Oman",
		"Namibia",
		"Nepal",
		"The Netherlands",
		"Curacao",
		"Aruba",
		"New Caledonia",
		"Vanuatu",
		"New Zealand",
		"Nicaragua",
		"Niger",
		"Nigeria",
		"Norway",
		"Federated States of Micronesia",
		"Pakistan",
		"Panama",
		"Papua New Guinea",
		"Paraguay",
		"Peru",
		"Philippines",
		"Poland",
		"Portugal",
		"Guinea-Bissau",
		"Timor-Leste",
		"Puerto Rico",
		"Qatar",
		"Reunion",
		"Romania",
		"Russian Federation",
		"Rwanda",
		"St-Lucia",
		"St-Vincent and the Grenadines",
		"Sao Tome and Principe",
		"Saudi Arabia",
		"Senegal",
		"Serbia",
		"Seychelles",
		"Sierra Leone",
		"Singapore",
		"Slovak Republic",
		"Vietnam",
		"Slovenia",
		"Somalia",
		"South Africa",
		"Zimbabwe",
		"Spain",
		"South Sudan",
		"Sudan",
		"Western Sahara",
		"Suriname",
		"Swaziland",
		"Sweden",
		"Switzerland",
		"Syrian Arab Rep",
		"Tajikistan",
		"Thailand",
		"Togo",
		"Tonga",
		"Trinidad and Tobago",
		"United Arab Emirates",
		"Tunisia",
		"Turkey",
		"Turkmenistan",
		"Uganda",
		"Ukraine",
		"FYR Macedonia",
		"Arab Rep of Egypt",
		"United Kingdom",
		"Channel Islands",
		"Tanzania",
		"United States",
		"US Virgin Islands",
		"Burkina Faso",
		"Uruguay",
		"Uzbekistan",
		"RB-de-Venezuela",
		"Samoa",
		"Rep of Yemen",
		"Zambia",
		"World"
	];
	$('#country-name').autocomplete({
      source: availableCountries
    });

	$('form').submit(function(e){
		e.preventDefault();
		countryName = $('input[name*="country-query"]').val();
		timePeriod = parseInt($('select[name*="period-query"]').val());
		showResults();
	});
});

var getRequest = function(){

	createChart();

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
					info.setCell(i, 0, "" + val + " ");
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

var createChart = function() {
	info = new google.visualization.DataTable();
	info.addColumn('string', 'Year');
	info.addColumn('number', 'Population');
}

var drawChart = function(){

	var options = {
		title: countryName + ' ' + 'Population Statistics',
		curveType: 'function',
		legend: {position: 'bottom'},
		width: 1000,
		height: 400,
		hAxis: {
			scaleType: 'linear'
		}
	};

	var chart = new google.visualization.LineChart(document.getElementById('results'));

	chart.draw(info, options);
	$('#results').css('display', 'block');
	$('#results > div > div').css('margin', 'auto auto');
};

var showResults = function(){
	getRequest();
};
