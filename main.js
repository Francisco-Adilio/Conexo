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

function verifyAnswer(guess, answers) {
  answers.forEach((answer) => {
    if (guess.every((val, index) => val === answer.words[index])) return true
  })
  return false
}


function rewardAnswer() {
  const guess = submitGuess(selectedOptions)

  if (verifyAnswer(guess, answers)) {
    selectedOptions.forEach((option) => {
      option.remove()
    })
    let newHeigth = 100 - 25 * submitedAnswers
    optionsGrid.style.height = newHeigth.toString() + "%"

    const answerDiv = document.createElement("div")
    const answerText = document.createTextNode("Acertou!")

    answerDiv.appendChild(answerText)
    answerDiv.setAttribute("class", "answers")

    answersGrid.appendChild(answerDiv)
    answersGrid.style.height = (100 - newHeigth).toString() + "%"
  } else {
    selectedOptions.forEach((option) => {
      option.style.backgroundColor = '#1E293B'
    })
    selectedOptions = []
  }
}