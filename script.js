let questions = [
    { question: "Capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], answer: 1 },
    { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: 1 },
    { question: "Largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2 },
    { question: "HTML stands for?", options: ["Hyper Text Markup Language", "HighText", "Home Tool", "None"], answer: 0 },
    { question: "CSS is used for?", options: ["Styling", "Database", "Logic", "None"], answer: 0 },
    { question: "JS is?", options: ["Programming Language", "Database", "Server", "None"], answer: 0 },
    { question: "Sun rises from?", options: ["West", "North", "East", "South"], answer: 2 },
    { question: "5 x 5?", options: ["10", "20", "25", "30"], answer: 2 },
    { question: "Water formula?", options: ["CO2", "H2O", "O2", "H2"], answer: 1 },
    { question: "Fastest animal?", options: ["Tiger", "Cheetah", "Lion", "Dog"], answer: 1 }
];

let currentQuestion = 0;
let userAnswers = Array(questions.length).fill(null);
let marked = Array(questions.length).fill(false);
let timeLeft = 6 * 60;
let timerInterval;
let resultChartInstance = null;

/* START QUIZ */
function startQuiz() {
    timeLeft = 6 * 60;

    document.getElementById("home").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");

    loadQuestion();
    startTimer();
}

/* LOAD QUESTION */
function loadQuestion() {
    let q = questions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        `Question ${currentQuestion + 1}/${questions.length}`;

    let container = document.getElementById("questionContainer");
    container.innerHTML = `<h3>${q.question}</h3>`;

    q.options.forEach((opt, index) => {
        let div = document.createElement("div");
        div.classList.add("option");

        if (userAnswers[currentQuestion] === index) {
            div.classList.add("selected");
        }

        div.innerText = opt;
        div.onclick = () => selectOption(index);

        container.appendChild(div);
    });

    updateNavigationButtons();
}

/* SELECT OPTION */
function selectOption(index) {
    userAnswers[currentQuestion] = index;
    loadQuestion();
}

/* NAVIGATION */
function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

/* MARK REVISIT */
function markRevisit() {
    marked[currentQuestion] = !marked[currentQuestion]; // toggle
}

/* PREVIEW */
function showPreview() {
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("previewPage").classList.remove("hidden");

    let overview = document.getElementById("overview");
    overview.innerHTML = "";

    userAnswers.forEach((ans, i) => {
        let div = document.createElement("div");

        if (marked[i]) {
            div.className = "status-box blue";
        } else if (ans !== null) {
            div.className = "status-box green";
        } else {
            div.className = "status-box grey";
        }

        div.innerText = i + 1;

        /* CLICK TO JUMP */
        div.onclick = () => {
            currentQuestion = i;
            backToQuestions();
        };

        overview.appendChild(div);
    });

    /* REVISIT COUNT */
    let count = marked.filter(m => m).length;
    document.getElementById("revisitCount").innerText =
        `Marked for Revisit: ${count}`;
}

/* TIMER */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;

            let min = Math.floor(timeLeft / 60);
            let sec = timeLeft % 60;

            document.getElementById("timer").innerText =
                `${min}:${sec < 10 ? '0' : ''}${sec}`;
        } else {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

/* SUBMIT */
function submitQuiz() {
    clearInterval(timerInterval);

    document.getElementById("previewPage").classList.add("hidden");
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.remove("hidden");

    let correct = 0, wrong = 0, unattempted = 0;

    userAnswers.forEach((ans, i) => {
        if (ans === null) unattempted++;
        else if (ans === questions[i].answer) correct++;
        else wrong++;
    });

    /* SCORE TEXT */
    document.getElementById("resultPage").innerHTML +=
        `<h3 style="text-align:center">Score: ${correct}/${questions.length}</h3>`;

    /* FIX CHART DUPLICATION */
    if (resultChartInstance) {
        resultChartInstance.destroy();
    }

    resultChartInstance = new Chart(document.getElementById("resultChart"), {
        type: 'pie',
        data: {
            labels: ["Correct", "Wrong", "Unattempted"],
            datasets: [{
                data: [correct, wrong, unattempted],
                backgroundColor: ["green", "red", "gray"]
            }]
        }
    });
}

/* ANSWER KEY */
function showAnswerKey() {
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("answerKeyPage").classList.remove("hidden");

    let container = document.getElementById("answerKey");
    container.innerHTML = "";

    questions.forEach((q, i) => {
        let div = document.createElement("div");
        div.innerHTML = `<h4>Q${i + 1}: ${q.question}</h4>
                         <p class="correct-answer">Correct: ${q.options[q.answer]}</p>`;
        container.appendChild(div);
    });
}

/* NAV BUTTON CONTROL */
function updateNavigationButtons() {
    const prev = document.querySelector('.buttons button:nth-child(1)');
    const next = document.querySelector('.buttons button:nth-child(3)');

    prev.disabled = currentQuestion === 0;
    next.disabled = currentQuestion === questions.length - 1;
}

/* BACK */
function backToQuestions() {
    document.getElementById("previewPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");
}