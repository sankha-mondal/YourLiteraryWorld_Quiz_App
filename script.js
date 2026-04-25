let questions = [
    { question: "Capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], answer: 1 },
    { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: 1 },
    { question: "Largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2 },
    { question: "Capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], answer: 1 },
    { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: 1 },
    { question: "Largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2 },
    { question: "Capital of India?", options: ["Mumbai", "Delhi", "Kolkata", "Chennai"], answer: 1 },
    { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: 1 },
    { question: "Largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: 2 }
];

let currentQuestion = 0;
let userAnswers = Array(questions.length).fill(null);
let marked = Array(questions.length).fill(false);
let timeLeft = 360;
let timerInterval;
let chart;

/* START */
function startQuiz() {
    timeLeft = 360;
    document.getElementById("timer").innerText = "6:00";

    document.getElementById("home").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");

    loadQuestion();
    startTimer();
}

/* LOAD */
function loadQuestion() {
    let q = questions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        `Q ${currentQuestion + 1}/${questions.length}`;

    let container = document.getElementById("questionContainer");
    container.innerHTML = `<h3>${q.question}</h3>`;

    q.options.forEach((opt, i) => {
        let div = document.createElement("div");
        div.className = "option";
        if (userAnswers[currentQuestion] === i) div.classList.add("selected");

        div.innerText = opt;
        div.onclick = () => selectOption(i);

        container.appendChild(div);
    });

    updateRevisitButton();
}

/* SELECT */
function selectOption(i) {
    userAnswers[currentQuestion] = i;
    loadQuestion();
}

/* NAV */
function nextQuestion() {
    if (currentQuestion < questions.length - 1) currentQuestion++;
    loadQuestion();
}

function prevQuestion() {
    if (currentQuestion > 0) currentQuestion--;
    loadQuestion();
}

/* REVISIT */
function markRevisit() {
    marked[currentQuestion] = !marked[currentQuestion];
    updateRevisitButton();
}

function updateRevisitButton() {
    let btn = document.getElementById("markBtn");
    if (marked[currentQuestion]) btn.classList.add("active-revisit");
    else btn.classList.remove("active-revisit");
}

/* PREVIEW */
function showPreview() {
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("previewPage").classList.remove("hidden");

    let overview = document.getElementById("overview");
    overview.innerHTML = "";

    userAnswers.forEach((ans, i) => {
        let div = document.createElement("div");

        if (marked[i]) div.className = "status-box blue";
        else if (ans !== null) div.className = "status-box green";
        else div.className = "status-box grey";

        div.innerText = i + 1;
        div.onclick = () => {
            currentQuestion = i;
            backToQuestions();
        };

        overview.appendChild(div);
    });

    document.getElementById("revisitCount").innerText =
        "Revisit: " + marked.filter(x => x).length;
}

/* TIMER */
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            submitQuiz();
            return;
        }

        timeLeft--;

        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;

        document.getElementById("timer").innerText =
            `${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);
}

/* SUBMIT */
function submitQuiz() {
    if (!confirm("Submit quiz?")) return;

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

    document.getElementById("scoreText").innerText =
        `Score: ${correct}/${questions.length}`;

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("resultChart"), {
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

/* BACK */
function backToQuestions() {
    document.getElementById("previewPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");
}

/* ANSWER KEY */
function showAnswerKey() {
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("answerKeyPage").classList.remove("hidden");

    let container = document.getElementById("answerKey");
    container.innerHTML = "";

    questions.forEach((q, i) => {
        container.innerHTML += `<p>Q${i + 1}: ${q.options[q.answer]}</p>`;
    });
}