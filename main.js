async function selectAnswers() {
  const chosedAnswers = []
  const response = await fetch('./answers.json')
  const data = await response.json()
  
  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random()*data.length)
    chosedAnswers.push(data[randomIndex])
    data.splice(randomIndex, 1)
  }
  return chosedAnswers
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function changeOptionColor(e) {
  e.target.style.backgroundColor = '#1E293B'
}

async function generateInitialBoard() {
  const answers = await selectAnswers()
  let board = []
  answers.forEach((answer) => {
    answer["words"].forEach((word) => {
      board.push(word)
    })
  })

  shuffleArray(board)
  generateBoard(board)

  return answers
}

function generateBoard(wordsList) {
  wordsList.forEach((word, index) => {
    const option = document.createElement("div")
    const optionText = document.createTextNode(word)
    option.appendChild(optionText)
    option.setAttribute("class", "options")
    option.addEventListener("click", toggleClick)
    option.addEventListener("animationend", changeOptionColor)
    option.style.order = (index+1).toString()
    optionsGrid.appendChild(option)
  })
}

generateInitialBoard()

const optionsGrid = document.querySelector("#optionsGrid")
const answersGrid = document.querySelector("#answersGrid")

const options = optionsGrid.children

let selectedOptions = []
function toggleClick(e) {
  let indexOption = selectedOptions.indexOf(e.target)
  if (indexOption != -1) {
    selectedOptions.splice(indexOption, 1)
    e.target.style.backgroundColor = '#1E293B'
  }
  else if (selectedOptions.length < 4) {
    selectedOptions.push(e.target)
    e.target.style.backgroundColor = '#009AFE'

    if (e.target.classList.contains("error-animation")) e.target.classList.remove("error-animation")
  }

  if (selectedOptions.length == 4) rewardAnswer()
}

let numberOfGuesses = 0
const numberOfGuessesText = document.querySelector("#numberOfGuesses")
function submitGuess(options) {
  numberOfGuesses++
  numberOfGuessesText.innerText = `Tentativas: ${numberOfGuesses}`

  let guess = []
  options.forEach((option) => {
    guess.push(option.childNodes[0].data)
  })
  return guess.sort()
}

function compareArrays(array1, array2) {
  const isLengthEqual = array1.length === array2.length
  if (!isLengthEqual) return false;

  let isEqual = true;
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) { 
        return false;
    }
  }
  return isEqual;
}

let answerGuessed
function verifyAnswer(guess, answers) {
  let isRight = false
  answers.forEach((answer) => {
    if (compareArrays(guess, answer["words"].sort())) {
      isRight = true
      answerGuessed = answer
    } 
  })
  return isRight
}

let submitedAnswers = 0
async function rewardAnswer() {
  const guess = submitGuess(selectedOptions)

  const response = await fetch('./answers.json')
  const answers = await response.json()

  if (verifyAnswer(guess, answers)) { 
    selectedOptions.forEach((option, index) => {
      option.style.transition = `order ${1.2 - index * 0.3}s`
      if (index == 3) {
        option.addEventListener("transitionend", correctAnswer)
      }
      option.style.order = "0"
    })
  } else {
    selectedOptions.forEach((option) => {
      option.classList.toggle("error-animation")
    })
    selectedOptions = []
  }

  console.log(submitedAnswers)
  if (submitedAnswers == 3) endGame()
}

function correctAnswer() {
  selectedOptions.forEach((option) => {
    option.remove()
  })
  selectedOptions = []
  submitedAnswers++

  let newHeigth = 100 - 25 * submitedAnswers
  optionsGrid.style.height = newHeigth.toString() + "%"
  optionsGrid.style.gridTemplateRows = `repeat(${4-submitedAnswers}, 1fr)`

  const answerDiv = document.createElement("div")

  const themeParagraph = document.createElement("p")
  themeParagraph.setAttribute("id", "themeParagraph")

  const wordsParagraph = document.createElement("p")
  wordsParagraph.setAttribute("id", "wordsParagraph")

  const answerThemeText = document.createTextNode(answerGuessed["theme"])
  const answerWordsText = document.createTextNode(answerGuessed["words"].join(", "))

  themeParagraph.appendChild(answerThemeText)
  wordsParagraph.appendChild(answerWordsText)

  answerDiv.appendChild(themeParagraph)
  answerDiv.appendChild(wordsParagraph)

  answerDiv.setAttribute("class", "answers")

  const answerColors = ["#C2410C", "#6D28D9", "#0E7490", "#047857"]
  answerDiv.style.backgroundColor = answerColors[submitedAnswers-1]

  answersGrid.appendChild(answerDiv)
  answersGrid.style.height = (100 - newHeigth).toString() + "%"
}

