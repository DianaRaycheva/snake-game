// HTML constants
var canvas = document.getElementById("game");
var overlay = document.getElementById("overlay");
var currentScore = document.getElementById("current_score");
var gamerScore = document.getElementById("my_score");
var highScoreElem = document.getElementById("high_score");

// Canvas Prep
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

// Other Variables
var food, score, gameLoop, snake, d, cw = 15,
    speed = 130,
    color = "green",
    gameOn = false;

function init() {
    score = 0;
    gameOn = true;
    gamerScore.innerHTML = score;
    d = "right";
    overlay.style.display = "none";

    createSnake();
    createFood();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, speed);
}

function createSnake() {
    var length = 5;
    snake = new Array();
    for (var i = length - 1; i >= 0; i--) {
        snake.push({
            x: i,
            y: 0
        });
    }
}

function createFood() {
    food = {
        x: Math.round(Math.random() * (w - cw) / cw),
        y: Math.round(Math.random() * (h - cw) / cw)
    }
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "white";
    ctx.strokeRect(0, 0, w, h);
    var nx = snake[0].x;
    var ny = snake[0].y;
    var tail = new Object();
    switch (d) {
        case "right":
            nx++;
            break;
        case "left":
            nx--;
            break;
        case "up":
            ny--;
            break;
        case "down":
            ny++;
            break;
    }
    //Check if game is over
    if (nx == -1 || nx == Math.round(w / cw) || ny == -1 || ny == Math.round(h / cw) || checkCollision(nx, ny, snake)) {
        overlay.style.display = "block";
        currentScore.innerHTML = "Your score is: " + score;
        document.getElementById("play").innerHTML = "Play Again";
        if (gameLoop) clearInterval(gameLoop);
        return false;
    }
    //If snake reach food
    if (nx == food.x && ny == food.y) {
        tail.x = nx;
        tail.y = ny;
        score++;
        gamerScore.innerHTML = score;
        createFood();
    } else {
        tail = snake.pop();
        tail.x = nx;
        tail.y = ny;
    }
    snake.unshift(tail);
    //Fill in snake
    for (var i = 0; i < snake.length; i++) {
        var c = snake[i];
        paintCell(c.x, c.y);
    }
    paintCell(food.x, food.y);
    checkScore(score);
}

function paintCell(x, y) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}

function checkCollision(x, y, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].x == x && array[i].y == y) {
            return true;
        }
    }
    return false;
}

function checkScore(score){
	var highScore = localStorage.getItem("highScore");
	if( highScore === null || highScore < score){
		localStorage.setItem("highScore", score);
	}
	highScoreElem.innerHTML = localStorage.highScore
}

function resetScore(){
	localStorage.highScore = 0;
	highScoreElem.innerHTML = 0; 
}

document.body.addEventListener('keydown', function(e) {
    var key = e.keyCode;
    switch (key) {
        case 38:    
        case 87:
        	d = "up";
        	break;
        case 39:
        case 68:
            d = "right";
            break;
        case 40:
        case 83:
            d = "down";
            break;
        case 37:
        case 65:
            d = "left";
            break;
    }
});