window.addEventListener("DOMContentLoaded", function () {
    backgroundMusic.volume = 0.1;
    backgroundMusic.play();
});

const backgroundMusic = new Audio('sounds/ratEncounter.mp3');
const cheeseEatSound = new Audio('sounds/RatEatCheese.mp3');
const nomnomnom = new Audio('sounds/NomNomNom.mp3');
const meow1 = new Audio('sounds/meow1.mp3'),
    meow2 = new Audio('sounds/meow2.mp3'),
    meow3 = new Audio('sounds/meow3.mp3');

function cheeseEatSfx() {
    cheeseEatSound.volume = 0.3;
    cheeseEatSound.play();
}

function nom() {
    nomnomnom.volume = 0.3
    nomnomnom.play();
}

function meowSfx() {
    meow3.volume = 0.4
    meow3.play();
}

function stopSound() {
    backgroundMusic.volume = 0.0;
}