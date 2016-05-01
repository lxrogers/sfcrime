var SCPDdata = loadData();

// Set up size
var width = 750,
	height = width;

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


//var points = svg.append("circle").attr("cx", 30)
//								.attr("cy", 30)
//								.attr("r", 20);

