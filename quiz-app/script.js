
const timerElement = document.getElementById("timer");

let timer;
let timeLeft = 15;const progressFill = document.getElementById("progress-fill");
const startButton = document.getElementById("start-btn");
const progress = document.getElementById("progress");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];

function startQuiz() {

    startButton.style.display = "none";
    questionElement.style.display = "block";
    answerButtons.style.display = "block";
    progress.style.display = "block";
    progressFill.parentElement.style.display = "block";

    currentQuestionIndex = 0;
    score = 0;

    nextButton.innerHTML = "Next";

    quizQuestions = [...questions];

    quizQuestions.sort(() => Math.random() - 0.5);

    quizQuestions = quizQuestions.slice(0, Math.min(10, quizQuestions.length));

    showQuestion();

}

function showQuestion() {

    resetState();

    let currentQuestion = quizQuestions[currentQuestionIndex];
let shuffledAnswers = [...currentQuestion.answers];
let percent =
((currentQuestionIndex) / quizQuestions.length) * 100;

progressFill.style.width = percent + "%";

shuffledAnswers.sort(() => Math.random() - 0.5);
    progress.innerHTML =
`Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    
    questionElement.innerHTML =
        (currentQuestionIndex + 1) + ". " + currentQuestion.question;

   shuffledAnswers.forEach(answer => {

        const button = document.createElement("button");

        button.innerHTML = answer.text;

        button.classList.add("btn");

        if (answer.correct) {
            button.dataset.correct = "true";
        }

        button.addEventListener("click", selectAnswer);

        answerButtons.appendChild(button);

    });
    startTimer();

}

function resetState() {

    nextButton.style.display = "none";

    while (answerButtons.firstChild) {

        answerButtons.removeChild(answerButtons.firstChild);

    }

}

function startTimer() {

    clearInterval(timer);

    timeLeft = 15;

    timerElement.innerHTML = `Time Left: ${timeLeft}s`;

    timer = setInterval(() => {

        timeLeft--;

        timerElement.innerHTML = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {

            clearInterval(timer);

            Array.from(answerButtons.children).forEach(button => {

                if (button.dataset.correct === "true") {

                    button.style.background = "#4CAF50";

                }

                button.disabled = true;

            });

            nextButton.style.display = "block";

            setTimeout(() => {

                handleNextButton();

            }, 2000);

        }

    }, 1000);

}

function selectAnswer(e) {
clearInterval(timer);
    const selectedButton = e.target;

    const isCorrect = selectedButton.dataset.correct === "true";

    if (isCorrect) {

        selectedButton.style.background = "#4CAF50";
        score++;

    } else {

        selectedButton.style.background = "#f44336";

    }

    Array.from(answerButtons.children).forEach(button => {

        if (button.dataset.correct === "true") {

            button.style.background = "#4CAF50";

        }

        button.disabled = true;

    });

    nextButton.style.display = "block";

}

function showScore() {
clearInterval(timer);
timerElement.innerHTML = "";
    resetState();

    progress.innerHTML = "";
progressFill.parentElement.style.display = "none";
    progressFill.style.width = "100%";

    let message = "";

    if (score === quizQuestions.length) {

        message = "🏆 Outstanding! Perfect Score!";

    } else if (score >= 8) {

        message = "🎉 Excellent Work!";

    } else if (score >= 6) {

        message = "👍 Good Job!";

    } else if (score >= 4) {

        message = "📚 Keep Practicing!";

    } else {

        message = "💪 Don't Give Up!";

    }

    let accuracy = Math.round((score / quizQuestions.length) * 100);

    questionElement.innerHTML = `
        <h2>🎉 Quiz Completed!</h2>

        <br>

        <h1>${score} / ${quizQuestions.length}</h1>

        <br>

        <p>${message}</p>

        <br>

        <p>Accuracy : ${accuracy}%</p>
    `;

    nextButton.innerHTML = "Play Again";

    nextButton.style.display = "block";

}
function handleNextButton() {

    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {

        showQuestion();

    } else {

        showScore();

    }

}

nextButton.addEventListener("click", () => {

    if (currentQuestionIndex < quizQuestions.length) {

        handleNextButton();

    } else {

        startQuiz();

    }

});

questionElement.style.display = "none";
answerButtons.style.display = "none";
nextButton.style.display = "none";
progress.style.display = "none";
progressFill.parentElement.style.display = "none";

startButton.addEventListener("click", startQuiz);