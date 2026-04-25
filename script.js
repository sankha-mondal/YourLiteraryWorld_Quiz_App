let questions = [
    {
        question: "Capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        answer: 1, explanation: "Delhi is the capital of India."
    },
    {
        question: "2 + 2 = ?",
        options: ["3", "4", "5", "6"],
        answer: 1,
        explanation: "2 + 2 equals 4."
    },
    {
        question: "Largest planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 2, explanation: "Jupiter is the largest planet in our solar system."
    },
    {
        question: "Capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        answer: 1,
        explanation: "Delhi is the capital of India."
    },
    {
        question: "2 + 2 = ?",
        options: ["3", "4", "5", "6"],
        answer: 1,
        explanation: "2 + 2 equals 4."
    },
    {
        question: "Largest planet?",
        options: ["Earth", "Mars", "Jupiter", "Jupiter"],
        answer: 2,
        explanation: "Jupiter is the largest planet in our solar system."
    },
    {
        question: "Capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        answer: 1,
        explanation: "Delhi is the capital of India."
    },
    {
        question: "2 + 2 = ?",
        options: ["3", "4", "5", "6"],
        answer: 1,
        explanation: "2 + 2 equals 4."
    },
    {
        question: "Largest planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: 2,
        explanation: "Jupiter is the largest planet in our solar system."
    },
    {
        question: "Capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        answer: 1,
        explanation: "Delhi is the capital of India."
    },
];

let current = 0;
let answers = Array(questions.length).fill(null);
let marked = Array(questions.length).fill(false);

let time = 6 * 60;      // 6 minutes in seconds
let timer;

/* START */
start();

function start() {
    load();
    buildPalette();
    startTimer();
}

function startExam() {
    document.getElementById("homePage").classList.add("hidden");
    document.getElementById("homeFooter").style.display = "none";
    document.getElementById("quizPage").classList.remove("hidden");
    document.querySelector(".bottom-nav").classList.remove("hidden");
    document.getElementById("timerBar").classList.remove("hidden");
    document.getElementById("palette").classList.remove("hidden");

    start(); // existing function
}

/* TOGGLE MENU */
function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("hidden");
}

/* NAV ACTIONS */
function goHome() {
    location.reload();
}

function showAbout() {
    alert("About Us:\nThis is a mock test platform to practice exams.");
}

function showSupport() {
    alert("Support Me:\nYou can support via sharing or donations ❤️");
}

/* LOAD QUESTION */
function load() {
    let q = questions[current];

    document.getElementById("questionNumber").innerText =
        `Q. ${current + 1}/${questions.length}`;

    let html = `<h3>${q.question}</h3>`;

    q.options.forEach((opt, i) => {
        let selected = answers[current] === i ? "selected" : "";
        html += `<div class="option ${selected}" onclick="select(${i})">${opt}</div>`;
    });

    document.getElementById("questionContainer").innerHTML = html;
    updatePalette();
}

/* SELECT */
function select(i) {
    answers[current] = i;
    load();
}

/* NAV */
function nextQuestion() {
    if (current < questions.length - 1) current++;
    load();
}

function prevQuestion() {
    if (current > 0) current--;
    load();
}

/* MARK */
function markRevisit() {
    marked[current] = !marked[current];
    updatePalette();
}

/* PALETTE */
function buildPalette() {
    let p = document.getElementById("palette");
    p.innerHTML = "";

    questions.forEach((_, i) => {
        let div = document.createElement("div");
        div.innerText = i + 1;
        div.onclick = () => {
            current = i;
            load();
        };
        p.appendChild(div);
    });
}

function updatePalette() {
    let boxes = document.querySelectorAll("#palette div");

    boxes.forEach((box, i) => {
        box.className = "box";

        if (marked[i]) box.classList.add("blue");
        else if (answers[i] !== null) box.classList.add("green");
        else box.classList.add("grey");

        if (i === current) box.classList.add("current");
    });
}

/* TIMER */
function startTimer() {
    clearInterval(timer); // ✅ STOP old timer

    timer = setInterval(() => {
        time--;

        let m = Math.floor(time / 60);
        let s = time % 60;

        document.getElementById("timer").innerText =
            `${m}:${s < 10 ? "0" : ""}${s}`;

        if (time < 60) {
            document.getElementById("timer").style.color = "red";
        }

        if (time <= 0) {
            clearInterval(timer); // ✅ stop completely
            autoSubmit();
        }

    }, 1000);
}

/* SUBMIT WITH CONFIRMATION */
function submitQuiz() {
    if (!confirm("Are you sure you want to submit the exam?")) {
        return;
    }
    finishQuiz();
}

/* AUTO SUBMIT (NO CONFIRM) */
function autoSubmit() {
    finishQuiz();
}

/* COMMON RESULT LOGIC */
function finishQuiz() {
    clearInterval(timer);

    document.getElementById("quizPage").classList.add("hidden");
    document.querySelector(".bottom-nav").style.display = "none";
    document.getElementById("resultPage").classList.remove("hidden");
    document.getElementById("palette").style.display = "none";
    document.getElementById("timerBar").style.display = "none";

    let correct = 0, wrong = 0, un = 0;

    answers.forEach((a, i) => {
        if (a === null) un++;
        else if (a === questions[i].answer) correct++;
        else wrong++;
    });

    document.getElementById("scoreText").innerText =
        `Score: ${correct}/${questions.length}`;

    new Chart(document.getElementById("chart"), {
        type: 'pie',
        data: {
            labels: ["Correct", "Wrong", "Unattempted"],
            datasets: [{
                data: [correct, wrong, un]
            }]
        }
    });
}

/* ANSWER KEY */
function showAnswerKey() {
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("answerKeyPage").classList.remove("hidden");
    document.getElementById("palette").style.display = "none";
    document.getElementById("timerBar").style.display = "none";
    document.getElementById("homeFooter").style.display = "flex";

    let container = document.getElementById("answerKey");
    container.innerHTML = "";

    questions.forEach((q, i) => {
        let user = answers[i];

        let status = user === null ? "unattempted" :
            user === q.answer ? "correct" : "wrong";

        let userText = user === null ? "Not Attempted" : q.options[user];

        container.innerHTML += `
            <div class="answer-card">
                <h4>Q${i + 1}: ${q.question}</h4>
                <p>Your: <span class="${status}">${userText}</span></p>
                <p>Correct: <span class="correct">${q.options[q.answer]}</span></p>
                <p>Explanation: ${q.explanation}</p>
            </div>
        `;
    });
}