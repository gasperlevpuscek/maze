let canvas;
let ctx;
let mazeImg;
let collisionCanvas;
let collisionCtx;

const player = {
    x: 0,
    y: 0,
    r: 10,
    speed: 3
};

const goal = {
    x: 0,
    y: 0,
    r: 10
};

let startTime = 0;
let endTime = 0;
let won = false;

const key = { w: false, a: false, s: false, d: false };

window.onload = function () {
    canvas = document.getElementById('mazeCanvas');
    ctx = canvas.getContext('2d');

    collisionCanvas = document.createElement('canvas');
    collisionCanvas.width = canvas.width;
    collisionCanvas.height = canvas.height;
    collisionCtx = collisionCanvas.getContext('2d', { willReadFrequently: true });

    mazeImg = new Image();
    mazeImg.onload = function () {
        buildCollisionLayer();

        player.x = canvas.width / 2;
        player.y = player.r;
        while (hitsWall(player.x, player.y) && player.y < canvas.height - player.r) {
            player.y += 1;
        }

        goal.x = canvas.width / 2;
        goal.y = canvas.height - goal.r;
        while (hitsWall(goal.x, goal.y) && goal.y > goal.r) {
            goal.y -= 1;
        }

        startTime = performance.now();
        requestAnimationFrame(loop);
    };
    mazeImg.src = 'images/maze25.svg';

    document.addEventListener('keydown', onDown);
    document.addEventListener('keyup', onUp);
};

function onDown(e) {
    const k = e.key.toLowerCase();
    if (k in key) {
        key[k] = true;
        e.preventDefault();
    }
}

function onUp(e) {
    const k = e.key.toLowerCase();
    if (k in key) {
        key[k] = false;
        e.preventDefault();
    }
}

function loop() {
    if (!won) {
        let dx = 0;
        let dy = 0;

        if (key.w) dy -= player.speed;
        if (key.s) dy += player.speed;
        if (key.a) dx -= player.speed;
        if (key.d) dx += player.speed;

        tryMove(player.x + dx, player.y);
        tryMove(player.x, player.y + dy);

        if (squaresTouch(player, goal)) {
            won = true;
            endTime = performance.now();
        }
    }

    draw();
    requestAnimationFrame(loop);
}

function tryMove(nextX, nextY) {
    if (!hitsWall(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(mazeImg, -3, -3, canvas.width + 6, canvas.height + 6);

    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x - goal.r, goal.y - goal.r, goal.r * 2, goal.r * 2);

    ctx.fillStyle = 'red';
    ctx.fillRect(player.x - player.r, player.y - player.r, player.r * 2, player.r * 2);

    const timeMs = won ? (endTime - startTime) : (performance.now() - startTime);
    const seconds = (timeMs / 1000).toFixed(1);
    ctx.fillStyle = 'black';
    ctx.font = '20px sans-serif';
    ctx.fillText('Time: ' + seconds + 's', 15, 30);

    if (won) {
        ctx.font = '36px sans-serif';
        ctx.fillStyle = 'blue';
        ctx.textAlign = 'center';
        ctx.fillText('You win!', canvas.width / 2, canvas.height / 2);
        ctx.textAlign = 'start';
    }
}

function squaresTouch(a, b) {
    const aLeft = a.x - a.r;
    const aRight = a.x + a.r;
    const aTop = a.y - a.r;
    const aBottom = a.y + a.r;

    const bLeft = b.x - b.r;
    const bRight = b.x + b.r;
    const bTop = b.y - b.r;
    const bBottom = b.y + b.r;

    return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

function buildCollisionLayer() {
    collisionCtx.fillStyle = 'white';
    collisionCtx.fillRect(0, 0, canvas.width, canvas.height);
    collisionCtx.drawImage(mazeImg, -3, -3, canvas.width + 6, canvas.height + 6);
}

function hitsWall(x, y) {
    if (x - player.r < 0 || y - player.r < 0 || x + player.r >= canvas.width || y + player.r >= canvas.height) {
        return true;
    }

    const points = [
        [x, y],
        [x + player.r, y],
        [x - player.r, y],
        [x, y + player.r],
        [x, y - player.r]
    ];

    for (const p of points) {
        const pixel = collisionCtx.getImageData(Math.round(p[0]), Math.round(p[1]), 1, 1).data;
        if (pixel[0] < 80 && pixel[1] < 80 && pixel[2] < 80) {
            return true;
        }
    }

    return false;
}

