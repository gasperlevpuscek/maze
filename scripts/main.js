var canvas, canvasContext,
    playerX = 350,
    playerY = 10,
    playerW = 20,
    playerH = 20,
    playerSpeedX = 0,
    playerSpeedY = 0,
    playerColor = "black",
    backgroundColor = "white";



window.onload = function () {
    canvas = document.getElementById('mazeCanvas');
    canvasContext = canvas.getContext('2d');

    setInterval(function () {
        playerMove();
        drawAll();

        document.addEventListener('keydown', keyPressed);
        document.addEventListener('keyup', keyReleased);

    }, 1000 / 40);
}

// Input
var
    KEY_W = 87,
    KEY_A = 65,
    KEY_S = 83,
    KEY_D = 68,

    keyHeld_Down = false,
    keyHeld_Up = false,
    keyHeld_Left = false,
    keyHeld_Right = false;


function keyPressed(evt) {
    if (evt.keyCode == KEY_A) {
        keyHeld_Left = true;
    }
    if (evt.keyCode == KEY_D) {
        keyHeld_Right = true;
    }
    if (evt.keyCode == KEY_W) {
        keyHeld_Up = true;
    }
    if (evt.keyCode == KEY_S) {
        keyHeld_Down = true;
    }

    evt.preventDefault();
}

function keyReleased(evt) {
    // console.log("Key pressed: "+evt.keyCode);
    if (evt.keyCode == KEY_A) {
        keyHeld_Left = false;
    }
    if (evt.keyCode == KEY_D) {
        keyHeld_Right = false;

    }
    if (evt.keyCode == KEY_W) {
        keyHeld_Up = false;
    }
    if (evt.keyCode == KEY_S) {
        keyHeld_Down = false;

    }
    playerSpeedX = 0;
    playerSpeedY = 0;
}

// moving 
function playerMove() {
    if (keyHeld_Up) {
        playerSpeedY = -7;
    }
    if (keyHeld_Down) {
        playerSpeedY = 7;
    }
    if (keyHeld_Left) {
        playerSpeedX = -7;
    }
    if (keyHeld_Right) {
        playerSpeedX = 7;
    }
    playerX += playerSpeedX;
    playerY += playerSpeedY;

    if (playerY <= 0) {
        playerY = 0;
        playerSpeedY = 0;
    } else if (playerY >= canvas.height - playerH) {
        playerY = canvas.height - playerH;
        playerSpeedY = 0;
    }

    if (playerX >= canvas.width - playerW) {
        playerX = canvas.width - playerW;
        playerSpeedX = 0;
    } else if (playerX <= 0) {
        playerX = 0;
        playerSpeedX = 0;
    }
}

function drawAll() {
    colorRect(0, 0, canvas.width, canvas.height, backgroundColor);
    colorRect(playerX, playerY, playerW, playerH, playerColor);
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

