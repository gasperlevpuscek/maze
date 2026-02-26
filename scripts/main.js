var canvas = document.getElementById("mazeCanvas");
var ctx = canvas.getContext("2d");

var maze = new Image();
maze.src = "images/maze25.svg";

var ratImage = new Image();
ratImage.src = "images/rat.png";

var cheeseImage = new Image();
cheeseImage.src = "images/cheese.png";

var collisionCanvas = document.createElement("canvas");
collisionCanvas.width = canvas.width;
collisionCanvas.height = canvas.height;
var collisionCtx = collisionCanvas.getContext("2d");

var playerX = 0;
var playerY = 0;
var playerSize = 10;
var speed = 3;

var goalX = 0;
var goalY = 0;
var goalSize = 10;

var w = false;
var a = false;
var s = false;
var d = false;

var win = false;



maze.onload = function () {
    collisionCtx.fillStyle = "white";
    collisionCtx.fillRect(0, 0, canvas.width, canvas.height);
    collisionCtx.drawImage(maze, 0, 0, canvas.width, canvas.height);


    playerX = canvas.width / 2;
    playerY = playerSize;

    while (isWall(playerX, playerY)) {
        playerY++;
    }

    goalX = canvas.width / 2;
    goalY = canvas.height - goalSize;

    while (isWall(goalX, goalY)) {
        goalY--;
    }

    requestAnimationFrame(loop);
};



document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowUp") w = true;
    if (e.key == "ArrowLeft") a = true;
    if (e.key == "ArrowDown") s = true;
    if (e.key == "ArrowRight") d = true;
});

document.addEventListener("keyup", function (e) {
    if (e.key == "ArrowUp") w = false;
    if (e.key == "ArrowLeft") a = false;
    if (e.key == "ArrowDown") s = false;
    if (e.key == "ArrowRight") d = false;
});


function loop() {

    if (!win) {

        if (w) {
            if (!isWall(playerX, playerY - speed)) {
                playerY -= speed;
            }
        }

        if (s) {
            if (!isWall(playerX, playerY + speed)) {
                playerY += speed;
            }
        }

        if (a) {
            if (!isWall(playerX - speed, playerY)) {
                playerX -= speed;
            }
        }

        if (d) {
            if (!isWall(playerX + speed, playerY)) {
                playerX += speed;
            }
        }


        if (
            playerX - playerSize < goalX + goalSize &&
            playerX + playerSize > goalX - goalSize &&
            playerY - playerSize < goalY + goalSize &&
            playerY + playerSize > goalY - goalSize
        ) {
            win = true;
        }
    }

    draw();
    requestAnimationFrame(loop);
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(maze, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(cheeseImage, goalX - goalSize, goalY - goalSize, goalSize * 2, goalSize * 2);

    ctx.drawImage(ratImage, playerX - playerSize, playerY - playerSize, playerSize * 2, playerSize * 2);

    if (win) {
        ctx.fillStyle = "yellow";
        ctx.font = "36px Arial";
        ctx.fillText("Win!", canvas.width / 2 - 80, canvas.height / 2);
    }
}


function isWall(x, y) {

    if (
        x - playerSize < 0 ||
        y - playerSize < 0 ||
        x + playerSize >= canvas.width ||
        y + playerSize >= canvas.height
    ) {
        return true;
    }

    var points = [
        [x, y],
        [x + playerSize, y],
        [x - playerSize, y],
        [x, y + playerSize],
        [x, y - playerSize]
    ];

    for (var i = 0; i < points.length; i++) {
        var px = Math.round(points[i][0]);
        var py = Math.round(points[i][1]);

        var pixel = collisionCtx.getImageData(px, py, 1, 1).data;

        if (pixel[0] < 80 && pixel[1] < 80 && pixel[2] < 80) {
            return true;
        }
    }

    return false;
}