// Pong game
// Bouncing ball and user-controlled paddle

// Game configuration
// Change these values to customize your game
var fieldWidth = 600;      // how wide is the playing field
var fieldHeight = 400;     // how tall is the playing field
var fieldColor = 0x337733; // what color is the playing field

var paddleWidth = 10;      // how wide is the paddle
var paddleHeight = 80;     // how tall is the paddle
var paddleColor = 0x00ff00;// what color is the paddle
var paddleSpeed = 6;      // how fast will the paddle move
var paddleXPos = fieldWidth - Math.floor(fieldWidth / 10); // 10% from right
var paddleYPos = Math.floor((fieldHeight - paddleHeight)/2); // middle

var ballSize = 10;         // how big is the ball
var ballXPos = Math.floor(fieldWidth / 10); // start 10% from left
var ballYPos = Math.floor((fieldHeight - ballSize) / 2); // middle
var ballXSpeed = Math.floor(Math.random() * 3) + 1;        // what is the initial velocity of the ball
var ballYSpeed = 2;
var ballColor = 0xffffff;  // what color is the ball

var keyState = 0;          // current state of arrow keys
var intTimeHandle = 0;         // pointer to the interval timer

var hiscore =  0;
var score = 0;

var ball;
var field;
var paddle;

// Debug output
// you can send debug print message to the screen using this function
// this is helpful if you are not getting the results that you expect
function output(message) {
    document.getElementById("output").innerHTML += message + "<br/>\n";
}

function setPosition(x,y) {
    this.xpos = x;
    this.ypos = y;
    this.obj.style.top = y.toString() + "px";
    this.obj.style.left = x.toString() + "px";
}

function setColor(newColor) {
    newColor = "000000" + newColor.toString(16);
    this.obj.style.backgroundColor = "#" + newColor.substr(newColor.length - 6);
}

// Playing field object
function PlayingField(width, height, color) {
    this.width = width;
    this.height = height;
    this.obj = document.getElementById("playingField");
    this.obj.style.width = width.toString() + "px";
    this.obj.style.height = height.toString() + "px";
    this.setColor = setColor;
    this.setColor(color);
    this.obj.onclick = function() {
        // start the game when the field is clicked
        // setup the timer tick event handler
        document.getElementById('instructions').style.display = 'none';
        if (intTimeHandle === 0) {
            intTimeHandle = setInterval(function(){timerTick();},10);
        }
    };
}

// Paddle object
function Paddle(width, height, color, speed, xpos, ypos) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.obj = document.getElementById("paddle");
    this.obj.style.width = width.toString() + "px";
    this.obj.style.height = height.toString() + "px";
    
    // you can use this method to change the color of the paddle
    this.setColor = setColor;
    this.setColor(color);

    // you can use this method to change the location of the paddle
    this.setPosition = setPosition;
    this.setPosition(xpos,ypos);
}

// Ball object
function Ball(size, xpos, ypos, xspeed, yspeed, color) {
    this.xspeed = xspeed;
    this.yspeed = yspeed;

    this.obj = document.getElementById("ball");

    // you can use this method to update the ball's location
    this.setPosition = setPosition;

    // you can use this method to change the size of the ball
    this.setSize = setSize;
    function setSize(size) {
        this.size = size;
        this.obj.style.width = this.size.toString() + "px";
        this.obj.style.height = this.size.toString() + "px";
        var radius = Math.floor(size / 2);
        this.obj.style.borderRadius = radius.toString() + "px";
        this.obj.style.MozBorderRadius = radius.toString() + "px";
        this.obj.style.WebKitBorderRadius = radius.toString() + "px";
    }
    output("resetting ball");    
    this.setPosition(xpos,ypos);
    output("set ball position to "+xpos+","+ypos);
    output("ball is at "+this.obj.style.left+","+this.obj.style.top);
    this.setSize(size);
    this.setColor = setColor;
    this.setColor(color);
}

