const optionsGrid = document.querySelector("#optionsGrid")
const answersGrid = document.querySelector("#answersGrid")

  const answers = [
    {"theme": "pronomes demonstrativos", "words": ["aquela", "este", "isso", "aquilo"]},
    {"theme": "conjunções adversativas", "words": ["mas", "porém", "todavia", "no entanto"]},
    {"theme": "advérbio de tempo", "words": ["hoje", "atualmente", "depois", "agora"]},
    {"theme": "verbos dicendi", "words": ["digo","falar","explicitou","afirmamos"]}
  ]

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateBoard() {
  let board = []
  answers.forEach((answer) => {
    answer["words"].forEach((word) => {
      board.push(word)
    })
  })

  shuffleArray(board)
  board.forEach((word) => {
    const option = document.createElement("div")
    const optionText = document.createTextNode(word)
    option.appendChild(optionText)
    option.setAttribute("class", "options")
    option.addEventListener("click", toggleClick)
    optionsGrid.appendChild(option)
  })
}

generateBoard()

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
function rewardAnswer() {
  const guess = submitGuess(selectedOptions)

  if (verifyAnswer(guess, answers)) {
    submitedAnswers++
    selectedOptions.forEach((option) => {
      option.remove()
    })
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
  } else {
    selectedOptions.forEach((option) => {
      option.style.backgroundColor = '#1E293B'
    })
  }
  selectedOptions = []
}