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

function submitGuess(options) {
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
      if (index == 3) option.addEventListener("transitionend", correctAnswer)
      option.style.order = "0"
    })
  } else {
    selectedOptions.forEach((option) => {
      option.classList.toggle("error-animation")
    })
    selectedOptions = []
  }
}

function correctAnswer() {
    selectedOptions.forEach((option) => {
      option.remove()
    })
    selectedOptions = []
    submitedAnswers++

    let newHeigth = 100 - 25 * submitedAnswers
    optionsGrid.style.height = newHeigth.toString() + "%"

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

    answersGrid.appendChild(answerDiv)
    answersGrid.style.height = (100 - newHeigth).toString() + "%"
}