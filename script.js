const startButton = document.getElementById('start-button');
const startSection = document.getElementById('start-section');
const testSection = document.getElementById('test-section');
const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];
const questionText = document.getElementById('question-text');
const optionA = document.getElementById('option-a');
const optionB = document.getElementById('option-b');
const optionC = document.getElementById('option-c');
const optionD = document.getElementById('option-d');
const optionE = document.getElementById('option-e');
const answerInputs = document.querySelectorAll('input[name="answer"]');
const nextButton = document.getElementById('next-button');
const timerDisplay = document.getElementById('time');
const resultsSection = document.getElementById('results-section');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 420; // 7 minutes in seconds
let timerInterval;
let totalQuestions = 40;

function generateTableData() {
    const data = [];
    for (let i = -20; i <= 20; i++) {
        const row = [];
        for (let j = -20; j <= 20; j++) {
            row.push(Math.floor(Math.random() * 100)); // Example random data
        }
        data.push(row);
    }
    return data;
}

function renderTable(data) {
    dataTable.innerHTML = ''; // Clear previous table
    for (let i = 40; i >= 0; i--) {
        const row = dataTable.insertRow();
        if (i == 40) {
            const yAxisHeader = document.createElement('th');
            yAxisHeader.rowSpan = 41;
            yAxisHeader.textContent = 'Y Axis';
            row.appendChild(yAxisHeader);
        }
        const headerCell = document.createElement('th');
        headerCell.textContent = i - 20; // y-axis
        row.appendChild(headerCell);
        for (let j = 0; j <= 40; j++) {
            const cell = row.insertCell();
            cell.textContent = data[i][j];
        }
    }
    // Add x-axis labels
    const headerRow = document.getElementById('x-axis-header');
    headerRow.innerHTML = '';
    const emptyHeaderCells = document.createElement('th');
    emptyHeaderCells.colSpan = 2;
    headerRow.appendChild(emptyHeaderCells);
    headerRow.appendChild(emptyHeaderCells);
    for (let i = -20; i <= 20; i++) {
        const th = document.createElement('th');
        th.textContent = i;
        headerRow.appendChild(th);
    }
}

function generateQuestions(tableData) {
    const generatedQuestions = [];
    for (let i = 0; i < totalQuestions; i++) {
        const x = Math.floor(Math.random() * 40) - 20;
        const y = Math.floor(Math.random() * 40) - 20;
        const correctAnswer = tableData[y + 20][x + 20];
        const options = [correctAnswer];

        while (options.length < 5) {
            const randomValue = Math.floor(Math.random() * 100);
            if (!options.includes(randomValue)) {
                options.push(randomValue);
            }
        }
        options.sort(() => Math.random() - 0.5); // Shuffle options

        generatedQuestions.push({
            question: `${i + 1}. What is the value at coordinate (x:${x}, y:${y})?`,
            options: options,
            correctAnswer: correctAnswer.toString()
        });
    }
    return generatedQuestions;
}

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionA.textContent = currentQuestion.options[0];
        optionB.textContent = currentQuestion.options[1];
        optionC.textContent = currentQuestion.options[2];
        optionD.textContent = currentQuestion.options[3];
        optionE.textContent = currentQuestion.options[4];
        nextButton.disabled = true;
        answerInputs.forEach(input => input.checked = false);
    } else {
        endTest();
    }
}

function checkAnswer() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        nextButton.disabled = false;
        if (selectedAnswer.nextElementSibling.textContent === questions[currentQuestionIndex].correctAnswer) {
            score++;
        }
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
    if (timeLeft <= 0) {
        endTest();
    }
    timeLeft--;
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function endTest() {
    clearInterval(timerInterval);
    testSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    scoreDisplay.textContent = `You scored ${score} out of ${totalQuestions}`;
}

function restartTest() {
    resultsSection.classList.add('hidden');
    startSection.classList.remove('hidden');
    questions = [];
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 420;
    timerDisplay.textContent = '7:00';
}

startButton.addEventListener('click', () => {
    startSection.classList.add('hidden');
    testSection.classList.remove('hidden');
    const tableData = generateTableData();
    renderTable(tableData);
    questions = generateQuestions(tableData);
    loadQuestion();
    startTimer();
});

answerInputs.forEach(input => {
    input.addEventListener('change', checkAnswer);
});

nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartTest);