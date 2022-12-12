window.onload = () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    //game elements
    const paddle = {
        xPos: 0,
        yPos: canvas.height - 15,
        speed: 10,
        height: 8,
        width: 60
    }

    const ball = {
        radius: 10,
        xPos: 10,
        yPos: canvas.height - 10,
        xSpeed: 3,
        ySpeed: -3
    }

    function Brick(x, y) {
        this.xPos = x;
        this.yPos = y;
        this.width = 50;
        this.height = 30;
        this.isActive = true;
    }

    const brickYGap = 40;
    const brickXGap = 60;

    const bricks = [];

    for (let i = 1; i < 10; i++) {
        for (let j = 1; j < 4; j++) {
            bricks.push(new Brick(j * brickXGap, i * brickYGap))
        }
    }

    // input
    const mousePos = {
        x: 0,
        y: 0
    }

    document.onmousemove = (e) => {
        mousePos.x = e.clientX - canvas.offsetLeft;
    }

    //Game functions
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.xPos, ball.yPos, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    function drawBrick(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
        ctx.fill();
        ctx.closePath();
    }

    function checkCollisions() {
        if (ball.xPos < 0 + ball.radius || ball.xPos > canvas.width - ball.radius) {
            ball.xSpeed *= -1;
        }
        if (ball.yPos < 0 + ball.radius || ball.yPos > canvas.height - ball.radius) {
            ball.ySpeed *= -1;
        }

        bricks.forEach(b => {
            if (b.isActive == false) {
                return;
            }
            if (
                ball.xPos + ball.radius > b.xPos &&
                ball.xPos - ball.radius < b.xPos + b.width &&
                ball.yPos + ball.radius > b.yPos &&
                ball.yPos - ball.radius < b.yPos + b.height
            ) {
                b.isActive = false;
                ball.ySpeed *= -1;
            }
        });
    }

    function updatePaddle() {
        if (mousePos.x < 0 + (paddle.width / 2)) {
            paddle.xPos = 0;
        } else if (mousePos.x > canvas.width - (paddle.width / 2)){
            paddle.xPos = canvas.width - paddle.width;
        } else {
            paddle.xPos = mousePos.x - (paddle.width / 2);
        }
        drawPaddle();
    }

    function updateBall() {
        ball.xPos += ball.xSpeed;
        ball.yPos += ball.ySpeed;

        checkCollisions();
        drawBall();
    }

    function updateBricks() {
        bricks.forEach(b => {
            if (b.isActive) {
                drawBrick(b.xPos, b.yPos, b.width, b.height);
            }
        });
    }

    function mainLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updatePaddle();
        updateBall();
        updateBricks();
        requestAnimationFrame(mainLoop);
    }

    mainLoop();
}