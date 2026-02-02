const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "maze25.svg";

img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

