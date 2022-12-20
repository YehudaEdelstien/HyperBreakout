window.onload = () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    //game elements
    const paddle = {
        xPos: 0,
        yPos: canvas.height - 15,
        height: 8,
        width: 60
    }

    const ball = {
        radius: 10,
        xPos: canvas.width / 2,
        yPos: canvas.height - 5,
        angle: 0.5 / 2 * Math.PI,
        speed: 15,
        xSpeed: Math.cos(0.5 / 2 * Math.PI  * -1) * 15,
        ySpeed: Math.sin(0.5 / 2 * Math.PI * -1) * 15,

        bounce(dir) {
            if (dir === "x"){
                this.xSpeed *= -1;
            } else if (dir === "y") {
                this.ySpeed *= -1;
            }
        }
    }

    function Brick(x, y) {
        this.xPos = x + 2;
        this.yPos = y + 1;
        this.width = 47;
        this.height = 27;
        this.isActive = true;
    }

    const brickYGap = 30;
    const brickXGap = 50;

    const bricks = [];

    for (let i = -10; i < 4; i++) {
        for (let j = 0; j < 5; j++) {
            bricks.push(new Brick(j * brickXGap, i * brickYGap))
        }
    }

    let brickFallTimer = 0;
    const brickFallSpeed = 0.2;
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
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.xPos, paddle.yPos, paddle.width, paddle.height);
        ctx.fill();
        ctx.closePath();
    }

    function checkCollisions() {
        checkWallCol();
        checkBrickCol();
        checkPaddleCol();

        function checkPaddleCol() {
            if (ball.yPos + ball.radius >= paddle.yPos && ball.yPos - ball.radius <= paddle.yPos + paddle.height && ball.ySpeed > 0) {
                if (ball.xPos + ball.radius >= paddle.xPos && ball.xPos - ball.radius <= paddle.xPos + paddle.width) {
                    ball.angle = ((ball.xPos - ball.radius - paddle.xPos) / paddle.width) / 2 * Math.PI;
                    ball.xSpeed = Math.cos(ball.angle + 1) * -ball.speed;
                    ball.ySpeed = Math.sin(ball.angle + 1) * -ball.speed;
                    console.log(ball.angle);
                }
            }
        }

        function checkBrickCol() {
            bricks.forEach(b => {
                if (b.isActive == false) {
                    return;
                }
                if (ball.xPos + ball.radius > b.xPos &&
                    ball.xPos - ball.radius < b.xPos + b.width &&
                    ball.yPos + ball.radius > b.yPos &&
                    ball.yPos - ball.radius < b.yPos + b.height) {
                    b.isActive = false;
                    ball.bounce("y");
                }
            });
        }

        function checkWallCol() {
            if (ball.xPos - ball.radius < 0 || ball.xPos + ball.radius > canvas.width) {
                ball.bounce("x");
            }
            if (ball.yPos - ball.radius < 0) {
                ball.bounce("y");
            }
        }
    }

    function updatePaddle() {
        if (mousePos.x < 0 + (paddle.width / 2)) {
            paddle.xPos = 0;
        } else if (mousePos.x > canvas.width - (paddle.width / 2)) {
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

        brickFallTimer += brickFallSpeed;
        if (brickFallTimer >= 1){
            bricks.forEach(b => b.yPos++)
            brickFallTimer--;
        }
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