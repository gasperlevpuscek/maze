
var CHEESE_SIZE = 20;
var CHEESE_COUNT = 20;
var CHEESE_COLLECT_DISTANCE = 14;
var DEFAULT_CANVAS_SIZE = 720;
var MAZE_SOURCE_WIDTH = 404;
var MAZE_SOURCE_HEIGHT = 404;
var cheeses = [];
var cheeseImage = new Image();
var cheesePanel;

cheeseImage.src = 'images/cheese.png';
cheeseEatSound.preload = 'auto';

var cheesePointsOnMaze = "250,10 266,10 266,26 282,26 282,90 298,90 298,74 314,74 314,58 298,58 298,42 314,42 314,26 330,26 330,74 362,74 362,90 330,90 330,106 346,106 346,122 298,122 298,106 282,106 282,122 266,122 266,42 250,42 250,74 234,74 234,58 186,58 186,90 170,90 170,106 154,106 154,138 138,138 138,74 106,74 106,106 90,106 90,90 74,90 74,58 58,58 58,90 42,90 42,122 58,122 58,138 74,138 74,170 90,170 90,186 74,186 74,202 58,202 58,186 42,186 42,218 90,218 90,234 106,234 106,250 90,250 90,266 106,266 106,298 90,298 90,314 122,314 122,330 106,330 106,346 122,346 122,362 106,362 106,378 74,378 74,394 122,394 122,378 154,378 154,362 138,362 138,346 170,346 170,330 154,330 154,314 138,314 138,298 122,298 122,282 138,282 138,266 122,266 122,250 154,250 154,234 186,234 186,250 170,250 170,266 154,266 154,298 218,298 218,282 234,282 234,314 250,314 250,282 266,282 266,298 282,298 282,266 298,266 298,298 314,298 314,330 330,330 330,346 314,346 314,394 298,394 298,378 266,378 266,362 234,362 234,378 218,378 218,362 202,362 202,402"
    .split(" ")
    .map(function (pointText) {
        var coordinates = pointText.split(",");
        return {
            x: parseInt(coordinates[0], 10),
            y: parseInt(coordinates[1], 10)
        };
    });

function updateCheesePanel() {
    var cheeseIndex;
    var collectedCheeseCount;

    if (!cheesePanel) {
        cheesePanel = document.getElementById('cheeseDiv');
    }

    if (!cheesePanel) {
        return;
    }

    collectedCheeseCount = CHEESE_COUNT - cheeses.length;
    cheesePanel.innerHTML = '';

    for (cheeseIndex = 0; cheeseIndex < collectedCheeseCount; cheeseIndex++) {
        var cheesePanelImage = document.createElement('img');

        cheesePanelImage.className = 'cheesePanelImage';
        cheesePanelImage.src = 'images/CheesePart.png';
        cheesePanelImage.alt = 'Collected cheese';
        cheesePanel.appendChild(cheesePanelImage);
    }
}

function spawnCheesesFromPolyline() {
    cheeses = [];

    var usedIndices = {};
    var maxCheeseCount = Math.min(CHEESE_COUNT, cheesePointsOnMaze.length);

    while (cheeses.length < maxCheeseCount) {
        var randomIndex = Math.floor(Math.random() * cheesePointsOnMaze.length);

        if (usedIndices[randomIndex]) {
            continue;
        }

        usedIndices[randomIndex] = true;

        var point = cheesePointsOnMaze[randomIndex];
        var canvasWidth = canvas && canvas.width ? canvas.width : DEFAULT_CANVAS_SIZE;
        var canvasHeight = canvas && canvas.height ? canvas.height : DEFAULT_CANVAS_SIZE;
        var scaleX = canvasWidth / MAZE_SOURCE_WIDTH;
        var scaleY = canvasHeight / MAZE_SOURCE_HEIGHT;
        var scaledX = point.x * scaleX;
        var scaledY = point.y * scaleY;
        var maxX = canvasWidth - CHEESE_SIZE;
        var maxY = canvasHeight - CHEESE_SIZE;
        var cheeseLeft = Math.max(0, Math.min(scaledX - CHEESE_SIZE / 2, maxX));
        var cheeseTop = Math.max(0, Math.min(scaledY - CHEESE_SIZE / 2, maxY));

        cheeses.push({
            x: cheeseLeft,
            y: cheeseTop,
            width: CHEESE_SIZE,
            height: CHEESE_SIZE
        });
    }

    updateCheesePanel();
}

function drawCheeses() {
    if (!canvasContext || cheeses.length === 0 || !cheeseImage.complete) {
        return;
    }

    cheeses.forEach(function (cheese) {
        canvasContext.drawImage(cheeseImage, cheese.x, cheese.y, cheese.width, cheese.height);
    });
}

function collectCheesesNearPlayer(playerX, playerY, playerW, playerH) {
    if (cheeses.length === 0) {
        return;
    }

    var cheeseCountBefore = cheeses.length;
    var playerCenterX = playerX + playerW / 2;
    var playerCenterY = playerY + playerH / 2;

    cheeses = cheeses.filter(function (cheese) {
        var cheeseCenterX = cheese.x + cheese.width / 2;
        var cheeseCenterY = cheese.y + cheese.height / 2;
        var closeOnX = Math.abs(playerCenterX - cheeseCenterX) <= CHEESE_COLLECT_DISTANCE;
        var closeOnY = Math.abs(playerCenterY - cheeseCenterY) <= CHEESE_COLLECT_DISTANCE;

        return !(closeOnX && closeOnY);
    });

    if (cheeses.length < cheeseCountBefore) {
        updateCheesePanel();
        cheeseEatSfx();
        nom();
    }
}


