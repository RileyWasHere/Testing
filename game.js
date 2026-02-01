import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = "canoe";
let previousGuesses = [];

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()
document.addEventListener("keydown", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    
    // Only allow letter keys, Backspace, and Enter
    const isLetter = pressedKey.length === 1 && pressedKey.match(/[a-z]/i)
    const isBackspace = pressedKey === "Backspace"
    const isEnter = pressedKey === "Enter"
    
    if (!isLetter && !isBackspace && !isEnter) {
        return
    }
    
    e.preventDefault()
    
    if (isBackspace && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (isEnter) {
        checkGuess()
        return
    }

    if (isLetter) {
        insertLetter(pressedKey)
    }
})

function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()
    
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    if (previousGuesses.includes(guessString)) {
        toastr.error("Already guessed this word!")
        return
    }

    // Add to previous guesses
    previousGuesses.push(guessString);

    let letterColors = []
    let letters = []
    let animationPromises = []

    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = '#787c7e'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = '#6aaa64'
            } else {
                // shade box yellow
                letterColor = '#c9b458'
            }

            rightGuess[letterPosition] = "#"
        }

        letterColors.push(letterColor)
        letters.push(letter)

        let delay = 350 * i
        setTimeout(()=> {
            //shade box immediately as flip starts
            box.style.backgroundColor = letterColor
            box.style.color = 'white'
            box.style.borderColor = 'transparent'
            //flip box
            animateCSS(box, 'flipInX')
        }, delay)
    }

    // Update all keyboard keys at exact moment last animation completes
    // Last tile starts at 350*4=1400ms, animation is 1200ms, so total is 2600ms
    setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            shadeKeyBoard(letters[i], letterColors[i])
        }
    }, 2600)

    if (guessString === rightGuessString.toLowerCase()) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            // Keep green if already green (correct position has priority)
            if (oldColor === 'rgb(106, 170, 100)') {  // #6aaa64 in rgb
                return
            } 

            // Keep yellow if trying to set grey (wrong position has priority over absent)
            if (oldColor === 'rgb(201, 180, 88)' && color === '#787c7e') {  // #c9b458 in rgb, #787c7e grey
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keydown", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '1.2s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});