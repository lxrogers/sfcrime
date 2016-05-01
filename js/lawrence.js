//var timesOfDay = [0,1,2,3,4,5,6,7,8,9,10, 11, 12, 13,14,15,16,17,18,19,20,21,22,23]
var timesOfDay = [0,3,7,11,15,19,23, 27, 31, 35, 39, 43, 47];
var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var timesOfDayNames = {
	0: "Midnight",
	3: "3am",
	7: "7am",
	11: "11am",
	15: "3pm",
	19: "7pm",
	23: "11pm", 
	27: "3am",
	31: "7am",
	35: "11am",
	39: "3pm",
	43: "7pm",
	47: "11pm"

}

function dayOfWeekHistogram(data) {
	var counts = {};
	for (var i = 0; i < daysOfWeek.length; i++) {
		counts[daysOfWeek[i]] = 0;
	}

	for (var i = 0; i < data.length; i++) {
		counts[data[i]['DayOfWeek']] += 1;
	}

	var counts_arr = [];
	for (var i = 0; i < daysOfWeek.length; i++) {
		counts_arr.push({
			"name": daysOfWeek[i],
			"count" : counts[daysOfWeek[i]]
		})
	}

	return counts_arr;
}

function extractHour(time) {
	return Math.floor(parseInt(time.substring(0, 2) / 4)) * 4;
}

function timeOfDayHistogram(data) {
	//create empty map
	var counts = {};
	for (var hour = 0; hour < 24; hour += 4) {
		counts[hour] = 0;
	}

	for (var i = 0; i < data.length ; i++) {
		counts[extractHour(data[i]["Time"])] += 1;
	}

	var counts_arr = [];
	for (var hour = 0; hour < 24; hour += 4) {
		console.log(hour)
		counts_arr.push(counts[hour])
	}
	for (var hour = 0; hour < 24; hour += 4) {
		console.log(hour)
		counts_arr.push(counts[hour])
	}
	console.log(counts_arr)
	return counts_arr;
}

//var dayOfWeekHist_data = dayOfWeekHistogram(SCPDdata.data);
//var timeOfDayHist_data = timeOfDayHistogram(SCPDdata.data);
function createTOD() {
	d3.select("#TOD-hist")
	.selectAll("div")
		.data(timeOfDayHist_data)
	.enter().append("div")
		.style("height", function(d) { return d / 30 + "px"; })
		.style("margin-top", function(d) {return 50 - (d / 30) + "px"})
    	.text(function(d) { return d; });	
}

function createDOW() {
	d3.select("#DOW-hist")
	.selectAll("div")
		.data(dayOfWeekHist_data)
	.enter().append("div")
		.style("height", function(d) { return d.count / 30 + "px"; })
		.style("margin-top", function(d) {return 50 - (d.count / 30) + "px"})
    	.text(function(d) { return d.count; });	

    d3.select("#DOW-slider")
	.call(
		d3.slider()
			.scale(d3.scale.ordinal().domain(timesOfDay).rangePoints([0, 1], 0.5))
			.axis( 
				d3.svg.axis()
					.tickFormat(function(d) { return timesOfDayNames[d]})
			)
			.snap(true)
			.value([11, 35])
			.on("slide", function(evt, value) {
			  d3.select('#hourmin').text(timesOfDayNames[value[ 0 ]]);
			  d3.select('#hourmax').text(timesOfDayNames[value[ 1 ]]);
			})
	);
}




function isDaySelected(d) {
	return 	$("input[name='" + d.name + "']").is(":checked");
}

function updateDOW() {
	d3.select("#DOW-hist")
		.selectAll("div")
		.style("background-color", "grey");

	d3.select("#DOW-hist")
		.selectAll("div")
		.filter(function(d) {return isDaySelected(d);})
		.style("background-color", "steelblue");
}





			/*
// Set up size
var width = 750,
	height = width
;
// Set up projection that map is using
var projection = d3.geo.mercator()
	.center([-122.433701, 37.767683]) // San Francisco, roughly
	.scale(225000)
	.translate([width / 2, height / 2]);
// This is the mapping between <longitude, latitude> position to <x, y> pixel position on the map
// projection([lon, lat]) returns [x, y]
// projection.invert([x, y]) returns [lon, lat]

// Add an svg element to the DOM
var svg = d3.select("#projector").append("svg")
	.attr("width", width)
	.attr("height", height);

// Add svg map at correct size, assumes map is saved in a subdirectory called "data"
svg.append("image")
	  .attr("width", width)
	  .attr("height", height)
	  .attr("xlink:href", "data/sf-map.svg");

svg.selectAll("circle")
    .data(SCPDdata.data)
  .enter().append("circle")
    .attr("cx", function(datum) {return projection([datum['Location'][0], datum['Location'][1]])[0];})
    .attr("cy", function(datum) {return projection([datum['Location'][0], datum['Location'][1]])[1];})
    .attr("r", function(datum) {return 2;})
    .style("fill", "steelblue")
    .style("stroke", "steelblue" );


svg.selectAll("circle")
	.filter
//var points = svg.append("circle").attr("cx", 30)
//								.attr("cy", 30)
//								.attr("r", 20);

*/