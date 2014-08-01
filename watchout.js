// start slingin' some d3 here.
var dataset = [], i = 0;

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

for (i = 0; i < gameOptions.nEnemies; i++) {
  dataset.push(Math.round(Math.random()*100));
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height])
};

var gameBoard = d3.select(".container")
                  .append("svg")
                  .attr("width", gameOptions.width)
                  .attr("height", gameOptions.height);

var enemies = gameBoard.selectAll("circle")
                       .data(dataset)
                       .enter().append("circle")
                       .style("stroke", "black")
                       .style("fill", "black")
                       .attr("cx", function(d, i) { return Math.random() * gameOptions.width; })
                       .attr("cy", function(d, i) { return Math.random() * gameOptions.height; })
                       .attr("r", 10)

var update = function() {
  gameBoard.selectAll("circle")
           .transition()
           .duration(500)
           .attr("cx", function(d, i) { return Math.random() * gameOptions.width; })
           .attr("cy", function(d, i) { return Math.random() * gameOptions.height; })
};

setInterval(function() {
  update()
}, 500);
