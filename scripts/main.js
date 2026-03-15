var canvas, canvasContext,
    playerX = 430,
    playerY = 20,
    playerW = 15,
    playerH = 15,

    spriteSize = 60,
    offsetX = (spriteSize - playerW) / 2,
    offsetY = (spriteSize - playerH) / 2,

    playerSpeedX = 0,
    playerSpeedY = 0,
    mazeBackground = new Image(),
    ratRightFrames = [new Image(), new Image()],
    ratLeftFrames = [new Image(), new Image()],
    ratAnimationFrame = 0,
    ratAnimationTick = 0,
    ratAnimationSpeed = 8,
    ratDirection = 'right',
    mazeCollisionCanvas,
    mazeCollisionContext;

gameEnded = false;
var KEY_UP = 38,
    KEY_LEFT = 37,
    KEY_DOWN = 40,
    KEY_RIGHT = 39,

    keyHeld_Down = false,
    keyHeld_Up = false,
    keyHeld_Left = false,
    keyHeld_Right = false;


window.onload = function () {
    canvas = document.getElementById('mazeCanvas');
    canvasContext = canvas.getContext('2d');

    ratRightFrames[0].src = 'images/ratSprites/ratTemp.png';
    ratRightFrames[1].src = 'images/ratSprites/ratTemp.png';
    ratLeftFrames[0].src = 'images/ratSprites/ratTemp.png';
    ratLeftFrames[1].src = 'images/ratSprites/ratTemp.png';

    mazeCollisionCanvas = document.createElement('canvas');
    mazeCollisionCanvas.width = canvas.width;
    mazeCollisionCanvas.height = canvas.height;
    mazeCollisionContext = mazeCollisionCanvas.getContext('2d');

    mazeBackground.onload = function () {
        mazeCollisionContext.clearRect(0, 0, canvas.width, canvas.height);
        mazeCollisionContext.drawImage(mazeBackground, 0, 0, canvas.width, canvas.height);
        spawnCheesesFromPolyline();
        initCat();

        var framesPerSecond = 60;
        setInterval(function () {
            playerMove();
            drawAll();
        }, 1000 / framesPerSecond);
    };

    mazeBackground.src = 'images/maze25.svg';

    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);
};


function keyPressed(evt) {
    if (evt.keyCode == KEY_LEFT) {
        keyHeld_Left = true;
    }
    if (evt.keyCode == KEY_RIGHT) {
        keyHeld_Right = true;
    }
    if (evt.keyCode == KEY_UP) {
        keyHeld_Up = true;
    }
    if (evt.keyCode == KEY_DOWN) {
        keyHeld_Down = true;
    }

    evt.preventDefault();
}

function keyReleased(evt) {
    if (evt.keyCode == KEY_LEFT) {
        keyHeld_Left = false;
    }
    if (evt.keyCode == KEY_RIGHT) {
        keyHeld_Right = false;
    }
    if (evt.keyCode == KEY_UP) {
        keyHeld_Up = false;
    }
    if (evt.keyCode == KEY_DOWN) {
        keyHeld_Down = false;
    }

    evt.preventDefault();
}

function blockedInDirection(nextX, nextY, dirX, dirY) {
    var i;

    if (dirX > 0) {
        for (i = 0; i < playerH; i++) {
            if (isBlackPixel(nextX + playerW - 1, nextY + i)) {
                return true;
            }
        }
        return false;
    }

    if (dirX < 0) {
        for (i = 0; i < playerH; i++) {
            if (isBlackPixel(nextX, nextY + i)) {
                return true;
            }
        }
        return false;
    }

    if (dirY > 0) {
        for (i = 0; i < playerW; i++) {
            if (isBlackPixel(nextX + i, nextY + playerH - 1)) {
                return true;
            }
        }
        return false;
    }

    if (dirY < 0) {
        for (i = 0; i < playerW; i++) {
            if (isBlackPixel(nextX + i, nextY)) {
                return true;
            }
        }
        return false;
    }

    return false;
}

function playerMove() {
    playerSpeedX = 0;
    playerSpeedY = 0;

    if (keyHeld_Up) {
        playerSpeedY = -5;
    } else if (keyHeld_Down) {
        playerSpeedY = 5;
    } else if (keyHeld_Left) {
        playerSpeedX = -5;
    } else if (keyHeld_Right) {
        playerSpeedX = 5;
    }

    if (keyHeld_Right || keyHeld_Down) {
        ratDirection = 'right';
        ratAnimationTick++;
        if (ratAnimationTick >= ratAnimationSpeed) {
            ratAnimationTick = 0;
            ratAnimationFrame = (ratAnimationFrame + 1) % 2;
        }
    } else if (keyHeld_Left || keyHeld_Up) {
        ratDirection = 'left';
        ratAnimationTick++;
        if (ratAnimationTick >= ratAnimationSpeed) {
            ratAnimationTick = 0;
            ratAnimationFrame = (ratAnimationFrame + 1) % 2;
        }
    } else {
        ratAnimationTick = 0;
        ratAnimationFrame = 0;
    }

    // Maze collision
    var stepCount = Math.max(Math.abs(playerSpeedX), Math.abs(playerSpeedY));
    var stepX = stepCount > 0 ? playerSpeedX / stepCount : 0;
    var stepY = stepCount > 0 ? playerSpeedY / stepCount : 0;
    var stepIndex;


    for (stepIndex = 0; stepIndex < stepCount; stepIndex++) {
        var nextX = playerX + stepX;
        var nextY = playerY + stepY;

        if (stepX !== 0 && blockedInDirection(nextX, playerY, stepX, 0)) {
            break;
        }
        if (stepY !== 0 && blockedInDirection(playerX, nextY, 0, stepY)) {
            break;
        }

        playerX = nextX;
        playerY = nextY;
    }

    // canvas sides collision
    if (playerY < 0) {
        playerY = 0;
    } else if (playerY > canvas.height - playerH) {
        playerY = canvas.height - playerH;
    }

    if (playerX < 0) {
        playerX = 0;
    } else if (playerX > canvas.width - playerW) {
        playerX = canvas.width - playerW;
    }

    collectCheesesNearPlayer(playerX, playerY, playerW, playerH);
}

function drawAll() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(mazeBackground, 0, 0, canvas.width, canvas.height);
    drawCheeses();
    drawCat();
    var activeFrames = ratDirection === 'left' ? ratLeftFrames : ratRightFrames;
    var spriteImg = activeFrames[ratAnimationFrame];
    canvasContext.drawImage(spriteImg, playerX - offsetX, playerY - offsetY, spriteSize, spriteSize);

}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function isBlackPixel(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
        return true;
    }

    var pixel = mazeCollisionContext.getImageData(x, y, 1, 1).data;
    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];
    var a = pixel[3];

    return a > 0 && r < 10 && g < 10 && b < 10;
}
