// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var ballcount = document.createElement('p');
ballcount.id = 'ballcount';
document.body.insertBefore(ballcount, canvas);

var score = document.createElement('p');
score.id = 'score';
document.body.insertBefore(score, canvas);

var balls = [];
var preTime;
var highestScore = +Infinity;

// function to generate random number

function random(min, max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function randomWithout0(min, max) {
  var num;
  do {
    num = Math.floor(Math.random()*(max-min)) + min;
  } while (num === 0);

  return num;
}

//  Object constructor create

function Ball(px, py, r, color, vx, vy){
  this.px = px;
  this.py = py;
  this.r = r;
  this.color = color;
  this.vx = vx;
  this.vy = vy;
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.px, this.py, this.r, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.collisionDetect = function() {
  for (var i = balls.indexOf(this)+1;i < balls.length; i++){
    var dx = balls[i].px - this.px;
    var dy = balls[i].py - this.py;

    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (balls[i].r + this.r)) {
      this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      balls[i].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
    }
  }
}

Ball.prototype.checkBounds = function() {
  if (this.px + this.r >= width || this.px - this.r <= 0){
    this.vx = -this.vx;
  }
  if (this.py + this.r >= height || this.py - this.r <= 0){
    this.vy = -this.vy;
  }
};

Ball.prototype.update = function() {
  this.px += this.vx;
  this.py += this.vy;
}

function Shape(px, py, r, color, vx, vy) {
  Ball.call(this, px, py, r, color, vx, vy);
  this.exist = true;
}

Shape.prototype = Object.create(Ball.prototype);
Shape.prototype.constructor = Shape;

function EvilCircle(color) {
  Shape.call(this, random(0, width), random(0, height), 10, color, 10, 10);
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = 'white';
  ctx.arc(this.px, this.py, this.r, 0, 2 * Math.PI);
  ctx.lineWidth = 3;
  ctx.stroke();
};

EvilCircle.prototype.collisionDetect = function() {
  for (i = 0; i < balls.length; i++){
    var dx = this.px - balls[i].px;
    var dy = this.py - balls[i].py;

    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (balls[i].r + this.r)) {
      balls.splice(i, 1);
    }
  }
};

EvilCircle.prototype.checkBounds = function() {
  if (this.px + this.r >= width){
    this.px = width - this.r;
  }
  else if(this.px - this.r <= 0){
    this.px = this.r;
  }
  if (this.py + this.r >= height){
    this.py = height - this.r;
  }
  else if (this.py - this.r <= 0){
    this.py = this.r;
  }
};

EvilCircle.prototype.setControls = function() {
  var circle = this;
  
  window.onkeypress = function(e) {
    if(e.charCode === 97) {
      circle.px -= circle.vx;
    }
    if(e.charCode === 100) {
      circle.px += circle.vx;
    }
    if(e.charCode === 119) {
      circle.py -= circle.vy;
    }
    if(e.charCode === 115) {
      circle.py += circle.vy;
    }
  }
}

//  Object create

for (var i = 0;i < 30;i ++){
  var ball = new Ball(random(30, width-30), random(30, height-30), random(10, 20), 'rgb(' + random(0, 256)+', '+random(0, 256)+', '+random(0, 256)+')', randomWithout0(-5, 5), randomWithout0(-5, 5));
  balls.push(ball);
}

var player1 = new EvilCircle();
player1.setControls();

//  Default background color

ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, width, height);

/*
ctx.beginPath();
ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.rect(0, 0, width, height);
ctx.fill();
*/

//  Loop function

function loop (t) {
  if (!preTime){
    preTime = t;
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  ballcount.textContent = 'Ball Counts : ' + balls.length;
  player1.draw();
  player1.collisionDetect();
  player1.checkBounds();
  if (balls.length === 0){
    window.alert('Congratulations! One more time?');
    for (var i = 0;i < 30;i ++){
      var ball = new Ball(random(30, width-30), random(30, height-30), random(10, 20), 'rgb(' + random(0, 256)+', '+random(0, 256)+', '+random(0, 256)+')', randomWithout0(-5, 5), randomWithout0(-5, 5));
      balls.push(ball);
      var curTime = Math.floor((t - preTime)/1000);
      highestScore = curTime < highestScore ? curTime : highestScore;
      score.textContent = 'Highest Score : ' + highestScore;
      preTime = undefined;
    }
  }
  for (var i = 0;i < balls.length; i++){
    balls[i].draw();
    balls[i].collisionDetect();
    balls[i].checkBounds();
    balls[i].update();
  }

  // console.log(t);
  requestAnimationFrame(loop);
}

//  Execution

loop();
