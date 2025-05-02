const optionsGrid = document.querySelector("#optionsGrid")
const answersGrid = document.querySelector("#answersGrid")

const options = optionsGrid.children

for (let i=0; i<16; i++) {
  options[i].addEventListener("click", toggleClick)
}

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

  if (selectedOptions.length == 4) submitAnswer()
}

let submitedAnswers = 0
function submitAnswer() {
  submitedAnswers++
  selectedOptions.forEach((option) => {
    option.remove()
  })

  let newHeigth = 100 - 25 * submitedAnswers
  optionsGrid.style.height = newHeigth.toString() + "%"
  selectedOptions = []

  const answerDiv = document.createElement("div")
  const answerText = document.createTextNode("Acertou!")
  answerDiv.appendChild(answerText)
  answerDiv.setAttribute("class", "answers")
  console.log(answersGrid)
  answersGrid.appendChild(answerDiv)
  answersGrid.style.height = (100 - newHeigth).toString() + "%"
}