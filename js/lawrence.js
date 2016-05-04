//var timesOfDay = [0,1,2,3,4,5,6,7,8,9,10, 11, 12, 13,14,15,16,17,18,19,20,21,22,23]
var timesOfDay = [];

for (var i = 0; i < 25; i+= 2) {
	timesOfDay.push(i);
}

var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var selectedDaysOfWeek = {
	"Sunday" : true,
	"Monday" : true,
	"Tuesday" : true,
	"Wednesday" : true,
	"Thursday" : true,
	"Friday" : true,
	"Saturday" : true
}

var timesOfDayNames = {
	0: "12am",
	2: "2am",
	4: "4am",
	6: "6am",
	8: "8am",
	10: "10am",
	12: "12pm",
	14: "2pm",
	16: "4pm",
	18: "6pm",
	20: "8pm",
	22: "10pm",
	24: "12am"
}

var BAR_HEIGHT_MULTIPLIER = 50;

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
	var max = 1;
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
	return Math.floor(parseInt(time.substring(0, 2) / 2)) * 2;
}

function timeOfDayHistogram(data) {
	//init map
	var counts = {};
	for (var hour = 0; hour < 24; hour += 2) {
		counts[hour] = 0;
	}
	//count all
	for (var i = 0; i < data.length ; i++) {
		counts[extractHour(data[i]["Time"])] += 1;
	}

	//normalize
	var max = 1;
	for (var hour = 0; hour < 24; hour += 2) {
		if (counts[hour] > max) {
			max = counts[hour]
		}
	}
	for (var hour = 0; hour < 24; hour += 2) {
		counts[hour] = counts[hour] / max;
	}

	//package and return
	var counts_arr = [];
	for (var hour = 0; hour < 24; hour += 2) {
		counts_arr.push({
			"norm": counts[hour],
			"count": Math.floor(counts[hour] * max),
			"name" : hour
			}
		)
	}
	return counts_arr;
}

var selectedTimes = [];
var include = true;

function isTimeSelected(t) {
	if (include) {
		return t >= selectedTimes[0] && t <= selectedTimes[1];
	}
	else {
		return t < selectedTimes[0]  || t >= selectedTimes[1]
	}
}

function createRadiusSlider(location) {
	d3.select("#radius-" + location + "-slider")
	.call(
		d3.slider()
			.axis(true).min(0).max(5)
			.value(radii[location].toString())
			.snap(false)
			.on("slide", function(evt, value) {
			  radii[location] = value.toFixed(1);
			  $(".radius-" + location + "-text").text(radii[location]);
			  updateDynamicFilter();
			})
	);
}

function createTOD(incidents) {
	var timeOfDayHist_data = timeOfDayHistogram(incidents);
	d3.select("#TOD-hist")
	.selectAll("div")
		.data(timeOfDayHist_data)
	.enter().append("div")
		.style("height", function(d) { return d.norm * BAR_HEIGHT_MULTIPLIER + "px"; })
		.style("margin-top", function(d) {return (1 - d.norm) * BAR_HEIGHT_MULTIPLIER + "px"})
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
			.value([0, 24])
			.on("slide", function(evt, value) {
			  updateTimeText(value);
			  selectedTimes = value;
			  updateTOD();
			  updateDynamicFilter();
			})
	);

	selectedTimes = [0, 24];
	updateTOD();
}

function updateTimeText(value) {
	if (include) {
		d3.select('#hourmin').text(timesOfDayNames[value[ 0 ]]);
		d3.select('#hourmax').text(timesOfDayNames[value[ 1 ]]);
	}
	else {
		 d3.select('#hourmin').text(timesOfDayNames[value[ 1 ]]);
		 d3.select('#hourmax').text(timesOfDayNames[value[ 0 ]]);
	}
}

function remakeTOD(incidents) {
	var timeOfDayHist_data = timeOfDayHistogram(incidents);
	d3.select("#TOD-hist")
	.selectAll("div")
		.data(timeOfDayHist_data)
		.style("height", function(d) { return d.norm * BAR_HEIGHT_MULTIPLIER + "px"; })
		.style("margin-top", function(d) {return (1 - d.norm) * BAR_HEIGHT_MULTIPLIER + "px"})
    	.text(function(d) { return d.count; });
}

function createDOW(incidents) {
	var dayOfWeekHist_data = dayOfWeekHistogram(incidents);
	d3.select("#DOW-hist")
	.selectAll("div")
		.data(dayOfWeekHist_data)
	.enter().append("div")
		.style("height", function(d) { return d.norm * BAR_HEIGHT_MULTIPLIER + "px"; })
		.style("margin-top", function(d) {return (1 - d.norm) * BAR_HEIGHT_MULTIPLIER + "px"})
    	.text(function(d) { return d.count; });
}

function remakeDOW(incidents) {
	var dayOfWeekHist_data = dayOfWeekHistogram(incidents);
	d3.select("#DOW-hist")
	.selectAll("div")
		.data(dayOfWeekHist_data)
		.style("height", function(d) { return d.norm * BAR_HEIGHT_MULTIPLIER + "px"; })
		.style("margin-top", function(d) {return (1 - d.norm) * BAR_HEIGHT_MULTIPLIER + "px"})
    	.text(function(d) { return d.count; });
}

function updateSelectedDaysOfWeek() {
  for (day of daysOfWeek) {
    selectedDaysOfWeek[day] = isDaySelected(day) ? true : false;
  }
}

function isDaySelected(day) {
  return  $("input[name='" + day + "']").is(":checked");
}

function updateTOD() {
	d3.select("#TOD-hist")
		.selectAll("div")
		.style("background-color", "lightgrey");

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
		.filter(function(d) {return isDaySelected(d.name);})
		.style("background-color", "steelblue");

	updateSelectedDaysOfWeek();
	updateDynamicFilter();

}