const main = document.querySelector("main")
function endGame() {
  generateConfetti()
  const playAgainButton = document.createElement("button")
  playAgainButton.setAttribute("type", "button")
  playAgainButton.setAttribute("id", "playAgain")
  playAgainButton.innerText = "Jogar novamente"
  playAgainButton.addEventListener("click", reloadPage)

  main.appendChild(playAgainButton)
}

function reloadPage() {
  location.reload()
}

// Internet code for generating confetti
function generateConfetti() {
  (() => {
  "use strict";

  // Utility functions grouped into a single object
  const Utils = {
    // Parse pixel values to numeric values
    parsePx: (value) => parseFloat(value.replace(/px/, "")),

    // Generate a random number between two values, optionally with a fixed precision
    getRandomInRange: (min, max, precision = 0) => {
      const multiplier = Math.pow(10, precision);
      const randomValue = Math.random() * (max - min) + min;
      return Math.floor(randomValue * multiplier) / multiplier;
    },

    // Pick a random item from an array
    getRandomItem: (array) => array[Math.floor(Math.random() * array.length)],

    // Scaling factor based on screen width
    getScaleFactor: () => Math.log(window.innerWidth) / Math.log(1920),

    // Debounce function to limit event firing frequency
    debounce: (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    },
  };

  // Precomputed constants
  const DEG_TO_RAD = Math.PI / 180;

  // Centralized configuration for default values
  const defaultConfettiConfig = {
    confettiesNumber: 250,
    confettiRadius: 6,
    confettiColors: [
      "#fcf403", "#62fc03", "#f4fc03", "#03e7fc", "#03fca5", "#a503fc", "#fc03ad", "#fc03c2"
    ],
    emojies: [],
    svgIcon: null, // Example SVG link
  };

  // Confetti class representing individual confetti pieces
  class Confetti {
    constructor({ initialPosition, direction, radius, colors, emojis, svgIcon }) {
      const speedFactor = Utils.getRandomInRange(0.9, 1.7, 3) * Utils.getScaleFactor();
      this.speed = { x: speedFactor, y: speedFactor };
      this.finalSpeedX = Utils.getRandomInRange(0.2, 0.6, 3);
      this.rotationSpeed = emojis.length || svgIcon ? 0.01 : Utils.getRandomInRange(0.03, 0.07, 3) * Utils.getScaleFactor();
      this.dragCoefficient = Utils.getRandomInRange(0.0005, 0.0009, 6);
      this.radius = { x: radius, y: radius };
      this.initialRadius = radius;
      this.rotationAngle = direction === "left" ? Utils.getRandomInRange(0, 0.2, 3) : Utils.getRandomInRange(-0.2, 0, 3);
      this.emojiRotationAngle = Utils.getRandomInRange(0, 2 * Math.PI);
      this.radiusYDirection = "down";

      const angle = direction === "left" ? Utils.getRandomInRange(82, 15) * DEG_TO_RAD : Utils.getRandomInRange(-15, -82) * DEG_TO_RAD;
      this.absCos = Math.abs(Math.cos(angle));
      this.absSin = Math.abs(Math.sin(angle));

      const offset = Utils.getRandomInRange(-150, 0);
      const position = {
        x: initialPosition.x + (direction === "left" ? -offset : offset) * this.absCos,
        y: initialPosition.y - offset * this.absSin
      };

      this.position = { ...position };
      this.initialPosition = { ...position };
      this.color = emojis.length || svgIcon ? null : Utils.getRandomItem(colors);
      this.emoji = emojis.length ? Utils.getRandomItem(emojis) : null;
      this.svgIcon = null;

      // Preload SVG if provided
      if (svgIcon) {
        this.svgImage = new Image();
        this.svgImage.src = svgIcon;
        this.svgImage.onload = () => {
          this.svgIcon = this.svgImage; // Mark as ready once loaded
        };
      }

      this.createdAt = Date.now();
      this.direction = direction;
    }

    draw(context) {
      const { x, y } = this.position;
      const { x: radiusX, y: radiusY } = this.radius;
      const scale = window.devicePixelRatio;

      if (this.svgIcon) {
        context.save();
        context.translate(scale * x, scale * y);
        context.rotate(this.emojiRotationAngle);
        context.drawImage(this.svgIcon, -radiusX, -radiusY, radiusX * 2, radiusY * 2);
        context.restore();
      } else if (this.color) {
        context.fillStyle = this.color;
        context.beginPath();
        context.ellipse(x * scale, y * scale, radiusX * scale, radiusY * scale, this.rotationAngle, 0, 2 * Math.PI);
        context.fill();
      } else if (this.emoji) {
        context.font = `${radiusX * scale}px serif`;
        context.save();
        context.translate(scale * x, scale * y);
        context.rotate(this.emojiRotationAngle);
        context.textAlign = "center";
        context.fillText(this.emoji, 0, radiusY / 2); // Adjust vertical alignment
        context.restore();
      }
    }

    updatePosition(deltaTime, currentTime) {
      const elapsed = currentTime - this.createdAt;

      if (this.speed.x > this.finalSpeedX) {
        this.speed.x -= this.dragCoefficient * deltaTime;
      }

      this.position.x += this.speed.x * (this.direction === "left" ? -this.absCos : this.absCos) * deltaTime;
      this.position.y = this.initialPosition.y - this.speed.y * this.absSin * elapsed + 0.00125 * Math.pow(elapsed, 2) / 2;

      if (!this.emoji && !this.svgIcon) {
        this.rotationSpeed -= 1e-5 * deltaTime;
        this.rotationSpeed = Math.max(this.rotationSpeed, 0);

        if (this.radiusYDirection === "down") {
          this.radius.y -= deltaTime * this.rotationSpeed;
          if (this.radius.y <= 0) {
            this.radius.y = 0;
            this.radiusYDirection = "up";
          }
        } else {
          this.radius.y += deltaTime * this.rotationSpeed;
          if (this.radius.y >= this.initialRadius) {
            this.radius.y = this.initialRadius;
            this.radiusYDirection = "down";
          }
        }
      }
    }

    isVisible(canvasHeight) {
      return this.position.y < canvasHeight + 100;
    }
  }

  class ConfettiManager {
    constructor() {
      this.canvas = document.createElement("canvas");
      this.canvas.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; pointer-events: none;";
      document.body.appendChild(this.canvas);
      this.context = this.canvas.getContext("2d");
      this.confetti = [];
      this.lastUpdated = Date.now();
      window.addEventListener("resize", Utils.debounce(() => this.resizeCanvas(), 200));
      this.resizeCanvas();
      requestAnimationFrame(() => this.loop());
    }

    resizeCanvas() {
      this.canvas.width = window.innerWidth * window.devicePixelRatio;
      this.canvas.height = window.innerHeight * window.devicePixelRatio;
    }

    addConfetti(config = {}) {
      const { confettiesNumber, confettiRadius, confettiColors, emojies, svgIcon } = {
        ...defaultConfettiConfig,
        ...config,
      };

      const baseY = (5 * window.innerHeight) / 7;
      for (let i = 0; i < confettiesNumber / 2; i++) {
        this.confetti.push(new Confetti({
          initialPosition: { x: 0, y: baseY },
          direction: "right",
          radius: confettiRadius,
          colors: confettiColors,
          emojis: emojies,
          svgIcon,
        }));
        this.confetti.push(new Confetti({
          initialPosition: { x: window.innerWidth, y: baseY },
          direction: "left",
          radius: confettiRadius,
          colors: confettiColors,
          emojis: emojies,
          svgIcon,
        }));
      }
    }

    resetAndStart(config = {}) {
      // Clear existing confetti
      this.confetti = [];
      // Add new confetti
      this.addConfetti(config);
    }

    loop() {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.lastUpdated;
      this.lastUpdated = currentTime;

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.confetti = this.confetti.filter((item) => {
        item.updatePosition(deltaTime, currentTime);
        item.draw(this.context);
        return item.isVisible(this.canvas.height);
      });

      requestAnimationFrame(() => this.loop());
    }
  }

  const manager = new ConfettiManager();
  manager.addConfetti();

  const triggerButton = document.getElementById("show-again");
  if (triggerButton) {
    triggerButton.addEventListener("click", () => manager.addConfetti());
  }

  const resetInput = document.getElementById("reset");
  if (resetInput) {
    resetInput.addEventListener("input", () => manager.resetAndStart());
  }
})();
}