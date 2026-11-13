
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 200, y: 200 }];
let food = {
    x: 100,
    y: 100
};

let direction = "RIGHT";
let score = 0;
let gameOver = false;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN")
        direction = "UP";

    else if (event.key === "ArrowDown" && direction !== "UP")
        direction = "DOWN";

    else if (event.key === "ArrowLeft" && direction !== "RIGHT")
        direction = "LEFT";

    else if (event.key === "ArrowRight" && direction !== "LEFT")
        direction = "RIGHT";
}

function drawGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, 400, 400);

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Draw green snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#00ff00" : "green";
        ctx.fillRect(part.x, part.y, box, box);
    });

    let head = { ...snake[0] };

    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Wall collision
    if (
        head.x < 0 || head.x >= 400 ||
        head.y < 0 || head.y >= 400
    ) {
        endGame();
        return;
    }

    // Self collision
    const ateFood =
        head.x === food.x && head.y === food.y;

    const body = ateFood ? snake : snake.slice(0, -1);

    if (body.some(part =>
        part.x === head.x && part.y === head.y
    )) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (ateFood) {
        score++;
        document.getElementById("score").textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function createFood() {
    do {
        food.x = Math.floor(Math.random() * 20) * box;
        food.y = Math.floor(Math.random() * 20) * box;
    } while (snake.some(part =>
        part.x === food.x && part.y === food.y
    ));
}

function endGame() {
    gameOver = true;
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER!", 100, 200);
}

function restartGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    score = 0;
    gameOver = false;

    document.getElementById("score").textContent = 0;
    createFood();
    drawGame();
}

setInterval(drawGame, 120);
