








const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const timeDisplay = document.getElementById('time-val');

const BASE_CANVAS_SIZE = 404;

// Maze lines - you can modify these coordinates to change the maze layout
const mazeLines = [
    [2, 2, 194, 2], [210, 2, 402, 2], [130, 18, 162, 18], [210, 18, 226, 18],
    [274, 18, 290, 18], [306, 18, 338, 18], [34, 34, 50, 34], [66, 34, 98, 34],
    [146, 34, 178, 34], [226, 34, 274, 34], [290, 34, 306, 34], [338, 34, 354, 34],
    [18, 50, 34, 50], [50, 50, 66, 50], [98, 50, 114, 50], [130, 50, 146, 50],
    [178, 50, 242, 50], [306, 50, 322, 50], [354, 50, 370, 50], [18, 66, 34, 66],
    [98, 66, 162, 66], [194, 66, 226, 66], [290, 66, 306, 66], [338, 66, 386, 66],
    [34, 82, 50, 82], [82, 82, 98, 82], [114, 82, 130, 82], [146, 82, 178, 82],
    [226, 82, 258, 82], [322, 82, 354, 82], [370, 82, 402, 82], [18, 98, 34, 98],
    [66, 98, 82, 98], [210, 98, 242, 98], [274, 98, 306, 98], [338, 98, 370, 98],
    [50, 114, 66, 114], [82, 114, 114, 114], [162, 114, 178, 114], [210, 114, 242, 114],
    [306, 114, 338, 114], [354, 114, 370, 114], [34, 130, 50, 130], [66, 130, 82, 130],
    [178, 130, 210, 130], [226, 130, 258, 130], [274, 130, 354, 130], [370, 130, 402, 130],
    [50, 146, 66, 146], [98, 146, 114, 146], [130, 146, 178, 146], [210, 146, 242, 146],
    [258, 146, 274, 146], [306, 146, 338, 146], [354, 146, 386, 146], [34, 162, 50, 162],
    [82, 162, 114, 162], [274, 162, 306, 162], [354, 162, 386, 162], [34, 178, 82, 178],
    [114, 178, 130, 178], [178, 178, 194, 178], [290, 178, 306, 178], [322, 178, 338, 178],
    [2, 194, 34, 194], [82, 194, 114, 194], [130, 194, 146, 194], [194, 194, 274, 194],
    [290, 194, 322, 194], [338, 194, 370, 194], [18, 210, 34, 210], [50, 210, 98, 210],
    [146, 210, 194, 210], [354, 210, 402, 210], [34, 226, 66, 226], [98, 226, 130, 226],
    [146, 226, 210, 226], [258, 226, 290, 226], [338, 226, 354, 226], [18, 242, 34, 242],
    [82, 242, 98, 242], [114, 242, 146, 242], [162, 242, 178, 242], [210, 242, 258, 242],
    [290, 242, 306, 242], [322, 242, 338, 242], [354, 242, 386, 242], [50, 258, 82, 258],
    [98, 258, 114, 258], [130, 258, 162, 258], [178, 258, 242, 258], [274, 258, 354, 258],
    [386, 258, 402, 258], [18, 274, 50, 274], [82, 274, 98, 274], [114, 274, 130, 274],
    [162, 274, 178, 274], [210, 274, 274, 274], [322, 274, 338, 274], [354, 274, 370, 274],
    [2, 290, 18, 290], [50, 290, 98, 290], [130, 290, 146, 290], [162, 290, 210, 290],
    [306, 290, 322, 290], [338, 290, 354, 290], [370, 290, 402, 290], [66, 306, 82, 306],
    [98, 306, 130, 306], [146, 306, 226, 306], [274, 306, 306, 306], [322, 306, 338, 306],
    [50, 322, 66, 322], [82, 322, 114, 322], [130, 322, 146, 322], [162, 322, 210, 322],
    [226, 322, 274, 322], [322, 322, 386, 322], [34, 338, 82, 338], [114, 338, 162, 338],
    [274, 338, 322, 338], [370, 338, 386, 338], [18, 354, 34, 354], [66, 354, 82, 354],
    [98, 354, 114, 354], [146, 354, 178, 354], [194, 354, 274, 354], [322, 354, 338, 354],
    [386, 354, 402, 354], [18, 370, 50, 370], [66, 370, 98, 370], [114, 370, 146, 370],
    [162, 370, 178, 370], [242, 370, 258, 370], [274, 370, 306, 370], [338, 370, 402, 370],
    [18, 386, 34, 386], [82, 386, 114, 386], [130, 386, 162, 386], [210, 386, 274, 386],
    [354, 386, 386, 386], [2, 402, 194, 402], [210, 402, 402, 402], [2, 2, 2, 402],
    [18, 18, 18, 66], [18, 82, 18, 178], [18, 210, 18, 274], [18, 290, 18, 354],
    [34, 2, 34, 34], [34, 66, 34, 82], [34, 98, 34, 162], [34, 178, 34, 194],
    [34, 210, 34, 226], [34, 258, 34, 338], [34, 354, 34, 370], [34, 386, 34, 402],
    [50, 18, 50, 82], [50, 98, 50, 114], [50, 130, 50, 146], [50, 194, 50, 210],
    [50, 226, 50, 258], [50, 290, 50, 322], [50, 338, 50, 354], [50, 370, 50, 386],
    [66, 2, 66, 18], [66, 66, 66, 98], [66, 114, 66, 130], [66, 146, 66, 194],
    [66, 226, 66, 242], [66, 274, 66, 290], [66, 354, 66, 402], [82, 18, 82, 82],
    [82, 98, 82, 162], [82, 226, 82, 274], [82, 290, 82, 322], [98, 2, 98, 18],
    [98, 66, 98, 98], [98, 130, 98, 146], [98, 162, 98, 194], [98, 210, 98, 226],
    [98, 274, 98, 290], [98, 322, 98, 370], [114, 2, 114, 66], [114, 82, 114, 146],
    [114, 178, 114, 210], [114, 226, 114, 306], [114, 370, 114, 386], [130, 18, 130, 50],
    [130, 82, 130, 130], [130, 146, 130, 178], [130, 194, 130, 226], [130, 306, 130, 370],
    [130, 386, 130, 402], [146, 82, 146, 130], [146, 162, 146, 194], [146, 210, 146, 242],
    [146, 258, 146, 306], [162, 2, 162, 18], [162, 34, 162, 66], [162, 82, 162, 98],
    [162, 114, 162, 146], [162, 162, 162, 210], [162, 242, 162, 258], [162, 274, 162, 290],
    [162, 306, 162, 322], [162, 370, 162, 386], [178, 18, 178, 34], [178, 50, 178, 82],
    [178, 98, 178, 114], [178, 146, 178, 194], [178, 258, 178, 274], [178, 322, 178, 354],
    [178, 386, 178, 402], [194, 2, 194, 50], [194, 66, 194, 178], [194, 194, 194, 210],
    [194, 226, 194, 274], [194, 338, 194, 402], [210, 34, 210, 50], [210, 82, 210, 98],
    [210, 114, 210, 130], [210, 146, 210, 194], [210, 210, 210, 226], [210, 274, 210, 290],
    [210, 322, 210, 338], [210, 370, 210, 402], [226, 18, 226, 34], [226, 66, 226, 82],
    [226, 146, 226, 178], [226, 210, 226, 242], [226, 290, 226, 338], [226, 354, 226, 370],
    [242, 2, 242, 18], [242, 34, 242, 66], [242, 98, 242, 114], [242, 130, 242, 146],
    [242, 162, 242, 242], [242, 274, 242, 306], [242, 338, 242, 354], [242, 370, 242, 386],
    [258, 18, 258, 34], [258, 50, 258, 130], [258, 146, 258, 178], [258, 210, 258, 226],
    [258, 258, 258, 274], [258, 290, 258, 354], [274, 34, 274, 114], [274, 130, 274, 146],
    [274, 162, 274, 210], [274, 226, 274, 290], [274, 306, 274, 322], [274, 354, 274, 370],
    [290, 2, 290, 82], [290, 114, 290, 130], [290, 146, 290, 162], [290, 194, 290, 226],
    [290, 274, 290, 306], [290, 322, 290, 354], [290, 386, 290, 402], [306, 82, 306, 114],
    [306, 130, 306, 146], [306, 178, 306, 194], [306, 210, 306, 274], [306, 306, 306, 322],
    [306, 338, 306, 386], [322, 34, 322, 114], [322, 146, 322, 162], [322, 194, 322, 242],
    [322, 274, 322, 322], [322, 354, 322, 402], [338, 18, 338, 66], [338, 146, 338, 226],
    [338, 338, 338, 354], [338, 370, 338, 386], [354, 2, 354, 18], [354, 98, 354, 130],
    [354, 146, 354, 178], [354, 226, 354, 370], [354, 386, 354, 402], [370, 2, 370, 50],
    [370, 66, 370, 82], [370, 130, 370, 146], [370, 178, 370, 194], [370, 210, 370, 226],
    [370, 242, 370, 258], [370, 290, 370, 306], [370, 338, 370, 354], [386, 18, 386, 66],
    [386, 98, 386, 130], [386, 178, 386, 210], [386, 226, 386, 242], [386, 258, 386, 274],
    [386, 306, 386, 338], [402, 2, 402, 402]
];


