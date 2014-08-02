// initialization stuff

var dataset = [], i = 0;

var gameOptions = {
  height: $(window).height(),
  width: $(window).width(),
  nEnemies: 15,
  speed: 2,
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
                  .attr("height", gameOptions.height)
                  .style("fill", "black");

gameStats = {
  score: 0,
  highScore: 0
};


// score stuff

var updateScore = function() {
  return d3.select('#current-score').text(gameStats.score.toString());
};

var updateHighScore = function() {
  gameStats.highScore = _.max([gameStats.highScore, gameStats.score]);
  return d3.select('#high-score').text(gameStats.highScore.toString());
};

var increaseScore = function() {
  gameStats.score += 1;
  return updateScore();
};

setInterval(increaseScore, 50);


// enemies stuff

var enemies = gameBoard.selectAll("circle")
                       .data(dataset)
                       .enter().append("circle")
                       .style("stroke", "green")
                       .style("stroke-width", 1.5)
                       .style("fill", "black")
                       .attr("cx", function(d, i) { return Math.random() * gameOptions.width; })
                       .attr("cy", function(d, i) { return Math.random() * gameOptions.height; })
                       .attr("r", 10)

var update = function() {
  gameBoard.selectAll("circle")
           .transition()
           .duration(499)
           .attr("cx", function(d, i) { return Math.random() * gameOptions.width; })
           .attr("cy", function(d, i) { return Math.random() * gameOptions.height; })
};

setInterval(function() {
  update()
}, 500);


// player stuff

var Player = function() {
  this.path = "M 9  1"
        + "L 17 26"
        + "L 9  22"
        + "L 1  26"
        + "L 9  1";
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.stroke = "green";
  this["stroke-width"] = 2;
  this.fill = "black";
  this.r = 10;
};

Player.prototype.render = function(location) {
  this.el = location.append("svg:path")
                    .attr("d", this.path)
                    .attr("stroke", this.stroke)
                    .attr("stroke-width", this["stroke-width"])
                    .attr("fill", this.fill)
  this.transform({
    x: gameOptions.width * .5,
    y: gameOptions.height * .5
  });

  this.setUpDrag();
  return this;
};

Player.prototype.setX = function(x) {
  var minX, maxX;
  minX = gameOptions.padding;
  maxX = gameOptions.width - gameOptions.padding;
  if (x <= minX) x = minX;
  if (x >= maxX) x = maxX;
  return this.x = x;
};

Player.prototype.setY = function(y) {
  var minY, maxY;
  minY = gameOptions.padding;
  maxY = gameOptions.height - gameOptions.padding;
  if (y <= minY) y = minY;
  if (y >= maxY) y = maxY;
  return this.y = y;
};

Player.prototype.transform = function(opts) {
  this.angle = opts.angle || this.angle;
  this.setX(opts.x || this.x);
  this.setY(opts.y || this.y);
  return this.el.attr('transform', ("rotate(" + this.angle + "," + this.x + "," + this.y + ") ") + ("translate(" + this.x + "," + this.y + ")"));
};

Player.prototype.moveAbsolute = function(x, y) {
  return this.transform({
    x: x,
    y: y
  });
};

Player.prototype.moveRelative = function(dx, dy) {
  var context = this; // this may not be necessary
  return this.transform({
    x: context.x + dx,
    y: context.y + dy,
    angle: 360 * (Math.atan2(dy, dx)/(Math.PI * 2))
  });
};

Player.prototype.setUpDrag = function() {
  var context = this;
  var dragMove = function() {
    return context.moveRelative(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag', dragMove);
  return this.el.call(drag);
};


var players = [];
players.push(new Player().render(gameBoard));


// collision stuff

var checkCollision = function(enemies, callback) {
  for (var i = 0; i < enemies[0].length; i++) {
    var radiusSum = parseFloat(enemies[0][i]['r']['animVal']['value']) + players[0].r;
    var xDiff = parseFloat(enemies[0][i]['cx']['animVal']['value']) - players[0].x;
    var yDiff = parseFloat(enemies[0][i]['cy']['animVal']['value']) - players[0].y;
    var separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    if (separation < radiusSum) {
      return callback();
    }
  }
};

var onCollision = function() {
  updateHighScore();
  gameStats.score = 0;
  return updateScore();
};

setInterval(function() {
  checkCollision(enemies, onCollision);
}, 100);
