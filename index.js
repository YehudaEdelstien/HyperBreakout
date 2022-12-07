// canvas variables
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ball variables
const ball = {
    radius: 10,
    xPos: 10,
    yPos: 20,
    xSpeed: 2,
    ySpeed: 2
}

function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.xPos, ball.yPos,ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath()
}

function updateBall() {
    ball.xPos += ball.xSpeed;
    ball.yPos += ball.ySpeed;
    if (ball.xPos < 0 + ball.radius || ball.xPos > canvas.width - ball.radius) {
        ball.xSpeed *= -1;
    }
    if (ball.yPos < 0 + ball.radius || ball.yPos > canvas.height - ball.radius) {
        ball.ySpeed *= -1;
    }
    drawBall();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateBall();
    requestAnimationFrame(update);
}

update();