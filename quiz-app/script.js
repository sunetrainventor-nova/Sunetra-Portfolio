const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const clickSound = document.getElementById("clickSound");
const levelSound = document.getElementById("levelSound");

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const timerElement = document.getElementById("timer");
const progressElement = document.getElementById("progress");
const progressFill = document.getElementById("progress-fill");

const levelElement = document.getElementById("level");
const xpElement = document.getElementById("xp");
const coinsElement = document.getElementById("coins");
const livesElement = document.getElementById("lives");
const streakElement = document.getElementById("streak");

const hintButton = document.getElementById("hint-btn");

const resultBox = document.getElementById("result-box");
const restartButton = document.getElementById("restart-btn");

const scoreElement = document.getElementById("score");
const totalElement = document.getElementById("total");
const accuracyElement = document.getElementById("accuracy");
const messageElement = document.getElementById("message");


// GAME DATA

let currentLevel = 1;
let currentQuestionIndex = 0;

let quizQuestions = [];

let score = 0;
let xp = 0;
let coins = 0;

let lives = 3;
let streak = 0;

let timer;
let timeLeft = 15;


// LOAD SAVED DATA

xp = Number(localStorage.getItem("xp")) || 0;
coins = Number(localStorage.getItem("coins")) || 0;
currentLevel = Number(localStorage.getItem("level")) || 1;


updateProfile();



// START QUIZ

function startQuiz(){

    startButton.style.display="none";

    resultBox.style.display="none";

    currentQuestionIndex = 0;

    score = 0;

    lives = 3;

    streak = 0;


    livesElement.innerHTML = lives;
    streakElement.innerHTML = streak;


    quizQuestions = questions.filter(q =>
        q.level === currentLevel
    );


    quizQuestions.sort(()=>Math.random()-0.5);


    showQuestion();

}



// SHOW QUESTION

function showQuestion(){

    resetState();


    let currentQuestion = quizQuestions[currentQuestionIndex];


    progressElement.innerHTML =
    `Level ${currentLevel} - Question ${currentQuestionIndex+1}/${quizQuestions.length}`;


    let progress =
    ((currentQuestionIndex)/quizQuestions.length)*100;


    progressFill.style.width =
    progress+"%";



    questionElement.innerHTML =
    currentQuestion.question;



    let answers =
    [...currentQuestion.answers];


    answers.sort(()=>Math.random()-0.5);



    answers.forEach(answer=>{


        let button =
        document.createElement("button");


        button.innerHTML =
        answer.text;


        button.classList.add("btn");


        if(answer.correct){

            button.dataset.correct="true";

        }


        button.onclick =
        selectAnswer;


        answerButtons.appendChild(button);


    });


    startTimer();

}



// RESET

function resetState(){

    nextButton.style.display="none";


    while(answerButtons.firstChild){

        answerButtons.removeChild(
            answerButtons.firstChild
        );

    }

}



// TIMER

function startTimer(){

    clearInterval(timer);


    timeLeft = 15;


    timerElement.innerHTML =
    `⏳ ${timeLeft}s`;



    timer=setInterval(()=>{


        timeLeft--;


        timerElement.innerHTML =
        `⏳ ${timeLeft}s`;



        if(timeLeft<=0){

            clearInterval(timer);

            revealAnswer();

            nextButton.style.display="block";

        }


    },1000);

}



// ANSWER SELECT

function selectAnswer(e){


    clearInterval(timer);


    let selected =
    e.target;


    let correct =
    selected.dataset.correct==="true";



    if(correct){

        selected.style.background="#22c55e";

        correctSound.play();

        score++;

        xp+=10;

        coins+=5;

        streak++;


    }else{


        selected.style.background="#ef4444";

 wrongSound.play();

        lives--;

        streak=0;


    }



    livesElement.innerHTML=lives;

    streakElement.innerHTML=streak;


    updateProfile();


    disableButtons();


    nextButton.style.display="block";


}


// DISABLE BUTTONS

function disableButtons(){

    Array.from(answerButtons.children)
    .forEach(button=>{

        if(button.dataset.correct==="true"){

            button.style.background="#22c55e";

        }

        button.disabled=true;

    });

}



// SHOW CORRECT ANSWER

function revealAnswer(){

    Array.from(answerButtons.children)
    .forEach(button=>{

        if(button.dataset.correct==="true"){

            button.style.background="#22c55e";

        }

        button.disabled=true;

    });

}



// NEXT BUTTON

nextButton.onclick=function(){


    currentQuestionIndex++;


    if(currentQuestionIndex < quizQuestions.length){


        showQuestion();


    }else{


        finishQuiz();


    }


};




// HINT SYSTEM

hintButton.onclick=function(){


    let wrongAnswers =
    Array.from(answerButtons.children)
    .filter(button=>
        button.dataset.correct!=="true"
    );


    if(coins>=10 && wrongAnswers.length>1){


        coins-=10;


        wrongAnswers[0].style.display="none";


        updateProfile();


    }else{


        alert("Need 10 coins for hint 🪙");


    }


};




// FINISH QUIZ

function finishQuiz(){


    clearInterval(timer);


    questionElement.style.display="none";

    answerButtons.style.display="none";

    nextButton.style.display="none";



    resultBox.style.display="block";



    scoreElement.innerHTML=score;


    totalElement.innerHTML=
    quizQuestions.length;



    let accuracy =
    Math.round(
        (score/quizQuestions.length)*100
    );


    accuracyElement.innerHTML=
    accuracy;



    if(score>=15){

        messageElement.innerHTML=
        "🏆 Amazing! Level Completed";

        unlockLevel();

    }
    else if(score>=10){

        messageElement.innerHTML=
        "🔥 Great Performance";

    }
    else{

        messageElement.innerHTML=
        "💪 Keep Practicing";

    }



    saveData();

}




// UNLOCK NEXT LEVEL

function unlockLevel(){


    if(currentLevel<4){

        currentLevel++;

       levelSound.play();

alert(
"🎉 New Level Unlocked!"
);

    }


}



// RESTART

restartButton.onclick=function(){


    questionElement.style.display="block";

    answerButtons.style.display="block";


    resultBox.style.display="none";


    startQuiz();


};




// PROFILE UPDATE

function updateProfile(){


    levelElement.innerHTML=
    currentLevel;


    xpElement.innerHTML=
    xp;


    coinsElement.innerHTML=
    coins;


}




// SAVE GAME DATA

function saveData(){


    localStorage.setItem(
        "xp",
        xp
    );


    localStorage.setItem(
        "coins",
        coins
    );


    localStorage.setItem(
        "level",
        currentLevel
    );


}





// START BUTTON

startButton.onclick=function(){

    clickSound.play();

    startQuiz();

};




// INITIAL SETTINGS

questionElement.style.display="block";

answerButtons.style.display="block";

resultBox.style.display="none";