let expression = ''
let justCalculated = false
let history = localStorage.getItem('calcHistory') ?
  JSON.parse(localStorage.getItem('calcHistory')) : []

const expressionDisplay = document.getElementById('expression')
const resultDisplay = document.getElementById('result')

renderHistory()

function append(value) {
  const isOperator = ['+', '-', '*', '/'].includes(value)

  if (justCalculated) {
    // if operator, continue from result — if number, start fresh
    if (!isOperator) expression = ''
    justCalculated = false
  }

  expression += value
  expressionDisplay.textContent = expression
}

function clearCalc() {
  expression = ''
  expressionDisplay.textContent = ''
  resultDisplay.textContent = '0'
}

function backspace() {
  expression = expression.slice(0, -1)
  expressionDisplay.textContent = expression
}

function percent() {
  if (expression === '') return
  expression = String(parseFloat(expression) / 100)
  expressionDisplay.textContent = expression
  resultDisplay.textContent = expression
}

function calculate() {
  if (expression === '') return
  try {
    const answer = eval(expression)
    resultDisplay.textContent = answer
    expressionDisplay.textContent = expression + ' ='
    history.unshift(`${expression} = ${answer}`)
    localStorage.setItem('calcHistory', JSON.stringify(history))
    renderHistory()
    expression = String(answer)
    justCalculated = true
  } catch {
    resultDisplay.textContent = 'Error'
    expression = ''
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') append(e.key)
  else if (e.key === '+') append('+')
  else if (e.key === '-') append('-')
  else if (e.key === '*') append('*')
  else if (e.key === '/') { e.preventDefault(); append('/') }
  else if (e.key === '.') append('.')
  else if (e.key === '%' || e.key === 'p' || e.key === 'P') percent()
  else if (e.key === 'Enter') { e.preventDefault(); calculate() }
  else if (e.key === 'Backspace') backspace()
  else if (e.key === 'Delete' || e.key === 'c' || e.key === 'C') clearCalc()
})

function renderHistory() {
  const list = document.getElementById('history-list')
  list.innerHTML = ''
  if (history.length === 0) {
    list.innerHTML = '<li id="empty-history">No calculations yet</li>'
    return
  }
  history.forEach(item => {
    const li = document.createElement('li')
    li.textContent = item
    list.appendChild(li)
  })
}

function clearHistory() {
  history = []
  localStorage.removeItem('calcHistory')
  renderHistory()
}
