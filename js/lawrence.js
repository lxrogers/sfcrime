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
			"name" : hour
			}
		)
	}
	console.log(counts_arr)
	return counts_arr;
}

//var dayOfWeekHist_data = dayOfWeekHistogram(SCPDdata.data);
//var timeOfDayHist_data = timeOfDayHistogram(SCPDdata.data);
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
			.value([11, 35])
			.on("slide", function(evt, value) {
			  d3.select('#hourmin').text(timesOfDayNames[value[ 0 ]]);
			  d3.select('#hourmax').text(timesOfDayNames[value[ 1 ]]);
			})
	);
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

function updateDOW() {
	d3.select("#DOW-hist")
		.selectAll("div")
		.style("background-color", "grey");

	d3.select("#DOW-hist")
		.selectAll("div")
		.filter(function(d) {return isDaySelected(d);})
		.style("background-color", "steelblue");
}
