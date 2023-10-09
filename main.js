// Dom Elements
var startButton = document.querySelector(".start-button");
var beforeGameStart = document.querySelector(".before-game-start");
var afterGameStart = document.querySelector(".after-game-start");
var afterGameEnd = document.querySelector(".after-game-ended");
var currentLevelOnScreen = document.querySelector(".current-level");
var finalLevel = document.querySelector(".final-level");
var tryAgain = document.querySelector(".try-again");

var boxes = document.querySelectorAll(".boxes");

// Loading Audios
// var key13Audio = document.querySelector("#key13");

// Global Variables
var randomSequenceArray = [];
var noOfClicks = 0;
var noOfSequence = 0;
var difficultySpeed = 0;
var level = 1;

// Global Flags
var clickEnabled = true;

startButton.addEventListener("click", startGame);
tryAgain.addEventListener("click", playAgain);

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (clickEnabled) {
            noOfClicks++;
            checkClickSequence(box);
        }
    });
});

function startGame() {
    currentLevelOnScreen.innerHTML = level;
    beforeGameStart.classList.add("hidden");
    afterGameStart.classList.remove("hidden");
    noOfSequence++;

    randomSequenceArray.push(randomSequenceGenerator());
    console.log(randomSequenceArray);
    glowSequence();
}

function randomSequenceGenerator() {
    return Math.floor(Math.random() * 9);
}

function glowSequence() {
    var runInSequence = 0;
    var glowAt = 0;
    clickEnabled = false;

    var glowing = setInterval(() => {
        playkeyNotes(glowAt)
        boxes[randomSequenceArray[glowAt]].classList.add("glow");
        setTimeout(() => {
            boxes[randomSequenceArray[glowAt]].classList.remove("glow");
            glowAt++;
        }, 400);

        runInSequence++;
        if (runInSequence === noOfSequence) {
            clearInterval(glowing);
            clickEnabled = true;
        }
    }, 1000 - difficultySpeed);
}

function checkClickSequence(box) {
    console.log(
        "Clicked box:",
        box.getAttribute("value"),
        "random Value: ",
        randomSequenceArray[noOfClicks - 1],
        "at:",
        noOfClicks - 1
    );
    if (
        box.getAttribute("value") ===
        String(randomSequenceArray[noOfClicks - 1])
    ) {
        playkeyNotes(noOfClicks - 1);
        box.classList.add("glow");
        setTimeout(() => {
            box.classList.remove("glow");
        }, 500);

        if (noOfClicks === noOfSequence) {
            console.log("sequence Checked");
            randomSequenceArray = [];
            noOfSequence++;
            noOfClicks = 0;
            addSequenceToArray();
            level++;
            currentLevelOnScreen.innerHTML = level;
            difficultySpeed += 50;
        }
    } else {
        playkeyNotes(6);
        playkeyNotes(7);
        playkeyNotes(8);
        // Resetting values after loosing
        randomSequenceArray = [];
        noOfSequence = 0;
        difficultySpeed = 0;
        noOfClicks = 0;

        document.querySelector("body").classList.add("wrong-answer-blink");

        setTimeout(() => {
            document
                .querySelector("body")
                .classList.remove("wrong-answer-blink");
        }, 100);
        afterGameEnd.classList.remove("hidden");
        afterGameStart.classList.add("hidden");
        finalLevel.innerHTML = `Level ${level}`;
        level = 1;
    }
}

function addSequenceToArray() {
    var i = 0;

    while (i < noOfSequence) {
        randomSequenceArray.push(randomSequenceGenerator());
        i++;
    }
    console.log(randomSequenceArray);
    glowSequence();
}

function playAgain() {
    afterGameStart.classList.remove("hidden");
    afterGameEnd.classList.add("hidden");
    startGame();
}

function playkeyNotes(playIndex) {
    var keyAudio = new Audio(`./sounds/key${playIndex}.mp3`);
    keyAudio.play();
}
