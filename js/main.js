// main.js

// constants
var HOME_ICON_WIDTH = 20;
var HOME_ICON_HEIGHT = 20;
var WORK_ICON_WIDTH = 20;
var WORK_ICON_HEIGHT = 20;
var LONGITUDINAL_DEGREES_PER_MILE = 0.01886792452;
var SELECTED_COLOR = "steelblue";
var UNSELECTED_COLOR = "lightgrey"; // #FF8533

// global vars
var locations;
var radius = 2.0; // in miles
var home_coords = [-122.458220811697, 37.7633123961354]; // at start
var work_coords = [-122.407257559322, 37.769769551921]; // at start
var filter_home, filter_work = false;

// global functions

function updateDynamicFilter() {
  locations.style("fill", UNSELECTED_COLOR);
  locations.filter(function(d) {
    // if (!filter_home && !filter_work) return false; // no filters so nothing is selected
    if (filter_home) {
      if (!filterWithinCoords(d, home_coords[0], home_coords[1])) return false;
    }
    if (filter_work) {
      if (!filterWithinCoords(d, work_coords[0], work_coords[1])) return false;
    }
    if (!selectedDaysOfWeek[d.DayOfWeek]) return false;
    return true;
  }).style("fill", SELECTED_COLOR);
}

function filterWithinCoords(d, center_x, center_y) {
  return ( Math.pow((d.Location[0] - center_x), 2) + Math.pow((d.Location[1] - center_y), 2) < Math.pow(radius * LONGITUDINAL_DEGREES_PER_MILE, 2) );
}

// Courtesy of http://stackoverflow.com/questions/4249648/jquery-get-mouse-position-within-an-element
function getXY(evt, elem_id) {
  var element = document.getElementById(elem_id);  //replace elementId with your element's Id.
  var rect = element.getBoundingClientRect();
  var scrollTop = document.documentElement.scrollTop?
                  document.documentElement.scrollTop:document.body.scrollTop;
  var scrollLeft = document.documentElement.scrollLeft?
                  document.documentElement.scrollLeft:document.body.scrollLeft;
  var elementLeft = rect.left+scrollLeft;
  var elementTop = rect.top+scrollTop;

  var x, y;
  if (document.all) { // detects using IE
      x = event.clientX+scrollLeft-elementLeft; // event not evt because of IE
      y = event.clientY+scrollTop-elementTop;
  } else {
      x = evt.pageX-elementLeft;
      y = evt.pageY-elementTop;
  }

  return [x,y];
}

// on page load

window.onload = function () {

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
  var svg = d3.select("#sf-map").append("svg")
    .attr("width", width)
    .attr("height", height);

  // Add svg map at correct size, assumes map is saved in a subdirectory called "data"
  svg.append("image")
    .attr("id", "sf-map-image")
    .attr("width", width)
    .attr("height", height)
    .attr("xlink:href", "data/sf-map.svg");
    // .on({
    //   'click': function() {
    //     var cx = window.event.clientX;
    //     var cy = window.event.clientY;
    //     var mouse_xy_within_img = getXY(window.event, 'sf-map-image');
    //     //mouse_xy_within_img = [d3.event.x, d3.event.y];
    //     //console.log(projection.invert(mouse_xy_within_img));
    //     filterWithinCoords(projection.invert(mouse_xy_within_img)[0], projection.invert(mouse_xy_within_img)[1], 0.5, 'black');
    //   }
    // });

  svg.append("svg:g")
    .attr("class", "locations");

  d3.json("data/scpd_incidents.json", function(error, json) {

    if (error) console.log(error);
    var incidents = json.data;
    // console.log('HOME:', incidents[0]);
    // console.log('WORK:', incidents[500]);

    locations = d3.select(".locations").selectAll('circle')
      .data(incidents);

    // inspired by: http://eyalarubas.com/getting-started-with-d3js.html
    locations.enter().append("svg:circle")
      .attr("cx", function(d) {
        return projection([
          d.Location[0],
          d.Location[1]
        ])[0];
      })
      .attr("cy", function(d) {
        return projection([
          d.Location[0],
          d.Location[1]
        ])[1];
      })
      .attr("id", function(d) {
        return d.IncidentNumber;
      })
      .attr("r", 2)
      .style("fill", UNSELECTED_COLOR);


      createDOW(incidents);

  });

  var home_icon = svg
    .append("image")
    .attr("xlink:href","icons/home.svg")
    .attr("width", HOME_ICON_WIDTH)
    .attr("height", HOME_ICON_HEIGHT)
    .attr("x", projection(home_coords)[0] - HOME_ICON_WIDTH/2)
    .attr("y", projection(home_coords)[1] - HOME_ICON_HEIGHT/2)
    .attr("class", "pin")
    .call(d3.behavior.drag().on("drag", function() {
      d3.event.sourceEvent.stopPropagation(); // silence other listeners
      d3.select(this).attr("x", d3.event.x - HOME_ICON_WIDTH/2);
      d3.select(this).attr("y", d3.event.y - HOME_ICON_HEIGHT/2);
      home_coords = projection.invert([d3.event.x - HOME_ICON_WIDTH/2, d3.event.y - HOME_ICON_HEIGHT/2]);
      updateDynamicFilter();
    }));

  var work_icon = svg
    .append("image")
    .attr("xlink:href","icons/work_filled.svg")
    .attr("width", WORK_ICON_WIDTH)
    .attr("height", WORK_ICON_HEIGHT)
    .attr("x", projection(work_coords)[0] - WORK_ICON_WIDTH/2)
    .attr("y", projection(work_coords)[1] - WORK_ICON_HEIGHT/2)
    .attr("class", "pin")
    .call(d3.behavior.drag().on("drag", function() {
      d3.event.sourceEvent.stopPropagation(); // silence other listeners
      d3.select(this).attr("x", d3.event.x - WORK_ICON_WIDTH/2);
      d3.select(this).attr("y", d3.event.y - WORK_ICON_HEIGHT/2);
      work_coords = projection.invert([d3.event.x - WORK_ICON_WIDTH/2, d3.event.y - WORK_ICON_HEIGHT/2]);
      updateDynamicFilter();
    }));

}