// Function to draw the maze lines on the canvas
function drawMazeLines(scale) {
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2 * scale;
    ctx.lineCap = "square";

    ctx.beginPath();
    mazeLines.forEach(([x1, y1, x2, y2]) => {
        ctx.moveTo(x1 * scale, y1 * scale);
        ctx.lineTo(x2 * scale, y2 * scale);
    });
    ctx.stroke();
}

// --- PLAYER SETUP ---
let ratX = 202; // Start position X (middle of top entrance)
let ratY = 10;  // Start position Y (safely above first wall)
let speed = 1.5;
let ratRadius = 4;
let keys = {};
let startTime = Date.now();
let gameActive = true;
let mazeReady = false;

const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, rect.height));
    const nextWidth = size || canvas.width;
    const nextHeight = size || canvas.height;

    canvas.width = nextWidth;
    canvas.height = nextHeight;

    const scale = canvas.width / BASE_CANVAS_SIZE;
    speed = 1.5 * scale;
    ratRadius = 5 * scale;

    ratX = (202 / BASE_CANVAS_SIZE) * canvas.width;
    ratY = (10 / BASE_CANVAS_SIZE) * canvas.height;

    // Clear and redraw maze
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMazeLines(scale);

    mazeReady = true;
};

// Initial setup
resizeCanvas();

