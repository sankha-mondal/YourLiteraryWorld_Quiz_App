let questions = [
    {
        question: "Capital of India?",
        options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
        answer: 1
    },
    { 
        question: "2 + 2 = ?", 
        options: ["3", "4", "5", "6"], 
        answer: 1 
    },
    { 
        question: "Largest planet?", 
        options: ["Earth", "Mars", "Jupiter", "Saturn"], 
        answer: 2
    },
    { 
        question: "HTML stands for?", 
        options: ["Hyper Text Markup Language", "HighText", "Home Tool", "None"], 
        answer: 0 
    },
    { 
        question: "CSS is used for?", 
        options: ["Styling", "Database", "Logic", "None"], 
        answer: 0 
    },
    { 
        question: "JS is?", 
        options: ["Programming Language", "Database", "Server", "None"], 
        answer: 0 
    },
    { 
        question: "Sun rises from?", 
        options: ["West", "North", "East", "South"], 
        answer: 2 
    },
    { 
        question: "5 x 5?", 
        options: ["10", "20", "25", "30"], 
        answer: 2 
    },
    { 
        question: "Water formula?", 
        options: ["CO2", "H2O", "O2", "H2"], 
        answer: 1 
    },
    { 
        question: "Fastest animal?", 
        options: ["Tiger", "Cheetah", "Lion", "Dog"], 
        answer: 1 
    }
];

let currentQuestion = 0;
let userAnswers = Array(10).fill(null);
let marked = Array(10).fill(false);
let timeLeft = 6*60;     // 6 minutes in seconds
let timerInterval;

function startQuiz() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    let q = questions[currentQuestion];
    document.getElementById("questionNumber").innerText = `Question ${currentQuestion + 1}/${questions.length}`; // Updated to show current question out of total
    let container = document.getElementById("questionContainer");
    container.innerHTML = `<h3>${q.question}</h3>`;
    q.options.forEach((opt, index) => {
        let div = document.createElement("div");
        div.classList.add("option");
        if (userAnswers[currentQuestion] === index) div.classList.add("selected");
        div.innerText = opt;
        div.onclick = () => selectOption(index);
        container.appendChild(div);
    });
    updateNavigationButtons(); // Update button states after loading question
}

function selectOption(index) {
    userAnswers[currentQuestion] = index;
    loadQuestion();
}

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

function markRevisit() {
    marked[currentQuestion] = true;
}

function showPreview() {
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("previewPage").classList.remove("hidden");

    let overview = document.getElementById("overview");
    overview.innerHTML = "";

    userAnswers.forEach((ans, i) => {
        let div = document.createElement("div");
        if (ans !== null) {
            div.className = "green"; // Attempted
        } else {
            div.className = "grey"; // Unattempted
        }
        div.innerText = `Q${i + 1}`;
        overview.appendChild(div);
    });
}

function startTimer() {
    // Clear any existing timer to avoid multiple intervals
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            document.getElementById("timer").innerText =
                `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        } else {
            clearInterval(timerInterval);
            submitQuiz(); // Automatically submit the quiz when time is up
        }
    }, 1000);
}

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

    new Chart(document.getElementById("resultChart"), {
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

function showAnswerKey() {
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("answerKeyPage").classList.remove("hidden");

    let container = document.getElementById("answerKey");
    container.innerHTML = "";

    questions.forEach((q, i) => {
        let div = document.createElement("div");
        div.innerHTML = `<h4>Q${i + 1}: ${q.question}</h4>
                         <p>Correct Answer: ${q.options[q.answer]}</p>`;
        container.appendChild(div);
    });
}

function updateNavigationButtons() {
    const prevButton = document.querySelector('.buttons button:nth-child(1)'); // Assuming the first button is "Previous"
    const nextButton = document.querySelector('.buttons button:nth-child(3)'); // Assuming the third button is "Next"

    // Disable "Previous" button on the first question
    if (currentQuestion === 0) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    // Disable "Next" button on the last question
    if (currentQuestion === questions.length - 1) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

function backToQuestions() {
    document.getElementById("previewPage").classList.add("hidden");
    document.getElementById("quizPage").classList.remove("hidden");
}