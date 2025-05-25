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
const timeLeftDisplay = document.getElementById('time-left');
const restartButton = document.getElementById('restart-button');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 420; // 7 minutes in seconds
let timerInterval;
let totalQuestions = 40;

function generateTableData() {
    const data = [];
    for (let y = 20; y >= -20; y--) {
        const row = [];
        for (let x = -20; x <= 20; x++) {
            row.push(x - y + 90); // Data to match table found at https://access.afpc.af.mil/pcsmdmz/Form%20T.HTML
        }
        data.push(row);
    }
    return data;
}

function renderTable(data) {
    dataTable.innerHTML = ''; // Clear previous table
    for (let y = 0; y <= 40; y++) {
        const row = dataTable.insertRow();
        if (y == 0) {
            const yAxisHeader = document.createElement('th');
            yAxisHeader.rowSpan = 41;
            yAxisHeader.textContent = 'Y Axis';
            row.appendChild(yAxisHeader);
        }
        const headerCell = document.createElement('th');
        headerCell.textContent = 20 - y; // y-axis
        row.appendChild(headerCell);
        for (let x = 0; x <= 40; x++) {
            const cell = row.insertCell();
            cell.textContent = data[y][x];
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

        // Have several answers be close to the correct answer
        if (correctAnswer != 130) {
            options.push(correctAnswer + 1);
        }
        if (correctAnswer != 50) {
            options.push(correctAnswer - 1);
        }

        while (options.length < 5) { // Fill remaining options
            const randomValue = Math.floor(Math.random() * 130);
            if (!options.includes(randomValue)) {
                options.push(randomValue);
            }
        }
        options.sort(() => Math.random() - 0.5); // Shuffle options

        generatedQuestions.push({
            question: `${i + 1}. What is the value at coordinate (x:${x}, y:${-y})?`,
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

function timeAsString() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateTimer() {
    timerDisplay.textContent = timeAsString();
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
    timeLeftDisplay.textContent = `You finished with ${timeAsString()} remaining`
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