window.addEventListener("DOMContentLoaded", function () {
});

const backgroundMusic = new Audio('sounds/ratEncounter.mp3');
const cheeseEatSound = new Audio('sounds/RatEatCheese.mp3');
const meow1 = new Audio('sounds/meow1.mp3'),
    meow2 = new Audio('sounds/meow2.mp3'),
    meow3 = new Audio('sounds/meow3.mp3');
const piano = new Audio('sounds/pianoMan.mp3');

function cheeseEatSfx() {
    cheeseEatSound.volume = 0.3;
    cheeseEatSound.play();
}

function meowSfx() {
    meow3.volume = 0.4
    meow3.play();
}

function stopSound() {
    backgroundMusic.volume = 0.0;
}

function pianoMan() {
    piano.volume = 0.1;
    piano.play();
}