// reset the game by instantiating a new field, ball, and paddle.
function resetGame(){
    field = new PlayingField(fieldWidth, fieldHeight, fieldColor);
    paddle = new Paddle(paddleWidth, paddleHeight, paddleColor, paddleSpeed, paddleXPos, paddleYPos);
    ball = new Ball(ballSize, ballXPos, ballYPos, ballXSpeed, ballYSpeed, ballColor);
}

// The following functions track the arrow keys when they are pressed
// pressing the up arrow key will cause keyState to be -1
// (negative is the up direction)
// pressing the down arrow key will cause keyState to be 1
// (positive is the down direction)
// releasing either key will cause keyState to be 0
// (no direction - stop the motion of the paddle)
document.onkeydown = function (e) {
    var evt = e || window.event;
    if (evt.keyCode == 38) {
        // up arrow
        keyState = -1;
    } else if (evt.keyCode == 40) {
        // down arrow
        keyState = 1;
    }
    return false;
};

document.onkeyup = function (e) {
    var evt = e || window.event;
    if (evt.keyCode == 38 || evt.keyCode == 40) {
        keyState = 0;
    }
    return false;
};

// This function should be called when the ball contacts the right wall
// of the field. This should only happen when the player fails to contact
// the ball with the paddle.
function gameOver() {
    clearInterval(intTimeHandle);
    document.getElementById('instructions').style.display = "block";
    field.setColor(0x033003);
    document.getElementById('instructions').innerHTML = "You Lose.";
    var playAgain = confirm("Play Again?");
    if (playAgain == true) {
        score = 0;
        resetGame();
        output("ball now at "+ball.obj.style.left+","+ball.obj.style.top);
    }
}

// create a timer call back function
// this is a list of things that need to be done every time the timer ticks
function timerTick() {
    // ******************** put your code here ***************************
    
    // Adjust the ball position
    output("timer ball now at "+ball.obj.style.left+","+ball.obj.style.top);

    var currx = ball.xpos;
    var curry = ball.ypos;
    var prevx = ball.xpos;
    
    currx += ball.xspeed;
    curry += ball.yspeed;
    
    // Check for ball leaving field
    // look for hit on left wall
    if (currx < 0) {
        currx = 0;
        ball.xspeed *= -1;
    }
    // look for hit on top wall
    if (curry < 0) {
        curry = 0;
        ball.yspeed *= -1;
    }
    // look for hit on right wall
    if (currx > (field.width - ball.size)) {
        currx = (field.width - ball.size);
        gameOver();
    }
    // look for hit on bottom wall
    if (curry > (field.height - ball.size)) {
        curry = (field.height - ball.size);
        ball.yspeed *= -1;
    }
    
    // check for ball contacting paddle and increment score
    if ((prevx <= (paddle.xpos - ball.size)) && (currx > (paddle.xpos - ball.size))) {
        if ((curry > (paddle.ypos - Math.floor(ball.size/2))) && (curry < paddle.ypos + paddle.height - Math.floor(ball.size/2))) {
            ball.xspeed *= -1.1;
            score++;
        }
    }
    ball.setPosition(currx,curry);
    
    // set highscore
    if (hiscore < score) {
        hiscore = score;
    }
    
    //display score and highscore
    document.getElementById('scorePanel').innerHTML = "Score: " + score.toString() + "    High Score: " + hiscore.toString();

    
    // Adjust the paddle position
    var pady = paddle.ypos;
    pady = pady + (paddle.speed * keyState);
    if (pady < 0) {
        pady = 0;
        keyState = 0;
    }
    if (pady > (field.height - paddle.height)) {
        pady = field.height - paddle.height;
        keyState = 0;
    }
    paddle.setPosition(paddle.xpos, pady);
}
resetGame();


    
    
    
    
    
    
    
 

    
    
    
    
    
    
    
    
    
    
    
    
    
    