window.addEventListener('resize', () => {
    resizeCanvas();
});

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function getPixelType(x, y) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return "wall";
    const p = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    // Red finish line
    if (p[0] > 200 && p[1] < 50 && p[2] < 50) return "finish";
    // Black wall
    if (p[0] < 60 && p[1] < 60 && p[2] < 60 && p[3] > 0) return "wall";
    return "road";
}

function checkCollision(nx, ny) {
    // Check collision at a slightly smaller radius to allow tighter navigation
    const checkRadius = ratRadius * 0.8;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const cx = nx + Math.cos(angle) * checkRadius;
        const cy = ny + Math.sin(angle) * checkRadius;
        const type = getPixelType(cx, cy);
        if (type === "wall") return true;
        if (type === "finish") { win(); return false; }
    }
    return false;
}

function win() {
    if (!gameActive) return;
    gameActive = false;
    setTimeout(() => {
        alert("ZMAGA! Čas: " + ((Date.now() - startTime) / 1000).toFixed(1) + "s");
        restartGame();
    }, 100);
}

function restartGame() {
    // Reset all variables for a new game
    ratX = (202 / BASE_CANVAS_SIZE) * canvas.width;
    ratY = (10 / BASE_CANVAS_SIZE) * canvas.height;
    startTime = Date.now();
    gameActive = true;
    mazeReady = false;

    // Reset canvas and redraw maze
    resizeCanvas();
    update();
}

function update() {
    if (!gameActive) return;

    let dx = 0, dy = 0;
    if (keys['w'] || keys['arrowup']) dy -= speed;
    if (keys['s'] || keys['arrowdown']) dy += speed;
    if (keys['a'] || keys['arrowleft']) dx -= speed;
    if (keys['d'] || keys['arrowright']) dx += speed;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

    const currentlyInWall = checkCollision(ratX, ratY);

    // Movement on X axis
    if (dx !== 0) {
        const nextXInWall = checkCollision(ratX + dx, ratY);
        if (!nextXInWall || (currentlyInWall && !nextXInWall)) {
            ratX += dx;
        }
    }

    // Movement on Y axis
    if (dy !== 0) {
        const nextYInWall = checkCollision(ratX, ratY + dy);
        if (!nextYInWall || (currentlyInWall && !nextYInWall)) {
            ratY += dy;
        }
    }

    // Redraw the scene
    const scale = canvas.width / BASE_CANVAS_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMazeLines(scale);

    // Draw player as black circle
    ctx.beginPath();
    ctx.arc(ratX, ratY, ratRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    if (timeDisplay) {
        timeDisplay.innerText = ((Date.now() - startTime) / 1000).toFixed(1);
    }
    requestAnimationFrame(update);
}

// Start the game loop
update();
