//var timesOfDay = [0,1,2,3,4,5,6,7,8,9,10, 11, 12, 13,14,15,16,17,18,19,20,21,22,23]
var timesOfDay = [0,4,8,12,16,20,24, 28, 32, 36, 40, 44, 48];
var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var timesOfDayNames = {
	0: "Midnight",
	4: "3am",
	8: "7am",
	12: "11am",
	16: "3pm",
	20: "7pm",
	24: "11pm", 
	28: "3am",
	32: "7am",
	36: "11am",
	40: "3pm",
	44: "7pm",
	48: "11pm"

}

function dayOfWeekHistogram(data) {
	//init map
	var counts = {};
	for (var i = 0; i < daysOfWeek.length; i++) {
		counts[daysOfWeek[i]] = 0;
	}
	//count all
	for (var i = 0; i < data.length; i++) {
		counts[data[i]['DayOfWeek']] += 1;
	}
	//normalize
	var max = 0;
	for (var i = 0; i < daysOfWeek.length; i++) {
		if (counts[daysOfWeek[i]] > max) {
			max = counts[daysOfWeek[i]];
		}
	}
	for (var i = 0; i < daysOfWeek.length; i++) {
		counts[daysOfWeek[i]] = counts[daysOfWeek[i]] / max;
	}

	//package and return
	var counts_arr = [];
	for (var i = 0; i < daysOfWeek.length; i++) {
		counts_arr.push({
			"name": daysOfWeek[i],
			"norm" : counts[daysOfWeek[i]],
			"count" : Math.floor(counts[daysOfWeek[i]] * max)
		})
	}
	return counts_arr;
}

function extractHour(time) {
	return Math.floor(parseInt(time.substring(0, 2) / 4)) * 4;
}

function timeOfDayHistogram(data) {
	//init map
	var counts = {};
	for (var hour = 0; hour < 24; hour += 4) {
		counts[hour] = 0;
	}
	//count all
	for (var i = 0; i < data.length ; i++) {
		counts[extractHour(data[i]["Time"])] += 1;
	}

	//normalize
	var max = 0;
	for (var hour = 0; hour < 24; hour += 4) {
		if (counts[hour] > max) {
			max = counts[hour]
		}
	}
	for (var hour = 0; hour < 24; hour += 4) {
		counts[hour] = counts[hour] / max;
	}

	//package and return
	var counts_arr = [];
	for (var hour = 0; hour < 24; hour += 4) {
		counts_arr.push({
			"norm": counts[hour], 
			"count": Math.floor(counts[hour] * max),
			"name" : hour
			}
		)
	}
	for (var hour = 0; hour < 24; hour += 4) {
		counts_arr.push({
			"norm": counts[hour], 
			"count": Math.floor(counts[hour] * max),
			"name" : hour + 24
			}
		)
	}
	console.log(counts_arr)
	return counts_arr;
}

//var dayOfWeekHist_data = dayOfWeekHistogram(SCPDdata.data);
//var timeOfDayHist_data = timeOfDayHistogram(SCPDdata.data);
var selectedTimes = [];

function isTimeSelected(t) {
	return t >= selectedTimes[0]  && t <= selectedTimes[1]
}

function createRadiusSlider() {
	d3.select("#radius-slider")
	.call(
		d3.slider()
			.scale(d3.scale.ordinal().domain([0,1,2,3,4,5]).rangePoints([0, 1], 0.5))
			.axis(d3.svg.axis())
			.value(1)
			.on("slide", function(evt, value) {
			  
			})
	);
}

function createTOD(incidents) {
	var timeOfDayHist_data = timeOfDayHistogram(incidents);
	d3.select("#TOD-hist")
	.selectAll("div")
		.data(timeOfDayHist_data)
	.enter().append("div")
		.style("height", function(d) { return d.norm * 10 + "px"; })
		.style("margin-top", function(d) {return (1 - d.norm) * 10 + "px"})
    	.text(function(d) { return d.count; });	


    d3.select("#TOD-slider")
	.call(
		d3.slider()
			.scale(d3.scale.ordinal().domain(timesOfDay).rangePoints([0, 1], 0.5))
			.axis( 
				d3.svg.axis()
					.tickFormat(function(d) { return timesOfDayNames[d]})
			)
			.snap(true)
			.value([12, 36])
			.on("slide", function(evt, value) {
			  d3.select('#hourmin').text(timesOfDayNames[value[ 0 ]]);
			  d3.select('#hourmax').text(timesOfDayNames[value[ 1 ]]);
			  selectedTimes = value;
			  updateTOD();
			})
	);

	selectedTimes = [12, 36];
	updateTOD();
}

function createDOW(incidents) {
	var dayOfWeekHist_data = dayOfWeekHistogram(incidents);
	d3.select("#DOW-hist")
	.selectAll("div")
		.data(dayOfWeekHist_data)
	.enter().append("div")
		.style("height", function(d) { return d.norm * 10 + "px"; })
		.style("margin-top", function(d) {return (1 - d.norm) * 10 + "px"})
    	.text(function(d) { return d.count; });	
}

function isDaySelected(d) {
	return 	$("input[name='" + d.name + "']").is(":checked");
}

function updateTOD() {
	d3.select("#TOD-hist")
		.selectAll("div")
		.style("background-color", "grey");

	d3.select("#TOD-hist")
		.selectAll("div")
		.filter(function(t) {return isTimeSelected(t.name);})
		.style("background-color", "steelblue");
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
