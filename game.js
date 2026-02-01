const ANSWER = "CANOE";
let currentRow = 0;

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");

for (let i = 0; i < 6; i++) {
  const row = document.createElement("div");
  row.className = "row";
  for (let j = 0; j < 5; j++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    row.appendChild(tile);
  }
  board.appendChild(row);
}

function submitGuess() {
  const input = document.getElementById("guessInput");
  const guess = input.value.toUpperCase();

  if (guess.length !== 5) return;

  const row = board.children[currentRow];
  const answerArr = ANSWER.split("");

  // First pass: correct letters
  for (let i = 0; i < 5; i++) {
    row.children[i].textContent = guess[i];
    if (guess[i] === ANSWER[i]) {
      row.children[i].classList.add("correct");
      answerArr[i] = null;
      row.children[i].style.animation = "bounce 0.5s";
    }
  }

  // Second pass: present / absent
  for (let i = 0; i < 5; i++) {
    if (row.children[i].classList.contains("correct")) continue;
    if (answerArr.includes(guess[i])) {
      row.children[i].classList.add("present");
      answerArr[answerArr.indexOf(guess[i])] = null;
      row.children[i].style.animation = "bounce 0.5s";
    } else {
      row.children[i].classList.add("absent");
    }
  }

  input.value = "";
  currentRow++;
}

function createKeyboard() {
  const keys = "QWERTYUIOPASDFGHJKLZXCVBNM";
  keys.split("").forEach(key => {
    const keyDiv = document.createElement("div");
    keyDiv.className = "key";
    keyDiv.textContent = key;
    keyDiv.addEventListener("click", () => handleKeyPress(key));
    keyboard.appendChild(keyDiv);
  });
  const enterKey = document.createElement("div");
  enterKey.className = "key enter";
  enterKey.textContent = "ENTER";
  enterKey.addEventListener("click", submitGuess);
  keyboard.appendChild(enterKey);
  const backspaceKey = document.createElement("div");
  backspaceKey.className = "key backspace";
  backspaceKey.textContent = "BACKSPACE";
  backspaceKey.addEventListener("click", () => {
    const input = document.getElementById("guessInput");
    input.value = input.value.slice(0, -1);
  });
  keyboard.appendChild(backspaceKey);
}

function handleKeyPress(key) {
  const input = document.getElementById("guessInput");
  if (input.value.length < 5) {
    input.value += key;
  }
}

createKeyboard();
