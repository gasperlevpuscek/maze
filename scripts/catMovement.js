var ORIGINAL_WIDTH = 404;
var ORIGINAL_HEIGHT = 404;
var CAT_SIZE = 20;

var catStartDelayFrames = 200;
var catStartDelayCounter = 0;

var currentCatPoint = 0;

var currentPoint;
var targetCatX, targetCatY;

var catSpriteSize = 60,
    catOffsetX = (catSpriteSize - CAT_SIZE) / 2,
    catOffsetY = (catSpriteSize - CAT_SIZE) / 2;

var catElement;
var catCurrentSrc = '';
var CAT_LEFT_SRC = 'images/catSprite/catLeft.gif';
var CAT_RIGHT_SRC = 'images/catSprite/catRight.gif';

var catSpeed = 1.5;

var catPathPoints = "202,2 202,10 234,10 234,26 250,26 250,10 266,10 266,26 282,26 282,90 298,90 298,74 314,74 314,58 298,58 298,42 314,42 314,26 330,26 330,74 362,74 362,90 330,90 330,106 346,106 346,122 298,122 298,106 282,106 282,122 266,122 266,42 250,42 250,74 234,74 234,58 186,58 186,90 170,90 170,106 154,106 154,138 138,138 138,74 106,74 106,106 90,106 90,90 74,90 74,58 58,58 58,90 42,90 42,122 58,122 58,138 74,138 74,170 90,170 90,186 74,186 74,202 58,202 58,186 42,186 42,218 90,218 90,234 106,234 106,250 90,250 90,266 106,266 106,298 90,298 90,314 122,314 122,330 106,330 106,346 122,346 122,362 106,362 106,378 74,378 74,394 122,394 122,378 154,378 154,362 138,362 138,346 170,346 170,330 154,330 154,314 138,314 138,298 122,298 122,282 138,282 138,266 122,266 122,250 154,250 154,234 186,234 186,250 170,250 170,266 154,266 154,298 218,298 218,282 234,282 234,314 250,314 250,282 266,282 266,298 282,298 282,266 298,266 298,298 314,298 314,330 330,330 330,346 314,346 314,394 298,394 298,378 266,378 266,362 234,362 234,378 218,378 218,362 202,362 202,402"
    .split(" ")
    .map(function (pointText) {
        var coordinates = pointText.split(",");
        return {
            x: parseInt(coordinates[0], 10),
            y: parseInt(coordinates[1], 10)
        };
    });

var catLocationX, catLocationY;

function initCat() {
    var firstPoint = catPathPoints[0];

    catElement = document.getElementById('cat');
    catLocationX = (firstPoint.x * canvas.width / ORIGINAL_WIDTH) - CAT_SIZE / 2;
    catLocationY = (firstPoint.y * canvas.height / ORIGINAL_HEIGHT) - CAT_SIZE / 2;
    setCatSprite(CAT_LEFT_SRC);
    updateCatPosition();
}

function setCatSprite(newSrc) {
    if (!catElement || catCurrentSrc === newSrc) {
        return;
    }

    catCurrentSrc = newSrc;
    catElement.src = newSrc;
}

function updateCatSpriteFromDirection(moveX, moveY) {
    if (moveX > 0 || moveY > 0) {
        setCatSprite(CAT_RIGHT_SRC);
        return;
    }

    setCatSprite(CAT_LEFT_SRC);
}

function updateCatPosition() {
    if (!catElement) {
        return;
    }

    catElement.style.left = (catLocationX - catOffsetX) + 'px';
    catElement.style.top = (catLocationY - catOffsetY - 5) + 'px';
}

function drawCat() {
    if (!catElement) {
        return;
    }

    if (catStartDelayCounter < catStartDelayFrames) {
        catStartDelayCounter++;
        catElement.style.visibility = 'hidden';
        return;
    }

    catElement.style.visibility = 'visible';

    if (gameEnded) {
        updateCatPosition();
        return;
    }

    currentPoint = catPathPoints[currentCatPoint];

    targetCatX = (currentPoint.x * canvas.width / ORIGINAL_WIDTH) - CAT_SIZE / 2;
    targetCatY = (currentPoint.y * canvas.height / ORIGINAL_HEIGHT) - CAT_SIZE / 2;

    var dx = targetCatX - catLocationX;
    var dy = targetCatY - catLocationY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    updateCatSpriteFromDirection(dx, dy);

    if (distance <= catSpeed) {
        catLocationX = targetCatX;
        catLocationY = targetCatY;

        if (currentCatPoint < catPathPoints.length - 1) {
            currentCatPoint++;
        } else {
            ripRat2();
        }
    } else {
        catLocationX += (dx / distance) * catSpeed;
        catLocationY += (dy / distance) * catSpeed;
    }

    updateCatPosition();

    if (!gameEnded && Math.abs(playerX - catLocationX) <= 12 && Math.abs(playerY - catLocationY) <= 12) {
        ripRat();
    }
}

function ripRat() {
    meowSfx();
    stopSound();
    pianoMan();
    gameEnded = true;
    Swal.fire({
        title: "You Lose!",
        text: "The cat has caught you.",
        confirmButtonColor: "#d63030",
        confirmButtonText: "Retry",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}


function ripRat2() {
    meowSfx();
    stopSound();
    pianoMan();
    gameEnded = true;
    Swal.fire({
        title: "You Lose",
        text: "The cat has trapped you in the maze.",
        confirmButtonColor: "#d64330",
        confirmButtonText: "Retry",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });
}